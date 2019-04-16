import Control = require('Core/Control');
import Utils = require('Types/util');
import template = require('wml!Controls/_filterPopup/Panel/Select/Select');
   /**
    * Control that displays items through delimiter.
    *
    * To work with single selectedKeys option you can use control with {@link Controls/Container/Adapter/SelectedKey}.
    * @class Controls/_filterPopup/Panel/Select
    * @extends Controls/Control
    * @control
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/_filterPopup/Panel/Select#items
    * @cfg {Array} Data to build the mapping.
    * Text is taken from the title field.
    */

   /**
    * @name Controls/_filterPopup/Panel/Select#keyProperty
    * @cfg {String} Name of the item property that uniquely identifies collection item.
    */

   /**
    * @name Controls/_filterPopup/Panel/Select#displayProperty
    * @cfg {String} The name of the field whose value is displayed.
    */



   var FilterSelect = Control.extend({
      _template: template,

      _clickHandler: function(event, item) {
         this._notify('textValueChanged', [Utils.object.getPropertyValue(item, this._options.displayProperty)]);
         this._notify('selectedKeysChanged', [[Utils.object.getPropertyValue(item, this._options.keyProperty)]]);
      }

   });

   FilterSelect.getDefaultOptions = function() {
      return {
         displayProperty: 'title'
      };
   };

   export = FilterSelect;

