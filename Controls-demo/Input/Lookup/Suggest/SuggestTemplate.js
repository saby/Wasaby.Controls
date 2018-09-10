define('Controls-demo/Input/Lookup/Suggest/SuggestTemplate', [
   'Core/Control',
   'wml!Controls-demo/Input/Lookup/Suggest/SuggestTemplate',
   'Controls/List'
], function(Control, template) {
   
   'use strict';
   
   return Control.extend({
      _template: template
   });
   
});