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
               Popup.superclass.constructor.call(this, cfg);
               CommandDispatcher.declareCommand(this, 'close', this.close);
            },

            _afterMount: function(){
               this.focus();
               this.getContainer().css(this._options.strategy.getPosition(this));
            },
            /**
             * Закрыть окно
             * @function Controls/Popup/Manager/Popup#close
             */
            close: function(){
               CommandDispatcher.sendCommand(this, 'closePopup', this);
            },

            _focusIn: function(){

            },

            _focusOut: function(){

            }
         });

         return Popup;
      }
);