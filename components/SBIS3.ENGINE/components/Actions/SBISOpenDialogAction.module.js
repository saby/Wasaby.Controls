define('js!SBIS3.Engine.SBISOpenDialogAction', ['js!SBIS3.CONTROLS.OpenDialogAction'], function(OpenDialogAction){
   'use strict';

   /**
    * Действие открытия окна редактирования записи со спецификой платформы СБИС
    * @class SBIS3.Engine.SBISOpenDialogAction
    * @public
    * @extends SBIS3.CONTROLS.OpenDialogAction
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
   var SBISOpenDialogAction = OpenDialogAction.extend(/** @lends SBIS3.Engine.SBISOpenDialogAction.prototype */{
      $protected : {
         _options : {
            /**
             * @cfg {String}
             * Компонент который будет отображен для редактирования
             */
            folderDialogComponent : '',
            /**
             * @cfg {String}
             * @variant dialog в новом диалоге
             * @variant floatArea во всплывающей панели
             * Режим отображения компонента редактирования для папок - в диалоге или панели
             */
            folderEditMode: ''
         }
      },
      execute : function(meta) {
         if (meta.itemType) {
            this._opendEditComponent(meta, this._options.folderDialogComponent, this._options.folderEditMode);
         }
         else {
            this._opendEditComponent(meta, this._options.dialogComponent, this._options.mode);
         }
      }
   });
   return SBISOpenDialogAction;
});