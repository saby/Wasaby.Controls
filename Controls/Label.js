define('Controls/Label',
   [
      'Core/Control',
      'tmpl!Controls/Label/Label',
      'css!Controls/Label/Label'
   ],
   function(Control, template) {

      'use strict';

      var Label = Control.extend({
         _controlName: 'Controls/Label',

         _template: template
      });

      return Label;
   }
);