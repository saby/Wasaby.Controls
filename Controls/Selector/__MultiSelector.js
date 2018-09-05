define('Controls/Selector/__MultiSelector', [
   'Core/Control',
   'tmpl!Controls/Selector/__MultiSelector'

], function(BaseControl, template) {
   
   'use strict';
   
   var Browser = BaseControl.extend({
      _template: template
   });
   
   return Browser;
});
