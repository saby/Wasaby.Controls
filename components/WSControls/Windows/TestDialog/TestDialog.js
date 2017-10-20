define('js!WSControls/Windows/TestDialog/TestDialog',
   [
      'Core/Control',
      'tmpl!WSControls/Windows/TestDialog/TestDialog'
   ],
   function (Control, template) {
      'use strict';

      var TestDialog = Control.extend({
         _template: template,
         _controlName: 'WSControls/Windows/TestDialog/TestDialog',
         iWantVDOM: true,

         constructor: function(cfg){
            TestDialog.superclass.constructor.call(this, cfg);
         }
      });

      return TestDialog;
   }
);