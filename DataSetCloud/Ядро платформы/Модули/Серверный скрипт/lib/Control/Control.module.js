/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 23.04.13
 * Time: 14:14
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.Control',
   ['js!SBIS3.CORE.Infobox', 'js!SBIS3.CORE.AttributeCfgParser', 'js!SBIS3.CORE.DataBoundMixin', 'Core/ParserUtilities', 'js!SBIS3.CORE.NavigationController'],
   function( Infobox, attributeCfgParser, DataBoundMixin, ParserUtilities ) {

   'use strict';

   var global = (function(){ return this || (1,eval)('this') }());

   if (typeof(jQuery) !== 'undefined') {
      (function( $ ) {
         $.fn.wsControl = function() {
            var control = null,
                element;
            try {
               element = this[0];
               while (element) {
                  if (element.wsControl) {
                     control = element.wsControl;
                     break;
                  }
                  element = element.parentNode;
               }
            }
            catch(e) {}
            return control;
         };
      })( jQuery );
   }

   /**
    * @class $ws.single.ControlBatchUpdater
    * @singleton
    */
   $ws.single.ControlBatchUpdater = new ($ws.core.extend({}, /** @lends $ws.single.ControlBatchUpdater */{
      $protected: {
         _applyUpdateInProcess: false,
         _batchUpdateSpan: null,
         _batchUpdateSpanHint: null,
         _batchUpdateCount: 0,
         _batchUpdateControls: {},
         _delayedEventsHash: {},
         _delayedActionsHash: {},
         _con: null,
         _debugEnabled: false,
         _delayedEvents: [],
         _uids: {},
         _batches: {}
      },

      $constructor: function() {
         this._setDebugEnabled(this._debugEnabled);
      },

      _dummyUpdate: {},
      _nop: function() {},

      _setDebugEnabled: function(value) {
         this._debugEnabled = value;
         var self = this;

         this._con = window && window.console;
         if (!this._con || !this._debugEnabled) {
            this._con = {
               log: this._nop, info: this._nop,
               group: this._nop, groupEnd: this._nop,
               profile: this._nop, profileEnd: this._nop
            }
         }

         if (!this._con.group) {
            this._con.groupLevel = 0;
            this._con.group = function(a1, a2, a3) {
               self._con.log(a1, ' ', a2, ' ', a3);
               self._con.groupLevel++;
            };

            var oldLog = this._con.log;
            this._con.log = function(a1, a2, a3) {
               var str = '', ln = (self._con.groupLevel + 1) * 2;
               for (var i = 0; i < ln; i++) {
                  str += '_';
               }

               if (oldLog.call) {
                  oldLog.call(self._con, str, ' ', a1, ' ', a2, ' ', a3);
               }
               else {
                  oldLog(str, ' ', a1, ' ', a2, ' ', a3);
               }
            };

            this._con.groupEnd = function() {
               self._con.groupLevel--;
            };
         }

         if (!this._con.profile) {
            this._con.profile = this._nop;
         }

         if (!this._con.profileEnd)
            this._con.profileEnd = this._nop;

         this.addComment = this._debugEnabled ? this._addComment : this._nop;
         this.getType = this._debugEnabled ? this._getType : this._nop;
      },

      beginBatchUpdate: function(hint) {
         if (!(hint in this._batches)) {
            this._batches[hint] = 0;
         }
         this._batches[hint]++;

         if (this._batchUpdateCount === 0) {
            this._batchUpdateSpan = BOOMR.plugins.WS.startBlock('pckRsz:' + hint);
            this._batchUpdateSpanHint = hint;
         }

         this._batchUpdateCount++;
      },

      _endBatchUpdateFinish: function(hint) {
         this._con.group('endBatchUpdateFinish ', this._batchUpdateSpanHint);

         var applyBatchSpan = BOOMR.plugins.WS.startBlock('pckRszApply:' + this._batchUpdateSpanHint);
         try {
            this._applyBatchUpdate(this._batchUpdateSpanHint, true);
         }
         finally {
            applyBatchSpan.close();

            var batchUpdateSpan = this._batchUpdateSpan,
                eventsSpan = BOOMR.plugins.WS.startBlock('pckRszEvents:' + this._batchUpdateSpanHint);

            try {
               this._batchUpdateSpan = null;
               this._batchUpdateSpanHint = null;

               var delayedEvents = this._delayedEvents,
                   removeDestroyed = function(evt) {
                      return evt &&                                      //могут быть "дырки" в массиве _delayedEvents
                            (!evt.control || !evt.control.isDestroyed());//Не отсылаем события удалённых контролов
                   };

               //очистим переменные с событиями, и запомним их в локальных переменных, чтобы обработчики событий
               //их не испортили (они тоже могут работать в пакетном режиме и вызывать _sendDelayedEvents)
               this._delayedEvents = [];
               this._delayedEventsHash = {};

               this._runDelayedActions();


               //всё посчитали, теперь все размеры правильные, можно отслылать отложенные события
               $ws.helpers.forEach($ws.helpers.filter(delayedEvents, removeDestroyed), function(evt) {
                  if (evt.event) {
                     evt.control._notify.apply(evt.control, evt.args);
                  }
                  else if (evt.func) {
                     evt.func.apply(evt.control);
                  }
               });
            }
            finally {
               eventsSpan.close();
               batchUpdateSpan.close();

               if (this._debugEnabled) {
                  var applyTime = applyBatchSpan.stopTime - applyBatchSpan.startTime,
                      eventsTime = eventsSpan.stopTime - eventsSpan.startTime,
                      allFinishTime = applyTime + eventsTime,
                      allPackTime = batchUpdateSpan.stopTime - batchUpdateSpan.startTime;

                  var msg = "Время: весь пакет: " + allPackTime + ", расчёт: весь: " + allFinishTime + ", applyBatchUpdate: " + applyTime + ", отложенное: " + eventsTime;
                  this._con.log(msg);
               }
               this._con.groupEnd();
            }
         }
      },

      endBatchUpdate: function(hint) {
         this._batches[hint]--;
         if (this._batches[hint] === 0) {
            delete this._batches[hint];
         }

         if (this._batchUpdateCount === 0) {
            throw new Error('Лишний вызов _endBatchChange: ' + hint);
         }

         this._batchUpdateCount--;
         if (this._batchUpdateCount === 0) {
            this._endBatchUpdateFinish(hint);
         }
      },

      /**
       * Создаёт функцию-обёртку, запускающую заданную функцию внутри пакета (через runInBatchUpdate)
       * @param {String} hint Имя пакета, для отладки.
       * @param {Function|String} callback Оборачиваемая функция, или имя поля объекта this, в котором она содержится.
       * Если указано имя поля, то функция с этим именем будет при каждом вызове находиться динамически.
       * Это полезно для оборачивания таких функций класса, которые могут меняться динамически.
       * @param {Object} thisObject Контекст, в котором будет вызываться оборачиваемая функция.
       * Если не указан, то контекстом будет this, актуальный на момент вызова обёртки.
       * @returns {Function}
       */
      createBatchUpdateWrapper: function(hint, callback, thisObject) {
         return this._createBatchUpdateWrapperOpts({
            hint: hint,
            callback: callback,
            thisObject: thisObject
         });
      },

      /**
       * То же, что и createBatchUpdateWrapper, кроме того, что, если переданная в параметре callback функция вернёт Deferred, то пакет закончится сразу,
       * не дожидаясь готовности этого Deferred-а.
       * @param {String} hint Имя пакета, для отладки.
       * @param {Function|String} callback См. документацию по функции createBatchUpdateWrapper
       * @param {Object} [thisObject] См. документацию по функции createBatchUpdateWrapper
       * @returns {*}
       */
      createBatchUpdateWrapperNoWaitDeferred: function(hint, callback, thisObject) {
         return $ws.single.ControlBatchUpdater._createBatchUpdateWrapperOpts({
            hint: hint,
            waitDeferredResult: false,
            callback: callback,
            thisObject: thisObject
         });
      },

      _createBatchUpdateWrapperOpts: function(options) {
         var updater = this,
             opts = $ws.helpers.reduce(options, function(res, v, k) {
                res[k] = v;
                return res;
             }, {});

         if (typeof opts.callback === 'string') {
            var funcName = opts.callback;
            opts.callback = function() { return this[funcName].apply(this, arguments); };
         }

         if (opts.thisObject) {
            return function() {
               opts.args = arguments;
               try {
                  return updater._runInBatchUpdateOpts(opts);
               } finally {
                  opts.args = null;
               }
            };
         }
         else {
            return function() {
               opts.args = arguments;
               opts.thisObject = this;
               try {
                  return updater._runInBatchUpdateOpts(opts);
               } finally {
                  opts.thisObject = null;
                  opts.args = null;
               }
            };
         }
      },

      runInBatchUpdate: function(callback, thisObject, args) {
         return this._runInBatchUpdate('', thisObject, callback, args);
      },

      _runInBatchUpdate: function(hint, thisObject, callback, args) {
         return this._runInBatchUpdateOpts({
            hint: hint,
            thisObject: thisObject,
            callback: callback,
            args: args
         });
      },

      _runInBatchUpdateOpts: function(options) {
         var opts = options || {},
             hint = opts.hint,
             thisObject = opts.thisObject,
             callback = opts.callback,
             args = opts.args,
             waitDeferredResult = opts.waitDeferredResult !== undefined ? opts.waitDeferredResult : true;

         function batchRun() {
            var self = this, isSimple = true, deferredOk = false;

            function makeEndHandler(descr) { return function(res) { self.endBatchUpdate(hint); return res; }; }
            function logLockedError(descr) {
               $ws.single.ioc.resolve('ILogger').error('ControlBatchUpdater',
                  '_runInBatchUpdate: нельзя добавить обработчик в ' + descr + ': обработчики заблокированы. hint: ' + hint);
            }

            this.beginBatchUpdate(hint);
            try {
               var result = callback.apply(thisObject, args || []);

               if (result instanceof $ws.proto.Deferred ) {
                  isSimple = false;
                  if (waitDeferredResult) {
                     if (result.isCallbacksLocked())
                        logLockedError('Deferred');
                     else {
                        result.addCallbacks(makeEndHandler('Deferred'), makeEndHandler('Deferred Error'));
                        deferredOk = true;
                     }
                  }
               } else if (result instanceof $ws.proto.ParallelDeferred) {
                  isSimple = false;
                  if (waitDeferredResult) {
                     if (result.getResult().isCallbacksLocked())
                        logLockedError('ParallelDeferred');
                     else {
                        result.getResult().addCallbacks(makeEndHandler('Parallel Deferred'), makeEndHandler('Parallel Deferred Error'));
                        deferredOk = true;
                     }
                  }
               }
            }
            finally {
               if (isSimple) {
                  this.endBatchUpdate(hint);
               }
               else if (!waitDeferredResult) {
                  this.endBatchUpdate(hint);
               } else if (!deferredOk) {
                  this.endBatchUpdate(hint);
               }
            }

            return result;
         }

         function simpleRun() {
            return callback.apply(thisObject, args || []);
         }

         var func = this._applyUpdateInProcess ? simpleRun : batchRun;
         return func.apply(this);
      },

      getType: null,

      _getType: function(control) {
         var type = control.getContainer() && control.getContainer().attr('type');
         if (!type) {
            if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.Grid'))
               type = '@Control/Area/Grid';
            else if ($ws.helpers.instanceOfModule(control,'SBIS3.CORE.DataView'))
               type = '@Control/DataView';
            else if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.ToolBar'))
               type = '@Control/ToolBar';
            else if ($ws.helpers.instanceOfModule(control,'SBIS3.CORE.OperationsPanel'))
               type = '@Control/OperationsPanel';
            else if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.Window'))
               type = '@Control/Window';
            else if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.Dialog'))
               type = '@Control/Dialog';
            else if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.SimpleDialogAbstract'))
               type = '@Control/SimpleDialogAbstract';
            else if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.Tabs'))
               type = '@Control/Tabs';
            else if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.HTMLView'))
               type = '@Control/HTMLView';
            else if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.FiltersArea'))
               type = '@Control/FiltersArea';
            else if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.TemplatedArea'))
               type = '@Control/TemplatedArea';
            else if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.TemplatedAreaAbstract'))
               type = '@Control/TemplatedAreaAbstract';
            else if ($ws.helpers.instanceOfModule(control, 'SBIS3.CORE.AreaAbstract'))
               type = '@Control/AreaAbstract';
         }
         return type;
      },

      addComment: null,

      _addComment: function(node, comment) {
         if (!node.comments)
            node.comments = [comment];
         else
            node.comments.push(comment);
      },

      _ensureGetBatchUpdateData: function(control) {
         var data = control._getBatchUpdateData();
         if (data === undefined) {
            data = {};
            control._setBatchUpdateData(data);
         }
         return data;
      },

      _getUID: function(control) {
         var data = this._ensureGetBatchUpdateData(control);
         if (data.uid === undefined) {
            var id = control.getId(), cnt;

            if (this._uids[id] === undefined) {
               this._uids[id] = 0;
               data.uid = id;
            } else {
               cnt = this._uids[id] + 1;
               this._uids[id] = cnt;
               data.uid = id + '_' + cnt;
            }
         }
         return data.uid;
      },

      /**
       * Обновляет побочную информацию о событии, объединяет события, если нужно
       * @param {String} eventName Название события
       * @param {Boolean} merge Нужно ли объединять события
       * @param {$ws.proto.Control} control Контрол, который извещает о событии
       * @private
       */
      _checkDelayedEventName: function(eventName, merge, control) {
         var id = eventName + ':' + this._getUID(control),
             hashEl = this._delayedEventsHash[id],
             length = this._delayedEvents.length;

         if (!hashEl) {
            hashEl = this._delayedEventsHash[id] = {last: undefined};
         }

         if (hashEl.last !== undefined && merge) {
            this._delayedEvents[hashEl.last] = null;
         }

         hashEl.last = length;
      },

      addDelayedFunc: function(funcName, control, func) {
         if (funcName) {
            this._checkDelayedEventName(funcName, true, control);
         }
         this._delayedEvents.push({func: func, control: control});
      },

      /**
       * Добавляет "задержанное событие"
       * @param {String} event Название события
       * @param {Boolean} merge Нужно ли объединять события
       * @param {$ws.proto.Control} control Контрол, который посылает событие
       * @param {Array} args Параметры события
       */
      addDelayedEvent: function(event, merge, control, args) {
         if (control.getEventHandlers(event)) {
            this._checkDelayedEventName(event, merge, control);
            this._delayedEvents.push({event: event, control: control, args: args});
         }
      },

      registerDelayedAction: function(actionName, actionFunc, uniqueInGroup) {
         this._delayedActionsHash[actionName] = {
            actionFunc: actionFunc,
            uniqueInGroup: uniqueInGroup || 'DefaultActions',
            delayed: false,
            args: []
         };
      },

      _addDelayedAction: function(actionName, args) {
         var action = this._delayedActionsHash[actionName];
         if (action) {
            action.delayed = true;
            action.args = args;

            //Выключаем все иные действия в этой группе
            $ws.helpers.forEach(this._delayedActionsHash, function(actionObj) {
               if (action !== actionObj && actionObj.uniqueInGroup === action.uniqueInGroup) {
                  actionObj.delayed = false;
               }
            });
         }
      },

      runBatchedDelayedAction: function(actionName, args) {
         if (this.haveBatchUpdate()) {
            this._addDelayedAction(actionName, args);
         }
         else {
            this._runInBatchUpdate('runBatchedDelayedAction.' + actionName, this, function() {
               this._addDelayedAction(actionName, args);
            });
         }
      },

      addBatchSizeChanged: function(control, recalculateOwnSize) {
        var id = this._getUID(control), updates = this._batchUpdateControls, update = updates[id];

        if (!update) {
           update = updates[id] = {control: control, sizeChanged: true};
        }

        if (recalculateOwnSize) {
           update.recalculateOwnSize = true;
        }
      },

      _runDelayedActions: function() {
         var actions = $ws.helpers.reduce(this._delayedActionsHash, function(result, action, key) {
            if (action.delayed) {
               result.push([key, action.args]);
            }

            action.delayed = false;
            action.args = [];
            return result;
         }, []);

         $ws.helpers.forEach(actions, function(keyArgs) {
            var key = keyArgs[0], args = keyArgs[1] || [],
                action = this._delayedActionsHash[key];
            if (action) {
               action.actionFunc.apply(this, args);
            }
         }, this);
      },

      /**
       * Запускаем расчёт размеров, не влияющий на текущее состояние пакета.
       * Нужно для плавающих панелей, показываемых с анимацией, если на время анимации включен пакет,
       * чтобы посчитать размеры в промежуточном состоянии, не мешая им потом посчитаться в окончательном состоянии.
       * @param {String} hint Имя расчёта, для отладки.
       */
      applyBatchUpdateIntermediate: function(hint) {
         var span = BOOMR.plugins.WS.startBlock('applyBatchUpdateIntermediate: ' + hint);
         this._con.group('applyBatchUpdateIntermediate ', hint);
         try
         {
            this._applyBatchUpdate(hint, false);
         }
         finally
         {
            span.stop();
            this._con.log("Время: ", span.stopTime - span.startTime);
            this._con.groupEnd();
         }
      },

      _applyBatchUpdate: function(hint, isFinal) {
            var nodeRoot, nodesById,
                self = this,
                addComment = this.addComment,
                getType = this.getType,
                debugEnabled = this._debugEnabled;

            function getBatchParentNode(control) {
               var parent = control.getParent(),
                   parentId = parent && self._getUID(parent),
                   parentNode, upperParent;

               if (parentId) {
                  parentNode = nodesById[parentId];
                  if (!parentNode) {
                     upperParent = getBatchParentNode(parent);

                     parentNode = {control: parent, type: getType(parent), children: {}};
                     upperParent.children[parentId] = parentNode;
                     nodesById[parentId] = parentNode;
                  }
               }
               else {
                  parentNode = nodeRoot;
               }

               return parentNode;
            }

            function haveAutoSize(node) {
               return node.control._haveAutoSize();
            }

            function getControls(nodes) {
               return $ws.helpers.map(nodes, function(node) {return node.control; });
            }

            function isControlVisible(control, visibleParentContainer) {
               //Здесь visibleParentContainer гарантированно видимый.
               // Это гарантируется тем, что isControlVisible вызывается только для контрола, у которого или нет родителя, или вся цепочка родителей видимая.
               // Это же гарантируется тем, что для контрола с невидимыми родителями всегда будет recalkNode/forceRecalkParent=true, и isControlVisible не вызовется.

               var result = control.isVisible(), node;
               if (result) {
                  node = control.getContainer();
                  //Проверяем узел и его родителей до visibleParentContainer
                  do {
                     result = !node.hasClass('ws-hidden');
                     node = node.parent();
                  } while (result && node.length !== 0 && node.get(0) !== visibleParentContainer);
               }
               return result;
            }

            function enumAllChildren(node, func) {
               $ws.helpers.forEach(node.children || {}, function(node) {
                  enumAllChildren(node, func);
                  func(node);
               });
            }

            function delayRecalkNode(node) {
               var control = node.control, cnt = 0;

               function processNode(node) {
                  var nodeUpdate = node.update, data, delayedRecalkData;
                  if (nodeUpdate && nodeUpdate.sizeChanged) {
                     data = self._ensureGetBatchUpdateData(control);
                     delayedRecalkData = data.delayedRecalkData;

                     if (delayedRecalkData === undefined) {
                        delayedRecalkData = [];
                        data.delayedRecalkData = delayedRecalkData;
                     }

                     delayedRecalkData.push({control: node.control, recalculateOwnSize: !!nodeUpdate.recalculateOwnSize});
                     cnt++;
                  }
               }

               enumAllChildren(node, processNode);
               processNode(node);

               addComment(node, 'невидимый');
               if (cnt !== 0 && debugEnabled) {
                  addComment(node, 'отложено ' + cnt + ' элементов');
               }
            }

            //алгоритм сейчас сделан только для пакетного _onSizeChanged. для добавления пакетного onResize надо усложнять его
            function recalkNode(node, forceRecalkParent, visibleParentContainer) {
               var update = node.update || self._dummyUpdate,
                   noChildren = !node.children || Object.isEmpty(node.children),
                   haveOnSizeChangedFired = update.sizeChanged,
                   control = node.control,
                   visible = forceRecalkParent || isControlVisible(control, visibleParentContainer),
                   forceRecalk = !visible && control._needRecalkInvisible(),
                   dirtyNodes, result, dirty, hasAutoSize, controlContainerNode;

               if (visible || forceRecalk) {
                  if (!visible) {
                     addComment(node, 'невидимый - всё равно пересчитываем');
                     delayRecalkNode(node);
                  }

                  hasAutoSize = haveAutoSize(node);
                  control._beforeChildrenBatchCalc && control._beforeChildrenBatchCalc();
                  try
                  {
                     controlContainerNode = control.getContainer();
                     controlContainerNode = controlContainerNode && controlContainerNode.get(0);
                     dirtyNodes = $ws.helpers.filter(node.children, function(node) {
                        return recalkNode(node, forceRecalk || forceRecalkParent, controlContainerNode || visibleParentContainer);
                     });

                     if (!noChildren && debugEnabled) {
                        addComment(node, hasAutoSize ? 'прозрачный' : 'непрозрачный');
                        addComment(node, dirtyNodes.length + ' изм.');
                     }

                     result = haveOnSizeChangedFired || ((dirtyNodes.length > 0) && hasAutoSize);

                     if (dirtyNodes.length > 0 || (update.recalculateOwnSize)) {
                        dirty = control._onSizeChangedBatch(getControls(dirtyNodes));
                        if (!dirty) {
                           result = false;
                        }

                        if (isFinal && control.hasEventHandlers('onBatchFinished')) {
                           control._notifyBatchDelayed('onBatchFinished');
                        }

                        //Это может быть не-контейнер, например, браузер. Тогда он не должен onResize рассылать в конце расчёта.
                        node.needSendOnResize = !!control._onResizeHandlerBatch;

                        if (debugEnabled) {
                           if (node.needSendOnResize) {
                              addComment(node, 'пакетный - есть изм. узлы! - ' + (dirty ? 'есть изм.' : 'нет изм.'));
                           }
                           else {
                              addComment(node, 'пакетный - пересчёт себя (нет изм. дочерних)');
                           }
                        }
                     } else if (debugEnabled) {
                        addComment(node, noChildren ? 'пакетный - листовой' : 'пакетный - нет изм. узлов');
                     }
                  } finally {
                     control._afterChildrenBatchCalc && control._afterChildrenBatchCalc();
                  }
               }
               else {
                  delayRecalkNode(node);
                  result = haveOnSizeChangedFired;
               }

               return result;
            }

            function sendOnResize(node, parentSent) {
               if (node.needSendOnResize && !parentSent) {
                  parentSent = true;
                  node.control._onResizeHandlerBatch();
                  addComment(node, '*');
               }

               if (!parentSent) {
                  $ws.helpers.forEach(node.children, function(node) {
                     sendOnResize(node, parentSent);
                  });
               }
            }

            function printNode(node) {
               var i, l, nodeStr, comments;

               nodeStr = node.type + ' (' + (node.control ? (self._getUID(node.control) + ' - ') : '') + ') ';

               comments = node.comments || [];
               for (i = 0, l = comments.length; i < l; i++) {
                  nodeStr += (comments[i] + ((i < l - 1) ? ', ' : ''));
               }

               if (!Object.isEmpty(node.children)) {
                  self._con.group(nodeStr, node.control && node.control.getContainer());
                  $ws.helpers.forEach(node.children, printNode);
                  self._con.groupEnd();
               }
               else {
                  self._con.log(nodeStr, node.control && node.control.getContainer());
               }
            }

            function doUpdate() {
               nodeRoot = {control: null, children: {}};
               nodesById = {};

               //если в пакетной обработке будет не только onSizeChanged - нужна доработка построения дерева и его обхода
               this._con.group('_applyBatchUpdate: ' + hint);

               $ws.helpers.forEach(this._batchUpdateControls, function(update, id) {
                  var control = update.control;
                  if (control && !control.isDestroyed()) {
                     var
                        type = getType(control),
                        parentNode = getBatchParentNode(control),
                        child;

                     if (parentNode !== nodeRoot || update.recalculateOwnSize) {
                        child = parentNode.children[id];
                        if (child) {
                           child.control = control;
                           child.type = type;
                        }
                        else {
                           child = {control: control, type: type, children: {}};
                           parentNode.children[id] = child;
                           nodesById[id] = child;
                        }
                        child.update = update;
                     }
                  }
               }, this);

               if (isFinal) {
                  this._batchUpdateControls = {};
               }

               var rootContainer = $('html').get(0);
               $ws.helpers.forEach(nodeRoot.children, function(node) { recalkNode(node, false, rootContainer); });

               sendOnResize(nodeRoot, false);

               if (this._debugEnabled) {
                  printNode(nodeRoot);
               }

               this._con.groupEnd();
            }

         this._applyUpdateInProcess = true;
         try
         {
            doUpdate.apply(this);
            if (isFinal && !Object.isEmpty(this._batchUpdateControls)) {
               doUpdate.apply(this);
            }
         }
         finally
         {
            if (isFinal) {
               this._batchUpdateControls = {};
            }
            this._applyUpdateInProcess = false;
         }
      },

      haveBatchUpdate: function() {
         return this._batchUpdateCount > 0;
      },

      haveApplyUpdateInProcess: function() {
         return this._applyUpdateInProcess;
      },

      _needDelayedRecalk: function(control) {
         var data = control._getBatchUpdateData();
         return data && data.delayedRecalkData;
      },

      _doDelayedRecalk: function(control) {
         var self = this,
            controlUpdates = control._getBatchUpdateData(),
            updatesStep1 = (controlUpdates && controlUpdates.delayedRecalkData),
            updatesStep2 = $ws.helpers.reduce(updatesStep1, function(memo, update) {
               if (control !== update.control)
                  memo.push(update);
               return memo;
            }, []);

         if (controlUpdates) {
            delete controlUpdates.delayedRecalkData;
         }

         function getHint(step) {
            var hint;
            if (self._debugEnabled) {
               hint = '_doDelayedRecalk: ' + step + self.getType(control) + ': ' + self._getUID(control);
            }
            else {
               hint = '_doDelayedRecalk ' + step;
            }

            return hint;
         }

         function processUpdates(step, updates) {
            function sendSizeChangedUpdates() {
               $ws.helpers.forEach(updates, function(update) {
                  var control = update.control;
                  if (control && !control.isDestroyed()) {
                     control._notifyOnSizeChanged(control, control, update.recalculateOwnSize);
                  }
               }, this);
            }

            self._runInBatchUpdate(getHint(step), self, sendSizeChangedUpdates);
         }

         processUpdates('-1 шаг-', updatesStep1);

         this.addDelayedFunc('doDelayedRecalk -2 шаг-', control, function() { processUpdates('-2 шаг-', updatesStep2); });
      }
   }))();


   $ws.single.ControlBatchUpdater.registerDelayedAction('Control.focus', function(control) {
      function findScrollable(el) {
         if (el.size() === 0) { //если элемент пустой, то это конец иеарархии "оторванного" фрагмента документа. там не надо ничего прокручивать
            return $(null);//даст jquery-элемент, у которого size()=0
         } else {
            var nodeType = el.prop('nodeType');
            if (nodeType === 9) { //Если дошли до документа, то отдать его владельца - window. будем запоминать и восстанавливать его прокрутку
               return $(el.prop('defaultView') || el.prop('parentWindow'));//parentWindow - для IE8
            }
            else if (nodeType === 1 && $ws.helpers.isScrollable(el, 'y') && $ws.helpers.hasScrollbar(el, 'y')) {
               return el;//нашли родительский элемент с прокруткой. будем запоминать и восстанавливать её.
            } else {
               return findScrollable(el.parent());
            }
         }
      }

      if (!control.isDestroyed()) {
         var toFocus = control.isEnabled() ? control._getElementToFocus() : control._container,
             isMobile = $ws._const.browser.isMobileAndroid || $ws._const.browser.isMobileSafari,
             scrollTop;

         if(!isMobile && toFocus && toFocus.focus){
            var scrollable = findScrollable(toFocus.parent());
            if (scrollable.size() > 0) {
               //В случае body прокрутка на самом деле находится в window - у него и надо будет её запоминать и восстанавливать
               if (scrollable.is($ws._const.$body)) {
                  scrollable = $ws._const.$win;
               }

               scrollTop = scrollable.scrollTop();
               toFocus.focus();
               scrollable.scrollTop(scrollTop);
            }
         }
      }
   }, 'FocusActions');


   /**
    * Абстрактный визуальный элемент управления
    *
    * @class $ws.proto.Control
    * @extends  $ws.proto.Abstract
    *

    * @noShow
    */

   $ws.proto.Control = $ws.proto.Abstract.extend(/** @lends $ws.proto.Control.prototype */{
      /**
       * @event onChange При изменении значения пользователем или из контекста
       * Событие происходит, когда пользователь изменяет значение контрола.
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {*} value Текущее значение контрола.
       * @example
       * 1. В зависимости от значения выпадающего списка (fieldDropdown) фильтровать табличное представление (tableView).
       * <pre>
       *    fieldDropdown.subscribe('onChange', function(eventObject, value) {
       *       //здесь value в формате number
       *       var filter = this.getValueByKey(value.toString());
       *       tableView.setQuery({'Состояние': filter});
       *    });
       * </pre>
       *
       * 2. В зависимости от значения поля ввода (fieldString) фильтровать табличное представление (tableView).
       * <pre>
       *    fieldString.subscribe('onChange', function(eventObject, value) {
       *       //здесь value в формате string
       *       tableView.setQuery({'Название': value});
       *    });
       * </pre>
       * @see value
       * @see onValueChange
       */
      /**
       * @event onFocusIn При установке фокуса на контрол
       * Событие происходит, когда контрол получает фокус: клик по контролу, через клавишу Tab или с помощью {@link setActive}.
       * Не сработает второй раз, если контрол считает, что уже имеет фокус.
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * 1. При переходе фокуса на поле ввода (fieldString) открыть подсказку Инфобокс.
       * <pre>
       *    fieldString.subscribe('onFocusIn', function() {
       *       var message = 'Поле для ввода логина';
       *       if (!this.getValue()) {
       *          message += ' Обязательно для заполнения!';
       *       }
       *       $ws.single.Infobox.show(this.getContainer(), message);
       *    });
       * </pre>
       *
       * 2. При переходе фокуса на строку поиска (searchString) открыть автодополнение (suggest).
       * <pre>
       *    searchString.subscribe('onFocusIn', function() {
       *       suggest.show();
       *    });
       * </pre>
       * @see tabindex
       * @see onFocusOut
       * @see setActive
       * @see isActive
       */
      /**
       * @event onFocusOut При потере фокуса
       * Событие происходит в момент потери контролом фокуса.
       * Происходит в двух случаях: какой-то другой контрол получил фокус (именно контрол), или вызвали {@link destroy}
       * у контрола с фокусом (при этом не ясно, куда перешёл фокус).
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Boolean|undefined} destroyed Произошла ли потеря фокуса в следствие разрушения контрола.
       * @param {$ws.proto.Control|undefined} focusedControl Контрол, на который ушёл фокус. Если контрол неизвестен, то undefined.
       * @example
       * Поле ввода (fieldString1) предназначено для указания номера жилого дома.
       * Если поле ввода (fieldString1) теряет фокус, то получить значение, введённое пользователем.
       * Подключиться к базе данных, по номеру дома найти почтовый индекс и вставить его в другое поле (fieldString2).
       * <pre>
       *    fieldString1.subscribe('onFocusOut', function() {
       *       //создаём объект бизнес-логики
       *       var bl = new $ws.proto.BLObject('АдреснаяКнига'),
       *           self = this,
       *           //улица, которую пользователь выбирает из выпадающего списка
       *           street = fieldDropdown.getStringValue();
       *       //вызываем метод бизнес-логики
       *       bl.call('ПолучитьИндекс', {'Улица': street, 'Дом': self.getValue()}, $ws.proto.BLObject.RETURN_TYPE_RECORD)
       *       .addCallBack(function(record) {
       *          //предполагается, что на выбранной улице находится только один дом с указанным номером
       *          var array = record.getDataRow();
       *          fieldString2.setValue(array[0]);
       *       });
       *    });
       * </pre>
       * @see onFocusOut
       * @see destroy
       * @see tabindex
       * @see setActive
       * @see isActive
       */
      /**
       * @event onKeyPressed При нажатии клавиши
       * Событие происходит при нажатии клавиши, когда контрол находится в фокусе.
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Event} event Произошедшее JavaScript событие. Содержит код клавиши в поле which.
       * @return Если вернуть из события false, контрол не будет обрабатывать данное нажатие клавиши.
       * @example
       * 1. Удалять содержимое поля ввода (fieldString) по нажатию клавиши Del.
       * <pre>
       *    fieldString.subscribe('onKeyPressed', function(eventObject, event) {
       *       if (event.which == $ws._const.key.del) {
       *          this.setValue('');
       *       }
       *    });
       * </pre>
       *
       * 2. При нажатии клавиши Enter в поле ввода (fieldString) сохраним запись.
       * <pre>
       *    fieldString.subscribe('onKeyPressed', function(eventObject, event) {
       *       if (event.which == $ws._const.key.enter) {
       *          this.getTopParent().updateRecord();
       *       }
       *    });
       * </pre>
       */
      /**
       * @event onClick При клике на контрол
       * Событие происходит при клике пользователем по контролу.
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * 1. При клике по полю связи (fieldLink) сбросить значение связи.
       * <pre>
       *    fieldLink.subscribe('onClick', function(eventObject) {
       *       this.getLinkedContext().setValue("@Лицо", null);
       *    });
       * </pre>
       *
       * 2. При клике на поле ввода (fieldString) открыть всплывающую подсказку.
       * <pre>
       *    filedString.subscribe('onClick', function() {
       *       $ws.single.Infobox.show(this.getContainer(), 'Придумайте пароль, используя цифры и буквы латинского алфавита.');
       *    });
       * </pre>
       */
      /**
       * @event onStateChanged При изменении состояния контрола
       * Событие происходит при смене состояния контрола.
       * Поднимается первый раз без аргументов, тем самым контрол сообщает, что готов к приёму состояния.
       * Последующие события обычно поднимаются с аргументом, соответствующим состоянию контрола.
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {*}                     state     Состояние контрола.
       * @param {Boolean}               replace     Не записывать состояние в историю браузера
       * @param {Boolean}               force       Игнорировать флаг applied
       * @example
       * При изменении состояния запомним адрес страницы.
       * <pre>
       *    control.subscribe('onStateChanged', function(eventObject, state) {
       *       window.previousPageUrl = window.location;
       *    });
       * </pre>
       * @see applyState
       * @see applyEmptyState
       * @see stateKey
       * @see setStateKey
       * @see getStateKey
       */
      /**
       * @event onSizeChanged При изменении размеров
       * Событие происходит при изменении размеров контрола.
       * @deprecated Это событие больше не поддерживается. Пользуйтесь вместо него событием onResize
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * Если ширина табличного представления (tableView) станет меньше 500 px, то скроем одну колонку.
       * <pre>
       *    tableView.subscribe('onSizeChanged', function(eventObject) {
       *       if (this.getContainer().width() <= 500)
       *          this.toggleColumn('Примечание', false);
       *    });
       * </pre>
       */
      /**
       * @event onTooltipContentRequest Получение содержимого расширенной подсказки поля
       * <wiTag group="Управление">
       * Используется для отмены или модификации текста подсказки.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String}                message     Сообщение для отображения.
       * @return
       * <ol>
       *    <li>$ws.proto.Deferred - дожидаемся результата, воспринимаем его как текст подсказки.
       *    На время ожидания в подсказке отображается текст "Загрузка...".</li>
       *    <li>Строка - отображается заданный текст.</li>
       *    <li>false - отменяется отображение подсказки.</li>
       * </ol>
       * @example
       * <pre>
       *    function asyncGetTextFromServer() {
       *       var dR = new $ws.proto.Deferred();
       *       // ... some async
       *       return dR;
       *    }
       *    control.subscribe('onTooltipContentRequest', function(eventObject, message) {
       *       //если исходный текст подсказки содержит подстроку ...
       *       if (message.indexOf('some string') != -1) {
       *          //не будем ее показывать
       *          eventObject.setResult(false);
       *       } else {
       *          //иначе запросим подсказку с сервера
       *          eventObject.setResult(asyncGetTextFromServer());
       *       }
       *    });
       * </pre>
       * @see extendedTooltip
       * @see setExtendedTooltip
       * @see getExtendedTooltip
       */
      $protected: {
         /**
          * @cfg {String|jQuery|HTMLElement} element Элемент, на котором строится контрол
          * <wiTag group="Отображение">
          * Можно передать:
          * <ol>
          *    <li>строку - будет рассмотрено как идентификатор DOM-элемента.</li>
          *    <li>DOM-элемент.</li>
          *    <li>jQuery-объект.</li>
          * </ol>
          * @example
          * <pre>
          *    //если будем передавать строку
          *    var MyElement = 'myElementID';
          *    //если будем передавать DOM-элемент
          *    var MyElement = document.getElementById('elementID');
          *    //если будем передавать jQuery-объект
          *    var MyElement = $('.my-class-name');
          *    //передаём заданный элемент
          *    var myTemplatedArea = attachInstance('SBIS3.CORE.TemplatedArea', {
          *       element : MyElement
          *    });
          * </pre>
          * @noShow
          */
         _container : undefined,
         _prevState : undefined,  //Предыдущее состояние
         _isControlActive: false,
         _id: '',
         /**
          * @cfg {$ws.proto.AreaAbstract} parent Родительский элемент управления
          * Это тот контрол, на котором находится элемент.
          * Получить можно методом {@link getParent}, который вернет ближайшего родителя.
          * Другой метод {@link getTopParent} возвращает самого первого родителя - диалог или область страницы.
          * <wiTag group="Управление">
          * @example
          * <pre>
          *    // По кнопке получим диалог и обновим его запись
          *    control.getTopParent().updateRecord();
          * </pre>
          * Также можно получить родителя по классу
          * <pre>
          *    control.getParentByClass($ws.proto.DialogRecord);
          * </pre>
          * и даже по имени
          * <pre>
          *    control.getParentByName('Редактирование контакта');
          * </pre>
          * @see getParent
          * @see getTopParent
          * @see getParentByName
          * @noShow
          */
         _parent: null,
         /**
          * @cfg {$ws.proto.Context} linkedContext Связанный с данным элементом контекст
          * Это тот контекст, из которого данный контрол будет забирать данные.
          * Получить связанный с элементом контекст можно методом {@link getLinkedContext}.
          * <wiTag group="Управление">
          * @example
          * <pre>
          *    control.getLinkedContext().setValue(control.getName(), 'my value');
          * </pre>
          * @see getLinkedContext
          * @noShow
          */
         _context: false,
         _keysWeHandle : [],
         _isVisible: true,
         _minHeight: null,
         _margins: {},
         _horizontalAlignment: 'Stretch',
         _verticalAlignment: 'Top',
         _batchUpdateData: undefined,
         _aliasForContent : '', //указывает какому полю из опций соответствует поле content

         _lastOnSizeChangedWidth: undefined,
         _lastOnSizeChangedHeight: undefined,

         _underCursor : false,
         _initiatedByCursor: false,

         _infoboxHandlerBound: null,
         _owner: null,
         _userData: undefined,
         _runtimeMarkup: false, //дает понять как строилась верстка для компонента (если true, то строили разметку в конструкторе)
         _tooltipSettings: {
            handleFocus: true,
            handleHover: true
         },

         _options: {
            /**
            * @cfg {String|undefined} Привязка по горизонтали
            * Определяет положение контрола по горизонтали.
            *
            * Возможные значения:
            * <ol>
            * <li>Left - фиксирует положение левого края контрола. При сдвиге левого края родительского контейнера
            * контрол сдвинется вместе с ним так, что расстояние от его левого края до левого края родительского
            * контейнера не изменится.</li>
            * <li>Right - фиксирует положение правого края контрола. При сдвиге правого края родительского контейнера
            * контрол сдвинется вместе с ним так, что расстояние от его правого края до правого края родительского
            * контейнера не изменится.</li>
            * <li>Stretch - фиксирует положение левого и правого краёв контрола. При изменении размеров родительского
            * контейнера изменятся размеры контрола, при этом расстояния до указанных краёв останутся прежними.</li>
            * </ol>
            * <wiTag group="Отображение">
            * @see getAlignment
            * @see verticalAlignment
            * @noShow
            */
            horizontalAlignment: undefined,
            /**
             * @cfg {String|undefined} Привязка по вертикали
             * Определяет положение контрола по вертикали.
             *
             * Возможные значения:
             * <ol>
             * <li>Bottom - фиксирует положение нижнего края контрола. При сдвиге нижнего края родительского контейнера
             * контрол сдвинется вместе с ним так, что расстояние от его нижнего края до нижнего края родительского
             * контейнера не изменится.</li>
             * <li>Stretch - фиксирует положение нижнего и верхнего краёв контрола. При изменении размеров родительского
             * контейнера изменятся размеры контрола, при этом расстояния до указанных краёв останутся прежними.</li>
             * <li>Top - фиксирует положение верхнего края контрола. При сдвиге верхнего края родительского контейнера
             * контрол сдвинется вместе с ним так, что расстояние от его верхнего края до верхнего края родительского
             * контейнера не изменится.</li>
             * </ol>
             * <wiTag group="Отображение">
             * @see getAlignment
             * @see horizontalAlignment
             * @noShow
             */
            verticalAlignment: undefined,
            /**
             * @cfg {String} Имя контрола
             * Имя - уникальное название, выделяющее контрол среди других элементов веб-страницы.
             * Иными словами, это "идентификатор", по которому можно получить экземпляр класса контрола.
             *
             * Имя следует давать осмысленно, максимально характеризуя предназначение контрола.
             * Если имя состоит из нескольких слов, то они пишутся слитно, каждое с заглавной буквы.
             *
             * Имена контролов, находящихся в одной области видимости, не должны совпадать.
             * В противном случае по общему имени будет доступен один контрол, который раньше других объявлен на веб-странице.
             * <wiTag group="Данные">
             * @example
             * <pre>
             *    $ws.core.attachInstance('SBIS3.CORE.FieldString', {
             *       element: 'div_vWlmQMp3Jdf',
             *       name: 'ФильтрДокументов',
             *       tabindex: 2
             *    });
             * </pre>
             * @see getName
             * @see getByName
             * @see getChildControlByName
             * @see getParentByName
             */
            name: '',
            /**
             * @cfg {Boolean} Активность контрола
             * Активность определяет возможность взаимодействия пользователя с контролом.
             * Для контрола контейнерного типа, enabled - меняет состояние всех дочерних элементов.
             *
             * Возможные значения:
             * <ol>
             *    <li>true - контрол активен.</li>
             *    <li>false - контрол неактивен.</li>
             * </ol>
             * <wiTag group="Управление">
             * @example
             * Если сброшен флаг (fieldCheckbox), то кнопка (btn) недоступна для клика.
             * <pre>
             *    fieldCheckbox.subscribe('onValueChange', function(eventObject, value) {
             *       btn.setEnabled(value);
             *    });
             * </pre>
             * @see setEnabled
             * @see isEnabled
             * @see allowChangeEnable
             * @see isAllowChangeEnable
             * @see setAllowChangeEnable
             */
            enabled: true,
            /**
             * @cfg {Boolean} Возможность изменения активности контрола
             *
             * Возможные значения:
             * <ol>
             *    <li>true - разрешить изменять активность контрола.</li>
             *    <li>false - запретить.</li>
             * </ol>
             * <wiTag group="Управление">
             * @example
             * При готовности контрола изменить его активность, если такая операция разрешена.
             * <pre>
             *    control.subscribe('onReady', function() {
             *       if (this.isAllowChangeEnabled()) {
             *          this.setEnabled(!this.isEnabled());
             *       }
             *    });
             * </pre>
             * @see enabled
             * @see setEnabled
             * @see isEnabled
             * @see isAllowChangeEnable
             * @see setAllowChangeEnable
             */
            allowChangeEnable: true,
            /**
             * <wiTag noShow>
             */
            width: '',
            /**
             * <wiTag noShow>
             */
            height: '',
            /**
             * <wiTag noShow>
             */
            minWidth: 0,
            /**
             * <wiTag noShow>
             */
            minHeight: 0,
            /**
             * <wiTag noShow>
             */
            maxWidth: Infinity,
            /**
             * <wiTag noShow>
             */
            maxHeight: Infinity,
            /**
             * @cfg {String|null} Владелец контрола
             * Владелец - это контрол, с которым установлена односторонняя связь.
             * К нему приходят необработанные команды от других контролов, которыми он владеет.
             *
             * Значение null говорит об отсутствии владельца.
             * <wiTag group="Управление">
             * @example
             * При клике на кнопку (btn) перезагрузить табличное представление.
             * <pre>
             *    btn.subscribe('onClick', function() {
             *       //this.getOwner() - табличное представление
             *       this.getOwner().reload();
             *    });
             * </pre>
             * @see getOwner
             * @see setOwner
             * @see getOwnerId
             * @see makeOwnerName
             * @editor InternalComponentChooser
             * @noShow
             */
            owner: null,
            /**
             * @cfg {String} Текст всплывающей подсказки
             * Текст простой всплывающей подсказки при наведении курсора мыши.
             * <wiTag group="Отображение">
             * @example
             * Каждому флагу установить всплывающую подсказку как подпись флага.
             * <pre>
             *    var names = groupCheckbox.getValue().getColumns();
             *    $ws.helpers.forEach(names, function(element) {
             *       var flag = groupCheckbox.getChildControlByName(element);
             *       flag.setTooltip(flag.getFlagCaption(element));
             *    });
             * </pre>
             * @translatable
             * @see setTooltip
             * @see getTooltip
             */
            tooltip: '',
            /**
             * @cfg {String|Boolean} Текст расширенной подсказки
             * Текст расширенной подсказки, отображаемой в всплывающей панели ({@link $ws.proto.Infobox}).
             *
             * Возможные значения:
             * <ol>
             *    <li>Текст расширенной подсказки.</li>
             *    <li>true - расширенная подсказка включена, но её текст не задан.</li>
             *    <li>false - расширенная подсказка отключена.</li>
             * </ol>
             * <wiTag group="Отображение">
             * <wiTag class="GroupCheckBox" noShow>
             * @example
             * При наведении курсора на контрол показать подсказку с текущими датой и временем.
             * <pre>
             *    //включаем расширенную подсказку
             *    control.setExtendedTooltip(true);
             *    control.subscribe('onTooltipContentRequest', function(event, originalMessage) {
             *       event.setResult('Подсказка запрошена в ' + new Date());
             *    });
             * </pre>
             * @see onTooltipContentRequest
             * @see setExtendedTooltip
             * @see getExtendedTooltip
             */
            extendedTooltip: false,
            /**
             * @cfg {Boolean} Видимость контрола
             * Видимость - это отображение на веб-странице.
             * Место за скрытым контролом не резервируется и веб-страница формируется так, будто контрола не существует.
             *
             * Возможные значения:
             * <ol>
             *    <li>true - контрол виден.</li>
             *    <li>false - контрол скрыт.</li>
             * </ol>
             * <wiTag group="Отображение">
             * @example
             * В зависимости от значения выпадающего списка (fieldDropdown) изменить видимость контрола.
             * <pre>
             *    fieldDropdown.subscribe('onChange', function(eventObject, value) {
             *       control.toggle(value != 2);
             *    });
             * </pre>
             * @see hide
             * @see show
             * @see toggle
             * @see isVisible
             */
            visible: true,
            /**
             * @cfg {Number|false} Табиндекс контрола
             * Свойство табиндекс определяет последовательность перехода фокуса между контролами.
             * Переход фокуса происходит при нажатии на клавишу Tab или при помощи метода {@link setActive}.
             *
             * Значением табиндекса может быть любое натуральное число.
             * Если табиндекс меньше 1, то он игнорируется, и переход к контролу при нажатии клавиши Tab не производится.
             * Переход фокуса между контролами осуществляется от меньшего к большему значению табиндекса.
             *
             * Если активен модальный диалог, то фокус с него не уходит.
             * <wiTag group="Управление">
             * @example
             * Когда контрол будет готов, задать ему табиндекс = 1.
             * <pre>
             *    control.subscribe('onReady', function() {
             *       if (this.getTabindex() > 1)
             *          this.setTabindex(1);
             *    });
             * </pre>
             * @see getTabindex
             * @see setActive
             * @see setTabindex
             */
            tabindex : -1,
            /**
             * @cfg {String} Дополнительный CSS-класс контрола
             * Дополнительный CSS-класс, который будет присвоен контейнеру контрола.
             * Этот класс добавляется при построении контрола в атрибут class к уже заданным CSS-классам.
             * <wiTag group="Отображение">
             * @example
             * <pre>
             *     var container = $('#myFutureContainer');
             *     var myTemplatedArea = attachInstance('SBIS3.CORE.TemplatedArea', {
             *        //устанавливаем CSS-класс "mySuperContainer", описанный заранее
             *        className: 'mySuperContainer',
             *        element: container,
             *        parent: self.getParent()
             *     });
             *
             *     //атрибут контейнера контрола до добавления дополнительного CSS-класса
             *     class="ws-enabled ws-has-focus"
             *     //атрибут контейнера контрола после добавления дополнительного CSS-класса
             *     class="ws-enabled ws-has-focus mySuperContainer"
             * </pre>
             * @see setClassName
             * @see getClassName
             */
            className : '',
            /**
             * <wiTag noShow>
             */
            zIndex: undefined,
            /**
             * @cfg {Boolean} Автовысота
             * Будет ли контрол подстраиваться по высоте под своё содержимое.
             *
             * Возможные значения:
             * <ol>
             *    <li>true - контрол будет подстраиваться по высоте под своё содержимое.</li>
             *    <li>false - не будет подстраиваться по высоте.</li>
             * </ol>
             * <wiTag group="Отображение">
             * @example
             * <pre>
             *     var dfr = attachInstance('SBIS3.CORE.TemplatedArea', {
             *        autoHeight: true,
             *        element: container,
             *        parent: this.getParent()
             *     });
             * </pre>
             * @see autoWidth
             * @noShow
             */
            autoHeight: true,
            /**
             * @cfg {Boolean} Автоширина
             * Будет ли контрол подстраиваться по ширине под своё содержимое.
             *
             * Возможные значения:
             * <ol>
             *    <li>true - контрол будет подстраиваться по ширине под своё содержимое.</li>
             *    <li>false - не будет подстраиваться по ширине.</li>
             * </ol>
             * <wiTag group="Отображение">
             * @example
             * <pre>
             *     var dfr = attachInstance('SBIS3.CORE.TemplatedArea', {
             *        autoWidth : true,
             *        element : container,
             *        parent : this.getParent()
             *     });
             * </pre>
             * @see autoHeight
             * @noShow
             */
            autoWidth: false,
            /**
             * <wiTag noShow>
             */
            saveState : false,
            /**
             * @cfg {String} Ключ для идентификации состояния
             * Ключ, который используется для идентификации состояния контрола в {@link $ws.single.NavigationController}`e.
             * <wiTag group="Управление">
             * @see applyEmptyState
             * @see applyState
             * @see setStateKey
             * @see getStateKey
             * @see onStateChanged
             * @noShow
             */
            stateKey: '',
            /**
             * <wiTag noShow>
             */
            isRelative:false,
            /**
             * @cfg {Boolean} Часть составного контрола
             * Является ли контрол подконтролом какого-то другого, составного контрола.
             * <wiTag group="Управление">
             * @example
             * Если кнопка (btn) - это подконтрол, то подписать её на отправку команды.
             * <pre>
             *    if (btn.isSubControl()) {
             *       btn.subscribe('onClick', function() {
             *          this.sendCommand('clear');
             *       });
             *    }
             * </pre>
             * @see isSubControl
             * @noShow
             */
            subcontrol: false,
            /**
             * <wiTag noShow>
             */
            cssClassName: '',
            /**
             * <wiTag noShow>
             */
            content : '',
            /**
             * @cfg {Boolean} Лежит ли контрол внутри родительского контейнера
             * Нужно для расчёта авторазмеров: если контейнер контрола, как у автодополнения, лежит в body, то его не
             * надо учитывать при расчёте авторазмеров родителя.
             * <wiTag group="Отображение">
             * @noShow
             */
            isContainerInsideParent: true
         }
      },
      $constructor : function(cfg){
         var self = this;
         this._publish('onChange', 'onKeyPressed', 'onClick', 'onFocusIn', 'onFocusOut', 'onSizeChanged', 'onStateChanged', 'onTooltipContentRequest');
         this._keysWeHandle = $ws.core.hash(this._keysWeHandle);
         this._infoboxHandlerBound = this._showExtendedTooltip.bind(this);

         if(cfg){
            // TODO: При использовании без шаблонов (прямое внедрение в HTML через attachInstance) здесь будет ошибка
            if ('parent' in cfg && (cfg.parent instanceof $ws.proto.Control || ( $ws.helpers.instanceOfModule(cfg.parent, 'SBIS3.CORE.AreaAbstract')) )) {
               this._parent = cfg.parent;
            }
            if ('linkedContext' in cfg && cfg.linkedContext instanceof $ws.proto.Context) {
               this._context = cfg.linkedContext;
            }
            if ('id' in cfg) {
               this._id = cfg.id;
            }
            if(cfg.enable !== undefined) {
               this._options.enabled = !!cfg.enable;
            }
            if(cfg.hidden !== undefined) {
               this._options.visible = !cfg.hidden;
            }
            this._initContainer(cfg);
         }
         this._options = this._modifyOptions(this._options);
         this._contentAliasing(this._options);
         if(self._isCorrectContainer()){
            if(!this._hasMarkup()) {
               this._runtimeMarkup = true;
               if(this._dotTplFn) {
                  $ws.helpers.replaceContainer(
                        this._container,
                        this._buildMarkup(
                              this._dotTplFn,
                              this._options));
               }
            }
            this._container[0].wsControl = this;

            // удаляем атрибуты initiated='false'
            this._container.removeAttr('initiated');

            var cssMinWidth = parseInt(this._container.css('min-width'), 10);
            if (cssMinWidth > 0) {
               this._options.minWidth = Math.max(this._options.minWidth, cssMinWidth);
            }

            this._horizontalAlignment = this._options.horizontalAlignment ||
                                        this._container.attr('HorizontalAlignment') ||
                                        this._horizontalAlignment;

            this._verticalAlignment = this._options.verticalAlignment ||
                                      this._container.attr('VerticalAlignment') ||
                                      this._verticalAlignment;

            if (!this._hasMarkup() && this._options.cssClassName) {
               this._container.addClass(this._options.cssClassName);
            }

            this._container.addClass('ws-control-inactive')
               .addClass(this._options.className)
               .attr({
                  tabindex: 0,
                  hideFocus: true
               })
               .bind('click', this._onClickHandler.bind(this));

            if (this._options.zIndex !== undefined) {
               this._container.css('z-index', this._options.zIndex);
            }

            //честно скрываем контейнер
            if (!this._options.visible) {
               this.hide();
            }

            //проставляем связной метке тот же zIndex
            if (this._hasLinkedLabel()) {
               this.getParent().subscribe('onReady', function(){
                  var linkedLabel = self._getLinkedLabel();
                  if (linkedLabel) {
                     linkedLabel.css('z-index', self._options.zIndex);
                  }
               });
            }

            this._initKeyboardMonitor();
            this._bindExtendedTooltip();
         }
         this._margins = $ws.helpers.parseMargins(this._container);
         this._initSizeOptions();
         if(this._options.autoWidth) {
            this._options.width = 'auto';
         }
         if(this._options.autoHeight) {
            this._options.height = 'auto';
         }
         // Если контролу не сказали, с каким контекстом он связан - всегда линковать к нему глобальный
         if(this._context === false) {
            this._context = $ws.single.GlobalContext;
         }

         if (this._parent){
            this._registerToParent(this._parent);
            var topParent = this.getTopParent();
            if (topParent) {
               if (topParent.isReady()) {
                  // находим и кэшируем владельца
                  this.getOwner();
               } else {
                  // если родитель еще не готов, дождемся готовности и закэшируем овнера
                  topParent.subscribe('onReady', $ws.helpers.forAliveOnly(this.getOwner, this));
               }
            }
         }

         if (this._options.saveState){
            this.subscribe('onStateChanged', this._stateChangeHandler);
         }

         this.subscribe('onSizeChanged', function (event, control, initiator, recalculateOwnSize) {
            this._notifyOnSizeChanged(control, initiator, recalculateOwnSize);
            $ws.single.ioc.resolve('ILogger').error('Control', '_notify("onSizeChanged"): не вызывайте _notify с событием "onSizeChanged". Оно устарело и перестанет поддерживаться в версии 3.5. Вместо вызова _notify("onSizeChanged") надо использовать у контрола HTMLChunk метод chunk.recalcOnDOMChange(), у браузеров browser.recalcBrowserOnDOMChange(). Проверьте свой код, пока старый вариант ещё поддерживается.');
         }.bind(this));

         if(this._isCorrectContainer()){
            this.subscribe('onInit', this._propertyDataBinding);
         }

      },
      _getVarStorage: function(vStorage){
         if (!vStorage){
            if (typeof window == 'undefined'){
               vStorage = {storage: []};
            }
            else{
               vStorage = ($ws.__vStorage = $ws.__vStorage || {storage: {}});
            }
         }
         return vStorage;
      },
      _buildMarkup: function(dotTplFn, options, vStorage){
         var
            self = this,
            markup;

         vStorage = this._getVarStorage(vStorage);

         //создаем разметку
         markup = dotTplFn.apply(vStorage, [options]);
         //ищем вложенные компоненты первого уровня и строим для них верстку
         return ParserUtilities.mapTag('component', markup, function(node) {
            return self._prepareMarkup(node, options.id, vStorage);
         });
      },
      _prepareMarkup: function(node, parentId, vStorage){
         var
            componentType = '',
            constructor = null;

         // FIXME Это поддержка для старого кода, который еще есть в data-provider'ах (navigation.js, newslistedo.js)
         if (typeof node === 'string') {
            node = ParserUtilities.parse(node);
            for (var cI = 0, cL = node.childNodes.length; cI < cL; cI++){
               if (node.childNodes[cI].nodeType == 1){
                  node = node.childNodes[cI];
                  break;
               }
            }
         }

         vStorage = this._getVarStorage(vStorage);

         try{
            //определяем тип компонента
            componentType = node.getAttribute('data-component');
            //получаем конструктор
            constructor = global.requirejs('js!' + componentType);
         }
         catch (e){
            e.message = 'Не удалось определить тип компонента. Разметка: \n' + node.outerHTML() + '\n' + e.message;
            throw e;
         }

         if (constructor){
            //парсим разметку
            var
               markup = '',
               hasMarkup = true,
               xmlObject = node,
               parsedOptions,
               finalConfig,
               cls,
               clsIsAdded = false;

            cls = xmlObject.getAttribute('class');

            var attrs = xmlObject.attributes;

            parsedOptions = $ws.helpers.parseMarkup(xmlObject, vStorage);
            if (constructor.prototype._modifyOptions) {
               parsedOptions = constructor.prototype._modifyOptions(parsedOptions);
            }

            finalConfig = $ws.helpers.resolveOptions(constructor, parsedOptions);

            if (!finalConfig.id){
               finalConfig.id = $ws.helpers.randomId();
            }

            if (typeof constructor.prototype._dotTplFn == 'function'){
               markup = this._buildMarkup(constructor.prototype._dotTplFn, finalConfig, vStorage);
            }
            else{
               hasMarkup = false;
               markup = '<component></component>';
            }

            //если нужно, то восстанавливаем атрибут class
            if (cls){
               markup = markup.replace(/^\s*<[^>]*class=(?:'|")/, function(start){
                  clsIsAdded = true;
                  return start + cls + ' ';
               });
            }

            //добавляем важные атрибуты
            markup = markup.replace(/^\s*<\/?[a-z][a-z0-9]*/, function(start){
               var
                  ignoredAttr = {'class':0,'id':0,'data-pid':0,'config':0},
                  attributes = " config='" + $ws.helpers.encodeCfgAttr(parsedOptions) + "' ";

               if (hasMarkup){
                  attributes += "hasMarkup='true' ";
               }

               for (var i = 0, l = attrs.length; i < l; i++){
                  if (!(attrs[i].name in ignoredAttr)){
                     attributes += (attrs[i].name + "='"+ attrs[i].value +"' ");
                  }
               }

               attributes += ("id='"+ finalConfig.id +"' ");
               attributes += ("initiated='false' ");

               if (parentId){
                  attributes += ("data-pid='"+ parentId +"' ");
               }
               if (!clsIsAdded && cls){
                  attributes += ("class='"+ cls +"'");
               }
               return start + attributes;
            });
         }

         return markup;
      },
      /**
       * Данный метод позволяет изменить опции в дочернем классе ДО построения верстки
       * В аргументы приходит this._options по ссылке (!) то есть все изменения, проводимые с полученным объектом, отразятся на this._options
       * Возвращаемое значение будет испольновано при построении верстки
       * @param {Object} options
       * @returns {*}
       * @private
       */
      _modifyOptions: function(options) {
         return options;
      },
      /**
       * <wiTag group="Управление">
       * Задаёт текст простой подсказки, отображаемой внутри контрола или при наведении на него.
       * @param {String} tooltip Текст подсказки.
       * @example
       * 1. При смене значения группы радиокнопок (fieldRadio) установить подсказку об активной кнопке.
       * <pre>
       *    fieldRadio.subscribe('onValueChange', function() {
       *       var name = this.getStringValue();
       *       this.setTooltip('Выбрана кнопка ' + name );
       *    });
       * </pre>
       *
       * 2. Показать над полем ввода (fieldString) число применённых фильтров.
       * <pre>
       *    groupCheckbox.subscribe('onChange', function(eventObject, record) {
       *       var values = record.getDataRow(),
       *           count = 0;
       *       $ws.helpers.forEach(values, function(element) {
       *          if (element) {
       *             count++;
       *          }
       *       });
       *       fieldString.setTooltip('Применено фильтров: ' + count);
       *    });
       * </pre>
       * @see tooltip
       * @see getTooltip
       */
      setTooltip: function(tooltip){
         this._options.tooltip = '' + tooltip;
         this._container.attr('title', this._options.tooltip);
      },
      /**
       * <wiTag group="Данные">
       * Получить имя дополнительного CSS-класса контрола.
       * @returns {String}
       * @example
       * При готовности контрола получить CSS-класс родителя и передать его другому контролу.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var class = this.getParent().getClassName();
       *       this.getChildControlByName('ChildName').setClassName(class);
       *    });
       * </pre>
       * @see setClassName
       * @see className
       */
      getClassName: function(){
         return this._options.className;
      },
      /**
       * <wiTag group="Данные">
       * Установить дополнительный CSS-класс контрола.
       * @param {String} className Имя CCS-класса.
       * @example
       * Установить календарю (fieldDatePicker) новый стиль отображения с 31 декабря.
       * <pre>
       *    var obj = new Date();
       *    if (obj.getDate() == 31 && obj.getMonth() == 11)
       *       fieldDataPicker.setClassName('happy-new-year');
       * </pre>
       * @see className
       * @see getClassName
       */
      setClassName: function(className){
         this._container.toggleClass(this._options.className);
         this._options.className = className;
         this._container.addClass(className);
      },
      describe: function() {
         return (this._isCorrectContainer() ? (this.getContainer().attr('type') || this.getContainer().attr('data-component')) : '?Control') + '#' + this.getId();
      },
      /**
       * Привязка свойств комопнента к полям конекста
       * @private
       */
      _propertyDataBinding : function(){
         var
            self = this,
            context = this.getLinkedContext(),
            attr = this.getContainer().attr("data-bind"),
            dataBind,
            setter;

         //Проверяет есть ли сеттер, если есть возвращает его найзвание, иначе false
         function getSetter(property){
            var setter = 'set' + property.ucFirst();
            return (setter in self) ? setter : false;
         }

         if(attr){
            dataBind = attributeCfgParser(attr);
            for (var i in dataBind){
               if (dataBind.hasOwnProperty(i)){
                  //Если есть сеттер для указанного поля, то проставляем значение опции из контекста
                  if ((setter = getSetter(i)) !== false){
                     //Проставляем значение из контекста
                     this[setter](context.getValue(dataBind[i]));

                     //Переопределяем setter
                     this[setter] = (function(method, property, ctxField){
                        //При изменении нужного поля контекста вызываем исходный сеттер
                        context.subscribe('onFieldChange', function(e, f, v){
                           if (f == ctxField && self._options[property] !== v){
                              method.apply(self, [v]);
                           }
                        });

                        context.subscribe('onDataBind', function(){
                           var v = this.getValue(ctxField);
                           if (self._options[property] !== v) {
                              method.apply(self, [ v ]);
                           }
                        });

                        return function(){
                           method.apply(self, arguments);
                           context.setValue(ctxField, self._options[property]);
                        };
                     })(this[setter], i, dataBind[i]);
                  }
               }
            }
         }
      },
      /**
       * Связывает поле, указанное в протектед переменной _aliasForContent, с опцией content
       * @param {Object} options - конфигурация контрола
       * @returns {Object} - модифицированный объект
       * @private
       */
      _contentAliasing : function(options){
         if (this._aliasForContent && options.content){
            options[this._aliasForContent] = options.content;
         }
         return options;
      },

      /**
       * Здесь должна осуществляться привязка "внутренностей" контрола к верстке, не важно как она создана
       * @protected
       */
      _bindInternals: function() {

      },

      /**
       * Регистрируется у родителя
       * @param {$ws.proto.AreaAbstract} parent Родитель контрола
       * @private
       */
      _registerToParent: function(parent){
         // Если родитель Area - зарегистрируем дочерний контрол
         if($ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.AreaAbstract') ){
            if(parent.hasEvent('onResize')) { //Есть вероятность, что когда контрол инициализируется, родителя уже убили. Мы не умеем корректно обрабатывать подобные ситуации. Если onResize есть - значит, родитель живой и корректен. Да, костыль
               parent.registerChildControl(this);
            }
         }
         else if(parent){
            $ws.single.ioc.resolve('ILogger').error('Control', 'Incorrect parent (' + ((parent instanceof Object && parent.getId) ? parent.getId() : 'not object') + ') for control (' + this.getId() + '), parent must be instanceof $ws.proto.AreaAbstract');
         }
      },

      _runInBatchUpdate: function(hint, callback, args) {
         return $ws.single.ControlBatchUpdater._runInBatchUpdate(hint, this, callback, args);
      },

      _runInBatchUpdateOpts: function(options) {
         return $ws.single.ControlBatchUpdater._runInBatchUpdateOpts(options);
      },

      _createBatchUpdateWrapper: function(hint, callback, dontBindThis) {
         var self = this;
         return function() {
            return $ws.single.ControlBatchUpdater._runInBatchUpdate(hint, dontBindThis ? this : self, callback, arguments);
         };
      },

      _haveBatchUpdate: function() {
         var updater = $ws.single.ControlBatchUpdater;
         return updater.haveBatchUpdate() || updater.haveApplyUpdateInProcess();
      },

      _needForceOnResizeHandler: function() {
         return $ws.single.ControlBatchUpdater.haveApplyUpdateInProcess();
      },

      _needRecalkInvisible: function() { return false; },

      _getBatchUpdateData: function() { return this._batchUpdateData; },

      _setBatchUpdateData: function(data) { this._batchUpdateData = data; },

      _haveAutoSize: function() { return false; },
      init: function(){
         this._initFocusCatch();
         $ws.proto.Control.superclass.init.apply(this, arguments);
      },

      /**
       * Если выполняется конструирование контрола, и отсылка событий отключена, то откладывает функцию до момента
       * после окончания конструирования контрола (когда будет включена отсылка событий).
       * Если _delayToConstructionFinished вызывается вне контекста конструирования контрола и события включены, то просто выполняет функцию, не дожидаясь ничего.
       * @param {String} hint Имя пакета, для отладки. Имеет смысл при параметре withBatch=true.
       * @param {Boolean} withBatch Нужно ли оборачивать вызов функции (или ожидание окончания конструирования и вызов) в пакет (см. метод runInBatchUpdate).
       * @param {Function} func Функция, которую нужно вызвать или отложить до включения событий.
       * @param [arg1, [...]] Параметры функции.
       * @private
       */
      _delayToConstructionFinished: function(hint, withBatch, func) {
         var args = Array.prototype.slice.call(arguments, 3), self = this;
         if (this._isInitialized) {
            if (withBatch) {
               this._runInBatchUpdate(hint, func, args);
            }
            else {
               func.apply(self, args);
            }
         }
         else {
            if (withBatch) {
               $ws.single.ControlBatchUpdater.beginBatchUpdate(hint);
               this.once('onInit', function() {
                  try {
                     func.apply(self, args);
                  } finally {
                     $ws.single.ControlBatchUpdater.endBatchUpdate(hint);
                  }
               });
            } else {
               this.once('onInit', function() {
                  func.apply(self, args);
               });
            }
         }
      },

      _initComplete: function() {
         // Пометим контейнер классом
         if(this._isCorrectContainer()) {
            this._container.addClass('ws-init-done');
            this._setEnabled(this._options.enabled);
         }
         // Добавим в ControlStorage только после прохождения всей инициализации
         $ws.single.ControlStorage.store(this);
         $ws.single.EventBus.channel('luntik').notify('onInit', this);
         // В родительском классе будет сделан _notify('onInit') - все кто подписался смогут получить контрол из ControlStorage
         $ws.proto.Control.superclass._initComplete.apply(this, arguments);
      },

      _runBatchDelayedFunc: function(funcName, func) {
         var result;
         if (this._haveBatchUpdate()) {
            $ws.single.ControlBatchUpdater.addDelayedFunc(funcName, this, func);
         }
         else {
            result = func.apply(this);
         }
         return result;
      },

      _notifyBatchDelayedEventLow: function(event, merge, args) {
         var result;
         if (this._haveBatchUpdate()) {
            $ws.single.ControlBatchUpdater.addDelayedEvent(event, merge, this, args);
         }
         else {
            result = this._notify.apply(this, args);
         }
         return result;
      },

      /**
       * Сообщает о событии с задержкой на авторазмеры, не объединяя события до окончания пакета.
       * Если в пакете стрельнет несколько одинаковых таких событий, то по окончании пакета они просигналятся все, в том порядке, в котором был вызван этот метод.
       * @param {String} event Название события
       * @param {Array} args Параметры события
       * @returns {*}
       * @protected
       */
      _notifyBatchDelayedNoMerge: function(event/*, payload*/) {
         return this._notifyBatchDelayedEventLow(event, false, arguments);
      },

      /**
       * Сообщает о событии с задержкой на авторазмеры. Объединяет события одного типа для одного и того же контрола
       * @param {String} event Название события
       * @param [arg1, [...]] Параметры события
       * @returns {*}
       * @protected
       */
      _notifyBatchDelayed: function(event/*, payload*/) {
         return this._notifyBatchDelayedEventLow(event, true, arguments);
      },

      _notifyOnSizeChanged: function(source, initiator, recalculateOwnSize) {
         var self = this;

         //можно вызывать метод с одним аргументом - recalculateOwnSize
         if (arguments.length === 1) {
            recalculateOwnSize = arguments[0];
         }

         function addBatchSizeChanged() {
            $ws.single.ControlBatchUpdater.addBatchSizeChanged(self, recalculateOwnSize);
         }

         if (this._haveBatchUpdate()) {
            addBatchSizeChanged();
         }
         else {
            this._runInBatchUpdate('_notifyOnSizeChanged', addBatchSizeChanged);
         }
      },

      /**
       * Активирует контрол при получении фокуса
       * @private
       */
      _initFocusCatch: function(){
         if(this.getTabindex()){
            var self = this,
               elements = [this._getElementToFocus()];
            if(!elements[0] || elements[0].get(0) != this._container.get(0)){
               elements.push(this._container);
            }
            for(var i = 0; i < elements.length; ++i){
               var element = elements[i];
               if(element){
                  element.bind('focusin', function(event){
                     if(!self.isActive()){
                        self.setActive(true, false, true);
                     }
                     event.stopPropagation();
                  });
               }
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Применить состояние.
       * @param {String|Number} state Состояние, которое должен применить к себе контрол.
       * @example
       * Для табличного представления (tableView) установить текущую активную строчку по состоянию.
       * <pre>
       *    tableView.subscribe('onReady', function() {
       *       this.applyState(33);
       *    });
       * </pre>
       * @see stateKey
       * @see applyEmptyState
       * @see getStateKey
       * @see setStateKey
       * @see onStateChanged
       */
      applyState : function(state){
         //child classes must implement this method for applying state
      },
       /**
        * <wiTag group="Управление">
        * Применить пустое состояние.
        * Метод используется в случае необходимости обработки пустого состояния.
        * По умолчанию он пустой, при необходимости поддержки контролом сохранения/восстановления состояния,
        * нужно переопределить метод - должен восстанавливать состояние контрола по умолчанию.
        * @see stateKey
        * @see applyState
        * @see getStateKey
        * @see setStateKey
        * @see onStateChanged
        */
      applyEmptyState: function() {
         //child classes must implement this method for applying empty state
      },
      /**
       * <wiTag group="Управление">
       * Установить/сменить ключ, который будет использован для идентификации состояния контрола в {@link $ws.single.NavigationController}.
       * Этот ключ предназначен для хранения состояния браузера в хэше адресной строки.
       * @param {String} key Ключ для идентификации состояния контрола (отображается в хэше в адресной строке).
       * @example
       * Создать новый контрол, расширив уже существующий. Определить ключ и использовать его в качестве состояния контрола.
       * <pre>
       *    //создаём свой контрол, наследуемся от браузера-дерево
       *    define('js!SBIS3.BILLING.MyBrowser', ['js!SBIS3.CORE.TreeView'], function(TreeView) {
       *       //определяем желаемое значение ключа
       *       var MyStateKey = 'MyStateKey';
       *       //наследуемся от контрола дерево
       *       var MyBrowser = TreeView.extend({
       *          //расширяем конструктор
       *          $constructor: function() {
       *             //устанавливаем ключ
       *             this.setStateKey(MyStateKey);
       *          }
       *       });
       *       return MyBrowser;
       *    });
       * </pre>
       * @see stateKey
       * @see applyState
       * @see applyEmptyState
       * @see getStateKey
       * @see onStateChanged
       */
      setStateKey: function(key){
         this._options.stateKey = key;
      },
      /**
       * <wiTag group="Управление">
       * Получить ключ, который используется для идентификации состояния контрола в {@link $ws.single.NavigationController}.
       * @returns {String} Ключ для идентификации состояния контрола (отображается в хэше в адресной строке).
       * @example
       * Изменить значение поля контекста в зависимости от состояния табличного представления (tableView).
       * <pre>
       *     var MyKey = tableView.getStateKey(),
       *         category = $ws.single.NavigationController.getStateByName(MyKey).state;
       *     control.getLinkedContext().setValue('КатегорияЗадачи', category != null ? category : '');
       * </pre>
       * @see applyEmptyState
       * @see stateKey
       * @see applyState
       * @see setStateKey
       * @see onStateChanged
       */
      getStateKey: function(){
         return this._options.saveState ? (this._options.stateKey || this.getName()) : undefined;
      },
      _stateChangeHandler : function(e, state, replace, force){
         if (state !== undefined){
            $ws.single.NavigationController.updateState(this.getStateKey(), state, replace, force);
         }
      },
      /**
       * Инициализация опиций минимальных и максимальных размеров
       * @protected
       */
      _initSizeOptions: function(){
         this._options.minWidth = parseInt(this._options.minWidth, 10) || 0;
         this._options.minHeight = parseInt(this._options.minHeight, 10) || 0;

         var maxWidth = this._options.maxWidth,
             maxHeight = this._options.maxHeight;

         this._options.maxWidth = (maxWidth !== undefined && maxWidth !== Infinity) ?
                                  parseInt(maxWidth, 10) : Infinity;

         this._options.maxHeight = (maxHeight !== undefined && maxHeight !== Infinity) ?
                                   parseInt(maxHeight, 10) : Infinity;
      },
      /**
       * Инициализирует контейнер
       * @param {Object} cfg
       */
      _initContainer: function(cfg) {
         if (cfg && cfg.nodeType){
            this._container = $(cfg);
         } else if ('element' in cfg) {
            if (typeof(cfg.element) == 'string') { // Given an ID
               var id = cfg.element;
               this._container = $('#' + cfg.element);
               if(this._container.length === 0)
                  throw new Error("Вы пытаетесь создать элемент в несуществующем контейнере! Необходимо создать контейнер с указанным id = " + id);
            } else
               if ("jquery" in cfg.element) { // Given jQuery object
                  this._container = cfg.element;
               }
               else if (cfg.element.nodeType) { // Given HTMLElement
                  this._container = $(cfg.element);
               }
         }
      },

      /**
       * Зависит ли высота контрола от его ширины. Эта функция нужна для оптимизации расчётов старой сетки и ей подобных контролов -
       * чтобы знать, когда вызывать дополнительный пересчёт своего ресайзера, а когда нет. У большинства контролов высота не зависит от ширины, что позволяет считать
       * старую сетку оптимальнее.
       * @returns {boolean}
       * @private
       */
      _isHeightDependentOnWidth: function() {
         return false;
      },

      /**
       * Функция удаления контейнера контрола из DOM-дерева
       * Наследник может переопределить, если требуется другое поведение
       * @private
       */
      _removeContainer: function() {
         if (this._isCorrectContainer()) {
            this._container.empty().remove().get(0).wsControl = null;
         }
      },
      destroy: function(){
         if(this.isActive()){
            this._isControlActive = false;
            this._notify('onFocusOut', true);   //Фокус с элемента уходит
         }

         this._removeContainer();

         $ws.single.CommandDispatcher.deleteCommandsForObject(this);
         $ws.single.ControlStorage.remove(this);
         if(this._parent && this._parent.unregisterChildControl){
            this._parent.unregisterChildControl(this);
         }

         this._context = null;
         this._parent = null;
         this._owner = null;
         this._userData = undefined;
         this._batchUpdateData = {};

         if (this._options.saveState) {
            // removeState может вызвать повторное применение состояния
            // отпишемся от обработчика а затем удалим состояние
            this.unsubscribe('onStateChanged', this._stateChangeHandler);
            $ws.single.NavigationController.removeState(this);
         }

         $ws.proto.Control.superclass.destroy.apply(this, arguments);
      },
      /**
       * <wiTag group="Управление">
       * Получить идентификатор контейнера контрола.
       * Контейнер - это html-элемент, ограничивающий контрол от других элементов веб-страницы.
       * Идентификатор контейнера хранится в атрибуте id и является уникальным.
       * Идентификатор, как и {@link name}, используется для получения экземпляра класса контрола.
       * @returns {String} Идентификатор контейнера контрола.
       * @example
       * Получить дочерний контрол по id. Скрыть родителя, если id равен заданному.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var id = this.getChildControlByName('Child').getId();
       *       if (id == 'div_first') {
       *          this.getParent().hide();
       *       }
       *    });
       * </pre>
       * @see get
       * @see getChildControlByName
       * @see getChildControlById
       * @see getOwnerId
       */
      getId: function(){
         if(this._id === ''){
            if(this._isCorrectContainer()){
               var id = this._id = this._container[0].id;
               if(!id || id === '')
                  this._id = this._container[0].id = $ws.helpers.randomId();
            }
            else
               this._id = $ws.helpers.randomId();
         }
         return this._id;
      },
      /**
       * <wiTag group="Управление">
       * Получить имя контрола.
       * @returns {String} Имя контрола.
       * @example
       * В зависимости от имени кнопки (btn) установить фильтр на табличное представление (tableView).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       var name = this.getName();
       *       //Field - название поля табличного представления, по которому хотим фильтровать записи
       *       tableView.setQuery({Field : name});
       *    });
       * </pre>
       * @see name
       * @see getByName
       * @see getParentByName
       * @see getChildControlByName
       */
      getName: function(){
         return this._options.name;
      },
      /**
       * <wiTag group="Управление">
       * Получить {@link tabindex} контрола.
       * @returns {Number} Значение табиндекса.
       * @example
       * В зависимости от значения, отображаемого в выпадающем списке (fieldDropdown), установить новый tabindex полей
       * ввода (fieldString).
       * <pre>
       *    fieldDropdown.subscribe('onChange', function() {
       *       if (this.getStringValue() == 'ИП') {
       *          var index = fieldString2.getTabindex();
       *          fieldString2.hide();
       *          fieldString4.hide();
       *          fieldString3.setTabindex(index+1);
       *          fieldString5.setTabindex(index);
       *       } else {
       *          fieldString2.show();
       *          fieldString4.show();
       *       }
       *    });
       * </pre>
       * @see tabindex
       * @see setTabindex
       */
      getTabindex : function(){
         return +this._options.tabindex;
      },
      /**
       * <wiTag group="Управление">
       * Установить {@link tabindex} контрола.
       * @param {Number|false} tabindex Значение табиндекса, которое хотим присвоить конкретному контролу.
       * @param {Boolean} [notCalculate = false] true - не пересчитывать табиндекс соседних контролов.
       * Если пользователь задаёт контролу табиндекс, который уже используется, то рекомендуется пересчитать табиндекс "соседних контролов".
       * Пересчёт позволяет изменить значения таким образом, чтобы "соседние контролы" не имели одинаковый табиндекс.
       * @example
       * Если табиндекс контрола больше 1, установить новое значение.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       if (this.getTabindex() > 1) {
       *          this.setTabindex(1);
       *       }
       *    });
       * </pre>
       * @see tabindex
       * @see getTabindex
       */
      setTabindex : function(tabindex, notCalculate){
         if (!notCalculate){
            var parent = this.getParent();

            if (parent && $ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.AreaAbstract'))
               parent.changeControlTabIndex(this, tabindex);
         }
         this._options.tabindex = tabindex;
      },
      /**
       * <wiTag group="Отображение">
       * Получить текст всплывающей подсказки.
       * @returns {String} Текст всплывающей подсказки.
       * @example
       * При готовности контрола установить всплывающую подсказку, если она не задана.
       * <pre>
       *    //tooltips - массив со всплывающими подсказками
       *    //controls - массив с контролами
       *    $ws.helpers.forEach(controls, function(element, index) {
       *       element.subscribe('onReady', function() {
       *          if (this.getTooltip() == '') this.setTooltip(tooltips[index]);
       *       });
       *    });
       * </pre>
       * @see tooltip
       * @see setTooltip
       * @see extendedTooltip
       * @see setExtendedTooltip
       * @see getExtendedTooltip
       */
      getTooltip: function() {
         return this._options.tooltip;
      },
      /**
       * <wiTag group="Отображение">
       * <wiTag class="GroupCheckBox" noShow>
       * Получить текст расширенной всплывающей подсказки.
       * @returns {String|Boolean}
       * Возможные значения:
       * <ol>
       *    <li>true - подсказка включена, но текст не задан.</li>
       *    <li>false - подсказка отключена.</li>
       *    <li>Если подсказка включена и задан текст, то вернётся текстовое сообщение расширенной подсказки.</li>
       * </ol>
       * @example
       * Для поля ввода (fieldString) с именем "ИНН" установить подсказку о вводимой информации.
       * <pre>
       *    var message = 'Введите идентификационный номер налогоплательщика РФ';
       *    fieldString.subscribe('onReady', function() {
       *       if (this.getName() === 'ИНН' && this.getExtendedTooltip() === false)
       *          this.setExtendedTooltip(message);
       *    });
       * </pre>
       * @see extendedTooltip
       * @see setExtendedTooltip
       * @see tooltip
       * @see setTooltip
       * @see getTooltip
       */
      getExtendedTooltip: function() {
         return this._options.extendedTooltip;
      },
      /**
       * <wiTag group="Отображение">
       * <wiTag class="GroupCheckBox" noShow>
       * Задать текст расширенной подсказки.
       * @param {String|Boolean} tooltip Текст подсказки.
       * Если передать true, то расширенная подсказка будет включена, false - выключена.
       * @example
       * При наведении курсора на контрол показать подсказку с текущими датой и временем.
       * <pre>
       *    //включаем расширенную подсказку
       *    control.setExtendedTooltip(true);
       *    control.subscribe('onTooltipContentRequest', function(event, originalMessage) {
       *       event.setResult('Подсказка запрошена в ' + new Date());
       *    });
       * </pre>
       * @see extendedTooltip
       * @see getExtendedTooltip
       * @see tooltip
       * @see setTooltip
       * @see getTooltip
       */
      setExtendedTooltip: function(tooltip) {
         this._options.extendedTooltip = tooltip;
      },
      /**
       * Используется для определения, нужно ли для данного контрола показвать подсказку.
       * Можно перегружать чтобы модифицировать поведение.
       * @returns {boolean}
       * @protected
       */
      _isCanShowExtendedTooltip: function() {
         return !!this._options.extendedTooltip;
      },
      /**
       * Делает все необходимое, чтобы показывать подсказку у контрола
       * @private
       */
      _bindExtendedTooltip: function () {
         var self = this;
         if (this._tooltipSettings.handleFocus) {
            this.subscribe('onFocusIn', function () {
               if(this._isCanShowExtendedTooltip()) {
                  this._showExtendedTooltip();
               }
            });

            this.subscribe('onFocusOut', function () {
               if(this._isCanShowExtendedTooltip()) {
                  // Будем скрывать подсказку только в том случае, если она сейчас привязана к текущему контролу
                  if(Infobox.isCurrentTarget(self._getExtendedTooltipTarget())) {
                     Infobox.hide(0);
                  }
               }
            });
         }

         if (this._tooltipSettings.handleHover) {
            this.getContainer().bind('mouseenter', function () {
               self._underCursor = true;
               self._initiatedByCursor = true;
               if(self._isCanShowExtendedTooltip()) {
                  self._showExtendedTooltip();
               }
            });

            this.getContainer().bind('mouseleave', function () {
               self._underCursor = false;
               self._initiatedByCursor = false;
               // Скрывать будем только если задан текст. Иначе подсказки небыло.
               if(self._isCanShowExtendedTooltip()) {
                  // Подсказку скрываем только если текущий контрол не активен
                  // Иначе скрывать ничего не надо, всеравно придется показывать снова
                  if(!self.isActive()) {
                     // Будем скрывать подсказку только в том случае, если она сейчас привязана к текущему контролу
                     if(Infobox.isCurrentTarget(self._getExtendedTooltipTarget())) {
                        Infobox.hide($ws.single.Infobox.HIDE_TIMEOUT);
                     }
                  }
               }
            });
         }
      },
      /**
       * Задает объект, относительно которого будет показана подсказка
       *
       * @returns {jQuery}
       * @protected
       */
      _getExtendedTooltipTarget: function() {
         return this.getContainer();
      },
      /**
       * Показать подсказку. Если она уже на текущем контроле - ничего не делаем. Если очень надо - используем force
       * @param {Boolean} [force=false] Если передать true - подсказка будет показана даже если она уже на текущем элементе. Фактически это перестроение
       * @protected
       */
      _showExtendedTooltip: function(force) {
         var self = this,
             message, result;

         // Если подсказка уже на текущем контроле - ничего не делаем (кроме случая, если нас особо попросили)
         if(force !== true && Infobox.isCurrentTarget(this._getExtendedTooltipTarget()))
            return;

         result = this._notify('onTooltipContentRequest', message = this._options.extendedTooltip);
         // Deferred - дождемся результата
         if(result instanceof $ws.proto.Deferred) {
            // Временно покажем индикатор загрузки
            message = '<i class="ws-inline-ajax-loader-16">Загрузка&hellip;</i>';
            // Когда придет результат - поменяем подсказку
            result.addBoth(function(r){
               // Если подсказка невидима - покажем
               if(!Infobox.hasTarget()) {
                  self._finallyShowInfobox(r);
               } else {
                  // Если видима, то меняем текст только в том случае, если подсказка приделана к текущему контролу
                  if(Infobox.isCurrentTarget(self._getExtendedTooltipTarget())) {
                     Infobox.setText(self._alterTooltipText(r));
                  }
                  else{
                     Infobox.once("onShow", function(){
                        if(Infobox.isCurrentTarget(self._getExtendedTooltipTarget())) {
                           Infobox.setText(self._alterTooltipText(r));
                        }
                     });
                  }
               }
               return r;
            });
         } else if(typeof result == 'string') {
            message = result;
         } else if(result === false) {
            message = '';
         }
         this._finallyShowInfobox(message);
      },
      /**
       * Метод, непосредственно показывающий подсказку. Выясняет где показывать через {@link _getExtendedTooltipTarget}
       * и модицицирует текст через {@link _alterTooltipText}
       * @param {String} message
       * @protected
       */
      _finallyShowInfobox: function(message) {
         if (this.isEnabled() === false){
            return;
         }
         var
            self = this,
            byCursor = this._initiatedByCursor,
            confirmAction = function(){
               return self._isCanShowExtendedTooltip() && (!byCursor || self._underCursor);
            };
         // TODO а нужна ли эта функция (confirmAction)?
         this._initiatedByCursor = false;
         Infobox.show(this._getExtendedTooltipTarget(), this._alterTooltipText(message), 'auto', $ws.single.Infobox.SHOW_TIMEOUT, $ws.single.Infobox.ACT_CTRL_HIDE_TIMEOUT, confirmAction);
      },
      /**
       * Да, это странный метод делающий ничего. Он перегружен в другом классе.
       * Он позволяет в конкретном классе модифицировать текст подсказки
       * @param message
       * @returns {*}
       * @protected
       */
      _alterTooltipText: function(message) {
         return message;
      },
      /**
       * <wiTag group="Управление">
       * Находится ли фокус на контроле.
       * @returns {Boolean} true - фокус находится на контроле.
       * @example
       * При готовности контрола перевести на него фокус.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       if (!this.isActive()) this.setActive(true);
       *    });
       * </pre>
       * @see setActive
       */
      isActive : function(){
         return this._isControlActive;
      },
      /**
       * <wiTag group="Управление">
       * Установить фокус на контрол.
       * @param {Boolean} active
       * Возможные значения:
       * <ol>
       *    <li>true - перевести фокус на контрол. Если фокус ранее находился на другом элементе, то произойдёт событие {@link onFocusIn}.
       *    Если фокус был на данном контроле, то откроется всплывающая подсказка.</li>
       *    <li>false - убрать фокус с контрола. Произойдёт событие onFocusOut.</li>
       * </ol>
       * @param {Boolean} [shiftKey] Признак: клавиша Shift нажата (true) или отпущена (false).
       * @param {Boolean} [noFocus] Признак: не хотим передать фокус контролу после переключения его состояния (true) или хотим (false).
       * @param {$ws.proto.Control} [focusedControl] Контрол, на который ушёл фокус.
       * @example
       * При готовности контрола перевести на него фокус.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       if (!this.isActive()) this.setActive(true);
       *    });
       * </pre>
       * @see isActive
       * @see onFocusIn
       * @see onFocusOut
       */
      setActive: function(active, shiftKey, noFocus, focusedControl){
         var wasActive = this._isControlActive;

         this._isControlActive = active;
         if(this._isCorrectContainer()){
            this._container
               .toggleClass('ws-control-inactive', !active)
               .toggleClass('ws-has-focus', active);

            if(active){

               if(active !== wasActive){
                  // Если контрол был ранее неактивен - поднимем FocusIn - это приведет к возможному появлению подсказки
                  var myParent = this.getParent();
                  if(myParent) {
                     myParent.activate(this);
                  }
                  this._notify('onFocusIn');
               } else {
                  // Если контрол уже активный - возможно надо показать подсказку
                  if(this._isCanShowExtendedTooltip() && this._tooltipSettings.handleFocus) {
                     this._showExtendedTooltip()
                  }
               }

               // Откладываем фокусировку до подняния вверх myParent.activate, иначе там очищалось выделение
               if(!noFocus){
                  $ws.single.ControlBatchUpdater.runBatchedDelayedAction('Control.focus', [this]);
               }
            }
            else if(active !== wasActive){
               this._notify('onFocusOut', false, focusedControl);
            }
         }
      },
      /**
       * Отдает элемент на который необходимо сфокусироваться
       */
      _getElementToFocus: function() {
         return this._container;
      },
      /**
       * <wiTag group="Управление">
       * Получить окно, на котором расположен контрол.
       * @returns {$ws.proto.Window|undefined} Экземпляр класса окна.
       * Возвращается undefined, если окна не существует.
       * @example
       * При клике на кнопку (btn) закрыть окно.
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       this.getParentWindow().close();
       *    });
       * </pre>
       * @see findParent
       * @see getParent
       * @see getTopParent
       * @see getParentByName
       * @see getParentByClass
       */
      getParentWindow: function() {
         try {
            return this.getParentByClass($ws.proto.Window);
         } catch (e) {
            return undefined;
         }
      },
      /**
       * <wiTag group="Управление">
       * Поиск родительского контрола с применением пользовательского фильтра.
       * Функция-фильтр должна вернуть true для окончания перебора.
       * @param {Function} filter Функция, описывающая фильтр.
       * @return {$ws.proto.AreaAbstract|null} Экземпляр класса родителя. Если не удалось ничего найти, возвращается null.
       * @example
       * Найти родителя, в котором содержится контрол с именем myControl.
       * <pre>
       *    control.findParent(function(parent) {
       *       return parent.containsByName('myControl');
       *    });
       * </pre>
       * @see getParentWindow
       * @see getParent
       * @see getTopParent
       * @see getParentByName
       * @see getParentByClass
       */
      findParent: function(filter) {
         if(typeof filter != 'function')
            throw new Error("Control.findParent - требуется передать функцию-фильтр");
         var parent = this;
         do {
            parent = parent.getParent();
         } while(parent && !filter(parent));
         return parent;
      },
      /**
       * <wiTag group="Управление">
       * Получить родителя контрола.
       * @return {$ws.proto.AreaAbstract} Экземпляр класса родителя.
       * @example
       * Если два контрола имеют одного родителя, то установить второй контрол владельцем первого.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       if (fieldString.getParent() === fieldCheckbox.getParent()) {
       *          fieldString.setOwner(fieldCheckbox);
       *       }
       *    });
       * </pre>
       * @see getParentWindow
       * @see getTopParent
       * @see findParent
       * @see getParentByName
       * @see getParentByClass
       */
      getParent: function(){
         return this._parent;
      },
      /**
       * <wiTag group="Управление">
       * Получить самого дальнего родителя контрола.
       * Возвращает самого дальнего предка контрола, у которого нет родителя (окно или самая "верхняя" область в body).
       * @return {$ws.proto.Control} Экземпляр класса родителя.
       * @example
       * При клике на кнопку (btn) установить фильтр на табличное представление.
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       var child = this.getTopParent().getChildControlByName('Табличное представление');
       *       child.setQuery({'Тип': 'Все'});
       *    });
       * </pre>
       * @see getParent
       * @see getParentWindow
       * @see findParent
       * @see getParentByName
       * @see getParentByClass
       */
      getTopParent: function(){
         var parent = this;
         while(parent.getParent()){
            parent = parent.getParent();
         }
         return parent;
      },
      /**
       * <wiTag group="Управление">
       * Получить родителя контрола по имени.
       * @param {String} name Имя родителя.
       * @returns {$ws.proto.Control} Экземпляр класса родителя.
       * @example
       * При нажатии клавиши Enter получить родителя и сохранить запись.
       * <pre>
       *    control.subscribe('onActivated', function() {
       *       this.getParentByName('Редактирование контакта').save();
       *    });
       * </pre>
       * @see getParent
       * @see getParentWindow
       * @see findParent
       * @see getTopParent
       * @see getParentByClass
       */
      getParentByName : function(name){
         return this.findParent(function(parent){
            return parent instanceof $ws.proto.Control && parent.getName() == name;
         });
      },
      /**
       * <wiTag group="Управление">
       * Найти родителя контрола по классу.
       * @param {Function} classConstructor Класс родителя.
       * @return {$ws.proto.AreaAbstract} Экземпляр класса родителя.
       * Если родителя с таким классом не существует, то возвращается сообщение об ошибке.
       * @example
       * <pre>
       *    //найти родителя, являющегося вкладками
       *    this.getParentByClass($ws.proto.Tabs);
       *
       *    //найти окно (и его наследников, в т.ч. Dialog и т.п.), эквивалент this.getParentWindow()
       *    this.getParentByClass($ws.proto.Window);
       * </pre>
       * @see getParent
       * @see getParentWindow
       * @see findParent
       * @see getTopParent
       * @see getParentByName
       */
      getParentByClass : function(classConstructor) {
         if(!classConstructor)
            throw new Error("Control.getParentByClass - искомый класс не определен");
         return this.findParent(function(parent){
            return parent instanceof classConstructor;
         });
      },
      /**
       * <wiTag group="Управление">
       * Получить связанный контекст контрола.
       * @return {$ws.proto.Context} Связанный с контролом контекст.
       * @example
       * Установить новое значение поля из контекста контрола (fieldString).
       * <pre>
       *    fieldString.subscribe('onReady', function() {
       *       this.getLinkedContext().setValue(this.getName(), this.getValue());
       *    });
       * </pre>
       * @see linkedContext
       */
      getLinkedContext: function(){
         return this._context;
      },
      /**
       * Проверяет контейнер на правильность
       * @returns {Boolean}
       */
      _isCorrectContainer : function() {
         // Container must be valid jQuery object having only one element inside
         return this._container !== undefined && ('jquery' in this._container) && this._container.length == 1;
      },
      _hasMarkup: function() {
         return this._isCorrectContainer() && this._container.attr('hasMarkup') == 'true';
      },
      /**
       * Подсчет положения при выравнивании по ширине и ограничении мах ширины
       */
      _calculatePositionHorisontal:function () {
         var parentWidth = this._container.parent().width(),
            lrMargin = this._margins.left + this._margins.right,
            lPos = '',
            cssParam = 'margin-left';
         this._container.css(cssParam, '');
         if ((parentWidth - lrMargin) > this._options.maxWidth){
            lPos = Math.round((parentWidth - lrMargin - this._options.maxWidth) / 2);
            this._container.css(cssParam, lPos)
         }
      },
      /**
       * Подсчет положения при выравнивании по высоте и ограничении мах высоты
       */
      _calculatePositionVertical:function () {
         var parentHeight = this._container.parent().height(),
            tbMargin = this._margins.top + this._margins.bottom,
            tPos = '',
            cssParam = 'margin-top';
         if ((parentHeight - tbMargin) > this._options.maxHeight)
            tPos = Math.round((parentHeight - tbMargin - this._options.maxHeight) / 2);
         this._container.css(cssParam, tPos)
      },
      /**
       * Подсчет положения при Stretch выравнивании и ограничении max размеров
       */
      _calcStretchPosition: function(){
         if (this._horizontalAlignment == "Stretch" && this._options.maxWidth != Infinity) {
            this._calculatePositionHorisontal();
         }
         if (this._verticalAlignment == "Stretch" && this._options.maxHeight != Infinity) {
            this._calculatePositionVertical();
         }
      },
      _onResizeHandler:function () {
         this._calcStretchPosition();
      },
      /**
       * Обработчик клика по контролу
       * @param {jQuery} event стандартный jQuery-ивент
       */
      _onClickHandler: function(event){
         event.stopImmediatePropagation();
         if (!this._isControlActive){
            this.setActive(true);
         }
         this._notify('onClick');
      },
      /**
       * Может ли обрабатывать события клавиш
       * @returns {Boolean}
       * @protected
       */
      _isAcceptKeyEvents: function(){
         return this.isEnabled();
      },
      /**
       * Ловит нажатия на клавиши клавиатуры, нотифицирует о них и использует в служебных целях, если в обработчике не сказали обратное
       * @param [rootBlock] {jQuery} - корневой элемент вёрстки, в которой нужно следить за нажатиями клавиш. Если не указан, то используется
       * основной элемент контрола, отдаваемый функцией getContainer
       */
      _initKeyboardMonitor: function(rootBlock){
         var self = this,
             container = rootBlock || self._container;

         //слежение за нажатиями клавиш
         $ws.helpers.keyDown(container, function(e){
            var result = self._notify('onKeyPressed', e);
            if(e.which in self._keysWeHandle && result !== false && self._isAcceptKeyEvents()){
               var res = self._keyboardHover(e);
               if(!res){
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
               }
               return res;
            }
         });
      },
      /**
       * Служебный обработчик нажатия на клавишу
       */
      _keyboardHover: function(event){
      },
      /**
       * <wiTag group="Управление">
       * Получить состояние активности контрола, определяемое свойством {@link enabled}.
       * @return {Boolean} true - контрол активен.
       * @example
       * При клике на кнопку (btn) изменить активность группы радиокнопок (fieldRadio).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       var value = fieldRadio.isEnabled();
       *       fieldRadio.setEnabled(!value);
       *    });
       * </pre>
       * @see enabled
       * @see setEnabled
       * @see allowChangeEnabled
       * @see setAllowChangeEnabled
       * @see isAllowChangeEnabled
       */
      isEnabled: function(){
         return this._options.enabled;
      },
      /**
       * <wiTag group="Отображение">
       * Показать контрол.
       * @example
       * Когда выпадающий список (fieldDropdown) отображает "Расширенная информация", показать дополнительные поля.
       * <pre>
       *    //fields - массив дополнительных полей ввода
       *    fieldDropdown.subscribe('onReady', function() {
       *       if (this.getStringValue() === 'Расширенная информация') {
       *          $ws.helpers.forEach(fields, function(element) {
       *             element.show();
       *          });
       *       }
       *    });
       * </pre>
       * @see visible
       * @see hide
       * @see toggle
       * @see isVisible
       * @see setVisible
       */
      show : function(){
         this._setVisibility(true);
      },
      /**
       * <wiTag group="Отображение">
       * Скрыть контрол.
       * @example
       * При клике на кнопку (btn) скрыть табличное представление (tableView).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       tableView.hide();
       *    });
       * </pre>
       * @see visible
       * @see show
       * @see toggle
       * @see isVisible
       * @see setVisible
       */
      hide : function(){
         this._setVisibility(false);
      },

      /**
       * Нужно для расчёта авторазмеров: если контейнер, как у автодополнения, лежит в body, то его не надо учитывать
       * при расчёте авторазмеров родителя.
       * @returns {boolean}
       * @protected
       */
      _isContainerInsideParent: function() {
         return this._options.isContainerInsideParent;
      },

      /**
       * <wiTag group="Отображение">
       * Изменить видимость контрола.
       * @param {Boolean} [show] true - показать контрол, false - скрыть.
       * Если значение не задано, то видимость контрола изменится в противоположное состояние.
       * @example
       * 1. При клике на кнопку (btn) показать/скрыть табличное представление (tableView).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       tableView.toggle();
       *    });
       * </pre>
       *
       * 2. Если пользователь указал в поле ввода (fieldString) допустимый возраст, показать дополнительные параметры (fieldRadio).
       * <pre>
       *    fieldString.subscribe('onChange', function(eventObject, value) {
       *       fieldRadio.toggle(parseInt(value) >= 1996);
       *    });
       * </pre>
       * @see visible
       * @see show
       * @see hide
       * @see isVisible
       * @see setVisible
       */
      toggle : function(show) {
         if(show !== undefined){
            this._setVisibility(!!show);
         }else{
            this._setVisibility(!this._isVisible);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Виден ли контрол.
       * @return {Boolean} true - контрол виден, false - контрол скрыт.
       * @example
       * В зависимости от состояния переключателя (switcher) применить фильтр к табличному представлению (tableView).
       * <pre>
       *    switcher.subscribe('onChange', function(eventObject, value) {
       *       if (value && tableView.isVisible()) {
       *          tableView.setQuery('Тип': 'ИП');
       *       }
       *    });
       * </pre>
       * @see visible
       * @see show
       * @see hide
       * @see toggle
       * @see setVisible
       */
      isVisible : function(){
         return this._isVisible;
      },
      /**
       * <wiTag group="Управление">
       * Задать видимость контрола.
       * @param {Boolean} visible true - видимый, false - скрытый.
       * @example
       * При определённом значении группы радикнопок (fieldRadio) сделать видимыми дополнительные контролы.
       * <pre>
       *    fieldRadio.subscribe('onChange', function(eventObject, value) {
       *       if (value === 'ОСНО') {
       *          fieldDropdown.setVisible(true);
       *          fieldString.setVisible(true);
       *       }
       *    });
       * </pre>
       * @see visible
       * @see show
       * @see hide
       * @see toggle
       * @see isVisible
       */
      setVisible: function(visible){
         this.toggle(visible);
      },

      _checkDelayedRecalk: function() {
         var updater = $ws.single.ControlBatchUpdater;
         if (updater._needDelayedRecalk(this))
            updater._doDelayedRecalk(this);
      },

      _setVisibility: function(show){
         if(this._isCorrectContainer() && this._isVisible !== show) {
            this._container.toggleClass('ws-hidden', !show);
            this._isVisible = show;
            var parentElem = this.getContainer().parent(),
                linkedLabel = this._getLinkedLabel();
            if (linkedLabel)  {
               if (parentElem.hasClass('ws-labeled-control')) {
                  parentElem.toggleClass('ws-hidden', !show);
               } else {
                  linkedLabel.toggleClass('ws-hidden', !show);
               }
            }

            var updater = $ws.single.ControlBatchUpdater;
            if (show && updater._needDelayedRecalk(this)) {
               updater._doDelayedRecalk(this);
            }
            else {
               this._notifyOnSizeChanged(this, this);
            }
         }
      },
      /**
       * Есть ли/будет ли у контрола приявязанная метка
       * @return {Boolean}
       * @protected
       */
      _hasLinkedLabel : function() {
         var parent = this._container.parent();
         if (parent.hasClass('ws-labeled-control')) {
            return !!parent.find('label').length;
         }
         return this._options.name && !!parent.find('label[for="fld-' + this._options.name + '"]').length;
      },

      /**
       * Получить метку, приявязанную к контролу
       * Отдаёт undefined если метки нет
       * @return {Object}
       * @protected
       */
      _getLinkedLabel : function() {
         var parent = this.getContainer().parent(),
             label;
         if (this._hasLinkedLabel()) {
            if (parent.hasClass('ws-labeled-control')) {
               label = parent.find('label');
            } else if (this._options.name) {
               label = this._options.name && parent.find('label[for="fld-' + this._options.name + '"]');
            }
         }
         if (label && label.parent) {
            label = label.parent();
         }
         return label;
      },
      _setEnabled: function(enabled){
         this._container
            .toggleClass('ws-enabled', enabled)
            .toggleClass('ws-disabled', !enabled)
            .attr('tabindex',enabled?'0':'-1');
      },
       /**
        * <wiTag group="Управление">
        * Установить активность контрола, которая определяется свойством {@link enabled}.
        * Важно: изменение состояния возможно только после того как контрол и его предок проинициализировались - после init'а.
        * @param {Boolean} enabled true - контрол активен.
        * @example
        * Кнопка (btn) недоступна для клика до тех пор, пока поле ввода (fieldString) не пройдёт валидацию.
        * <pre>
        *    fieldString.subscribe('onValidate', function(event, validationResult) {
        *       btn.setEnabled(validationResult);
        *    });
        * </pre>
        * @see enabled
        * @see isEnabled
        * @see allowChangeEnable
        * @see setAllowChangeEnable
        * @see isAllowChangeEnable
        */
      setEnabled : function(enabled) {
         enabled = !!enabled;
         if(this._options.allowChangeEnable && enabled !== this._options.enabled){
            this._options.enabled = enabled;
            this._setEnabled(enabled);
         }
      },
      _enabledClassToggler: function() {
         var enabled = this._options.enabled;
         if(!this._container) {
            return;
         }
         this._container
            .toggleClass('ws-enabled', enabled)
            .toggleClass('ws-disabled', !enabled);
      },
      /**
       * <wiTag group="Управление">
       * Установить возможность изменения активности контрола.
       * @param {Boolean} allowChangeEnable true - разрешить изменять активность контрола.
       * @example
       * При готовности контрола разрешить изменять его активность.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       if (!this.isAllowChangeEnable()) {
       *          this.setAllowChangeEnable(true);
       *       }
       *    });
       * </pre>
       * @see allowChangeEnabled
       * @see enabled
       * @see isEnabled
       * @see isAllowChangeEnabled
       * @see setEnabled
       */
      setAllowChangeEnable: function(allowChangeEnable){
         this._options.allowChangeEnable = !!allowChangeEnable;
      },
      /**
       * <wiTag group="Управление">
       * Разрешено ли изменение активности контрола.
       * @return {Boolean} true - разрешено изменять активность контрола.
       * @example
       * Запретить изменение активности дочернего контрола.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var child = this.getChildControlByName('Поле');
       *       if (child.isAllowChangeEnable()) child.setAllowChangeEnable(false);
       *    });
       * </pre>
       * @see enabled
       * @see allowChangeEnabled
       * @see setAllowChangeEnabled
       * @see isEnabled
       * @see setEnabled
       */
      isAllowChangeEnable: function(){
         return this._options.allowChangeEnable;
      },
      /**
       * <wiTag group="Управление">
       * Получить идентификатор владельца контрола.
       * @return {String|null} Идентификатор владельца контрола.
       * Возвращает null, если владельца нет.
       * @example
       * При готовности контрола получить идентификатор его владельца. Если владельца нет, то задать его.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       if (this.getOwnerId() === null) {
       *          this.setOwner(control2);
       *       }
       *    });
       * </pre>
       * @see owner
       * @see getOwner
       * @see setOwner
       * @see makeOwnerName
       */
      getOwnerId: function() {
         var owner = this.getOwner();
         return owner instanceof $ws.proto.Control ? owner.getId() : null;
      },
      /**
       * <wiTag group="Управление">
       * Получить владельца контрола.
       * @return {$ws.proto.Control|null} Экземпляр класса владельца контрола. Возвращает null, если владельца нет.
       * @example
       * При клике на кнопку (btn) перезагрузить данные табличного представления (tableView), если он - владелец кнопки.
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       if (this.getOwner() === tableView) {
       *          tableView.reload();
       *       }
       *    });
       * </pre>
       * @see owner
       * @see getOwnerId
       * @see setOwner
       * @see makeOwnerName
       */
      getOwner: function() {

         var owner = null;

         // Если есть закэшированный владелец - отдадим его
         if (this._owner) {
            owner = this._owner;
         } else if (this._options.owner) {
            // Если нет, но задан в опция - попробуем получить его
            try{
               // и закэшировать, если получилось
               this._owner = owner = $ws.single.ControlStorage.getWithParentName(this._options.owner);
            } catch(e){}
         }

         return owner;
      },
      /**
       * <wiTag group="Управление">
       * Задать владельца контрола.
       * @param {String|$ws.proto.Control} owner Идентификатор нового владельца контрола или экземпляр класса владельца контрола.
       * @example
       * Если у кнопки (btn) нет владельца, то сделать табличное представление (tableView) контролом-владельцем.
       * <pre>
       *    btn.subscribe('onReady', function() {
       *       //дополнительно проверяем нахождение контролов в одном окне
       *       if (this.getOwner() === null && this.getParent() === tableView.getParent()) {
       *          this.setOwner(tableView);
       *       }
       *    });
       * </pre>
       * @see owner
       * @see getOwnerId
       * @see getOwner
       * @see makeOwnerName
       */
      setOwner: function(owner) {
         if (owner instanceof $ws.proto.Control)
            this._owner = owner;
         else {
            this._options.owner = owner;
            this._owner = null;
         }
      },
      /**
       * <wiTag group="Управление">
       * Получить контейнер контрола.
       * @return {jQuery} jQuery-элемент, на котором строится контрол.
       * @example
       * При готовности контрола установить для него дополнительный CSS-класс.
       * <pre>
       *    var dateObj = new Date();
       *    control.subscribe('onReady', function() {
       *       switch (dateObj.getMonth()) {
       *          case 0:
       *          case 1:
       *          case 11:
       *             this.getContainer().removeClass('ws-default').addClass('ws-winter');
       *             break
       *          default:
       *             this.getContainer().removeClass('ws-winter').addClass('ws-default');
       *             break
       *       }
       *    });
       * </pre>
       * @see isContainerInsideParent
       * @see element
       */
      getContainer: function(){
         return this._container;
      },
      /**
       * <wiTag group="Управление">
       * Создать строку в формате "ИмяОкна/ИмяКонтрола", где окно - это область, на которой построен контрол.
       * Применяется в тех случаях, когда контролу в качестве владельца передаётся строка (имя владельца фиксированного
       * формата).
       * @return {String} Имя контрола в формате "ИмяОкна/ИмяКонтрола".
       * @example
       * Сделаем поле ввода (fieldString) контролом-владельцем автодополнения (suggest).
       * <pre>
       *    suggest.subscribe('onReady', function() {
       *       var windowName = fieldString.makeOwnerName(),
       *       this.setOwner(windowsName);
       *    });
       * </pre>
       * @see owner
       * @see getOwnerId
       * @see setOwner
       * @see getOwner
       */
      makeOwnerName: function(){
         var parent = this.findParent(function(parent) {
            // ws-tabs-generated - динамически добавленная вкладка, её элементы должны упираться в неё
            // не динамическая вкладка - джинн прокидывает название шаблона в этом случае
            if ($ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.TabTemplatedArea') && !parent.getContainer().hasClass('ws-tabs-generated')) {
               return false;
            }
            return $ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.TemplatedAreaAbstract');

         });
         return [ parent && parent.getCurrentTemplateName(), this.getName()].join('/');
      },
      /**
       * <wiTag noShow>
       */
      getMinSize:function (){
         return {
            'minHeight':this.getMinHeight(),
            'minWidth':this.getMinWidth()
         };
      },

      _getAutoHeight: function() {
         return this._container.outerHeight();
      },

      _getAutoWidth: function() {
         return this._container.outerWidth();
      },

      _getFixedHeight: $ws.helpers.memoize(function() {
         return this._container.outerHeight();
      }, '_getFixedHeight'),

      _getFixedWidth: $ws.helpers.memoize(function() {
         return this._container.outerWidth();
      }, '_getFixedWidth'),

      /**
       * <wiTag noShow>
       */
      getMinHeight:function (){
         if(this._container && this.isVisible()){
            var minHeight, autoHeight = this._options.autoHeight;
            if (this._verticalAlignment === 'Stretch') {
               //Если растяг с автовысотой, то нужно вернуть свою возможную минимальную высоту
               minHeight = autoHeight ? this._calcMinHeight() : 0;
            } else if (autoHeight) {
               minHeight = this._getAutoHeight();
            } else {
               // @todo в целях оптимизации возможно записать в атрибут
               minHeight = (this._height && this._height !== "100%" && this._height !== "auto") ?
                            parseInt(this._height, 10) : this._getFixedHeight();
            }

            // сначала проверяется максимальный размер, т.к. браузеры считают именно так
            if(minHeight > this._options.maxHeight){
               minHeight = this._options.maxHeight;
            }
            if(minHeight < this._options.minHeight){
               minHeight = this._options.minHeight;
            }
            if(this._margins['top'])
               minHeight += this._margins['top'];
            if(this._margins['bottom'])
               minHeight += this._margins['bottom'];
            return minHeight;
         }
         return 0;
      },

      /**
       * Вычисляет свою возможную минимальную высоту
       * @return {Number}
       * @private
       */
      _calcMinHeight: function() {
         return this._options.minHeight;
      },
      /**
       * Вычисляет свою возможную минимальную ширину
       * @return {Number}
       * @private
       */
      _calcMinWidth: function() {
         return this._options.minWidth;
      },
      /**
       * <wiTag noShow>
       */
      getMinWidth:function (){
         if(this._container && this.isVisible()){
            var minWidth, autoWidth = this._options.autoWidth;
            if(this._horizontalAlignment === 'Stretch'){
               //Если растяг с автошириной, то нужно вернуть свою возможную минимальную ширину
               minWidth = autoWidth ? this._calcMinWidth() : 0;
            } else if (this._options.autoWidth) {
               minWidth = this._getAutoWidth();
            } else {
               minWidth = (this._width && this._width !== "100%" && this._width !== "auto") ?
                           parseInt(this._width, 10) : this._getFixedWidth();
            }

            if(minWidth > this._options.maxWidth){
               minWidth = this._options.maxWidth;
            }
            if(minWidth < this._options.minWidth){
               minWidth = this._options.minWidth;
            }
            if(this._margins['left'])
               minWidth += this._margins['left'];
            if(this._margins['right'])
               minWidth += this._margins['right'];
            return minWidth;
         }
         return 0;
      },
      /**
       * <wiTag noShow>
       */
      getAlignment:function (){
         return {
            horizontalAlignment:this._horizontalAlignment,
            verticalAlignment:this._verticalAlignment
         }
      },

      /**
       * <wiTag group="Управление">
       * Отправить команду на обработку.
       * Обработает либо контрол, либо его владелец, либо один из родительских контролов.
       * @param {String} commandName Имя команды.
       * @param {*} [agr1, ... ] Агрументы, которые будут переданы в команду.
       * @return {Boolean|*} Результат выполнения команды:
       * <ol>
       *    <li>true - один из обработчиков команд вернул true, либо ни один из обработчиков команды не вернул true-value (!!value === true);</li>
       *    <li>false - команда не была никем обработана - её не было ни у одного контрола;</li>
       *    <li>другой результат - обработчик команды вернул какое-либо true-value (!!value === true), тогда возвращается это значение.</li>
       * </ol>
       * @example
       * 1. В зависимости от положения переключателя (switcher) отправить команду табличному представлению (tableView).
       * <pre>
       *    switcher.subscribe('onChange', function(eventObject, value) {
       *       if (value) {
       *          tableView.sendCommand('fill', {'fillData': '+7 (4855) 25245'});
       *       } else {
       *          tableView.sendCommand('reload');
       *       }
       *    });
       * </pre>
       *
       * 2. При нажатии ОК диалог редактирования записи отправит команду.
       * <pre>
       *    dialogRecord.sendCommand('save', readyDeferred, true);
       *    readyDeferred.addCallbacks(
       *       function() {
       *          $ws.core.alert('Сохранено успешно!');
       *       },
       *       function() {
       *          $ws.core.alert('Ошибка при сохранении!');
       *       }
       *    );
       * </pre>
       */
      sendCommand : function( commandName) {
         var payload = Array.prototype.slice.call(arguments, 1);
         payload.unshift(this, commandName);
         return $ws.single.CommandDispatcher.sendCommand.apply($ws.single.CommandDispatcher, payload);
      },
      _isAttachedToDom:function() {
         return this._container.parents(':last').is('html');
      },
      /**
       * <wiTag noShow>
       * Может ли контрол получать фокус.
       * Метод сработает, если контрол видим, активен и у него есть табиндекс.
       * @return {Boolean} true - может получать фокус, false - нет.
       */
      canAcceptFocus: function(){
         // Обязательно надо проверять на видимость с учетом родителя, иначе могут быть проблемы
         return this.isVisible() && this.isEnabled() && this.getTabindex() && $ws.helpers.isElementVisible(this.getContainer());
      },
      /**
       * <wiTag noShow>
       * Является ли контрол подконтролом.
       * Важно для обработки фокуса: фокус на подконтролы не переходит.
       * @return {Boolean} true - контрол является подконтролом, false - нет.
       *
       */
      isSubControl: function(){
         return this._options.subcontrol;
      },
      /**
       * Установить значение у контрола, вызвать _redraw
       * Эксперементальный метод, не использовать
       */
      _setOptions: function( option, value ) {
         // Установим параметр
         var obj = this._options,
            path = option.split("." ),
            cur_param = "";
         for( var i = 0; i < path.length; i++ ) {
            cur_param = path[i];
            if( cur_param in obj ){
               if( i <= path.length - 2 )
                  obj = obj[cur_param];
               else
                  obj[cur_param] = value;
            } else
               break;
         }

         if( i == path.length ) {
            this._redraw();
            return true;
         }

         return false;
      },
      /**
       * <wiTag group="Данные">
       * Запомнить пользовательские данные в контроле.
       *
       * Пользовательские данные (ПД) - это дополнительная информация, привязанная к контролу и предназначенная для
       * решения прикладных задач. Механизм ПД позволяют не создавать новую сущность и не расширять поведение контрола
       * засчёт наследования.
       * @param {String} name Имя ключа, по которому привязываются данные.
       * @param {*} value Значение, которое будет присвоено ключу.
       * @example
       * Решим задачу реализации подсчёта количества кликов по кнопке.
       * Это можно сделать, если создать новый класс и описать функцию счётчика.
       *
       * При помощи механизма ПД эта задача решается без создания новых сущностей.
       * <pre>
       *    //создаём ключ с названием clicksCounter и присваиваем ему значение 0
       *    button.setUserData('clicksCounter', 0);
       *    button.subscribe('onActivated', function() {
       *       button.setUserData('clicksCounter', button.getUserData('clicksCounter') + 1);
       *    });
       * </pre>
       * @see getUserData
       */
      setUserData: function(name, value) {
         if (!this._userData) {
            this._userData = {};
         }
         this._userData[name] = value;
      },
      /**
       * <wiTag group="Данные">
       * Получить сохранённые пользовательские данные.
       *
       * Пользовательские данные (ПД) - это дополнительная информация, привязанная к контролу и предназначенная для решения прикладных задач.
       * Механизм ПД позволяют не создавать новую сущность и не расширять поведение контрола засчёт наследования.
       * @param {String} name Имя ключа, по которому было записано значение.
       * @returns {*} Если значения нет, то возвращается undefined.
       * @example
       * Решим задачу реализации подсчёта количества кликов по кнопке.
       * Это можно сделать, если создать новый класс и описать функцию счётчика.
       *
       * При помощи механизма ПД эта задача решается без создания новых сущностей.
       * <pre>
       *    button.setUserData('clicksCounter', 0);
       *    button.subscribe('onActivated', function() {
       *       button.setUserData('clicksCounter', button.getUserData('clicksCounter') + 1);
       *    });
       * </pre>
       * @see setUserData
       */
      getUserData: function(name) {
         return this._userData && this._userData[name];
      }
   });
   /**
    * @singleton
    * @class $ws.single.ControlStorage
    * @deprecated Этот класс - сосредоточение мирового зла. Пожалуйста, постарайтесь не использовать его.
    */
   $ws.single.ControlStorage = /** @lends $ws.single.ControlStorage.prototype */{
      _storage : {},
      _waitingChildren: {},
      _waitingChildrenByName: {},
      _storageWithParentName: {},
      /**
       * Сохраняет элемент управления в хранилище
       *
       * @param {$ws.proto.Control} control
       * @returns {String|Boolean} ID элемента, если сохранен, false в противном случае.
       * @deprecated Использовать крайне не рекомендуется
       */
      store : function(control){
         var id = false;
         if(control instanceof $ws.proto.Control){
            this._storage[id = control.getId()] = control;
            if(this._waitingChildren[id]) {
               try {
                  this._waitingChildren[id].callback(control);
               }
               finally {
                  delete this._waitingChildren[id]
               }
            }
            var name = control.getName(),
                ownerName = control.makeOwnerName().split("/"),
                parentName = ownerName[0],
                parentStorage = {};
            if(this._waitingChildrenByName[name] && !this._waitingChildrenByName[name].isReady()) {
               try {
                  this._waitingChildrenByName[name].callback(control);
               }
               finally {
                  delete this._waitingChildrenByName[name];
               }
            }
            this._storageWithParentName[parentName] = this._storageWithParentName[parentName] || {};
            parentStorage = this._storageWithParentName[parentName];
            if(parentStorage[name] instanceof $ws.proto.Deferred){
               var def = parentStorage[name];
               parentStorage[name] = control;
               def.callback(control);
            } else
               parentStorage[name] = control;
         }
         return id;
      },
      /**
       * Убирает элемент управления из хранилища
       * @param {$ws.proto.Control} control
       * @deprecated Использовать крайне не рекомендуется
       */
      remove : function(control){
         if(control instanceof $ws.proto.Control) {
            var id = control.getId(),
                name = control.getName(),
                ownerName = control.makeOwnerName().split("/"),
                parentName = ownerName[0];
            if(id in this._storage) {
               this._storage[id] = null;
               delete this._storage[id];
            }
            if(id in this._waitingChildren) {
               this._waitingChildren[id] = null;
               delete this._waitingChildren[id];
            }
            if(name in this._waitingChildrenByName) {
               this._waitingChildrenByName[name] = null;
               delete this._waitingChildrenByName[name];
            }
            if(parentName in this._storageWithParentName){
               this._storageWithParentName[parentName][name] = null;
               delete this._storageWithParentName[parentName][name];
            }
         }
      },
      /**
       * Получить контрол по идентификатору.
       * @param {String} id Идентификатор искомого контрола.
       * @return {$ws.proto.Control} Найденный контрол.
       * @deprecated Используйте $ws.proto.AreaAbstract.getChildControlByName
       */
      get : function(id){
         if (this._storage[id] === undefined)
            throw new Error("ControlStorage : id = '" + id + "' not stored");
         return this._storage[id];
      },
      /**
       * Проверить по идентификатору наличие контрола.
       * @param {String} id Идентификатор искомого контрола.
       * @returns {Boolean} true - контрол нашли, false - не нашли.
       * @deprecated Использовать крайне не рекомендуется
       */
      contains : function(id){
         return this._storage[id] !== undefined;
      },
      /**
       * Получить контрол по его имени.
       * @param {String} name Имя контрола.
       * @param {Object} [classObject] Класс, интстансом которого должен быть контрол.
       * @return {$ws.proto.Control} Найденный контрол.
       * @deprecated Используйте $ws.proto.AreaAbstract.getChildControlByName
       */
      getByName: function(name, classObject) {
         for(var id in this._storage) {
            if(this._storage.hasOwnProperty(id)) {
               if(this._storage[id].getName() == name){
                  if(classObject && !(this._storage[id] instanceof classObject)){
                     continue;
                  }
                  return this._storage[id];
               }
            }
         }
         throw new Error("ControlStorage : control with name '" + name + "' is not stored");
      },
      /**
       * @param name
       * @returns {*}
       * @deprecated Использовать крайне не рекомендуется
       */
      getWithParentName: function(name) {
         var names = name.split("/"),
             controlName = names[1],
             parentName = names[0];
         if(parentName in this._storageWithParentName && controlName in this._storageWithParentName[parentName]){
            return this._storageWithParentName[parentName][controlName]
         }
         throw new Error("ControlStorage : control with name '" + controlName + "' is not stored in parent with name " + parentName);
      },
      /**
       * Проверить по имени наличие контрола.
       * @param {String} name Имя искомого контрола.
       * @returns {Boolean} true - нашли контрол, false - не нашли.
       * @deprecated Используйте $ws.proto.AreaAbstract.hasChildControlByName
       */
      containsByName : function(name){
         for(var id in this._storage) {
            if(this._storage.hasOwnProperty(id)) {
               if(this._storage[id].getName() == name)
                  return true;
            }
         }
         return false;
      },
       /**
        * Ожидание создания контрола с определённым идентификатором.
        * @param {String} id Идентификатор контрола.
        * @return {$ws.proto.Deferred}
        * @deprecated Используйте $ws.proto.AreaAbstract.waitChildControlById
        */
      waitChild: function(id){
         if(id in this._storage)
            return new $ws.proto.Deferred().callback(this._storage[id]);
         else
            return (id in this._waitingChildren) ?
                  this._waitingChildren[id] :
                  (this._waitingChildren[id] = new $ws.proto.Deferred());
      },
      /**
       * Ожидание создания контрола с определённым именем.
       * @param {String} name Имя контрола.
       * @return {$ws.proto.Deferred}
       * @deprecated Используйте $ws.proto.AreaAbstract.waitChildControlByName
       */
      waitChildByName: function(name){
         if(this.containsByName(name))
            return new $ws.proto.Deferred().callback(this.getByName(name));
         else
            return (name in this._waitingChildrenByName) ?
                  this._waitingChildrenByName[name] :
                  (this._waitingChildrenByName[name] = new $ws.proto.Deferred());
      },
      /**
       * Ожидание контрола по имени самого контрола и имени его родителя
       * @param {String} name Строка вида <имя родителя>/<имя контрола>.
       * @return {$ws.proto.Deferred}
       * @deprecated Использовать крайне не рекомендуется
       */
      waitWithParentName: function(name){
         var names;
         // todo remove this condition after 3.6
         if (name.indexOf('/') > -1) {
            names = name.split('/');
            this._storageWithParentName[names[0]] = this._storageWithParentName[names[0]] || {};
            var parentStorage = this._storageWithParentName[names[0]];
            if(parentStorage[names[1]] instanceof $ws.proto.Control)
               return new $ws.proto.Deferred().callback(parentStorage[names[1]]);
            else if(parentStorage[names[1]] instanceof $ws.proto.Deferred)
               return parentStorage[names[1]];
            else
               return ( parentStorage[names[1]] = new $ws.proto.Deferred() );
         }
         return $ws.single.ControlStorage.waitChild(name);
      },
      /**
       * Получить все хранимые контролы.
       * @returns {*}
       * @deprecated Использовать крайне не рекомендуется
       */
      getControls: function(){
         return this._storage;
      }
   };

   if (window){
      $ws.single.NavigationController.init();
   }

   /**
    * Класс, описывающий контрол, связанный с данными в контексте
    * Заботится о своевременном получении значения из контекста
    * @class $ws.proto.DataBoundControl
    * @extends $ws.proto.Control
    * @mixes $ws.mixins.DataBoundMixin
    */
   $ws.proto.DataBoundControl = $ws.core.mixin($ws.proto.Control, DataBoundMixin);

   return {
      Control: $ws.proto.Control,
      DataBoundControl: $ws.proto.DataBoundControl,
      ControlStorage: $ws.single.ControlStorage,
      ControlBatchUpdater: $ws.single.ControlBatchUpdater
   };
});
