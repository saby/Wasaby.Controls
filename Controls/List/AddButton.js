define('Controls/List/AddButton', [
   'Core/Control',
   'tmpl!Controls/List/AddButton/AddButton',
   'WS.Data/Type/descriptor',
   'css!Controls/List/AddButton/AddButton'
], function (Control, template, types) {

   var AddButton = Control.extend({
      _template: template
   });

   AddButton.getOptionTypes = function getOptionTypes() {
      return {
         caption: types(String)
      };
   };

   return AddButton;
});