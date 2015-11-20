define('js!SBIS3.CONTROLS.OpenDialogAction', ['js!SBIS3.CONTROLS.ActionBase', 'js!SBIS3.CORE.Dialog'], function(ActionBase, Dialog){
   'use strict';

   /**
    * Действие открытия окна редактирования записи
    * @class SBIS3.CONTROLS.OpenDialogAction
    * @public
    * @extends SBIS3.CONTROLS.ActionBase
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
   var OpenDialogAction = ActionBase.extend(/** @lends SBIS3.CONTROLS.OpenDialogAction.prototype */{
      $protected : {
         _options : {
            dialogComponent : ''
         }
      },
      execute : function(meta) {
         this._openDialog(meta, this._options.dialogComponent);
      },

      _openDialog: function(meta, dialogComponent) {
         var
            self = this,
            dlg = new Dialog({
               template: dialogComponent,
               componentOptions : {
                  key : meta.id,
                  initValues : meta.filter
               }
            });
         dlg.subscribe('onAfterClose', function(e, flag){
            if (flag === true) {
               self._notifyOnExecuted();
            }
         });
      }
   });
   return OpenDialogAction;
});