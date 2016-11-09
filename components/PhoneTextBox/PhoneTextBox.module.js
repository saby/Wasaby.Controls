define('js!SBIS3.CONTROLS.PhoneTextBox', ['js!SBIS3.CONTROLS.FormattedTextBox', 'html!SBIS3.CONTROLS.PhoneTextBox'], function(FormattedTextBoxBase, dotTpl) {

   'use strict';

   /**
    * Контрол, отображающий ссылку при нажатии на которую произойдет звонок
    * Сторонние пользователи скорее предпочтут использовать просто <a></a>
    * @class SBIS3.CONTROLS.PhoneCall
    * @extends SBIS3.CONTROLS.Link
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions independentContext contextRestriction extendedTooltip validators
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
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
    * @ignoreEvents onDragIn onDragStart onDragStop onDragMove onDragOut
    *
    * @cssModifier controls-Button__ellipsis При нехватке ширины текст на кнопке оборвётся многоточием.
    * !Важно: при добавлении этого класса сломается "Базовая линия".
    *
    * @css controls-Link__icon Класс для изменения отображения иконки кнопки.
    *
    * @public
    * @control
    * @category Buttons
    * @initial
    * <component data-component='SBIS3.CONTROLS.PhoneCall'>
    *    <option name='caption' value='Позвонить Гене'></option>
    *    <option name='number' value='8(800)200-600'></option>
    * </component>
    */
   var clearNumber = function(number) {
      var digits = number.replace(/[^0-9]/g, '');
      digits = '+' + digits;
      return digits;
   };

   var PhoneTextBox = FormattedTextBoxBase.extend( /** @lends SBIS3.CONTROLS.PhoneCall.prototype */ {
      _dotTplFn: dotTpl,
      $protected: {
         _options: {
            srcText: undefined,
            mask: '+d (ddd) ddd-dd-dd'
         }
      },

      _modifyOptions : function() {
         var newCfg = PhoneTextBox.superclass._modifyOptions.apply(this, arguments);

         return newCfg;
      },

      _setEnabled: function(state) {
         PhoneTextBox.superclass._setEnabled.apply(this, arguments);
         $('.controls-FormattedTextBox__fieldWrapper', this._container.get(0)).toggleClass('ws-hidden', !state);
         $('.controls-PhoneTextBox__link', this._container.get(0)).toggleClass('ws-hidden', state);
      },

      _updateText: function() {

         PhoneTextBox.superclass._updateText.apply(this, arguments);
         $('.controls-PhoneTextBox__link', this._container.get(0)).text(this.getText());
      }
   });

   return PhoneTextBox;

});