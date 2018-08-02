define('Controls-demo/Example/Input',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/Input',

      'Controls/Application',
      'Controls-demo/Example/Input/Area',
      'Controls-demo/Example/Input/Font',
      'Controls-demo/Example/Input/Mask',
      'Controls-demo/Example/Input/Number',
      'Controls-demo/Example/Input/Password',
      'Controls-demo/Example/Input/Phone',
      'Controls-demo/Example/Input/PositionLabels',
      'Controls-demo/Example/Input/Suggest',
      'Controls-demo/Example/Input/Tag',
      'Controls-demo/Example/Input/Text',
      'css!Controls-demo/Example/resource/Base'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template
      });
   }
);
