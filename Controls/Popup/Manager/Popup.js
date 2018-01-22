define('js!Controls/Popup/Manager/Popup',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Popup',
      'Core/constants',
      'css!Controls/Popup/Manager/Popup'
   ],
   function (Control, template, CoreConstants) {
      'use strict';

      var Popup = Control.extend({
         /**
          * Компонент "Всплывающее окно"
          * @class Controls/Popup/Manager/Popup
          * @extends Core/Control
          * @control
          * @private
          * @category Popup
          * @author Лощинин Дмитрий
          */

         /**
          * @name Controls/Popup/Manager/Popup#template
          * @cfg {Content} Шаблон всплывающего окна
          */

         /**
          * @name Controls/Popup/Manager/Popup#componentOptions
          * @cfg {Object} Опции компонента
          */

         _controlName: 'Controls/Popup/Manager/Popup',
         _template: template,

         constructor: function (cfg) {
            Popup.superclass.constructor.call(this, cfg);
         },

         _afterMount: function () {
            var container = this._container;
            this._width = container.offsetWidth;
            this._height = container.offsetHeight;
            this._notify('popupCreated', [this._options.id, this._width, this._height]);
         },

         _afterUpdate: function () {
            var container = this._container;
            if (container.offsetWidth !== this._width || container.offsetHeight !== this._height) {
               this._width = container.offsetWidth;
               this._height = container.offsetHeight;
               this._notify('popupUpdated', [this._options.id, this._width, this._height]);
            }
         },

         /**
          * Закрыть popup
          * @function Controls/Popup/Manager/Popup#_close
          */
         _close: function () {
            this._notify('closePopup', [this._options.id]);
         },

         /**
          * Обработчик установки фокуса.
          * @function Controls/Popup/Manager/Popup#_focusIn
          * @param event
          * @param focusedControl
          */
         _focusIn: function (event, focusedControl) {
            this._notify('popupFocusIn', [this._options.id, focusedControl]);
         },

         /**
          * Обработчик потери фокуса.
          * @function Controls/Popup/Manager/Popup#_focusOut
          * @param event
          * @param focusedControl
          */
         _focusOut: function (event, focusedControl) {
            this._notify('popupFocusOut', [this._options.id, focusedControl]);
         },

         /**
          * Обработчик нажатия на клавиши.
          * @function Controls/Popup/Manager/Popup#_keyUp
          * @param event
          */
         _keyUp: function (event) {
            if (event.nativeEvent.keyCode === CoreConstants.key.esc) {
               this._close();
            }
         },

         /**
          * Отправить результат
          * @function Controls/Popup/Manager/Popup#_sendResult
          */
         _sendResult: function (event, result) {
            this._notify('result', [this._options.id, result]);
         }
      });

      return Popup;
   }
);