define('Controls-demo/Example/Input/Password',
   [
      'Core/Control',
      'Controls-demo/Example/Input/SetValueMixin',
      'wml!Controls-demo/Example/Input/Password/Password',

      'Controls/input',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, SetValueMixin, template) {
      'use strict';

      return Control.extend([SetValueMixin], {
         _template: template
      });
   });
