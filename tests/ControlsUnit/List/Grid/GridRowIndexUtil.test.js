define([
   'Controls/_grid/utils/GridRowIndexUtil',
   'Controls/_list/resources/utils/ItemsUtil',
   'Controls/grid',
   'Types/collection'
], function (RowUtil, ItemsUtil, gridLib, collection) {

   describe('Controls._grid.utils.GridRowIndexUtil', function () {
      let
          gridData = [
             {
                'id': '1',
                'title': 'Хлеб',
                'price': 50
             },
             {
                'id': '2',
                'title': 'Хлеб',
                'price': 150
             },
             {
                'id': '3',
                'title': 'Масло',
                'price': 100
             },
             {
                'id': '4',
                'title': 'Помидор',
                'price': 75
             },
             {
                'id': '5',
                'title': 'Капуста китайская',
                'price': 35
             }
          ],
          gridColumns = [
             {
                displayProperty: 'title',
                width: '1fr',
             },
             {
                displayProperty: 'price',
                width: 'auto',
             }
          ],
          gridHeader = [
             {title: ''},
             {title: 'Цена'},
          ];

      function createModel(cfg, data) {
         cfg = cfg || {};
         cfg.keyProperty = cfg.keyProperty || 'id';
         cfg.displayProperty = cfg.displayProperty || 'title';
         cfg.columns = 'columns' in cfg ? cfg.columns : gridColumns;
         cfg.header = 'header' in cfg ? cfg.header : gridHeader;
         cfg.items = new collection.RecordSet({
            rawData: data || gridData,
            keyProperty: cfg.keyProperty
         });
         cfg.columnScroll = cfg.columnScroll || false;
         return new gridLib.GridViewModel(cfg)
      }

      let gridModel;

      afterEach(function () {
         gridModel.destroy();
         gridModel = null;
      });

      describe('getRowsArray', function () {
         it('getRowsArray without multiheader', function () {
            gridModel = createModel({resultsPosition: 'top', columnScroll: true});
            var headerRows = RowUtil.getRowsArray(gridHeader, false, false)
            assert.deepEqual([gridHeader], headerRows)
         });
         it('getRowsArray with multiheader', function () {
            gridModel = createModel({resultsPosition: 'top', columnScroll: true});
            var header = [
               {
                  align: "center",
                  endColumn: 2,
                  endRow: 2,
                  startColumn: 1,
                  startRow: 1,
                  title: "Наименование",
               },
               {
                  align: "center",
                  endColumn: 3,
                  endRow: 2,
                  startColumn: 2,
                  startRow: 1,
                  title: "Price",
               },
               {
                  align: "center",
                  endColumn: 2,
                  endRow: 3,
                  startColumn: 1,
                  startRow: 2,
                  title: "Cell",
               },
               {
                  align: "center",
                  endColumn: 3,
                  endRow: 3,
                  startColumn: 2,
                  startRow: 2,
                  title: "Общие",
               }
            ]
            var headerRows = RowUtil.getRowsArray(header, false, true)
            assert.deepEqual([[header[0], header[1]], [header[2], header[3]]], headerRows)
         });
      });
   });
});
