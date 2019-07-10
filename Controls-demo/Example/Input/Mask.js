define('Controls-demo/Example/Input/Mask',
   [
      'Core/Control',
      'Controls-demo/Example/Input/SetValueMixin',
      'wml!Controls-demo/Example/Input/Mask/Mask',

      'Controls/input',
      'css!Controls-demo/Example/resource/Base',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, SetValueMixin, template) {
      'use strict';

      return Control.extend([SetValueMixin], {
         _template: template,

         _mobilePhoneValue: ''
      });
   });
