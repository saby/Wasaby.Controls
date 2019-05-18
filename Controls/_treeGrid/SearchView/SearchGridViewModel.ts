import TreeGridViewModel = require('Controls/_treeGrid/TreeGridView/TreeGridViewModel');
import SearchViewModel = require('Controls/_treeGrid/SearchView/SearchViewModel');
import {RowIndexUtil} from 'Controls/list';

var SearchGridViewModel = TreeGridViewModel.extend({
    _createModel: function(cfg) {
        return new SearchViewModel(cfg);
    },
    _calcRowIndex(current) {
        if (current.breadCrumbs) {
            return RowIndexUtil.calcRowIndexByItem(this._model.getDisplay().at(current.index),
               this._model.getDisplay(), !!this.getHeader(), this.getResultsPosition());
        }
        return SearchGridViewModel.superclass._calcRowIndex.apply(this, arguments);
    }
});
export = SearchGridViewModel;
