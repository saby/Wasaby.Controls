define('Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea',
      'Controls/Popup/Compatible/Layer',
      'Lib/Mixins/LikeWindowMixin',
      'Core/moduleStubs',
      'Core/core-debug',
      'Core/Deferred',
      'css!Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea'
   ],
   function(Control,
      template,
      CompatiblePopup,
      LikeWindowMixin,
      moduleStubs,
      coreDebug,
      cDeferred) {
      /**
       * Слой совместимости для открытия старых шаблонов в новых попапах
      **/
      var CompoundArea = Control.extend([LikeWindowMixin], {
         _template: template,
         templateOptions: null,
         compatible: null,
         fixBaseCompatible: true,
         _templateComponent: undefined,

         _pending: null,
         _pendingTrace: null,
         _waiting: null,

         _beforeMount: function() {
            this._commandHandler = this._commandHandler.bind(this);

            this.handle('onBeforeShow');
            this.handle('onShow');
         },

         shouldUpdate: function() {
            return false;
         },

         _afterMount: function() {
            var
               self = this;
            if (this._options.templateOptions) {
               this.templateOptions = this._options.templateOptions;
            } else {
               this.templateOptions = {};
            }
            if (this._options._initCompoundArea) {
               this._pending = this._pending || [];
               this._pendingTrace = this._pendingTrace || [];
               this._waiting = this._waiting || [];

               this._options._initCompoundArea(this);
            }

            moduleStubs.require([self._options.template]).addCallback(function(result) {
               CompatiblePopup.load().addCallback(function() { //Это уже должно быть загружено страницей
                  self.templateOptions.element = $(self._children.compoundBlock);
                  self._compoundControl = new (result[0])(self.templateOptions);
                  self._subscribeToCommand();

                  self.handle('onAfterShow'); // todo здесь надо звать хэндлер который пытается подписаться на onAfterShow, попробуй подключить FormController и словить подпись
               });
            });
         },
         _subscribeToCommand: function() {
            this._compoundControl.subscribe('onCommandCatch', this._commandHandler);
         },
         _commandHandler: function(event, commandName) {
            switch (commandName) {
               case 'close':
                  this._close();
            }
         },
         _close: function() {
            this._notify('close');
         },

         /* from api floatArea, window */

         close: function() {
            var res = this._notify('onBeforeClose');
            if (res !== false) {
               this._close();

               this.handle('onClose');
               this.handle('onAfterClose');
            }
         },
         _getTemplateComponent: function() {
            return this._compoundControl;
         },

         subscribe: function(eventName, handler) {
            var handlers = this[eventName + 'Handler'] || [];
            handlers.push(handler);
         },
         subscribeTo: function(eventName, handler) {
            this.subscribe(eventName, handler);
         },
         once: function(eventName, handler) {
            this.subscribe(eventName, function() {
               handler();
               this.unsubscribe(eventName, handler);
            }.bind(this));
         },
         unsubscribe: function(eventName, handler) {
            var handlers = this[eventName + 'Handler'] || [];
            this[eventName + 'Handler'] = handlers.filter(function(value) {
               return value !== handler;
            });
         },
         handle: function(eventName) {
            var handlers = this[eventName + 'Handler'] || [];
            handlers.forEach(function(value) {
               value();
            });
            if (this._options.handlers && this._options.handlers[eventName]) {
               this._options.handlers[eventName].forEach(function(value) {
                  value();
               });
            }
         },

         getChildPendingOperations: function() {

         },
         addPendingOperation: function(syncOperationCallback) {

         },
         onBringToFront: function() {
            this.activate();
         },

         isDestroyed: function() {
            return this._destroyed;
         },









         /**
          *
          * Добавить отложенную асинхронную операцию в очередь ожидания окна.
          * @param {Core/Deferred} dOperation Отложенная операция.
          * @returns {Boolean} "true", если добавление операции в очередь успешно.
          * @see waitAllPendingOperations
          */
         addPendingOperation: function(dOperation) {
            var result = !!(dOperation && (dOperation instanceof cDeferred));
            if (result) {
               this._pending.push(dOperation);
               this._pendingTrace.push(coreDebug.getStackTrace());
               dOperation.addBoth(this._checkPendingOperations.bind(this));
            }
            return result;
         },
         _finishAllPendingsWithSave: function() {
            this._pending.forEach(function(pending) {
               pending.callback(true);
            });
         },

         /**
          * Получение информации о добавленных пендингах, включая информацию, откуда был добавлен пендинг
          * @returns {Array} Массив объектов, хранящих пендинг и информацию, откуда был добавлен пендинг
          */
         getAllPendingInfo: function() {
            var res = [],
               self = this;
            this._pending.forEach(function(pending, index) {
               res.push({
                  pending: pending,
                  trace: self._pendingTrace[index]
               });
            });
            return res;
         },

         /**
          *
          * Добавить асинхронное событие на завершение всех отложенных операций.
          * Добавить асинхронное событие, которое сработает в момент завершения всех отложенных операций,
          * добавленных с помощью {@link addPendingOperation}.
          * Если очередь пуста, то сработает сразу.
          * Если попытаться передать Deferred, находящийся в каком-либо состоянии (успех, ошибка), то метод вернет false и
          * ожидающий не будет добавлен в очередь.
          * @param {Core/Deferred} dNotify Deferred-объект, ожидающий завершения всех отложенных операций.
          * @returns {Boolean} "true", если добавление в очередь ожидающих успешно.
          * @see addPendingOperation
          */
         waitAllPendingOperations: function(dNotify) {
            if (dNotify && (dNotify instanceof cDeferred) && !dNotify.isReady()) {
               if (this._pending.length === 0) {
                  dNotify.callback();
               } else {
                  this._waiting.push(dNotify);
               }
               return true;
            } else {
               return false;
            }
         },
         _checkPendingOperations: function(res) {
            var totalOps = this._pending.length, result;

            // Сперва отберем Deferred, которые завершились
            result = this._pending.filter(function(dfr) {
               return dfr.isReady();
            });

            // Затем получим их результаты
            result = result.map(function(dfr) {
               return dfr.getResult();
            });

            // If every waiting op is completed
            if (result.length == totalOps) {
               this._pending = [];
               this._pendingTrace = [];
               while (this._waiting.length > 0) {
                  this._waiting.pop().callback(result);
               }
            }

            // if res instanceof Error, return it as non-captured
            return res;
         },
      });

      return CompoundArea;
   });
