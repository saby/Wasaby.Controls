define('Controls-demo/Input/Phone/Phone',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Phone/Phone'
   ],
   function(Control, template) {

      'use strict';

      var Phone = Control.extend({
         _template: template,

         phoneValue: ''
      });

      return Phone;
   }
);