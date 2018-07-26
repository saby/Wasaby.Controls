define('SBIS3.CONTROLS/LongOperations/Tools/TabCalls',
   [
      'Core/core-extend',
      'Core/Deferred',
      'Lib/Tab/Message',
      'WS.Data/Source/DataSet',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Chain'
   ],

   function (CoreExtend, Deferred, TabMessage, DataSet, RecordSet, Chain) {
      'use strict';

      /**
       * Класс межвкладочных вызовов методов
       *
       * @class SBIS3.CONTROLS/LongOperations/Tools/TabCalls
       * @author Спирин В.А.
       * @public
       */
      var LongOperationsTabCalls = CoreExtend.extend(/** @lends SBIS3.CONTROLS/LongOperations/Tools/TabCalls.prototype */{
         _moduleName: 'SBIS3.CONTROLS/LongOperations/Tools/TabCalls',

         /**
          * Конструктор
          * @public
          * @param {string} tabKey Ключ текущей вкладки
          * @param {function} router Функция для получения объектов вызова по имени
          * @param {function} [packer] Функция для упаковки отправляемых объектов (опционально)
          * @param {Lib/Tab/Message} [channel] Канал событий (опционально)
          */
         constructor: function (tabKey, router, packer, channel) {
            if (!tabKey || typeof tabKey !== 'string') {
               throw new TypeError('Argument "tabKey" must be a string');
            }
            if (typeof router !== 'function') {
               throw new TypeError('Argument "router" must be a function');
            }
            if (packer && typeof packer !== 'function') {
               throw new TypeError('Argument "packer" must be a function');
            }
            if (channel && !(channel instanceof TabMessage)) {
               throw new TypeError('Argument "channel" must be a TabMessage');
            }
            /**
             * @protected
             * @type {string}
             */
            this._tabKey = tabKey;
            /**
             * @protected
             * @type {function}
             */
            this._router = router;
            /**
             * @protected
             * @type {function}
             */
            this._packer = packer || null;
            /**
             * @protected
             * @type {Lib/Tab/Message}
             */
            this._channel = channel ? channel : new TabMessage();
            /**
             * @protected
             * @type {object[]}
             */
            this._list = [];
            /**
             * @protected
             * @type {boolean}
             */
            this._isDestroyed = false;

            // И подписаться на события во вкладках
            this._channel.subscribe('LongOperations:TabCalls:onCall', this._onCall_b = this.onCall.bind(this));
            this._channel.subscribe('LongOperations:TabCalls:onResult', this._onResult_b = this.onResult.bind(this));
         },

         /**
          * Ликвидировать экземпляр класса
          * @public
          */
         destroy: function () {
            if (!this._isDestroyed) {
               this._isDestroyed = true;
               this._channel.unsubscribe('LongOperations:TabCalls:onCall', this._onCall_b);
               this._channel.unsubscribe('LongOperations:TabCalls:onResult', this._onResult_b);
               this._tabKey = null;
               this._router = null;
               this._packer = null;
               this._channel = null;
               this._list = null;
            }
         },

         /**
          * Запросить выполнение одного метода у нескольких целевых объектов в нескольких вкладках. Возвращает массив обещаний результатов
          * @public
          * @param {object} targets Списки по вкладкам имён целевых объектов (владельцев метода)
          * @param {string} method Имя вызываемого метода
          * @param {any[]} [args] Массив аргументов вызова (опционально)
          * @param {function} [resultClass] Класс ожидаемого результата (опционально)
          * @return {Core/Deferred<any>[]}
          */
         callBatch: function (targets, method, args, resultClass) {
            if (!targets || typeof targets !== 'object') {
               throw new TypeError('Argument "targets" must be an object');
            }
            if (!method || typeof method !== 'string') {
               throw new TypeError('Argument "method" must be a string');
            }
            if (args && !Array.isArray(args)) {
               throw new TypeError('Argument "args" must be an array');
            }
            if (resultClass && typeof resultClass !== 'function') {
               throw new TypeError('Argument "resultClass" must be a constructor');
            }
            var calls = [];
            var promises = [];
            for (var tabKey in targets) {
               if (!tabKey) {
                  throw new TypeError('Argument "targets" must have none empty keys');
               }
               for (var i = 0, list = targets[tabKey]; i < list.length; i++) {
                  var call = {tab:tabKey, target:list[i], method:method, args:args, resultClass:resultClass, promise:new Deferred()};
                  calls.push(call);
                  promises.push(call.promise);
               }
            }
            if (calls.length) {
               this._list.push.apply(this._list, calls);
               this._channel.notify('LongOperations:TabCalls:onCall', {from:this._tabKey, targets:targets, method:method, args:_pack(args)});
            }
            return promises;
         },

         /**
          * Запросить выполнение метода у целевого объекта во вкладке. Возвращает обещание результата
          * @public
          * @param {string} tabKey Ключ вкладки
          * @param {string} target Имя целевого объекта (владельца метода)
          * @param {string} method Имя вызываемого метода
          * @param {any[]} [args] Массив аргументов вызова (опционально)
          * @param {function} [resultClass] Класс ожидаемого результата (опционально)
          * @return {Core/Deferred<any>}
          */
         call: function (tabKey, target, method, args, resultClass) {
            if (!tabKey || typeof tabKey !== 'string') {
               throw new TypeError('Argument "tabKey" must be a string');
            }
            if (!target || typeof target !== 'string') {
               throw new TypeError('Argument "target" must be a string');
            }
            if (!method || typeof method !== 'string') {
               throw new TypeError('Argument "method" must be a string');
            }
            if (args && !Array.isArray(args)) {
               throw new TypeError('Argument "args" must be an array');
            }
            if (resultClass && typeof resultClass !== 'function') {
               throw new TypeError('Argument "resultClass" must be a constructor');
            }
            var call = {tab:tabKey, target:target, method:method, args:args, resultClass:resultClass, promise:new Deferred()};
            this._list.push(call);
            var targets = {};
            targets[tabKey] = [target];
            this._channel.notify('LongOperations:TabCalls:onCall', {from:this._tabKey, targets:targets, method:method, args:_pack(args)});
            return call.promise;
         },

         /**
          * Слушатель извещений из других вкладок о запросах
          * @public
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} evt Cобытие полностью
          */
         onCall: function (evtName, evt) {
            if (!(evt && typeof evt === 'object'
               && evt.from && typeof evt.from === 'string'
               && evt.targets && typeof evt.targets === 'object'
               && evt.method && typeof evt.method === 'string')) {
               throw new TypeError('Unknown event');
            }
            if (this._tabKey in evt.targets) {
               var from = evt.from;
               var method = evt.method;
               var args;
               for (var i = 0, list = evt.targets[this._tabKey]; i < list.length; i++) {
                  var target = list[i];
                  var doer = this._router(target);
                  var err = null;
                  if (!doer || typeof doer !== 'object') {
                     err = 'Target not found or invalid';
                  }
                  else {
                     if (!(method in doer)) {
                        err = 'Method not found'
                     }
                     else {
                        if (!args) {
                           args = evt.args && Array.isArray(evt.args) ? _unpack(evt.args) : [];
                        }
                        try {
                           var result = doer[method].apply(doer, args);
                           if (result instanceof Deferred) {
                              result.addBoth(_sendResult.bind(null, this, from, target, method, evt.args));
                           }
                           else {
                              _sendResult(this, from, target, method, evt.args, result);
                           }
                        }
                        catch (ex) {
                           err = ex.message || '' + ex;
                        }
                     }
                  }
                  if (err) {
                     this._channel.notify('LongOperations:TabCalls:onResult', {from:this._tabKey, to:from, target:target, method:method, args:evt.args, error:err});
                  }
               }
            }
         },

         /**
          * Слушатель извещений из других вкладок о получении результатов запросов
          * @public
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} evt Cобытие полностью
          */
         onResult: function (evtName, evt) {
            if (!(evt && typeof evt === 'object'
               && evt.from && typeof evt.from === 'string'
               && evt.to && typeof evt.to === 'string'
               && evt.target && typeof evt.target === 'string'
               && evt.method && typeof evt.method === 'string'
               && (!evt.error || typeof evt.error === 'string'))) {
               throw new TypeError('Unknown event');
            }
            if (evt.to === this._tabKey) {
               var call = _get(this, evt.from, evt.target, evt.method, _unpack(evt.args), true);
               if (!call) {
                  throw new Error('Not found');
               }
               if (!evt.error) {
                  var result = evt.result;
                  var ctor = call.resultClass;
                  if (ctor) {
                     if (result == null /*###|| typeof result !== 'object'*/) {
                        throw new Error('Result required');
                     }
                     var unpack = function (v) { return new ctor(v); };
                     result = Array.isArray(result) ? result.map(unpack) : unpack(result);
                  }
                  call.promise.callback(result);
               }
               else {
                  call.promise.errback(new Error(evt.error));
               }
            }
         }
      });



      /**
       * Отослать полученный результат вызова во вкладку, сделавшую вызов
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/Tools/TabCalls} self Этот объект
       * @param {string} to Ключ вкладки
       * @param {string} target Имя целевого объекта
       * @param {string} method Имя вызываемого метода
       * @param {any[]} args Аргументы вызова
       * @param {any} result Результат выполнения вызова
       */
      var _sendResult = function (self, to, target, method, args, result) {
         var answer = {from:self._tabKey, to:to, target:target, method:method, args:args};
         if (result instanceof Error) {
            answer.error = result.message || '' + result;
         }
         else {
            if (result && typeof result === 'object') {
               if (result instanceof DataSet) {
                  result = result.getAll();
               }
               if (result instanceof RecordSet) {
                  result = Chain(result).values();
               }
               if (self._packer) {
                  if (Array.isArray(result)) {
                     result = result.map(self._packer);
                  }
                  else {
                     result = self._packer(result);
                  }
               }
            }
            answer.result = result;
         }
         self._channel.notify('LongOperations:TabCalls:onResult', answer);
      };

      /**
       * Получить запрос из списка выполняющихся во вкладках запросов
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/Tools/TabCalls} self Этот объект
       * @param {string} tabKey Ключ вкладки
       * @param {string} target Имя целевого объекта
       * @param {string} method Имя вызываемого метода
       * @param {any[]} args Аргументы вызова
       * @param {boolean} andRemove Удалить возвращаемый запрос из списка
       */
      var _get = function (self, tabKey, target, method, args, andRemove) {
         for (var i = 0; i < self._list.length; i++) {
            var call = self._list[i];
            if (call.tab === tabKey && call.target === target && call.method === method && _isEq(call.args, args)) {
               if (andRemove) {
                  self._list.splice(i, 1);
               }
               return call;
            }
         }
      };

      /**
       * Упаковать значение для передачи
       * @protected
       * @param {any} value Упаковыемое значение
       * @return {any}
       */
      var _pack = function (value) {
         if (!value || typeof value !== 'object') {
            return value;
         }
         else
         if (Array.isArray(value)) {
            return value.map(function (v) { return _pack(v); });
         }
         else
         if (value instanceof Date) {
            return {':dt':value.getTime()};
         }
         else {
            return Object.keys(value).reduce(function (r, v) { r[v] = _pack(value[v]); return r; }, {});
         }
      };

      /**
       * Распаковать значение после передачи
       * @protected
       * @param {any} value Распаковыемое значение
       * @return {any}
       */
      var _unpack = function (value) {
         if (!value || typeof value !== 'object') {
            return value;
         }
         else
         if (Array.isArray(value)) {
            return value.map(function (v) { return _unpack(v); });
         }
         else
         if (typeof value[':dt'] === 'number' && Object.keys(value).length === 1) {
            return new Date(value[':dt']);
         }
         else {
            return Object.keys(value).reduce(function (r, v) { r[v] = _unpack(value[v]); return r; }, {});
         }
      };

      /**
       * Проверить на равенство два значения
       * @protected
       * @param {object} v1 Сравниваемое значение
       * @param {object} v2 Сравниваемое значение
       * @return {boolean}
       */
      var _isEq = function (v1, v2) {
         if (v1 == null && v2 == null) {
            return true;
         }
         if (!(v1 && typeof v1 === 'object' && v2 && typeof v2 === 'object')) {
            return v1 === v2;
         }
         if (Array.isArray(v1)) {
            if (!Array.isArray(v2) || v1.length !== v2.length) {
               return false;
            }
            for (var i = 0; i < v1.length; i++) {
               if (!_isEq(v1[i], v2[i])) {
                  return false;
               }
            }
         }
         else {
            if (Array.isArray(v2)) {
               return false;
            }
            var ns = Object.keys(v1);
            if (ns.length != Object.keys(v2).length) {
               return false;
            }
            for (var i = 0; i < ns.length; i++) {
               var n = ns[i];
               if (!_isEq(v1[n], v2[n])) {
                  return false;
               }
            }
         }
         return true;
      };



      return LongOperationsTabCalls;
   }
);
