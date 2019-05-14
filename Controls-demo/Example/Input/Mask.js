define('Controls-demo/Example/Input/Mask',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/Mask/Mask',

      'Controls/input',
      'css!Controls-demo/Example/resource/Base',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _template: template,

         _mobilePhone: ''
      });
   });
