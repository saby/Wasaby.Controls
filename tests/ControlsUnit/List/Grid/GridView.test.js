define(['Controls/grid'], function(gridMod) {
   var
      gridColumns = [
         {
            displayProperty: 'title'
         },
         {
            displayProperty: 'price',
            width: 'auto'
         },
         {
            displayProperty: 'balance',
            width: '100px'
         },
         {
            displayProperty: 'rest',
            width: '1fr'
         }
      ],
      gridHeader = [
         {
            title: '',
            style: 'default',
            startRow: 1,
            endRow: 3,
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
         },
         {
            title: 'Что-то',
            align: 'right',
            style: 'default',
            startRow: 2,
            endRow: 3,
            startColumn: 2,
            endColumn: 3
         },
         {
            title: 'еще',
            align: 'right',
            style: 'default',
            startRow: 2,
            endRow: 3,
            startColumn: 3,
            endColumn: 4
         }
      ],
      preparedColumnsWithMultiselect = 'grid-template-columns: max-content 1fr auto 100px 1fr;',
      preparedColumnsWithoutMiltiselect = 'grid-template-columns: 1fr auto 100px 1fr;';

   describe('Controls.List.Grid.GridView', function() {
      it('GridView.prepareGridTemplateColumns', function() {
         assert.equal(preparedColumnsWithMultiselect, gridMod.GridView._private.getGridTemplateColumns(gridColumns, true),
            'Incorrect result "prepareGridTemplateColumns with checkbox".');
         assert.equal(preparedColumnsWithoutMiltiselect, gridMod.GridView._private.getGridTemplateColumns(gridColumns, false),
            'Incorrect result "prepareGridTemplateColumns without checkbox".');
      });
      it('Footer', function() {
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_withCheckboxes',
            gridMod.GridView._private.calcFooterPaddingClass({ multiSelectVisibility: 'onhover', itemPadding: { left: 'S' } }),
            'Incorrect result "calcFooterPaddingClass({multiSelectVisibility: onhover, itemPadding: left: S})".');
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_withCheckboxes',
            gridMod.GridView._private.calcFooterPaddingClass({ multiSelectVisibility: 'visible', itemPadding: { left: 'S' } }),
            'Incorrect result "calcFooterPaddingClass({multiSelectVisibility: visible, itemPadding: left: S})".');
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_s',
            gridMod.GridView._private.calcFooterPaddingClass({ itemPadding: { left: 'S' } }),
            'Incorrect result "calcFooterPaddingClass({itemPadding: left: S})".');
         assert.equal('controls-GridView__footer controls-GridView__footer__paddingLeft_default',
            gridMod.GridView._private.calcFooterPaddingClass({ }),
            'Incorrect result "calcFooterPaddingClass({ })".');
      });
      it('beforeUpdate', function() {
         var
            superclassBeforeUpdateCalled = false,
            cfg = {
               columns: [
                  { displayProperty: 'field1', template: 'column1' },
                  { displayProperty: 'field2', template: 'column2' }
               ]
            },
            gridView = new gridMod.GridView(cfg),
            superclassBeforeUpdate = gridMod.GridView.superclass._beforeUpdate;
         gridView.saveOptions(cfg);
         gridMod.GridView.superclass._beforeUpdate = function() {
            superclassBeforeUpdateCalled = true;
            superclassBeforeUpdate.apply(this, arguments);
         };
         gridView._beforeUpdate(cfg);
         gridMod.GridView.superclass._beforeUpdate = superclassBeforeUpdate;
         assert.isTrue(superclassBeforeUpdateCalled, 'Superclass method not called in "_beforeUpdate".');
      });
      it('afterMount and beforePaint', function() {
         var
            cfg = {
               columns: [
                  { displayProperty: 'field1', template: 'column1' },
                  { displayProperty: 'field2', template: 'column2' }
               ]
            },
            gridView = new gridMod.GridView(cfg);

            gridView.saveOptions(cfg);
            gridView._options.header = [{}, {}, {}]
            let setHeightWasCalled = false
            gridView._isHeaderChanged = false;
            gridView._afterMount = () => {
               if (gridView._options.header && gridView._listModel._isMultyHeader && gridView._listModel.isStickyHeader()) {
                  gridView._listModel.setHeaderCellMinHeight(gridView._setHeaderWithHeight());
               }
               gridView._isHeaderChanged = true
            }

            gridView._listModel = {
               _isMultyHeader: true,
               isStickyHeader: () => true,
               setHeaderCellMinHeight: (header) => header.length,
               _isMultyHeader: true,
               isDrawHeaderWithEmtyList: () => true
            }
            gridView._setHeaderWithHeight = () => {
               setHeightWasCalled = true;
               return [{}, {}, {}, {}]
            }
            gridView._afterMount();
            assert.isTrue(gridView._isHeaderChanged)
            gridView._beforePaint()
            assert.isFalse(gridView._isHeaderChanged)
      });

      it('resultPosition update', function(){
         let gridView = new gridMod.GridView({resultsPosition: 'top'});
         let setResultPosinionCalled = false;
         gridView._listModel = {setResultsPosition: function() {
               setResultPosinionCalled = true;
            }};
         gridView._beforeUpdate({resultsPosition: 'bottom'});
         assert.isTrue(setResultPosinionCalled, 'setPesultPosinion');
      });
      it('fill itemsContainer from separated columns', function () {

         let
             realItemsContainer = {},
             refOnRealItemsContainer = realItemsContainer,
             partialGridView = {
                _options: {
                   multiSelectVisibility: 'hidden'
                },
                _listModel: {
                   getColumns: () => [{}, {}]
                },
                _itemsContainerForPartialSupport: refOnRealItemsContainer,
                _container: {
                   getElementsByClassName: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
             };

         gridMod.GridView._private.fillItemsContainerForPartialSupport(partialGridView);

         assert.equal(refOnRealItemsContainer, realItemsContainer);
         assert.deepEqual([1,3,5,7,9], realItemsContainer.children);

      });

      it('getGridTemplateColumns', function () {
         var
             columns = [
                {displayProperty: 'field1', width: '1fr'},
                {displayProperty: 'field2', width: 'auto'},
                {displayProperty: 'field3'},
             ];

         assert.equal(gridMod.GridView._private.getGridTemplateColumns(columns, true), 'grid-template-columns: max-content 1fr auto 1fr;');
         assert.equal(gridMod.GridView._private.getGridTemplateColumns(columns, false), 'grid-template-columns: 1fr auto 1fr;');
      });

      it('getColumnsWidthForEditingRow', function () {

         let
             gridView = new gridMod.GridView({}),
             testFallback = false;

         gridView = {
            _options: {
               multiSelectVisibility: 'hidden',
               columns: [
                  {displayProperty: 'field1', width: '1fr'},
                  {displayProperty: 'field2', width: 'auto'},
                  {displayProperty: 'field3'},
               ]
            },
            _listModel: {
               getHeader: () => [],
               getCount: () => 1
            },
            _container: {
               getElementsByClassName: function (className) {
                  if (className === 'controls-Grid__header-cell') {
                     return [
                        {
                           getBoundingClientRect: () => {
                              return {width: 10}
                           }
                        },
                        {
                           getBoundingClientRect: () => {
                              return {width: 11}
                           }
                        },
                        {
                           getBoundingClientRect: () => {
                              return {width: 12}
                           }
                        },
                        {
                           getBoundingClientRect: () => {
                              return {width: 13}
                           }
                        },
                     ]
                  } else if (className === 'controls-Grid__row-cell') {
                     return [
                        {
                           getBoundingClientRect: () => {
                              return {width: 20}
                           }
                        },
                        {
                           getBoundingClientRect: () => {
                              return {width: 21}
                           }
                        },
                        {
                           getBoundingClientRect: () => {
                              return {width: 22}
                           }
                        },
                        {
                           getBoundingClientRect: () => {
                              return {width: 23}
                           }
                        },
                     ]
                  }
               },
               querySelectorAll: function(selector) {
                  if (testFallback) {
                     return [];
                  }
                  if (selector === '.controls-Grid__row-cell[data-r="0"]') {
                     return [
                        {
                           getBoundingClientRect: () => {
                              return {width: 20}
                           }
                        },
                        {
                           getBoundingClientRect: () => {
                              return {width: 21}
                           }
                        },
                        {
                           getBoundingClientRect: () => {
                              return {width: 22}
                           }
                        },
                        {
                           getBoundingClientRect: () => {
                              return {width: 23}
                           }
                        },
                     ];
                  }
               }
            }
         };


         assert.deepEqual(gridMod.GridView._private.getColumnsWidthForEditingRow(gridView, {}), ['10px', '11px', '12px']);

         gridView._options.multiSelectVisibility = 'visible';
         assert.deepEqual(gridMod.GridView._private.getColumnsWidthForEditingRow(gridView, {}), ['11px', '12px', '13px']);

         gridView._listModel.getCount = () => 0;
         assert.deepEqual(gridMod.GridView._private.getColumnsWidthForEditingRow(gridView, {}), ['11px', '12px', '13px']);

         gridView._listModel.getCount = () => 1;
         gridView._listModel.getHeader = () => null;
         assert.deepEqual(gridMod.GridView._private.getColumnsWidthForEditingRow(gridView, {}), ['21px', '22px', '23px']);

         testFallback = true;
         assert.deepEqual(gridMod.GridView._private.getColumnsWidthForEditingRow(gridView, {}), ['21px', '22px', '23px']);

         gridView._listModel.getCount = () => 0;
         gridView._listModel.getHeader = () => null;
         assert.deepEqual(gridMod.GridView._private.getColumnsWidthForEditingRow(gridView, {}), ['1fr', 'auto', '1fr']);
      });

      it('getNoColspanRowCells', () => {
         const
            row1 = [{}],
            row2 = [{}, {}],
            row3 = [{}, {}, {}],
            container = {
               querySelectorAll: (selector) => {
                  if (selector.indexOf('data-r="0"') >= 0) {
                     return row1;
                  } else if (selector.indexOf('data-r="1"') >= 0) {
                     return row2;
                  } else if (selector.indexOf('data-r="2"') >= 0) {
                     return row3;
                  }
                  return [];
               }
            };

         assert.strictEqual(
            gridMod.GridView._private.getNoColspanRowCells(null, container, [{}], false),
            row1,
            'failed scenario: 1 column, no multiselect'
         );

         assert.strictEqual(
            gridMod.GridView._private.getNoColspanRowCells(null, container, [{}], true),
            row2,
            'failed scenario: 1 column, multiselect'
         );

         assert.strictEqual(
            gridMod.GridView._private.getNoColspanRowCells(null, container, [{}, {}], false),
            row2,
            'failed scenario: 2 columns, no multiselect'
         );

         assert.strictEqual(
            gridMod.GridView._private.getNoColspanRowCells(null, container, [{}, {}, {}], false),
            row3,
            'failed scenario: 3 columns, no multiselect'
         );

         assert.deepEqual(
            gridMod.GridView._private.getNoColspanRowCells(null, container, [{}, {}, {}], true),
            [],
            'failed scenario: 3 column, multiselect (more columns than exist in the grid)'
         );

         assert.deepEqual(
            gridMod.GridView._private.getNoColspanRowCells(null, container, [{}, {}, {}, {}], false),
            [],
            'failed scenario: 4 columns, no multiselect (more columns than exist in the grid)'
         );
      });

      it('_setHeaderWithHeight', function () {
         let
            cfg = {
               columns: [
                  { displayProperty: 'field1', template: 'column1' },
                  { displayProperty: 'field2', template: 'column2' }
               ],
               header: gridHeader,
               multiSelectVisibility: 'hidden',
            },
            gridView = new gridMod.GridView(cfg);
            gridView.saveOptions(cfg);

         gridView. _listModel = {
            getResultsPosition: function() {
               return null
            }
         };
         let i = 0;
         const queryCells = function() {
            const cur = gridHeader[i];
            return {
               offsetTop: (cur.startRow - 1) * 20,
               offsetHeight: (cur.endRow - cur.startRow) * 20
            }
         }
         gridView._container = {
            offsetTop: 0,
            querySelector: function() {
               const obj = queryCells();
               i++;
               return obj;
            },
            getElementsByClassName: function (className) {
               if (className === 'controls-Grid__header') {
                  return [
                     {
                        childNodes: [
                           {
                              offsetHeight: 40,
                           },
                           {
                              offsetHeight: 20,
                           },
                           {
                              offsetHeight: 20,
                           },
                           {
                              offsetHeight: 20,
                           },
                           {
                              offsetHeight: 20,
                           },
                        ]
                     }
                  ];
               } else if (className === 'controls-Grid__results') {
                  return [
                     {
                        childNodes: [
                           {
                              offsetTop: 40,
                           },
                           {
                              offsetTop: 40,
                           },
                           {
                              offsetTop: 40,
                           },
                           {
                              offsetTop: 40,
                           },
                           {
                              offsetTop: 40,
                           },
                        ]
                     }
                  ];
               }
            }
         };

         const expectedResult = [
            {endColumn: 2, endRow: 3, height: 40, offsetTop: 0, startColumn: 1, startRow: 1, style: "default", title: ""},
            {align: "right", endColumn: 3, endRow: 2, height: 20, offsetTop: 0, sortingProperty: "price", startColumn: 2, startRow: 1, style: "default", title: "Цена"},
            {align: "right", endColumn: 4, endRow: 2, height: 20, offsetTop: 0, startColumn: 3, startRow: 1, style: "default", title: "Остаток"},
            {align: "right", endColumn: 3, endRow: 3, height: 20, offsetTop: 20, startColumn: 2, startRow: 2, style: "default", title: "Что-то"},
            {align: "right", endColumn: 4, endRow: 3, height: 20, offsetTop: 20, startColumn: 3, startRow: 2, style: "default", title: "еще"}
         ];

         assert.deepEqual(gridView._setHeaderWithHeight(), [
            expectedResult,
            0
         ]);
         i = 0;
         gridView. _listModel = {
            getResultsPosition: function() {
               return 'top';
            }
         };
         assert.deepEqual(gridView._setHeaderWithHeight(), [
            expectedResult,
            40
         ]);
      });
      it('resize on list changed with column scroll', function() {
         let cfg = {
               columns: [
                  { displayProperty: 'field1', template: 'column1' },
                  { displayProperty: 'field2', template: 'column2' }
               ]
            },
            gridView = new gridMod.GridView(cfg),
            columnScrollResizeHandlerCalled = false,
            controlResizeNotified = false;
         gridView._children = {
            columnScroll:{
               _resizeHandler: function() {
                  columnScrollResizeHandlerCalled = true;
               }
            }
         };
         gridView._notify = function(e) {
            if (e === 'controlResize') {
               controlResizeNotified = true;
            }
         };
         gridView.resizeNotifyOnListChanged();
         assert.isTrue(controlResizeNotified);
         assert.isTrue(columnScrollResizeHandlerCalled);
      });
   });
});
