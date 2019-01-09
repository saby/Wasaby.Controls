define('Controls-demo/Input/Suggest/resources/SuggestTemplatePG', [
   'Core/Control',
   'wml!Controls-demo/Input/Suggest/resources/SuggestTemplatePG',
   'wml!Controls/List/ItemTemplate',
   'Controls/List',
   'Controls/Container/Suggest/List',
   'wml!Controls-demo/Input/Suggest/resources/CustomTemplatePG'
], function(Control, template) {
   'use strict';
   
   return Control.extend({
      _template: template
   });
});
