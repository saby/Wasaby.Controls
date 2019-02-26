define('Controls/List/AddButton', [
   'Core/Control',
   'wml!Controls/List/AddButton/AddButton',
   'Types/entity',
   'css!theme?Controls/List/AddButton/AddButton'
], function(Control, template, entity) {

   /**
    *
    * @mixes Controls/List/AddButton/Styles
    *
    */

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
         caption: entity.descriptor(String)
      };
   };

   return AddButton;
});
