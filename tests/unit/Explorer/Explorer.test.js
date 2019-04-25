define([
   'Controls/explorers',
   'Core/Deferred',
   'Types/collection',
   'Types/chain',
   'Controls/dragnDrop',
   'Types/entity'
], function(
   explorerMod,
   Deferred,
   collection,
   chain,
   dragnDrop,
   entityLib
) {
   describe('Controls.Explorer', function() {
      it('_private block', function() {
         var
            dataLoadCallbackArgument = null,
            dataLoadCallback = function(data) {
               dataLoadCallbackArgument = data;
            },
            notify = function() {},
            forceUpdate = function() {},
            itemOpenHandlerCalled = false,
            itemOpenHandler = function() {
               itemOpenHandlerCalled = true;
            },
            self = {
               _forceUpdate: forceUpdate,
               _notify: notify,
               _options: {
                  dataLoadCallback: dataLoadCallback,
                  itemOpenHandler: itemOpenHandler
               }
            },
            testRoot = 'testRoot',
            testBreadCrumbs = new collection.RecordSet({
               rawData: [
                  { id: 1, title: 'item1', parent: null },
                  { id: 2, title: 'item2', parent: 1 },
                  { id: 3, title: 'item3', parent: 2 }
               ]
            }),
            testData1 = {
               getMetaData: function() {
                  return {};
               }
            },
            testData2 = {
               getMetaData: function() {
                  return {
                     path: testBreadCrumbs
                  };
               }
            },
            testData3 = {
               getMetaData: function() {
                  return {
                     path: new collection.RecordSet({
                        rawData: []
                     })
                  };
               }
            };
         explorerMod.View._private.setRoot(self, testRoot);
         assert.deepEqual({
            _root: 'testRoot',
            _forceUpdate: forceUpdate,
            _notify: notify,
            _options: {
               dataLoadCallback: dataLoadCallback,
               itemOpenHandler: itemOpenHandler
            }
         }, self, 'Incorrect self data after "setRoot(self, testRoot)".');
         assert.isTrue(itemOpenHandlerCalled);
         explorerMod.View._private.dataLoadCallback(self, testData1);
         assert.deepEqual({
            _root: 'testRoot',
            _forceUpdate: forceUpdate,
            _notify: notify,
            _breadCrumbsItems: null,
            _options: {
               dataLoadCallback: dataLoadCallback,
               itemOpenHandler: itemOpenHandler
            }
         }, self, 'Incorrect self data after "dataLoadCallback(self, testData1)".');
         assert.deepEqual(dataLoadCallbackArgument, testData1, 'Incorrect "dataLoadCallback" arguments.');
         explorerMod.View._private.dataLoadCallback(self, testData2);
         assert.deepEqual({
            _root: 'testRoot',
            _forceUpdate: forceUpdate,
            _notify: notify,
            _breadCrumbsItems: chain.factory(testBreadCrumbs).toArray(),
            _options: {
               dataLoadCallback: dataLoadCallback,
               itemOpenHandler: itemOpenHandler
            }
         }, self, 'Incorrect self data after "dataLoadCallback(self, testData2)".');
         explorerMod.View._private.dataLoadCallback(self, testData1);
         assert.deepEqual({
            _root: 'testRoot',
            _forceUpdate: forceUpdate,
            _notify: notify,
            _breadCrumbsItems: null,
            _options: {
               dataLoadCallback: dataLoadCallback,
               itemOpenHandler: itemOpenHandler
            }
         }, self, 'Incorrect self data after "dataLoadCallback(self, testData1)".');
         explorerMod.View._private.dataLoadCallback(self, testData3);
         assert.deepEqual({
            _root: 'testRoot',
            _forceUpdate: forceUpdate,
            _notify: notify,
            _breadCrumbsItems: null,
            _options: {
               dataLoadCallback: dataLoadCallback,
               itemOpenHandler: itemOpenHandler
            }
         }, self);
      });

      it('_private.getRoot', function() {
         var
            cfg = {
               root: 'rootFromOptions'
            },
            explorer = new explorerMod.View(cfg);

         explorer.saveOptions(cfg);
         explorer._root = 'rootFromState';
         assert.equal(explorerMod.View._private.getRoot(explorer), 'rootFromOptions');

         delete cfg.root;
         explorer.saveOptions(cfg);
         assert.equal(explorerMod.View._private.getRoot(explorer), 'rootFromState');
      });

      it('_private.getDataRoot', function() {
         var
            cfg = {
               parentProperty: 'parent',
               root: 'rootFromOptions'
            },
            explorer = new explorerMod.View(cfg);

         explorer.saveOptions(cfg);
         assert.equal(explorerMod.View._private.getDataRoot(explorer), 'rootFromOptions');

         delete cfg.root;
         explorer.saveOptions(cfg);
         explorer._root = 'rootFromState';
         assert.equal(explorerMod.View._private.getDataRoot(explorer), 'rootFromState');

         explorer._breadCrumbsItems = [new entityLib.Model({
            rawData: {
               parent: 'rootFromBreadCrumbs'
            },
            idProperty: 'id'
         })];
         assert.equal(explorerMod.View._private.getDataRoot(explorer), 'rootFromBreadCrumbs');

         cfg.root = 'rootFromOptions';
         explorer.saveOptions(cfg);
         assert.equal(explorerMod.View._private.getDataRoot(explorer), 'rootFromBreadCrumbs');
      });

      it('itemsReadyCallback', function() {
         var
            items = {},
            itemsReadyCallbackArgs,
            itemsReadyCallback = function(items) {
               itemsReadyCallbackArgs = items;
            },
            cfg = {
               itemsReadyCallback: itemsReadyCallback
            },
            explorer = new explorerMod.View(cfg);
         explorer.saveOptions(cfg);

         explorerMod.View._private.itemsReadyCallback(explorer, items);
         assert.equal(itemsReadyCallbackArgs, items);
         assert.equal(explorer._items, items);
      });

      it('setViewMode', function() {
         var
            cfg = {
               root: 'rootNode',
               viewMode: 'tree'
            };
         var newCfg = {
            viewMode: 'search',
            root: 'rootNode'
         };
         var instance = new explorerMod.View(cfg);
         var rootChanged = false;

         instance.saveOptions(cfg);
         instance._beforeMount(cfg);
         instance._notify = function(eventName) {
            if (eventName === 'rootChanged') {
               rootChanged = true;
            }
         };

         assert.equal(instance._viewMode, 'tree');
         assert.equal(instance._viewName, explorerMod.View._constants.VIEW_NAMES.tree);
         assert.equal(instance._viewModelConstructor, explorerMod.View._constants.VIEW_MODEL_CONSTRUCTORS.tree);
         assert.isFalse(rootChanged);

         instance._beforeUpdate(newCfg);
         assert.equal(instance._viewMode, 'search');
         assert.equal(instance._viewName, explorerMod.View._constants.VIEW_NAMES.search);
         assert.equal(instance._viewModelConstructor, explorerMod.View._constants.VIEW_MODEL_CONSTRUCTORS.search);
         assert.isFalse(rootChanged);
      });

      it('_onBreadCrumbsClick', function() {
         var
            testBreadCrumbs = new collection.RecordSet({
               rawData: [
                  { id: 1, title: 'item1' },
                  { id: 2, title: 'item2', parent: 1 },
                  { id: 3, title: 'item3', parent: 2 }
               ],
               idProperty: 'id'
            }),
            instance = new explorerMod.View();

         instance.saveOptions({
            parentProperty: 'parent',
            keyProperty: 'id'
         });
         instance._onBreadCrumbsClick({}, testBreadCrumbs.at(0));
         assert.equal(instance._root, testBreadCrumbs.at(0).get('id'));
         instance._onBreadCrumbsClick({}, testBreadCrumbs.at(1));
         assert.equal(instance._root, testBreadCrumbs.at(1).get('id'));
      });

      it('_notifyHandler', function() {
         var
            instance = new explorerMod.View(),
            events = [],
            result;

         instance._notify = function() {
            events.push({
               eventName: arguments[0],
               eventArgs: arguments[1]
            });
            return 123;
         };

         result = instance._notifyHandler({}, 'itemActionsClick', 1, 2);
         instance._notifyHandler({}, 'beforeBeginEdit');
         instance._notifyHandler({}, 'sortingChanged', {field: 'DESC'});
         assert.equal(result, 123);
         assert.equal(events[0].eventName, 'itemActionsClick');
         assert.deepEqual(events[0].eventArgs, [1, 2]);
         assert.equal(events[1].eventName, 'beforeBeginEdit');
         assert.deepEqual(events[1].eventArgs, []);
         assert.equal(events[2].eventName, 'sortingChanged');
         assert.deepEqual(events[2].eventArgs, [{field: 'DESC'}]);
      });

      describe('_notify(rootChanged)', function() {
         var
            root,
            isNotified = false,
            isWeNotified = false,
            isNativeClickEventExists = false,

            _notify = function(eName, eArgs) {
               if (eName === 'rootChanged') {
                  isNotified = true;
                  root = eArgs[0];
               }
               if (eName === 'itemClick') {
                  isWeNotified = true;
                  if (eArgs[1] && eArgs[1].nativeEvent) {
                     isNativeClickEventExists = true;
                  }
               }
            };

         it('backByPath', function() {
            isNotified = false;

            var
               explorer = new explorerMod.View({});

            explorer._notify = _notify;
            explorer.saveOptions({
               parentProperty: 'parent'
            });
            explorer._breadCrumbsItems = [new entityLib.Model({
               rawData: {
                  id: 2,
                  parent: 1
               },
               idProperty: 'id'
            })];

            explorerMod.View._private.backByPath(explorer);

            assert.isTrue(isNotified);
            assert.equal(root, 1);
            isNotified = false;

            explorer._breadCrumbsItems.push(new entityLib.Model({
               rawData: {
                  id: 3,
                  parent: 2
               },
               idProperty: 'id'
            }));

            explorerMod.View._private.backByPath(explorer);

            assert.isTrue(isNotified);
            assert.equal(root, 2);
            isNotified = false;

            explorer._breadCrumbsItems = [];

            explorerMod.View._private.backByPath(explorer);

            assert.isFalse(isNotified);
         });

         it('_beforeUpdate', function() {
            isNotified = false;

            var
               explorer = new explorerMod.View({});
            explorer.saveOptions({});
            explorer._notify = _notify;
            explorer._beforeUpdate({
               root: 1,
               viewMode: null
            });

            assert.isFalse(isNotified);
            isNotified = false;

         });

         it('_onItemClick', function() {
            isNotified = false;
            isWeNotified = false;

            var
               explorer = new explorerMod.View({}),
               isPropagationStopped = isNotified = isNativeClickEventExists = false;

            explorer.saveOptions({});
            explorer._notify = _notify;

            explorer._onItemClick({
               stopPropagation: function() {
                  isPropagationStopped = true;
               }
            }, {
               get: function() {
                  return true;
               },
               getId: function() {
                  return 'itemId';
               }
            }, {
               nativeEvent: 123
            });

            assert.isTrue(isPropagationStopped);
            // Click
            assert.isTrue(isWeNotified);
            // RootChanged
            assert.equal(root, 'itemId');
            assert.isTrue(isNotified);

            /* https://online.sbis.ru/opendoc.html?guid=3523e32f-2bb3-4ed4-8b0f-cde55cb81f75 */
            assert.isTrue(isNativeClickEventExists);
         });

         it('_onBreadCrumbsClick', function() {
            isNotified = false;

            var
               explorer = new explorerMod.View({});
            explorer.saveOptions({});
            explorer._notify = _notify;

            explorer._onBreadCrumbsClick({}, {
               getId: function() {}
            });

            assert.isTrue(isNotified);
         });
      });

      describe('EditInPlace', function() {
         it('beginEdit', function() {
            var opt = {
               test: '123'
            };
            var
               instance = new explorerMod.View({});
            instance._children = {
               treeControl: {
                  beginEdit: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = instance.beginEdit(opt);
            assert.instanceOf(result, Deferred);
            assert.isTrue(result.isSuccessful());
         });

         it('beginAdd', function() {
            var opt = {
               test: '123'
            };
            var
               instance = new explorerMod.View({});
            instance._children = {
               treeControl: {
                  beginAdd: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
            };
            var result = instance.beginAdd(opt);
            assert.instanceOf(result, Deferred);
            assert.isTrue(result.isSuccessful());
         });

         it('cancelEdit', function() {
            var
               instance = new explorerMod.View({});
            instance._children = {
               treeControl: {
                  cancelEdit: function() {
                     return Deferred.success();
                  }
               }
            };
            var result = instance.cancelEdit();
            assert.instanceOf(result, Deferred);
            assert.isTrue(result.isSuccessful());
         });

         it('commitEdit', function() {
            var
               instance = new explorerMod.View({});
            instance._children = {
               treeControl: {
                  commitEdit: function() {
                     return Deferred.success();
                  }
               }
            };
            var result = instance.commitEdit();
            assert.instanceOf(result, Deferred);
            assert.isTrue(result.isSuccessful());
         });
      });

      describe('DragNDrop', function() {
         var
            explorer,
            explorerCfg = {
               parentProperty: 'parent',
               root: null,
               itemsDragNDrop: true,
            };

         beforeEach(function() {
            var
               items = new collection.RecordSet({
                  rawData: [
                     { id: 1, title: 'item1', parent: null },
                     { id: 2, title: 'item2', parent: 1 },
                     { id: 3, title: 'item3', parent: 2 }
                  ],
                  idProperty: 'id'
               })

            explorer = new explorerMod.View(explorerCfg);

            explorer.saveOptions(explorerCfg);
            explorer._beforeMount(explorerCfg);
            explorer._items = items;
         });

         it('_hoveredCrumbChanged', function() {
            var hoveredBreadCrumb = new entityLib.Model({
                  rawData: {
                     id: 1
                  },
                  idProperty: 'id'
               }),
                explorer = new explorerMod.View({});

            explorer._hoveredCrumbChanged({}, hoveredBreadCrumb);
            assert.equal(explorer._hoveredBreadCrumb, hoveredBreadCrumb.get('id'));
         });
         it('dragItemsFromRoot', function() {

            //item from the root
            assert.isTrue(explorerMod.View._private.dragItemsFromRoot(explorer, [1]));

            //item is not from the root
            assert.isFalse(explorerMod.View._private.dragItemsFromRoot(explorer, [2]));

            //item is not from the root and from the root
            assert.isFalse(explorerMod.View._private.dragItemsFromRoot(explorer, [1, 2]));

            //an item that is not in the list.
            assert.isFalse(explorerMod.View._private.dragItemsFromRoot(explorer, [4]));
         });
         it('_dragHighlighter', function() {
            explorer._hoveredBreadCrumb = 2;

            assert.equal(explorer._dragHighlighter(), '');

            explorer._dragOnBreadCrumbs = true;
            assert.equal(explorer._dragHighlighter(1), '');
            assert.equal(explorer._dragHighlighter(2), 'controls-BreadCrumbsView__dropTarget_withoutArrow');
            assert.equal(explorer._dragHighlighter(2, true), 'controls-BreadCrumbsView__dropTarget_withArrow');
         });
         it('_documentDragStart', function() {
            explorer._documentDragStart({}, {
               entity: 'notDragEntity'
            });
            assert.isFalse(explorer._dragOnBreadCrumbs);

            //drag in the root
            explorer._dragOnBreadCrumbs = false;
            explorer._documentDragStart({}, {
               entity: new dragnDrop.ItemsEntity({
                  items: [1]
               })
            });
            assert.isFalse(explorer._dragOnBreadCrumbs);

            explorer._dragOnBreadCrumbs = false;
            explorer._documentDragStart({}, {
               entity: new dragnDrop.ItemsEntity({
                  items: [2]
               })
            });
            assert.isTrue(explorer._dragOnBreadCrumbs);

            explorer._dragOnBreadCrumbs = false;
            explorer._options.itemsDragNDrop = false;
            explorer._documentDragStart({}, {
               entity: new dragnDrop.ItemsEntity({
                  items: [2]
               })
            });
            assert.isFalse(explorer._dragOnBreadCrumbs);
            explorer._options.itemsDragNDrop = true;

            //drag not in root
            explorer._options.root = 'notnull';

            explorer._dragOnBreadCrumbs = false;
            explorer._documentDragStart({}, {
               entity: new dragnDrop.ItemsEntity({
                  items: [1]
               })
            });
            assert.isTrue(explorer._dragOnBreadCrumbs);

            explorer._dragOnBreadCrumbs = false;
            explorer._documentDragStart({}, {
               entity: new dragnDrop.ItemsEntity({
                  items: [2]
               })
            });
            assert.isTrue(explorer._dragOnBreadCrumbs);

            explorer._dragOnBreadCrumbs = false;
            explorerCfg.parentProperty = undefined;
            explorer.saveOptions(explorerCfg);
            explorer._documentDragStart({}, {
               entity: new dragnDrop.ItemsEntity({
                  items: [2]
               })
            });
            assert.isFalse(explorer._dragOnBreadCrumbs);
         });
         it('_documentDragEnd', function() {
            var
               dragEnrArgs,
               dragEntity = new dragnDrop.ItemsEntity();

            explorer._notify = function(e, args) {
               if (e === 'dragEnd') {
                  dragEnrArgs = args;
               }
            };
            explorer._dragOnBreadCrumbs = true;

            explorer._documentDragEnd({}, {});
            assert.equal(dragEnrArgs, undefined);
            assert.isFalse(explorer._dragOnBreadCrumbs);

            explorer._hoveredBreadCrumb = 'hoveredItemKey';
            explorer._documentDragEnd({}, {
               entity: dragEntity
            });
            assert.equal(dragEnrArgs[0], dragEntity);
            assert.equal(dragEnrArgs[1], 'hoveredItemKey');
            assert.equal(dragEnrArgs[2], 'on');
         });
      });
   });
});
