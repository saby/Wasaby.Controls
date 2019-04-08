import {ViewModel as TreeGridViewModel} from 'Controls/treeGrid';
import SearchViewModel = require('Controls/_grids/SearchView/SearchViewModel');

var SearchGridViewModel = TreeGridViewModel.extend({
    _createModel: function(cfg) {
        return new SearchViewModel(cfg);
    },
});
export = SearchGridViewModel;
