define(['Controls/List/Tree/TreeViewModel', 'Core/core-merge', 'WS.Data/Collection/RecordSet', 'WS.Data/Collection/IBind'], function(TreeViewModel, cMerge, RecordSet, IBindCollection) {
   function MockedDisplayItem(cfg) {
      var
         self = this;
      this._id = cfg.id;
      this._isNode = cfg.isNode;
      this.isNode = function() {
         return this._isNode;
      };
      this.getContents = function() {
         return {
            getId: function() {
               return self._id;
            },
            get: function() {
               return self._isNode;
            }
         };
      };
   }
   /*
      123
         234
            1 (лист)
            2 (лист)
            3 (пустая папка)
      345 (лист)
      456 (лист)
      567 (лист)
   */
   var
      treeData = [
         {
            'id': '123',
            'title': 'Хлеб',
            'price': 50,
            'parent': null,
            'parent@': true,
            'balance': 15
         },
         {
            'id': '234',
            'title': 'Батон',
            'price': 150,
            'parent': '123',
            'parent@': true,
            'balance': 3
         },
         {
            'id': '1',
            'title': 'один',
            'parent': '234',
            'parent@': false
         },
         {
            'id': '2',
            'title': 'два',
            'parent': '234',
            'parent@': false
         },
         {
            'id': '3',
            'title': 'три',
            'parent': '234',
            'parent@': true
         },
         {
            'id': '345',
            'title': 'Масло',
            'price': 100,
            'parent': null,
            'parent@': true,
            'balance': 5
         },
         {
            'id': '456',
            'title': 'Помидор',
            'price': 75,
            'parent': null,
            'parent@': null,
            'balance': 7
         },
         {
            'id': '567',
            'title': 'Капуста китайская',
            'price': 35,
            'parent': null,
            'parent@': null,
            'balance': 2
         }
      ],
      cfg = {
         keyProperty: 'id',
         displayProperty: 'title',
         parentProperty: 'parent',
         nodeProperty: 'parent@',
         items: new RecordSet({
            rawData: treeData,
            idProperty: 'id'
         })
      };

   describe('Controls.List.Tree.TreeViewModel', function() {
      describe('"_private" block', function() {
         var
            treeViewModel = new TreeViewModel(cfg);
         it('isVisibleItem', function() {
            var
               item = treeViewModel.getItemById('123', cfg.keyProperty),
               itemChild;
            assert.isTrue(TreeViewModel._private.isVisibleItem.call({
               expandedItems: treeViewModel._expandedItems,
               keyProperty: treeViewModel._options.keyProperty
            }, item), 'Invalid value "isVisibleItem(123)".');
            treeViewModel.toggleExpanded(item, true);
            itemChild = treeViewModel.getItemById('234', cfg.keyProperty);
            assert.isTrue(TreeViewModel._private.isVisibleItem.call({
               expandedItems: treeViewModel._expandedItems,
               keyProperty: treeViewModel._options.keyProperty
            }, itemChild), 'Invalid value "isVisibleItem(234)".');
            treeViewModel.toggleExpanded(item, false);
            assert.isFalse(TreeViewModel._private.isVisibleItem.call({
               expandedItems: treeViewModel._expandedItems,
               keyProperty: treeViewModel._options.keyProperty
            }, itemChild), 'Invalid value "isVisibleItem(234)".');
         });
         it('displayFilter', function() {
            var
               item = treeViewModel.getItemById('123', cfg.keyProperty),
               itemChild;
            assert.isTrue(TreeViewModel._private.displayFilterTree.call({
               expandedItems: treeViewModel._expandedItems,
               keyProperty: treeViewModel._options.keyProperty
            }, item.getContents(), 0, item), 'Invalid value "displayFilterTree(123)".');
            treeViewModel.toggleExpanded(item, true);
            itemChild = treeViewModel.getItemById('234', cfg.keyProperty);
            assert.isTrue(TreeViewModel._private.displayFilterTree.call({
               expandedItems: treeViewModel._expandedItems,
               keyProperty: treeViewModel._options.keyProperty
            }, itemChild.getContents(), 1, itemChild), 'Invalid value "displayFilterTree(234)".');
            treeViewModel.toggleExpanded(item, false);
            assert.isFalse(TreeViewModel._private.displayFilterTree.call({
               expandedItems: treeViewModel._expandedItems,
               keyProperty: treeViewModel._options.keyProperty
            }, itemChild.getContents(), 1, itemChild), 'Invalid value "displayFilterTree(234)".');
         });
         it('getDisplayFilter', function() {
            assert.isTrue(TreeViewModel._private.getDisplayFilter(treeViewModel._expandedItems, treeViewModel._options).length === 1,
               'Invalid filters count prepared by "getDisplayFilter".');
            treeViewModel = new TreeViewModel(cMerge({itemsFilterMethod: function() {return true;}}, cfg));
            assert.isTrue(TreeViewModel._private.getDisplayFilter(treeViewModel._expandedItems, treeViewModel._options).length === 2,
               'Invalid filters count prepared by "getDisplayFilter" with "itemsFilterMethod".');
         });
         it('shouldDrawExpander', function() {
            var
               testsShouldDrawExpander = [{
                  itemData: {
                     item: {
                        get: function() {
                           return null;
                        }
                     }
                  }
               }, {
                  itemData: {
                     item: {
                        get: function() {
                           return null;
                        }
                     }
                  },
                  expanderIcon: 'testIcon'
               }, {
                  itemData: {
                     item: {
                        get: function() {
                           return null;
                        }
                     }
                  },
                  expanderIcon: 'none'
               }, {
                  itemData: {
                     item: {
                        get: function() {
                           return false;
                        }
                     }
                  }
               }, {
                  itemData: {
                     item: {
                        get: function() {
                           return false;
                        }
                     }
                  },
                  expanderIcon: 'testIcon'
               }, {
                  itemData: {
                     item: {
                        get: function() {
                           return false;
                        }
                     }
                  },
                  expanderIcon: 'none'
               }, {
                  itemData: {
                     item: {
                        get: function() {
                           return true;
                        }
                     }
                  }
               }, {
                  itemData: {
                     item: {
                        get: function() {
                           return true;
                        }
                     }
                  },
                  expanderIcon: 'testIcon'
               }, {
                  itemData: {
                     item: {
                        get: function() {
                           return true;
                        }
                     }
                  },
                  expanderIcon: 'none'
               }],
               testsResultShouldDrawExpander = [false, false, false, true, true, false, true, true, false];
            testsShouldDrawExpander.forEach(function(item, i) {
               assert.equal(TreeViewModel._private.shouldDrawExpander(testsShouldDrawExpander[i].itemData, testsShouldDrawExpander[i].expanderIcon),
                  testsResultShouldDrawExpander[i],
                  'Invalid value "shouldDrawExpander(...)" for step ' + i + '.');
            });
         });
         it('prepareExpanderClasses', function() {
            var
               testsPrepareExpanderClasses = [{
                  itemData: {
                     item: {
                        get: function() {
                           return false;
                        }
                     }
                  }
               }, {
                  itemData: {
                     item: {
                        get: function() {
                           return false;
                        }
                     }
                  },
                  expanderIcon: 'testIcon'
               }, {
                  itemData: {
                     item: {
                        get: function() {
                           return true;
                        }
                     }
                  }
               }, {
                  itemData: {
                     item: {
                        get: function() {
                           return true;
                        }
                     }
                  },
                  expanderIcon: 'testIcon'
               }],
               testsResultPrepareExpanderClasses = [
                  'controls-TreeGrid__row-expander controls-TreeGrid__row-expander_size_default js-controls-ListView__notEditable controls-TreeGrid__row-expander_hiddenNode controls-TreeGrid__row-expander_hiddenNode_collapsed',
                  'controls-TreeGrid__row-expander controls-TreeGrid__row-expander_size_default js-controls-ListView__notEditable controls-TreeGrid__row-expander_testIcon controls-TreeGrid__row-expander_testIcon_collapsed',
                  'controls-TreeGrid__row-expander controls-TreeGrid__row-expander_size_default js-controls-ListView__notEditable controls-TreeGrid__row-expander_node controls-TreeGrid__row-expander_node_collapsed',
                  'controls-TreeGrid__row-expander controls-TreeGrid__row-expander_size_default js-controls-ListView__notEditable controls-TreeGrid__row-expander_testIcon controls-TreeGrid__row-expander_testIcon_collapsed'
               ];
            testsPrepareExpanderClasses.forEach(function(item, i) {
               assert.equal(TreeViewModel._private.prepareExpanderClasses(testsPrepareExpanderClasses[i].itemData, testsPrepareExpanderClasses[i].expanderIcon),
                  testsResultPrepareExpanderClasses[i],
                  'Invalid value "prepareExpanderClasses(...)" for step ' + i + '.');
            });
         });
      });
      describe('expandedItems', function() {
         it('initialize from options', function() {
            var
               treeViewModel = new TreeViewModel({
                  expandedItems: [1, 2, 3]
               }),
               preparedExpandedItems = { 1: true, 2: true, 3: true };
            assert.deepEqual(preparedExpandedItems, treeViewModel._expandedItems, 'Invalid value "_expandedItems".');
         });
      });
      describe('public methods', function() {
         var
            treeViewModel = new TreeViewModel(cfg);
         it('getCurrent and toggleExpanded', function() {
            assert.equal(undefined, treeViewModel._expandedItems['123'], 'Invalid value "_expandedItems" before call "toggleExpanded(123, true)".');
            assert.isFalse(treeViewModel.getCurrent().isExpanded, 'Invalid value "getCurrent()" before call "toggleExpanded(123, true)".');

            treeViewModel.toggleExpanded(treeViewModel.getCurrent().dispItem, true);
            assert.isTrue(treeViewModel._expandedItems['123'], 'Invalid value "_expandedItems" after call "toggleExpanded(123, true)".');
            assert.isTrue(treeViewModel.getCurrent().isExpanded, 'Invalid value "getCurrent()" after call "toggleExpanded(123, true)".');

            treeViewModel.toggleExpanded(treeViewModel.getCurrent().dispItem, false);
            assert.equal(undefined, treeViewModel._expandedItems['123'], 'Invalid value "_expandedItems" after call "toggleExpanded(123, false)".');
            assert.isFalse(treeViewModel.getCurrent().isExpanded, 'Invalid value "getCurrent()" after call "toggleExpanded(123, false)".');

            treeViewModel.toggleExpanded(treeViewModel.getItemById('123', cfg.keyProperty), true);
            treeViewModel.toggleExpanded(treeViewModel.getItemById('234', cfg.keyProperty), true);
            assert.deepEqual({ '123': true, '234': true }, treeViewModel._expandedItems, 'Invalid value "_expandedItems" after expand "123" and "234".');
            treeViewModel.toggleExpanded(treeViewModel.getItemById('123', cfg.keyProperty), false);
            assert.deepEqual({}, treeViewModel._expandedItems, 'Invalid value "_expandedItems" after collapse "123".');
         });

         it('multiSelectStatus', function() {
            treeViewModel.toggleExpanded(treeViewModel.getCurrent().dispItem, true);
            treeViewModel._curIndex = 1; //234
            treeViewModel.toggleExpanded(treeViewModel.getCurrent().dispItem, true);
            treeViewModel.updateSelection(['123', '234', '1', '2', '3']);
            treeViewModel._curIndex = 0; //123
            assert.isTrue(treeViewModel.getCurrent().multiSelectStatus);
            treeViewModel._curIndex = 1; //234
            assert.isTrue(treeViewModel.getCurrent().multiSelectStatus);
            treeViewModel.updateSelection(['123', '234', '1']);
            treeViewModel._curIndex = 0; //123
            assert.isNull(treeViewModel.getCurrent().multiSelectStatus);
            treeViewModel._curIndex = 1; //234
            assert.isNull(treeViewModel.getCurrent().multiSelectStatus);
            treeViewModel.updateSelection(['123']);
            treeViewModel._curIndex = 0; //123
            assert.isNull(treeViewModel.getCurrent().multiSelectStatus);
            treeViewModel._curIndex = 1; //234
            assert.isFalse(treeViewModel.getCurrent().multiSelectStatus);
            treeViewModel.updateSelection(['123', '234', '3']);
            treeViewModel._curIndex = 0; //123
            assert.isNull(treeViewModel.getCurrent().multiSelectStatus);
            treeViewModel._curIndex = 1; //234
            assert.isNull(treeViewModel.getCurrent().multiSelectStatus);
            treeViewModel._curIndex = 4; //3
            assert.isTrue(treeViewModel.getCurrent().multiSelectStatus);
         });

         it('setExpandedItems', function() {
            treeViewModel.setExpandedItems([]);
            assert.deepEqual({}, treeViewModel._expandedItems);

            treeViewModel.setExpandedItems([1, 2]);
            assert.deepEqual({
               1: true,
               2: true
            }, treeViewModel._expandedItems);
         });
         it('onCollectionChange', function() {
            var
               removedItems1 = [
                  new MockedDisplayItem({ id: 'mi1', isNode: true }), new MockedDisplayItem({ id: 'mi3', isNode: false })],
               removedItems2 = [
                  new MockedDisplayItem({ id: 'mi2', isNode: true }), new MockedDisplayItem({ id: 'mi4', isNode: false })],
               notifiedOnNodeRemoved = false;
            treeViewModel._expandedItems = { 'mi1': true, 'mi2': true };
            treeViewModel._notify = function(eventName) {
               if (eventName === 'onNodeRemoved') {
                  notifiedOnNodeRemoved = true;
               }
            };
            treeViewModel._onCollectionChange(null, IBindCollection.ACTION_REMOVE, null, null, removedItems1, null);
            assert.deepEqual(treeViewModel._expandedItems, { 'mi2': true }, 'Invalid value "_expandedItems" after "onCollectionChange".');
            treeViewModel._onCollectionChange(null, IBindCollection.ACTION_REMOVE, null, null, removedItems2, null);
            assert.deepEqual(treeViewModel._expandedItems, {}, 'Invalid value "_expandedItems" after "onCollectionChange".');
            assert.isTrue(notifiedOnNodeRemoved, 'Event "onNodeRemoved" not notified.');
         });
      });

      describe('expanderDisplayMode', function() {
         var

            // rawData without hasChildrenProperty and with child
            rawData_1 = [
               { id: 1, type: true, parent: null, hasChild: null },
               { id: 11, type: true, parent: 1, hasChild: null },
               { id: 2, type: true, parent: null, hasChild: null }
            ],

            // rawData without hasChildrenProperty and without child
            rawData_2 = [
               { id: 1, type: true, parent: null, hasChild: null },
               { id: 2, type: true, parent: null, hasChild: null }
            ],

            // rawData with hasChildrenProperty and with child
            rawData_3 = [
               { id: 1, type: true, parent: null, hasChild: true },
               { id: 2, type: true, parent: null, hasChild: false }
            ],

            // rawData with hasChildrenProperty and without child
            rawData_4 = [
               { id: 1, type: true, parent: null, hasChild: false },
               { id: 11, type: true, parent: 1, hasChild: true },
               { id: 2, type: true, parent: null, hasChild: false }
            ];
         function checkExpanderDisplayMode(params, result) {
            var
               items = new RecordSet({
                  rawData: params.items,
                  idProperty: 'id'
               }),
               model = new TreeViewModel({
                  items: items,
                  keyProperty: 'id',
                  parentProperty: 'parent',
                  nodeProperty: 'type',
                  expanderDisplayMode: 'adaptive',
                  hasChildrenProperty: params.hasChildrenProperty
               });
            assert.equal(model._thereIsChildItem, result);
         }
         it('Check "adaptive" mode for nodes with children. hasChildrenProperty option is undefined.', function() {
            checkExpanderDisplayMode({
               items: rawData_1
            }, true);
         });
         it('Check "adaptive" mode for nodes without children. hasChildrenProperty option is undefined.', function() {
            checkExpanderDisplayMode({
               items: rawData_2
            }, false);
         });
         it('Check "adaptive" mode for nodes with children. hasChildrenProperty option is set.', function() {
            checkExpanderDisplayMode({
               items: rawData_3,
               hasChildrenProperty: 'hasChild'
            }, true);
         });
         it('Check "adaptive" mode for nodes without children. hasChildrenProperty option is set.', function() {
            checkExpanderDisplayMode({
               items: rawData_4,
               hasChildrenProperty: 'hasChild'
            }, false);
         });
      });

      describe('DragNDrop methods', function() {
         var tvm, dragEntity;

         beforeEach(function() {
            tvm = new TreeViewModel(cfg);
            dragEntity = {
               items: ['123'],
               getItems: function() {
                  return this.items;
               }
            };
         });

         it('setDragEntity', function() {
            tvm.toggleExpanded(tvm.getItemById('123', 'id'), true);
            tvm.toggleExpanded(tvm.getItemById('456', 'id'), true);

            tvm.setDragEntity(dragEntity);
            assert.isFalse(tvm.isExpanded(tvm.getItemById('123', 'id')));
            assert.isTrue(tvm.isExpanded(tvm.getItemById('456', 'id')));
         });

         it('setDragItemData', function() {
            tvm.toggleExpanded(tvm.getItemById('123', 'id'), true);
            tvm.setDragItemData(tvm.getItemDataByItem(tvm.getItemById('123', 'id')));

            assert.isFalse(tvm.getDragItemData().isExpanded);
         });

         describe('setDragTargetPosition', function() {
            var itemData, dragTargetPosition;

            it('on node without prev state', function() {
               //move item 567
               tvm.setDragItemData(tvm.getItemDataByItem(tvm.getItemById('567', 'id')));
               tvm.setDragEntity(dragEntity);

               //move on 123
               itemData = tvm.getItemDataByItem(tvm.getItemById('123', 'id'));
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData);
               tvm.setDragTargetPosition(dragTargetPosition);

               assert.equal(tvm._prevDragTargetPosition.data.key, '567');
               assert.equal(tvm._prevDragTargetPosition.position, 'after');
            });

            it('on node', function() {
               //move item 567
               tvm.setDragItemData(tvm.getItemDataByItem(tvm.getItemById('567', 'id')));
               tvm.setDragEntity(dragEntity);

               //move before 456
               itemData = tvm.getItemDataByItem(tvm.getItemById('456', 'id'));
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData, 'before');
               tvm.setDragTargetPosition(dragTargetPosition);

               //move on 123
               itemData = tvm.getItemDataByItem(tvm.getItemById('123', 'id'));
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData);
               tvm.setDragTargetPosition(dragTargetPosition);

               assert.equal(tvm._prevDragTargetPosition.data.key, '456');
               assert.equal(tvm._prevDragTargetPosition.position, 'before');
            });
         });

         describe('calculateDragTargetPosition', function() {
            var itemData, dragTargetPosition;

            it('not node', function() {
               itemData = tvm.getItemDataByItem(tvm.getItemById('567', 'id'));
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData);
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'before');
            });

            it('on node', function() {
               itemData = tvm.getItemDataByItem(tvm.getItemById('123', 'id'));
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData);
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'on');
            });

            it('before node', function() {
               itemData = tvm.getItemDataByItem(tvm.getItemById('123', 'id'));
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData, 'before');
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'before');
            });

            it('after node', function() {
               itemData = tvm.getItemDataByItem(tvm.getItemById('123', 'id'));
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData, 'after');
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'after');
            });

            it('before expanded node', function() {
               tvm.toggleExpanded(tvm.getItemById('123', 'id'), true);
               itemData = tvm.getItemDataByItem(tvm.getItemById('123', 'id'));
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData, 'before');
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'before');
            });

            it('after expanded node', function() {
               tvm.toggleExpanded(tvm.getItemById('123', 'id'), true);
               itemData = tvm.getItemDataByItem(tvm.getItemById('123', 'id'));
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData, 'after');
               assert.equal(dragTargetPosition, undefined);
            });

            it('move down node', function() {
               //move item 567
               tvm.setDragItemData(tvm.getItemDataByItem(tvm.getItemById('567', 'id')));
               tvm.setDragEntity(dragEntity);

               //move after 123
               itemData = tvm.getItemDataByItem(tvm.getItemById('123', 'id'));
               tvm.setDragTargetPosition(tvm.calculateDragTargetPosition(itemData, 'after'));

               //move on 345
               itemData = tvm.getItemDataByItem(tvm.getItemById('345', 'id'));
               tvm.setDragTargetPosition(tvm.calculateDragTargetPosition(itemData));

               //move before 345
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData, 'before');
               assert.equal(dragTargetPosition, undefined);

               //move after 345
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData, 'after');
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'after');
            });

            it('move up item', function() {
               //move item 567
               tvm.setDragItemData(tvm.getItemDataByItem(tvm.getItemById('567', 'id')));
               tvm.setDragEntity(dragEntity);

               //move before 456
               itemData = tvm.getItemDataByItem(tvm.getItemById('456', 'id'));
               tvm.setDragTargetPosition(tvm.calculateDragTargetPosition(itemData, 'before'));

               //move on 345
               itemData = tvm.getItemDataByItem(tvm.getItemById('345', 'id'));
               tvm.setDragTargetPosition(tvm.calculateDragTargetPosition(itemData));

               //move after 345
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData, 'after');
               assert.equal(dragTargetPosition, undefined);

               //move before 345
               dragTargetPosition = tvm.calculateDragTargetPosition(itemData, 'before');
               assert.equal(dragTargetPosition.index, itemData.index);
               assert.equal(dragTargetPosition.position, 'before');
            });
         });
      });
   });
});
