import {TemplateFunction} from "UI/Base";
import {GridView} from 'Controls/grid';
import SearchItemTpl = require('wml!Controls/_treeGrid/SearchView/Item');
import 'Controls/decorator';
import 'wml!Controls/_treeGrid/SearchView/SearchBreadCrumbsContent';
import * as GridItemTemplate from 'wml!Controls/_treeGrid/TreeGridView/layout/grid/Item';
import * as PartialGridItemTemplate from 'wml!Controls/_treeGrid/TreeGridView/layout/partialGrid/Item';
import * as TableItemTemplate from 'wml!Controls/_treeGrid/TreeGridView/layout/table/Item';

var
    SearchView = GridView.extend({
        _resolveItemTemplate() {
           return SearchItemTpl;
        },
        _resolveBaseItemTemplate(): TemplateFunction {
            if (this._isFullGridSupport) {
                return GridItemTemplate;
            } else if (this._shouldUseTableLayout) {
                return TableItemTemplate;
            } else {
                return PartialGridItemTemplate;
            }
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
