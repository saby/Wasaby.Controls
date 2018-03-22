/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!WSControls/Buttons/ToggleButton', ['js!WSControls/Buttons/Button', 'SBIS3.CONTROLS/Mixins/Checkable'], function(WSButton, Checkable) {

   'use strict';

   /**
    * Контрол, отображающий кнопку с залипанием.
    *
    * @class WSControls/Buttons/ToggleButton
    * @extends WSControls/Buttons/Button
    * @demo Examples/ToggleButton/MyToggleButton/MyToggleButton
    *
    * @author Крайнов Д.О.
    *
    * @mixes SBIS3.CONTROLS/Mixins/Checkable
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
    * @category Button
    * @initial
    * <component data-component='WSControls/Buttons/ToggleButton'>
    *    <option name='caption' value='Кнопка с залипанием'></option>
    * </component>
    */

   var WSToggleButton = WSButton.extend([Checkable], /** @lends WSControls/Buttons/ToggleButton.prototype */ {
      $protected: {
         _options: {

         }
      },

      _modifyOptions: function () {
         var
             options = WSToggleButton.superclass._modifyOptions.apply(this, arguments);

         options._iconDisabledClass = 'icon-button-disabled';
         options._type = 'Button';
         options.cssClassName +=  (options.checked ? ' controls-Checked__checked' : '');
         return options;
      }
   });

   return WSToggleButton;

});
