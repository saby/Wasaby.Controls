define('Controls-demo/Input/Suggest/resources/SuggestTemplate', [
   'Core/Control',
   'tmpl!Controls-demo/Input/Suggest/resources/SuggestTemplate',
   'tmpl!Controls-demo/Input/Suggest/resources/CustomTemplate',
   'tmpl!Controls/List/ItemTemplate',
   'Controls/List'
], function(Control, template, custom, def) {
   'use strict';

   return Control.extend({
      _template: template,
      _custom: custom,
      _def: def,
      _gl: true
   });
});
