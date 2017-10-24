define('js!WSControls/Windows/Popup/Popup',
   [
      'Core/Control',
      'tmpl!WSControls/Windows/Popup/Popup',
      'Core/CommandDispatcher',
      'js!WSControls/Windows/PopupManager',
      'css!WSControls/Windows/Popup/Popup'
   ],
   function (Control, template, CommandDispatcher, PopupManager) {
      'use strict';

      var Popup = Control.extend({
         _template: template,
         _controlName: 'WSControls/Windows/Popup/Popup',
         iWantVDOM: true,

         constructor: function(cfg){
            Popup.superclass.constructor.call(this, cfg);
            CommandDispatcher.declareCommand(this, 'close', this.close);
         },

         close: function(){
            PopupManager.remove(this.getId());
         }
      });

      return Popup;
   }
);