define('Controls-demo/PendingRegistrator/PendingRegistrator', [
   'Core/Control',
   'wml!Controls-demo/PendingRegistrator/PendingRegistrator',
   'css!Controls-demo/PendingRegistrator/PendingRegistrator'
], function(Control, tmpl) {
   'use strict';

   var module = Control.extend({
      _template: tmpl
   });

   return module;
});
