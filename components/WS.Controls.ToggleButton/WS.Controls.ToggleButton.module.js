/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!WS.Controls.ToggleButton', ['js!WS.Controls.Button', 'js!SBIS3.CONTROLS.Checkable'], function(WSButton, Checkable) {

   'use strict';

   /**
    * Контрол, отображающий кнопку с залипанием.
    * @class SBIS3.CONTROLS.ToggleButton
    * @extends SBIS3.CONTROLS.Button
    * @demo SBIS3.CONTROLS.Demo.MyToggleButton
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
    *
    * @public
    * @control
    * @category Buttons
    * @initial
    * <component data-component='SBIS3.CONTROLS.ToggleButton'>
    *    <option name='caption' value='Кнопка с залипанием'></option>
    * </component>
    */

   var WSToggleButton = WSButton.extend([Checkable], /** @lends SBIS3.CONTROLS.ToggleButton.prototype */ {
      $protected: {
         _options: {

         }
      },

      _modifyOptions: function () {
         var
             options = WSButton.superclass._modifyOptions.apply(this, arguments);

         options.className +=  (options.checked ? ' controls-Checked__checked' : '');
         return options;
      }
   });

   return WSToggleButton;

});
