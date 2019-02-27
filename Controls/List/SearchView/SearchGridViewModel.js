define('Controls/List/SearchView/SearchGridViewModel', [
   'Controls/List/TreeGridView/TreeGridViewModel',
   'Controls/List/SearchView/SearchViewModel'
], function(TreeGridViewModel, SearchViewModel) {

   'use strict';

   var SearchGridViewModel = TreeGridViewModel.extend({
      _createModel: function(cfg) {
         return new SearchViewModel(cfg);
      },
      
      getCurrent: function() {
         var current = TreeGridViewModel.superclass.getCurrent.apply(this, arguments),
            superGetCurrentColumn = current.getCurrentColumn;
         
         current.getCurrentColumn = function() {
            var currentColumn = superGetCurrentColumn();

            if (currentColumn.columnIndex === 0 && current.item.getId) {
               currentColumn.cellClasses += ' controls-Grid__cell_spacingFirstCol_search';
            }
            
            return currentColumn;
         };
         return current;
      }
   });
   return SearchGridViewModel;
});
