/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ToggleButton', ['js!SBIS3.CONTROLS.Button', 'js!SBIS3.CONTROLS.Checkable', 'html!SBIS3.CONTROLS.ToggleButton'], function(Button, Checkable, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий кнопку с залипанием.
    * @class SBIS3.CONTROLS.ToggleButton
    * @extends SBIS3.CONTROLS.Button
    * @control
    * @demo SBIS3.CONTROLS.Demo.MyToggleButton
    * @public
    * @author Крайнов Дмитрий Олегович
    * @category Buttons
    * @initial
    * <component data-component='SBIS3.CONTROLS.ToggleButton'>
    *    <option name='caption' value='Кнопка с залипанием'></option>
    * </component>
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

   var ToggleButton = Button.extend([Checkable], /** @lends SBIS3.CONTROLS.ToggleButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

         }
      }
   });

   return ToggleButton;

});