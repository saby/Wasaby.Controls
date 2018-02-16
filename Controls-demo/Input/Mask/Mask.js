define('Controls-demo/Input/Mask/Mask',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Mask/Mask',
      'Controls/Input/Mask',
      'css!Controls-demo/Input/Mask/Mask'
   ],
   function(Control, template) {

      'use strict';

      var Mask = Control.extend({
         _template: template,

         _examples: [
            {
               title: 'Date',
               items: [
                  {
                     name: 'timeMask',
                     replacer: ' ',
                     mask: 'dd.dd',
                     value: '  .  '
                  },
                  {
                     name: 'dateMask',
                     replacer: ' ',
                     mask: 'dd.dd.dd',
                     value: '  .  .  '
                  }
               ]
            }
         ]
      });

      return Mask;
   }
);