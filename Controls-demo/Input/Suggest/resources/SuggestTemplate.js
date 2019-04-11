define('Controls-demo/Input/Suggest/resources/SuggestTemplate', [
   'Core/Control',
   'wml!Controls-demo/Input/Suggest/resources/SuggestTemplate',
   'wml!Controls-demo/Input/Suggest/resources/CustomTemplate',
   'Controls/list'
], function(Control, template, custom, lists) {
   'use strict';

   return Control.extend({
      _template: template,
      _custom: custom,
      _def: lists.ItemTemplate,
      _gl: true
   });
});
