import {GridView} from 'Controls/grid';
import SearchItemTpl = require('wml!Controls/_treeGrid/SearchView/Item');
import 'Controls/breadcrumbs';
import 'Controls/decorator';
import 'wml!Controls/_treeGrid/SearchView/SearchBreadCrumbsContent';

var
    SearchView = GridView.extend({
        _resolveItemTemplate() {
           return SearchItemTpl;
        },
        _onSearchItemClick: function (e) {
            e.stopPropagation();
        },
        _onSearchPathClick: function (e, item) {
            this._notify('itemClick', [item, e], {bubbling: true});
        },
        getDefaultOptions: function () {
            return {
                leftPadding: 'S'
            };
        }
    });

export = SearchView;
