import {GridViewModel} from 'Controls/grid';
import {GridLayoutUtil, RowIndexUtil} from 'Controls/list';
import TreeViewModel = require('Controls/_treeGrid/Tree/TreeViewModel');

function isLastColumn(
   itemData: object,
   colspan: boolean
): boolean {
   const columnWidth = itemData.multiSelectVisibility === 'hidden' ? 1 : 2;
   return itemData.getLastColumnIndex() >= itemData.columnIndex && (!colspan || itemData.columnIndex < columnWidth);
}

var _private = {

    // region only for browsers with partial grid support

    // For browsers with partial grid support need to set explicit rows' style with grid-row and grid-column
    prepareGroupGridStyles: function (self, current) {
        current.rowIndex = RowIndexUtil.calcRowIndexByItem.apply(null, _private.getArgsForRowIndexUtil(self, self._model.getDisplay().at(current.index)));
        current.gridGroupStyles = GridLayoutUtil.toCssString([
            {
                name: 'grid-row',
                value: current.rowIndex+1
            },
            {
                name: '-ms-grid-row',
                value: current.rowIndex+1
            }
        ]);
    },

    getArgsForRowIndexUtil: function(self, item) {
        return [item].concat([
            self._model.getDisplay(),
            !!self.getHeader(),
            self.getResultsPosition(),
            self._model.getHierarchyRelation(),
            self._model.getHasMoreStorage(),
            self._options.nodeFooterTemplate,
            self.getExpandedItems()
        ]);
    },

    // For browsers with partial grid support need to set explicit rows' style with grid-row and grid-column
    getFooterStyles: function (self, rowIndex, columnsCount) {
        let offsetForMultiselect = self._options.multiSelectVisibility === 'hidden' ? 0 : 1;

        return GridLayoutUtil.toCssString([
            {
                name: 'grid-row',
                value: rowIndex + 1
            },
            {
                name: '-ms-grid-row',
                value: rowIndex + 1
            },
            {
                name: 'grid-column',
                value: `${offsetForMultiselect + 1} / ${columnsCount}`
            },
            {
                name: '-ms-grid-column',
                value: offsetForMultiselect + 1
            },
            {
                name: '-ms-grid-column-span',
                value: columnsCount - 1
            },
        ]);
    }
    // endregion

};

