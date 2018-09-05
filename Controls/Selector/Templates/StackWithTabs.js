define('Controls/Selector/Templates/StackWithTabs', [
   'Core/Control',
   'tmpl!Controls/Selector/Templates/StackWithTabs',
   'css!Controls/Selector/Templates/StackWithTabs',
   'Controls/Tabs/Buttons'
], function(BaseControl, template) {
   
   'use strict';
   
   return BaseControl.extend({
      _template: template
   });
   
});
