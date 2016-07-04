/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.List.Move', [
      'js!SBIS3.CONTROLS.Action.Action',
      'js!SBIS3.CONTROLS.Action.List.ListMixin'
   ],
   function (ActionBase, ListMixin) {
      'use strict';
      /**
       * Базовый класс перемещения элементов в списке
       * @class SBIS3.CONTROLS.Action.List.Move
       * @public
       * @extends SBIS3.CONTROLS.Action.Action
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
      var Move = ActionBase.extend([ListMixin], /** @lends SBIS3.CONTROLS.Action.List.Move.prototype */{

         _doExecute: function (params) {
            if (params) {
               return this._move(params.from, params.to, params.down);
            }
         },

         _move: function () {
         }

      });
      return Move;
   });