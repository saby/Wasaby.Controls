define([
   'Controls/Explorer',
   'Core/Deferred'
], function(
   Explorer,
   Deferred
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
            testBreadCrumbs = [
               { id: 1, title: 'item1' },
               { id: 2, title: 'item2' },
               { id: 3, title: 'item3' }
            ],
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
            };
         Explorer._private.setRoot(self, testRoot);
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
         Explorer._private.dataLoadCallback(self, testData1);
         assert.deepEqual({
            _root: 'testRoot',
            _forceUpdate: forceUpdate,
            _notify: notify,
            _breadCrumbsItems: [],
            _breadCrumbsVisibility: false,
            _options: {
               dataLoadCallback: dataLoadCallback,
               itemOpenHandler: itemOpenHandler
            }
         }, self, 'Incorrect self data after "dataLoadCallback(self, testData1)".');
         assert.deepEqual(dataLoadCallbackArgument, testData1, 'Incorrect "dataLoadCallback" arguments.');
         Explorer._private.dataLoadCallback(self, testData2);
         assert.deepEqual({
            _root: 'testRoot',
            _forceUpdate: forceUpdate,
            _notify: notify,
            _breadCrumbsItems: testBreadCrumbs,
            _breadCrumbsVisibility: true,
            _options: {
               dataLoadCallback: dataLoadCallback,
               itemOpenHandler: itemOpenHandler
            }
         }, self, 'Incorrect self data after "dataLoadCallback(self, testData2)".');
         Explorer._private.dataLoadCallback(self, testData1);
         assert.deepEqual({
            _root: 'testRoot',
            _forceUpdate: forceUpdate,
            _notify: notify,
            _breadCrumbsItems: [],
            _breadCrumbsVisibility: false,
            _options: {
               dataLoadCallback: dataLoadCallback,
               itemOpenHandler: itemOpenHandler
            }
         }, self, 'Incorrect self data after "dataLoadCallback(self, testData1)".');
      });

      it('setViewMode', function() {
         var
            cfg = {
               root: 'rootNode',
               viewMode: 'tree'
            },
            newCfg = {
               viewMode: 'search',
               root: 'rootNode'
            },
            instance = new Explorer(cfg);
         instance.saveOptions(cfg);
         instance._beforeMount(cfg);
         assert.equal(instance._viewMode, 'tree');
         assert.equal(instance._viewName, Explorer._constants.VIEW_NAMES.tree);
         assert.equal(instance._viewModelConstructor, Explorer._constants.VIEW_MODEL_CONSTRUCTORS.tree);
         assert.equal(instance._leftPadding, undefined);
         instance._beforeUpdate(newCfg);
         assert.equal(instance._viewMode, 'search');
         assert.equal(instance._viewName, Explorer._constants.VIEW_NAMES.search);
         assert.equal(instance._viewModelConstructor, Explorer._constants.VIEW_MODEL_CONSTRUCTORS.search);
         assert.equal(instance._leftPadding, 'search');
      });

      it('_notifyHandler', function() {
         var
            instance = new Explorer(),
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
         assert.equal(result, 123);
         assert.equal(events[0].eventName, 'itemActionsClick');
         assert.deepEqual(events[0].eventArgs, [1, 2]);
         assert.equal(events[1].eventName, 'beforeBeginEdit');
         assert.deepEqual(events[1].eventArgs, []);
      });

      describe('EditInPlace', function() {
         it('beginEdit', function() {
            var opt = {
               test: '123'
            };
            var
               instance = new Explorer({});
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
               instance = new Explorer({});
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
               instance = new Explorer({});
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
               instance = new Explorer({});
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
   });
});
