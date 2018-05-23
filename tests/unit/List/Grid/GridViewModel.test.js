define(['Controls/List/Grid/GridViewModel', 'WS.Data/Collection/RecordSet'], function(GridViewModel) {
   var
      gridData = [
         {
            'id': '123',
            'title': 'Хлеб',
            'price': 50,
            'balance': 15
         },
         {
            'id': '234',
            'title': 'Сыр',
            'price': 150,
            'balance': 3
         },
         {
            'id': '345',
            'title': 'Масло',
            'price': 100,
            'balance': 5
         },
         {
            'id': '456',
            'title': 'Помидор',
            'price': 75,
            'balance': 7
         },
         {
            'id': '567',
            'title': 'Капуста китайская',
            'price': 35,
            'balance': 2
         }
      ],
      gridColumns = [
         {
            displayProperty: 'title',
            width: '1fr'
         },
         {
            displayProperty: 'price',
            width: 'auto',
            align: 'right'
         },
         {
            displayProperty: 'balance',
            width: 'auto',
            align: 'right'
         }
      ],
      gridHeader = [
         {
            title: ''
         },
         {
            title: 'Цена',
            align: 'right'
         },
         {
            title: 'Остаток',
            align: 'right'
         }
      ],
      itemActions = [];

   describe('Controls.List.Grid.GridViewModel', function() {
      describe('getCurrent', function() {
         var
            cfg = {
               keyProperty: 'id',
               displayProperty: 'title',
               markedKey: '123',
               multiselect: true,
               header: gridHeader,
               columns: gridColumns,
               items: gridData,
               itemActions: itemActions,
               ladderSupport: false,
               leftPadding: 'XL',
               rightPadding: 'L',
               rowSpacing: 'L',
               showRowSeparator: true
            },
            gridViewModel = new GridViewModel(cfg),
            current = gridViewModel.getCurrent();

         it('configuration', function() {
            assert.equal(cfg.keyProperty, current.keyProperty, 'Incorrect value "current.keyProperty".');
            assert.equal(cfg.displayProperty, current.displayProperty, 'Incorrect value "current.displayProperty".');
            assert.isTrue(current.multiselect, 'Incorrect value "current.multiselect".');
            assert.deepEqual([{}].concat(gridColumns), current.columns, 'Incorrect value "current.columns".');
            // TODO: Turn on after support itemActions in the grid
            // assert.equal(itemActions, current.itemActions, 'Incorrect value "current.".');
            assert.isFalse(current.ladderSupport, 'Incorrect value "current.ladderSupport".');
            assert.equal('XL', current.leftPadding, 'Incorrect value "current.leftPadding".');
            assert.equal('L', current.rightPadding, 'Incorrect value "current.rightPadding".');
            assert.equal('L', current.rowSpacing, 'Incorrect value "current.rowSpacing".');
            assert.isTrue(current.showRowSeparator, 'Incorrect value "current.showRowSeparator".');
         });

         it('item', function() {
            assert.equal(gridData[0][cfg.keyProperty], current.key, 'Incorrect value "current.keyProperty".');
            assert.equal(0, current.index, 'Incorrect value "current.index".');
            assert.deepEqual(gridData[0], current.item, 'Incorrect value "current.item".');
            assert.deepEqual(gridData[0], current.dispItem.getContents(), 'Incorrect value "current.dispItem".');
            assert.equal(gridData[0][cfg.displayProperty], current.getPropValue(current.item, cfg.displayProperty), 'Incorrect value "current.displayProperty".');
         });

         it('state', function() {
            assert.isTrue(current.isSelected, 'Incorrect value "current.isSelected".');
            assert.equal(undefined, current.isActive, 'Incorrect value "current.isActive".');
            assert.equal(0, current.multiSelectStatus, 'Incorrect value "current.multiSelectStatus".');
            assert.isFalse(current.multiSelectVisibility, 'Incorrect value "current.multiSelectVisibility".');
            assert.isTrue(current.showActions, 'Incorrect value "current.showActions".');
            assert.equal(undefined, current.isSwiped, 'Incorrect value "current.isSwiped".');
         });

         it('columns', function() {
            function checkBaseProperties(checkedColumn, expectedData) {
               assert.equal(expectedData.columnIndex, checkedColumn.columnIndex, 'Incorrect value "columnIndex" when checking columns.');
               assert.deepEqual(expectedData.column, checkedColumn.column, 'Incorrect value "column" when checking columns.');
               assert.deepEqual(expectedData.item, checkedColumn.item, 'Incorrect value "item" when checking columns.');
               assert.deepEqual(expectedData.item, checkedColumn.dispItem.getContents(), 'Incorrect value "dispItem" when checking columns.');
               assert.equal(expectedData.keyProperty, checkedColumn.keyProperty, 'Incorrect value "keyProperty" when checking columns.');
               assert.equal(expectedData.displayProperty, checkedColumn.displayProperty, 'Incorrect value "displayProperty" when checking columns.');
               assert.equal(expectedData.item[expectedData.keyProperty], checkedColumn.key, 'Incorrect value "getPropValue(item, displayProperty)" when checking columns.');
               assert.equal(expectedData.item[expectedData.displayProperty],
                  checkedColumn.getPropValue(checkedColumn.item, expectedData.displayProperty), 'Incorrect value "" when checking columns.');
               assert.equal(expectedData.template, checkedColumn.template, 'Incorrect value "template" when checking columns.');
               assert.equal(expectedData.cellClasses, checkedColumn.cellClasses, 'Incorrect value "cellClasses" when checking columns.');
            }

            // check first column (multiselect checkbox column)
            assert.equal(0, current.columnIndex, 'Incorrect value "current.columnIndex".');
            assert.isTrue(current.isEndColumn(), 'Incorrect value "current.isEndColumn()".');
            checkBaseProperties(current.getCurrentColumn(), {
               columnIndex: 0,
               keyProperty: cfg.keyProperty,
               displayProperty: cfg.displayProperty,
               column: {},
               item: gridData[0],
               template: null,
               cellClasses: 'controls-Grid__row-cell controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow ' +
                  'controls-Grid__row-cell-checkbox controls-Grid__row-cell_rowSpacing_default controls-Grid__row-cell_withSelectionMarker'
            });

            // check next column
            current.goToNextColumn();
            assert.equal(1, current.columnIndex, 'Incorrect value "current.columnIndex" after "goToNextColumn()".');
            assert.isTrue(current.isEndColumn(), 'Incorrect value "current.isEndColumn()" after "goToNextColumn()".');
            checkBaseProperties(current.getCurrentColumn(), {
               columnIndex: 1,
               keyProperty: cfg.keyProperty,
               displayProperty: cfg.displayProperty,
               column: gridColumns[0],
               item: gridData[0],
               template: null,
               cellClasses: 'controls-Grid__row-cell controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow ' +
                  'controls-Grid__cell_spacingRight controls-Grid__row-cell_rowSpacing_L controls-Grid__row-cell_rowSpacing_default'
            });

            // check next column
            current.goToNextColumn();
            assert.equal(2, current.columnIndex, 'Incorrect value "current.columnIndex" after "goToNextColumn()".');
            assert.isTrue(current.isEndColumn(), 'Incorrect value "current.isEndColumn()" after "goToNextColumn()".');
            checkBaseProperties(current.getCurrentColumn(), {
               columnIndex: 2,
               keyProperty: cfg.keyProperty,
               displayProperty: cfg.displayProperty,
               column: gridColumns[1],
               item: gridData[0],
               template: null,
               cellClasses: 'controls-Grid__row-cell controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow ' +
                  'controls-Grid__cell_spacingLeft controls-Grid__cell_spacingRight controls-Grid__row-cell_rowSpacing_L ' +
                  'controls-Grid__row-cell_halign_right controls-Grid__row-cell_rowSpacing_default'
            });

            // check last column
            current.goToNextColumn();
            assert.equal(3, current.columnIndex, 'Incorrect value "current.columnIndex" after "goToNextColumn()".');
            assert.isTrue(current.isEndColumn(), 'Incorrect value "current.isEndColumn()" after "goToNextColumn()".');
            checkBaseProperties(current.getCurrentColumn(), {
               columnIndex: 3,
               keyProperty: cfg.keyProperty,
               displayProperty: cfg.displayProperty,
               column: gridColumns[2],
               item: gridData[0],
               template: null,
               cellClasses: 'controls-Grid__row-cell controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow ' +
                  'controls-Grid__cell_spacingLeft controls-Grid__cell_spacingLastCol_L controls-Grid__row-cell_rowSpacing_L ' +
                  'controls-Grid__row-cell_halign_right controls-Grid__row-cell_rowSpacing_default'
            });

            // check the absence of other columns
            current.goToNextColumn();
            assert.equal(4, current.columnIndex, 'Incorrect value "current.columnIndex" after "goToNextColumn()".');
            assert.isFalse(current.isEndColumn(), 'Incorrect value "current.isEndColumn()" after "goToNextColumn()".');

            // check reset column index and retest first column
            current.resetColumnIndex();

            assert.equal(0, current.columnIndex, 'Incorrect value "current.columnIndex" after "resetColumnIndex()".');
            assert.isTrue(current.isEndColumn(), 'Incorrect value "current.isEndColumn()" after "resetColumnIndex()".');
            checkBaseProperties(current.getCurrentColumn(), {
               columnIndex: 0,
               keyProperty: cfg.keyProperty,
               displayProperty: cfg.displayProperty,
               column: {},
               item: gridData[0],
               template: null,
               cellClasses: 'controls-Grid__row-cell controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow ' +
                  'controls-Grid__row-cell-checkbox controls-Grid__row-cell_rowSpacing_default controls-Grid__row-cell_withSelectionMarker'
            });
         });
      });
   });
});
