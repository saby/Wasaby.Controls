define('Controls/Container/MultiSelector', [
   'Core/Control',
   'tmpl!Controls/Container/MultiSelector/MultiSelector',
   'Controls/Container/MultiSelector/SelectionContextField',
   'Controls/Controllers/Multiselect/Selection',
   'Controls/Controllers/SourceController'
], function(
   Control,
   template,
   SelectionContextField,
   Selection,
   SourceController
) {
   'use strict';

   //TODO: после Саниной доброски нужно реагировать на изменение items

   return Control.extend({
      _template: template,
      _multiselection: null,
      _items: null,

      _beforeMount: function(newOptions) {
         var self = this;
         this._updateSelectionContext = this._updateSelectionContext.bind(this);

         this._sourceController = new SourceController({
            source: newOptions.source,
            navigation: newOptions.navigation
         });

         return this._sourceController.load().addCallback(function(items) {
            self._items = items;
            self._createMultiselection(newOptions, items);
            self._updateSelectionContext();
         });
      },

      getSelection: function() {
         return this._multiselection.getSelection();
      },

      _onListSelectionChange: function(event, diff) {
         this._multiselection.unselect(diff.removed);
         this._multiselection.select(diff.added);

         this._updateSelectionContext();
      },

      _selectedTypeChangedHandler: function(event, typeName) {
         this._multiselection[typeName]();

         this._updateSelectionContext();
      },

      _updateSelectionContext: function() {
         var currentSelection = this._multiselection.getSelection();

         this._selectionContext = new SelectionContextField(
            currentSelection.selected,
            currentSelection.excluded,
            this._multiselection.getSelectedKeysForRender(),
            this._multiselection.getCount(),
            this._items
         );

         if (this._options.selectionChangeHandler) {
            this._options.selectionChangeHandler(currentSelection);
         }
         this._forceUpdate();
      },

      _createMultiselection: function(options, items) {
         this._multiselection = new Selection({
            selectedKeys: options.selectedKeys || [],
            excludedKeys: options.excludedKeys || [],
            items: items
         });
      },

      _getChildContext: function() {
         return {
            selection: this._selectionContext
         };
      }
   });
});
