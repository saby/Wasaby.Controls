define([
   'Controls/List/TreeControl',
   'Core/Deferred',
   'Core/core-instance',
   'Controls/List/TreeGridView/TreeGridViewModel',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Source/Memory'
], function(
   TreeControl,
   Deferred,
   cInstance,
   TreeGridViewModel,
   RecordSet,
   Memory
) {
   describe('Controls.List.TreeControl', function() {
      it('TreeControl.reload', function() {
         var
            treeControl = new TreeControl({}),
            treeGridViewModel = new TreeGridViewModel({
               columns: [],
               items: new RecordSet({
                  rawData: [],
                  idProperty: 'id'
               })
            }),
            isSourceControllerDestroyed = false;
         treeControl._children = {
            baseControl: {
               reload: function() {
                  var def = new Deferred();
                  def.callback();
                  return def;
               },
               getViewModel: function() {
                  return treeGridViewModel;
               }
            }
         };
         treeControl._nodesSourceControllers = {
            1: {
               destroy: function() {
                  isSourceControllerDestroyed = true;
               }
            }
         };
         treeControl.reload();
         assert.deepEqual({}, treeControl._nodesSourceControllers, 'Invalid value "_nodesSourceControllers" after call "treeControl.reload()".');
         assert.isTrue(isSourceControllerDestroyed, 'Invalid value "isSourceControllerDestroyed" after call "treeControl.reload()".');
      });
      it('TreeControl._beforeUpdate', function() {
         var
            reloadCalled = false,
            setRootCalled = false,
            opts = { parentProperty: 'parent' },
            treeControl = new TreeControl(opts),
            treeGridViewModel = new TreeGridViewModel({
               columns: [],
               items: new RecordSet({
                  rawData: [],
                  idProperty: 'id'
               })
            });
         treeGridViewModel.setRoot = function() {
            setRootCalled = true;
         };
         treeControl.saveOptions(opts);
         treeControl._children = {
            baseControl: {
               reload: function(filter) {
                  var def = new Deferred();
                  reloadCalled = true;
                  assert.equal(filter['parent'], 'testRoot', 'Invalid value "filter[parentProperty]" after call "_beforeUpdate" with new "root"');
                  def.callback();
                  return def;
               },
               getViewModel: function() {
                  return treeGridViewModel;
               }
            }
         };
         treeControl._beforeUpdate({ root: 'testRoot' });
         treeControl._afterUpdate({ root: '' });
         assert.isTrue(reloadCalled, 'Invalid call "reload" after call "_beforeUpdate" and apply new "root".');
         assert.isTrue(setRootCalled, 'Invalid call "setRoot" after call "_beforeUpdate" and apply new "root".');
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
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  beginEdit: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
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
               treeControl = new TreeControl({});
            treeControl.saveOptions({ readOnly: true });
            var result = treeControl.beginEdit(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('beginAdd', function() {
            var opt = {
               test: '123'
            };
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  beginAdd: function(options) {
                     assert.equal(opt, options);
                     return Deferred.success();
                  }
               }
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
               treeControl = new TreeControl({});
            treeControl.saveOptions({ readOnly: true });
            var result = treeControl.beginAdd(opt);
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });
         it('cancelEdit', function() {
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  cancelEdit: function() {
                     return Deferred.success();
                  }
               }
            };
            var result = treeControl.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('cancelEdit, readOnly: true', function() {
            var
               treeControl = new TreeControl({});
            treeControl.saveOptions({ readOnly: true });
            var result = treeControl.cancelEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });

         it('commitEdit', function() {
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  commitEdit: function() {
                     return Deferred.success();
                  }
               }
            };
            var result = treeControl.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isTrue(result.isSuccessful());
         });

         it('commitEdit, readOnly: true', function() {
            var
               treeControl = new TreeControl({});
            treeControl.saveOptions({ readOnly: true });
            var result = treeControl.commitEdit();
            assert.isTrue(cInstance.instanceOfModule(result, 'Core/Deferred'));
            assert.isFalse(result.isSuccessful());
         });
      });
      it('All items collapsed after reload', function() {
         var
            treeControl = new TreeControl({}),
            treeGridViewModel = new TreeGridViewModel({
               expandedItems: [2246, 452815, 457244, 471641],
               columns: [],
               items: new RecordSet({
                  rawData: [],
                  idProperty: 'id'
               })
            });

         treeControl._children = {
            baseControl: {
               reload: function() {
                  var def = new Deferred();
                  def.callback();
                  return def;
               },
               getViewModel: function() {
                  return treeGridViewModel;
               }
            }
         };

         treeControl.reload();
         assert.deepEqual({}, treeGridViewModel._model._expandedItems);
      });
      it('Expand all', function() {
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
               expandedItems: [null]
            },
            treeControl = new TreeControl(cfg),
            treeGridViewModel = new TreeGridViewModel(cfg);
         treeGridViewModel.setItems(new RecordSet({
            rawData: rawData,
            idProperty: 'id'
         }));
         treeControl.saveOptions(cfg);
         treeControl._children = {
            baseControl: {
               reload: function() {
                  var def = new Deferred();
                  def.callback();
                  return def;
               },
               getViewModel: function() {
                  return treeGridViewModel;
               }
            }
         };
         assert.deepEqual({null: true}, treeGridViewModel._model._expandedItems);
         assert.deepEqual({}, treeGridViewModel._model._collapsedItems);
         treeGridViewModel.toggleExpanded(treeGridViewModel._model._display.at(0));
         assert.deepEqual({null: true}, treeGridViewModel._model._expandedItems);
         assert.deepEqual({1: true}, treeGridViewModel._model._collapsedItems);
      });
   });
});
