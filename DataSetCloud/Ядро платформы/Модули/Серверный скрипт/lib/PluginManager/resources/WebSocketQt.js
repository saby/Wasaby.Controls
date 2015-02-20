define("js!SBIS3.CORE.PluginManager/resources/WebSocketQt", [], function() {

   "use strict";

   var logger = {
      log: $ws.single.ioc.resolve('ILogger').log.bind($ws.single.ioc.resolve('ILogger'), 'TensorWebSocket'),
      error: $ws.single.ioc.resolve('ILogger').error.bind($ws.single.ioc.resolve('ILogger'), 'TensorWebSocket'),
      info: $ws.single.ioc.resolve('ILogger').info.bind($ws.single.ioc.resolve('ILogger'), 'TensorWebSocket')
   };

   var initialized = false,
       qt = null,
       instances = {},
       tasks = [],
       nextId = 0;

   /**
    * Our own implementation of WebSocket class using Flash.
    * @param {string} url
    */
   var TensorWebSocket = function(url) {
      var self = this;
      self.__id = nextId++;
      instances[self.__id] = self;
      self.readyState = TensorWebSocket.CONNECTING;
      self.__events = {};
      self.__createTask = setTimeout(function() {
         addTask(function() {
            self.__createTask = null;
            qt.create(self.__id, url, location.href);
         });
      }, 0);
   };

   TensorWebSocket.prototype.getId = function() {
      return this.__id;
   };

   /**
    * Send data to the web socket.
    * @param {string} data  The data to send to the socket.
    * @return {boolean}  True for success, false for failure.
    */
   TensorWebSocket.prototype.send = function(data) {
      if (this.readyState == TensorWebSocket.CONNECTING) {
         logger.error("INVALID_STATE_ERR: Web Socket connection has not been established");
         return false;
      }
      return qt.send(this.__id, data) < 0;
   };

   /**
    * Close this web socket gracefully.
    */
   TensorWebSocket.prototype.close = function() {
      if (this.__createTask) {
         clearTimeout(this.__createTask);
         this.__createTask = null;
         this.readyState = TensorWebSocket.CLOSED;
         return;
      }
      if (this.readyState == TensorWebSocket.CLOSED || this.readyState == TensorWebSocket.CLOSING) {
         return;
      }
      this.readyState = TensorWebSocket.CLOSING;
      qt.close(this.__id);
   };

   /**
    * @param {string} type
    * @param {function} listener
    * @return void
    */
   TensorWebSocket.prototype.addEventListener = function(type, listener) {
      if (!(type in this.__events)) {
         this.__events[type] = [];
      }
      this.__events[type].push(listener);
   };

   /**
    * @param {string} type
    * @param {function} listener
    * @return void
    */
   TensorWebSocket.prototype.removeEventListener = function(type, listener) {
      if (!(type in this.__events)) return;
      var events = this.__events[type];
      for (var i = events.length - 1; i >= 0; --i) {
         if (events[i] === listener) {
            events.splice(i, 1);
            break;
         }
      }
   };

   /**
    * @param {Event} event
    * @return void
    */
   TensorWebSocket.prototype.dispatchEvent = function(event) {
      var events = this.__events[event.type] || [];
      for (var i = 0; i < events.length; ++i) {
         events[i](event);
      }
      var handler = this["on" + event.type];
      if (handler) handler.apply(this, [event]);
   };

   /**
    * Define the TensorWebSocket readyState enumeration.
    */
   TensorWebSocket.CONNECTING = 0;
   TensorWebSocket.OPEN = 1;
   TensorWebSocket.CLOSING = 2;
   TensorWebSocket.CLOSED = 3;

   TensorWebSocket.__isQtImplementation = true;

   TensorWebSocket.initialize = function(callbackFn) {
      initialize(callbackFn);
   };

   function initialize(callbackFn) {
      var callbackObj = {success: false, id: 'webSocketQt', ref: undefined};

      if (initialized) {
         // На странице уже запущен плагин, второй раз не надо
         // Кидаемся ошибкой, если не нашли элемент
         callbackObj.ref = document.getElementById(callbackObj.id);
         callbackObj.success = callbackObj.ref ? true : false;
         callbackFn(callbackObj);
         return;
      }

      var container = document.createElement("div"),
          innerHtml = '',
          returnFalse = function(blocked) {
             //container.parentNode.removeChild(container);
             callbackObj.success = false;
             callbackObj.blocked = blocked;
             callbackFn(callbackObj);
          };

      $(container).css({ width: '1px', height: '1px', position: 'absolute', top: '-100px', left: '-100px' });

      if ($ws._const.browser.isIE) {
         innerHtml = '<object id="'+callbackObj.id+'" classid="CLSID:AD7BA4D6-DE06-4D5D-BA2B-E1FD7BEE1E8F" width="0" height="0"></object>';
      } else {
         innerHtml = '<object id="'+callbackObj.id+'" type="application/x-sbis-websockets" width="0" height="0"></object>';
      }

      $('html').get(0).appendChild(container);
      container.id = "webSocketContainer";
      container.innerHTML = innerHtml;

      if ($ws._const.browser.isIE) {
         try {
            new ActiveXObject('npSbisPluginClient.SbisPluginClient');
         } catch (e) {
            return returnFalse();
         }
      } else {
         var mimeType = 'application/x-sbis-websockets';
         navigator.plugins.refresh();
         if (!(navigator.mimeTypes[mimeType] && navigator.mimeTypes[mimeType].enabledPlugin)) {
            return returnFalse();
         }
      }

      // We need to set a timeout here to avoid round-trip calls to plugin during the initialization process.
      setTimeout(function() {
         callbackObj.ref = document.getElementById(callbackObj.id);
         // Проверим, не блокирует ли кто наш плагин
         if (!$ws._const.browser.isIE && !callbackObj.ref.create) {
            return returnFalse(true);
         }

         initialized = true;
         qt = callbackObj.ref;

         if (qt.version && qt.version >= '1.0.0.5') {
            startListen();
         } else {
            return returnFalse();
         }

         for (var i = 0; i < tasks.length; ++i) {
            tasks[i]();
         }
         tasks = [];

         callbackObj.success = true;
         callbackFn(callbackObj);
      }, 0);
   }

   function stateChanged(webSocketId, state) {
      var self = instances[webSocketId];
      switch(state)
      {
         case "HostLookup":
         case "Connecting":
            self.readyState = TensorWebSocket.CONNECTING;
            break;
         case "Connected":
            self.readyState = TensorWebSocket.OPEN;
            break;
         case "Closing":
            self.readyState = TensorWebSocket.CLOSING;
            break;
         case "Unconnected":
            self.readyState = TensorWebSocket.CLOSED;
            break;
      }
   }

   function connected(webSocketId) {
      instances[webSocketId].dispatchEvent(createSimpleEvent('open'));
   }

   function disconnected(webSocketId) {
      instances[webSocketId].dispatchEvent(createSimpleEvent('close'));
   }

   function message(webSocketId, message) {
      // ТАДАДАДАДАДА. Клеются пакеты, клеются пакеты, парам парам пам
      // Надо как то понять, где закончился один JSON объект и начался второй
      // Люди советую считать скобки, но это трындец
      var msg = [];

      (function recursive(str) {
         var index = str.indexOf('}{');
         if (index > -1) {
            msg.push(str.substring(0, index + 1));
            recursive(str.substring(index + 1, str.length));
         } else {
            msg.push(str);
         }
      })(message);

      $ws.helpers.forEach(msg, function(message) {
         instances[webSocketId].dispatchEvent(createMessageEvent('message', message));
      });
   }

   function error(webSocketId, errorString) {
      instances[webSocketId].dispatchEvent(createErrorEvent('error', errorString));
   }

   function createSimpleEvent(type) {
      if (document.createEvent && window.Event) {
         var event = document.createEvent("Event");
         event.initEvent(type, false, false);
         return event;
      } else {
         return {type: type, bubbles: false, cancelable: false};
      }
   }

   function createMessageEvent(type, data) {
      if (document.createEvent && window.MessageEvent && !window.opera) {
         var event = document.createEvent("MessageEvent");
         if (event.initMessageEvent) {
            event.initMessageEvent(type, false, false, data, null, null, window, null);
         } else {
            event = new MessageEvent(type, { bubbles: false, cancelable: false, data: data, source: window });
         }

         return event;
      } else {
         // IE and Opera 12, the latter one truncates the data parameter after any 0x00 bytes.
         return {type: type, data: data, bubbles: false, cancelable: false};
      }
   }

   function createErrorEvent(type, errorString) {
      if (document.createEvent && window.ErrorEvent && !window.opera) {
         var event = document.createEvent("ErrorEvent");
         if (event.initErrorEvent) {
            event.initErrorEvent(type, false, false, errorString, null, null);
         } else {
            event = new ErrorEvent(type, {bubbles: false, cancelable: false, message: errorString});
         }

         return event;
      } else {
         // IE and Opera 12, the latter one truncates the data parameter after any 0x00 bytes.
         return {type: type, message: errorString, bubbles: false, cancelable: false};
      }
   }

   function addTask(task) {
      if (qt) {
         task();
      } else {
         tasks.push(task);
      }
   }

   function startListen() {
      setInterval(function() {
         var events = qt && ($ws._const.browser.isIE || qt.readEvents) && qt.readEvents();
         try {
            if (events && typeof(events) === 'string') {
               events = JSON.parse(events);
               if (Array.isArray(events)) {
                  $ws.helpers.forEach(events, function(obj) {
                     try {
                        obj = JSON.parse(obj);
                        switch(obj.type) {
                           case 'open':
                              connected(obj.target);
                              break;
                           case 'close':
                              disconnected(obj.target);
                              break;
                           case 'state':
                              stateChanged(obj.target, obj.event);
                              break;
                           case 'error':
                              error(obj.target, obj.event);
                              break;
                           case 'message':
                              message(obj.target, obj.event);
                              break;
                        }
                     } catch (e) {
                        logger.error(e);
                     }
                  });
               }
            }
         } catch (e) {
            logger.error(e);
         }
      }, 200);
   }

   return TensorWebSocket;
});
