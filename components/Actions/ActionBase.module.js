define('js!SBIS3.CONTROLS.ActionBase', ['js!SBIS3.CONTROLS.Control'], function(Control){
   'use strict';

   /**
    * Класс базовый для всех стандартных действий, которые можно использовать в интерфейсе
    * @class SBIS3.CONTROLS.ActionBase
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
   var ActionBase = Control.Control.extend(/** @lends SBIS3.CONTROLS.ActionBase.prototype */{
      /**
       * @event onExecuted После выполнения действия(клик мышкой, кнопки клавиатуры)
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    onActivated: function(event){
       *       $ws.helpers.question('Продолжить?');
       *    }
       * </pre>
       */
      /**
       * Метод запускающий выполнение Action
       */
      execute: function() {
         this._notifyOnExecuted();
      },
      _notifyOnExecuted: function() {
         this._notify('onExecuted')
      }
   });
   return ActionBase;
});