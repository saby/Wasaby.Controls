define('js!SBIS3.CONTROLS.ActionBase', ['js!SBIS3.CORE.Control'], function(Control){
   'use strict';

   /**
    * Класс базовый для всех стандартных действий, которые можно использовать в интерфейсе
    * @class SBIS3.CONTROLS.ActionBase
    * @public
    * @extends SBIS3.CORE.Control
    * @author Крайнов Дмитрий Олегович
    * @deprecated используйте SBIS3.CONTROLS.Action.Action
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
   //TODO наследуемся от контрола, чтоб можно было размещать в xhtml
   var ActionBase = Control.Control.extend(/** @lends SBIS3.CONTROLS.ActionBase.prototype */{
      /**
       * @event onExecuted Происходит после завершения работы действия.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Boolean|Object} meta Результат работы.
       * @param {WS.Data/Entity/Record} record Редактируемая запись.
       */
      /**
       * Запускает выполнение действия.
       */
      execute: function() {
         this._notifyOnExecuted();
      },
      _notifyOnExecuted: function(meta, record) {
         this._notify('onExecuted', meta, record)
      }
   });
   return ActionBase;
});