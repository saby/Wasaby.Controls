import GridView = require('Controls/List/Grid/GridView');
import DefaultItemTpl = require('wml!Controls/List/TreeGridView/Item');
import ItemOutputWrapper = require('wml!Controls/List/TreeGridView/ItemOutputWrapper');
require('wml!Controls/List/TreeGridView/NodeFooter');
require('css!theme?Controls/List/TreeGridView/TreeGridView');

var
    TreeGridView = GridView.extend({
        _itemOutputWrapper: ItemOutputWrapper,
        _defaultItemTemplate: DefaultItemTpl,
        _onExpanderClick: function (e, dispItem) {
            this._notify('expanderClick', [dispItem], {bubbling: true});
            e.stopImmediatePropagation();
        },
        _onLoadMoreClick: function (e, dispItem) {
            this._notify('loadMoreClick', [dispItem]);
        }
    });

export = TreeGridView;
