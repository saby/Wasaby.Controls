define('Controls/Filter/Button/Panel/FilterDropdown', [
   'Core/Control',
   'tmpl!Controls/Filter/Button/Panel/FilterDropdown/FilterDropdown',
   'css!Controls/Filter/Button/Panel/FilterDropdown/FilterDropdown'
], function(Control, template) {

   'use strict';

   var FilterDropdown = Control.extend({
      _template: template,

      _valueChangedHandler: function(event, value) {
         this._notify('valueChanged', [value]);
      },

      _resetHandler: function() {
         this._notify('visibilityChanged', [false]);
      }

   });

   return FilterDropdown;

});
