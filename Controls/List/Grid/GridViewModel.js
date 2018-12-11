define('Controls/List/Grid/GridViewModel', [
   'Controls/List/BaseViewModel',
   'Controls/List/ListViewModel',
   'Controls/Constants',
   'Core/core-clone',
   'Core/detection'
], function(BaseViewModel, ListViewModel, ControlsConstants, cClone, cDetection) {
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
                  if (rowIndex === rowCount - 1) {
                     result += ' controls-Grid__row-cell_lastRow';
                     result += ' controls-Grid__row-cell_withRowSeparator_lastRow';
                  }
                  result += ' controls-Grid__row-cell_withRowSeparator';
               }
            } else {
               result += ' controls-Grid__row-cell_withoutRowSeparator';
            }
            return result;
         },

         getItemColumnCellClasses: function(current) {
            var
               cellClasses = 'controls-Grid__row-cell' + (current.isEditing ? ' controls-Grid__row-cell-background-editing' : ' controls-Grid__row-cell-background-hover');

            cellClasses += _private.prepareRowSeparatorClasses(current.showRowSeparator, current.index, current.dispItem.getOwner().getCount());

            // Если включен множественный выбор и рендерится первая колонка с чекбоксом
            if (current.multiSelectVisibility && current.columnIndex === 0) {
               cellClasses += ' controls-Grid__row-cell-checkbox';
            } else {
               cellClasses += _private.getPaddingCellClasses({
                  columns: current.columns,
                  style: current.style,
                  columnIndex: current.columnIndex,
                  multiSelectVisibility: current.multiSelectVisibility,
                  leftPadding: current.leftPadding,
                  rightPadding: current.rightPadding,
                  rowSpacing: current.rowSpacing
               });
            }

            cellClasses += ' controls-Grid__row-cell_rowSpacing_default';

            if (current.isSelected) {
               cellClasses += ' controls-Grid__row-cell_selected' + ' controls-Grid__row-cell_selected-' + (current.style || 'default');
               if (current.columnIndex === current.getLastColumnIndex()) {
                  cellClasses += ' controls-Grid__row-cell_selected__last' + ' controls-Grid__row-cell_selected__last-' + (current.style || 'default');
               }
            }

            return cellClasses;
         },
         processLadder: function(self, current) {
            var
               ladderField = self._options.stickyFields[0],
               nextItem,
               nextLadderValue;

            // если рисуем первый элемент
            if (current.index === 0) {
               self._ladder.ladderValue = current.getPropValue(current.item, ladderField);
            }

            if (self._drawLadder) {
               self._withLadder = false;
               self._drawLadder = false;
               self._ladder.currentColumn = null;
               self._ladder.rowIndex = null;
               self._ladder.columnIndex = null;
               self._ladder.ladderLength = null;
            }

            if (self.isLast()) {
               if (self._ladder.ladderLength > 1) {
                  self._drawLadder = true;
               }
               return;
            }
            nextItem = self.getNext();

            // смотрим на следующий item
            nextLadderValue = nextItem.getPropValue(nextItem.item, ladderField);

            // если лесенка у следующего item такая же, то увеличиваем длинну лесенки, запоминаем current и rowIndex
            if (self._ladder.ladderValue === nextLadderValue) {
               self._withLadder = true;

               // запоминаем только если ранее не запоминали
               if (!self._ladder.currentColumn) {
                  self._ladder.currentColumn = current.getCurrentColumn();
                  self._ladder.rowIndex = current.index;
                  self._ladder.columnIndex = 0;
                  self._ladder.ladderLength = 1;
               }
               self._ladder.ladderLength++;
            } else {
               if (self._ladder.ladderLength > 1) {
                  self._drawLadder = true;
               }
               self._ladder.ladderValue = nextLadderValue;
            }
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

         _withLadder: false,
         _drawLadder: false,
         _ladder: {
            ladderValue: null,
            currentColumn: null,
            rowIndex: null,
            columnIndex: null,
            ladderLength: null
         },

         constructor: function(cfg) {
            var
               self = this;
            this._options = cfg;
            GridViewModel.superclass.constructor.apply(this, arguments);
            this._model = this._createModel(cfg);
            this._model.subscribe('onListChange', function() {
               self._nextVersion();
               self._notify('onListChange');
            });
            this._model.subscribe('onMarkedKeyChanged', function(event, key) {
               self._notify('onMarkedKeyChanged', key);
            });
            this._model.subscribe('onGroupsExpandChange', function(event, changes) {
               self._notify('onGroupsExpandChange', changes);
            });
            this._columns = this._prepareColumns(this._options.columns);
            this._prepareHeaderColumns(this._options.header, this._options.multiSelectVisibility !== 'hidden');
            this._prepareResultsColumns(this._columns, this._options.multiSelectVisibility !== 'hidden');
            this._prepareColgroupColumns(this._columns, this._options.multiSelectVisibility !== 'hidden');
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
            return this._options.header;
         },

         setHeader: function(columns) {
            this._options.header = columns;
            this._prepareHeaderColumns(this._options.header, this._options.multiSelectVisibility !== 'hidden');
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
            this._prepareHeaderColumns(this._options.header, hasMultiSelect);
            this._prepareResultsColumns(this._columns, hasMultiSelect);
         },

         getItemById: function(id, keyProperty) {
            return this._model.getItemById(id, keyProperty);
         },

         setMarkedKey: function(key) {
            this._model.setMarkedKey(key);
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
               current = this._model.getItemDataByItem(dispItem);
            current.leftPadding = this._options.leftPadding;
            current.rightPadding = this._options.rightPadding;
            current.rowSpacing = this._options.rowSpacing;
            current.isNotFullGridSupport = cDetection.isNotFullGridSupport;
            current.style = this._options.style;


            if (current.multiSelectVisibility) {
               current.columns = [{}].concat(this._columns);
            } else {
               current.columns = this._columns;
            }

            if (this._options.groupMethod) {
               if (current.item === ControlsConstants.view.hiddenGroup || !current.item.get) {
                  current.groupResultsSpacingClass = ' controls-Grid__cell_spacingLastCol_' + (current.rightPadding || 'default');
                  return current;
               }
            }

            current.showRowSeparator = this._options.showRowSeparator;
            current.ladderSupport = !!this._options.stickyFields;

            current.columnIndex = 0;
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
               currentColumn.cellClasses = _private.getItemColumnCellClasses(current);
               currentColumn.column = current.columns[current.columnIndex];
               currentColumn.template = currentColumn.column.template ? currentColumn.column.template : self._columnTemplate;
               if (current.ladderSupport) {
                  if (self._withLadder && self._ladder.columnIndex === currentColumn.columnIndex) {
                     currentColumn.withLadder = true;
                  }
                  currentColumn.cellStyleForLadder = 'grid-area: ' +
                     +(current.index + 1) + ' / ' +
                     (currentColumn.columnIndex + 1) + ' / ' +
                     'span 1 / ' +
                     'span 1;';
               }
               return currentColumn;
            };

            if (current.ladderSupport) {
               _private.processLadder(this, current);
               if (this._drawLadder) {
                  current.ladder = this._ladder;
                  current.ladder.style = 'grid-area: ' +
                     (current.ladder.rowIndex + 1) + ' / ' +
                     (current.ladder.columnIndex + 1) + ' / ' +
                     'span ' + current.ladder.ladderLength + ' / ' +
                     'span 1;';
               }
            }
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

         getDragTargetPosition: function() {
            return this._model.getDragTargetPosition();
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

         setDragTargetItem: function(itemData) {
            this._model.setDragTargetItem(itemData);
         },

         getDragTargetItem: function() {
            return this._model.getDragTargetItem();
         },

         setDragItems: function(items, itemData) {
            this._model.setDragItems(items, itemData);
         },

         getActiveItem: function() {
            return this._model.getActiveItem();
         },

         destroy: function() {
            this._model.destroy();
            GridViewModel.superclass.destroy.apply(this, arguments);
         }
      });

   GridViewModel._private = _private;

   return GridViewModel;
});
