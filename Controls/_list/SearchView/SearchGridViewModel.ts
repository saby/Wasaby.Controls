import TreeGridViewModel = require('Controls/List/TreeGridView/TreeGridViewModel');
import SearchViewModel = require('Controls/List/SearchView/SearchViewModel');

var SearchGridViewModel = TreeGridViewModel.extend({
    _createModel: function(cfg) {
        return new SearchViewModel(cfg);
    },
});
export = SearchGridViewModel;
