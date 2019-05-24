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

   describe('Controls/_search/Controller', function() {

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
         assert.isFalse(!!isBubbling)
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
         var filterChanged = false;
         var filter = { 'Разворот': 'С разворотом', 'usePages': 'full' };

         controller._viewMode = 'search';
         controller._misspellValue = 'testStr';
         controller._loading = true;
         controller._searchValue = 'test';
         controller._options.parentProperty = 'test';

         controller._notify = function(eventName) {
            if (eventName = 'filterChanged') {
               filterChanged = true;
            }
         };

         controller._searchContext = { updateConsumers: function() {} };

         searchMod.Controller._private.abortCallback(controller, filter);

         assert.isTrue(filterChanged);
         assert.isTrue(controller._viewMode === 'search');
         assert.isFalse(controller._loading);
         assert.equal(controller._misspellValue, '');
         assert.equal(controller._searchValue, '');
         assert.equal(controller._inputSearchValue, '');
         assert.deepEqual(filter, {});
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
         assert.isTrue(cInstance.instanceOfModule(controller, 'Controls/Controllers/_SearchController'));
         assert.deepEqual(controller._options.sorting, []);
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

      it('_beforeMount', function() {
         var searchController = getSearchController(defaultOptions);
         searchController._beforeMount({searchValue: 'test'}, {dataOptions: defaultOptions});

         assert.equal(searchController._inputSearchValue, 'test');
      });

      it('_beforeUpdate', function() {
         var searchController = getSearchController(defaultOptions);
         searchController._beforeMount({}, {dataOptions: defaultOptions});

         searchMod.Controller._private.getSearchController(searchController);
         searchController._beforeUpdate({}, {dataOptions: defaultOptions});
         assert.isNull(searchController._searchController);

         searchMod.Controller._private.getSearchController(searchController);
         var options = getDefaultOptions();
         options.filter = {test: 'testValue'};
         searchController._beforeUpdate(options, {dataOptions: defaultOptions});
         assert.deepEqual(searchController._searchController.getFilter(), {test: 'testValue'});
      });

      it('itemOpenHandler', function() {
         var searchController = getSearchController(defaultOptions);
         var searchAborted = false;

         //Controller moch
         searchController._searchController = {
            abort: function() {
               searchAborted = true;
            }
         }

         searchController._itemOpenHandler(null);
         assert.isFalse(searchAborted);

         searchController._itemOpenHandler('test');
         assert.isTrue(searchAborted);
      });

   });

});
