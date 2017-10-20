define('js!WSControls/Windows/Popup/Popup',
   [
      'Core/Control',
      'tmpl!WSControls/Windows/Popup/Popup'
   ],
   function (Control, template) {
      'use strict';

      var Popup = Control.extend({
         _template: template,
         _controlName: 'WSControls/Windows/Popup/Popup',
         iWantVDOM: true,

         constructor: function(cfg){
            Popup.superclass.constructor.call(this, cfg);
         }
      });

      return Popup;
   }
);