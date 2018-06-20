define('Controls/Container/MassSelector', [
   'Core/Control',
   'tmpl!Controls/Container/MassSelector/MassSelector',
   'Controls/Container/MassSelector/SelectionContextField',
   'Controls/Container/MassSelector/CallbacksContextField'
], function(Control, template, SelectionContextField, CallbacksContextField) {
   'use strict';

   return Control.extend({
      _template: template,
      _multiselection: null,

      _beforeMount: function(newOptions) {
         this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
         this._selectionCallback = this._selectionCallback.bind(this);
         this._updateSelectionContext = this._updateSelectionContext.bind(this);

         this._massSelectorCallbacks = new CallbacksContextField(this._itemsReadyCallback, this._selectionCallback);

         /*
         TODO: у меня нет способа получить нужный Selection пока не построятся список и не скажет какой Selection нужно использовать,
         но список не построится, если не передать ему SelectionContext. В принципе, после получения selection'а изменится только count,
         так что на первое время сойдет и так
         */
         this._selectionContext = new SelectionContextField(
            newOptions.selected,
            newOptions.excluded,
            0
         );
      },

      //TODO: вроде можно удалить, т.к. используется только в Петиной демке ПМО. А там можно решить всё через selectionChangeHandler
      getSelection: function() {
         return this._multiselection.getSelection();
      },

      _onCheckBoxClickHandler: function(event, key, status) {
         //TODO: мне не нравится, что тут нужно оборачивать в массив. Нужно научить Selection самостоятельно оборачивать в массив
         if (!!status) {
            this._multiselection.unselect([key]);
         } else {
            this._multiselection.select([key]);
         }

         this._updateSelectionContext();
      },

      _selectedTypeChangedHandler: function(event, typeName) {
         this._multiselection[typeName]();

         this._updateSelectionContext();
      },

      _afterItemsRemoveHandler: function(event, keys) {
         this._multiselection.unselect(keys);

         this._updateSelectionContext();
      },

      _itemsReadyCallback: function() {
         //TODO: нужно будет items в selection прокидывать, наверное
         this._multiselection.select(this._options.selectedKeys || []);
         this._multiselection.unselect(this._options.excludedKeys || []);

         this._updateSelectionContext();
      },

      _selectionCallback: function(SelectionConstructor) {
         this._multiselection = new SelectionConstructor();
      },

      _updateSelectionContext: function() {
         var currentSelection = this._multiselection.getSelection();

         this._selectionContext = new SelectionContextField(
            currentSelection.selected,
            currentSelection.excluded,
            this._multiselection.getCount()
         );
         if (this._options.selectionChangeHandler) {
            this._options.selectionChangeHandler(currentSelection);
         }
         this._forceUpdate();
      },

      _getChildContext: function() {
         return {
            selection: this._selectionContext,
            massSelectorCallbacks: this._massSelectorCallbacks
         };
      }
   });
});
