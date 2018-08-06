define('Controls/Popup/Manager/Popup',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Popup',
      'Core/helpers/Function/runDelayed',
      'Core/constants',
      'css!Controls/Popup/Manager/Popup'
   ],
   function(Control, template, runDelayed, CoreConstants) {
      'use strict';

      var Popup = Control.extend({

         /**
          * Компонент "Всплывающее окно"
          * @class Controls/Popup/Manager/Popup
          * @mixes Controls/interface/IOpenerOwner
          * @mixes Controls/interface/ICanBeDefaultOpener
          * @extends Core/Control
          * @control
          * @private
          * @category Popup
          * @author Красильников Андрей
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
            /* Очень сложный код. Нельзя просто так на afterMount пересчитывать позиции и сигналить о создании
            * внутри может быть compoundArea и мы должны ее дождаться, а там есть асинхронная фаза */

            if (this.waitForPopupCreated) {
               this.callbackCreated = (function() {
                  this.callbackCreated = null;
                  this.waitForPopupCreated = false;
                  this._notify('popupCreated', [this._options.id], { bubbling: true });
               }).bind(this);
            } else {
               // todo doautofocus
               this._notify('popupCreated', [this._options.id], { bubbling: true });
               if (this._options.autofocus) {
                  this.activate();
               }
            }
         },

         /**
          * Закрыть popup
          * @function Controls/Popup/Manager/Popup#_close
          */
         _close: function() {
            this._notify('popupClose', [this._options.id], { bubbling: true });
         },
         _animated: function() {
            this._notify('popupAnimated', [this._options.id], { bubbling: true });
         },

         /**
          * Обновить popup
          * @function Controls/Popup/Manager/Popup#_close
          */
         _update: function() {
            this._notify('popupUpdated', [this._options.id], { bubbling: true });
         },

         _delayedUpdate: function() {
            //На resize многие обработчики могут влиять на размеры и верстку страницы.
            //Дожидаемся когда они отработают и пересчитываем размеры попапов.
            runDelayed(this._update.bind(this));
         },

         /**
          * Отправить результат
          * @function Controls/Popup/Manager/Popup#_sendResult
          */
         _sendResult: function(event) {
            var args = Array.prototype.slice.call(arguments, 1);
            this._notify('popupResult', [this._options.id].concat(args), { bubbling: true });
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
         }
      });

      Popup.getDefaultOptions = function() {
         return {
            autofocus: true
         };
      };

      return Popup;
   });
