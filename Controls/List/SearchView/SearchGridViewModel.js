define('Controls/List/SearchView/SearchGridViewModel', [
   'Controls/List/TreeGridView/TreeGridViewModel',
   'Controls/List/SearchView/SearchViewModel'
], function(TreeGridViewModel, SearchViewModel) {

   'use strict';
   
   var SearchGridViewModel = TreeGridViewModel.extend({
      _createModel: function(cfg) {
         return new SearchViewModel(cfg);
      }
   });
   return SearchGridViewModel;
});
