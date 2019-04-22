import TreeGridViewModel = require('Controls/_treeGrid/TreeGridView/TreeGridViewModel');
import SearchViewModel = require('Controls/_treeGrid/SearchView/SearchViewModel');

var SearchGridViewModel = TreeGridViewModel.extend({
    _createModel: function(cfg) {
        return new SearchViewModel(cfg);
    },
});
export = SearchGridViewModel;
