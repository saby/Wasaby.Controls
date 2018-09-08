define('Controls-demo/Example/Input/Number',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/Number/Number',

      'Controls/Input/Number',
      'css!Controls-demo/Example/resource/Base',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _value2: 0,

         _value3: 0
      });
   }
);
