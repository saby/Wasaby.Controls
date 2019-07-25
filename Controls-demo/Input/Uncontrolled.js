define('Controls-demo/Input/Uncontrolled',
   [
      'UI/Base',
      'wml!Controls-demo/Input/Uncontrolled/Uncontrolled',

      'Controls/input',
      'css!Controls-demo/Input/Uncontrolled/Uncontrolled'
   ],
   function(Base, template) {
      'use strict';

      return Base.Control.extend({
         _template: template
      });
   });
