/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ToggleButton', ['js!WSControls/Buttons/ToggleButton', 'css!SBIS3.CONTROLS.Button', 'css!SBIS3.CONTROLS.ToggleButton'], function(WSToggleButton) {

   'use strict';

   /**
    * Контрол, отображающий кнопку с фиксацией.
    *
    * {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/buttons/button-line/#_3 Демонстрационные примеры}.
    * <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Спецификация</a>.
    *
    * @class SBIS3.CONTROLS.ToggleButton
    * @extends WSControls/Buttons/ToggleButton
    * @author Романов Валерий Сергеевич
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

   var ToggleButton = WSToggleButton.extend([], /** @lends SBIS3.CONTROLS.ToggleButton.prototype */ {
      $protected: {
         _options: {

         }
      },

      _modifyOptions: function () {
         var
             options = ToggleButton.superclass._modifyOptions.apply(this, arguments);

         options.cssClassName +=  ' controls-ToggleButton__normal controls-Button' + (options.primary ? ' controls-Button__primary' : ' controls-Button__default');
         return options;
      }
   });

   return ToggleButton;

});