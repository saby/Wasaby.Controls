define('js!Controls/Popup/Manager/Popup',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Popup',
      'Core/CommandDispatcher',
      'Core/constants',
      'css!Controls/Popup/Manager/Popup'
   ],
   function (Control, template, CommandDispatcher, CoreConstants) {
      'use strict';

      var _private = {
         /**
          * Закрыть popup
          */
         close: function () {
            CommandDispatcher.sendCommand(this, 'closePopup', this.getId());
         },

         /**
          * Обработчик фокусировки элемента.
          */
         focusIn: function () {
            CommandDispatcher.sendCommand(this, 'focusInPopup', this.getId());
         },

         /**
          * Обработчик потери фокуса.
          * @param event
          * @param focusedControl
          */
         focusOut: function (event, focusedControl) {
            CommandDispatcher.sendCommand(this, 'focusOutPopup', this.getId(), focusedControl);
         },

         /**
          * Отправить результат
          */
         sendResult: function () {
            if (this._controller) {
               this._controller.notifyOnResult.call(this._controller, Array.prototype.slice.call(arguments));
            }
         },

         /**
          * Пересчитать позицию попапа
          */
         recalcPosition: function () {
            CommandDispatcher.sendCommand(this, 'recalcPosition', this);
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
         iWantVDOM: true,

         constructor: function (cfg) {
            Popup.superclass.constructor.apply(this, arguments);
            CommandDispatcher.declareCommand(this, 'close', _private.close);
            CommandDispatcher.declareCommand(this, 'sendResult', _private.sendResult);
         },

         _beforeMount: function(options) {
            this._controller = options.controller;
            this._opener = options.opener;
         },

         _afterMount: function () {
            this.subscribe('onFocusIn', _private.focusIn);
            this.subscribe('onFocusOut', _private.focusOut);
            _private.recalcPosition.call(this);
         },

         /**
          * Обработчик нажатия на клавиши.
          * @function Controls/Popup/Manager/Popup#_keyPressed
          * @param event
          */
         _keyPressed: function (event) {
            if (event.nativeEvent.keyCode === CoreConstants.key.esc) {
               _private.close.call(this);
            }
         }
      });

      return Popup;
   }
);