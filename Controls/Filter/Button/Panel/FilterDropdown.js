define('Controls/Filter/Button/Panel/FilterDropdown', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/FilterDropdown/FilterDropdown',
   'css!Controls/Filter/Button/Panel/FilterDropdown/FilterDropdown'
], function(Control, template) {
   /**
    * Input for selection from the list of options with cross.
    *
    * @class Controls/Filter/Button/Panel/FilterDropdown
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/Input/interface/IValidation
    * @mixes Controls/interface/ISingleSelectable
    * @mixes Controls/Input/interface/IDropdownEmptyText
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
