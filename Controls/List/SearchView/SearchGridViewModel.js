define('Controls/List/SearchView/SearchGridViewModel', [
   'Controls/List/TreeGridView/TreeGridViewModel',
   'Controls/List/SearchView/SearchViewModel'
], function(TreeGridViewModel, SearchViewModel) {

   'use strict';
   
   var _private = {
      isNeedToHighlight: function(item, dispProp, searchValue) {
         var itemValue = item.get(dispProp);
         return itemValue && searchValue && String(itemValue).toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
      }
   };
   
   var SearchGridViewModel = TreeGridViewModel.extend({
      _createModel: function(cfg) {
         return new SearchViewModel(cfg);
      },
      
      getCurrent: function() {
         var current = TreeGridViewModel.superclass.getCurrent.apply(this, arguments),
            superGetCurrentColumn = current.getCurrentColumn;
         
         current.getCurrentColumn = function() {
            var currentColumn = superGetCurrentColumn();
            
            if (current.item.get) {
               currentColumn.column.needSearchHighlight = _private.isNeedToHighlight(current.item, currentColumn.column.displayProperty, current.searchValue);
               currentColumn.searchValue = current.searchValue;
            }

            if (currentColumn.columnIndex === 0 && current.item.getId) {
               currentColumn.cellClasses += ' controls-Grid__cell_spacingFirstCol_search';
            }
            
            return currentColumn;
         };
         return current;
      }
   });
   
   SearchGridViewModel._private = _private;
   return SearchGridViewModel;
});
