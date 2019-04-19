import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/Panel/Dropdown/Dropdown');
import 'css!theme?Controls/_filterPopup/Panel/Dropdown/Dropdown';
   /**
    * Input for selection from the list of options with cross.
    *
    * To work with single selectedKeys option you can use control with {@link Controls/Container/Adapter/SelectedKey}.
    *
    * @class Controls/_filterPopup/Panel/Dropdown
    * @extends Control/Input/Dropdown
    * @control
    * @public
    * @author Герасимов А.М.
    */



   var FilterDropdown = Control.extend({
      _template: template,

      _selectedKeysChangedHandler: function(event, keys) {
         this._notify('selectedKeysChanged', [keys]);
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

