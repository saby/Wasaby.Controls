define('js!Controls/Popup/Manager/Popup',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Manager/Popup',
      'Core/CommandDispatcher',
      'css!Controls/Popup/Manager/Popup'
   ],
      function (Control, template, CommandDispatcher) {
         'use strict';
         /**

         /**
          * Компонент вспывающего окна
          * @class Controls/Popup/Manager/Popup
          * @control
          * @extends Core/Control
          * @public
          * @category Popup
          */
         var Popup = Control.extend({
            _controlName: 'Controls/Popup/Manager/Popup',
            _template: template,
            iWantVDOM: true,

            constructor: function(cfg){
               Popup.superclass.constructor.apply(this, arguments);
               CommandDispatcher.declareCommand(this, 'close', this.close);
            },

            _afterMount: function(){
               this.subscribe('onFocusIn', this._focusIn);
               this.subscribe('onFocusOut', this._focusOut);
               if( this._options.catchFocus === undefined || this._options.catchFocus ){
                  this.focus();
               }
               this.recalcPosition();
            },

            /**
             * автоматически скрывать popup при потере фокуса
             * @function Controls/Popup/Manager/Popup#close
             */
            isAutoHide: function(){
               return !!this._options.autoHide;
            },

            /**
             * Закрыть popup
             * @function Controls/Popup/Manager/Popup#close
             */
            close: function(){
               CommandDispatcher.sendCommand(this, 'closePopup', this);
            },

            /**
             * Пересчитать позицию попапа
             * @function Controls/Popup/Manager/Popup#recalcPosition
             */
            recalcPosition: function(){
               CommandDispatcher.sendCommand(this, 'recalcPosition', this);
            },

            /**
             * Обработка установки фокуса
             * @function Controls/Popup/Manager/Popup#_focusIn
             * @param event
             */
            _focusIn: function(event){
               CommandDispatcher.sendCommand(this, 'focusInPopup', this);
            },

            /**
             * Обработка удаления фокуса
             * @function Controls/Popup/Manager/Popup#_focusOut
             * @param event
             * @param focusedControl
             */
            _focusOut: function(event, focusedControl){
               CommandDispatcher.sendCommand(this, 'focusOutPopup', this, focusedControl);
            }
         });

         return Popup;
      }
);