var
    TreeGridViewModel = GridViewModel.extend({
        _onNodeRemovedFn: null,
        constructor: function () {
            TreeGridViewModel.superclass.constructor.apply(this, arguments);
            this._onNodeRemovedFn = this._onNodeRemoved.bind(this);
            this._model.subscribe('onNodeRemoved', this._onNodeRemovedFn);
        },
        _createModel: function (cfg) {
            return new TreeViewModel(cfg);
        },
        toggleExpanded: function (dispItem, expand) {
            this._model.toggleExpanded(dispItem, expand);
        },
        isExpanded: function (dispItem) {
            return this._model.isExpanded(dispItem);
        },
        isExpandAll: function () {
            return this._model.isExpandAll();
        },
        setExpandedItems: function (expandedItems) {
            this._model.setExpandedItems(expandedItems);
        },
        getExpandedItems: function () {
            return this._model.getExpandedItems();
        },
        setRoot: function (root) {
            this._model.setRoot(root);
        },
        setNodeFooterTemplate: function (nodeFooterTemplate) {
            this._model.setNodeFooterTemplate(nodeFooterTemplate);
        },
        setExpanderDisplayMode: function (expanderDisplayMode) {
            // Выпилить в 19.200
            this._model.setExpanderDisplayMode(expanderDisplayMode);
        },
        setExpanderVisibility: function (expanderVisibility) {
            this._model.setExpanderVisibility(expanderVisibility);
        },
        resetExpandedItems: function () {
            this._model.resetExpandedItems();
        },
        getItemDataByItem: function(dispItem) {
            var
                current = TreeGridViewModel.superclass.getItemDataByItem.apply(this, arguments),
                superGetCurrentColumn = current.getCurrentColumn;

            current.isLastColumn = isLastColumn;

            // For browsers with partial grid support need to calc real rows' index and set explicit rows' style
            // with grid-row and grid-column
            if (GridLayoutUtil.isPartialSupport) {
                if (current.isGroup) {
                    _private.prepareGroupGridStyles(this, current);
                } else {
                    current.rowIndex = this._calcRowIndex(current);
                }
            }

            current.getCurrentColumn = function () {
                let
                    currentColumn = superGetCurrentColumn(),
                    nodeType = current.item.get && current.item.get(current.nodeProperty);

                currentColumn.isExpanded = current.isExpanded;
                currentColumn.cellClasses += ' controls-TreeGrid__row-cell';

                if (nodeType) {
                    currentColumn.cellClasses += ' controls-TreeGrid__row-cell__node';
                } else if (nodeType === false) {
                    currentColumn.cellClasses += ' controls-TreeGrid__row-cell__hiddenNode';
                } else {
                    currentColumn.cellClasses += ' controls-TreeGrid__row-cell__item';
                }

                if (GridLayoutUtil.isPartialSupport) {
                    currentColumn.gridCellStyles = GridLayoutUtil.getCellStyles(current.rowIndex, currentColumn.columnIndex);
                }

                return currentColumn;
            };

            current.getLevelIndentClasses = function (expanderSize, levelIndentSize) {
                let
                    sizeEnum = ['null', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'],
                    resultPaddingSize;

                if (expanderSize && levelIndentSize) {
                    if (sizeEnum.indexOf(expanderSize) >= sizeEnum.indexOf(levelIndentSize)) {
                        resultPaddingSize = expanderSize;
                    } else {
                        resultPaddingSize = levelIndentSize;
                    }
                } else if (!expanderSize && !levelIndentSize) {
                    resultPaddingSize = 'default';
                } else {
                    resultPaddingSize = expanderSize || levelIndentSize;
                }

                return `controls-TreeGrid__row-levelPadding_size_${resultPaddingSize}`;
            };

            // For browsers with partial grid support need to calc real rows' index and set explicit rows' style with grid-row and grid-column
            if (current.nodeFooter) {
                current.nodeFooter.columns = current.columns;
                current.nodeFooter.isPartialSupport = GridLayoutUtil.isPartialSupport;
                current.nodeFooter.getLevelIndentClasses = current.getLevelIndentClasses;
                if (GridLayoutUtil.isPartialSupport) {
                    current.nodeFooter.rowIndex += RowIndexUtil.calcTopOffset(!!this.getHeader(), this.getResultsPosition());
                    current.nodeFooter.gridStyles = _private.getFooterStyles(this, current.nodeFooter.rowIndex, current.nodeFooter.columns.length);
                }
            }

            return current;
        },
        _onNodeRemoved: function (event, nodeId) {
            this._notify('onNodeRemoved', nodeId);
        },

        _calcRowIndex: function(current):number {
            var index:number;

            if (current.isGroup) {
                index = RowIndexUtil.calcRowIndexByItem(this._model.getDisplay().at(current.index), this._model.getDisplay(), !!this.getHeader(), this.getResultsPosition());
            } else if (current.index !== -1) {
                index = RowIndexUtil.calcRowIndexByKey.apply(null, _private.getArgsForRowIndexUtil(this, current.key));
            }

            return index;
        },
        setHasMoreStorage: function (hasMoreStorage) {
            this._model.setHasMoreStorage(hasMoreStorage);
        },
        destroy: function () {
            this._model.unsubscribe('onNodeRemoved', this._onNodeRemovedFn);
            TreeGridViewModel.superclass.destroy.apply(this, arguments);
        }
    });

TreeGridViewModel._private = _private;

export = TreeGridViewModel;
