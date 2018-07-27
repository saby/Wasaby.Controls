define(['Controls/Explorer'], function(Explorer) {
   describe('Controls.Explorer', function() {
      it('_private block', function() {
         var
            dataLoadCallbackCalled = false,
            dataLoadCallback = function() {
               dataLoadCallbackCalled = true;
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
         assert.isTrue(dataLoadCallbackCalled, 'Incorrect value "dataLoadCallbackCalled" after call "dataLoadCallback(...)".');
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
      
   });
});
