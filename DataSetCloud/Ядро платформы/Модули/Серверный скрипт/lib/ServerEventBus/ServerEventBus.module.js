define('js!SBIS3.CORE.ServerEventBus', [
   'js!SBIS3.CORE.ServerEventBus/resources/reconnect',
   'js!SBIS3.CORE.ServerEventBus/resources/lockableStorage',
   'is!browser?//cdn.sbis.ru/stomp/17-12-2014/stomp-full.js'
], function(ReconnectingSockJS, LockableStorage, Stomp){

   /**
    * @typedef {Object} ChannelInfo
    * @property {String} hashedNames[]
    * @property {Object} receipts
    * @property {Object} channels
    * @property {$ws.proto.Deferred} dHashes
    * @property {$ws.proto.Deferred} dSubscriptionDone
    *
    * @typedef {Object} Stomp
    * @property {Object} heartbeat
    * @property {Function} over
    * @property {Function} connect
    * @property {Function} subscribe
    *
    * @typedef {Object} ClientInfo
    * @property {Boolean} connected
    * @property {Stomp} client
    * @property {ChannelInfo} channels[]
    *
    * @typedef {Object} ServerChannelOptions
    * @property {String} channel Имя канала
    * @property {String} [host=CURRENT_HOST] Хост для подключения
    * @property {String} [vhost='/']
    * @property {String} [scheme=CURRENT_SCHEME] Способ подключения (http/https)
    * @property {String} [dir='/stomp/'] Путь до Stomp
    */

   var
   // таймауты на реконнект
      RECONNECT_INTERVAL = 1000,
   // таймаут на ожидание
      TIMEOUT_INTERVAL = 60000,
   // проверяем живость сервиса каждую минуту
      STOMP_HEARTBEAT_OUT = 60000,
   // не проверяем ответы
      STOMP_HEARTBEAT_IN = 0,
      LOGIN = 'cloud_service',
      PASSWORD = 'cloud_service',
      PREFIX = 'shared-bus',
      LOCK_PREFIX = PREFIX + '-lock-',
      ID = $ws.helpers.randomId(),
      KEY_ACK = [ PREFIX, 'ack', ID ].join('-'),
      KEY_MASTER = [ PREFIX, 'master' ].join('-'),
      KEY_DEBUG = [ PREFIX, 'debug' ].join('-'),
      KEY_OUR_QUEUE = [ PREFIX, 'queue', ID].join('-'),
      KEY_MASTER_READY = [ PREFIX, 'master-ready' ].join('-'),
      LOCK_QUEUE_KEY = LOCK_PREFIX + 'queue-exchange',
      LOCK_MASTER_KEY = LOCK_PREFIX + 'master-election',
      MAX_LOCK_TIME = 10000,
      ACK_INTERVAL = 250,
      ACK_HEARTBEAT_INTERVAL = 10000,
      EMPTY_ARRAY_STRING = JSON.stringify([]),
      ackMatch = new RegExp('^' + PREFIX + '-ack-(.+)$'),
      queueMatch = new RegExp('^' + PREFIX + '-queue-'),
      roleChangeChannel = new $ws.proto.EventBusChannel(),
      indic = [ '|', '/', '-', '\\' ],
      pos = 0,
      msgPassed = 0,
      state,
      isMaster = undefined;

   roleChangeChannel.setEventQueueSize(1);

   function isDebug() {
      if (arguments.length) {
         localStorage.setItem(KEY_DEBUG, ReconnectingSockJS.debugAll = !!arguments[0]);
      } else {
         return localStorage.getItem(KEY_DEBUG) === 'true';
      }
   }

   if (typeof window !== 'undefined') {
      window.sharedBusDebug = isDebug;
      ReconnectingSockJS.debugAll = isDebug();
   }

   function debug() {
      if (isDebug() && console) {
         console.log($ws.helpers.reduce(arguments, function(str, item){
            return str + item;
         }, ''));
      }
   }

   function debugMyState(isMaster) {
      debug('Changing state to ' + isMaster);
      titleDebug();
   }

   function titleDebug() {
      if (isDebug()) {
         var stateLog = isMaster && state && new Array(state + 1).join('|') || '+';
         document.title = ID.substr(0, 10) + ' ' + (isMaster ? stateLog : '-') + ' ' + msgPassed + ' ' + indic[pos++ % indic.length];
      }
   }

   function gotMasterID(masterID) {
      var isMeMaster = masterID == ID;
      // Наш статус изменился
      if (isMeMaster !== isMaster) {
         // Нас выбрали мастером. Создадим контроллер
         isMaster = isMeMaster;
         debugMyState(isMaster);
         roleChangeChannel.notify('onRoleChange', isMaster);
      }
      return isMaster;
   }

   function cleanupKeys(neighbours, keysMatch, keyToId) {
      $ws.helpers.forEach(getKeys(keysMatch), function(_, electionsId) {
         var nID = keyToId(electionsId);
         if (nID !== ID) {
            if (!(nID in neighbours)) {
               localStorage.removeItem(electionsId);
            }
         }
      });
   }

   // Здесь проводится запись информации о себе и вычищение устаревших ключей
   (function lookAround() {

      titleDebug();

      // Расскажем о сбее соседям
      localStorage.setItem(KEY_ACK, +new Date());

      var neighbours = $ws.helpers.reduce(getKeys(ackMatch), function(neighbours, ackTime, key) {
         var nID = key.replace([ PREFIX, 'ack', ''].join('-'), '');
         // Себя не заносим в список соседей
         if (nID !== ID) {
            if (+new Date() - ackTime < ACK_HEARTBEAT_INTERVAL) {
               // сосед живой
               neighbours[nID] = 1;
            } else {
               // сосед помер
               localStorage.removeItem(key);
            }
         }
         return neighbours;
      }, {});

      // Удалим все очереди, которых остались от неожиданно умерщих соседей
      cleanupKeys(neighbours, queueMatch, function(queueId){
         return queueId.replace([ PREFIX, 'queue', ''].join('-'), '');
      });

      checkMaster(function(){
         setTimeout(lookAround, ACK_INTERVAL);
      });

   })();


   // Здесь проверяется есть ли мастер и если нет, осуществляется попытка им стать
   function checkMaster(done) {
      var master, masterAck;

      master = localStorage.getItem(KEY_MASTER);
      masterAck = localStorage.getItem([PREFIX, 'ack', master].join('-'));

      if (master && (!masterAck || +new Date() - masterAck > ACK_HEARTBEAT_INTERVAL)) {
         debug('Current master is considered dead. Key: ', master, ' Last ACK ', masterAck, ' Delta ', +new Date() - masterAck);
         // Мастер объявлен, но от него нет ACK или он слишком старый
         localStorage.removeItem(KEY_MASTER);
         master = null;
      }

      if (!master) {
         debug('No master declared. Trying to become master');
         LockableStorage.lock(LOCK_MASTER_KEY, function(){
            debug('Got lock');
            var master = localStorage.getItem(KEY_MASTER);
            if (!master) {
               debug('Declaring myself master');
               localStorage.setItem(KEY_MASTER, master = ID);
            } else {
               debug('Somebody becomes master... So sad...');
            }
            debug('The master is ', master, ' me is ', ID);
            gotMasterID(master);
            done();
         }, MAX_LOCK_TIME);

      } else {
         gotMasterID(master);
         done();
      }
   }

   function getKeys(re) {
      var
         rv = {},
         l = localStorage.length,
         i, key;

      for(i = 0; i < l; i++) {
         key = localStorage.key(i);
         if (re.test(key)) {
            rv[key] = localStorage.getItem(key);
         }
      }

      return rv;
   }

   /**
    * Общая функция завершения работы
    */
   function shutdown() {
      localStorage.removeItem(KEY_ACK);
      localStorage.removeItem(KEY_OUR_QUEUE);
      if (isMaster) {
         localStorage.removeItem(KEY_MASTER);
         localStorage.removeItem(KEY_MASTER_READY);
      }
   }

   if (window.addEventListener) {
      window.addEventListener('beforeunload', shutdown);
   } else {
      window.attachEvent('onbeforeunload', shutdown);
   }

   var protocols = ['xhr-polling', 'iframe-xhr-polling'],
      dHashes;

   function getSubscriptionHashes() {
      if (!dHashes) {
         dHashes = $ws.single.ioc.resolve('ITransport', {
            url: '/!hash/',
            method: 'GET',
            dataType: 'json'
         }).execute().addCallback(function(response){
            return response.result;
         });
      }
      return dHashes;
   }

   if (typeof window !== 'undefined' && window.WebSocket) {
      protocols.unshift('websocket');
   }

   //<editor-fold desc="Receiver">
   /**
    * @class Receiver
    * @constructor
    */
   function Receiver() {
      this._channel = $ws.single.EventBus.channel();
      this._dReady = new $ws.proto.Deferred();

      this._dReady.addCallback(function(){
         this._channel.notify('onReady');
      }.bind(this));

      this._channel.setEventQueueSize('onReady', 1);
      this._destroyed = false;
   }

   Receiver.prototype.ready = function() {
      if (!this._dReady.isReady()) {
         this._dReady.callback();
      }
   };

   Receiver.prototype.frame = function(frame) {
      msgPassed++;
      titleDebug();
      this._channel.notify('onFrame', frame);
   };

   Receiver.prototype.subscribe = function(event, handler, ctx) {
      this._channel.subscribe(event, handler, ctx);
   };

   Receiver.prototype.once = function(event, handler, ctx) {
      this._channel.once(event, handler, ctx);
   };

   Receiver.prototype.destroy = function() {
      this._channel.destroy();
      this._dReady = null;
      this._destroyed = true;
   };
   //</editor-fold>

   //<editor-fold desc="StompReceiver">
   /**
    * @class StompReceiver
    * @extends Receiver
    * @constructor
    */
   function StompReceiver() {
      Receiver.call(this);

      localStorage.removeItem(KEY_MASTER_READY);

      var
         vhost = '/',
         host = window.location.host,
         scheme = window.location.protocol,
         dir = '/stomp/',
         stompUrl = (scheme.indexOf(':') == -1 ? scheme + ':' : scheme) + '//' + host + dir,
         self = this,
         dSubHashes = getSubscriptionHashes(),
         ws, client;

      // Костыль для удаления лидирующего "admin-" из имени exchange
      host = host.match(/^(?:admin-)?([\S\s]*)$/)[1];

      state = 1;
      ws = new ReconnectingSockJS(stompUrl, protocols);
      ws.reconnectInterval = RECONNECT_INTERVAL;
      ws.timeoutInterval = TIMEOUT_INTERVAL;

      state = 2;
      this._client = client = Stomp.over(ws);
      client.heartbeat.outgoing = STOMP_HEARTBEAT_OUT;
      client.heartbeat.incoming = STOMP_HEARTBEAT_IN;

      state = 3;
      client.connect(LOGIN, PASSWORD, function(){
         state = 4;
         dSubHashes.addCallback(function(hashes){
            state = 5;
            var hash = hashes.user;

            client.onreceipt = function(frame) {
               var receiptID = frame.headers['receipt-id'];
               state = 6;
               if (receiptID == hash) {
                  state = 7;
                  self.ready();
               }
            };

            client.subscribe(
               '/exchange/' + host + ':' + hash,
               self.frame.bind(self), {
                  receipt: hash
               }
            );
            return hashes;
         });
      }, function(){}, vhost);
   }

   $ws.core.classicExtend(StompReceiver, Receiver);

   StompReceiver.prototype.destroy = function() {
      this._client.disconnect();
      this._client = null;
      localStorage.removeItem(KEY_MASTER);
      localStorage.removeItem(KEY_MASTER_READY);
      StompReceiver.superclass.destroy.apply(this, arguments);
   };

   StompReceiver.prototype.ready = function() {
      localStorage.setItem(KEY_MASTER_READY, ID);
      StompReceiver.superclass.ready.apply(this, arguments);
   };

   //</editor-fold>

   //<editor-fold desc="LocalStorageReceiver">
   /**
    * @class LocalStorageReceiver
    * @extends Receiver
    * @constructor
    */
   function LocalStorageReceiver() {
      Receiver.call(this);

      var self = this;

      state = 0;

      function initEmptyQueue() {
         localStorage.setItem(KEY_OUR_QUEUE, EMPTY_ARRAY_STRING);
      }

      function checkMasterReady() {
         var
            masterId = localStorage.getItem(KEY_MASTER),
            masterReady = localStorage.getItem(KEY_MASTER_READY);

         if (masterReady && masterReady == masterId) {
            self.ready();
         }
      }

      initEmptyQueue();
      checkMasterReady();

      (function checkQueue(){

         LockableStorage.lock(LOCK_QUEUE_KEY, function(){
            if (!self._destroyed) {
               var ourQueue = JSON.parse(localStorage.getItem(KEY_OUR_QUEUE)), event;
               while(ourQueue && (event = ourQueue.pop())) {
                  if (event.type == 'frame') {
                     self.frame(event.data);
                  } else if (event.type == 'ready') {
                     self.ready();
                  }
               }
               initEmptyQueue();
               checkMasterReady();
               self._interval = setTimeout(checkQueue, 550);
            }
         }, MAX_LOCK_TIME);

      })();
   }

   $ws.core.classicExtend(LocalStorageReceiver, Receiver);

   LocalStorageReceiver.prototype.destroy = function() {
      clearTimeout(this._interval);
      localStorage.removeItem(KEY_OUR_QUEUE);
      LocalStorageReceiver.superclass.destroy.apply(this, arguments);
   };
   //</editor-fold>

   //<editor-fold desc="Dispatcher">
   function Dispatcher() {
      this._channels = {};
      this._receiver = null;
      this._dReady = new $ws.proto.Deferred();
      this._interval = -1;

      roleChangeChannel.subscribe('onRoleChange', function(event, isMaster){

         var
            receiver, checkQueue,
            queue = [],
            dup = this._createDuplicator(queue);

         checkQueue = function() {
            var self = this;

            if (queue.length) {
               LockableStorage.lock(LOCK_QUEUE_KEY, function() {
                  $ws.helpers.forEach(getKeys(queueMatch), function(serializedQueue, queueId) {
                     var clientQueue = JSON.parse(serializedQueue);
                     Array.prototype.unshift.apply(clientQueue, queue);
                     localStorage.setItem(queueId, JSON.stringify(clientQueue));
                  });
                  queue.length = 0;
                  self._interval = setTimeout(checkQueue, 500);
               }, MAX_LOCK_TIME);
            } else {
               this._interval = setTimeout(checkQueue, 500);
            }
         }.bind(this);

         if (isMaster) {
            receiver = new StompReceiver();
            receiver.subscribe('onFrame', dup);
            receiver.once('onReady', dup);
            checkQueue();
         } else {
            // FIXME а что если на момент смены ресивера в очереди еще будут пакеты?
            clearTimeout(this._interval);
            receiver = new LocalStorageReceiver();
         }

         this._setReceiver(receiver);

      }, this);
   }

   Dispatcher.prototype._createDuplicator = function (queue) {
      return function(event, frame) {
         if (event._eventName == 'onFrame') {
            queue.unshift({
               type: 'frame',
               data: frame
            });
         } else if (event._eventName == 'onReady') {
            queue.unshift({
               type: 'ready'
            });
         }
      }
   };

   Dispatcher.prototype._setReceiver = function(receiver) {

      if (this._receiver) {
         this._receiver.destroy();
      }

      this._receiver = receiver;

      receiver.subscribe('onFrame', function(e, frame){
         var eventName = frame.headers && frame.headers['event-type'], body;
         if (eventName) {
            if (eventName in this._channels) {
               body = JSON.parse(frame.body);
               this._channels[eventName].notify('onMessage', body, frame);
            }
         }
      }, this);

      receiver.once('onReady', function() {
         if (!this._dReady.isReady()) {
            this._dReady.callback();
         }
      }, this)
   };

   Dispatcher.prototype.channel = function(eventName) {

      var channel;

      if (! (eventName in this._channels)) {
         channel = this._channels[eventName] = $ws.single.EventBus.channel();
         channel.setEventQueueSize('onReady', 1);
      } else {
         channel = this._channels[eventName];
      }

      this._dReady.addCallback(function(){
         channel.notify('onReady');
      });

      return channel;
   };

   Dispatcher.prototype.destroy = function() {
      if (this._receiver) {
         this._receiver.destroy();
      }
      $ws.helpers.forEach(this._channels, function(chnl) {
         chnl.destroy();
      });
      this._channels = null;
      this._receiver = null;
   };

   /**
    *
    * @returns {Dispatcher}
    */
   Dispatcher.getInstance = function() {
      if (!this._instance) {
         this._instance = new Dispatcher();
      }
      return this._instance;
   };
   //</editor-fold>

   /**
    * @param {String} channelName Имя канала
    * @returns {$ws.proto.EventBusChannel}
    */
   $ws.single.EventBus.serverChannel = function(channelName) {
      channelName = channelName.toLocaleLowerCase();
      return Dispatcher.getInstance().channel(channelName);
   };

   return $ws.single.EventBus;

});