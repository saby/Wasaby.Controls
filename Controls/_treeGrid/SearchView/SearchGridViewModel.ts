import TreeGridViewModel = require('Controls/_treeGrid/TreeGridView/TreeGridViewModel');
import SearchViewModel = require('Controls/_treeGrid/SearchView/SearchViewModel');
import {Record} from "../../../application/Types/entity";

var SearchGridViewModel = TreeGridViewModel.extend({
    _createModel: function(cfg) {
        return new SearchViewModel(cfg);
    },
    _calcRowIndex(current) {
        if (current.breadCrumbs) {
            return this._getRowIndexHelper().getIndexByDisplayIndex(current.index);
        }
        return SearchGridViewModel.superclass._calcRowIndex.apply(this, arguments);
    },

    _isFirstInGroup: function(item:Record|[Record]):boolean {
        item = item[0] || item;
        return SearchGridViewModel.superclass._isFirstInGroup.call(this, item);
    },
});
export = SearchGridViewModel;
