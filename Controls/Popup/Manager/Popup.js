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
            var content = self._container.querySelector(CONTENT_SELECTOR) || self._container.firstChild;

            return {
               width: content.scrollWidth,
               height: content.scrollHeight
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

         _template: template,

         _afterMount: function () {
            var contentSizes = _private.getContentSizes(this);
            _private.setNeededSizes(this, contentSizes);
            this._notify('popupCreated', [this._options.id, this._getPopupSizes()]);
         },

         _afterUpdate: function () {
            var contentSizes = _private.getContentSizes(this);
            //Если размеры контента изменились, пересчитаем размеры окна
            if (contentSizes.width !== this._neededWidth || contentSizes.height !== this._neededHeight) {
               _private.setNeededSizes(this, contentSizes);
               this._notify('popupUpdated', [this._options.id, this._getPopupSizes()]);
            }
         },

         /**
          * Закрыть popup
          * @function Controls/Popup/Manager/Popup#_close
          */
         _close: function () {
            this._notify('closePopup', [this._options.id, this._container]);
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
         },

         _onResize: function(){
            this._notify('popupUpdated', [this._options.id, this._getPopupSizes()]);
         },

         _onScroll: function(){
            this._notify('popupUpdated', [this._options.id, this._getPopupSizes()]);
         },
         _getPopupSizes: function() {
            return {
               width: this._neededWidth,
               height: this._neededHeight,
               margins: this._getMargins()
            }
         },

         _getMargins: function() {
            var style = this._container.currentStyle || window.getComputedStyle(this._container);
            var margins = {
               top: parseInt(style.marginTop, 10),
               left: parseInt(style.marginLeft, 10)
            };
            return margins;
         },
      });

      return Popup;
   }
);