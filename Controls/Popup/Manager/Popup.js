define('Controls/Popup/Manager/Popup',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Popup',
      'Core/constants',
      'css!Controls/Popup/Manager/Popup'
   ],
   function (Control, template, CoreConstants) {
      'use strict';

      var CONTENT_SELECTOR = '.ws-Container__popup-scrolling-content';

      var _private = {
         /*
         * Вернуть размеры контента
         * */
         getContentSizes: function(self){
            var content = self._container[0].querySelector(CONTENT_SELECTOR) || self._container[0].firstChild;

            return {
               width: content.offsetWidth,
               height: content.offsetHeight
            }
         },

         /*
         * Сохранить размеры, которые требуются чтобы отобразить контент полностью
         * */
         setNeededSizes: function(self, sizes){
            self._neededHeight = sizes.height;
            self._neededWidth = sizes.width;
         }
      };

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

         _afterMount: function () {
            var contentSizes = _private.getContentSizes(this);
            _private.setNeededSizes(this, contentSizes);

            this._notify('popupCreated', [this._options.id, this._neededWidth, this._neededHeight]);
         },

         _afterUpdate: function () {
            var contentSizes = _private.getContentSizes(this);

            //Если размеры контента изменились, пересчитаем размеры окна
            if (contentSizes.width !== this._neededWidth || contentSizes.height !== this._neededHeight) {
               _private.setNeededSizes(this, contentSizes);
               this._notify('popupUpdated', [this._options.id, this._neededWidth, this._neededHeight]);
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