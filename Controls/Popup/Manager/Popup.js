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
            _position: {},

            constructor: function(cfg){
               Popup.superclass.constructor.apply(this, arguments);
               CommandDispatcher.declareCommand(this, 'close', this.close);
            },

            _afterMount: function(){
               this.subscribe('onFocusIn', this._focus.bind(this, true));
               this.subscribe('onFocusOut', this._focus.bind(this, false));
               this.recalcPosition();
               // TODO не всегда нужно ставить фокус
               this.focus();
            },

            _beforeUpdate: function(){
               this.recalcPosition();
            },

            isAutoHide: function(){
               return !!this._options.autoHide;
            },

            /**
             * Пересчитать позицию попапа
             * @function Controls/Popup/Manager/Popup#recalcPosition
             */
            recalcPosition: function(){
               CommandDispatcher.sendCommand(this, 'recalcPosition', this);
            },

            /**
             * Закрыть окно
             * @function Controls/Popup/Manager/Popup#close
             */
            close: function(){
               CommandDispatcher.sendCommand(this, 'closePopup', this);
            },

            /**
             * Обработка фокуса
             * @function Controls/Popup/Manager/Popup#_focus
             * @param focusIn
             */
            _focus: function(focusIn){
               CommandDispatcher.sendCommand(this, 'focusPopup', this, focusIn);
            }
         });

         return Popup;
      }
);