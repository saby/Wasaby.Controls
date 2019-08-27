define(['Controls/grid', 'Core/core-merge', 'Types/collection', 'Types/entity', 'Core/core-clone', 'Controls/_grid/utils/GridLayoutUtil', 'Env/Env'], function(gridMod, cMerge, collection, entity, clone, GridLayoutUtil, Env) {
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
            'title': 'Хлеб',
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
            width: '1fr',
            valign: 'top',
            style: 'default',
            textOverflow: 'ellipsis'
         },
         {
            displayProperty: 'price',
            width: 'auto',
            align: 'right',
            valign: 'bottom',
            style: 'default'
         },
         {
            displayProperty: 'balance',
            width: 'auto',
            align: 'right',
            valign: 'middle',
            style: 'default'
         }
      ],
      gridHeader = [
            {
               title: '',
               style: 'default',
               startRow: 1,
               endRow: 2,
               startColumn: 1,
               endColumn: 2
            },
            {
               title: 'Цена',
               align: 'right',
               style: 'default',
               sortingProperty: 'price',
               startRow: 1,
               endRow: 2,
               startColumn: 2,
               endColumn: 3
            },
            {
               title: 'Остаток',
               align: 'right',
               style: 'default',
               startRow: 1,
               endRow: 2,
               startColumn: 3,
               endColumn: 4
            }
      ],
      itemActions = [],
      cfg = {
         keyProperty: 'id',
         displayProperty: 'title',
         markedKey: '123',
         markerVisibility: 'visible',
         multiSelectVisibility: 'visible',
         stickyColumnsCount: 1,
         header: gridHeader,
         columns: gridColumns,
         items: new collection.RecordSet({
            rawData: gridData,
            idProperty: 'id'
         }),
         itemActions: itemActions,
         leftPadding: 'XL',
         rightPadding: 'L',
         rowSpacing: 'L',
         rowSeparatorVisibility: true,
         style: 'default',
         sorting: [{price: 'DESC'}],
         searchValue: 'test'
      };

   describe('Controls.List.Grid.GridViewModel', function() {
      describe('DragNDrop methods', function() {
         var gridViewModel = new gridMod.GridViewModel(cfg);

         it('setDragTargetPosition', function() {
            var dragTargetPosition = {};
            gridViewModel.setDragTargetPosition(dragTargetPosition);
            assert.equal(gridViewModel.getDragTargetPosition(), dragTargetPosition);
         });

         it('setDragEntity', function() {
            var dragEntity = {};
            gridViewModel.setDragEntity(dragEntity);
            assert.equal(gridViewModel.getDragEntity(), dragEntity);
         });

         it('setDragItemData', function() {
            var dragItemData = {};
            gridViewModel.setDragItemData(dragItemData);
            assert.equal(gridViewModel.getDragItemData(), dragItemData);
         });
      });

      describe('"_private" block', function() {
         it('calcItemColumnVersion', function() {
            assert.equal(gridMod.GridViewModel._private.calcItemColumnVersion({
               _columnsVersion: 1,
               _options: {
                  multiSelectVisibility: 'hidden'
               }
            }, 1, 0), '1_1_0');
            assert.equal(gridMod.GridViewModel._private.calcItemColumnVersion({
               _columnsVersion: 1,
               _options: {
                  multiSelectVisibility: 'visible'
               }
            }, 1, 0), '1_1_-1');
            assert.equal(gridMod.GridViewModel._private.calcItemColumnVersion({
               _columnsVersion: 1,
               _options: {
                  multiSelectVisibility: 'visible'
               }
            }, 1, 1), '1_1_0');
         });

         it('isNeedToHighlight', function() {
            var item = new entity.Model({
               rawData: {
                  id: 0,
                  title: 'test'
               },
               idProperty: 'id'
            });
            assert.isFalse(!!gridMod.GridViewModel._private.isNeedToHighlight(item, 'title', 'xxx'));
            assert.isFalse(!!gridMod.GridViewModel._private.isNeedToHighlight(item, 'title', ''));
            assert.isTrue(!!gridMod.GridViewModel._private.isNeedToHighlight(item, 'title', 'tes'));
         });
         it('calcLadderVersion', function () {
            var
                onlySimpleLadder = {
                   ladder: {
                      0: {
                         'property1': {
                            ladderLength: 2
                         },
                         'property2': {
                            ladderLength: 1
                         },
                         'property3': {}
                      },
                      1: {

                      }
                   },
                   stickyLadder: {}
                },
               withSticky = {
                  ladder: {
                     0: {
                        'property1': {
                           ladderLength: 2
                        },
                        'property2': {
                           ladderLength: 1
                        },
                        'property3': {}
                     },
                     1: {

                     }
                  },
                  stickyLadder: {
                     0: {
                        'property1': {
                           ladderLength: 2
                        },
                        'property2': {
                           ladderLength: 1
                        },
                        'property3': {}
                     },
                     1: {

                     }
                  }
               };
            assert.equal('LP_2_1_0_', gridMod.GridViewModel._private.calcLadderVersion(onlySimpleLadder, 0));
            assert.equal('LP_', gridMod.GridViewModel._private.calcLadderVersion(onlySimpleLadder, 1));

            assert.equal('LP_2_1_0_SP_2_1_0_', gridMod.GridViewModel._private.calcLadderVersion(withSticky, 0));
            assert.equal('LP_SP_', gridMod.GridViewModel._private.calcLadderVersion(withSticky, 1));


         });
         it('isDrawActions', function() {
            var
               testCases = [
                  {
                     inputData: {
                        itemData: {
                           drawActions: false,
                           multiSelectVisibility: 'hidden',
                           getLastColumnIndex: function() {
                              return 0;
                           }
                        },
                        currentColumn: {
                           columnIndex: 0
                        },
                        colspan: false
                     },
                     resultData: false
                  },
                  {
                     inputData: {
                        itemData: {
                           drawActions: true,
                           multiSelectVisibility: 'hidden',
                           getLastColumnIndex: function() {
                              return 0;
                           }
                        },
                        currentColumn: {
                           columnIndex: 0
                        },
                        colspan: false
                     },
                     resultData: true
                  },
                  {
                     inputData: {
                        itemData: {
                           drawActions: true,
                           multiSelectVisibility: 'hidden',
                           getLastColumnIndex: function() {
                              return 1;
                           }
                        },
                        currentColumn: {
                           columnIndex: 0
                        },
                        colspan: false
                     },
                     resultData: false
                  },
                  {
                     inputData: {
                        itemData: {
                           drawActions: true,
                           multiSelectVisibility: 'visible',
                           getLastColumnIndex: function() {
                              return 2;
                           }
                        },
                        currentColumn: {
                           columnIndex: 1
                        },
                        colspan: false
                     },
                     resultData: false
                  },
                  {
                     inputData: {
                        itemData: {
                           drawActions: true,
                           multiSelectVisibility: 'visible',
                           getLastColumnIndex: function() {
                              return 2;
                           }
                        },
                        currentColumn: {
                           columnIndex: 1
                        },
                        colspan: true
                     },
                     resultData: true
                  }
               ];
            testCases.forEach(function(testCase, idx) {
               assert.equal(testCase.resultData,
                  gridMod.GridViewModel._private.isDrawActions(testCase.inputData.itemData, testCase.inputData.currentColumn, testCase.inputData.colspan),
                  'Invalid result data in test #' + idx);
            });
         });
         it('getCellStyle', function() {
            var
               testCases = [
                  {
                     inputData: {
                        itemData: {
                           multiSelectVisibility: 'hidden',
                           columns: [{}, {}]
                        },
                        currentColumn: {
                           styleForLadder: 'LADDER_STYLE;',
                           columnIndex: 0
                        },
                        isNotFullGridSupport: false,
                        colspan: false
                     },
                     resultData: 'LADDER_STYLE;'
                  },
                  {
                     inputData: {
                        itemData: {
                           multiSelectVisibility: 'hidden',
                           columns: [{}, {}]
                        },
                        currentColumn: {
                           columnIndex: 0
                        },
                        isNotFullGridSupport: false,
                        colspan: false
                     },
                     resultData: ''
                  },
                  {
                     inputData: {
                        itemData: {
                           multiSelectVisibility: 'hidden',
                           columns: [{}, {}]
                        },
                        currentColumn: {
                           styleForLadder: 'LADDER_STYLE;',
                           columnIndex: 0
                        },
                        isNotFullGridSupport: false,
                        colspan: true
                     },
                     resultData: 'LADDER_STYLE; grid-column: 1 / 3;'
                  },
                  {
                     inputData: {
                        itemData: {
                           multiSelectVisibility: 'hidden',
                           columns: [{}, {}]
                        },
                        currentColumn: {
                           styleForLadder: 'LADDER_STYLE;',
                           columnIndex: 0
                        },
                        isNotFullGridSupport: false,
                        colspan: true
                     },
                     resultData: 'LADDER_STYLE; grid-column: 1 / 3;'
                  }
               ];
            testCases.forEach(function(testCase, idx) {
               assert.equal(testCase.resultData,
                  gridMod.GridViewModel._private.getCellStyle(testCase.inputData.itemData, testCase.inputData.currentColumn, testCase.inputData.colspan, testCase.inputData.isNotFullGridSupport),
                  'Invalid result data in test #' + idx);
            });
         });
         it('getCellStyle should set styles for partial support if has colspan', function () {
            let nativeFn =GridLayoutUtil.isPartialGridSupport;
            GridLayoutUtil.isPartialGridSupport = () => true;

            let
                itemData = {
                   multiSelectVisibility: 'hidden',
                   columns: [{}, {}]
                },
                currentColumn = {
                   columnIndex: 0
                };

            assert.equal(
                gridMod.GridViewModel._private.getCellStyle(itemData, currentColumn, true),
                ' grid-column: 1 / 3; -ms-grid-column: 1; -ms-grid-column-span: 2;'
            );

            GridLayoutUtil.isPartialGridSupport = nativeFn;
         });
         it('getPaddingCellClasses', function() {
            var
               paramsWithoutMultiselect = {
                  columns: gridColumns,
                  multiSelectVisibility: false,
                  itemPadding: {
                     left: 'XL',
                     right: 'L',
                     top: 'L',
                     bottom: 'L'
                  },
                  style: 'default'
               },
               paramsWithMultiselect = {
                  columns: [{}].concat(gridColumns),
                  multiSelectVisibility: true,
                  itemPadding: {
                     left: 'XL',
                     right: 'L',
                     top: 'L',
                     bottom: 'L'
                  },
                  style: 'default'
               },
               expectedResultWithoutMultiselect = [
                  ' controls-Grid__cell_spacingRight controls-Grid__cell_spacingFirstCol_xl controls-Grid__cell_default controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l',
                  ' controls-Grid__cell_spacingLeft controls-Grid__cell_spacingRight controls-Grid__cell_default controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l',
                  ' controls-Grid__cell_spacingLeft controls-Grid__cell_spacingLastCol_l controls-Grid__cell_default controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l' ],
               expectedResultWithMultiselect = [
                  ' controls-Grid__cell_spacingRight controls-Grid__cell_default controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l',
                  ' controls-Grid__cell_spacingRight controls-Grid__cell_default controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l',
                  ' controls-Grid__cell_spacingLeft controls-Grid__cell_spacingRight controls-Grid__cell_default controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l',
                  ' controls-Grid__cell_spacingLeft controls-Grid__cell_spacingLastCol_l controls-Grid__cell_default controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l' ];
            assert.equal(expectedResultWithoutMultiselect[0],
               gridMod.GridViewModel._private.getPaddingHeaderCellClasses(cMerge(paramsWithoutMultiselect, {columnIndex: 0, rowIndex: 0})),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(paramsWithoutMultiselect)".');
            assert.equal(expectedResultWithoutMultiselect[1],
               gridMod.GridViewModel._private.getPaddingHeaderCellClasses(cMerge(paramsWithoutMultiselect, {columnIndex: 1})),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(paramsWithoutMultiselect)".');
            assert.equal(expectedResultWithoutMultiselect[2],
               gridMod.GridViewModel._private.getPaddingHeaderCellClasses(cMerge(paramsWithoutMultiselect, {columnIndex: 2, rowIndex: 0})),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(paramsWithoutMultiselect)".');

            assert.equal(expectedResultWithMultiselect[0],
               gridMod.GridViewModel._private.getPaddingHeaderCellClasses(cMerge(paramsWithMultiselect, {columnIndex: 0, rowIndex: 0})),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(paramsWithMultiselect)".');
            assert.equal(expectedResultWithMultiselect[1],
               gridMod.GridViewModel._private.getPaddingHeaderCellClasses(cMerge(paramsWithMultiselect, {columnIndex: 1, rowIndex: 0})),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(paramsWithMultiselect)".');
            assert.equal(expectedResultWithMultiselect[2],
               gridMod.GridViewModel._private.getPaddingHeaderCellClasses(cMerge(paramsWithMultiselect, {columnIndex: 2, rowIndex: 0})),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(paramsWithMultiselect)".');
            assert.equal(expectedResultWithMultiselect[3],
               gridMod.GridViewModel._private.getPaddingHeaderCellClasses(cMerge(paramsWithMultiselect, {columnIndex: 3, rowIndex: 0})),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(paramsWithMultiselect)".');
         });
         it('getSortingDirectionByProp', function() {
            assert.equal(gridMod.GridViewModel._private.getSortingDirectionByProp([{test: 'ASC'}, {test2: 'DESC'}], 'test'), 'ASC');
            assert.equal(gridMod.GridViewModel._private.getSortingDirectionByProp([{test: 'ASC'}, {test2: 'DESC'}], 'test2'), 'DESC');
            assert.equal(gridMod.GridViewModel._private.getSortingDirectionByProp([{test: 'ASC'}, {test2: 'DESC'}], 'test3'), undefined);
            assert.equal(gridMod.GridViewModel._private.getSortingDirectionByProp([{test: 'ASC'}, {test2: 'DESC'}], 'test3'), undefined);
         });
         it('prepareRowSeparatorClasses', function() {
            var
               expectedResultWithRowSeparator = [
                  ' controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow',
                  ' controls-Grid__row-cell_withRowSeparator',
                  ' controls-Grid__row-cell_withRowSeparator controls-Grid__row-cell_lastRow controls-Grid__row-cell_withRowSeparator_lastRow'
               ],
               expectedResultWithoutRowSeparator = [
                  ' controls-Grid__row-cell_withoutRowSeparator',
                  ' controls-Grid__row-cell_withoutRowSeparator',
                  ' controls-Grid__row-cell_withoutRowSeparator'
               ],
               expectedResultForFirstItemInGroup = ' controls-Grid__row-cell_first-row-in-group';

            assert.equal(expectedResultWithRowSeparator[0], gridMod.GridViewModel._private.prepareRowSeparatorClasses({
               rowSeparatorVisibility: true,
               isFirstInGroup: false,
               index: 0,
               dispItem: {
                  getOwner: function() {
                     return {
                        getCount: function() {
                           return 3
                        }
                     }
                  }
               }
            }));
            assert.equal(expectedResultWithRowSeparator[1], gridMod.GridViewModel._private.prepareRowSeparatorClasses({
               rowSeparatorVisibility: true,
               isFirstInGroup: false,
               index: 1,
               dispItem: {
                  getOwner: function() {
                     return {
                        getCount: function() {
                           return 3
                        }
                     }
                  }
               }
            }));
            assert.equal(expectedResultWithRowSeparator[2], gridMod.GridViewModel._private.prepareRowSeparatorClasses({
               rowSeparatorVisibility: true,
               isFirstInGroup: false,
               index: 2,
               dispItem: {
                  getOwner: function() {
                     return {
                        getCount: function() {
                           return 3
                        }
                     }
                  }
               }
            }));

            assert.equal(expectedResultWithoutRowSeparator[0], gridMod.GridViewModel._private.prepareRowSeparatorClasses({
               rowSeparatorVisibility: false,
               isFirstInGroup: false,
               index: 0,
               dispItem: {
                  getOwner: function() {
                     return {
                        getCount: function() {
                           return 3
                        }
                     }
                  }
               }
            }));
            assert.equal(expectedResultWithoutRowSeparator[1], gridMod.GridViewModel._private.prepareRowSeparatorClasses({
               rowSeparatorVisibility: false,
               isFirstInGroup: false,
               index: 1,
               dispItem: {
                  getOwner: function() {
                     return {
                        getCount: function() {
                           return 3
                        }
                     }
                  }
               }
            }));
            assert.equal(expectedResultWithoutRowSeparator[2], gridMod.GridViewModel._private.prepareRowSeparatorClasses({
               rowSeparatorVisibility: false,
               isFirstInGroup: false,
               index: 2,
               dispItem: {
                  getOwner: function() {
                     return {
                        getCount: function() {
                           return 3
                        }
                     }
                  }
               }
            }));

            assert.equal(expectedResultForFirstItemInGroup, gridMod.GridViewModel._private.prepareRowSeparatorClasses({
               rowSeparatorVisibility: true,
               isFirstInGroup: true,
               index: 0,
               dispItem: {
                  getOwner: function() {
                     return {
                        getCount: function() {
                           return 3
                        }
                     }
                  }
               }
            }));
         });
         it('getItemColumnCellClasses for old browsers', function() {
            var
               gridViewModel = new gridMod.GridViewModel(cfg),
               current = gridViewModel.getCurrent(),
               expected = {
                  withMarker: 'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow' +
                     ' controls-Grid__row-cell_withRowSeparator_firstRow controls-Grid__row-cell-checkbox controls-Grid__row-cell_selected' +
                     ' controls-Grid__row-cell_selected-default controls-Grid__row-cell_selected__first-default',
                  withoutMarker: 'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow' +
                     ' controls-Grid__row-cell_withRowSeparator_firstRow controls-Grid__row-cell-checkbox controls-Grid__row-cell_selected' +
                     ' controls-Grid__row-cell_selected-default controls-Grid__row-cell_selected__first-default'
               };
            current.isNotFullGridSupport = true;

            assert.equal(expected.withMarker,
               gridMod.GridViewModel._private.getItemColumnCellClasses(current, current.columnIndex),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(params)".');

            current.markerVisibility = 'hidden';
            current.resetColumnIndex();

            assert.equal(expected.withoutMarker,
               gridMod.GridViewModel._private.getItemColumnCellClasses(current, current.columnIndex),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(params)".');


         });
         it('should update last item after append items', function () {
            var
               gridViewModel = new gridMod.GridViewModel(cfg),
                oldLastIndex = gridViewModel.getCount()-1,
                firstItem = gridViewModel.getItemDataByItem(gridViewModel._model._display.at(0)),
                lastItem = gridViewModel.getItemDataByItem(gridViewModel._model._display.at(oldLastIndex)),
                newLastItem;

            // first item should have updated version identificator
            assert.isTrue(firstItem.getVersion().indexOf('LAST_ITEM') === -1);

            // last item should have updated version identificator
            assert.isTrue(lastItem.getVersion().indexOf('LAST_ITEM') !== -1);

            gridViewModel.appendItems(new collection.RecordSet({
               idProperty: 'id',
               rawData: [
                  { id: 121212, title: 'i0'},
                  { id: 231313, title: 'i1'}
               ]
            }));

            // old last item now must be updated and shouldn't have prefix "LAST_ITEM" in version identificator
            lastItem = gridViewModel.getItemDataByItem(gridViewModel._model._display.at(oldLastIndex));
            assert.isTrue(lastItem.getVersion().indexOf('LAST_ITEM') === -1);

            // last item should have updated version identificator
            newLastItem = gridViewModel.getItemDataByItem(gridViewModel._model._display.at(gridViewModel.getCount()-1));
            assert.isTrue(newLastItem.getVersion().indexOf('LAST_ITEM') !== -1);

         });

         it('getItemDataByItem', function() {
            let gridViewModel = new gridMod.GridViewModel(cfg);
            let data = gridViewModel.getItemDataByItem({ getContents: () => [] });

            assert.isFalse(!!data.isFirstInGroup);
         });

         it('getMultiSelectClassList visible', function() {
            let gridViewModel = new gridMod.GridViewModel(cfg);
            gridViewModel._options.multiSelectVisibility = 'visible';
            let data = gridViewModel.getItemDataByItem({ getContents: () => [] });

            assert.equal(data.multiSelectClassList, 'js-controls-ListView__checkbox js-controls-ListView__notEditable controls-GridView__checkbox');
         });

         it('getMultiSelectClassList hidden', function() {
            let gridViewModel = new gridMod.GridViewModel(cfg);
            gridViewModel._options.multiSelectVisibility = 'hidden';
            let data = gridViewModel.getItemDataByItem({ getContents: () => [] });

            assert.equal(data.multiSelectClassList, '');
         });

         it('getMultiSelectClassList onhover selected', function() {
            let gridViewModel = new gridMod.GridViewModel(cfg);
            gridViewModel._options.multiSelectVisibility = 'onhover';
            gridViewModel._model._selectedKeys = {'123': true};
            let data = gridViewModel.getItemDataByItem(gridViewModel.getItemById('123', 'id'));

            assert.equal(data.multiSelectClassList, 'js-controls-ListView__checkbox js-controls-ListView__notEditable controls-GridView__checkbox');
         });

         it('getMultiSelectClassList onhover unselected', function() {
            let gridViewModel = new gridMod.GridViewModel(cfg);
            gridViewModel._options.multiSelectVisibility = 'onhover';
            let data = gridViewModel.getItemDataByItem({ getContents: () => [] });

            assert.equal(data.multiSelectClassList, 'js-controls-ListView__checkbox js-controls-ListView__notEditable controls-ListView__checkbox-onhover controls-GridView__checkbox');
            gridViewModel._options.multiSelectVisibility = 'visible';
         });

         it('should update model in old browsers on collection change', function () {
            var
                gridViewModel = new gridMod.GridViewModel(cfg),
                oldVersion = gridViewModel._model._prefixItemVersion,
                initialStatus = GridLayoutUtil.isPartialGridSupport;

            GridLayoutUtil.isPartialGridSupport = function() { return true; };

            gridViewModel._model._notify('onListChange', 'collectionChanged');
            assert.equal(oldVersion + 1, gridViewModel._model._prefixItemVersion);

            GridLayoutUtil.isPartialGridSupport = initialStatus;
         });

         it('getItemColumnCellClasses', function() {
            var
               gridViewModel = new gridMod.GridViewModel(cfg),
               current = gridViewModel.getCurrent(),
               expectedResult = [
                  'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow' +
                  ' controls-Grid__row-cell-checkbox controls-Grid__row-cell_selected controls-Grid__row-cell_selected-default' +
                  ' controls-Grid__row-cell_selected__first-default',
                  'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow' +
                  ' controls-Grid__cell_spacingRight controls-Grid__cell_default controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l' +
                  ' controls-Grid__row-cell_selected controls-Grid__row-cell_selected-default',
                  'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow' +
                  ' controls-Grid__cell_spacingLeft controls-Grid__cell_spacingRight controls-Grid__cell_default controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l' +
                  ' controls-Grid__row-cell_selected controls-Grid__row-cell_selected-default',
                  'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow' +
                  ' controls-Grid__cell_spacingLeft controls-Grid__cell_default controls-Grid__cell_spacingLastCol_l controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l' +
                  ' controls-Grid__row-cell_selected controls-Grid__row-cell_selected-default' +
                  ' controls-Grid__row-cell_selected__last controls-Grid__row-cell_selected__last-default',
                  'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow' +
                  ' controls-Grid__cell_spacingLeft controls-Grid__cell_default controls-Grid__cell_spacingLastCol_l controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l' +
                  ' controls-Grid__row-cell__last controls-Grid__row-cell__last-default'];
            assert.equal(expectedResult[0],
               gridMod.GridViewModel._private.getItemColumnCellClasses(current, current.columnIndex),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(params)".');
            current.goToNextColumn();
            assert.equal(expectedResult[1],
               gridMod.GridViewModel._private.getItemColumnCellClasses(current, current.columnIndex),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(params)".');
            current.goToNextColumn();
            assert.equal(expectedResult[2],
               gridMod.GridViewModel._private.getItemColumnCellClasses(current, current.columnIndex),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(params)".');
            current.goToNextColumn();
            assert.equal(expectedResult[3],
               gridMod.GridViewModel._private.getItemColumnCellClasses(current, current.columnIndex),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(params)".');

            current.isSelected = false;
            assert.equal(expectedResult[4],
               gridMod.GridViewModel._private.getItemColumnCellClasses(current, current.columnIndex),
               'Incorrect value "GridViewModel._private.getPaddingCellClasses(params)".');
         });
      });
      describe('getCurrent', function() {
         var
            gridViewModel = new gridMod.GridViewModel(cfg),
            current = gridViewModel.getCurrent();

         it('configuration', function() {
            assert.equal(cfg.keyProperty, current.keyProperty, 'Incorrect value "current.keyProperty".');
            assert.equal(cfg.displayProperty, current.displayProperty, 'Incorrect value "current.displayProperty".');
            assert.isTrue(current.multiSelectVisibility === 'visible');
            assert.deepEqual([{}].concat(gridColumns), current.columns, 'Incorrect value "current.columns".');
            assert.deepEqual({
               left: 'XL',
               right: 'L',
               top: 'L',
               bottom: 'L'
            }, current.itemPadding, 'Incorrect value "current.itemPadding".');
            assert.isTrue(current.rowSeparatorVisibility, 'Incorrect value "current.rowSeparatorVisibility".');
         });

         it('item', function() {
            assert.equal(gridData[0][cfg.keyProperty], current.key, 'Incorrect value "current.keyProperty".');
            assert.equal(0, current.index, 'Incorrect value "current.index".');
            assert.deepEqual(gridData[0], current.item.getRawData(), 'Incorrect value "current.item".');
            assert.deepEqual(gridData[0], current.dispItem.getContents().getRawData(), 'Incorrect value "current.dispItem".');
            assert.equal(gridData[0][cfg.displayProperty], current.getPropValue(current.item, cfg.displayProperty), 'Incorrect value "current.displayProperty".');
         });

         it('state', function() {
            assert.isTrue(current.isSelected, 'Incorrect value "current.isSelected".');
            assert.equal(undefined, current.isActive, 'Incorrect value "current.isActive".');
            assert.isTrue(current.multiSelectVisibility === 'visible');
            assert.equal(undefined, current.isSwiped, 'Incorrect value "current.isSwiped".');
         });

         it('columns', function() {
            function checkBaseProperties(checkedColumn, expectedData) {
               assert.equal(expectedData.columnIndex, checkedColumn.columnIndex, 'Incorrect value "columnIndex" when checking columns.');
               assert.deepEqual(expectedData.column, checkedColumn.column, 'Incorrect value "column" when checking columns.');
               assert.deepEqual(expectedData.item, checkedColumn.item.getRawData(), 'Incorrect value "item" when checking columns.');
               assert.deepEqual(expectedData.item, checkedColumn.dispItem.getContents().getRawData(), 'Incorrect value "dispItem" when checking columns.');
               assert.equal(expectedData.keyProperty, checkedColumn.keyProperty, 'Incorrect value "keyProperty" when checking columns.');
               assert.equal(expectedData.displayProperty, checkedColumn.displayProperty, 'Incorrect value "displayProperty" when checking columns.');
               assert.equal(expectedData.item[expectedData.keyProperty], checkedColumn.key, 'Incorrect value "getPropValue(item, displayProperty)" when checking columns.');
               assert.equal(expectedData.item[expectedData.displayProperty],
                  checkedColumn.getPropValue(checkedColumn.item, expectedData.displayProperty), 'Incorrect value "" when checking columns.');
               assert.equal(expectedData.template, checkedColumn.template, 'Incorrect value "template" when checking columns.');
               assert.equal(expectedData.cellClasses, checkedColumn.cellClasses, 'Incorrect value "cellClasses" when checking columns.');
            }

            var gridColumn;

            // check first column (multiselect checkbox column)
            assert.equal(0, current.columnIndex, 'Incorrect value "current.columnIndex".');
            assert.isFalse(current.getLastColumnIndex() === current.columnIndex, 'Incorrect value "current.getLastColumnIndex() === current.columnIndex".');
            checkBaseProperties(current.getCurrentColumn(), {
               columnIndex: 0,
               keyProperty: cfg.keyProperty,
               displayProperty: cfg.displayProperty,
               column: {needSearchHighlight: false},
               item: gridData[0],
               template: null,
               cellClasses: 'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow' +
                  ' controls-Grid__row-cell_withRowSeparator_firstRow controls-Grid__row-cell-checkbox' +
                  ' controls-Grid__row-cell_selected controls-Grid__row-cell_selected-default' +
                  ' controls-Grid__row-cell_selected__first-default'
            });

            // check next column
            current.goToNextColumn();
            gridColumn = clone(gridColumns[0]);
            cMerge(gridColumn, {needSearchHighlight: false});
            assert.equal(1, current.columnIndex, 'Incorrect value "current.columnIndex" after "goToNextColumn()".');
            assert.isFalse(current.getLastColumnIndex() === current.columnIndex, 'Incorrect value "current.getLastColumnIndex() === current.columnIndex" after "goToNextColumn()".');
            assert.isTrue(gridColumn.textOverflow === 'ellipsis', 'Incorrect value "current.textOverflow".');
            checkBaseProperties(current.getCurrentColumn(), {
               columnIndex: 1,
               keyProperty: cfg.keyProperty,
               displayProperty: cfg.displayProperty,
               column: gridColumn,
               item: gridData[0],
               template: null,
               cellClasses: 'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow' +
               ' controls-Grid__cell_spacingRight controls-Grid__cell_default controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l ' +
               'controls-Grid__row-cell_selected controls-Grid__row-cell_selected-default'
            });

            // check next column
            current.goToNextColumn();
            gridColumn = clone(gridColumns[1]);
            cMerge(gridColumn, {needSearchHighlight: false});
            assert.equal(2, current.columnIndex, 'Incorrect value "current.columnIndex" after "goToNextColumn()".');
            assert.isFalse(current.getLastColumnIndex() === current.columnIndex, 'Incorrect value "current.getLastColumnIndex() === current.columnIndex" after goToNextColumn().');
            checkBaseProperties(current.getCurrentColumn(), {
               columnIndex: 2,
               keyProperty: cfg.keyProperty,
               displayProperty: cfg.displayProperty,
               column: gridColumn,
               item: gridData[0],
               template: null,
               cellClasses: 'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow' +
               ' controls-Grid__cell_spacingLeft controls-Grid__cell_spacingRight controls-Grid__cell_default controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l' +
               ' controls-Grid__row-cell_selected controls-Grid__row-cell_selected-default'
            });

            // check last column
            current.goToNextColumn();
            gridColumn = clone(gridColumns[2]);
            cMerge(gridColumn, {needSearchHighlight: false});
            assert.equal(3, current.columnIndex, 'Incorrect value "current.columnIndex" after "goToNextColumn()".');
            assert.isTrue(current.getLastColumnIndex() === current.columnIndex, 'Incorrect value "current.getLastColumnIndex() === current.columnIndex" after "gotToNextColumn()".');
            checkBaseProperties(current.getCurrentColumn(), {
               columnIndex: 3,
               keyProperty: cfg.keyProperty,
               displayProperty: cfg.displayProperty,
               column: gridColumn,
               item: gridData[0],
               template: null,
               cellClasses: 'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow controls-Grid__row-cell_withRowSeparator_firstRow' +
               ' controls-Grid__cell_spacingLeft controls-Grid__cell_default controls-Grid__cell_spacingLastCol_l controls-Grid__row-cell_rowSpacingTop_l controls-Grid__row-cell_rowSpacingBottom_l' +
               ' controls-Grid__row-cell_selected controls-Grid__row-cell_selected-default' +
               ' controls-Grid__row-cell_selected__last controls-Grid__row-cell_selected__last-default'
            });

            // check the absence of other columns
            current.goToNextColumn();
            assert.equal(4, current.columnIndex, 'Incorrect value "current.columnIndex" after "goToNextColumn()".');

            // check reset column index and retest first column
            current.resetColumnIndex();

            assert.equal(0, current.columnIndex, 'Incorrect value "current.columnIndex" after "resetColumnIndex()".');
            assert.isFalse(current.getLastColumnIndex() === current.columnIndex, 'Incorrect value "current.getLastColumnIndex() === current.columnIndex" after "resetColumnIndex()".');
            checkBaseProperties(current.getCurrentColumn(), {
               columnIndex: 0,
               keyProperty: cfg.keyProperty,
               displayProperty: cfg.displayProperty,
               column: {needSearchHighlight: false},
               item: gridData[0],
               template: null,
               cellClasses: 'controls-Grid__row-cell controls-Grid__cell_fit controls-Grid__row-cell-background-hover controls-Grid__row-cell_firstRow' +
                  ' controls-Grid__row-cell_withRowSeparator_firstRow controls-Grid__row-cell-checkbox' +
                  ' controls-Grid__row-cell_selected controls-Grid__row-cell_selected-default' +
                  ' controls-Grid__row-cell_selected__first-default'
            });
         });
      });
      describe('methods for processing with items', function() {
         var
            gridViewModel = new gridMod.GridViewModel(cfg);
         it('getColumns', function() {
            assert.deepEqual(gridColumns, gridViewModel.getColumns(), 'Incorrect value "getColumns()".');
         });
         it('setMultiSelectVisibility && getMultiSelectVisibility', function() {
            assert.equal('visible', gridViewModel.getMultiSelectVisibility(), 'Incorrect value "getMultiSelectVisibility()" before "setMultiSelectVisibility()".');
            gridViewModel.setMultiSelectVisibility('');
            assert.equal('', gridViewModel.getMultiSelectVisibility(), 'Incorrect value "getMultiSelectVisibility()" after "setMultiSelectVisibility()".');
            gridViewModel.setMultiSelectVisibility('visible');
            assert.equal('visible', gridViewModel.getMultiSelectVisibility(), 'Incorrect value "getMultiSelectVisibility()" after "setMultiSelectVisibility(visible)".');
         });
         it('methods throwing a call into the model', function() {
            var
               gridViewModel = new gridMod.GridViewModel(cfg),
               callMethods = ['getItemById', 'setMarkedKey', 'reset', 'isEnd', 'goToNext', 'getNext', 'isLast',
                  'updateIndexes', 'setItems', 'setActiveItem', 'appendItems', 'prependItems', 'setItemActions', 'getDragTargetPosition',
                  'getIndexBySourceItem', 'at', 'getCount', 'setSwipeItem', 'getSwipeItem', 'updateSelection', 'getItemActions', 'getCurrentIndex',
                  '_prepareDisplayItemForAdd', 'mergeItems', 'toggleGroup', '_setEditingItemData', 'getMarkedKey',
                  'getChildren','getStartIndex', 'getActiveItem', 'setRightSwipedItem', 'destroy', 'nextModelVersion', 'getEditingItemData'],
               callStackMethods = [];

            gridViewModel._model = {
               getItems: function() {}
            };
            callMethods.forEach(function(item) {
               gridViewModel._model[item] = function() {
                  callStackMethods.push(item);
               };
            });
            gridViewModel._model.subscribe = gridViewModel._model.unsubscribe = function() {};
            callMethods.forEach(function(item) {
               gridViewModel[item]();
            });
            assert.deepEqual(callMethods, callStackMethods, 'Incorrect call stack methods.');
         });
         it('setIndexes return superclass result', function() {
            var gridViewModel = new gridMod.GridViewModel(cfg);
            gridViewModel._model = {
                setIndexes: function() {
                    return 'test_return_value';
                }
            };
            assert.equal(gridViewModel.setIndexes(), 'test_return_value');
         });
      });
      describe('ladder and sticky column', function() {

         // for ladder by date check, ladder field can be any JS type
         var date1 = new Date(2017, 00, 01),
            date2 = new Date(2017, 00, 03),
            date3 = new Date(2017, 00, 05),
            date4 = new Date(2017, 00, 07),
            date5 = new Date(2017, 00, 09),
            initialColumns = [{
               width: '1fr',
               displayProperty: 'title'
            }, {
               width: '1fr',
               template: 'wml!MyTestDir/Photo',
               stickyProperty: 'photo'
            }],
            resultLadder = {
               0: { date: { ladderLength: 1 } },
               1: { date: { ladderLength: 3 } },
               2: { date: { } },
               3: { date: { } },
               4: { date: { ladderLength: 2 } },
               5: { date: { } },
               6: { date: { ladderLength: 1 } },
               7: { date: { ladderLength: 3 } },
               8: { date: { } },
               9: { date: { } }
            },
            resultStickyLadder = {
               0: { ladderLength: 3, headingStyle: 'grid-area: 1 / 1 / span 3 / span 1;' },
               1: { },
               2: { },
               3: { ladderLength: 1 },
               4: { ladderLength: 4, headingStyle: 'grid-area: 5 / 1 / span 4 / span 1;' },
               5: { },
               6: { },
               7: { },
               8: { ladderLength: 1 },
               9: { ladderLength: 1 }
            },
            ladderViewModel = new gridMod.GridViewModel({
               items: new collection.RecordSet({
                  idProperty: 'id',
                  rawData: [
                     { id: 0, title: 'i0', date: date1, photo: '1.png' },
                     { id: 1, title: 'i1', date: date2, photo: '1.png' },
                     { id: 2, title: 'i2', date: date2, photo: '1.png' },
                     { id: 3, title: 'i3', date: date2, photo: '2.png' },
                     { id: 4, title: 'i4', date: date3, photo: '3.png' },
                     { id: 5, title: 'i5', date: date3, photo: '3.png' },
                     { id: 6, title: 'i6', date: date4, photo: '3.png' },
                     { id: 7, title: 'i7', date: date5, photo: '3.png' },
                     { id: 8, title: 'i8', date: date5, photo: '4.png' },
                     { id: 9, title: 'i9', date: date5, photo: '5.png' }
                  ]
               }),
               keyProperty: 'id',
               columns: initialColumns,
               ladderProperties: ['date']
            });
         assert.deepEqual(ladderViewModel._ladder.ladder, resultLadder, 'Incorrect value prepared ladder.');
         assert.deepEqual(ladderViewModel._ladder.stickyLadder, resultStickyLadder, 'Incorrect value prepared stickyLadder.');

         var
            newItems = new collection.RecordSet({
               idProperty: 'id',
               rawData: [
                  { id: 0, title: 'i0', date: '01 янв', photo: '1.png' },
                  { id: 1, title: 'i1', date: '03 янв', photo: '1.png' },
                  { id: 2, title: 'i2', date: '03 янв', photo: '1.png' }
               ]
            }),
            newResultLadder = {
               0: { date: { ladderLength: 1 } },
               1: { date: { ladderLength: 2 } },
               2: { date: { } }
            },
            newResultStickyLadder = {
               0: { ladderLength: 3, headingStyle: 'grid-area: 1 / 1 / span 3 / span 1;' },
               1: { },
               2: { }
            };

         ladderViewModel.setItems(newItems);

         assert.deepEqual(ladderViewModel._ladder.ladder, newResultLadder, 'Incorrect value prepared ladder after setItems.');
         assert.deepEqual(ladderViewModel._ladder.stickyLadder, newResultStickyLadder, 'Incorrect value prepared stickyLadder after setItems.');

         // check ladder and grouping
         var
            groupingLadderViewModel = new gridMod.GridViewModel({
               items: new collection.RecordSet({
                  idProperty: 'id',
                  rawData: [
                     { id: 0, title: 'i0', group: 'g1', date: '01 янв' },
                     { id: 1, title: 'i1', group: 'g1', date: '03 янв' },
                     { id: 2, title: 'i2', group: 'g1', date: '03 янв' },
                     { id: 3, title: 'i3', group: 'g2', date: '03 янв' },
                     { id: 4, title: 'i4', group: 'g2', date: '03 янв' }
                  ]
               }),
               keyProperty: 'id',
               columns: [{
                  width: '1fr',
                  displayProperty: 'title'
               }],
               ladderProperties: ['date'],
               groupingKeyCallback: function(item) {
                  return item.get('group');
               }
            });
         assert.deepEqual(groupingLadderViewModel._ladder.ladder, {
            '0': {
               'date': {}
            },
            '1': {
               'date': {
                  'ladderLength': 1
               }
            },
            '2': {
               'date': {
                  'ladderLength': 2
               }
            },
            '3': {
               'date': {}
            },
            '4': {
               'date': {
                  'ladderLength': 1
               }
            },
            '5': {
               'date': {
                  'ladderLength': 2
               }
            },
            '6': {
               'date': {}
            }
         }, 'Incorrect value prepared ladder with grouping.');
      });
      describe('other methods of the class', function() {
         var
            gridViewModel = new gridMod.GridViewModel(cfg),
            imitateTemplate = function() {};
         it('setColumnTemplate', function() {
            assert.equal(null, gridViewModel._columnTemplate, 'Incorrect value "_columnTemplate" before "setColumnTemplate(imitateTemplate)".');
            gridViewModel.setColumnTemplate(imitateTemplate);
            assert.equal(imitateTemplate, gridViewModel._columnTemplate, 'Incorrect value "_columnTemplate" after "setColumnTemplate(imitateTemplate)".');
         });
         it('getHeader && setHeader', function() {
            assert.deepEqual(gridHeader, gridViewModel.getHeader(), 'Incorrect value "getHeader()" before "setHeader(null)".');
            gridViewModel.setHeader(null);
            assert.equal(null, gridViewModel.getHeader(), 'Incorrect value "getHeader()" after "setHeader(null)".');
            gridViewModel.setHeader(gridHeader);
            assert.deepEqual(gridHeader, gridViewModel.getHeader(), 'Incorrect value "getHeader()" after "setHeader(gridHeader)".');
         });
         it('getColumns && setColumns', function() {
            var newColumns = [{
               displayProperty: 'field1'
            }, {
               displayProperty: 'field2'
            }];
            assert.deepEqual(gridColumns, gridViewModel.getColumns(), 'Incorrect value "getColumns()" before "setColumns(newColumns)".');
            gridViewModel.setColumns(newColumns);
            assert.deepEqual(newColumns, gridViewModel.getColumns(), 'Incorrect value "getColumns()" after "setColumns(newColumns)".');
            gridViewModel.setColumns(gridColumns);
            assert.deepEqual(gridColumns, gridViewModel.getColumns(), 'Incorrect value "getColumns()" before "setColumns(gridColumns)".');
         });

         it('should +1 on row index on rows after editting', function () {

            let native = GridLayoutUtil.isPartialGridSupport;
            GridLayoutUtil.isPartialGridSupport = ()=>true;
            gridViewModel._model._editingItemData = { rowIndex: 1};

            let iData = gridViewModel.getItemDataByItem(gridViewModel.getDisplay().at(2));
            assert.equal(iData.rowIndex, 4);
            GridLayoutUtil.isPartialGridSupport = native;
         });

         it('setEditingItemData', function () {
            let
                called = false,
                nativeFn = gridViewModel._model._setEditingItemData,
                initialStatus = GridLayoutUtil.isPartialGridSupport;

            GridLayoutUtil.isPartialGridSupport = function() { return true };

            gridViewModel._model._setEditingItemData = (iData) => {
               called = true;
               assert.equal(iData.rowIndex, 2);
            };

            gridViewModel._setEditingItemData({
               index: 1
            });
            assert.isTrue(called);

            GridLayoutUtil.isPartialGridSupport = initialStatus;
            gridViewModel._model._setEditingItemData = nativeFn;
         });

         it('getCurrentHeaderColumn && goToNextHeaderColumn && isEndHeaderColumn && resetHeaderColumns', function() {
            gridViewModel._prepareHeaderColumns(gridHeader, true);
            const headerRow = gridViewModel.getCurrentHeaderRow();
            console.log(headerRow.getCurrentHeaderColumn())
            assert.deepEqual({
               column: {},
               cellClasses: 'controls-Grid__header-cell controls-Grid__header-cell_min-height controls-Grid__header-cell-checkbox',
               index: 0,
               cellContentClasses: '',
               cellStyles:`grid-column: 1/2; grid-row: 1/${gridViewModel._maxEndRow};`,
               shadowVisibility: 'visible',
               offsetTop: 0,
            }, headerRow.getCurrentHeaderColumn(), 'Incorrect value first call "getCurrentHeaderColumn()".');

            assert.equal(true, headerRow.isEndHeaderColumn(), 'Incorrect value "isEndHeaderColumn()" after first call "getCurrentHeaderColumn()".');
            headerRow.goToNextHeaderColumn();

            const secondCell = headerRow.getCurrentHeaderColumn().column;

            assert.deepEqual({
               column: gridHeader[0],
               cellClasses: 'controls-Grid__header-cell controls-Grid__header-cell_min-height controls-Grid__cell_spacingRight controls-Grid__cell_default',
               index: 1,
               shadowVisibility: "visible",
               offsetTop: 0,
               cellContentClasses: " control-Grid__cell_header-nowrap",
               cellStyles:`grid-column: ${secondCell.startColumn + 1}/${secondCell.endColumn + 1}; grid-row: ${secondCell.startRow}/${secondCell.endRow};`,
            }, headerRow.getCurrentHeaderColumn(), 'Incorrect value second call "getCurrentHeaderColumn()".');

            assert.equal(
               `grid-column: ${secondCell.startColumn + 1}/${secondCell.endColumn + 1}; grid-row: ${secondCell.startRow}/${secondCell.endRow};`,
               GridLayoutUtil.getMultyHeaderStyles(secondCell.startColumn, secondCell.endColumn, secondCell.startRow, secondCell.endRow, 1),
               'Incorrect headerCellGridStyles'
               )

            assert.equal(true, headerRow.isEndHeaderColumn(), 'Incorrect value "isEndHeaderColumn()" after second call "getCurrentHeaderColumn()".');
            headerRow.goToNextHeaderColumn();

            const thirdCell = headerRow.getCurrentHeaderColumn().column;

            assert.deepEqual({
               column: gridHeader[1],
               cellClasses: 'controls-Grid__header-cell controls-Grid__header-cell_min-height controls-Grid__cell_spacingLeft controls-Grid__cell_spacingRight controls-Grid__cell_default',
               index: 2,
               sortingDirection: 'DESC',
               cellContentClasses: " control-Grid__cell_header-nowrap controls-Grid__header-cell_justify_content_right",
               cellStyles: `grid-column: ${thirdCell.startColumn + 1}/${thirdCell.endColumn + 1}; grid-row: ${thirdCell.startRow}/${thirdCell.endRow};`,
               shadowVisibility: "visible",
               offsetTop: 0
            }, headerRow.getCurrentHeaderColumn(), 'Incorrect value third call "getCurrentHeaderColumn()".');

            assert.equal(
               `grid-column: ${thirdCell.startColumn + 1}/${thirdCell.endColumn + 1}; grid-row: ${thirdCell.startRow}/${thirdCell.endRow};`,
               GridLayoutUtil.getMultyHeaderStyles(thirdCell.startColumn, thirdCell.endColumn, thirdCell.startRow, thirdCell.endRow, 1),
               'Incorrect headerCellGridStyles'
            )

            assert.equal(true, headerRow.isEndHeaderColumn(), 'Incorrect value "isEndHeaderColumn()" after third call "getCurrentHeaderColumn()".');
            headerRow.goToNextHeaderColumn();

            const fourthCell = headerRow.getCurrentHeaderColumn().column;

            assert.deepEqual({
               column: gridHeader[2],
               cellClasses: 'controls-Grid__header-cell controls-Grid__header-cell_min-height controls-Grid__cell_spacingLeft controls-Grid__cell_spacingLastCol_l controls-Grid__cell_default',
               index: 3,
               cellContentClasses: " control-Grid__cell_header-nowrap controls-Grid__header-cell_justify_content_right",
               cellStyles: `grid-column: ${fourthCell.startColumn + 1}/${fourthCell.endColumn + 1}; grid-row: ${fourthCell.startRow}/${fourthCell.endRow};`,
               shadowVisibility: "visible",
               offsetTop: 0
            }, headerRow.getCurrentHeaderColumn(), 'Incorrect value fourth call "getCurrentHeaderColumn()".');

            assert.equal(
               `grid-column: ${fourthCell.startColumn + 1}/${fourthCell.endColumn + 1}; grid-row: ${fourthCell.startRow}/${fourthCell.endRow};`,
               GridLayoutUtil.getMultyHeaderStyles(fourthCell.startColumn, fourthCell.endColumn, fourthCell.startRow, fourthCell.endRow, 1),
               'Incorrect headerCellGridStyles'
            )

            assert.equal(true, headerRow.isEndHeaderColumn(), 'Incorrect value "isEndHeaderColumn()" after fourth call "getCurrentHeaderColumn()".');
            headerRow.goToNextHeaderColumn();
            assert.equal(false, headerRow.isEndHeaderColumn(), 'Incorrect value "isEndHeaderColumn()" after last call "getCurrentHeaderColumn()".');

            assert.equal(4, headerRow.curHeaderColumnIndex, 'Incorrect value "_curHeaderColumnIndex" before "resetHeaderColumns()".');
            headerRow.resetHeaderColumns();
            assert.equal(0, headerRow.curHeaderColumnIndex, 'Incorrect value "_curHeaderColumnIndex" after "resetHeaderColumns()".');
         });
         it('getResultsPosition()', function() {
            assert.deepEqual(undefined, gridViewModel.getResultsPosition(), 'Incorrect value "getResultsPosition()".');
            gridViewModel._options.resultsPosition = 'top'
            assert.deepEqual('top', gridViewModel.getResultsPosition(), 'Incorrect value "getResultsPosition()".');
            let newGridModel = null;
            newGridModel = new gridMod.GridViewModel({
               keyProperty: 'id',
               displayProperty: 'title',
               header: gridHeader,
               columns: gridColumns,
               items: new collection.RecordSet({
                  rawData: [],
                  idProperty: 'id'
               }),
               resultsPosition: 'top'
            })
            assert.deepEqual(undefined, newGridModel.getResultsPosition(), 'Incorrect value "getResultsPosition()".');
            newGridModel = new gridMod.GridViewModel({
               keyProperty: 'id',
               displayProperty: 'title',
               header: gridHeader,
               columns: gridColumns,
               items: new collection.RecordSet({
                  rawData: gridData,
                  idProperty: 'id'
               }),
               resultsPosition: 'top'
            })
            assert.deepEqual('top', newGridModel.getResultsPosition(), 'Incorrect value "getResultsPosition()".');
            assert.isTrue(newGridModel.isDrawResults())
            newGridModel.getItems = () => ({
               getCount: () => [1]
            })
            assert.isFalse(newGridModel.isDrawResults())
         });

         it('is multiheader', function() {

            let gridViewModel = new gridMod.GridViewModel(cfg);
            assert.isFalse(gridViewModel.isMultyHeader([{startRow: 1, endRow: 2}]),"simple header");
            assert.isTrue(gridViewModel.isMultyHeader([{startRow: 1, endRow: 3}]),"multyHeader header");
         });
         it('_prepareHeaderColumns', function() {
            gridViewModel._headerRows = [];
            // gridViewModel._prepareHeaderColumns(gridHeader, false);
            assert.deepEqual([], gridViewModel._headerRows, 'Incorrect value "_headerColumns" before "_prepareHeaderColumns([])" without multiselect.');
            console.log('hello', gridViewModel._headerRows);
            gridViewModel._prepareHeaderColumns([], false);
            assert.deepEqual([], gridViewModel._headerRows, 'Incorrect value "_headerColumns" after "_prepareHeaderColumns([])" without multiselect.');
            gridViewModel._prepareHeaderColumns(gridHeader, false);
            assert.deepEqual([gridHeader], gridViewModel._headerRows, 'Incorrect value "_headerColumns" after "_prepareHeaderColumns(gridHeader)" without multiselect.');
            gridViewModel._prepareHeaderColumns([], true);
            assert.deepEqual([{}], gridViewModel._headerRows, 'Incorrect value "_headerColumns" after "_prepareHeaderColumns([])" with multiselect.');
            gridViewModel._prepareHeaderColumns(gridHeader, true);
            assert.deepEqual([[{}, ...gridHeader]], gridViewModel._headerRows, 'Incorrect value "_headerColumns" after "_prepareHeaderColumns(gridHeader)" with multiselect.');
            gridViewModel._prepareHeaderColumns([{isBreadCrumbs: true}], true);
            assert.isTrue(gridViewModel._headerRows[0][0].hiddenForBreadCrumbs);
         });

         it('_prepareResultsColumns', function() {
            assert.deepEqual([{}].concat(gridColumns), gridViewModel._resultsColumns, 'Incorrect value "_headerColumns" before "_prepareResultsColumns([])" without multiselect.');
            gridViewModel._prepareResultsColumns([], false);
            assert.deepEqual([], gridViewModel._resultsColumns, 'Incorrect value "_resultsColumns" after "_prepareResultsColumns([])" without multiselect.');
            gridViewModel._prepareResultsColumns(gridColumns, false);
            assert.deepEqual(gridColumns, gridViewModel._resultsColumns, 'Incorrect value "_resultsColumns" after "_prepareResultsColumns(gridColumns)" without multiselect.');

            gridViewModel._prepareResultsColumns([], true);
            assert.deepEqual([{}], gridViewModel._resultsColumns, 'Incorrect value "_resultsColumns" after "_prepareResultsColumns([])" with multiselect.');
            gridViewModel._prepareResultsColumns(gridColumns, true);
            assert.deepEqual([{}].concat(gridColumns), gridViewModel._resultsColumns, 'Incorrect value "_resultsColumns" after "_prepareResultsColumns(gridColumns)" with multiselect.');
         });

         it('getFooterStyles without display', function() {
            var
                called = false,
                savedFunc = gridMod.GridViewModel._private.getFooterStyles,
                model = new gridMod.GridViewModel({
                   columns: gridColumns
                });

            gridMod.GridViewModel._private.getFooterStyles = function() {
               called = true;
            };

            model.getDisplay = function() {
               return 123;
            };

            model.getFooterStyles();
            assert.isTrue(called);

            called = false;
            model.getDisplay = function() {
               return null;
            };

            model.getFooterStyles();
            assert.isFalse(called);

            gridMod.GridViewModel._private.getFooterStyles = savedFunc;
         });

         it('getCurrentResultsColumn && goToNextResultsColumn && isEndResultsColumn && resetResultsColumns', function() {
            const offset = gridViewModel._maxEndRow ? (gridViewModel._maxEndRow - 1 ) * gridViewModel._headerCellMinHeight : 0;
            console.log(gridViewModel.getCurrentResultsColumn());
            assert.deepEqual({
               column: {},
               cellClasses: 'controls-Grid__results-cell controls-Grid__results-cell-checkbox',
               index: 0,
            }, gridViewModel.getCurrentResultsColumn(), 'Incorrect value first call "getCurrentResultsColumn()".');

            assert.equal(true, gridViewModel.isEndResultsColumn(), 'Incorrect value "isEndResultsColumn()" after first call "getCurrentResultsColumn()".');
            gridViewModel.goToNextResultsColumn();

            assert.deepEqual({
               column: gridColumns[0],
               cellClasses: 'controls-Grid__results-cell controls-Grid__cell_spacingRight controls-Grid__cell_default',
               index: 1
            }, gridViewModel.getCurrentResultsColumn(), 'Incorrect value second call "getCurrentResultsColumn()".');

            assert.equal(true, gridViewModel.isEndResultsColumn(), 'Incorrect value "isEndResultsColumn()" after second call "getCurrentResultsColumn()".');
            gridViewModel.goToNextResultsColumn();

            assert.deepEqual({
               column: gridColumns[1],
               cellClasses: 'controls-Grid__results-cell controls-Grid__cell_spacingLeft controls-Grid__cell_spacingRight controls-Grid__cell_default',
               index: 2
            }, gridViewModel.getCurrentResultsColumn(), 'Incorrect value third call "getCurrentResultsColumn()".');

            assert.equal(true, gridViewModel.isEndResultsColumn(), 'Incorrect value "isEndResultsColumn()" after third call "getCurrentResultsColumn()".');
            gridViewModel.goToNextResultsColumn();

            assert.deepEqual({
               column: gridColumns[2],
               cellClasses: 'controls-Grid__results-cell controls-Grid__cell_spacingLeft controls-Grid__cell_default controls-Grid__cell_spacingLastCol_l',
               index: 3
            }, gridViewModel.getCurrentResultsColumn(), 'Incorrect value fourth call "getCurrentResultsColumn()".');

            assert.equal(true, gridViewModel.isEndResultsColumn(), 'Incorrect value "isEndResultsColumn()" after fourth call "getCurrentResultsColumn()".');

            gridViewModel.goToNextResultsColumn();
            assert.equal(false, gridViewModel.isEndResultsColumn(), 'Incorrect value "isEndResultsColumn()" after last call "getCurrentResultsColumn()".');

            assert.equal(4, gridViewModel._curResultsColumnIndex, 'Incorrect value "_curResultsColumnIndex" before "resetResultsColumns()".');
            gridViewModel.resetResultsColumns();
            assert.equal(0, gridViewModel._curResultsColumnIndex, 'Incorrect value "_curResultsColumnIndex" after "resetResultsColumns()".');
         });

         it('_prepareColgroupColumns', function() {
            assert.deepEqual([{}].concat(gridColumns), gridViewModel._colgroupColumns, 'Incorrect value "_colgroupColumns" before "_prepareColgroupColumns([])" without multiselect.');
            gridViewModel._prepareColgroupColumns([], false);
            assert.deepEqual([], gridViewModel._colgroupColumns, 'Incorrect value "_colgroupColumns" after "_prepareColgroupColumns([])" without multiselect.');
            gridViewModel._prepareColgroupColumns(gridColumns, false);
            assert.deepEqual(gridColumns, gridViewModel._colgroupColumns, 'Incorrect value "_colgroupColumns" after "_prepareColgroupColumns(gridColumns)" without multiselect.');

            gridViewModel._prepareColgroupColumns([], true);
            assert.deepEqual([{}], gridViewModel._colgroupColumns, 'Incorrect value "_colgroupColumns" after "_prepareColgroupColumns([])" with multiselect.');
            gridViewModel._prepareColgroupColumns(gridColumns, true);
            assert.deepEqual([{}].concat(gridColumns), gridViewModel._colgroupColumns, 'Incorrect value "_colgroupColumns" after "_prepareColgroupColumns(gridColumns)" with multiselect.');
         });

         it('prepareItemDataForPartialSupport', function () {
            let
                groupItemData = {
                   key: '234',
                   isGroup: true,
                   rowIndex: 2
                },
                editingItemData = {
                   key: '234',
                   isEditing: true,
                   rowIndex: 2
                };

            gridViewModel.getColumnsWidthForEditingRow = () => ['1fr', '123px', '321px'];
            gridMod.GridViewModel._private.prepareItemDataForPartialSupport(gridViewModel, editingItemData);
            gridMod.GridViewModel._private.prepareItemDataForPartialSupport(gridViewModel, groupItemData);

            assert.equal(
                editingItemData.getEditingRowStyles(),
                'display: grid; display: -ms-grid; grid-template-columns: max-content 1fr 123px 321px; grid-column: 1 / 2; grid-row: 3;'
            );
            assert.equal(groupItemData.gridGroupStyles, "grid-row: 3; -ms-grid-row: 3;");
         });

         it('prepareColumnsWidth', function () {
            let
                paramItemData = {},
                realWidths = ['1fr', '15px', '16px'],
                calledCallback = false,
                savedColumns = clone(gridViewModel._columns);

            gridViewModel.getColumnsWidthForEditingRow = function (iData) {
               calledCallback = true;
               assert.equal(iData, paramItemData);
               return realWidths;
            };

            gridViewModel.setMultiSelectVisibility('hidden');
            assert.deepEqual(gridMod.GridViewModel._private.prepareColumnsWidth(gridViewModel, paramItemData), realWidths);
            assert.isTrue(calledCallback);

            calledCallback = false;
            gridViewModel.setMultiSelectVisibility('visible');
            assert.deepEqual(gridMod.GridViewModel._private.prepareColumnsWidth(gridViewModel, paramItemData), ['max-content', '1fr', '15px', '16px']);
            assert.isTrue(calledCallback);

            calledCallback = false;
            gridViewModel.setMultiSelectVisibility('hidden');
            gridViewModel.setColumns([{width:'1px'}]);
            assert.deepEqual(gridMod.GridViewModel._private.prepareColumnsWidth(gridViewModel, paramItemData), ['1px']);
            assert.isFalse(calledCallback);

            gridViewModel.setMultiSelectVisibility('visible');
            assert.deepEqual(gridMod.GridViewModel._private.prepareColumnsWidth(gridViewModel, paramItemData), ['max-content', '1px']);
            assert.isFalse(calledCallback);

            calledCallback = false;
            gridViewModel.setMultiSelectVisibility('hidden');
            gridViewModel.setColumns([{width:'minmax(100px, 1fr)'}]);
            assert.deepEqual(gridMod.GridViewModel._private.prepareColumnsWidth(gridViewModel, paramItemData), ['1fr', '15px', '16px']);
            assert.isTrue(calledCallback);

            calledCallback = false;
            gridViewModel.setMultiSelectVisibility('visible');
            gridViewModel.setColumns([{width:'minmax(100px, 1fr)'}]);
            assert.deepEqual(gridMod.GridViewModel._private.prepareColumnsWidth(gridViewModel, paramItemData), ['max-content', '1fr', '15px', '16px']);
            assert.isTrue(calledCallback);

            gridViewModel.setColumns(savedColumns);
         });

         it('getCurrentColgroupColumn && goToNextColgroupColumn && isEndColgroupColumn && resetColgroupColumns', function () {
            assert.deepEqual({
               column: {},
               index: 0,
               style: '',
               multiSelectVisibility: true
            }, gridViewModel.getCurrentColgroupColumn(), 'Incorrect value first call "getCurrentColgroupColumn()".');

            assert.equal(true, gridViewModel.isEndColgroupColumn(), 'Incorrect value "isEndColgroupColumn()" after first call "getCurrentColgroupColumn()".');
            gridViewModel.goToNextColgroupColumn();

            assert.deepEqual({
               column: gridColumns[0],
               index: 1,
               style: 'width: 1fr',
               multiSelectVisibility: true
            }, gridViewModel.getCurrentColgroupColumn(), 'Incorrect value second call "getCurrentColgroupColumn()".');

            assert.equal(true, gridViewModel.isEndColgroupColumn(), 'Incorrect value "isEndColgroupColumn()" after second call "getCurrentColgroupColumn()".');
            gridViewModel.goToNextColgroupColumn();

            assert.deepEqual({
               column: gridColumns[1],
               index: 2,
               style: 'width: auto',
               multiSelectVisibility: true
            }, gridViewModel.getCurrentColgroupColumn(), 'Incorrect value third call "getCurrentColgroupColumn()".');

            assert.equal(true, gridViewModel.isEndColgroupColumn(), 'Incorrect value "isEndColgroupColumn()" after third call "getCurrentColgroupColumn()".');
            gridViewModel.goToNextColgroupColumn();

            assert.deepEqual({
               column: gridColumns[2],
               index: 3,
               style: 'width: auto',
               multiSelectVisibility: true
            }, gridViewModel.getCurrentColgroupColumn(), 'Incorrect value fourth call "getCurrentColgroupColumn()".');

            assert.equal(true, gridViewModel.isEndColgroupColumn(), 'Incorrect value "isEndColgroupColumn()" after fourth call "getCurrentColgroupColumn()".');

            gridViewModel.goToNextColgroupColumn();
            assert.equal(false, gridViewModel.isEndColgroupColumn(), 'Incorrect value "isEndColgroupColumn()" after last call "getCurrentColgroupColumn()".');

            assert.equal(4, gridViewModel._curColgroupColumnIndex, 'Incorrect value "_curColgroupColumnIndex" before "resetColgroupColumns()".');
            gridViewModel.resetColgroupColumns();
            assert.equal(0, gridViewModel._curColgroupColumnIndex, 'Incorrect value "_curColgroupColumnIndex" after "resetColgroupColumns()".');
         });
         it('getColspanForNoGridSupport', function() {
            assert.equal(gridMod.GridViewModel._private.getColspanForNoGridSupport('hidden', true), 1);
            assert.equal(gridMod.GridViewModel._private.getColspanForNoGridSupport('hidden', false), 1);
            assert.equal(gridMod.GridViewModel._private.getColspanForNoGridSupport('visible', true), 2);
            assert.equal(gridMod.GridViewModel._private.getColspanForNoGridSupport('visible', false), 1);
         });
         it('getColspanStyles', function() {
            assert.equal(
               gridMod.GridViewModel._private.getColspanStyles('hidden', 0, 2),
               ' grid-column: 1 / 3;'
            );

            assert.equal(
               gridMod.GridViewModel._private.getColspanStyles('hidden', 1, 2),
               undefined
            );

            // TODO: удалить isHeaderBreadCrumbs после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
            assert.equal(
               gridMod.GridViewModel._private.getColspanStyles('hidden', 0, 2, true),
               ' grid-column: 1 / 2;'
            );

            assert.equal(
               gridMod.GridViewModel._private.getColspanStyles('visible', 0, 2),
               undefined
            );

            assert.equal(
               gridMod.GridViewModel._private.getColspanStyles('visible', 1, 2),
               ' grid-column: 2 / 3;'
            );

            // TODO: удалить isHeaderBreadCrumbs после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
            assert.equal(
               gridMod.GridViewModel._private.getColspanStyles('visible', 1, 2, true),
               ' grid-column: 1 / 3;'
            );
         });
         it('getItemDataByItem: hovered item should be compared by key', function () {
            let current = gridViewModel.getCurrent();
            assert.isFalse(current.isHovered);
            gridViewModel.setHoveredItem(clone(current.item));
            gridViewModel.setItemActions(current.item, [{}, {}, {}]);
            assert.isTrue(gridViewModel.getCurrent().isHovered);
         });
         it('getItemDataByItem: in list one item and it\'s in group. Should draw separator bottom', function () {
            const groupedVM = new gridMod.GridViewModel({
               ...cfg,
               items: new collection.RecordSet({
                  rawData: [
                     {
                        id: 1,
                        group: 'once'
                     }
                  ],
                  idProperty: 'id'
               }),
               groupingKeyCallback: (item) => {
                  return item.get('group')
               },
               rowSeparatorVisibility: true
            });

            groupedVM.goToNext();
            const soloItem = groupedVM.getCurrent();
            assert.isTrue(soloItem.rowSeparatorVisibility);
            assert.equal(
                ' controls-Grid__row-cell_first-row-in-group controls-Grid__row-cell_lastRow controls-Grid__row-cell_withRowSeparator_lastRow',
                gridMod.GridViewModel._private.prepareRowSeparatorClasses(soloItem)
            );

         });
         it('isFixedCell', function() {
            var testCases = [
               {
                  settings: {
                     multiSelectVisibility: 'visible',
                     stickyColumnsCount: 1
                  },
                  tests: [
                     [0, true],
                     [1, true],
                     [2, false]
                  ]
               },
               {
                  settings: {
                     multiSelectVisibility: 'hidden',
                     stickyColumnsCount: 1
                  },
                  tests: [
                     [0, true],
                     [1, false]
                  ]
               },
               {
                  settings: {
                     multiSelectVisibility: 'visible',
                     stickyColumnsCount: 2
                  },
                  tests: [
                     [0, true],
                     [1, true],
                     [2, true],
                     [3, false]
                  ]
               },
               {
                  settings: {
                     multiSelectVisibility: 'hidden',
                     stickyColumnsCount: 2
                  },
                  tests: [
                     [0, true],
                     [1, true],
                     [2, false]
                  ]
               }
            ];

            testCases.forEach(function(t) {
               t.tests.forEach(function(test) {
                  var settings = Object.assign({}, t.settings, { columnIndex: test[0] });
                  assert.strictEqual(
                     gridMod.GridViewModel._private.isFixedCell(settings),
                     test[1],
                     'Expected "' + test[1] + '" for settings ' + JSON.stringify(settings)
                  );
               });
            });
            var firstRow = gridMod.GridViewModel._private.isFixedCell({
               multiSelectVisibility: false,
               stickyColumnsCount: 1,
               columnIndex: 0,
               rowIndex: 0,
               isMultyHeader: true
            })
            assert.isTrue(firstRow);
            var secondRow = gridMod.GridViewModel._private.isFixedCell({
               multiSelectVisibility: false,
               stickyColumnsCount: 1,
               columnIndex: 0,
               rowIndex: 1,
               isMultyHeader: true
            })
            assert.isFalse(secondRow);
         });
         it('getColumnAlignGroupStyles', function () {

            let itemData = {
               hasMultiSelect: false,
               columns: [{}, {}, {}]
            };

            assert.deepEqual(
                gridMod.GridViewModel._private.getColumnAlignGroupStyles(itemData, undefined),
                {
                   left: `grid-column: 1 / 4; -ms-grid-column: 1; -ms-grid-column-span: 3;`,
                   right: ''
                }
            );

            assert.deepEqual(
                gridMod.GridViewModel._private.getColumnAlignGroupStyles(itemData, 2),
                {
                   left: 'grid-column: 1 / 3; -ms-grid-column: 1; -ms-grid-column-span: 2;',
                   right: 'grid-column: 3 / 4; -ms-grid-column: 3; -ms-grid-column-span: 1;'
                }
            );

            itemData.hasMultiSelect = true;
            itemData.columns = [{}, {}, {}, {}];

            assert.deepEqual(
                gridMod.GridViewModel._private.getColumnAlignGroupStyles(itemData, undefined),
                {
                   left: `grid-column: 1 / 5; -ms-grid-column: 1; -ms-grid-column-span: 4;`,
                   right: ''
                }
            );

            assert.deepEqual(
                gridMod.GridViewModel._private.getColumnAlignGroupStyles(itemData, 2),
                {
                   left: 'grid-column: 1 / 4; -ms-grid-column: 1; -ms-grid-column-span: 3;',
                   right: 'grid-column: 4 / 5; -ms-grid-column: 4; -ms-grid-column-span: 1;'
                }
            );


         });

         it('getColspanForColumnScroll', function () {
            assert.deepEqual(
                {
                   fixedColumns: 'grid-column: 1 / 3; -ms-grid-column: 1; -ms-grid-column-span: 2; z-index: 3;',
                   scrollableColumns: 'grid-column: 3 / 11; -ms-grid-column: 3; -ms-grid-column-span: 8; z-index: auto;'
                },
                gridMod.GridViewModel._private.getColspanForColumnScroll({
                   _options: {
                      multiSelectVisibility: 'hidden',
                      columnScroll: true,
                      stickyColumnsCount: 2,
                   },
                   _columns: {length: 10}
                })
            );

            assert.deepEqual(
                {
                   fixedColumns: 'grid-column: 2 / 4; -ms-grid-column: 2; -ms-grid-column-span: 2; z-index: 3;',
                   scrollableColumns: 'grid-column: 4 / 12; -ms-grid-column: 4; -ms-grid-column-span: 8; z-index: auto;'
                },
                gridMod.GridViewModel._private.getColspanForColumnScroll({
                   _options: {
                      multiSelectVisibility: 'visible',
                      columnScroll: true,
                      stickyColumnsCount: 2,
                   },
                   _columns: {length: 10}
                })
            );

         });
      });

      describe('partial grid support', () => {
         let
             nativeIsPartialGridSupport,
             model;

         before(() => {
            nativeIsPartialGridSupport = GridLayoutUtil.isPartialGridSupport;
            GridLayoutUtil.isPartialGridSupport = () => true;
         });
         after(() => {
            GridLayoutUtil.isPartialGridSupport = nativeIsPartialGridSupport;
         });

         beforeEach(() => {
            model = new gridMod.GridViewModel(cfg);
         });
         afterEach(() => {
            model.destroy();
            model = null;
         });

         it('prepareItemDataForPartialSupport', function () {
            let
                groupItemData = {
                   key: '234',
                   isGroup: true,
                   rowIndex: 2
                },
                editingItemData = {
                   key: '234',
                   isEditing: true,
                   rowIndex: 2
                };

            model.getColumnsWidthForEditingRow = () => ['1fr', '123px', '321px'];

            gridMod.GridViewModel._private.prepareItemDataForPartialSupport(model, editingItemData);
            gridMod.GridViewModel._private.prepareItemDataForPartialSupport(model, groupItemData);

            assert.equal(
                editingItemData.getEditingRowStyles(),
                'display: grid; display: -ms-grid; grid-template-columns: max-content 1fr 123px 321px; grid-column: 1 / 2; grid-row: 3;'
            );
            assert.equal(groupItemData.gridGroupStyles, "grid-row: 3; -ms-grid-row: 3;");
         });


         it('getEditingRowStyles in empty grid can use real template columns', function () {
            model = new gridMod.GridViewModel({
               ...cfg,
               header: null,
               items: new collection.RecordSet({
                  rawData: [],
                  idProperty: 'id'
               })
            });

            let
                groupItemData = {
                   key: '234',
                   isGroup: true,
                   rowIndex: 2
                },
                editingItemData = {
                   key: '234',
                   isEditing: true,
                   rowIndex: 2
                };

            model.getColumnsWidthForEditingRow = () => ['1fr', '123px', '321px'];

            gridMod.GridViewModel._private.prepareItemDataForPartialSupport(model, editingItemData);
            gridMod.GridViewModel._private.prepareItemDataForPartialSupport(model, groupItemData);

            assert.equal(
                editingItemData.getEditingRowStyles(),
                'display: grid; display: -ms-grid; grid-template-columns: max-content 1fr 123px 321px; grid-column: 1 / 4; grid-row: 3;'
            );
            assert.equal(groupItemData.gridGroupStyles, "grid-row: 3; -ms-grid-row: 3;");

         });

         describe('getEmptyTemplateStyles', () => {
            describe('IE', () => {
               let nativeDetection;
               before(() => {
                  nativeDetection = clone(Env.detection);
                  Env.detection = { isIE: true };
               });
               after(() => {
                  Env.detection = nativeDetection;
               });

               it('no checkbox && has header && results in top', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._setHeader([{}]);
                  model._options.resultsPosition = 'top';
                  assert.equal(
                      'grid-column: 1 / 4; grid-row: 3; -ms-grid-column: 1; -ms-grid-row: 3; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });
               it('has checkbox && has header && results in top', () => {
                  model.setMultiSelectVisibility('visible');
                  model._setHeader([{}]);
                  model._options.resultsPosition = 'top';
                  assert.equal(
                      'grid-column: 2 / 5; grid-row: 3; -ms-grid-column: 2; -ms-grid-row: 3; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });
               it('no checkbox && hasn\'t header && results in top', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._header = null;
                  model._options.resultsPosition = 'top';
                  assert.equal(
                      'grid-column: 1 / 4; grid-row: 2; -ms-grid-column: 1; -ms-grid-row: 2; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });
               it('has checkbox && hasn\'t header && results in top', () => {
                  model.setMultiSelectVisibility('visible');
                  model._header = null;
                  model._options.resultsPosition = 'top';
                  assert.equal(
                      'grid-column: 2 / 5; grid-row: 2; -ms-grid-column: 2; -ms-grid-row: 2; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });

               it('no checkbox && has header && results in bottom', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._setHeader([{}]);
                  model._options.resultsPosition = 'bottom';
                  assert.equal(
                      'grid-column: 1 / 4; grid-row: 2; -ms-grid-column: 1; -ms-grid-row: 2; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });
               it('has checkbox && has header && results in bottom', () => {
                  model.setMultiSelectVisibility('visible');
                  model._setHeader([{}]);
                  model._options.resultsPosition = 'bottom';
                  assert.equal(
                      'grid-column: 2 / 5; grid-row: 2; -ms-grid-column: 2; -ms-grid-row: 2; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });
               it('no checkbox && hasn\'t header && results in bottom', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._header = null;
                  model._options.resultsPosition = 'bottom';
                  assert.equal(
                      'grid-column: 1 / 4; grid-row: 1; -ms-grid-column: 1; -ms-grid-row: 1; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });
               it('has checkbox && hasn\'t header && results in bottom', () => {
                  model.setMultiSelectVisibility('visible');
                  model._header = null;
                  model._options.resultsPosition = 'bottom';
                  assert.equal(
                      'grid-column: 2 / 5; grid-row: 1; -ms-grid-column: 2; -ms-grid-row: 1; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });

               it('no checkbox && has header && no results', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._setHeader([{}]);
                  model._options.resultsPosition = null;
                  assert.equal(
                      'grid-column: 1 / 4; grid-row: 2; -ms-grid-column: 1; -ms-grid-row: 2; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });
               it('has checkbox && has header && no results', () => {
                  model.setMultiSelectVisibility('visible');
                  model._setHeader([{}]);
                  model._options.resultsPosition = null;
                  assert.equal(
                      'grid-column: 2 / 5; grid-row: 2; -ms-grid-column: 2; -ms-grid-row: 2; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });
               it('no checkbox && hasn\'t header && no results', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._header = null;
                  model._options.resultsPosition = null;
                  assert.equal(
                      'grid-column: 1 / 4; grid-row: 1; -ms-grid-column: 1; -ms-grid-row: 1; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });
               it('has checkbox && hasn\'t header && no results', () => {
                  model.setMultiSelectVisibility('visible');
                  model._header = null;
                  model._options.resultsPosition = null;
                  assert.equal(
                      'grid-column: 2 / 5; grid-row: 1; -ms-grid-column: 2; -ms-grid-row: 1; -ms-grid-column-span: 3;',
                      model.getEmptyTemplateStyles()
                  );
               });

            });
            describe('other old browsers', () => {
               it('no checkbox && has header && results in top', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._setHeader([{}]);
                  model._options.resultsPosition = 'top';
                  assert.equal('grid-column: 1 / 4; grid-row: 3;', model.getEmptyTemplateStyles());
               });
               it('has checkbox && has header && results in top', () => {
                  model.setMultiSelectVisibility('visible');
                  model._setHeader([{}]);
                  model._options.resultsPosition = 'top';
                  assert.equal('grid-column: 2 / 5; grid-row: 3;', model.getEmptyTemplateStyles());
               });
               it('no checkbox && hasn\'t header && results in top', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._header = null;
                  model._options.resultsPosition = 'top';
                  assert.equal('grid-column: 1 / 4; grid-row: 2;', model.getEmptyTemplateStyles());
               });
               it('has checkbox && hasn\'t header && results in top', () => {
                  model.setMultiSelectVisibility('visible');
                  model._header = null;
                  model._options.resultsPosition = 'top';
                  assert.equal('grid-column: 2 / 5; grid-row: 2;', model.getEmptyTemplateStyles());
               });

               it('no checkbox && has header && results in bottom', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._setHeader([{}]);
                  model._options.resultsPosition = 'bottom';
                  assert.equal('grid-column: 1 / 4; grid-row: 2;', model.getEmptyTemplateStyles());
               });
               it('has checkbox && has header && results in bottom', () => {
                  model.setMultiSelectVisibility('visible');
                  model._setHeader([{}]);
                  model._options.resultsPosition = 'bottom';
                  assert.equal('grid-column: 2 / 5; grid-row: 2;', model.getEmptyTemplateStyles());
               });
               it('no checkbox && hasn\'t header && results in bottom', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._header = null;
                  model._options.resultsPosition = 'bottom';
                  assert.equal('grid-column: 1 / 4; grid-row: 1;', model.getEmptyTemplateStyles());
               });
               it('has checkbox && hasn\'t header && results in bottom', () => {
                  model.setMultiSelectVisibility('visible');
                  model._header = null;
                  model._options.resultsPosition = 'bottom';
                  assert.equal('grid-column: 2 / 5; grid-row: 1;', model.getEmptyTemplateStyles());
               });

               it('no checkbox && has header && no results', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._setHeader([{}]);
                  model._options.resultsPosition = null;
                  assert.equal('grid-column: 1 / 4; grid-row: 2;', model.getEmptyTemplateStyles());
               });
               it('has checkbox && has header && no results', () => {
                  model.setMultiSelectVisibility('visible');
                  model._setHeader([{}]);
                  model._options.resultsPosition = null;
                  assert.equal('grid-column: 2 / 5; grid-row: 2;', model.getEmptyTemplateStyles());
               });
               it('no checkbox && hasn\'t header && no results', () => {
                  model.setMultiSelectVisibility('hidden');
                  model._header = null;
                  model._options.resultsPosition = null;
                  assert.equal('grid-column: 1 / 4; grid-row: 1;', model.getEmptyTemplateStyles());
               });
               it('has checkbox && hasn\'t header && no results', () => {
                  model.setMultiSelectVisibility('visible');
                  model._header = null;
                  model._options.resultsPosition = null;
                  assert.equal('grid-column: 2 / 5; grid-row: 1;', model.getEmptyTemplateStyles());
               });
            });
         });

         it('hovered item should have prefix "HOVERED_" in version', function () {
            model._model._calcItemVersion = () => '';

            let
                hoveredItem = model.getDisplay().at(0),
                notHoveredItem = model.getDisplay().at(1);

            model.setHoveredItem(hoveredItem);
            assert.equal('HOVERED_', model._calcItemVersion(hoveredItem, hoveredItem.key));

            assert.equal('', model._calcItemVersion(notHoveredItem, notHoveredItem.key));
         });

      });
      describe('no grid support', () => {
         let
             nativeIsPartialGridSupport,
             nativeIsNoGridSupport,
             model;

         before(() => {
            nativeIsPartialGridSupport = GridLayoutUtil.isPartialGridSupport;
            nativeIsNoGridSupport = GridLayoutUtil.isPartialGridSupport;
            GridLayoutUtil.isPartialGridSupport = () => false;
            GridLayoutUtil.isNoGridSupport = () => true;
         });
         after(() => {
            GridLayoutUtil.isPartialGridSupport = nativeIsPartialGridSupport;
            GridLayoutUtil.isNoGridSupport = nativeIsNoGridSupport;
         });

         beforeEach(() => {
            model = new gridMod.GridViewModel(cfg);
         });
         afterEach(() => {
            model.destroy();
            model = null;
         });

         it('getColspan', function () {
            let itemData = {
               columns: {
                  length: 5
               },
               multiSelectVisibility: 'hidden'
            };
            assert.equal(1, gridMod.GridViewModel._private.getColspan(itemData));
            assert.equal(1, gridMod.GridViewModel._private.getColspan(itemData, false));
            assert.equal(5, gridMod.GridViewModel._private.getColspan(itemData, true));
            itemData.multiSelectVisibility = 'visible';
            assert.equal(4, gridMod.GridViewModel._private.getColspan(itemData, true));
         });

         it('_prepareCrossBrowserColumn', function () {
            const initialColumns = [
               {title: 'first', width: ''},
               {title: 'second', compatibleWidth: '100px', width: '1fr'},
               {title: 'third', width: '100px'},
               {title: 'fourth', width: 'max-content', compatibleWidth: '12%' },
               {title: 'last', width: 'auto'}
            ];
            const resultColumns = [
               {title: 'first', width: 'auto'},
               {title: 'second', width: '100px', compatibleWidth: '100px'},
               {title: 'third', width: '100px'},
               {title: 'fourth', width: '12%', compatibleWidth: '12%'},
               {title: 'last', width: 'auto'}
            ];

            for (let i = 0; i < initialColumns.length; i++) {
               assert.deepEqual(
                   resultColumns[i],
                   model._prepareCrossBrowserColumn(initialColumns[i]),
                   'Incorrect result "_prepareCrossBrowserColumn(initialColumns[' + i + '])".'
               );
            }

         });

      });

   });
});
