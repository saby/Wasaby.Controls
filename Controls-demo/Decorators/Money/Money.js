define('Controls-demo/Decorators/Money/Money',
   [
      'Core/Control',
      'wml!Controls-demo/Decorators/Money/Money',

      'Controls/Decorator/Money',
      'css!Controls-demo/Decorators/Money/Money'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _exampleNames: null,

         _beforeMount: function() {
            this._exampleNames = [
               'accentResults',
               'noAccentResults',
               'group',
               'basicRegistry',
               'noBasicRegistry',
               'accentRegistry',
               'noAccentRegistry',
               'error'
            ];
         }
      });
   }
);
