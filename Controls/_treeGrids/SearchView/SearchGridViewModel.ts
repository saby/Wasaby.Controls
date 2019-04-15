import TreeGridViewModel = require('Controls/_treeGrids/TreeGridView/TreeGridViewModel');
import SearchViewModel = require('Controls/_treeGrids/SearchView/SearchViewModel');

var SearchGridViewModel = TreeGridViewModel.extend({
    _createModel: function(cfg) {
        return new SearchViewModel(cfg);
    },
});
export = SearchGridViewModel;
