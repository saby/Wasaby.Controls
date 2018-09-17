define('Controls/List/AddButton', [
   'Core/Control',
   'wml!Controls/List/AddButton/AddButton',
   'WS.Data/Type/descriptor',
   'css!Controls/List/AddButton/AddButton'
], function(Control, template, types) {

   var AddButton = Control.extend({
      _template: template,

      clickHandler: function(e) {
         if (this._options.readOnly) {
            e.stopPropagation();
         }
      }
   });

   AddButton.getOptionTypes = function getOptionTypes() {
      return {
         caption: types(String)
      };
   };

   return AddButton;
});
