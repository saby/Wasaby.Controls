define('Controls-demo/Input/Suggest/resources/SuggestTemplatePG2', [
   'Core/Control',
   'wml!Controls-demo/Input/Suggest/resources/SuggestTemplatePG2',
   'wml!Controls/List/ItemTemplate',
   'Controls/List',
   'wml!Controls-demo/Input/Suggest/resources/CustomTemplatePG2'
], function(Control, template) {
   'use strict';
   
   return Control.extend({
      _template: template
   });
});
