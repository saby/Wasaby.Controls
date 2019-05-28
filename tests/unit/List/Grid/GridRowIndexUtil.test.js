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
            idProperty: cfg.keyProperty
         });
         return new gridLib.GridViewModel(cfg)
      }


      describe('Grid with header', function () {

         describe('results in top', function () {
            let
                gridModel = createModel({resultsPosition: 'top'}),
                rowIndexHelper = gridModel._getRowIndexHelper();

            it('getIndexById', function () {
               assert.equal(rowIndexHelper.getIndexById('1'), 2);
               assert.equal(rowIndexHelper.getIndexById('3'), 4);
               assert.equal(rowIndexHelper.getIndexById('5'), 6);
            });

            it('getIndexByItem', function () {
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(0)), 2);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(2)), 4);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(4)), 6);
            });

            it('getIndexByDisplayIndex', function () {
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 2);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(2), 4);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(4), 6);
            });

            it('getResultsIndex', function () {
               assert.equal(rowIndexHelper.getResultsIndex(), 1);
            });

            it('getFooterIndex', function () {
               assert.equal(rowIndexHelper.getFooterIndex(), 7);
            });
         });

         describe('results in bottom', function () {
            let
                gridModel = createModel({resultsPosition: 'bottom'}),
                rowIndexHelper = gridModel._getRowIndexHelper();

            it('getIndexById', function () {
               assert.equal(rowIndexHelper.getIndexById('1'), 1);
               assert.equal(rowIndexHelper.getIndexById('3'), 3);
               assert.equal(rowIndexHelper.getIndexById('5'), 5);
            });

            it('getIndexByItem', function () {
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(0)), 1);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(2)), 3);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(4)), 5);
            });

            it('getIndexByDisplayIndex', function () {
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 1);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(2), 3);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(4), 5);
            });

            it('getResultsIndex', function () {
               assert.equal(rowIndexHelper.getResultsIndex(), 6);
            });

            it('getFooterIndex', function () {
               assert.equal(rowIndexHelper.getFooterIndex(), 7);
            });
         });

         describe('no results', function () {
            let
                gridModel = createModel(),
                rowIndexHelper = gridModel._getRowIndexHelper();

            it('getIndexById', function () {
               assert.equal(rowIndexHelper.getIndexById('1'), 1);
               assert.equal(rowIndexHelper.getIndexById('3'), 3);
               assert.equal(rowIndexHelper.getIndexById('5'), 5);
            });

            it('getIndexByItem', function () {
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(0)), 1);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(2)), 3);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(4)), 5);
            });

            it('getIndexByDisplayIndex', function () {
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 1);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(2), 3);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(4), 5);
            });

            it('getFooterIndex', function () {
               assert.equal(rowIndexHelper.getFooterIndex(), 6);
            });
         });

      });

      describe('Grid without header', function () {

         describe('results in top', function () {
            let
                gridModel = createModel({resultsPosition: 'top', header: null}),
                rowIndexHelper = gridModel._getRowIndexHelper();

            it('getIndexById', function () {
               assert.equal(rowIndexHelper.getIndexById('1'), 1);
               assert.equal(rowIndexHelper.getIndexById('3'), 3);
               assert.equal(rowIndexHelper.getIndexById('5'), 5);
            });

            it('getIndexByItem', function () {
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(0)), 1);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(2)), 3);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(4)), 5);
            });

            it('getIndexByDisplayIndex', function () {
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 1);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(2), 3);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(4), 5);
            });

            it('getResultsIndex', function () {
               assert.equal(rowIndexHelper.getResultsIndex(), 0);
            });

            it('getFooterIndex', function () {
               assert.equal(rowIndexHelper.getFooterIndex(), 6);
            });

         });

         describe('results in bottom', function () {
            let
                gridModel = createModel({resultsPosition: 'bottom', header: null}),
                rowIndexHelper = gridModel._getRowIndexHelper();

            it('getIndexById', function () {
               assert.equal(rowIndexHelper.getIndexById('1'), 0);
               assert.equal(rowIndexHelper.getIndexById('3'), 2);
               assert.equal(rowIndexHelper.getIndexById('5'), 4);
            });

            it('getIndexByItem', function () {
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(0)), 0);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(2)), 2);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(4)), 4);
            });

            it('getIndexByDisplayIndex', function () {
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 0);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(2), 2);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(4), 4);
            });

            it('getResultsIndex', function () {
               assert.equal(rowIndexHelper.getResultsIndex(), 5);
            });

            it('getFooterIndex', function () {
               assert.equal(rowIndexHelper.getFooterIndex(), 6);
            });
         });

         describe('no results', function () {
            let
                gridModel = createModel({header: null}),
                rowIndexHelper = gridModel._getRowIndexHelper();

            it('getIndexById', function () {
               assert.equal(rowIndexHelper.getIndexById('1'), 0);
               assert.equal(rowIndexHelper.getIndexById('3'), 2);
               assert.equal(rowIndexHelper.getIndexById('5'), 4);
            });

            it('getIndexByItem', function () {
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(0)), 0);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(2)), 2);
               assert.equal(rowIndexHelper.getIndexByItem(gridModel.getDisplay().at(4)), 4);
            });

            it('getIndexByDisplayIndex', function () {
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(0), 0);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(2), 2);
               assert.equal(rowIndexHelper.getIndexByDisplayIndex(4), 4);
            });

            it('getFooterIndex', function () {
               assert.equal(rowIndexHelper.getFooterIndex(), 5);
            });

         });

      });

      describe('Empty grid', function () {

         describe('With empty template', function () {

            describe('Grid with header', function () {

               describe('results in top', function () {
                  let
                      gridModel = createModel({resultsPosition: 'top', emptyTemplate: 'qwe'}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getResultsIndex', function () {
                     assert.equal(rowIndexHelper.getResultsIndex(), 1);
                  });

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 3);
                  });
               });

               describe('results in bottom', function () {
                  let
                      gridModel = createModel({resultsPosition: 'bottom', emptyTemplate: 'qwe'}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getResultsIndex', function () {
                     assert.equal(rowIndexHelper.getResultsIndex(), 2);
                  });

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 3);
                  });
               });

               describe('no results', function () {
                  let
                      gridModel = createModel({emptyTemplate: 'qwe'}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 2);
                  });
               });

            });

            describe('Grid without header', function () {

               describe('results in top', function () {
                  let
                      gridModel = createModel({resultsPosition: 'top', header: null, emptyTemplate: 'qwe'}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getResultsIndex', function () {
                     assert.equal(rowIndexHelper.getResultsIndex(), 0);
                  });

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 2);
                  });

               });

               describe('results in bottom', function () {
                  let
                      gridModel = createModel({resultsPosition: 'bottom', header: null, emptyTemplate: 'qwe'}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getResultsIndex', function () {
                     assert.equal(rowIndexHelper.getResultsIndex(), 1);
                  });

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 2);
                  });
               });

               describe('no results', function () {
                  let
                      gridModel = createModel({header: null, emptyTemplate: 'qwe'}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 1);
                  });

               });

            });
         });

         describe('Without empty template', function () {

            describe('Grid with header', function () {

               describe('results in top', function () {
                  let
                      gridModel = createModel({resultsPosition: 'top'}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getResultsIndex', function () {
                     assert.equal(rowIndexHelper.getResultsIndex(), 1);
                  });

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 2);
                  });
               });

               describe('results in bottom', function () {
                  let
                      gridModel = createModel({resultsPosition: 'bottom'}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getResultsIndex', function () {
                     assert.equal(rowIndexHelper.getResultsIndex(), 1);
                  });

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 2);
                  });
               });

               describe('no results', function () {
                  let
                      gridModel = createModel({}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 1);
                  });
               });

            });

            describe('Grid without header', function () {

               describe('results in top', function () {
                  let
                      gridModel = createModel({resultsPosition: 'top', header: null}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getResultsIndex', function () {
                     assert.equal(rowIndexHelper.getResultsIndex(), 0);
                  });

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 1);
                  });

               });

               describe('results in bottom', function () {
                  let
                      gridModel = createModel({resultsPosition: 'bottom', header: null}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getResultsIndex', function () {
                     assert.equal(rowIndexHelper.getResultsIndex(), 0);
                  });

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 1);
                  });
               });

               describe('no results', function () {
                  let
                      gridModel = createModel({header: null}, []),
                      rowIndexHelper = gridModel._getRowIndexHelper();

                  it('getFooterIndex', function () {
                     assert.equal(rowIndexHelper.getFooterIndex(), 0);
                  });

               });

            });
         });

      });

   });
});