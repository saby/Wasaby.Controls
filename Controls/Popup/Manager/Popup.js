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
          * @name Controls/Popup/Manager/Popup#autoHide
          * @cfg {Boolean} закрывать попап в случае ухода фокуса
          */

         /**
          * @name Controls/Popup/Manager/Popup#template
          * @cfg {Content} Шаблон всплывающего окна
          */

         /**
          * @name Controls/Popup/Manager/Popup#componentOptions
          * @cfg {Object} Опции компонента
          */

         /**
          * @name Controls/Popup/Manager/Popup#opener
          * @cfg {Object} Опенер
          */

         _controlName: 'Controls/Popup/Manager/Popup',
         _template: template,

         constructor: function (cfg) {
            Popup.superclass.constructor.call(this, cfg);
            this._opener = cfg.opener;
         },

         _afterMount: function () {
            var container = this._container;
            this._notify('popupCreated', this._options.id, container.outerWidth(), container.outerHeight());
         },

         /**
          * Закрыть popup
          * @function Controls/Popup/Manager/Popup#_close
          */
         _close: function () {
            this._notify('closePopup', this._options.id);
         },

         /**
          * Обработчик потери фокуса.
          * @function Controls/Popup/Manager/Popup#_focusOut
          * @param event
          * @param focusedControl
          */
         _focusOut: function (event, focusedControl) {
            if (!!this._options.autoHide) {
               var
                  parent = focusedControl.to;
               while (!!parent) {
                  if (parent._options.id === this._opener._options.id || parent._options.id === this._options.id) {
                     return;
                  }
                  parent = parent.getParent();
               }
               this._close();
            }
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
          * @function Controls/Popup/Manager/Popup#_sendResult
          */
         _sendResult: function () {
            this._notify('result', this._options.id, Array.prototype.slice.call(arguments, 1));
         }
      });

      return Popup;
   }
);