define(['Controls/List/TreeControl', 'Core/Deferred'], function(TreeControl, cDeferred) {
   describe('Controls.List.TreeControl', function() {
      it('TreeControl.reload', function() {
         var
            treeControl = new TreeControl({}),
            isSourceControllerDestroyed = false;
         treeControl._children = {
            baseControl: {
               reload: function() {},
               getViewModel: function() {
                  return {
                     setHasMoreStorage: function() {}
                  };
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
            treeControl = new TreeControl(opts);
         treeControl.saveOptions(opts);
         treeControl._children = {
            baseControl: {
               reload: function(filter) {
                  reloadCalled = true;
                  assert.equal(filter['parent'], 'testRoot', 'Invalid value "filter[parentProperty]" after call "_beforeUpdate" with new "root"');
               },
               getViewModel: function() {
                  return {
                     setHasMoreStorage: function() {},
                     setRoot: function() {
                        setRootCalled = true;
                     }
                  };
               }
            }
         };
         treeControl._beforeUpdate({ root: 'testRoot' });
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
                           result = new cDeferred();
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
         it('editItem', function(done) {
            var opt = {
               test: '123'
            };
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  editItem: function(options) {
                     assert.equal(opt, options);
                     done();
                  }
               }
            };
            treeControl.editItem(opt);
         });

         it('addItem', function(done) {
            var opt = {
               test: '123'
            };
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  addItem: function(options) {
                     assert.equal(opt, options);
                     done();
                  }
               }
            };
            treeControl.addItem(opt);
         });

         it('cancelEdit', function(done) {
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  cancelEdit: function() {
                     done();
                  }
               }
            };
            treeControl.cancelEdit();
         });

         it('commitEdit', function(done) {
            var
               treeControl = new TreeControl({});
            treeControl._children = {
               baseControl: {
                  commitEdit: function() {
                     done();
                  }
               }
            };
            treeControl.commitEdit();
         });
      });
      it('TreeControl._onNodeRemoved', function() {
         var
            treeControl = new TreeControl({});

         treeControl._nodesSourceControllers = {
            1: {
               destroy: function() {}
            },
            2: {},
            3: {}
         };
         treeControl._onNodeRemoved(null, 1);
         assert.deepEqual({ 2: {}, 3: {} }, treeControl._nodesSourceControllers, 'Incorrect value "_nodesSourceControllers" after call "treeControl._onNodeRemoved(null, 1)".');
      });
   });
});
