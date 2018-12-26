define('Controls/List/Grid/GridViewModel', [
   'Controls/List/BaseViewModel',
   'Controls/List/ListViewModel',
   'wml!Controls/List/Grid/LadderWrapper',
   'Controls/Constants',
   'Core/core-clone',
   'Core/detection'
], function(BaseViewModel, ListViewModel, LadderWrapper, ControlsConstants, cClone, cDetection) {
   'use strict';

   var
      _private = {
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
               preparedClasses += ' controls-Grid__cell_spacingFirstCol_' + (params.leftPadding || 'default');
            }

            // Стиль колонки
            preparedClasses += ' controls-Grid__cell_' + (params.style || 'default');

            // Отступ для последней колонки
            if (params.columnIndex === params.columns.length - 1) {
               preparedClasses += ' controls-Grid__cell_spacingLastCol_' + (params.rightPadding || 'default');
            }

            // Межстрочный интервал
            preparedClasses += ' controls-Grid__row-cell_rowSpacing_' + (params.rowSpacing || 'default');

            // Вертикальное выравнивание хедера
            if (params.columns[params.columnIndex].valign) {
               preparedClasses += ' controls-Grid__header-cell_valign_' + params.columns[params.columnIndex].valign;
            }
            return preparedClasses;
         },

         prepareRowSeparatorClasses: function(showRowSeparator, rowIndex, rowCount) {
            var
               result = '';
            if (showRowSeparator) {
               if (rowIndex === 0) {
                  result += ' controls-Grid__row-cell_firstRow';
                  result += ' controls-Grid__row-cell_withRowSeparator_firstRow';
               } else {
                  result += ' controls-Grid__row-cell_withRowSeparator';
               }
               if (rowIndex === rowCount - 1) {
                  result += ' controls-Grid__row-cell_lastRow';
                  result += ' controls-Grid__row-cell_withRowSeparator_lastRow';
               }
            } else {
               result += ' controls-Grid__row-cell_withoutRowSeparator';
            }
            return result;
         },

         getItemColumnCellClasses: function(current, columnIndex) {
            var
               cellClasses = 'controls-Grid__row-cell' + (current.isEditing ? ' controls-Grid__row-cell-background-editing' : ' controls-Grid__row-cell-background-hover');

            cellClasses += _private.prepareRowSeparatorClasses(current.showRowSeparator, current.index, current.dispItem.getOwner().getCount());

            // Если включен множественный выбор и рендерится первая колонка с чекбоксом
            if (current.multiSelectVisibility !== 'hidden' && current.columnIndex === 0) {
               cellClasses += ' controls-Grid__row-cell-checkbox';
            } else {
               cellClasses += _private.getPaddingCellClasses({
                  columns: current.columns,
                  style: current.style,
                  columnIndex: current.columnIndex,
                  multiSelectVisibility: current.multiSelectVisibility !== 'hidden',
                  leftPadding: current.leftPadding,
                  rightPadding: current.rightPadding,
                  rowSpacing: current.rowSpacing
               });
            }

            cellClasses += ' controls-Grid__row-cell_rowSpacing_default';

            if (current.isSelected) {
               cellClasses += ' controls-Grid__row-cell_selected' + ' controls-Grid__row-cell_selected-' + (current.style || 'default');
               if (current.columnIndex === 0) {
                  cellClasses += ' controls-Grid__row-cell_selected__first' + ' controls-Grid__row-cell_selected__first-' + (current.style || 'default');
               }
               if (current.columnIndex === current.getLastColumnIndex()) {
                  cellClasses += ' controls-Grid__row-cell_selected__last' + ' controls-Grid__row-cell_selected__last-' + (current.style || 'default');
               }
            }

            return cellClasses;
         },
         prepareLadder: function(self) {
            var
               fIdx, idx, item, prevItem,
               ladderProperties = self._options.ladderProperties,
               stickyColumn = self._options.stickyColumn,
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
               if (value === prevValue) {
                  state.ladderLength++;
               } else {
                  params.ladder.ladderLength = state.ladderLength;
                  state.ladderLength = 1;
               }
            }

            function processStickyLadder(params) {
               processLadder(params);
               if (params.ladder.ladderLength && params.ladder.ladderLength > 1 && !cDetection.isNotFullGridSupport) {
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
                        value: item.get(ladderProperties[fIdx]),
                        prevValue: prevItem ? prevItem.get(ladderProperties[fIdx]) : undefined,
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

         constructor: function(cfg) {
            var
               self = this;
            this._options = cfg;
            GridViewModel.superclass.constructor.apply(this, arguments);
            this._model = this._createModel(cfg);
            this._model.subscribe('onListChange', function() {
               self._ladder = _private.prepareLadder(self);
               self._nextVersion();
               self._notify('onListChange');
            });
            this._model.subscribe('onMarkedKeyChanged', function(event, key) {
               self._notify('onMarkedKeyChanged', key);
            });
            this._model.subscribe('onGroupsExpandChange', function(event, changes) {
               self._notify('onGroupsExpandChange', changes);
            });
            this._ladder = _private.prepareLadder(this);
            this.setColumns(this._options.columns);
            this.setHeader(this._options.header);
         },

         _prepareCrossBrowserColumn: function(column, isNotFullGridSupport) {
            var
               result = cClone(column);
            if (isNotFullGridSupport) {
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
               result.push(this._prepareCrossBrowserColumn(columns[i], cDetection.isNotFullGridSupport));
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

         setHeader: function(columns) {
            this._header = columns;
            this._prepareHeaderColumns(this._header, this._options.multiSelectVisibility !== 'hidden');
            this._nextVersion();
            this._notify('onListChange');
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
            return cDetection.isNotFullGridSupport;
         },

         isStickyHeader: function() {
            return this._options.stickyHeader;
         },

         getCurrentHeaderColumn: function() {
            var
               columnIndex = this._curHeaderColumnIndex,
               cellClasses = 'controls-Grid__header-cell',
               headerColumn = {
                  column: this._headerColumns[this._curHeaderColumnIndex],
                  index: columnIndex
               };

            // Если включен множественный выбор и рендерится первая колонка с чекбоксом
            if (this._options.multiSelectVisibility !== 'hidden' && columnIndex === 0) {
               cellClasses += ' controls-Grid__header-cell-checkbox';
            } else {
               cellClasses += _private.getPaddingCellClasses({
                  style: this._options.style,
                  columns: this._headerColumns,
                  columnIndex: columnIndex,
                  multiSelectVisibility: this._options.multiSelectVisibility !== 'hidden',
                  leftPadding: this._options.leftPadding,
                  rightPadding: this._options.rightPadding,
                  rowSpacing: this._options.rowSpacing
               });
            }
            if (headerColumn.column.align) {
               cellClasses += ' controls-Grid__header-cell_halign_' + headerColumn.column.align;
            }
            headerColumn.cellClasses = cellClasses;

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

         getResults: function() {
            return this._options.results;
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
               cellClasses = 'controls-Grid__results-cell';

            // Если включен множественный выбор и рендерится первая колонка с чекбоксом
            if ((this._options.multiSelectVisibility !== 'hidden') && columnIndex === 0) {
               cellClasses += ' controls-Grid__results-cell-checkbox';
            } else {
               cellClasses += _private.getPaddingCellClasses({
                  style: this._options.style,
                  columns: this._resultsColumns,
                  columnIndex: columnIndex,
                  multiSelectVisibility: this._options.multiSelectVisibility !== 'hidden',
                  leftPadding: this._options.leftPadding,
                  rightPadding: this._options.rightPadding,
                  rowSpacing: this._options.rowSpacing
               });
            }

            return {
               column: this._resultsColumns[columnIndex],
               cellClasses: cellClasses,
               index: columnIndex
            };
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

         setColumns: function(columns) {
            this._columns = this._prepareColumns(columns);
            this._ladder = _private.prepareLadder(this);
            this._prepareResultsColumns(this._columns, this._options.multiSelectVisibility !== 'hidden');
            this._prepareColgroupColumns(this._columns, this._options.multiSelectVisibility !== 'hidden');
            this._nextVersion();
            this._notify('onListChange');
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

         getMarkedKey: function() {
            return this._model.getMarkedKey();
         },
         getFirstItemKey: function() {
            return this._model.getFirstItemKey.apply(this._model, arguments);
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

         getPreviousItemKey: function() {
            return this._model.getPreviousItemKey.apply(this._model, arguments);
         },

         setSorting: function(sorting) {
            this._model.setSorting(sorting);
         },

         getSorting: function() {
            return this._model.getSorting();
         },

         getSwipeItem: function() {
            return this._model.getSwipeItem();
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
               stickyColumn = this._options.stickyColumn,
               current = this._model.getItemDataByItem(dispItem),
               isStickedColumn;
            current.leftPadding = this._options.leftPadding;
            current.rightPadding = this._options.rightPadding;
            current.rowSpacing = this._options.rowSpacing;
            current.isNotFullGridSupport = cDetection.isNotFullGridSupport;
            current.style = this._options.style;

            if (current.multiSelectVisibility !== 'hidden') {
               current.columns = [{}].concat(this._columns);
            } else {
               current.columns = this._columns;
            }

            if (stickyColumn && !cDetection.isNotFullGridSupport) {
               current.styleLadderHeading = self._ladder.stickyLadder[current.index].headingStyle;
               current.stickyColumnIndex = stickyColumn.index;
            }

            if (this._options.groupMethod) {
               if (current.item === ControlsConstants.view.hiddenGroup || !current.item.get) {
                  current.groupResultsSpacingClass = ' controls-Grid__cell_spacingLastCol_' + (current.rightPadding || 'default');
                  return current;
               }
            }

            current.showRowSeparator = this._options.showRowSeparator;

            current.columnIndex = 0;

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
            current.getCurrentColumn = function() {
               var
                  currentColumn = {
                     item: current.item,
                     style: current.style,
                     dispItem: current.dispItem,
                     keyProperty: current.keyProperty,
                     displayProperty: current.displayProperty,
                     index: current.index,
                     key: current.key,
                     getPropValue: current.getPropValue,
                     isEditing: current.isEditing
                  };
               currentColumn.columnIndex = current.columnIndex;
               currentColumn.cellClasses = current.getItemColumnCellClasses(current, currentColumn.columnIndex);
               currentColumn.column = current.columns[current.columnIndex];
               currentColumn.template = currentColumn.column.template ? currentColumn.column.template : self._columnTemplate;
               if (self._options.ladderProperties && self._options.ladderProperties.length) {
                  currentColumn.ladder = self._ladder.ladder[current.index];
                  currentColumn.ladderWrapper = LadderWrapper;
               }
               if (stickyColumn) {
                  isStickedColumn = stickyColumn.index === (current.multiSelectVisibility ? currentColumn.columnIndex + 1 : currentColumn.columnIndex);
                  if (cDetection.isNotFullGridSupport) {
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

         updateIndexes: function(startIndex, stopIndex) {
            this._model.updateIndexes(startIndex, stopIndex);
         },

         setItems: function(items) {
            this._model.setItems(items);
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

         _setEditingItemData: function(itemData) {
            this._model._setEditingItemData(itemData);
            this._nextVersion();
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

         updateSelection: function(selectedKeys) {
            this._model.updateSelection(selectedKeys);
            this._nextVersion();
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

         destroy: function() {
            this._model.destroy();
            GridViewModel.superclass.destroy.apply(this, arguments);
         }
      });

   GridViewModel._private = _private;

   return GridViewModel;
});
