define(['Controls/search', 'Types/source', 'Core/core-instance', 'Types/collection', 'Types/entity'], function(searchMod, sourceLib, cInstance, collection, entity) {

   var data = [
      {
         id: 0,
         title: 'test'
      },
      {
         id: 1,
         title: 'test1'
      },
      {
         id: 2,
         title: 'test'
      },
      {
         id: 3,
         title: 'test2'
      }
   ];

   var memorySource = new sourceLib.Memory({
      data: data
   });

   var getDefaultOptions = function() {
      return {
         searchParam: 'test',
         searchValue: '',
         minSearchLength: 3,
         searchDelay: 50,
         sorting: [],
         filter: {},
         source: memorySource,
         navigation: {
            source: 'page',
            view: 'page',
            sourceConfig: {
               pageSize: 2,
               page: 0,
               hasMore: false
            }
         }
      };
   };

   var defaultOptions = getDefaultOptions();

   var getSearchController = function(additionalOptions) {
      var options = getDefaultOptions();
      var controller = new searchMod.Controller(Object.assign(options, additionalOptions || {}));
      controller.saveOptions(options);
      return controller;
   };

   var sandbox;

   describe('Controls/_search/Controller', function() {

      beforeEach(function() {
         sandbox = sinon.createSandbox();
      });

      afterEach(function() {
         sandbox.restore();
      });


      it('_private.searchCallback', function() {
         var controller = getSearchController();
         var filterChanged = false;
         var itemsChanged = false;
         var filter;
         var isBubbling;

         controller._notify = (eventName, value, eventArgs) => {
            if (eventName === 'filterChanged') {
               filterChanged = true;
               filter = value[0];
               isBubbling = eventArgs && eventArgs.bubbling
            }

            if (eventName === 'itemsChanged') {
               itemsChanged = true;
               isBubbling = eventArgs && eventArgs.bubbling
            }
         };

         controller._searchContext = { updateConsumers: () => {} };
         controller._viewMode = 'tile';

         searchMod.Controller._private.searchCallback(controller, {}, {test: 'testFilterValue'});

         assert.isFalse(controller._loading);
         assert.isTrue(filterChanged);
         assert.isTrue(itemsChanged);
         assert.isFalse(!!isBubbling);
         assert.equal(controller._viewMode, 'search');
         assert.equal(controller._previousViewMode, 'tile');
         assert.equal(controller._searchValue, 'testFilterValue');


         var rs = new collection.RecordSet({
            rawData: [],
            idProperty: 'id'
         });
         rs.setMetaData({
            results: new entity.Model({
               rawData: {
                  switchedStr: 'testStr'
               }
            })
         });
         var result = {
            data: rs
         };
         var filter = {
            test: 'test'
         };
         searchMod.Controller._private.searchCallback(controller, result, filter);

         assert.equal(controller._misspellValue, 'testStr');
         assert.deepEqual(filter, {test: 'test'});
         assert.equal(controller._previousViewMode, 'tile');
      });

      it('_private.abortCallback', function() {
         var controller = getSearchController();
         var filter = { 'Разворот': 'С разворотом', 'usePages': 'full', test: 'test' };

         controller._viewMode = 'search';
         controller._misspellValue = 'testStr';
         controller._loading = true;
         controller._searchValue = 'test';
         controller._inputSearchValue = 'testInputValue';
         controller._options.parentProperty = 'test';
         controller._options.filter = { 'Разворот': 'С разворотом', 'usePages': 'full', test: 'test', searchParam: 'testValue' };

         const stubNotify = sandbox.stub(controller, '_notify');

         controller._searchContext = { updateConsumers: function() {} };

         searchMod.Controller._private.abortCallback(controller, filter);

         assert.isTrue(stubNotify.calledOnce);
         assert.isTrue(controller._viewMode === 'search');
         assert.isFalse(controller._loading);
         assert.equal(controller._misspellValue, '');
         assert.equal(controller._searchValue, '');
         assert.equal(controller._inputSearchValue, 'testInputValue');
         assert.deepEqual(filter, {test: 'test'});

         controller._options.filter = { test: 'test' };
         searchMod.Controller._private.abortCallback(controller, filter);
         assert.isTrue(stubNotify.calledOnce);
         assert.deepEqual(filter, {test: 'test'});
      });

      it('_private.dataLoadCallback', function() {
         var dataLoadCallbackCalled = false;
         var controller = getSearchController({
            dataLoadCallback: function() {
               dataLoadCallbackCalled = true;
            }
         });

         controller._viewMode = 'search';
         controller._previousViewMode = 'testViewMode';
         controller._dataLoadCallback();

         assert.isTrue(dataLoadCallbackCalled);
         assert.equal(controller._viewMode, 'testViewMode');
      });

      it('_private.searchStartCallback', function() {
         var controller = getSearchController();
         var filter = {};

         //case 1. Without parentProperty
         searchMod.Controller._private.searchStartCallback(controller, filter);
         assert.isTrue(controller._loading);
         assert.deepEqual(filter, {});

         controller._options.parentProperty = 'test';
         controller._loading = false;

         //case 2. With parentProperty
         searchMod.Controller._private.searchStartCallback(controller, filter);
         assert.isTrue(controller._loading);
         assert.deepEqual(filter, { 'Разворот': 'С разворотом', 'usePages': 'full' });

         //case 3. With root and startingWith='current'
         controller._options.startingWith = 'current';
         controller._root = 'testRootNode';
         controller._loading = false;
         searchMod.Controller._private.searchStartCallback(controller, filter);
         assert.isTrue(controller._loading);
         assert.deepEqual(filter, { 'Разворот': 'С разворотом', 'usePages': 'full', 'test': 'testRootNode' });
      });

      it('_private.needUpdateSearchController', function() {
         assert.isFalse(searchMod.Controller._private.needUpdateSearchController({filter: {test: 'test'}}, {filter: {test: 'test'}}));
         assert.isFalse(searchMod.Controller._private.needUpdateSearchController({filter: {test: 'test'}}, {filter: {test: 'test1'}}));
         assert.isTrue(searchMod.Controller._private.needUpdateSearchController({minSearchLength: 3}, {minSearchLength: 2}));
         assert.isTrue(searchMod.Controller._private.needUpdateSearchController({minSearchLength: 3, sorting: [{}]}, {minSearchLength: 3, sorting: [{testField: "ASC"}]}));
      });

      it('_private.getSearchController', function() {
         var searchController = getSearchController();
         var controller;

         searchController._dataOptions = defaultOptions;
         controller = searchMod.Controller._private.getSearchController(searchController);
         assert.isTrue(cInstance.instanceOfModule(controller, 'Controls/search:_SearchController'));
         assert.deepEqual(controller._options.sorting, []);
      });

      it('_private.searchErrback', function() {
         let searchErrbackCalled = false;
         let err;

         let searchErrback = (error) => {
            searchErrbackCalled = true;
            err = error;
         };

         var searchController = getSearchController({dataLoadErrback: searchErrback});
         searchController._dataOptions = defaultOptions;
         searchController._loading = true;

         searchMod.Controller._private.searchErrback(searchController, 'test');
         assert.isTrue(searchErrbackCalled);
         assert.equal(err, 'test');
         assert.isFalse(searchController._loading);
      });

      it('_search', function() {
         var searchController = getSearchController();
         var value;
         searchController._dataOptions = defaultOptions;
         //initialize searchController
         searchMod.Controller._private.getSearchController(searchController);

         //moch method
         searchController._searchController.search = function(searchVal) {
            value = searchVal;
         };

         searchController._search(null, 'test');

         assert.equal(value, 'test');
         assert.equal(searchController._inputSearchValue, 'test');
      });

      describe('_beforeMount', function() {
         var searchController = getSearchController(defaultOptions);

         it('without option searchValue', function() {
            searchController._beforeMount({root: 'test', viewMode: 'notSearch'}, {});

            assert.equal(searchController._root, 'test');
            assert.equal(searchController._viewMode, 'notSearch');
         });

         it('with option searchValue', function() {
            searchController._beforeMount({searchValue: 'test2', root: 'test2', viewMode: 'notSearch'}, {});

            assert.equal(searchController._inputSearchValue, 'test2');
            assert.equal(searchController._searchValue, 'test2');
            assert.equal(searchController._root, 'test2');
            assert.equal(searchController._previousViewMode, 'notSearch');
            assert.equal(searchController._viewMode, 'search');
         })
      });

      describe('_beforeUpdate', function() {
         var searchController = getSearchController(defaultOptions);

         searchController._beforeMount({}, {dataOptions: defaultOptions});

         it('default options', function() {
            searchMod.Controller._private.getSearchController(searchController);
            searchController._beforeUpdate({searchValue: ''}, {dataOptions: defaultOptions});
            assert.isNull(searchController._searchController);
         });

         it('filter is changed', function() {
            var options = getDefaultOptions();

            options.filter = {test: 'testValue'};
            searchMod.Controller._private.getSearchController(searchController);
            searchController._beforeUpdate(options, {dataOptions: defaultOptions});
            assert.deepEqual(searchController._searchController.getFilter(), {test: 'testValue'});
         });

         it('search value is changed', function() {
            var value;

            searchController._inputSearchValue = 'test';
            searchController._options.searchValue = '';
            searchMod.Controller._private.getSearchController(searchController);
            searchController._search = function(searchVal) {
               value = searchVal;
            };

            it('equal _options.searchValue', function() {
               searchController._beforeUpdate({searchValue: ''}, {});
               assert.equal(value, undefined);
            });

            it('equal _inputSearchValue', function() {
               searchController._beforeUpdate({searchValue: 'test'}, {});
               assert.equal(value, undefined);
            });

            it('new value', function() {
               searchController._beforeUpdate({searchValue: 'test2'}, {});
               assert.equal(value, 'test2');
            });
         });
      });

      it('itemOpenHandler', function() {
         var searchController = getSearchController(defaultOptions);
         var searchAborted = false;
         var abortForced = false;

         //Controller moch
         searchController._searchController = {
            abort: function(force) {
               searchAborted = true;
               abortForced = force;
            }
         };

         searchController._root = 'test';
         searchController._itemOpenHandler(null);
         assert.isFalse(searchAborted);
         assert.equal(searchController._root, null);

         searchController._itemOpenHandler('test');
         assert.isTrue(searchAborted);
         assert.isTrue(abortForced);
         assert.equal(searchController._root, 'test');
         assert.equal(searchController._inputSearchValue, '');
      });

   });

});
