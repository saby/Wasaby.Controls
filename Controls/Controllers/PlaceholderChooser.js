define('Controls/Controllers/PlaceholderChooser', [
   'Core/Control',
   'wml!Controls/Controllers/PlaceholderChooser/PlaceholderChooser',
   'Types/collection'
], function(Control, template, collection) {
   'use strict';

   var _private = {
      getPlaceholder: function(items, placeholders, placeholderKeyCallback) {
         return placeholders[placeholderKeyCallback(items)];
      }
   };

   var PlaceholderChooser = Control.extend({
      _template: template,
      _placeholder: '',

      _beforeMount: function(options) {
         this._placeholder = _private.getPlaceholder(new collection.List(), options.placeholders, options.placeholderKeyCallback);
      },

      _itemsChanged: function(event, items) {
         this._placeholder = _private.getPlaceholder(items, this._options.placeholders, this._options.placeholderKeyCallback);
      },

      _dataLoadCallback: function(items) {
         this._placeholder = _private.getPlaceholder(items, this._options.placeholders, this._options.placeholderKeyCallback);
      }
   });

   PlaceholderChooser._private = _private;

   return PlaceholderChooser;
});
