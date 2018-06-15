define('Controls/Browser', [
   'Core/Control',
   'tmpl!Controls/Browser/Browser'
], function(BaseControl, template) {

   'use strict';

   var Browser = BaseControl.extend({
      _template: template
   });

   return Browser;
});
