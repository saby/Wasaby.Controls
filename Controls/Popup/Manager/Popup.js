define('Controls/Popup/Manager/Popup',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Popup',
      'Core/constants',
      'css!Controls/Popup/Manager/Popup'
   ],
   function(Control, template, CoreConstants) {
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
          * @name Controls/Popup/Manager/Popup#templateOptions
          * @cfg {Object} Опции компонента
          */

         _template: template,

         _afterMount: function() {
            this._notify('popupCreated', [this._options.id], {bubbling: true});
         },

         /**
          * Закрыть popup
          * @function Controls/Popup/Manager/Popup#_close
          */
         _close: function() {
            this._notify('popupClose', [this._options.id], {bubbling: true});
         },

         /**
          * Обновить popup
          * @function Controls/Popup/Manager/Popup#_close
          */
         _update: function() {
            this._notify('popupUpdated', [this._options.id], {bubbling: true});
         },

         /**
          * Отправить результат
          * @function Controls/Popup/Manager/Popup#_sendResult
          */
         _sendResult: function(event, result) {
            this._notify('popupResult', [this._options.id, result], {bubbling: true});
         },

         /**
          * Обработчик установки фокуса.
          * @function Controls/Popup/Manager/Popup#_focusIn
          * @param event
          * @param focusedControl
          */
         _focusIn: function(event, focusedControl) {
            this._notify('popupFocusIn', [this._options.id, focusedControl], {bubbling: true});
         },

         /**
          * Обработчик потери фокуса.
          * @function Controls/Popup/Manager/Popup#_focusOut
          * @param event
          * @param focusedControl
          */
         _focusOut: function(event, focusedControl) {
            this._notify('popupFocusOut', [this._options.id, focusedControl], {bubbling: true});
         },

         /**
          * Обработчик нажатия на клавиши.
          * @function Controls/Popup/Manager/Popup#_keyUp
          * @param event
          */
         _keyUp: function(event) {
            if (event.nativeEvent.keyCode === CoreConstants.key.esc) {
               this._close();
            }
         },
         _documentClickHandler: function(emitterEvent, event) {
            if (this._options.closeByExternalClick && !event.target.closest('.controls-DropdownList__popup')) { //Если кликнули мимо меню - закрываемся
               this._close();
            }
         }
      });

      Popup.getDefaultOptions = function() {
         return {
            closeByExternalClick: true
         };
      };

      return Popup;
   }
);
