/*global $ws, define*/
define('js!SBIS3.CONTROLS.Action.Action',
   [
   "Core/Deferred",
   "js!SBIS3.CORE.Control"
],
   function ( Deferred,Control) {
      'use strict';

      /**
       * Класс базовый для всех стандартных действий, которые можно использовать в интерфейсе
       * @class SBIS3.CONTROLS.Action.Action
       * @public
       * @extends $ws.proto.Control
       * @author Крайнов Дмитрий Олегович
       *
       * @ignoreOptions validators independentContext contextRestriction extendedTooltip
       *
       * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
       * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
       * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
       * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
       * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
       * @ignoreMethods getReadyDeferred getStateKey getTabindex getUserData getValue hasActiveChildControl hasChildControlByName
       * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
       * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
       * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
       * @ignoreMethods setTabindex setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
       * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
       *
       * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
       * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
       */
      //TODO наследуемся от контрола, чтоб можно было размещать в xhtml
      var Action = Control.Control.extend(/** @lends SBIS3.CONTROLS.Action.Action.prototype */{
         /**
          * @event onExecute Перед началом работы действия. Если из события вернуть deferred то основное действие выполнится
          * в коллбеке, если вернуть false или 'custom' то действие будет отменено.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} meta Объект содержащий мета параметры Action'а
          * @see execute
          * @example
          */
         /**
          * @event onExecuted После выполнения основоного действия
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} meta Объект содержащий мета параметры Action'а
          * @see execute
          * @example
          */
          /**
          * @event onError При возникновении ошибки при выполнении Action'a
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Error} error Инстанс ошибки произошедшей при выполнении основного действия.
          * @param {Object} meta Объект содержащий мета параметры Action'а
          * @see execute
          * @example
          */
          /**
          * @event onChangeCanExecute При изменении признака CanExecute
          * @see setCanExecute
          * @see isCanExecute
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Boolean} canExecute
          * @example
          */
         $protected: {
            /**
             * @var {Boolean} canExecute может ли выполниться Action
             */
            _canExecute: true
         },

         $constructor: function () {
            this._publish('onChangeCanExecute', 'onExecuted', 'onExecute', 'onError');
         },
         /**
          * Метод, запускающий выполнение Action'а.
          * @param {Object} meta Объект, содержащий мета-параметры Action'а. Набор мета-параметров фиксирован для каждого Action'а.
          * <ul>
          *     <li>Для класса {@link SBIS3.CONTROLS.DialogActionBase} список мета-параметров описан <a href='https://wi.sbis.ru/docs/SBIS3/CONTROLS/DialogActionBase/typedefs/ExecuteMetaConfig/'>здесь</a>.</li>
          *     <li>Для миксина {@link SBIS3.CONTROLS.Action.DialogMixin} список мета-параметров описан <a href='https://wi.sbis.ru/docs/SBIS3/CONTROLS/Action/DialogMixin/typedefs/ExecuteMetaConfig/'>здесь</a>.</li>
          * </ul>
          * @returns {Deferred}
          */
         execute: function (meta) {
            var self = this;
            if (this.isCanExecute()) {
               return this._callHandlerMethod([meta], 'onExecute', '_doExecute').addCallbacks(function (result) {
                  if (result !== false) {
                     return this._notifyOnExecuted(meta);
                  }
               }, function (error) {
                  self._handleError(error, meta);
                  self._notify('onError', error, meta);
                  return error;
               });
            }
         },
         /**
          * Устанавливает признак может ли выполнится Action.
          * @param {Boolean} canExecute
          * @see isCanExecute
          */
         setCanExecute: function (canExecute) {
            canExecute = !!canExecute;
            if (this._canExecute !== canExecute) {
               this._canExecute = canExecute;
               this._notify('onChangeCanExecute', canExecute);
            }
         },
         /**
          * Дает возможность пользоватeлю переопределить стандартное поведение(вызов метода method) через вызов события event
          * _callHandlerMethod подымает событие event и вызывает метод method, если из события возвращается false или custom то
          * method не вызывается, если из события возвращается deferred то method вызовется в коллбеке, так же
          * событие может вернуть название другого метода и он будет вызван вместо method
          * @param {Array} args  Параметры которые будут переданы в event и method
          * @param {String} event  Название события которое надо поднято
          * @param {String} method  Название метода который надо вызвать
          * @returns {Deferred}
          * @private
          */
         _callHandlerMethod: function (args, event, method) {
            var evenResult = this._notify.apply(this, [event].concat(args)),
               call = typeof this[evenResult] === 'function' ? this[evenResult] : this[method];
            if (evenResult !== false && evenResult !== Action.ACTION_CUSTOM) {
               var def = evenResult instanceof Deferred ? evenResult : new Deferred().callback(true),
                  self = this;
               return def.addCallback(function (defResult) {
                  if(defResult !== false && defResult !== Action.ACTION_CUSTOM) {
                     call = typeof self[defResult] === 'function' ? self[defResult] : call;
                     if (typeof call === 'function') {
                        return call.apply(self, args);
                     }
                  }
               });
            }
            return new Deferred().callback(evenResult);
         },
         /**
          * Вовращает признак: может ли выполниться Action.
          * @returns {Boolean}
          * @see setCanExecute
          */
         isCanExecute: function () {
            return this._canExecute;
         },
         /**
          * метод выполняющий основное действие Action'а
          * @param {Object} meta Объект содержащий мета параметры Action'а
          * @private
          */
         _doExecute: function () {
         },
         /**
          * @param {Error} error Ошибка возникшая в результате выполнения deferred'a, который вернул  _doExecute
          * @param {Object} meta Объект содержащий мета параметры Action'а
          * @private
          */
         _handleError: function (error, meta) {
         },
         /**
          * 
          * @private
          */
         _notifyOnExecuted: function () {
            var args = arguments.slice();
            args.unshift('onExecuted');
            this._notify.apply(this, args);
         }
      });
      Action.ACTION_CUSTOM = 'custom';
      return Action;
   });