define('js!Controls/Popup/Manager/Popup',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Popup',
      'Core/constants',
      'css!Controls/Popup/Manager/Popup'
   ],
   function (Control, template, CoreConstants) {
      'use strict';

      var _private = {
         /**
          * Обработчик фокусировки элемента.
          */
         focusIn: function () {
            this._notify('focusInPopup', this._options.id);
         },

         /**
          * Обработчик потери фокуса.
          * @param event
          * @param focusedControl
          */
         focusOut: function (event, focusedControl) {
            this._notify('focusOutPopup', this._options.id, focusedControl);
         },

         /**
          * Пересчитать позицию попапа
          */
         recalcPosition: function () {
            this._notify('recalcPosition', this);
         }
      };

      /**
       * Компонент вспывающего окна
       * @class Controls/Popup/Manager/Popup
       * @control
       * @extends Controls/Control
       * @public
       * @category Popup
       */
      var Popup = Control.extend({
         _controlName: 'Controls/Popup/Manager/Popup',
         _template: template,

         constructor: function (cfg) {
            Popup.superclass.constructor.apply(this, arguments);
         },

         _beforeMount: function (options) {
            this._controller = options.controller;
            this._opener = options.opener;
         },

         _afterMount: function () {
            this.subscribe('onFocusIn', _private.focusIn);
            this.subscribe('onFocusOut', _private.focusOut);
            _private.recalcPosition.call(this);
         },

         /**
          * Закрыть popup
          */
         _close: function () {
            this._notify('closePopup', this._options.id);
         },

         /**
          * Обработчик нажатия на клавиши.
          * @function Controls/Popup/Manager/Popup#_keyPressed
          * @param event
          */
         _keyPressed: function (event) {
            if (event.nativeEvent.keyCode === CoreConstants.key.esc) {
               this._close();
            }
         },

         /**
          * Отправить результат
          */
         _sendResult: function () {
            if (this._controller) {
               this._controller.notifyOnResult.call(this._controller, Array.prototype.slice.call(arguments, 1));
            }
         }
      });

      return Popup;
   }
);