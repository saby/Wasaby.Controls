define([
   'Controls/List/TreeControl',
   'Controls/List/BaseControl',
   'Core/Deferred',
   'Core/core-merge',
   'Core/core-instance',
   'Controls/List/TreeGridView/TreeGridViewModel',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Source/Memory'
], function(
   TreeControl,
   BaseControl,
   Deferred,
   cMerge,
   cInstance,
   TreeGridViewModel,
   RecordSet,
   Memory
) {
   function correctCreateTreeControl(cfg) {
      var
         treeControl,
         baseControl,
         cfgBaseControl,
         cfgTreeControl = cMerge(cfg, {
            viewModelConstructor: TreeGridViewModel
         });
      cfgTreeControl = Object.assign(TreeControl.getDefaultOptions(), cfgTreeControl);
      treeControl = new TreeControl(cfgTreeControl);
      treeControl.saveOptions(cfgTreeControl);
      treeControl._beforeMount(cfgTreeControl);
      cfgBaseControl = cMerge(cfgTreeControl, {
         beforeReloadCallback: treeControl._beforeReloadCallback,
         afterReloadCallback: treeControl._afterReloadCallback
      });
      baseControl = new BaseControl(cfgBaseControl);
      baseControl.saveOptions(cfgBaseControl);
      baseControl._beforeMount(cfgBaseControl);
      treeControl._children = {
         baseControl: baseControl
      };
      return treeControl;
   }
   
   function getHierarchyData() {
      return [
         {id: 0, 'Раздел@': true, "Раздел": null},
         {id: 1, 'Раздел@': true, "Раздел": 0},
         {id: 2, 'Раздел@': null, "Раздел": 0},
         {id: 3, 'Раздел@': null, "Раздел": 1},
         {id: 4, 'Раздел@': null, "Раздел": null}
      ];
   }
   
   describe('Controls.List.TreeControl', function() {
      it('TreeControl.reload', function(done) {
         var
            treeControl = correctCreateTreeControl({
               columns: [],
               source: new Memory({
                  data: [],
                  idProperty: 'id'
               })
            }),
            isSourceControllerDestroyed = false;
         treeControl._nodesSourceControllers = {
            1: {
               destroy: function() {
                  isSourceControllerDestroyed = true;
               }
            }
         };
         setTimeout(function() {
            treeControl.reload();
            setTimeout(function() {
               assert.isTrue(!!Object.keys(treeControl._nodesSourceControllers).length, 'Invalid value "_nodesSourceControllers" after call "treeControl.reload()".');
               assert.isFalse(isSourceControllerDestroyed, 'Invalid value "isSourceControllerDestroyed" after call "treeControl.reload()".');
               done();
            }, 10);
         }, 10);
      });
      it('TreeControl._beforeUpdate', function(done) {
         var
            reloadCalled = false,
            setRootCalled = false,
            treeControl = correctCreateTreeControl({
               columns: [],
               source: new Memory({
                  data: [],
                  idProperty: 'id'
               }),
               parentProperty: 'parent'
            }),
            treeGridViewModel = treeControl._children.baseControl.getViewModel(),
            reloadOriginal = treeControl.reload;
         treeGridViewModel.setRoot = function() {
            setRootCalled = true;
         };
         treeControl.reload = function() {
            reloadCalled = true;
            return reloadOriginal.apply(this, arguments);
         };
         setTimeout(function() {
            treeControl._beforeUpdate({ root: 'testRoot' });
            treeControl._afterUpdate({ root: null });
            setTimeout(function() {
               assert.isTrue(reloadCalled, 'Invalid call "reload" after call "_beforeUpdate" and apply new "root".');
               assert.isTrue(setRootCalled, 'Invalid call "setRoot" after call "_beforeUpdate" and apply new "root".');
               done();
            }, 10);
         }, 10);
      });
      it('TreeControl._private.prepareHasMoreStorage', function() {
         var
            sourceControllers = {
               1: {
                  hasMoreData: function() {
                     return true;
                  }
               },
               2: {
                  hasMoreData: function() {
                     return false;
                  }
               }
            },
            hasMoreResult = {
               1: true,
               2: false
            };
         assert.deepEqual(hasMoreResult, TreeControl._private.prepareHasMoreStorage(sourceControllers),
            'Invalid value returned from "prepareHasMoreStorage(sourceControllers)".');
      });
      it('TreeControl._private.loadMore', function() {
         var
            setHasMoreCalled = false,
            mergeItemsCalled = false,
            mockedTreeControlInstance = {
               _options: {
                  filter: {
                     testParam: 11101989
                  },
                  parentProperty: 'parent',
                  uniqueKeys: true
               },
               _nodesSourceControllers: {
                  1: {
                     load: function() {
                        var
                           result = new Deferred();
                        result.callback();
                        return result;
                     },
                     hasMoreData: function() {
                        return true;
                     }
                  }
               },
               _children: {
                  baseControl: {
                     getViewModel: function() {
                        return {
                           setHasMoreStorage: function() {
                              setHasMoreCalled = true;
                           },
                           mergeItems: function() {
                              mergeItemsCalled = true;
                           }
                        };
                     }
                  }
               }
            },
            dispItem = {
               getContents: function() {
                  return {
                     getId: function() {
                        return 1;
                     }
                  };
               }
            };
         TreeControl._private.loadMore(mockedTreeControlInstance, dispItem);
         assert.deepEqual({
            testParam: 11101989
         }, mockedTreeControlInstance._options.filter,
         'Invalid value "filter" after call "TreeControl._private.loadMore(...)".');
         assert.isTrue(setHasMoreCalled, 'Invalid call "setHasMore" by "TreeControl._private.loadMore(...)".');
         assert.isTrue(mergeItemsCalled, 'Invalid call "mergeItemsCalled" by "TreeControl._private.loadMore(...)".');
      });
      describe('EditInPlace', function() {
         it('beginEdit', function() {
            var opt = {
               test: '123'
            };
            var
               treeControl = correctCreateTreeControl({});
            treeControl._children.baseControl.beginEdit = function(options) {
               assert.equal(opt, options);
               return Deferred.success();
            };
            var result = treeControl.beginEdit(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('beginEdit, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               treeControl = correctCreateTreeControl({ readOnly: true });
            var result = treeControl.beginEdit(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('beginAdd', function() {
            var opt = {
               test: '123'
            };
            var
               treeControl = correctCreateTreeControl({});
            treeControl._children.baseControl.beginAdd = function(options) {
               assert.equal(opt, options);
               return Deferred.success();
            };
            var result = treeControl.beginAdd(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('beginAdd, readOnly: true', function() {
            var opt = {
               test: '123'
            };
            var
               treeControl = correctCreateTreeControl({ readOnly: true });
            var result = treeControl.beginAdd(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });
         it('cancelEdit', function() {
            var
               treeControl = correctCreateTreeControl({});
            treeControl._children.baseControl.cancelEdit = function() {
               return Deferred.success();
            };
            var result = treeControl.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('cancelEdit, readOnly: true', function() {
            var
               treeControl = correctCreateTreeControl({ readOnly: true });
            var result = treeControl.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('commitEdit', function() {
            var
               treeControl = correctCreateTreeControl({});
            treeControl._children.baseControl.commitEdit = function() {
               return Deferred.success();
            };
            var result = treeControl.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('commitEdit, readOnly: true', function() {
            var
               treeControl = correctCreateTreeControl({ readOnly: true }),
               result = treeControl.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });
      });
      it('All items collapsed after reload', function() {
         var
            treeControl = correctCreateTreeControl({
               expandedItems: [2246, 452815, 457244, 471641],
               columns: [],
               items: new RecordSet({
                  rawData: [],
                  idProperty: 'id'
               })
            });
         treeControl.reload();
         assert.deepEqual({2246: true, 452815: true, 457244: true, 471641: true}, treeControl._children.baseControl.getViewModel().getExpandedItems());
      });
      it('Expand all', function(done) {
         var
            treeControl = correctCreateTreeControl({
               source: new Memory({
                  data: [
                     { id: 1, type: true, parent: null },
                     { id: 2, type: true, parent: null },
                     { id: 11, type: null, parent: 1 }
                  ],
                  idProperty: 'id'
               }),
               columns: [],
               keyProperty: 'id',
               parentProperty: 'parent',
               nodeProperty: 'type',
               expandedItems: [null]
            }),
            treeGridViewModel = treeControl._children.baseControl.getViewModel();
         setTimeout(function () {
            assert.deepEqual({null: true}, treeGridViewModel._model._expandedItems);
            assert.deepEqual({}, treeGridViewModel._model._collapsedItems);
            treeGridViewModel.toggleExpanded(treeGridViewModel._model._display.at(0));
            setTimeout(function() {
               assert.deepEqual({null: true}, treeGridViewModel._model._expandedItems);
               assert.deepEqual({1: true}, treeGridViewModel._model._collapsedItems);
               done();
            }, 10);
         }, 10);
      });

      it('markItemByExpanderClick true', function() {

         var
            rawData = [
               { id: 1, type: true, parent: null },
               { id: 2, type: true, parent: null },
               { id: 11, type: null, parent: 1 }
            ],
            source = new Memory({
               rawData: rawData,
               idProperty: 'id'
            }),
            cfg = {
               source: source,
               columns: [],
               keyProperty: 'id',
               parentProperty: 'parent',
               nodeProperty: 'type',
               markedKey: 11,
               markItemByExpanderClick: true
            },
            e = {
               stopImmediatePropagation: function(){}
            },
            treeControl = new TreeControl(cfg),
            treeGridViewModel = new TreeGridViewModel(cfg);
         treeControl.saveOptions(cfg);
         treeGridViewModel.setItems(new RecordSet({
            rawData: rawData,
            idProperty: 'id'
         }));

         treeControl._children = {
            baseControl: {
               getViewModel: function() {
                  return treeGridViewModel;
               }
            }
         };

         TreeControl._private.toggleExpanded = function(){};
         assert.deepEqual(11, treeGridViewModel._model._markedKey);

         treeControl._onExpanderClick(e, treeGridViewModel.at(0));
         assert.deepEqual(1, treeGridViewModel._model._markedKey);
      });

      it('markItemByExpanderClick false', function() {

         var
            rawData = [
               { id: 1, type: true, parent: null },
               { id: 2, type: true, parent: null },
               { id: 11, type: null, parent: 1 }
            ],
            source = new Memory({
               rawData: rawData,
               idProperty: 'id'
            }),
            cfg = {
               source: source,
               columns: [],
               keyProperty: 'id',
               parentProperty: 'parent',
               nodeProperty: 'type',
               markedKey: 11,
               markItemByExpanderClick: false
            },
            e = {
               stopImmediatePropagation: function(){}
            },
            treeControl = new TreeControl(cfg),
            treeGridViewModel = new TreeGridViewModel(cfg);
         treeControl.saveOptions(cfg);
         treeGridViewModel.setItems(new RecordSet({
            rawData: rawData,
            idProperty: 'id'
         }));

         treeControl._children = {
            baseControl: {
               getViewModel: function() {
                  return treeGridViewModel;
               }
            }
         };

         TreeControl._private.toggleExpanded = function(){};
         assert.deepEqual(11, treeGridViewModel._model._markedKey);

         treeControl._onExpanderClick(e, treeGridViewModel.at(0));
         assert.deepEqual(11, treeGridViewModel._model._markedKey);
      });

      it('reloadItem', function(done) {
         var source = new Memory({
            data: [{id: 0, 'Раздел@': false, "Раздел": null}],
            rawData: [{id: 0, 'Раздел@': false, "Раздел": null}],
            idProperty: 'id',
            filter: function(item, filter) {
               if (filter['Раздел'] && filter['Раздел'] instanceof Array) {
                  return filter['Раздел'].indexOf(item.get('id')) !== -1 || filter['Раздел'].indexOf(item.get('Раздел')) !== -1;
               }
               return true;
            }
         });
         var cfg = {
            source: source,
            columns: [],
            keyProperty: 'id',
            parentProperty: 'Раздел',
            nodeProperty: 'Раздел@',
            filter: {}
         };
   
         var treeGridViewModel = new TreeGridViewModel(cfg);
         treeGridViewModel.setItems(new RecordSet({
            rawData: getHierarchyData(),
            idProperty: 'id'
         }));
         var treeControl = new TreeControl(cfg);
         treeControl.saveOptions(cfg);
         treeControl._children = {
            baseControl: {
               getViewModel: function() {
                  return treeGridViewModel;
               }
            }
         };
   
         var oldItems = treeControl._children.baseControl.getViewModel().getItems();
         assert.deepEqual(oldItems.getRawData(), getHierarchyData());
         
         treeControl.reloadItem(0, {}, 'inside').addCallback(function() {
            var newItems = treeControl._children.baseControl.getViewModel().getItems();
            assert.deepEqual(
               newItems.getRawData(),
               [
                  {id: 0, 'Раздел@': false, "Раздел": null},
                  {id: 3, 'Раздел@': null, "Раздел": 1},
                  {id: 4, 'Раздел@': null, "Раздел": null}
               ]
            );
            done();
         });
      });
   
      it('_private.getReloadableNodes', function() {
         var source = new Memory({
            rawData: getHierarchyData(),
            idProperty: 'id'
         });
         var cfg = {
            source: source,
            columns: [],
            keyProperty: 'id',
            parentProperty: 'Раздел',
            nodeProperty: 'Раздел@',
         };
   
         var treeGridViewModel = new TreeGridViewModel(cfg);
         treeGridViewModel.setItems(new RecordSet({
            rawData: getHierarchyData(),
            idProperty: 'id'
         }));
         
         assert.deepEqual(TreeControl._private.getReloadableNodes(treeGridViewModel, 0, 'id', 'Раздел@'), [1]);
      });
   
      it('_private.applyReloadedNodes', function() {
         var source = new Memory({
            rawData: getHierarchyData(),
            idProperty: 'id'
         });
         var cfg = {
            source: source,
            columns: [],
            keyProperty: 'id',
            parentProperty: 'Раздел',
            nodeProperty: 'Раздел@',
         };
   
         var treeGridViewModel = new TreeGridViewModel(cfg);
         var newItems = new RecordSet({
            rawData: [{id: 0, 'Раздел@': false, "Раздел": null}],
            idProperty: 'id'
         });
         treeGridViewModel.setItems(new RecordSet({
            rawData: getHierarchyData(),
            idProperty: 'id'
         }));
   
         TreeControl._private.applyReloadedNodes(treeGridViewModel, 0, 'id', 'Раздел@', newItems);
         
         assert.equal(treeGridViewModel.getItems().getCount(), 3);
         assert.deepEqual(treeGridViewModel.getItems().at(0).getRawData(), {id: 0, 'Раздел@': false, "Раздел": null});
      });
   
      it('_private.nodeChildsIterator', function() {
         var source = new Memory({
            rawData: getHierarchyData(),
            idProperty: 'id'
         });
         var cfg = {
            source: source,
            columns: [],
            keyProperty: 'id',
            parentProperty: 'Раздел',
            nodeProperty: 'Раздел@',
         };
   
         var treeGridViewModel = new TreeGridViewModel(cfg);
         treeGridViewModel.setItems(new RecordSet({
            rawData: getHierarchyData(),
            idProperty: 'id'
         }));
         var nodes = [];
         var lists = [];
   
         TreeControl._private.nodeChildsIterator(treeGridViewModel, 0, 'Раздел@',
            function(elem) {
               nodes.push(elem.get('id'));
            },
            function(elem) {
               lists.push(elem.get('id'));
            });
         
         assert.deepEqual(nodes, [1]);
         assert.deepEqual(lists, [2]);
      });

   });
});
