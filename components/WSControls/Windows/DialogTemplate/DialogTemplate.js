define('js!WSControls/Windows/DialogTemplate/DialogTemplate',
   [
      'Core/Control',
      'tmpl!WSControls/Windows/DialogTemplate/DialogTemplate',
      'css!WSControls/Windows/DialogTemplate/DialogTemplate'
   ],
   function (Control, template) {
      'use strict';

      var Popup = Control.extend({
         _template: template,
         _controlName: 'WSControls/Windows/DialogTemplate/DialogTemplate',
         iWantVDOM: true,

         constructor: function(cfg){
            Popup.superclass.constructor.call(this, cfg);
         },

         closePopup: function(){
            this.sendCommand('close');
         }
      });

      return Popup;
   }
);