define('Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea',
      'Lib/Mixins/LikeWindowMixin',
      'Core/helpers/Array/findIndex',
      'Core/moduleStubs',
      'Core/core-debug',
      'Core/Deferred',
      'Core/IoC',
      'Core/EventObject',
      'Core/helpers/Function/runDelayed',
      'Core/constants',
      'Core/helpers/Hcontrol/doAutofocus',
      'optional!Deprecated/Controls/DialogRecord/DialogRecord',
      'Core/EventBus',

      'Lib/Control/AreaAbstract/AreaAbstract.compatible',
      'css!Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea',
      'Core/Abstract.compatible',
      'Lib/Control/Control.compatible',
      'Lib/Control/BaseCompatible/BaseCompatible',
      'WS.Data/Entity/InstantiableMixin'
   ],
   function(
      Control,
      template,
      LikeWindowMixin,
      arrayFindIndex,
      moduleStubs,
      coreDebug,
      cDeferred,
      IoC,
      EventObject,
      runDelayed,
      CoreConstants,
      doAutofocus,
      DialogRecord,
      cEventBus
   ) {
      function removeOperation(operation, array) {
         var idx = arrayFindIndex(array, function(op) {
            return op === operation;
         });
         array.splice(idx, 1);
      }

      function finishResultOk(result) {
         return !(result instanceof Error || result === false);
      }
      function setReadOnly(compoundControl, isReadOnly) {
         var isEnabled = !isReadOnly;
         var childControls = compoundControl.getImmediateChildControls(),
            control;
         for (var i = 0, len = childControls.length; i < len; ++i) {
            control = childControls[i];
            if (typeof (control.setReadOnly) === 'function') {
               control.setReadOnly(!isEnabled);
            } else {
               control.setEnabled(isEnabled);
            }
         }
      }

      var logger = IoC.resolve('ILogger');
      var allProducedPendingOperations = [];


      var AbstractCompatible,
         ControlCompatible,
         AreaAbstractCompatible,
         BaseCompatible,
         InstantiableMixin;

      // На сервере всегда надо подтянуть слой, потому что контролы могут строиться для разных клиентов
      // и для разных страниц
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
      * */
      var CompoundArea = Control.extend([AbstractCompatible || {},
         ControlCompatible || {},
         AreaAbstractCompatible || {},
         BaseCompatible || {},
         InstantiableMixin,
         LikeWindowMixin], {
         _template: template,
         _compoundId: undefined,
         _templateOptions: null,
         _templateName: null,
         compatible: null,
         fixBaseCompatible: true,
         _templateComponent: undefined,
         _isClosing: false,

         _pending: null,
         _pendingTrace: null,
         _waiting: null,

         _childPendingOperations: [],
         _allChildrenPendingOperation: null,
         _finishPendingQueue: null,
         _isFinishingChildOperations: false,
         _producedPendingOperations: [],

         _isReadOnly: true,

         _beforeMount: function() {
            this._className = 'controls-CompoundArea';
            this._className += ' ws-float-area'; // Старые шаблоны завязаны селекторами на этот класс.
            this._commandHandler = this._commandHandler.bind(this);
            this._commandCatchHandler = this._commandCatchHandler.bind(this);
            this._templateName = this._options.template;
         },

         _shouldUpdate: function(popupOptions) {
            if (popupOptions._compoundId !== this._compoundId) {
               this._templateOptions = this._options.templateOptions || {};
               this._rebuildCompoundControl();
               this._compoundId = popupOptions._compoundId;
            }
            return false;
         },

         _rebuildCompoundControl: function() {
            var oldCompound = this._compoundControl;
            var self = this;

            // Если compoundControl еще не готов, то в текущей синхронизации ничего выполнять не надо,
            // она была вызвана после afterMount'a и опции не поменялись
            if (!oldCompound.isReady()) {
               return;
            }

            setTimeout(function() {
               oldCompound.unsubscribe('onCommandCatch', self._commandHandler);
               oldCompound.destroy();
            }, 0);
            oldCompound._container.remove();

            if (this._options._initCompoundArea) {
               this._options._initCompoundArea(this);
            }

            this._compoundControlCreated = new cDeferred();

            moduleStubs.require([this._templateName]).addCallback(function(result) {
               self._createCompoundControl(result[0]);
            });
            return this._compoundControlCreated;
         },

         _afterMount: function(cfg) {
            this._options = cfg;

            // Нам нужно пометить контрол замаунченым для слоя совместимости,
            // чтобы не создавался еще один enviroment для той же ноды

            this.VDOMReady = true;
            this.deprecatedContr(this._options);

            var self = this;

            var container = self._container.length ? self._container[0] : self._container;
            container.wsControl = self;

            self._templateOptions = self._options.templateOptions || {};
            self._compoundId = self._options._compoundId;

            if (self._options._initCompoundArea) {
               self._options._initCompoundArea(self);
            }

            self._pending = self._pending || [];
            self._pendingTrace = self._pendingTrace || [];
            self._waiting = self._waiting || [];

            self.__parentFromCfg = self._options.__parentFromCfg;
            self.__openerFromCfg = self._options.__openerFromCfg;
            self._parent = self._options.parent;
            self._logicParent = self._options.parent;
            self._options.parent = null;


            self._logicParent.waitForPopupCreated = true;

            // Здесь нужно сделать явную асинхронность, потому что к этому моменту накопилась пачка стилей
            // далее floatArea начинает люто дергать recalculateStyle и нужно, чтобы там не было
            // лишних свойств, которые еще не применены к дому
            // панельки с этим начали вылезать плавненько

            this._compoundControlCreated = new cDeferred();
            runDelayed(function() {
               moduleStubs.require([self._templateName]).addCallback(function(result) {
                  self._createCompoundControl(result[0]);
                  doAutofocus(self._compoundControl._container);
                  self._logicParent.callbackCreated && self._logicParent.callbackCreated();
                  runDelayed(function() {
                     self.handle('onResize');
                  });
               }).addErrback(function(e) {
                  IoC.resolve('ILogger').error('CompoundArea', 'Шаблон "' + self._options.template + '" не смог быть загружен!');
                  this._compoundControlCreated.errback(e);
               }.bind(this));
            });
         },
         _createCompoundControl: function(Component) {
            this._templateOptions.element = $('<div></div>').appendTo(this._children.compoundBlock);
            this._templateOptions._compoundArea = this;
            this._templateOptions.parent = this;

            this.handle('onBeforeControlsLoad');
            this._compoundControl = new (Component)(this._templateOptions);
            this.handle('onBeforeShow');
            this.handle('onShow');
            this._compoundControlCreated.callback(this._compoundControl);
            this._subscribeToCommand();
            this._setCustomHeader();
            cEventBus.globalChannel().notify('onWindowCreated', this); // StickyHeaderMediator listens for onWindowCreated
            this.handle('onAfterLoad');
            this.handle('onInitComplete');
            this.handle('onAfterShow'); // todo здесь надо звать хэндлер который пытается подписаться на onAfterShow, попробуй подключить FormController и словить подпись
            this._compoundControl.setActive(true);
            var self = this;
            runDelayed(function() {
               self._compoundControl._notifyOnSizeChanged();
            });
         },
         isOpened: function() {
            return true;
         },

         _setCustomHeader: function() {
            var hasHeader = !!this._options.caption;
            var customHeaderContainer = this._compoundControl.getContainer().find('.ws-window-titlebar-custom');
            if (hasHeader) {
               if (customHeaderContainer.length) {
                  customHeaderContainer.prepend('<div class="ws-float-area-title">' + this._options.caption + '</div>');
                  if (this._options.type === 'dialog') {
                     var height = customHeaderContainer.height();
                     $('.controls-DialogTemplate', this.getContainer()).css('margin-bottom', height);
                  }
               } else {
                  this.getContainer().prepend($('<div class="ws-window-titlebar"><div class="ws-float-area-title ws-float-area-title-generated">' + this._options.caption + '</div></div>'));
                  this.getContainer().addClass('controls-CompoundArea-headerPadding');
               }
            } else {
               this.getContainer().removeClass('controls-CompoundArea-headerPadding');
            }
         },

         _subscribeToCommand: function() {
            this._compoundControl.subscribe('onCommandCatch', this._commandCatchHandler);
         },

         _commandCatchHandler: function(event, commandName, arg) {
            event.setResult(this._commandHandler(commandName, arg));
         },
         _commandHandler: function(commandName, arg) {
            var parent, argWithName;

            if (Array.isArray(arg) && arg.length === 1) {
               argWithName = [commandName, arg];
            } else {
               argWithName = [commandName].concat(arg);
            }

            if (commandName === 'close') {
               return this._close(arg);
            } else if (commandName === 'ok') {
               return this._close(true);
            } else if (commandName === 'cancel') {
               return this._close(false);
            } else if (commandName === 'resize' || commandName === 'resizeYourself') {
               this._notify('resize', null, { bubbling: true });
            } else if (commandName === 'registerPendingOperation') {
               return this._registerChildPendingOperation(arg);
            } else if (commandName === 'unregisterPendingOperation') {
               return this._unregisterChildPendingOperation(arg);
            } else if (this.__parentFromCfg) {
               parent = this.__parentFromCfg;
               parent.sendCommand.apply(parent, argWithName);
            } else if (this._parent && this._parent._options.opener) {
               parent = this._parent._options.opener;

               /* Если нет sendCommand - значит это не compoundControl - а значит там нет распространения команд */

               if (parent.sendCommand) {
                  parent.sendCommand.apply(parent, argWithName);
               }
            }
         },
         sendCommand: function(commandName, arg) {
            return this._commandHandler(commandName, arg);
         },
         _close: function(arg) {
            if (this._isClosing) {
               return false;
            }
            this._isClosing = true;
            if (this.handle('onBeforeClose', arg) !== false) {
               this.close(arg);
               return true;
            }
            this._isClosing = false;
         },
         closeHandler: function(e, arg) {
            e.stopPropagation();
            this._close(arg);
         },
         _keyUp: function(event) {
            var
               self = this;
            if (!event.nativeEvent.shiftKey && event.nativeEvent.keyCode === CoreConstants.key.esc) {
               self._close();
            }
            event.stopPropagation();
         },

         _setCompoundAreaOptions: function(newOptions) {
            this._templateOptions = newOptions.templateOptions || {};
         },

         reload: function() {
            this._rebuildCompoundControl();
         },
         setTemplate: function(template, templateOptions) {
            if (templateOptions) {
               this._templateOptions = templateOptions.templateOptions;
            }
            this._templateName = template;
            return this._rebuildCompoundControl();
         },

         /* from api floatArea, window */

         getParent: function() {
            return this.__parentFromCfg || null;
         },
         getOpener: function() {
            return this.__openerFromCfg || null;
         },

         /* start RecordFloatArea */
         getRecord: function() {
            return this._options.record || this._options.templateOptions && this._options.templateOptions.record;
         },
         isNewRecord: function() {
            return this._options.newRecord;
         },
         setReadOnly: function(isReadOnly) {
            this._isReadOnly = isReadOnly;
            if (this._compoundControl) {
               setReadOnly(this._compoundControl, isReadOnly);
            } else {
               this._compoundControlCreated.addCallback(function() {
                  setReadOnly(this._compoundControl, isReadOnly);
               }.bind(this));
            }
         },
         isReadOnly: function() {
            return this._isReadOnly;
         },


         setSaveDiffOnly: function() {
            DialogRecord.prototype.setSaveDiffOnly.apply(this, arguments);
         },
         ok: function() {
            DialogRecord.prototype.ok.apply(this, arguments);
         },
         _setEnabledForChildControls: function() {
            DialogRecord.prototype._setEnabledForChildControls.apply(this, arguments);
         },
         _showLoadingIndicator: function() {
            DialogRecord.prototype._showLoadingIndicator.apply(this, arguments);
         },
         _hideLoadingIndicator: function() {
            DialogRecord.prototype._hideLoadingIndicator.apply(this, arguments);
         },
         isAllReady: function() {
            return DialogRecord.prototype.isAllReady.apply(this, arguments);
         },
         getChildControls: function() {
            return DialogRecord.prototype.getChildControls.apply(this, arguments);
         },
         getReports: function() {
            return DialogRecord.prototype.getReports.apply(this, arguments);
         },
         _printMenuItemsIsChanged: function() {
            return DialogRecord.prototype._printMenuItemsIsChanged.apply(this, arguments);
         },
         _createPrintMenu: function() {
            return DialogRecord.prototype._createPrintMenu.apply(this, arguments);
         },
         showReportList: function() {
            return DialogRecord.prototype.showReportList.apply(this, arguments);
         },
         printReport: function() {
            return DialogRecord.prototype.printReport.apply(this, arguments);
         },
         _showReport: function() {
            return DialogRecord.prototype._showReport.apply(this, arguments);
         },
         print: function() {
            return DialogRecord.prototype.print.apply(this, arguments);
         },
         _hideWindow: function() {
         },
         _getTitle: function() {
            return document.title;
         },

         _openConfirmDialog: function() {
            return DialogRecord.prototype._openConfirmDialog.apply(this, arguments);
         },
         isSaved: function() {
            return DialogRecord.prototype.isSaved.apply(this, []);
         },
         _unbindBeforeUnload: function() {
            DialogRecord.prototype._unbindBeforeUnload.apply(this);
         },
         _beforeUnloadHandler: function() {
            return DialogRecord.prototype._beforeUnloadHandler.apply(this);
         },
         unsubscribeOnBeforeUnload: function() {
            DialogRecord.prototype.unsubscribeOnBeforeUnload.apply(this);
         },
         updateRecord: function() {
            return DialogRecord.prototype.updateRecord.apply(this, arguments);
         },
         save: function() {
            return DialogRecord.prototype.save.apply(this, arguments);
         },
         _processError: function(error) {
            DialogRecord.prototype._processError.apply(this, [error]);
         },

         /* end RecordFloatArea */

         hide: function() {
            this.close();
         },
         close: function(arg) {
            //Могут несколько раз позвать закрытие подряд
            if (!this._compoundControl.isDestroyed()) {
               this._notify('close', null, { bubbling: true });

               this.handle('onClose', arg);
               this.handle('onAfterClose', arg);
               this.handle('onDestroy');
            }
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
         subscribeTo: function(control, eventName, handler) {
            control.subscribe(eventName, handler);
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
               // Здесь обработчики продублированы в this[eventName + 'Handler']
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

            // subscribeTo берет channel и подписывается к нему на события
            // поэтому если наше событие не отменено, возьмем канал и нотификанем

            if (eventState.getResult() !== false) {
               var result = this._getChannel().notify(eventName, arg);
               if (result !== undefined) {
                  eventState.setResult(result);
               }
            }

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

            this._childPendingOperations = [];// cleanup им вызывать не надо - всё равно там destroy будет работать, у дочернего контрола
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

         getImmediateChildControls: function() {
            return [this._compoundControl];
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
            }
            return false;
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
