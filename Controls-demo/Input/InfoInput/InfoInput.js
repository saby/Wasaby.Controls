define('Controls-demo/Input/InfoInput/InfoInput',
   [
      'Core/Control',
      'wml!Controls-demo/Input/InfoInput/InfoInput',
   ],
   function(Control, template, Formatter) {

      'use strict';

      var InfoInput = Control.extend({
		_template: template,
		_value: ''
      });

      return InfoInput;
   }
);