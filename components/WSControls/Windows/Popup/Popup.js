define('js!WSControls/Windows/Popup/Popup',
   [
      'Core/Control',
      'tmpl!WSControls/Windows/Popup/Popup',
      'Core/CommandDispatcher',
      'css!WSControls/Windows/Popup/Popup'
   ],
   function (Control, template, CommandDispatcher) {
      'use strict';

      var Popup = Control.extend({
         _template: template,
         _controlName: 'WSControls/Windows/Popup/Popup',
         iWantVDOM: true,

         constructor: function(cfg){
            Popup.superclass.constructor.call(this, cfg);
            CommandDispatcher.declareCommand(this, 'close', this.close);
         },

         _afterMount: function(){
            this.focus();
            this.getContainer().css(this._options.strategy.getPosition(this));
            this.subscribe('onFocusIn', this._focusIn);
            this.subscribe('onFocusOut', this._focusOut);
         },

         close: function(){
            CommandDispatcher.sendCommand(this, 'closePopup', this.getId());
         },

         _focusIn: function(){

         },

         _focusOut: function(){
            CommandDispatcher.sendCommand(this, 'closePopup', this.getId());
         }
      });

      return Popup;
   }
);