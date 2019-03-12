import GridView = require('Controls/List/Grid/GridView');
import DefaultItemTpl = require('wml!Controls/_lists/TreeGridView/Item');
import ItemOutputWrapper = require('wml!Controls/_lists/TreeGridView/ItemOutputWrapper');
import 'wml!Controls/_lists/TreeGridView/NodeFooter';
import 'css!theme?Controls/List/TreeGridView/TreeGridView';

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
