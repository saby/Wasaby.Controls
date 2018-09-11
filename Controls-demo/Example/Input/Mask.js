define('Controls-demo/Example/Input/Mask',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/Mask/Mask',

      'Controls/Input/Mask',
      'css!Controls-demo/Example/resource/Base',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _mobilePhone: '+7 '
      });
   }
);
