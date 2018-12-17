define('Controls/Filter/Button/Panel/Select', [
   'Core/Control',
   'WS.Data/Utils',
   'wml!Controls/Filter/Button/Panel/Select/Select'
], function(Control, Utils, template) {
   /**
    * Control that displays items through delimiter
    * @class Controls/Filter/Button/Panel/Select
    * @extends Controls/Control
    * @control
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/Filter/Button/Panel/Select#items
    * @cfg {Array} Data to build the mapping.
    * Text is taken from the title field.
    */

   /**
    * @name Controls/Filter/Button/Panel/Select#keyProperty
    * @cfg {String} Name of the item property that uniquely identifies collection item.
    */

   'use strict';

   var FilterSelect = Control.extend({
      _template: template,

      _clickHandler: function(event, item) {
         this._notify('textValueChanged', [Utils.getItemPropertyValue(item, this._options.displayProperty)]);
         this._notify('valueChanged', [[Utils.getItemPropertyValue(item, this._options.keyProperty)]]);
      }

   });

   FilterSelect.getDefaultOptions = function() {
      return {
         displayProperty: 'title'
      };
   };

   return FilterSelect;
});
