define('Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea',
      'Lib/Mixins/LikeWindowMixin',
      'Core/helpers/Array/findIndex',
      'Core/moduleStubs',
      'Core/core-debug',
      'Core/helpers/Function/debounce',
      'Core/Deferred',
      'Core/IoC',
      'Core/EventObject',
      'Core/helpers/Function/runDelayed',
      'css!Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea',
      'Core/Abstract.compatible',
      'Lib/Control/Control.compatible',
      'Lib/Control/AreaAbstract/AreaAbstract.compatible',
      'Lib/Control/BaseCompatible/BaseCompatible',
      'WS.Data/Entity/InstantiableMixin'
   ],
   function(Control,
      template,
      LikeWindowMixin,
      arrayFindIndex,
      moduleStubs,
      coreDebug,
      debounce,
      cDeferred,
      IoC,
      EventObject,
      runDelayed) {

      function removeOperation(operation, array) {
         var  idx = arrayFindIndex(array, function(op) {
            return op === operation; 
         });
         array.splice(idx, 1);
      }

      function finishResultOk(result) {
         return !(result instanceof Error || result === false);
      }

      var logger = IoC.resolve('ILogger');
      var allProducedPendingOperations = [];


      var AbstractCompatible,
         ControlCompatible,
         AreaAbstractCompatible,
         BaseCompatible,
         InstantiableMixin;

      //На сервере всегда надо подтянуть слой, потому что контролы могут строиться для разных клиентов
      //и для разных страниц
      if (typeof process === 'undefined' || !process.domain ||
         !process.domain.req || process.domain.req.compatible !== false) {
         AbstractCompatible = require.defined('Core/Abstract.compatible') && require('Core/Abstract.compatible');
         ControlCompatible = require.defined('Lib/Control/Control.compatible') && require('Lib/Control/Control.compatible');
         AreaAbstractCompatible = require.defined('Lib/Control/AreaAbstract/AreaAbstract.compatible') && require('Lib/Control/AreaAbstract/AreaAbstract.compatible');
         BaseCompatible = require.defined('Lib/Control/BaseCompatible/BaseCompatible') && require('Lib/Control/BaseCompatible/BaseCompatible');
         InstantiableMixin = require.defined('WS.Data/Entity/InstantiableMixin') && require('WS.Data/Entity/InstantiableMixin');

         Control.loadCompatible();
      }

      /**
       * Слой совместимости для открытия старых шаблонов в новых попапах
      **/
      var CompoundArea = Control.extend([AbstractCompatible || {},
         ControlCompatible || {},
         AreaAbstractCompatible || {},
         BaseCompatible || {},
         InstantiableMixin,
         LikeWindowMixin], {
         _template: template,
         _compoundId: undefined,
         templateOptions: null,
         compatible: null,
         fixBaseCompatible: true,
         _templateComponent: undefined,

         _pending: null,
         _pendingTrace: null,
         _waiting: null,

         _childPendingOperations: [],
         _allChildrenPendingOperation: null,
         _finishPendingQueue: null,
         _isFinishingChildOperations: false,
         _producedPendingOperations: [],

         _beforeMount: function() {
            this._rebuildCompoundControl = debounce.call(this._rebuildCompoundControl, this).bind(this);
            this._className = 'controls-CompoundArea';
            this._className += ' ws-float-area'; //Старые шаблоны завязаны селекторами на этот класс.
            this._commandHandler = this._commandHandler.bind(this);
         },

         _shouldUpdate: function(popupOptions) {
            if (popupOptions._compoundId !== this._compoundId) {
               this._rebuildCompoundControl(popupOptions);
               this._compoundId = popupOptions._compoundId;
            }
            return false;
         },

         _rebuildCompoundControl: function(popupOptions) {
            var oldCompound = this._compoundControl;
            var self = this;

            //Если compoundControl еще не готов, то в текущей синхронизации ничего выполнять не надо,
            //она была вызвана после afterMount'a и опции не поменялись
            if (!oldCompound.isReady()) {
               return;
            }

            setTimeout(function() {
               oldCompound.unsubscribe('onCommandCatch', self._commandHandler);
               oldCompound.destroy();
            }, 0);
            oldCompound._container.remove();

            if (popupOptions._initCompoundArea) {
               popupOptions._initCompoundArea(this);
            }
            var templateOptions = popupOptions.templateOptions || {};

            moduleStubs.require([popupOptions.template]).addCallback(function(result) {
               self._createCompoundControl(templateOptions, result[0]);
            });
         },

         _afterMount: function(cfg) {
            this._options = cfg;
            this.deprecatedContr(this._options);



            var self = this;

            self.templateOptions = self._options.templateOptions || {};
            self._compoundId = self._options._compoundId;

            if (self._options._initCompoundArea) {
               self._options._initCompoundArea(self);
            }

            self._pending = self._pending || [];
            self._pendingTrace = self._pendingTrace || [];
            self._waiting = self._waiting || [];

            self.__parentFromCfg = self._options.__parentFromCfg;
            self._parent = self._options.parent;
            self._logicParent = self._options.parent;
            self._options.parent = null;


            self._logicParent.waitForPopupCreated = true;

            //Здесь нужно сделать явную асинхронность, потому что к этому моменту накопилась пачка стилей
            //далее floatArea начинает люто дергать recalculateStyle и нужно, чтобы там не было
            //лишних свойств, которые еще не применены к дому
            //панельки с этим начали вылезать плавненько

            runDelayed(function() {
               self.handle('onBeforeShow');
               self.handle('onShow');

               moduleStubs.require([self._options.template]).addCallback(function(result) {
                  self.handle('onBeforeControlsLoad');
                  self._createCompoundControl(self.templateOptions, result[0]);
                  self._logicParent.callbackCreated && self._logicParent.callbackCreated();
               });
            });
         },
         _createCompoundControl: function(templateOptions, Component) {
            templateOptions.element = $('<div></div>').appendTo(this._children.compoundBlock);
            templateOptions._compoundArea = this;
            templateOptions.parent = this;
            this._compoundControl = new (Component)(templateOptions);
            this._subscribeToCommand();
            this.handle('onAfterLoad');
            this.handle('onInitComplete');
            this.handle('onAfterShow'); // todo здесь надо звать хэндлер который пытается подписаться на onAfterShow, попробуй подключить FormController и словить подпись
         },
         _subscribeToCommand: function() {
            this._compoundControl.subscribe('onCommandCatch', this._commandHandler);
         },
         _commandHandler: function(event, commandName, arg) {
            var parent;
            if (commandName === 'close') {
               this._close(arg);
            } else if (commandName === 'registerPendingOperation') {
               return this._registerChildPendingOperation(arg);
            } else if (commandName === 'unregisterPendingOperation') {
               return this._unregisterChildPendingOperation(arg);
            } else if (this.__parentFromCfg) {
               parent = this.__parentFromCfg;
               parent.sendCommand.apply(parent, [commandName].concat(arg));
            } else if (this._parent && this._parent._options.opener) {
               parent = this._parent._options.opener;

               /*Если нет sendCommand - значит это не compoundControl - а значит там нет распространения команд*/

               if (parent.sendCommand) {
                  parent.sendCommand.apply(parent, [commandName].concat(arg));
               }
            }
         },
         sendCommand: function(commandName, arg) {
            this._commandHandler(null, commandName, arg);
         },
         _close: function(arg) {
            if (this.handle('onBeforeClose', arg) !== false) {
               this.close(arg);
            }
         },
         closeHandler: function(e, arg) {
            e.stopPropagation();
            this._close(arg);
         },

         reload: function() {
            this._rebuildCompoundControl(this._options);
         },

         /* from api floatArea, window */

         getParent: function() {
            return null;
         },

         /* start RecordFloatArea */
         getRecord: function() {
            return this._options.record;
         },
         isNewRecord: function() {
            return this._options.newRecord;
         },

         /*end RecordFloatArea */

         close: function(arg) {
            this._notify('close', null, {bubbling: true});

            this.handle('onClose', arg);
            this.handle('onAfterClose', arg);
            this.handle('onDestroy');
         },
         _getTemplateComponent: function() {
            return this._compoundControl;
         },
         hasCompatible: function() {
            return true;
         },

         subscribe: function(eventName, handler) {
            var handlers = this[eventName + 'Handler'] || [];
            this[eventName + 'Handler'] = handlers;
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
         handle: function(eventName, arg) {
            var handlers = this[eventName + 'Handler'] || [],
               eventState = new EventObject(eventName, this),
               optionsHandlers = this._options.handlers || [],
               self = this;

            if (handlers[eventName] === 'function') {
               handlers[eventName] = [handlers[eventName]];
            }
            if (typeof optionsHandlers[eventName] === 'function' && handlers.indexOf(optionsHandlers[eventName]) === -1) {
               handlers.push(optionsHandlers[eventName]);
            }
            if (Array.isArray(optionsHandlers[eventName])) {
               //Здесь обработчики продублированы в this[eventName + 'Handler']
               for (var i = 0; i < optionsHandlers[eventName].length; i++) {
                  if (handlers.indexOf(optionsHandlers[eventName][i]) === -1) {
                     handlers.push(optionsHandlers[eventName][i]);
                  }
               }
            }

            handlers.forEach(function(value) {
               if (eventState.getResult() !== false) {
                  value.apply(self, [eventState, arg]);
               }
            });

            return eventState.getResult();
         },

         getContainer: function() {
            return $(this._container);
         },

         isDestroyed: function() {
            return this._destroyed;
         },
         destroy: function() {
            if (this.isDestroyed()) {
               return;
            }

            var ops = this._producedPendingOperations;
            while (ops.length > 0) {
               this._unregisterPendingOperation(ops[0]);
            }



            var
               operation = this._allChildrenPendingOperation,
               message;

            if (this._isFinishingChildOperations) {
               message = 'У контрола ' + this._moduleName + ' (name = ' + this.getName() + ', id = ' + this.getId() + ') вызывается метод destroy, ' +
                  'хотя у него ещё есть незавёршённые операции (свои или от дочерних контролов';
               logger.error('Lib/Mixins/PendingOperationParentMixin', message);
            }

            this._childPendingOperations = [];//cleanup им вызывать не надо - всё равно там destroy будет работать, у дочернего контрола
            if (this._allChildrenPendingOperation) {
               this._allChildrenPendingOperation = null;
               this._unregisterPendingOperation(operation);
            }

            if (this._parent) {
               this._parent._childsMapId = this._parent._childsMapId || {};
               this._parent._childsMapName = this._parent._childsMapName || {};
               this._parent._childsTabindex = this._parent._childsTabindex || {};
            }

            CompoundArea.superclass.destroy.apply(this, arguments);
         },




         _removeOpFromCollections: function(operation) {
            removeOperation(operation, this._producedPendingOperations);
            removeOperation(operation, allProducedPendingOperations);
         },

         _registerPendingOperation: function(name, finishFunc, registerTarget) {
            var
               name = this._moduleName ? this._moduleName + '/' + name : name,
               operation = {
                  name: name,
                  finishFunc: finishFunc,
                  cleanup: null,
                  control: this,
                  registerTarget: registerTarget
               };

            operation.cleanup = this._removeOpFromCollections.bind(this, operation);
            if (operation.registerTarget) {
               operation.registerTarget.sendCommand('registerPendingOperation', operation);

               this._producedPendingOperations.push(operation);
               allProducedPendingOperations.push(operation);
            }
            return operation;
         },

         _unregisterPendingOperation: function(operation) {
            operation.cleanup();

            if (operation.registerTarget) {
               operation.registerTarget.sendCommand('unregisterPendingOperation', operation);
            }
         },

         getAllPendingOperations: function() {
            return allProducedPendingOperations;
         },

         getPendingOperations: function() {
            return this._producedPendingOperations;
         },






         _registerChildPendingOperation: function(operation) {
            var name, finishFunc;

            this._childPendingOperations.push(operation);

            if (!this._allChildrenPendingOperation) {
               name = (this._moduleName ? this._moduleName + '/' : '') + 'allChildrenPendingOperation';
               finishFunc = this.finishChildPendingOperations.bind(this);

               this._allChildrenPendingOperation = this._registerPendingOperation(name, finishFunc, this.getParent());
            }

            return true;
         },

         _unregisterChildPendingOperation: function(operation) {
            var
               childOps = this._childPendingOperations,
               allChildrenPendingOperation;

            if (childOps.length > 0) {
               removeOperation(operation, childOps);
               if (childOps.length === 0) {
                  allChildrenPendingOperation = this._allChildrenPendingOperation;
                  this._allChildrenPendingOperation = null;
                  coreDebug.checkAssertion(!!allChildrenPendingOperation);

                  this._unregisterPendingOperation(allChildrenPendingOperation);
               }
            }
            return true;
         },
         finishChildPendingOperations: function(needSavePendings) {
            var
               self = this,
               checkFn = function(prevResult) {
                  var
                     childOps = self._childPendingOperations,
                     result, allChildrenPendingOperation;

                  function cleanupFirst() {
                     if (childOps.length > 0) {
                        childOps.shift().cleanup();
                     }
                  }

                  if (finishResultOk(prevResult) && childOps.length > 0) {
                     result = childOps[0].finishFunc(needSavePendings);
                     if (result instanceof cDeferred) {
                        result.addCallback(function(res) {
                           if (finishResultOk(res)) {
                              cleanupFirst();
                           }
                           return checkFn(res);
                        }).addErrback(function(res) {
                           return checkFn(res);
                        });
                     } else {
                        if (finishResultOk(result)) {
                           cleanupFirst();
                        }
                        result = checkFn(result);
                     }
                  } else {
                     allChildrenPendingOperation = self._allChildrenPendingOperation;
                     if (childOps.length === 0 && allChildrenPendingOperation) {
                        self._allChildrenPendingOperation = null;
                        self._unregisterPendingOperation(allChildrenPendingOperation);
                     }
                     self._isFinishingChildOperations = false;
                     result = prevResult;
                  }
                  return result;
               };

            if (!this._isFinishingChildOperations) {
               this._finishPendingQueue = cDeferred.success(true);
               this._isFinishingChildOperations = true;

               this._finishPendingQueue.addCallback(checkFn);
            }

            return this._finishPendingQueue;
         },

         getChildPendingOperations: function() {
            return this._childPendingOperations;
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
         }
      });
      return CompoundArea;
   });
