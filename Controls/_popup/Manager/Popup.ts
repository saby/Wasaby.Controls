import Control = require('Core/Control');
import template = require('wml!Controls/_popup/Manager/Popup');
import runDelayed = require('Core/helpers/Function/runDelayed');
import Env = require('Env/Env');
import PopupContent = require('wml!Controls/_popup/Manager/PopupContent');


      var _private = {
         keyUp: function(event) {
            if (event.nativeEvent.keyCode === Env.constants.key.esc) {
               this._close();
            }
         }
      };

      var Popup = Control.extend({

         /**
          * Control Popup
          * @class Controls/_popup/Manager/Popup
          * @mixes Controls/interface/IOpenerOwner
          * @mixes Controls/interface/ICanBeDefaultOpener
          * @extends Core/Control
          * @control
          * @private
          * @category Popup
          * @author Красильников А.С.
          */

         /**
          * @name Controls/_popup/Manager/Popup#template
          * @cfg {Content} Template
          */

         /**
          * @name Controls/_popup/Manager/Popup#templateOptions
          * @cfg {Object} Template options
          */

         _template: template,

         // Register the openers that initializing inside current popup
         // After updating the position of the current popup, calls the repositioning of popup from child openers
         _openersUpdateCallback: [],

         _isEscDown: false,

         _afterMount: function() {
            /* TODO: COMPATIBLE. You can't just count on afterMount position and zooming on creation
             * inside can be compoundArea and we have to wait for it, and there is an asynchronous phase. Look at the flag waitForPopupCreated */

            if (this.waitForPopupCreated) {
               this.callbackCreated = (function() {
                  this.callbackCreated = null;
                  this._notify('popupCreated', [this._options.id], { bubbling: true });
               }).bind(this);
            } else {
               this._notify('popupCreated', [this._options.id], { bubbling: true });
               this.activatePopup();
            }
         },

         _afterUpdate: function() {
            this._notify('popupAfterUpdated', [this._options.id], { bubbling: true });
         },
         _beforeUnmount: function() {
            this._notify('popupDestroyed', [this._options.id], { bubbling: true });
         },

         activatePopup: function() {
            // TODO Compatible
            if (this._options.autofocus && !this._options.isCompoundTemplate) {
               this.activate();
            }
         },

         /**
          * Close popup
          * @function Controls/_popup/Manager/Popup#_close
          */
         _close: function() {
            this._notify('popupClose', [this._options.id], { bubbling: true });
         },
         _maximized: function(event, state) {
            this._notify('popupMaximized', [this._options.id, state], { bubbling: true });
         },

         _popupDragStart: function(event, offset) {
            this._notify('popupDragStart', [this._options.id, offset], { bubbling: true });
         },

         _popupDragEnd: function() {
            this._notify('popupDragEnd', [this._options.id], { bubbling: true });
         },

         _popupMouseEnter: function(event, popupEvent) {
            this._notify('popupMouseEnter', [this._options.id, popupEvent], { bubbling: true });
         },

         _popupMouseLeave: function(event, popupEvent) {
            this._notify('popupMouseLeave', [this._options.id, popupEvent], { bubbling: true });
         },

         _animated: function(ev) {
            this._children.resizeDetect.start(ev);
            this._notify('popupAnimated', [this._options.id], { bubbling: true });
         },

         _registerOpenerUpdateCallback: function(event, callback) {
            this._openersUpdateCallback.push(callback);
         },

         _unregisterOpenerUpdateCallback: function(event, callback) {
            var index = this._openersUpdateCallback.indexOf(callback);
            if (index > -1) {
               this._openersUpdateCallback.splice(index, 1);
            }
         },

         _callOpenersUpdate: function() {
            for (var i = 0; i < this._openersUpdateCallback.length; i++) {
               this._openersUpdateCallback[i]();
            }
         },

         /**
          * Update popup
          * @function Controls/_popup/Manager/Popup#_close
          */
         _update: function() {
            this._notify('popupUpdated', [this._options.id], { bubbling: true });

            // After updating popup position we will updating the position of the popups open with it.
            runDelayed(this._callOpenersUpdate.bind(this));
         },

         _controlResize: function() {
            this._notify('popupControlResize', [this._options.id], { bubbling: true });
         },

         /**
          * Proxy popup result
          * @function Controls/_popup/Manager/Popup#_sendResult
          */
         _sendResult: function(event) {
            var args = Array.prototype.slice.call(arguments, 1);
            this._notify('popupResult', [this._options.id].concat(args), { bubbling: true });
         },

         _swipeHandler: function(event) {
            if (event.nativeEvent.direction === 'right' && !this._options.isCompoundTemplate) {
               this._close();
            }
         },

         /**
          * key up handler
          * @function Controls/_popup/Manager/Popup#_keyUp
          * @param event
          */
         _keyUp: function(event) {
            /**
             * Старая панель по событию keydown закрывается и блокирует всплытие события. Новая панель делает
             * тоже самое, но по событию keyup. Из-за этого возникает следующая ошибка.
             * https://online.sbis.ru/opendoc.html?guid=0e4a5c02-f64c-4c7d-88b8-3ab200655c27
             *
             * Что бы не трогать старые окна, мы добавляем поведение на закрытие по esc. Закрываем только в том случае,
             * если новая панель поймала событие keydown клавиши esc.
             */
            if (this._isEscDown) {
               this._isEscDown = false;
               _private.keyUp.call(this, event);
            }
         },

         _keyDown: function(event) {
            if (event.nativeEvent.keyCode === Env.constants.key.esc) {
               this._isEscDown = true;
            }
         }
      });

      Popup.getDefaultOptions = function() {
         return {
            content: PopupContent,
            autofocus: true
         };
      };

      Popup.prototype._moduleName = 'Controls/_popup/Manager/Popup';

      export = Popup;

