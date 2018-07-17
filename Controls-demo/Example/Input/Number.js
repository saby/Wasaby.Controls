define('Controls-demo/Example/Input/Number',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/Input/Number/Number',

      'Controls/Input/Number',
      'css!Controls-demo/Example/resource/Base'
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
