define('Controls-demo/Input/InfoInput/InfoInput',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/InfoInput/InfoInput',
   ],
   function(Control, template, Formatter) {

      'use strict';

      var InfoInput = Control.extend({
		_template: template
      });

      return InfoInput;
   }
);