define('Controls/Filter/Button/Panel/Dropdown', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/Dropdown/Dropdown',
   'css!theme?Controls/Filter/Button/Panel/Dropdown/Dropdown'
], function(Control, template) {
   /**
    * Input for selection from the list of options with cross.
    *
    * To work with single selectedKeys option you can use control with {@link Controls/Container/Adapter/SelectedKey}.
    *
    * @class Controls/Filter/Button/Panel/Dropdown
    * @extends Control/Input/Dropdown
    * @control
    * @public
    * @author Герасимов А.М.
    */

   'use strict';

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

   return FilterDropdown;
});
