import {ListViewModel, BaseViewModel} from 'Controls/list';

import LadderWrapper = require('wml!Controls/_grids/LadderWrapper');
import ControlsConstants = require('Controls/Constants');
import cClone = require('Core/core-clone');
import Env = require('Env/Env');
import isEqual = require('Core/helpers/Object/isEqual');
import stickyUtil = require('Controls/StickyHeader/Utils');
import ItemsUtil = require('Controls/List/resources/utils/ItemsUtil');
import {
    isFullSupport, isNoSupport, isPartialSupport, getCellStyles,
    toCssString, getTemplateColumnsStyle, getDefaultStylesFor, CssTemplatesEnum
} from './utils/GridLayoutUtil';
import {calcGroupRowIndex, calcResultsRowIndex, calcRowIndexByKey, ResultsPosition} from "./utils/RowIndexUtil";

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
        getCellStyle: function(itemData, currentColumn, colspan, isNotFullGridSupport) {
           var
               style = '';
           if (currentColumn.styleForLadder) {
              style += currentColumn.styleForLadder;
           }
           if (colspan) {
                style += _private.getColspan(
                   itemData.multiSelectVisibility,
                   currentColumn.columnIndex,
                   isNotFullGridSupport,
                   itemData.columns.length
                );
           }
           return style;
        },
        getColspan(
           multiSelectVisibility: 'hidden' | 'visible' | 'onhover',
           columnIndex: number,
           isNotFullGridSupport: boolean,
           columnsLength: number,

           // TODO: удалить isBreadcrumbs после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
           isBreadCrumbs: boolean = false
        ): string {
          if (columnIndex === (multiSelectVisibility === 'hidden' ? 0 : 1)) {
              if (isBreadCrumbs) {
                 if (isNotFullGridSupport) {
                    return ' colspan: ' + 1;
                 } else {
                    return ' grid-column: ' + 1 + ' / ' + (multiSelectVisibility === 'hidden' ? 2 : 3);
                 }
              } else {
                 if (isNotFullGridSupport) {
                    return ' colspan: ' + (multiSelectVisibility === 'hidden' ? columnsLength : columnsLength - 1);
                 } else {
                    return ' grid-column: ' + (multiSelectVisibility === 'hidden' ? 1 : 2) + ' / ' + (columnsLength + 1);
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
            if (!params.isHeader) {
                preparedClasses += ' controls-Grid__row-cell_rowSpacingTop_' + (params.itemPadding.top || 'default').toLowerCase();
                preparedClasses += ' controls-Grid__row-cell_rowSpacingBottom_' + (params.itemPadding.bottom || 'default').toLowerCase();
            }


            return preparedClasses;
        },

        isFirstInGroup: function(self, dispItem) {

            var
                item = dispItem.item,
                display = self._model._display,
                groupingKeyCallback = self._options.groupingKeyCallback,
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

        getItemColumnCellClasses: function(current) {
            var cellClasses = 'controls-Grid__row-cell' + (current.isEditing ? ' controls-Grid__row-cell-background-editing' : ' controls-Grid__row-cell-background-hover');
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

        // For partial grid support only. Calculates valid grid styles for edit at place in old browsers
        getEditingRowStyles: function (self, rowIndex) {

            // display: grid with prefixes
            let styles = getDefaultStylesFor(CssTemplatesEnum.GridIE) + ' ';

            // value 'auto' will break alignment in subgrid(editing row).
            let columnsWidths: Array<string|number> = [];

            self._columns.forEach(column => {
                if (self.getCount() > 1 && ((column.width && column.width === 'auto') || !column.width)) {
                    columnsWidths.push(column.realWidth || '1fr')
                } else {
                    columnsWidths.push(column.width);
                }
            });

            // grid column template with prefixes
            styles += getTemplateColumnsStyle(columnsWidths);

            // grid-row and grid-column with prefixes
            styles += getCellStyles(rowIndex+1, 0, null, 3);

            return styles;
        },

        calcRowIndexByKey: function(self, key): number {
            return calcRowIndexByKey(key, self._model.getDisplay(), !!self.getHeader(), self.getResultsPosition())
        },

        calcResultsRowIndex: function (self): number {
            return calcResultsRowIndex(self._model.getDisplay(), self.getResultsPosition(), !!self.getHeader(), !!self._options.footerTemplate);
        },

        calcGroupRowIndex: function (self, current): number {
            let groupItem = self._model.getDisplay().at(current.index);
            return calcGroupRowIndex(groupItem, self._model.getDisplay(), !!self.getHeader(), self.getResultsPosition());
        },
        getEmptyTemplateStyles: function (self): string {
            let
                styles = '';

            if (isPartialSupport) {
                let
                    columnsLength = self._columns.length + (self.getMultiSelectVisibility() !== 'hidden' ? 1 : 0),
                    rowIndex = 0;

                styles += toCssString([
                    {
                        name: '-ms-grid-column-span',
                        value: columnsLength
                    },
                ]);

                rowIndex += self.getHeader() ? 1 : 0;
                rowIndex += self.getResultsPosition() === 'top' ? 1 : 0;
                styles += getCellStyles(rowIndex, 0);
            }

            return styles;
        }
    },

    GridViewModel = BaseViewModel.extend({
        _model: null,
        _columnTemplate: null,

        _columns: [],
        _curColumnIndex: 0,

        _headerColumns: [],
        _curHeaderColumnIndex: 0,

        _resultsColumns: [],
        _curResultsColumnIndex: 0,

        _colgroupColumns: [],
        _curColgroupColumnIndex: 0,

        _ladder: null,
        _columnsVersion: 0,

        constructor: function(cfg) {
            this._options = cfg;
            GridViewModel.superclass.constructor.apply(this, arguments);
            this._model = this._createModel(cfg);
            this._onListChangeFn = function(event, changesType, action, newItems, newItemsIndex, removedItems, removedItemsIndex) {
                if (changesType === 'collectionChanged' || changesType === 'indexesChanged') {
                    this._ladder = _private.prepareLadder(this);
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
                this._notify.apply(this, ['onCollectionChange'].concat(Array.prototype.slice.call(arguments, 1)));
            }.bind(this);
            this._model.subscribe('onListChange', this._onListChangeFn);
            this._model.subscribe('onMarkedKeyChanged', this._onMarkedKeyChangedFn);
            this._model.subscribe('onGroupsExpandChange', this._onGroupsExpandChangeFn);
            this._model.subscribe('onCollectionChange', this._onCollectionChangeFn);
            this._ladder = _private.prepareLadder(this);
            this._setColumns(this._options.columns);
            this._setHeader(this._options.header);
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
            }
            return result;
        },

        _prepareColumns: function(columns) {
            var
                result = [];
            for (var i = 0; i < columns.length; i++) {
                result.push(this._prepareCrossBrowserColumn(columns[i], isNoSupport));
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

        _prepareHeaderColumns: function(columns, multiSelectVisibility) {
            if (multiSelectVisibility) {
                this._headerColumns = [{}].concat(columns);
            } else {
                this._headerColumns = columns;
            }
            this.resetHeaderColumns();
        },

        resetHeaderColumns: function() {
            this._curHeaderColumnIndex = 0;
        },

        isNotFullGridSupport: function() {
            return Env.detection.isNotFullGridSupport;
        },

        isStickyHeader: function() {
           // todo https://online.sbis.ru/opendoc.html?guid=e481560f-ce95-4718-a7c1-c34eb8439c5b
           return this._options.stickyHeader && !this.isNotFullGridSupport();
        },

        getCurrentHeaderColumn: function() {
            var
                columnIndex = this._curHeaderColumnIndex,
                cellClasses = 'controls-Grid__header-cell',
                headerColumn = {
                    column: this._headerColumns[this._curHeaderColumnIndex],
                    index: columnIndex
                };
            if (!stickyUtil.isStickySupport()) {
                cellClasses = cellClasses + ' controls-Grid__header-cell_static';
            }

            // Если включен множественный выбор и рендерится первая колонка с чекбоксом
            if (this._options.multiSelectVisibility !== 'hidden' && columnIndex === 0) {
                cellClasses += ' controls-Grid__header-cell-checkbox';
            } else {
                cellClasses += _private.getPaddingCellClasses({
                    style: this._options.style,
                    columns: this._headerColumns,
                    columnIndex: columnIndex,
                    multiSelectVisibility: this._options.multiSelectVisibility !== 'hidden',
                    itemPadding: this._model.getItemPadding(),
                    isHeader: true,

                    // TODO: удалить isBreadcrumbs после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
                    isBreadCrumbs: headerColumn.column.isBreadCrumbs
                });
            }
            if (headerColumn.column.align) {
                cellClasses += ' controls-Grid__header-cell_halign_' + headerColumn.column.align;
            }
            if (headerColumn.column.valign) {
                cellClasses += ' controls-Grid__header-cell_valign_' + headerColumn.column.valign;
            }
            headerColumn.cellClasses = cellClasses;

            // TODO: удалить isBreadcrumbs после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
            if (headerColumn.column.isBreadCrumbs) {
               headerColumn.style = _private.getColspan(
                  this._options.multiSelectVisibility,
                  columnIndex,
                  Env.detection.isNotFullGridSupport,
                  this._headerColumns.length,
                  true
               );
            }

            // For browsers with partial grid support need to set its grid-row and grid-column
            if (isPartialSupport) {
                headerColumn.gridCellStyles = getCellStyles(0, columnIndex);
            }

            if (headerColumn.column.sortingProperty) {
                headerColumn.sortingDirection = _private.getSortingDirectionByProp(this.getSorting(), headerColumn.column.sortingProperty);
            }

            return headerColumn;
        },

        goToNextHeaderColumn: function() {
            this._curHeaderColumnIndex++;
        },

        isEndHeaderColumn: function() {
            return this._curHeaderColumnIndex < this._headerColumns.length;
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

        getStyleForCustomResultsTemplate: function() {
            return _private.getColspan(
               this._options.multiSelectVisibility,
               0,
               Env.detection.isNotFullGridSupport,
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

            // Если включен множественный выбор и рендерится первая колонка с чекбоксом
            if ((this._options.multiSelectVisibility !== 'hidden') && columnIndex === 0) {
                cellClasses += ' controls-Grid__results-cell-checkbox';
            } else {
                cellClasses += _private.getPaddingCellClasses({
                    style: this._options.style,
                    columns: this._resultsColumns,
                    columnIndex: columnIndex,
                    multiSelectVisibility: this._options.multiSelectVisibility !== 'hidden',
                    itemPadding: this._model.getItemPadding()
                });
            }
            resultsColumn.cellClasses = cellClasses;

            // For browsers with partial grid support need to set its grid-row and grid-column
            if (isPartialSupport) {
                resultsColumn.rowIndex = _private.calcResultsRowIndex(this);
                resultsColumn.gridCellStyles = getCellStyles(resultsColumn.rowIndex, columnIndex);
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

        getItemDataByItem: function(dispItem) {
            var
                self = this,
                stickyColumn = _private.getStickyColumn(this._options),
                current = this._model.getItemDataByItem(dispItem),
                isStickedColumn;

            //TODO: Выпилить в 19.200 или если закрыта -> https://online.sbis.ru/opendoc.html?guid=837b45bc-b1f0-4bd2-96de-faedf56bc2f6
            current.rowSpacing = this._options.rowSpacing;

            current.isFullGridSupport = isFullSupport;
            current.isPartialGridSupport = isPartialSupport;
            current.isNoGridSupport = isNoSupport;

            current.style = this._options.style;
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

            if (isPartialSupport && !current.isGroup) {
                current.rowIndex = _private.calcRowIndexByKey(this, current.key);
            }

            if (this._options.groupingKeyCallback) {
                if (current.item === ControlsConstants.view.hiddenGroup || !current.item.get) {
                    current.groupResultsSpacingClass = ' controls-Grid__cell_spacingLastCol_' + ((current.itemPadding && current.itemPadding.right) || current.rightSpacing || 'default').toLowerCase();

                    // For browsers with partial grid support need to set explicit rows' style with grid-row and grid-column
                    if (isPartialSupport) {
                        current.rowIndex = _private.calcGroupRowIndex(this, current);
                        current.gridGroupStyles = toCssString([
                            {
                                name: 'grid-row',
                                value: current.rowIndex + 1
                            },
                            {
                                name: '-ms-grid-row',
                                value: current.rowIndex + 1
                            }
                        ]);
                    }

                    return current;
                }
            }

            current.isFirstInGroup = !current.isGroup && _private.isFirstInGroup(this, current);

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
            
            if (current.isEditing && isPartialSupport) {
                current.editingRowStyles = _private.getEditingRowStyles(self, current.index);
            }

            current.getCurrentColumnKey = function() {
                return self._columnsVersion + '_' +
                    (self._options.multiSelectVisibility === 'hidden' ? current.columnIndex : current.columnIndex - 1);
            };

            current.getCurrentColumn = function() {
                var
                    currentColumn = {
                        item: current.item,
                        style: current.style,
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
                if (isPartialSupport) {
                    currentColumn.gridCellStyles = getCellStyles(current.rowIndex, currentColumn.columnIndex);
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

        _setEditingItemData: function(itemData) {
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
                version = this._model._calcItemVersion(item, key),
                lastItemKey = ItemsUtil.getPropertyValue(this.getLastItem(), this._options.keyProperty);

            if (lastItemKey === key) {
                version = 'LAST_ITEM_' + version;
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
            return isFullSupport;
        },

        isPartialGridSupport: function():boolean{
            return isPartialSupport;
        },

        isNoGridSupport: function():boolean{
            return isNoSupport;
        },

        getEditingRowStyles: function (gridCells: Array<HTMLElement>, rowIndex): string {
            let
                column,
                columnsWidths: Array<string|number> = [];

            for (let i = 0; i<this._columns.length; i++) {
                column = this._columns[i];

                // Если отрисовано больше одной записи, то необходимо руками считать ширину, т.к. редактируемая строка
                // это сабгрид и ширина колонок у этой строки будет считаться относительно ее содержимого, а не всей таблицы.
                if (column.width && column.width === 'auto' && this.getCount() > 1) {

                    let referenceRowIndex = rowIndex !== 0 ? 0 : 1;
                    columnsWidths.push(gridCells[referenceRowIndex].getBoundingClientRect().width);
                } else {
                    columnsWidths.push(column.width || '1fr');
                }
            }

            return getTemplateColumnsStyle(columnsWidths);
        },

        // Only for browsers with partial grid support. Explicit grid styles with grid row and grid column
        setCurrentColumnsWidth: function (cells: Array<HTMLElement>): void {
            for (let i = 0; i< this._columns.length; i++){
                this._columns[i].realWidth = cells[i].getBoundingClientRect().width + 'px';
            }
        },

        // Only for browsers with partial grid support. Explicit grid styles with grid row and grid column
        getEmptyTemplateStyles() {
            return _private.getEmptyTemplateStyles(this);
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
