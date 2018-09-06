define('Controls-demo/Input/Suggest/resources/SuggestTemplate', [
   'Core/Control',
   'wml!Controls-demo/Input/Suggest/resources/SuggestTemplate',
   'wml!Controls-demo/Input/Suggest/resources/CustomTemplate',
   'wml!Controls/List/ItemTemplate',
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
