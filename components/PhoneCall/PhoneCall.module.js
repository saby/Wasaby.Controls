define('js!SBIS3.CONTROLS.PhoneCall', ['js!SBIS3.CONTROLS.Link'], function(Link) {

   'use strict';

   /**
    * Контрол, отображающий ссылку при нажатии на которую произойдет звонок
    * Сторонние пользователи скорее предпочтут использовать просто <a></a>
    * @class SBIS3.CONTROLS.PhoneCall
    * @extends SBIS3.CONTROLS.Link
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.PhoneCall'>
    *    <option name='caption' value='Позвонить Гене'></option>
    *    <option name='number' value='8(800)200-600'></option>
    * </component>
    * @public
    * @author Крайнов Дмитрий Олегович
    * @category Buttons
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
    */
   var clearNumber = function(number) {
      var digits = number.replace(/[^0-9]/g, '');
      digits = '+' + digits;
      return digits;
   };

   var PhoneCall = Link.extend( /** @lends SBIS3.CONTROLS.Link.prototype */ {
      $protected: {
         _options: {
            /**
             * @cfg {String} Номер телефона. Номер может включать любые символы, но должен начинаться с кода страны. Например 8(910)555-55-55 не верно +7(910)555-55-55 верно
             * @example
             * <pre>
             *     <option name="number" value="8(800)200-600"></option>
             * </pre>
             * @see href
             */
            number: ''
         }
      },

      _modifyOptions : function() {
         var newCfg = PhoneCall.superclass._modifyOptions.apply(this, arguments);
         if (newCfg.number) {
            newCfg.href = 'tel:' + clearNumber(newCfg.number);
         }
         return newCfg;
      },

      setPhone: function(phone) {
         this._options.phone = phone;
         this.setHref('tel:' + clearNumber(newCfg.number));
      },

      getPhone: function() {
         return this._options.phone;
      }
   });

   return PhoneCall;

});