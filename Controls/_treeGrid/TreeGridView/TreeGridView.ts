import {TemplateFunction} from 'UI/Base';
import {GridView} from 'Controls/grid';

import * as ItemOutputWrapper from 'wml!Controls/_treeGrid/TreeGridView/ItemOutputWrapper';
import * as GridItemTemplate from 'wml!Controls/_treeGrid/TreeGridView/layout/grid/Item';
import * as TableItemTemplate from 'wml!Controls/_treeGrid/TreeGridView/layout/table/Item';

import 'wml!Controls/_treeGrid/TreeGridView/NodeFooter';
import {isFullGridSupport} from '../../_grid/utils/GridLayoutUtil';

var
    TreeGridView = GridView.extend({
        _itemOutputWrapper: ItemOutputWrapper,
        _defaultItemTemplate: GridItemTemplate,
        _resolveBaseItemTemplate(): TemplateFunction {
            return isFullGridSupport() ? GridItemTemplate : TableItemTemplate;
        },
        _onExpanderClick(e, dispItem): void {
            this._notify('expanderClick', [dispItem], {bubbling: true});
            e.stopImmediatePropagation();
        },
        _onLoadMoreClick(e, dispItem): void {
            this._notify('loadMoreClick', [dispItem]);
        }
    });

TreeGridView._theme = ['Controls/grid', 'Controls/treeGrid'];
export = TreeGridView;
