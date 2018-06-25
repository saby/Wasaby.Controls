/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('SBIS3.CONTROLS/Button/ToggleButton', [
   'SBIS3.CONTROLS/WSControls/Buttons/ToggleButton',
   'SBIS3.CONTROLS/Utils/ButtonUtil',
   'css!SBIS3.CONTROLS/Button/Button',
   'css!SBIS3.CONTROLS/Button/ToggleButton/ToggleButton'
], function(WSToggleButton, ButtonUtil) {

   'use strict';

   /**
    * Класс контрола "Кнопка с фиксацией".
    *
    * <a href='/doc/platform/developmentapl/interface-development/components/textbox/buttons/button-line/#toggle-button'>Демонстрационные примеры</a>.
    * <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Спецификация</a>.
    *
    * @class SBIS3.CONTROLS/Button/ToggleButton
    * @extends WSControls/Buttons/ToggleButton
    * @author Герасимов А.М.
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
    * @css ws-toggleHeader Устанавливает для кнопки стилевое оформление "Заголовок с кнопкой слева" (см. <a href="http://axure.tensor.ru/standarts/v7/#p=разделители__заголовки___версия_05_">Стандарты</a>).
    *
    * @public
    * @control
    * @category Button
    * @initial
    * <component data-component='SBIS3.CONTROLS/Button/ToggleButton'>
    *    <option name='caption' value='Кнопка с залипанием'></option>
    * </component>
    */

   var ToggleButton = WSToggleButton.extend([], /** @lends SBIS3.CONTROLS/Button/ToggleButton.prototype */ {
       $protected: {
           _options: {
               style: 'standard'
           }
       },
      _modifyOptions: function () {
         var
             options = ToggleButton.superclass._modifyOptions.apply(this, arguments);

         ButtonUtil.preparedClassFromOptions(options);
         options.cssClassName +=  ' controls-ToggleButton__normal controls-Button';
         return options;
      },

      _toggleState: function () {
          var container = this._container;

          container[0].className = container[0].className.replace(/(^|\s)controls-Button_size-\S+/g, '').replace(/(^|\s)controls-Button_state-\S+/g, '');
          container.addClass(ButtonUtil.getClassState(this._options));
          ToggleButton.superclass._toggleState.apply(this, arguments);
      }
   });

   return ToggleButton;
});
