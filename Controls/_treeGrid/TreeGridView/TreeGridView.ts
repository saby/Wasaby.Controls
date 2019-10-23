import {TemplateFunction} from 'UI/Base';
import {GridView} from 'Controls/grid';

import * as ItemOutputWrapper from 'wml!Controls/_treeGrid/TreeGridView/ItemOutputWrapper';
import * as GridItemTemplate from 'wml!Controls/_treeGrid/TreeGridView/layout/grid/Item';
import * as PartialGridItemTemplate from 'wml!Controls/_treeGrid/TreeGridView/layout/partialGrid/Item';
import * as TableItemTemplate from 'wml!Controls/_treeGrid/TreeGridView/layout/table/Item';

import 'wml!Controls/_treeGrid/TreeGridView/NodeFooter';
import 'css!theme?Controls/treeGrid';

var
    TreeGridView = GridView.extend({
        _itemOutputWrapper: ItemOutputWrapper,
        _defaultItemTemplate: GridItemTemplate,
        _resolveBaseItemTemplate(): TemplateFunction {
            if (this._isFullGridSupport) {
                return GridItemTemplate;
            } else if (this._shouldUseTableLayout) {
                return TableItemTemplate;
            } else {
                return PartialGridItemTemplate;
            }
        },
        _onExpanderClick(e, dispItem): void {
            this._notify('expanderClick', [dispItem], {bubbling: true});
            e.stopImmediatePropagation();
        },
        _onLoadMoreClick(e, dispItem): void {
            this._notify('loadMoreClick', [dispItem]);
        }
    });

export = TreeGridView;
