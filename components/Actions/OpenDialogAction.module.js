define('js!SBIS3.CONTROLS.OpenDialogAction', ['js!SBIS3.CONTROLS.DialogActionBase'], function(DialogActionBase){
   'use strict';

   /**
    * Действие открытия окна с заданным шаблоном
    * @class SBIS3.CONTROLS.OpenDialogAction
    * @public
    * @extends SBIS3.CONTROLS.DialogActionBase
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
   var OpenDialogAction = DialogActionBase.extend(/** @lends SBIS3.CONTROLS.OpenDialogAction.prototype */{
      _buildComponentConfig: function(meta) {
         //Если запись в meta-информации отсутствует, то передаем null. Это нужно для правильной работы DataBoundMixin с контекстом и привязкой значений по имени компонента
         var record = ($ws.helpers.instanceOfModule(meta.item, 'SBIS3.CONTROLS.Data.Record') ? meta.item.clone() : meta.item) || null;

         return {
            dataSource: meta.dataSource,
            key : meta.id,
            newModel: meta.newModel,
            initValues : meta.filter,
            record: record
         }
      }
   });
   return OpenDialogAction;
});