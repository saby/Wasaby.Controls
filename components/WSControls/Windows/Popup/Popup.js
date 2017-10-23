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

         close: function(){
            var self = this;
            require(['js!WSControls/Windows/PopupManager'], function(PopupManager){
               PopupManager.remove(self.getId());
            });
         }
      });

      return Popup;
   }
);