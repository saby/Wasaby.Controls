define(['Controls/List/Grid/GridViewModel', 'Controls/List/resources/utils/ItemsUtil', 'WS.Data/Collection/RecordSet'], function(GridViewModel, ItemsUtil, RecordSet) {
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
            assert.equal(cfg.keyProperty, current.keyProperty, 'Incorrect property value on getCurrent()');
            assert.equal(cfg.displayProperty, current.displayProperty, 'Incorrect property value on getCurrent()');
            assert.isTrue(current.multiselect, 'Incorrect property value on getCurrent()');
            assert.deepEqual([{}].concat(gridColumns), current.columns, 'Incorrect property value on getCurrent()');
            // TODO: Turn on after support itemActions in the grid
            // assert.equal(itemActions, current.itemActions, 'Incorrect property value on getCurrent()');
            assert.isFalse(current.ladderSupport, 'Incorrect property value on getCurrent()');
            assert.equal('XL', current.leftPadding, 'Incorrect property value on getCurrent()');
            assert.equal('L', current.rightPadding, 'Incorrect property value on getCurrent()');
            assert.equal('L', current.rowSpacing, 'Incorrect property value on getCurrent()');
            assert.isTrue(current.showRowSeparator, 'Incorrect property value on getCurrent()');
         });

         it('item', function() {
            assert.equal(gridData[0][cfg.keyProperty], current.key, 'Incorrect property value on getCurrent()');
            assert.equal(0, current.index, 'Incorrect property value on getCurrent()');
            assert.deepEqual(gridData[0], current.item, 'Incorrect property value on getCurrent()');
            assert.deepEqual(gridData[0], current.dispItem.getContents(), 'Incorrect property value on getCurrent()');
            assert.equal(gridData[0][cfg.displayProperty], current.getPropValue(current.item, cfg.displayProperty), 'Incorrect property value on getCurrent()');
         });

         it('state', function() {
            assert.isTrue(current.isSelected, 'Incorrect field set on getCurrent()');
            assert.equal(undefined, current.isActive, 'Incorrect property value on getCurrent()');
            assert.equal(0, current.multiSelectStatus, 'Incorrect property value on getCurrent()');
            assert.isFalse(current.multiSelectVisibility, 'Incorrect property value on getCurrent()');
            assert.isTrue(current.showActions, 'Incorrect property value on getCurrent()');
            assert.equal(undefined, current.isSwiped, 'Incorrect property value on getCurrent()');
         });

         it('columns', function() {
            function checkBaseProperties(checkedColumn, expectedData) {
               debugger;
               assert.equal(expectedData.columnIndex, checkedColumn.columnIndex, 'Incorrect property value on getCurrentColumn()');
               assert.deepEqual(expectedData.column, checkedColumn.column, 'Incorrect property value on getCurrentColumn()');
               assert.deepEqual(expectedData.item, checkedColumn.item, 'Incorrect property value on getCurrentColumn()');
               assert.deepEqual(expectedData.item, checkedColumn.dispItem.getContents(), 'Incorrect property value on getCurrentColumn()');
               assert.equal(expectedData.keyProperty, checkedColumn.keyProperty, 'Incorrect property value on getCurrentColumn()');
               assert.equal(expectedData.displayProperty, checkedColumn.displayProperty, 'Incorrect property value on getCurrentColumn()');
               assert.equal(expectedData.item[expectedData.keyProperty], checkedColumn.key, 'Incorrect property value on getCurrentColumn()');
               assert.equal(expectedData.item[expectedData.displayProperty],
                  checkedColumn.getPropValue(checkedColumn.item, expectedData.displayProperty), 'Incorrect property value on getCurrentColumn()');
               assert.equal(expectedData.template, checkedColumn.template, 'Incorrect property value on getCurrentColumn()');
               assert.equal(expectedData.cellClasses, checkedColumn.cellClasses, 'Incorrect property value on getCurrentColumn()');
            }

            // check first column (multiselect checkbox column)
            assert.equal(0, current.columnIndex, 'Incorrect property value on getCurrent()');
            assert.isTrue(current.isEndColumn(), 'Incorrect property value on getCurrentColumn()');
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
            assert.equal(1, current.columnIndex, 'Incorrect property value on getCurrent()');
            assert.isTrue(current.isEndColumn(), 'Incorrect property value on getCurrent()');
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
            assert.equal(2, current.columnIndex, 'Incorrect property value on getCurrent()');
            assert.isTrue(current.isEndColumn(), 'Incorrect property value on getCurrent()');
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
            assert.equal(3, current.columnIndex, 'Incorrect property value on getCurrent()');
            assert.isTrue(current.isEndColumn(), 'Incorrect property value on getCurrent()');
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
            assert.equal(4, current.columnIndex, 'Incorrect property value on getCurrent()');
            assert.isFalse(current.isEndColumn(), 'Incorrect property value on getCurrent()');

            // check reset column index
            /*
            columnIndex: 0
            getCurrentColumn: ƒ ()
            goToNextColumn: ƒ ()
            isEndColumn: ƒ ()
            resetColumnIndex: ƒ ()
            */
         });
      });


      /*it('Selection', function () {
         var cfg = {
            items: data,
            keyProperty: 'id',
            displayProperty: 'title',
            markedKey: 2
         };

         var iv = new ListViewModel(cfg);
         var marItem = iv._markedItem;
         assert.equal(iv._display.at(1), marItem, 'Incorrect selectedItem');


         iv.setMarkedKey(3);
         marItem = iv._markedItem;
         assert.equal(iv._display.at(2), marItem, 'Incorrect selectedItem');
         assert.equal(1, iv.getVersion(), 'Incorrect version appendItems');
      });



      it('multiSelection', function () {
         var rs1 = new RecordSet({
            rawData: data,
            idProperty : 'id'
         });


         var cfg;

         cfg = {
            items: data,
            keyProperty: 'id',
            displayProperty: 'title',
            selectedKeys: [1, 3]
         };

         var iv = new ListViewModel(cfg);
         assert.isTrue(!!iv._multiselection, 'ListViewModel: MultiSelection instance wasn\'t create');
         assert.deepEqual([1, 3], iv._multiselection._selectedKeys, 'ListViewModel: MultiSelection has wrong selected keys');

         iv.select([2]);
         assert.deepEqual([1, 3, 2], iv._multiselection._selectedKeys, 'ListViewModel: MultiSelection has wrong selected keys');
         assert.equal(1, iv.getVersion(), 'Incorrect version appendItems');

         iv.unselect([1]);
         assert.deepEqual([3, 2], iv._multiselection._selectedKeys, 'ListViewModel: MultiSelection has wrong selected keys');
         assert.equal(2, iv.getVersion(), 'Incorrect version appendItems');
      });*/
   });

});