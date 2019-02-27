import GridView = require('Controls/List/Grid/GridView');
import DefaultItemTpl = require('wml!Controls/List/SearchView/Item');
import 'Controls/BreadCrumbs';
import 'Controls/Decorator/Highlight';
import 'wml!Controls/List/SearchView/SearchBreadCrumbsContent';

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
