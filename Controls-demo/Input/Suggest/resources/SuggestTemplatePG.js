define('Controls-demo/Input/Suggest/resources/SuggestTemplatePG', [
   'Core/Control',
   'wml!Controls-demo/Input/Suggest/resources/SuggestTemplatePG',
   'Controls/lists',
   'Controls/Container/Suggest/List',
   'wml!Controls-demo/Input/Suggest/resources/CustomTemplatePG'
], function(Control, template) {
   'use strict';
   
   return Control.extend({
      _template: template
   });
});
