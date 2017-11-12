define('js!WSControls/Windows/DialogTemplate/DialogTemplate',
   [
      'Core/Control',
      'tmpl!WSControls/Windows/DialogTemplate/DialogTemplate',
      'css!WSControls/Windows/DialogTemplate/DialogTemplate'
   ],
   function (Control, template) {
      'use strict';

      return Control.extend({
         _template: template,
         _controlName: 'WSControls/Windows/DialogTemplate/DialogTemplate',
         iWantVDOM: true,

         closePopup: function(){
            this.sendCommand('close');
         }
      });
   }
);