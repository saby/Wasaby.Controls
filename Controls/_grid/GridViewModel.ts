import {ListViewModel, BaseViewModel, GridLayoutUtil, ItemsUtil} from 'Controls/list';
import {Utils as stickyUtil} from 'Controls/scroll';
import LadderWrapper = require('wml!Controls/_grid/LadderWrapper');
import cClone = require('Core/core-clone');
import Env = require('Env/Env');
import {isEqual} from 'Types/object';
import {
    getFooterIndex,
    getIndexByDisplayIndex, getIndexById, getIndexByItem,
    getResultsIndex, getTopOffset, IBaseGridRowIndexOptions, getRowsArray, getMaxEndRow, getBottomPaddingRowIndex
} from 'Controls/_grid/utils/GridRowIndexUtil';


const FIXED_HEADER_ZINDEX = 4;
const STICKY_HEADER_ZINDEX = 3;

var
    _private = {
        calcItemColumnVersion: function(self, itemVersion, columnIndex) {
            return itemVersion + '_' + self._columnsVersion + '_' +
               (self._options.multiSelectVisibility === 'hidden' ? columnIndex : columnIndex - 1);
        },
        isDrawActions: function(itemData, currentColumn, colspan) {
            return itemData.drawActions &&
                (itemData.getLastColumnIndex() === currentColumn.columnIndex ||
                colspan && currentColumn.columnIndex === (itemData.multiSelectVisibility === 'hidden' ? 0 : 1));
        },
        getCellStyle: function(itemData, currentColumn, colspan) {
           var
               style = '';
           if (currentColumn.styleForLadder) {
              style += currentColumn.styleForLadder;
           }
           if (colspan) {
                style += _private.getColspan(
                   itemData.multiSelectVisibility,
                   currentColumn.columnIndex,
                   itemData.columns.length
                );
           }
           return style;
        },
        getColspan(
           multiSelectVisibility: 'hidden' | 'visible' | 'onhover',
           columnIndex: number,
           columnsLength: number,

           // TODO: удалить isHeaderBreadCrumbs после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
           isHeaderBreadCrumbs: boolean = false
        ): string {
            let
                multiselectOffset = (multiSelectVisibility === 'hidden' ? 0 : 1);

          if (columnIndex === multiselectOffset) {
              if (isHeaderBreadCrumbs) {
                 if (GridLayoutUtil.isNoGridSupport()) {
                    return ' colspan: 1;';
                 } else if (GridLayoutUtil.isPartialGridSupport()) {
                    return ` -ms-grid-column: 1; -ms-grid-column-span: ${multiselectOffset + 1};`;
                 } else {
                    return ` grid-column: 1 / ${multiselectOffset + 2};`;
                 }
              } else {
                  if (GridLayoutUtil.isNoGridSupport()) {
                      return ` colspan: ${columnsLength - multiselectOffset};`;
                  } else if (GridLayoutUtil.isPartialGridSupport()) {
                      return ` grid-column: ${multiselectOffset + 1} / ${columnsLength + 1}; -ms-grid-column: ${multiselectOffset + 1}; -ms-grid-column-span: ${columnsLength - multiselectOffset};`;
                  } else {
                      return ` grid-column: ${multiselectOffset + 1} / ${columnsLength + 1};`;
                  }
              }
          }
        },
        getPaddingCellClasses: function(params) {
            var
                preparedClasses = '';

            // Колонки
            if (params.multiSelectVisibility ? params.columnIndex > 1 : params.columnIndex > 0) {
                preparedClasses += ' controls-Grid__cell_spacingLeft';
            }
            if (params.columnIndex < params.columns.length - 1) {
                preparedClasses += ' controls-Grid__cell_spacingRight';
            }

            // Отступ для первой колонки. Если режим мультиселект, то отступ обеспечивается чекбоксом.
            if (params.columnIndex === 0 && !params.multiSelectVisibility) {
                preparedClasses += ' controls-Grid__cell_spacingFirstCol_' + (params.itemPadding.left || 'default').toLowerCase();
            }

            // TODO: удалить isBreadcrumbs после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
            if (params.isBreadCrumbs) {
               preparedClasses += ' controls-Grid__cell_spacingFirstCol_null';
            }

            // Стиль колонки
            preparedClasses += ' controls-Grid__cell_' + (params.style || 'default');

            // Отступ для последней колонки
            if (params.columnIndex === params.columns.length - 1) {
                preparedClasses += ' controls-Grid__cell_spacingLastCol_' + (params.itemPadding.right || 'default').toLowerCase();
            }
            if (!params.isHeader && !params.isResult) {
                preparedClasses += ' controls-Grid__row-cell_rowSpacingTop_' + (params.itemPadding.top || 'default').toLowerCase();
                preparedClasses += ' controls-Grid__row-cell_rowSpacingBottom_' + (params.itemPadding.bottom || 'default').toLowerCase();
            }


            return preparedClasses;
        },
        getPaddingHeaderCellClasses: function(params) {
            let preparedClasses = '';
            const { multiSelectVisibility, columnIndex, columns,
                rowIndex, itemPadding, isBreadCrumbs, style } = params;
            if (rowIndex === 0) {
                if (multiSelectVisibility ? columnIndex > 1 : columnIndex > 0) {
                    preparedClasses += ' controls-Grid__cell_spacingLeft';
                }
            } else {
                preparedClasses += ' controls-Grid__cell_spacingLeft';
            }

            if (columnIndex < columns.length - 1) {
                preparedClasses += ' controls-Grid__cell_spacingRight';
            }
            // Отступ для последней колонки
            if (columnIndex === columns.length - 1) {
                preparedClasses += ' controls-Grid__cell_spacingLastCol_' + (itemPadding.right || 'default').toLowerCase();
            }
            // Отступ для первой колонки. Если режим мультиселект, то отступ обеспечивается чекбоксом.
            if (columnIndex === 0 && !multiSelectVisibility) {
                preparedClasses += ' controls-Grid__cell_spacingFirstCol_' + (itemPadding.left || 'default').toLowerCase();
            }

            // TODO: удалить isBreadcrumbs после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
            if (isBreadCrumbs) {
                preparedClasses += ' controls-Grid__cell_spacingFirstCol_null';
            }
            // Стиль колонки
            preparedClasses += ' controls-Grid__cell_' + (style || 'default');
            if (!params.isHeader) {
                preparedClasses += ' controls-Grid__row-cell_rowSpacingTop_' + (itemPadding.top || 'default').toLowerCase();
                preparedClasses += ' controls-Grid__row-cell_rowSpacingBottom_' + (itemPadding.bottom || 'default').toLowerCase();
            }

            return preparedClasses;
        },

        prepareRowSeparatorClasses: function(current) {
            var
                result = '',
                rowCount = current.dispItem.getOwner().getCount();

            if (current.rowSeparatorVisibility) {

                if (current.isFirstInGroup) {
                    result += ' controls-Grid__row-cell_first-row-in-group';
                } else {
                    if (current.index === 0) {
                        result += ' controls-Grid__row-cell_firstRow';
                        result += ' controls-Grid__row-cell_withRowSeparator_firstRow';
                    } else {
                        result += ' controls-Grid__row-cell_withRowSeparator';
                    }
                    if (current.index === rowCount - 1) {
                        result += ' controls-Grid__row-cell_lastRow';
                        result += ' controls-Grid__row-cell_withRowSeparator_lastRow';
                    }
                }
            } else {
                result += ' controls-Grid__row-cell_withoutRowSeparator';
            }
            return result;
        },

        isFixedCell: function(params) {
           if (params.multiSelectVisibility === 'hidden') {
              return params.columnIndex === 0;
           }
           return params.columnIndex <= 1;
        },

        getHeaderZIndex: function(params) {
           return _private.isFixedCell(params) ? FIXED_HEADER_ZINDEX : STICKY_HEADER_ZINDEX;
        },

        getColumnScrollCellClasses: function(params) {
           return _private.isFixedCell(params) ? ' controls-Grid__cell_fixed' : ' controls-Grid__cell_transform';
        },

        getItemColumnCellClasses: function(current) {
            var
               cellClasses = 'controls-Grid__row-cell';
            if (current.columnScroll) {
                cellClasses += _private.getColumnScrollCellClasses(current);
            } else {
                cellClasses += ' controls-Grid__cell_fit';
            }
            cellClasses += current.isEditing ? ' controls-Grid__row-cell-background-editing' : ' controls-Grid__row-cell-background-hover';

            var currentStyle = current.style || 'default';

            cellClasses += _private.prepareRowSeparatorClasses(current);

            // Если включен множественный выбор и рендерится первая колонка с чекбоксом
            if (current.multiSelectVisibility !== 'hidden' && current.columnIndex === 0) {
                cellClasses += ' controls-Grid__row-cell-checkbox';
            } else {
                cellClasses += _private.getPaddingCellClasses({
                    columns: current.columns,
                    style: current.style,
                    columnIndex: current.columnIndex,
                    multiSelectVisibility: current.multiSelectVisibility !== 'hidden',
                    itemPadding: current.itemPadding
                });
            }

            if (current.isSelected) {
                cellClasses += ' controls-Grid__row-cell_selected' + ' controls-Grid__row-cell_selected-' + currentStyle;

                if (current.columnIndex === 0) {
                    cellClasses += ' controls-Grid__row-cell_selected__first-' + currentStyle;
                }
                if (current.columnIndex === current.getLastColumnIndex()) {
                    cellClasses += ' controls-Grid__row-cell_selected__last' + ' controls-Grid__row-cell_selected__last-' + currentStyle;
                }
            } else if (current.columnIndex === current.getLastColumnIndex()) {
                cellClasses += ' controls-Grid__row-cell__last' + ' controls-Grid__row-cell__last-' + currentStyle;
            }

            return cellClasses;
        },
        getStickyColumn: function(cfg) {
            var
                result;
            if (cfg.stickyColumn) {
                result = {
                    index: cfg.stickyColumn.index,
                    property: cfg.stickyColumn.property
                };
            } else if (cfg.columns) {
                for (var idx = 0; idx < cfg.columns.length; idx++) {
                    if (cfg.columns[idx].stickyProperty) {
                        result = {
                            index: idx,
                            property: cfg.columns[idx].stickyProperty
                        };
                        break;
                    }
                }
            }
            return result;
        },
        prepareLadder: function(self) {
            var
                fIdx, idx, item, prevItem,
                ladderProperties = self._options.ladderProperties,
                stickyColumn = _private.getStickyColumn(self._options),
                supportLadder = !!(ladderProperties && ladderProperties.length),
                supportSticky = !!stickyColumn,
                ladder = {}, ladderState = {}, stickyLadder = {},
                stickyLadderState = {
                    ladderLength: 1
                };

            if (!supportLadder && !supportSticky) {
                return {};
            }

            function processLadder(params) {
                var
                    value = params.value,
                    prevValue = params.prevValue,
                    state = params.state;

                // isEqual works with any types
                if (isEqual(value, prevValue)) {
                    state.ladderLength++;
                } else {
                    params.ladder.ladderLength = state.ladderLength;
                    state.ladderLength = 1;
                }
            }

            function processStickyLadder(params) {
                processLadder(params);
                if (params.ladder.ladderLength && params.ladder.ladderLength > 1 && !Env.detection.isNotFullGridSupport) {
                    params.ladder.headingStyle = 'grid-area: ' +
                        (params.itemIndex + 1) + ' / ' +
                        '1 / ' +
                        'span ' + params.ladder.ladderLength + ' / ' +
                        'span 1;';
                }
            }

            if (supportLadder) {
                for (fIdx = 0; fIdx < ladderProperties.length; fIdx++) {
                    ladderState[ladderProperties[fIdx]] = {
                        ladderLength: 1
                    };
                }
            }

            for (idx = self._model.getStopIndex() - 1; idx >= self._model.getStartIndex(); idx--) {
                item = self._model.getDisplay().at(idx).getContents();
                prevItem = idx - 1 >= 0 ? self._model.getDisplay().at(idx - 1).getContents() : null;

                if (supportLadder) {
                    ladder[idx] = {};
                    for (fIdx = 0; fIdx < ladderProperties.length; fIdx++) {
                        ladder[idx][ladderProperties[fIdx]] = {};
                        processLadder({
                            itemIndex: idx,
                            value: item.get ? item.get(ladderProperties[fIdx]) : undefined,
                            prevValue: prevItem && prevItem.get ? prevItem.get(ladderProperties[fIdx]) : undefined,
                            state: ladderState[ladderProperties[fIdx]],
                            ladder: ladder[idx][ladderProperties[fIdx]]
                        });
                    }
                }

                if (supportSticky) {
                    stickyLadder[idx] = {};
                    processStickyLadder({
                        itemIndex: idx,
                        value: item.get(stickyColumn.property),
                        prevValue: prevItem ? prevItem.get(stickyColumn.property) : undefined,
                        state: stickyLadderState,
                        ladder: stickyLadder[idx]
                    });
                }
            }
            return {
                ladder: ladder,
                stickyLadder: stickyLadder
            };
        },

        getSortingDirectionByProp: function(sorting, prop) {
            var sortingDirection;

            if (sorting) {
                sorting.forEach(function(elem) {
                    if (elem[prop]) {
                        sortingDirection = elem[prop];
                    }
                });
            }

            return sortingDirection;
        },

        isNeedToHighlight: function(item, dispProp, searchValue) {
            var itemValue = item.get(dispProp);
            return itemValue && searchValue && String(itemValue).toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
        },

        calcResultsRowIndex: function (self): number {
            return self._getRowIndexHelper().getResultsIndex();
        },

        getFooterStyles: function (self): string {
            let styles = '';

            if (GridLayoutUtil.isPartialGridSupport()) {
                let
                    columnStart = self._options.multiSelectVisibility === 'hidden' ? 0 : 1,
                    columnEnd = self._columns.length + columnStart,
                    rowIndex = self._getRowIndexHelper().getFooterIndex();

                styles += GridLayoutUtil.getCellStyles(rowIndex, columnStart, null, columnEnd-columnStart);
            }

            return styles;
        },

        getEmptyTemplateStyles: function (self): string {
            let
                styles = '';

            if (GridLayoutUtil.isPartialGridSupport()) {
                let
                    columnStart = self.getMultiSelectVisibility() === 'hidden' ? 0 : 1,
                    rowIndex = self._getRowIndexHelper().getTopOffset();

                styles += GridLayoutUtil.getCellStyles(rowIndex, columnStart, 1, self._columns.length);
            }

            return styles;
        },

        prepareColumnsWidth: function (self, itemData): Array<string> {
            let
                columns: Array<{ width: string }> = self._columns,
                hasMultiselect = self._options.multiSelectVisibility !== 'hidden',
                columnsWidth = hasMultiselect ? ['max-content'] : [],
                hasAutoWidth = !!columns.find((column) => {
                    return column.width === 'auto';
                });

            if (!hasAutoWidth) {
                columnsWidth = columnsWidth.concat(columns.map((column) => column.width || '1fr'));
            } else {
                columnsWidth = columnsWidth.concat(self.getColumnsWidthForEditingRow(itemData));
            }

            return columnsWidth;
        },

        prepareItemDataForPartialSupport(self, itemData): void {

            /* When using a custom item template, the scope of the base template becomes the same as the scope of custom template.
             * Because of this, the base handlers are lost. To fix this, need to remember the handlers where the scope is
             * still right and set them. But current event system prevent do this, because it looks for given event handler
             * only on closest control (which can be Browser, Explorer or smth else because of template scope).
             * Therefore it is required to create Cell as control with and subscribe on events in it.
             * https://online.sbis.ru/opendoc.html?guid=9d0f8d1a-576d-471d-bf02-991cd02f92e4
             */
            itemData.handlersForPartialSupport = self.getHandlersForPartialSupport();

            // In browsers with partial grid support grid requires explicit setting grid cell styles.
            if (!itemData.isGroup) {

                itemData.getEditingRowStyles = function () {
                    let
                        columnsLength = self._columns.length + (self._options.multiSelectVisibility === 'hidden' ? 0 : 1),
                        editingRowStyles = '';

                    editingRowStyles += GridLayoutUtil.getDefaultStylesFor(GridLayoutUtil.CssTemplatesEnum.Grid) + ' ';
                    editingRowStyles += GridLayoutUtil.getTemplateColumnsStyle(_private.prepareColumnsWidth(self, itemData)) + ' ';
                    editingRowStyles += GridLayoutUtil.getCellStyles(itemData.rowIndex, 0, 1, columnsLength);

                    return editingRowStyles;
                }
            } else {
                itemData.gridGroupStyles = GridLayoutUtil.toCssString([
                    {name: 'grid-row', value: itemData.rowIndex + 1},
                    {name: '-ms-grid-row', value: itemData.rowIndex + 1}
                ]);
            }

        }

    },

    GridViewModel = BaseViewModel.extend({
        _model: null,
        _columnTemplate: null,

        _columns: [],
        _curColumnIndex: 0,

        _lastItemKey: undefined,
        _headerRows: [],
        _headerColumns: [],
        _curHeaderColumnIndex: 0,
        _maxEndRow: 0,
        _curHeaderRowIndex: 0,
        _multyHeaderOffset: 0,
        _headerCellMinHeight: null,
        _resultOffset: null,

        _resultsColumns: [],
        _curResultsColumnIndex: 0,

        _colgroupColumns: [],
        _curColgroupColumnIndex: 0,

        _ladder: null,
        _columnsVersion: 0,

        _eventHandlersForPartialSupport: {},

        constructor: function(cfg) {
            this._options = cfg;
            GridViewModel.superclass.constructor.apply(this, arguments);
            this._model = this._createModel(cfg);
            this._onListChangeFn = function(event, changesType, action, newItems, newItemsIndex, removedItems, removedItemsIndex) {
                if (changesType === 'collectionChanged') {
                    this._ladder = _private.prepareLadder(this);
                }
                if (changesType === 'collectionChanged' && GridLayoutUtil.isPartialGridSupport()){
                    this._nextModelVersion();
                }
                this._nextVersion();
                this._notify('onListChange', changesType, action, newItems, newItemsIndex, removedItems, removedItemsIndex);
            }.bind(this);
            this._onMarkedKeyChangedFn = function(event, key) {
                this._notify('onMarkedKeyChanged', key);
            }.bind(this);
            this._onGroupsExpandChangeFn = function(event, changes) {
                this._notify('onGroupsExpandChange', changes);
            }.bind(this);
            this._onCollectionChangeFn = function() {
                this._updateLastItemKey();
                this._notify.apply(this, ['onCollectionChange'].concat(Array.prototype.slice.call(arguments, 1)));
            }.bind(this);
            // Events will not fired on the PresentationService, which is why setItems will not ladder recalculation.
            // Use callback for fix it. https://online.sbis.ru/opendoc.html?guid=78a1760a-bfcf-4f2c-8b87-7f585ea2707e
            this._model.setUpdateIndexesCallback(this._updateIndexesCallback.bind(this));
            this._model.subscribe('onListChange', this._onListChangeFn);
            this._model.subscribe('onMarkedKeyChanged', this._onMarkedKeyChangedFn);
            this._model.subscribe('onGroupsExpandChange', this._onGroupsExpandChangeFn);
            this._model.subscribe('onCollectionChange', this._onCollectionChangeFn);
            this._ladder = _private.prepareLadder(this);
            this._setColumns(this._options.columns);
            if (this._options.header && this._options.header.length) { this._isMultyHeader = this.getMultyHeader(this._options.header); }
            this._setHeader(this._options.header);
            this._updateLastItemKey();
        },

        _updateLastItemKey(): void {
            if (this.getItems()) {
                this._lastItemKey = ItemsUtil.getPropertyValue(this.getLastItem(), this._options.keyProperty);
            }
        },

        _updateIndexesCallback(): void {
            this._ladder = _private.prepareLadder(this);
        },

        _nextModelVersion: function(notUpdatePrefixItemVersion) {
            this._model.nextModelVersion(notUpdatePrefixItemVersion);
        },

        _prepareCrossBrowserColumn: function(column, isNoGridSupport) {
            var
                result = cClone(column);
            if (isNoGridSupport) {
                if (result.width === '1fr') {
                    result.width = 'auto';
                }
                if (result.width === 'max-content') {
                    result.width = 'auto';
                }
            }
            return result;
        },

        _prepareColumns: function(columns) {
            var
                result = [];
            for (var i = 0; i < columns.length; i++) {
                result.push(this._prepareCrossBrowserColumn(columns[i], GridLayoutUtil.isNoGridSupport()));
            }
            return result;
        },

        _createModel: function(cfg) {
            return new ListViewModel(cfg);
        },

        setColumnTemplate: function(columnTpl) {
            this._columnTemplate = columnTpl;
        },

        // -----------------------------------------------------------
        // ---------------------- headerColumns ----------------------
        // -----------------------------------------------------------

        getHeader: function() {
            return this._header;
        },

        _setHeader: function(columns) {
            this._header = columns;
            this._prepareHeaderColumns(this._header, this._options.multiSelectVisibility !== 'hidden');
        },

        setHeader: function(columns) {
            this._setHeader(columns);
            this._nextModelVersion();
        },
        getMultyHeader: function(columns) {
            let k = 0;
            while(columns.length > k) {
                if (columns[k].startRow && columns[k].endRow) {
                    return true;
                }
                k++;
            }
            return false;
        },
        _prepareHeaderColumns: function(columns, multiSelectVisibility) {
            if (columns && columns.length) {
                this._headerRows = getRowsArray(columns, multiSelectVisibility);
                this._maxEndRow = getMaxEndRow(this._headerRows);
            } else if (multiSelectVisibility) {
                this._headerRows = [{}];
            } else {
                this._headerRows = [];
            }
            this._multyHeaderOffset = this._headerRows.length ? this._headerRows.length - 1 : 0;
            this.resetHeaderRows();
        },
        getMultyHeaderOffset: function() {
          return this._multyHeaderOffset;
        },
        setHeaderCellMinHeight: function(data) {
            if (!isEqual(getRowsArray(data[0], this._options.multiSelectVisibility !== 'hidden'), this._headerRows)) {
                this._prepareHeaderColumns(data[0], this._options.multiSelectVisibility !== 'hidden');
                if (data[1]) { this._setResultOffset(data[1]); }
                this._nextModelVersion();
            }
        },
        _setResultOffset: function(offset) {
            this._resultOffset = offset;
        },
        getResultOffset: function() {
            return this._resultOffset;
        },
        resetHeaderRows: function() {
            this._curHeaderRowIndex = 0;
        },

        goToNextHeaderRow: function() {
            this._curHeaderRowIndex++;
        },

        getCurrentHeaderRow: function() {
            const self = this;
            let obj = {
                curHeaderColumnIndex: 0,
                curRowIndex: this._curHeaderRowIndex,
                headerCells: this._headerRows[this._curHeaderRowIndex],
                getCurrentHeaderColumn: function() {
                    return self.getCurrentHeaderColumn(this.curRowIndex, this.curHeaderColumnIndex);
                }
            };
            obj.resetHeaderColumns = function() {
                this.curHeaderColumnIndex = 0;
            };
            obj.goToNextHeaderColumn = function() {
                this.curHeaderColumnIndex++;
            };
            obj.isEndHeaderColumn = function() {
                return this.curHeaderColumnIndex < this.headerCells.length;
            };
            return obj;
        },

        isEndHeaderRow: function() {
            return this._curHeaderRowIndex < this._headerRows.length;
        },

        getColumnsVersion: function() {
            return this._columnsVersion;
        },

        isNotFullGridSupport: function() {
            return Env.detection.isNotFullGridSupport;
        },

        isStickyHeader: function() {
           // todo https://online.sbis.ru/opendoc.html?guid=e481560f-ce95-4718-a7c1-c34eb8439c5b
           return this._options.stickyHeader && !this.isNotFullGridSupport();
        },

        getCurrentHeaderColumn: function(rowIndex, columnIndex) {
            const cell = this._headerRows[rowIndex][columnIndex];
            let
                cellClasses = 'controls-Grid__header-cell',
                headerColumn = {
                    column: cell,
                    index: columnIndex
                };

            if (this.isStickyHeader()) {
               headerColumn.zIndex = _private.getHeaderZIndex({
                  columnIndex: columnIndex,
                  multiSelectVisibility: this._options.multiSelectVisibility
               });
            }

            if (!stickyUtil.isStickySupport()) {
                cellClasses = cellClasses + ' controls-Grid__header-cell_static';
            }

            if (this._options.columnScroll) {
                cellClasses += _private.getColumnScrollCellClasses({
                    columnIndex: columnIndex,
                    multiSelectVisibility: this._options.multiSelectVisibility
                });
            }

            // Если включен множественный выбор и рендерится первая колонка с чекбоксом
            if (this._options.multiSelectVisibility !== 'hidden' && columnIndex === 0 && !cell.title) {
                cellClasses += ' controls-Grid__header-cell-checkbox';
            } else {
                cellClasses += _private.getPaddingHeaderCellClasses({
                    style: this._options.style,
                    columns: this._headerRows[rowIndex],
                    columnIndex: columnIndex,
                    multiSelectVisibility: this._options.multiSelectVisibility !== 'hidden',
                    itemPadding: this._model.getItemPadding(),
                    isHeader: true,
                    cell,
                    rowIndex,
                    // TODO: удалить isBreadcrumbs после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
                    isBreadCrumbs: headerColumn.column.isBreadCrumbs,
                });
            }

            // TODO: удалить isBreadcrumbs после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
            if (headerColumn.column.isBreadCrumbs) {
               headerColumn.style = _private.getColspan(
                  this._options.multiSelectVisibility,
                  columnIndex,
                  this._headerRows[0].length,
                  true
               );
            }


            if (headerColumn.column.sortingProperty) {
                headerColumn.sortingDirection = _private.getSortingDirectionByProp(this.getSorting(), headerColumn.column.sortingProperty);
            }
            // -----------------------------------------------------------
            // ---------------------- multyHeader ------------------------
            // -----------------------------------------------------------
            const { endRow, startRow, endColumn, startColumn } = cell;
            let cellContentClasses = '';
            let cellStyles = '';
            let offsetTop = 0;
            let shadowVisibility = 'visible';

            if (this._headerRows.length > 1) {
                cellContentClasses += ' controls-Grid__header-cell_align_items_center';
            }
            if (cell.startRow) {
                if (this.isNoGridSupport()) {
                    headerColumn.rowSpan = endRow - startRow;
                    headerColumn.colSpan = endColumn - startColumn;
                } else {
                    if (this.isStickyHeader()) {
                        offsetTop = cell.offsetTop ? cell.offsetTop : 0;
                        shadowVisibility = (rowIndex === this._headerRows.length - 1 || endRow === this._maxEndRow) && this.getResultsPosition() !== 'top' ? 'visible' : 'hidden';
                    }

                    const additionalColumn = this._options.multiSelectVisibility === 'hidden' ? 0 : 1;
                    const gridStyles = GridLayoutUtil.getMultyHeaderStyles(startColumn, endColumn, startRow, endRow, additionalColumn);
                    cellStyles += gridStyles;

                }
                cellContentClasses += rowIndex !== this._headerRows.length - 1 && endRow - startRow === 1 ? ' controls-Grid__cell_header-content_border-bottom' : '';
                cellContentClasses += endRow - startRow === 1 ? ' control-Grid__cell_header-nowrap' : '';
            } else if (GridLayoutUtil.isPartialGridSupport()) {
                cellStyles += GridLayoutUtil.getCellStyles(rowIndex, columnIndex);
            }

            if (columnIndex === 0 && rowIndex === 0 && this._options.multiSelectVisibility !== 'hidden' && this._headerRows[rowIndex][columnIndex + 1].startColumn && !cell.title) {
                cellStyles = GridLayoutUtil.getMultyHeaderStyles(1, 2, 1, this._maxEndRow, 0)
                if (this.isNoGridSupport()) {
                    headerColumn.rowSpan = this._maxEndRow - 1;
                    headerColumn.colSpan = 1;
                }
            }
            if (headerColumn.column.align) {
                cellContentClasses += ' controls-Grid__header-cell_justify_content_' + headerColumn.column.align;
            }
            if (headerColumn.column.valign) {
                cellContentClasses += ' controls-Grid__header-cell_align_items_' + headerColumn.column.valign;
            }

            headerColumn.shadowVisibility = shadowVisibility;
            headerColumn.offsetTop = offsetTop;
            headerColumn.cellStyles = cellStyles;
            headerColumn.cellClasses = cellClasses;
            headerColumn.cellContentClasses = cellContentClasses;

            return headerColumn;
        },

        // -----------------------------------------------------------
        // ---------------------- resultColumns ----------------------
        // -----------------------------------------------------------

        getResultsPosition: function(): string {
            if (this._options.results) {
                return this._options.results.position;
            }
            return this._options.resultsPosition;
        },

        setResultsPosition: function(position) {
            this._options.resultsPosition = position;
        },

        shouldDrawHeader(): boolean {
            return !!this.getHeader() && this.getCount() > 0;
        },

        shouldDrawResultsAt(position: 'top' | 'bottom'): boolean {
            if (this.getResultsPosition() !== position) {
                return false;
            }
            return this.getCount() > 1;
        },

        shouldDrawFooter(): boolean {

            // Не меняю текущее поведение в 410. В 510 сделал по стандарту
            return true;
        },

        getStyleForCustomResultsTemplate: function() {
            return _private.getColspan(
               this._options.multiSelectVisibility,
               0,
               this._columns.length
            );
        },

        _prepareResultsColumns: function(columns, multiSelectVisibility) {
            if (multiSelectVisibility) {
                this._resultsColumns = [{}].concat(columns);
            } else {
                this._resultsColumns = columns;
            }

            this.resetResultsColumns();
        },

        resetResultsColumns: function() {
            this._curResultsColumnIndex = 0;
        },

        getCurrentResultsColumn: function() {
            var
                columnIndex = this._curResultsColumnIndex,
                cellClasses = 'controls-Grid__results-cell',
                resultsColumn = {
                    column: this._resultsColumns[columnIndex],
                    index: columnIndex
                };

            if (this.isStickyHeader()) {
                resultsColumn.zIndex = _private.getHeaderZIndex({
                    columnIndex: columnIndex,
                    multiSelectVisibility: this._options.multiSelectVisibility
                });
            }

            if (this._options.columnScroll) {
                cellClasses += _private.getColumnScrollCellClasses({
                    columnIndex: columnIndex,
                    multiSelectVisibility: this._options.multiSelectVisibility
                });
            }

            // Если включен множественный выбор и рендерится первая колонка с чекбоксом
            if ((this._options.multiSelectVisibility !== 'hidden') && columnIndex === 0) {
                cellClasses += ' controls-Grid__results-cell-checkbox';
            } else {
                cellClasses += _private.getPaddingCellClasses({
                    style: this._options.style,
                    columns: this._resultsColumns,
                    columnIndex: columnIndex,
                    multiSelectVisibility: this._options.multiSelectVisibility !== 'hidden',
                    itemPadding: this._model.getItemPadding(),
                    isResult: true
                });
            }
            resultsColumn.cellClasses = cellClasses;

            // For browsers with partial grid support need to set its grid-row and grid-column
            if (GridLayoutUtil.isPartialGridSupport()) {
                resultsColumn.rowIndex = this._getRowIndexHelper().getResultsIndex();
                resultsColumn.gridCellStyles = GridLayoutUtil.getCellStyles(resultsColumn.rowIndex, columnIndex);
            }
            return resultsColumn;
        },

        goToNextResultsColumn: function() {
            this._curResultsColumnIndex++;
        },

        isEndResultsColumn: function() {
            return this._curResultsColumnIndex < this._resultsColumns.length;
        },

        // -----------------------------------------------------------
        // ------------------------ colgroup -------------------------
        // -----------------------------------------------------------

        _prepareColgroupColumns: function(columns, multiSelectVisibility) {
            if (multiSelectVisibility) {
                this._colgroupColumns = [{}].concat(columns);
            } else {
                this._colgroupColumns = columns;
            }
            this.resetColgroupColumns();
        },

        getCurrentColgroupColumn: function() {
            var
                column = this._colgroupColumns[this._curColgroupColumnIndex];
            return {
                column: column,
                index: this._curColgroupColumnIndex,
                multiSelectVisibility: this._options.multiSelectVisibility !== 'hidden',
                style: typeof column.width !== 'undefined' ? 'width: ' + column.width : ''
            };
        },

        resetColgroupColumns: function() {
            this._curColgroupColumnIndex = 0;
        },

        isEndColgroupColumn: function() {
            return this._curColgroupColumnIndex < this._colgroupColumns.length;
        },

        goToNextColgroupColumn: function() {
            this._curColgroupColumnIndex++;
        },

        // -----------------------------------------------------------
        // -------------------------- items --------------------------
        // -----------------------------------------------------------

        _setColumns: function(columns) {
            this._columns = this._prepareColumns(columns);
            this._ladder = _private.prepareLadder(this);
            this._prepareResultsColumns(this._columns, this._options.multiSelectVisibility !== 'hidden');
            this._prepareColgroupColumns(this._columns, this._options.multiSelectVisibility !== 'hidden');
            this._columnsVersion++;
        },

        setColumns: function(columns) {
            this._setColumns(columns);
            this._nextModelVersion();
        },

        setLeftSpacing: function(leftSpacing) {
            //TODO: Выпилить в 19.200 https://online.sbis.ru/opendoc.html?guid=837b45bc-b1f0-4bd2-96de-faedf56bc2f6
            this._model.setLeftSpacing(leftSpacing);
        },

        setRightSpacing: function(rightSpacing) {
            //TODO: Выпилить в 19.200 https://online.sbis.ru/opendoc.html?guid=837b45bc-b1f0-4bd2-96de-faedf56bc2f6
            this._model.setRightSpacing(rightSpacing);
        },

        setLeftPadding: function(leftPadding) {
            //TODO: Выпилить в 19.200 https://online.sbis.ru/opendoc.html?guid=837b45bc-b1f0-4bd2-96de-faedf56bc2f6
            this._model.setLeftPadding(leftPadding);
        },

        setRightPadding: function(rightPadding) {
            //TODO: Выпилить в 19.200 https://online.sbis.ru/opendoc.html?guid=837b45bc-b1f0-4bd2-96de-faedf56bc2f6
            this._model.setRightPadding(rightPadding);
        },

        setRowSpacing: function(rowSpacing) {
            //TODO: Выпилить в 19.200 https://online.sbis.ru/opendoc.html?guid=837b45bc-b1f0-4bd2-96de-faedf56bc2f6
            this._model.setRowSpacing(rowSpacing);
        },

        getColumns: function() {
            return this._columns;
        },

        getMultiSelectVisibility: function() {
            return this._model.getMultiSelectVisibility();
        },

        setMultiSelectVisibility: function(multiSelectVisibility) {
            var
                hasMultiSelect = multiSelectVisibility !== 'hidden';
            this._model.setMultiSelectVisibility(multiSelectVisibility);
            this._prepareColgroupColumns(this._columns, hasMultiSelect);
            this._prepareHeaderColumns(this._header, hasMultiSelect);
            this._prepareResultsColumns(this._columns, hasMultiSelect);
        },

        hasItemById: function(id, keyProperty) {
            return this._model.hasItemById(id, keyProperty);
        },

        getItemById: function(id, keyProperty) {
            return this._model.getItemById(id, keyProperty);
        },

        setMarkedKey: function(key) {
            this._model.setMarkedKey(key);
        },

        setMarkerVisibility: function(markerVisibility) {
            this._model.setMarkerVisibility(markerVisibility);
        },

        getMarkedKey: function() {
            return this._model.getMarkedKey();
        },
        getMarkedItem: function() {
            return this._model.getMarkedItem();
        },
        getFirstItem: function() {
            return this._model.getFirstItem.apply(this._model, arguments);
        },
        getLastItem: function() {
            return this._model.getLastItem.apply(this._model, arguments);
        },
        getIndexByKey: function() {
            return this._model.getIndexByKey.apply(this._model, arguments);
        },

        getSelectionStatus: function() {
            return this._model.getSelectionStatus.apply(this._model, arguments);
        },

        getNextItemKey: function() {
            return this._model.getNextItemKey.apply(this._model, arguments);
        },

        setIndexes: function(startIndex, stopIndex) {
            this._model.setIndexes(startIndex, stopIndex);
        },

        getPreviousItemKey: function() {
            return this._model.getPreviousItemKey.apply(this._model, arguments);
        },

        setSorting: function(sorting) {
            this._model.setSorting(sorting);
        },

        setSearchValue: function(value) {
            this._model.setSearchValue(value);
        },

        getSorting: function() {
            return this._model.getSorting();
        },

        setItemPadding: function(itemPadding) {
            this._model.setItemPadding(itemPadding);
        },

        getSwipeItem: function() {
            return this._model.getSwipeItem();
        },

        setCollapsedGroups: function(collapsedGroups) {
            this._model.setCollapsedGroups(collapsedGroups);
        },

        reset: function() {
            this._model.reset();
        },

        isEnd: function() {
            return this._model.isEnd();
        },

        goToNext: function() {
            this._model.goToNext();
        },

        _calcRowIndex: function(current) {
            if (current.isGroup) {
                return this._getRowIndexHelper().getIndexByDisplayIndex(current.index);
            } else if (current.index !== -1) {
                return this._getRowIndexHelper().getIndexById(current.key);
            }
        },

        _getRowIndexHelper() {
            let
                cfg: IBaseGridRowIndexOptions = {
                    display: this.getDisplay(),
                    hasHeader: !!this.getHeader(),
                    resultsPosition: this.getResultsPosition(),
                    multyHeaderOffset: this.getMultyHeaderOffset(),
                    hasBottomPadding: this._options._needBottomPadding
                },
                hasEmptyTemplate = !!this._options.emptyTemplate;

            if (this.getEditingItemData()) {
                cfg.editingRowIndex = this.getEditingItemData().index;
            }

            return {
                getIndexByItem: (item) => getIndexByItem({item, ...cfg}),
                getIndexById: (id) => getIndexById({id, ...cfg}),
                getIndexByDisplayIndex: (index) => getIndexByDisplayIndex({index, ...cfg}),
                getResultsIndex: () => getResultsIndex({...cfg, hasEmptyTemplate}),
                getBottomPaddingRowIndex: () => getBottomPaddingRowIndex(cfg),
                getFooterIndex: () => getFooterIndex({...cfg, hasEmptyTemplate}),
                getTopOffset: () => getTopOffset(cfg.hasHeader, cfg.resultsPosition, cfg.multyHeaderOffset)
            };
        },

        setMenuState(state: string): void {
            this._model.setMenuState(state);
        },

        getItemDataByItem: function(dispItem) {
            var
                self = this,
                stickyColumn = _private.getStickyColumn(this._options),
                current = this._model.getItemDataByItem(dispItem),
                isStickedColumn;

            //TODO: Выпилить в 19.200 или если закрыта -> https://online.sbis.ru/opendoc.html?guid=837b45bc-b1f0-4bd2-96de-faedf56bc2f6
            current.rowSpacing = this._options.rowSpacing;

            current.isFullGridSupport = GridLayoutUtil.isFullGridSupport;
            current.isPartialGridSupport = GridLayoutUtil.isPartialGridSupport;
            current.isNoGridSupport = GridLayoutUtil.isNoGridSupport;

            current.columnScroll = this._options.columnScroll;

            current.style = this._options.style;
            current.multiSelectClassList += current.hasMultiSelect ? ' controls-GridView__checkbox' : '';

            if (current.multiSelectVisibility !== 'hidden') {
                current.columns = [{}].concat(this._columns);
            } else {
                current.columns = this._columns;
            }

            current.isHovered = current.item === self._model.getHoveredItem();

            if (stickyColumn && !Env.detection.isNotFullGridSupport) {
                current.styleLadderHeading = self._ladder.stickyLadder[current.index].headingStyle;
                current.stickyColumnIndex = stickyColumn.index;
            }

            if (GridLayoutUtil.isPartialGridSupport() || current.columnScroll) {
                current.rowIndex = this._calcRowIndex(current);
                if (this.getEditingItemData() && (current.rowIndex>=this.getEditingItemData().rowIndex)) {
                    current.rowIndex++;
                }
            }

            if (GridLayoutUtil.isPartialGridSupport()) {
                _private.prepareItemDataForPartialSupport(this, current);
            }

            if (current.isGroup) {
                current.groupResultsSpacingClass = ' controls-Grid__cell_spacingLastCol_' + ((current.itemPadding && current.itemPadding.right) || current.rightSpacing || 'default').toLowerCase();
                return current;
            }

            current.isFirstInGroup = !current.isGroup && this._isFirstInGroup(current.item);

            if (current.isFirstInGroup) {
                current.rowSeparatorVisibility = false;
            } else {
                current.rowSeparatorVisibility = this._options.showRowSeparator !== undefined ? this._options.showRowSeparator : this._options.rowSeparatorVisibility;
            }

            current.columnIndex = 0;

            current.getVersion = function() {
                return self._calcItemVersion(current.item, current.key);
            };

            current.getItemColumnCellClasses = _private.getItemColumnCellClasses;

            current.resetColumnIndex = function() {
                current.columnIndex = 0;
            };
            current.goToNextColumn = function() {
                current.columnIndex++;
            };
            current.getLastColumnIndex = function() {
                return current.columns.length - 1;
            };
            current.isDrawActions = _private.isDrawActions;
            current.getCellStyle = _private.getCellStyle;

            current.getCurrentColumnKey = function() {
                return self._columnsVersion + '_' +
                    (self._options.multiSelectVisibility === 'hidden' ? current.columnIndex : current.columnIndex - 1);
            };

            current.getCurrentColumn = function() {
                var
                    currentColumn = {
                        item: current.item,
                        style: current.style,
                        isMenuShown: current.isMenuShown,
                        dispItem: current.dispItem,
                        keyProperty: current.keyProperty,
                        displayProperty: current.displayProperty,
                        index: current.index,
                        columnIndex: current.columnIndex,
                        key: current.key,
                        getPropValue: current.getPropValue,
                        isEditing: current.isEditing,
                        isActive: current.isActive,
                        getVersion: function() {
                           return _private.calcItemColumnVersion(self, current.getVersion(), current.columnIndex);
                        },
                        _preferVersionAPI: true
                    };
                currentColumn.cellClasses = current.getItemColumnCellClasses(current, currentColumn.columnIndex);
                currentColumn.column = current.columns[current.columnIndex];
                currentColumn.template = currentColumn.column.template ? currentColumn.column.template : self._columnTemplate;
                if (self._options.ladderProperties && self._options.ladderProperties.length) {
                    currentColumn.ladder = self._ladder.ladder[current.index];
                    currentColumn.ladderWrapper = LadderWrapper;
                }
                if (current.item.get) {
                    currentColumn.column.needSearchHighlight = !!_private.isNeedToHighlight(current.item, currentColumn.column.displayProperty, current.searchValue);
                    currentColumn.searchValue = current.searchValue;
                }
                if (stickyColumn) {
                    isStickedColumn = stickyColumn.index === (current.multiSelectVisibility !== 'hidden' ? currentColumn.columnIndex + 1 : currentColumn.columnIndex);
                    if (Env.detection.isNotFullGridSupport) {
                        currentColumn.hiddenForLadder = isStickedColumn && !self._ladder.stickyLadder[current.index].ladderLength;
                    } else {
                        currentColumn.hiddenForLadder = isStickedColumn && self._ladder.stickyLadder[current.index].ladderLength !== 1;
                        currentColumn.styleForLadder = currentColumn.cellStyleForLadder = 'grid-area: ' +
                            (current.index + 1) + ' / ' +
                            (currentColumn.columnIndex + 1) + ' / ' +
                            'span 1 / ' +
                            'span 1;';
                    }
                }

                // For browsers with partial grid support need to set explicit rows' style with grid-row and grid-column
                if (GridLayoutUtil.isPartialGridSupport() || current.columnScroll) {
                    currentColumn.gridCellStyles = GridLayoutUtil.getCellStyles(current.rowIndex, currentColumn.columnIndex);
                } else {
                    currentColumn.gridCellStyles = '';
                }
                return currentColumn;
            };
            return current;
        },

        getCurrent: function() {
            var dispItem = this._model._display.at(this._model._curIndex);
            return this.getItemDataByItem(dispItem);
        },

        toggleGroup: function(group, state) {
            this._model.toggleGroup(group, state);
        },

        getNext: function() {
            return this._model.getNext();
        },

        isLast: function() {
            return this._model.isLast();
        },

        setStickyColumn: function(stickyColumn) {
            this._options.stickyColumn = stickyColumn;
            this._ladder = _private.prepareLadder(this);
            this._nextModelVersion();
        },
        setLadderProperties: function(ladderProperties) {
            this._options.ladderProperties = ladderProperties;
            this._ladder = _private.prepareLadder(this);
            this._nextModelVersion();
        },

        updateIndexes: function(startIndex, stopIndex) {
            this._model.updateIndexes(startIndex, stopIndex);
        },

        setItems: function(items) {
            this._model.setItems(items);
            this._updateLastItemKey();
        },

        setItemTemplateProperty: function(itemTemplateProperty) {
            this._model.setItemTemplateProperty(itemTemplateProperty);
        },

        getItems: function() {
            return this._model.getItems();
        },

        setActiveItem: function(itemData) {
            this._model.setActiveItem(itemData);
        },

        mergeItems: function(items) {
            this._model.mergeItems(items);
        },

        appendItems: function(items) {
            this._model.appendItems(items);
        },

        prependItems: function(items) {
            this._model.prependItems(items);
        },

        setItemActions: function(item, actions) {
            this._model.setItemActions(item, actions);
        },

        nextModelVersion: function() {
            this._model.nextModelVersion.apply(this._model, arguments);
        },

        _setEditingItemData: function (itemData) {
            if (GridLayoutUtil.isPartialGridSupport() && itemData) {
                itemData.rowIndex = itemData.index + this._getRowIndexHelper().getTopOffset();
            }
            this._model._setEditingItemData(itemData);
        },

        getEditingItemData(): object | null {
            return this._model.getEditingItemData();
        },

        setItemActionVisibilityCallback: function(callback) {
            this._model.setItemActionVisibilityCallback(callback);
        },

        _calcItemVersion: function(item, key) {
            var
                version = this._model._calcItemVersion(item, key);

            if (this._lastItemKey === key) {
                version = 'LAST_ITEM_' + version;
            }

            if (GridLayoutUtil.isPartialGridSupport() && this._model.getHoveredItem() === item) {
                version = 'HOVERED_' + version;
            }
            return version;
        },

        _prepareDisplayItemForAdd: function(item) {
            return this._model._prepareDisplayItemForAdd(item);
        },

        getCurrentIndex: function() {
            return this._model.getCurrentIndex();
        },

        getItemActions: function(item) {
            return this._model.getItemActions(item);
        },

        getIndexBySourceItem: function(item) {
            return this._model.getIndexBySourceItem(item);
        },

        at: function(index) {
            return this._model.at(index);
        },

        getCount: function() {
            return this._model.getCount();
        },

        setSwipeItem: function(itemData) {
            this._model.setSwipeItem(itemData);
        },

        setRightSwipedItem: function(itemData) {
            this._model.setRightSwipedItem(itemData);
        },

        setShowRowSeparator: function(showRowSeparator) {
            this._options.showRowSeparator = showRowSeparator;
            this._nextModelVersion();
        },

        setRowSeparatorVisibility: function(rowSeparatorVisibility) {
            this._options.rowSeparatorVisibility = rowSeparatorVisibility;
            this._nextModelVersion();
        },

        updateSelection: function(selectedKeys) {
            this._model.updateSelection(selectedKeys);
        },

        setDragTargetPosition: function(position) {
            this._model.setDragTargetPosition(position);
        },

        getDragTargetPosition: function() {
            return this._model.getDragTargetPosition();
        },

        setDragEntity: function(entity) {
            this._model.setDragEntity(entity);
        },

        getDragEntity: function() {
            return this._model.getDragEntity();
        },

        setDragItemData: function(itemData) {
            this._model.setDragItemData(itemData);
        },

        getDragItemData: function() {
            return this._model.getDragItemData();
        },

        calculateDragTargetPosition: function(targetData, position) {
            return this._model.calculateDragTargetPosition(targetData, position);
        },

        getActiveItem: function() {
            return this._model.getActiveItem();
        },

        getChildren: function() {
            return this._model.getChildren.apply(this._model, arguments);
        },

        getStartIndex(): number {
            return this._model.getStartIndex();
        },

        getStopIndex(): number {
            return this._model.getStopIndex();
        },

        setHoveredItem: function (item) {
            this._model.setHoveredItem(item);
        },

        getHoveredItem: function () {
            return this._model.getHoveredItem();
        },

        getDisplay: function () {
            return this._model.getDisplay();
        },

        isFullGridSupport: function():boolean{
            return GridLayoutUtil.isFullGridSupport();
        },

        isPartialGridSupport: function():boolean{
            return GridLayoutUtil.isPartialGridSupport();
        },

        isNoGridSupport: function():boolean{
            return GridLayoutUtil.isNoGridSupport();
        },

        // Only for browsers with partial grid support. Explicit grid styles for footer with grid row and grid column
        getFooterStyles: function (): string {
            // Can't calc grid-row classes for old browser without display
            return this.getDisplay() ? _private.getFooterStyles(this) : '';
        },

        // Only for browsers with partial grid support. Explicit grid styles for empty template with grid row and grid column
        getEmptyTemplateStyles: function() {
            return _private.getEmptyTemplateStyles(this);
        },
        getBottomPaddingStyles(): string {
            let styles = '';

            if (GridLayoutUtil.isPartialGridSupport()) {
                let
                    columnStart = this.getMultiSelectVisibility() === 'hidden' ? 0 : 1,
                    rowIndex = this._getRowIndexHelper().getBottomPaddingRowIndex();

                styles += GridLayoutUtil.getCellStyles(rowIndex, columnStart, 1, this._columns.length);
            }

            return styles;
        },

        setHandlersForPartialSupport: function(handlersList: Record<string, Function>): void {
            this._eventHandlersForPartialSupport = handlersList;
        },

        getHandlersForPartialSupport: function(): Record<string, Function> {
            return this._eventHandlersForPartialSupport;
        },

        _isFirstInGroup: function(item): boolean {
            var display = this._model._display,
                groupingKeyCallback = this._options.groupingKeyCallback,
                currentItemGroup,
                currentGroupItems;

            // If grouping is not enabled.
            if (!groupingKeyCallback) {
                return false;
            }

            // Getting all items of the current items' group.
            currentItemGroup = groupingKeyCallback(item);
            currentGroupItems = display.getGroupItems(currentItemGroup);

            // If current item is out of any group.
            if (!currentGroupItems || currentGroupItems.length === 0) {
                return false;
            }


            return item === currentGroupItems[0].getContents();
        },

        destroy: function() {
            this._model.unsubscribe('onListChange', this._onListChangeFn);
            this._model.unsubscribe('onMarkedKeyChanged', this._onMarkedKeyChangedFn);
            this._model.unsubscribe('onGroupsExpandChange', this._onGroupsExpandChangeFn);
            this._model.unsubscribe('onCollectionChange', this._onCollectionChangeFn);
            this._model.destroy();
            GridViewModel.superclass.destroy.apply(this, arguments);
        }

    });

GridViewModel._private = _private;

export = GridViewModel;
