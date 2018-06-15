define('Controls/List/Grid/GridViewModel', [
   'Controls/List/BaseViewModel',
   'Controls/List/ListViewModel',
   'Core/detection',
   'Core/core-clone'
], function(BaseViewModel, ListViewModel, cDetection, cClone) {

   'use strict';

   var
      _private = {
         getPaddingCellClasses: function(params) {
            var
               preparedClasses = '';

            // Колонки
            if (params.multiSelectVisibility ? params.columnIndex > 1 :  params.columnIndex > 0) {
               preparedClasses += ' controls-Grid__cell_spacingLeft';
            }
            if (params.columnIndex < params.columns.length - 1) {
               preparedClasses += ' controls-Grid__cell_spacingRight';
            }

            // Отступ для первой колонки. Если режим мультиселект, то отступ обеспечивается чекбоксом.
            if (params.columnIndex === 0 && !params.multiSelectVisibility) {
               preparedClasses += ' controls-Grid__cell_spacingFirstCol_' + (params.leftPadding || 'default');
            }

            // Отступ для последней колонки
            if (params.columnIndex === params.columns.length - 1) {
               preparedClasses += ' controls-Grid__cell_spacingLastCol_' + (params.rightPadding || 'default');
            }

            // Межстрочный интервал
            preparedClasses += ' controls-Grid__row-cell_rowSpacing_' + (params.rowSpacing || 'default');

            // Горизонтальное выравнивание колонок
            if (params.columns[params.columnIndex].align) {
               preparedClasses += ' controls-Grid__row-cell_halign_' + params.columns[params.columnIndex].align;
            }

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
               }
               result += ' controls-Grid__row-cell_withRowSeparator';
            } else {
               result += ' controls-Grid__row-cell_withoutRowSeparator';
            }
            return result;
         },

         getItemColumnCellClasses: function(current) {
            var
               cellClasses = 'controls-Grid__row-cell';

            cellClasses += _private.prepareRowSeparatorClasses(current.showRowSeparator, current.index, current.dispItem.getOwner().getCount() - 1);

            // Если включен множественный выбор и рендерится первая колонка с чекбоксом
            if (current.multiSelectVisibility && current.columnIndex === 0) {
               cellClasses += ' controls-Grid__row-cell-checkbox';
            } else {
               cellClasses += _private.getPaddingCellClasses({
                  columns: current.columns,
                  columnIndex: current.columnIndex,
                  multiSelectVisibility: current.multiSelectVisibility,
                  leftPadding: current.leftPadding,
                  rightPadding: current.rightPadding,
                  rowSpacing: current.rowSpacing
               });
            }

            cellClasses += ' controls-Grid__row-cell_rowSpacing_default';

            if (current.isSelected) {
               if (current.columnIndex === 0) {
                  cellClasses += ' controls-Grid__row-cell_withSelectionMarker';
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
            this._columns = this._prepareColumns(this._options.columns);
            this._prepareHeaderColumns(this._options.header, this._options.multiSelectVisibility === 'visible');
            this._prepareResultsColumns(this._columns, this._options.multiSelectVisibility === 'visible');
            this._prepareColgroupColumns(this._columns, this._options.multiSelectVisibility === 'visible');
         },

         _prepareCrossBrowserColumn: function(column, isNotFullGridSupport) {
            var
               result = cClone(column);
            if (isNotFullGridSupport) {
               if (result.width === '1fr') {
                  result.width = 'auto';
               } else if (result.width === 'auto') {
                  result.width = '1px';
               }
            }
            return result;
         },

         _prepareColumns: function(columns) {
            var
               result = [];
            for (var i = 0; i < columns.length; i++) {
               result.push(this._prepareCrossBrowserColumn(columns[i]));
            }
            return result;
         },

         _createModel: function(cfg) {
            return new ListViewModel({
               items: cfg.items,
               keyProperty: cfg.keyProperty,
               displayProperty: cfg.displayProperty,
               markedKey: cfg.markedKey,
               selectedKeys: cfg.selectedKeys,
               excludedKeys: cfg.excludedKeys,
               multiSelectVisibility: cfg.multiSelectVisibility
            });
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
            this._prepareHeaderColumns(this._options.header, this._options.multiSelectVisibility === 'visible');
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
               cellClasses = 'controls-Grid__header-cell';

            // Если включен множественный выбор и рендерится первая колонка с чекбоксом
            if (this._options.multiSelectVisibility && columnIndex === 0) {
               cellClasses += ' controls-Grid__header-cell-checkbox';
            } else {
               cellClasses += _private.getPaddingCellClasses({
                  columns: this._headerColumns,
                  columnIndex: columnIndex,
                  multiSelectVisibility: this._options.multiSelectVisibility === 'visible',
                  leftPadding: this._options.leftPadding,
                  rightPadding: this._options.rightPadding,
                  rowSpacing: this._options.rowSpacing
               });
            }

            return {
               column: this._headerColumns[this._curHeaderColumnIndex],
               cellClasses: cellClasses,
               index: columnIndex
            };
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
            if (this._options.multiSelectVisibility === 'visible' && columnIndex === 0) {
               cellClasses += ' controls-Grid__results-cell-checkbox';
            } else {
               cellClasses += _private.getPaddingCellClasses({
                  columns: this._resultsColumns,
                  columnIndex: columnIndex,
                  multiSelectVisibility: this._options.multiSelectVisibility === 'visible',
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
            return this._options.multiSelectVisibility;
         },

         setMultiSelectVisibility: function(multiSelectVisibility) {
            this._options.multiSelectVisibility = multiSelectVisibility;
            this._prepareHeaderColumns(this._options.header, this._options.multiSelectVisibility);
            this._prepareResultsColumns(this._columns, this._options.multiSelectVisibility);
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

         getCurrent: function() {
            var
               self = this,
               current = this._model.getCurrent();
            current.leftPadding = this._options.leftPadding;
            current.rightPadding = this._options.rightPadding;
            current.rowSpacing = this._options.rowSpacing;
            current.showRowSeparator = this._options.showRowSeparator;
            current.ladderSupport = !!this._options.stickyFields;

            if (current.multiSelectVisibility) {
               current.columns = [{}].concat(this._columns);
            } else {
               current.columns = this._columns;
            }
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
                     dispItem: current.dispItem,
                     keyProperty: current.keyProperty,
                     displayProperty: current.displayProperty,
                     index: current.index,
                     key: current.key,
                     getPropValue: current.getPropValue
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

         appendItems: function(items) {
            this._model.appendItems(items);
         },

         prependItems: function(items) {
            this._model.prependItems(items);
         },

         setItemActions: function(item, actions) {
            this._model.setItemActions(item, actions);
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

         select: function(keys) {
            this._model.select(keys);
         },

         unselect: function(keys) {
            this._model.unselect(keys);
         },

         destroy: function() {
            this._model.destroy();
            GridViewModel.superclass.destroy.apply(this, arguments);
         }
      });

   GridViewModel._private = _private;

   return GridViewModel;
});
