import {GridView} from 'Controls/grid';
import DefaultItemTpl = require('wml!Controls/_treeGrids/TreeGridView/Item');
import ItemOutputWrapper = require('wml!Controls/_treeGrids/TreeGridView/ItemOutputWrapper');
import 'wml!Controls/_treeGrids/TreeGridView/NodeFooter';
import 'css!theme?Controls/_treeGrids/TreeGridView/TreeGridView';

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
