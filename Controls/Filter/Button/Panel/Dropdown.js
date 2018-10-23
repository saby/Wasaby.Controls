define('Controls/Filter/Button/Panel/Dropdown', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/Dropdown/Dropdown',
   'css!theme?Controls/Filter/Button/Panel/Dropdown/Dropdown'
], function(Control, template) {
   /**
    * Input for selection from the list of options with cross.
    *
    * @class Controls/Filter/Button/Panel/Dropdown
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/Input/interface/IValidation
    * @mixes Controls/interface/IMultiSelectable
    * @mixes Controls/Input/interface/IDropdownEmptyText
    * @mixes Controls/Input/interface/IInputDropdown
    * @mixes Controls/interface/IDropdown
    * @mixes Controls/interface/ITextValue
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

   return FilterDropdown;
});
