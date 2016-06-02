define('js!SBIS3.CONTROLS.OpenDialogAction', ['js!SBIS3.CONTROLS.DialogActionBase'], function(DialogActionBase){
   'use strict';

   /**
    * Класс, описывающий действие открытия окна с заданным шаблоном. Применяется для работы с диалогами редактирования списков.
    * Подробнее об использовании класса вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/component-control/">Управление диалогом редактирования списка.</a>.
    * @class SBIS3.CONTROLS.OpenDialogAction
    * @public
    * @extends SBIS3.CONTROLS.DialogActionBase
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip
    * @ignoreOptions visible tooltip tabindex enabled className alwaysShowExtendedTooltip allowChangeEnable
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
    * @ignoreMethods setVisible toggle show isVisible hide getTooltip isAllowChangeEnable isEnabled isVisibleWithParents
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop
    */
   var OpenDialogAction = DialogActionBase.extend(/** @lends SBIS3.CONTROLS.OpenDialogAction.prototype */{
      _buildComponentConfig: function(meta) {
         //Если запись в meta-информации отсутствует, то передаем null. Это нужно для правильной работы DataBoundMixin с контекстом и привязкой значений по имени компонента
         var record = ($ws.helpers.instanceOfModule(meta.item, 'SBIS3.CONTROLS.Data.Record') ? meta.item.clone() : meta.item) || null;

         return {
            source: meta.dataSource,
            key : meta.id,
            dataSource: meta.dataSource,
            initValues : meta.filter,
            record: record
         }
      }
   });
   return OpenDialogAction;
});