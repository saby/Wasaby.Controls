define(['Controls/Explorer'], function(Explorer) {
   describe('Controls.Explorer', function() {
      it('_private block', function() {
         var
            dataLoadCallbackArgument = null,
            dataLoadCallback = function(data) {
               dataLoadCallbackArgument = data;
            },
            forceUpdate = function() {},
            self = {
               _forceUpdate: forceUpdate,
               _options: {
                  dataLoadCallback: dataLoadCallback
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
            _options: {
               dataLoadCallback: dataLoadCallback
            }
         }, self, 'Incorrect self data after "setRoot(self, testRoot)".');
         Explorer._private.dataLoadCallback(self, testData1);
         assert.deepEqual({
            _root: 'testRoot',
            _forceUpdate: forceUpdate,
            _breadCrumbsItems: [],
            _breadCrumbsVisibility: false,
            _options: {
               dataLoadCallback: dataLoadCallback
            }
         }, self, 'Incorrect self data after "dataLoadCallback(self, testData1)".');
         assert.deepEqual(dataLoadCallbackArgument, testData1, 'Incorrect "dataLoadCallback" arguments.');
         Explorer._private.dataLoadCallback(self, testData2);
         assert.deepEqual({
            _root: 'testRoot',
            _forceUpdate: forceUpdate,
            _breadCrumbsItems: testBreadCrumbs,
            _breadCrumbsVisibility: true,
            _options: {
               dataLoadCallback: dataLoadCallback
            }
         }, self, 'Incorrect self data after "dataLoadCallback(self, testData2)".');
         Explorer._private.dataLoadCallback(self, testData1);
         assert.deepEqual({
            _root: 'testRoot',
            _forceUpdate: forceUpdate,
            _breadCrumbsItems: [],
            _breadCrumbsVisibility: false,
            _options: {
               dataLoadCallback: dataLoadCallback
            }
         }, self, 'Incorrect self data after "dataLoadCallback(self, testData1)".');
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
         instance._notifyHandler({}, 'beforeItemAdd');
         assert.equal(result, 123);
         assert.equal(events[0].eventName, 'itemActionsClick');
         assert.deepEqual(events[0].eventArgs, [1, 2]);
         assert.equal(events[1].eventName, 'beforeItemAdd');
         assert.deepEqual(events[1].eventArgs, []);
      });
   });
});
