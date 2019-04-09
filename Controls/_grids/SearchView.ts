import {GridView} from 'Controls/grid';
import DefaultItemTpl = require('wml!Controls/_grids/SearchView/Item');
import 'Controls/breadcrumbs';
import 'Controls/Decorator/Highlight';
import 'wml!Controls/_grids/SearchView/SearchBreadCrumbsContent';

var
    SearchView = GridView.extend({
        _defaultItemTemplate: DefaultItemTpl,
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
