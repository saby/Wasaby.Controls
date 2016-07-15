/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.List.ReorderMove',[
      'js!SBIS3.CONTROLS.Action.List.Move',
      'js!SBIS3.CONTROLS.Action.List.RelativeMoveMixin'
   ],
   function (ListMove, RelativeMoveMixin) {
      'use strict';
      /**
       * Действие перемещения в низ/верх на одну запись
       * @class SBIS3.CONTROLS.Action.List.ReorderMove
       * @public
       * @extends SBIS3.CONTROLS.Action.List.Move
       * @mixes SBIS3.CONTROLS.Action.List.RelativeMoveMixin
       * @author Крайнов Дмитрий Олегович
       * <pre>
       *    var move = new InteractiveMove({
       *       linkedObject: myListView
       *       moveDirection: 'Up'
       *    });
       *
       *    move.execute({from:Model1});//Переместит запись Model1 на одну строчку вверх
       * </pre>
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
      var ReorderMove = ListMove.extend([RelativeMoveMixin],/** @lends SBIS3.CONTROLS.Action.List.ReorderMove.prototype */{
         $protected: {
            _options: {
               /**
                * @cfg {String} Направление перемещения
                * @variant Up Вверх
                * @variant Down Вних
                */
               moveDirection: undefined
            },
            _nearestMethod : undefined
         },

         $constructor: function (cfg) {
            cfg = cfg || {};
            this._options.moveDirection = String(cfg.moveDirection).toLocaleLowerCase();
            if(this._options.moveDirection === 'up') {
               this._nearestMethod = 'getPrevItemById';
            } else if(this._options.moveDirection === 'down') {
               this._nearestMethod = 'getNextItemById';
            } else {
               throw new Error('move direction must be equal Up or Down');
            }
         },

         /**
          * метод выполнящий перемещение
          * @param {WS.Data/Entity/Model} from элемент который будет перемещен
          * @returns {$ws.proto.Deferred}
          * @private
          */
         _move: function (from) {
            var to = this._getNearestItem(from);
            if (to) {
               return ReorderMove.superclass._move.call(this, from, to, (this._options.moveDirection === 'down'));
            }
            return (new $ws.proto.Deferred()).callback(true);
         },
         /**
          * возвращает соседий элемент
          * @param {WS.Data/Entity/Model} item
          * @returns {WS.Data/Entity/Model}
          * @private
          */
         _getNearestItem: function (item) {
            var nearestkey = this._options.linkedObject[this._nearestMethod](item.getId());
            return this._getItems().getRecordById(nearestkey.data('id'));
         }

      });

      return ReorderMove;
   }
);


