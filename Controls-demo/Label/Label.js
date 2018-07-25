define('Controls-demo/Label/Label',
   [
      'Core/Control',
      'tmpl!Controls-demo/Label/Label'
   ],
   function(Control, template) {

      'use strict';

      var Label = Control.extend({
         _template: template,

         _labelClickHandler: function(event, inputName) {
            this._children[inputName].activate();
         }
      });

      return Label;
   }
);