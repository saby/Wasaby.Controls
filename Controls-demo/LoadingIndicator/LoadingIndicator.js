define('Controls-demo/LoadingIndicator/LoadingIndicator', [
   'Core/Control',
   'wml!Controls-demo/LoadingIndicator/LoadingIndicator'
], function(Control, tmpl) {
   'use strict';

   var module = Control.extend({
      _template: tmpl
   });

   return module;
});
