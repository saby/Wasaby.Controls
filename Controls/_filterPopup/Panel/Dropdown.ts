import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/Panel/Dropdown/Dropdown');
import 'css!theme?Controls/filterPopup';
   /**
    * Input for selection from the list of options with cross.
    *
    * To work with single selectedKeys option you can use control with {@link Controls/Container/Adapter/SelectedKey}.
    *
    * @class Controls/_filterPopup/Panel/Dropdown
    * @extends Controls/_dropdown/Input
    * @control
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/_filterPopup/Panel/Dropdown#showCross
    * @cfg {Boolean} Show reset button near dropdown. If you click on this button, dropdown will hide.
    * @default false
    * @example
    * <pre>
    *     <Controls.filterPopup:Dropdown showCross="{{true}}"/>
    * </pre>
    */

   var FilterDropdown = Control.extend({
      _template: template,

      _selectedKeysChangedHandler: function(event, keys:Array):Boolean|undefined {
         return this._notify('selectedKeysChanged', [keys]);
      },

      _textValueChangedHandler: function(event, text) {
         this._notify('textValueChanged', [text]);
      },

      _resetHandler: function() {
         this._notify('visibilityChanged', [false]);
      }

   });

   FilterDropdown.getDefaultOptions = function() {
      return {
         displayProperty: 'title'
      };
   };

   export = FilterDropdown;

