define('Controls-demo/Example/Input/Font',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/Input/Font/Font',

      'Controls/Input/Text',
      'css!Controls-demo/Example/resource/Base',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
