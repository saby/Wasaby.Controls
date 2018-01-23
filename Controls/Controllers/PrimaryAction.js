define('Controls/Controllers/PrimaryAction',
   [
      'Core/Control',
      'tmpl!Controls/Controllers/PrimaryAction/PrimaryAction'
   ],

   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         onKeyPressed: function() {
            this._notify('onActivated');
         }
      });
   });