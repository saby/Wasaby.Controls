define(['Controls/Search/Controller', 'WS.Data/Source/Memory', 'Core/core-instance', 'WS.Data/Collection/RecordSet', 'WS.Data/Entity/Model'], function(Search, Memory, cInstance, RecordSet, Model) {
   
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
   
   var memorySource = new Memory({
      data: data
   });
   
   var defaultOptions = {
      searchParam: 'test',
      minSearchLength: 3,
      searchDelay: 50,
      filter: {},
      source: memorySource,
      navigation: {
         source: 'page',
         view: 'page',
         sourceConfig: {
            pageSize: 2,
            page: 0,
            mode: 'totalCount'
         }
      }
   };
   
   var getSearchController = function() {
      var controller = new Search(defaultOptions);
      controller.saveOptions(defaultOptions);
      return controller;
   };
   
   describe('Controls.Search.Controller', function() {
      
      it('_private.searchCallback', function() {
         var controller = getSearchController();
         var filterChanged = false;
         var itemsChanged = false;
         var filter;
   
         controller._notify = function(eventName, value) {
            if (eventName === 'filterChanged') {
               filterChanged = true;
               filter = value[0];
            }
   
            if (eventName === 'itemsChanged') {
               itemsChanged = true;
            }
         };

         controller._searchContext = { updateConsumers: function() {} };

         Search._private.searchCallback(controller, {});
         
         assert.isTrue(controller._loading);
         assert.isTrue(filterChanged);
         assert.isTrue(itemsChanged);
         assert.isTrue(controller._viewMode === 'search');
   
   
         var rs = new RecordSet({
            rawData: [],
            idProperty: 'id'
         });
         rs.setMetaData({
            results: new Model({
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
         Search._private.searchCallback(controller, result, filter);
         
         assert.equal(controller._misspellValue, 'testStr');
         assert.deepEqual(filter, {test: 'test'});
      });
   
      it('_private.abortCallback', function() {
         var controller = getSearchController();
         controller._viewMode = 'search';
         controller._misspellValue = 'testStr';
         controller._loading = true;
         var filterChanged = false;
   
         controller._notify = function(eventName) {
            if (eventName = 'filterChanged') {
               filterChanged = true;
            }
         };

         controller._searchContext = { updateConsumers: function() {} };

         Search._private.abortCallback(controller);
   
         assert.isTrue(filterChanged);
         assert.isFalse(controller._viewMode === 'search');
         assert.isFalse(controller._loading);
         assert.equal(controller._misspellValue, '');
      });
   
      it('_private.searchStartCallback', function() {
         var self = {};
         Search._private.searchStartCallback(self);
         assert.isTrue(self._loading);
      });
   
      it('_private.needUpdateSearchController', function() {
         assert.isFalse(Search._private.needUpdateSearchController({filter: {test: 'test'}}, {filter: {test: 'test'}}));
         assert.isTrue(Search._private.needUpdateSearchController({filter: {test: 'test'}}, {filter: {test: 'test1'}}));
      });
   
      it('_private.getSearchController', function() {
         var searchController = getSearchController();
         searchController._dataOptions = defaultOptions;
         assert.isTrue(cInstance.instanceOfModule(Search._private.getSearchController(searchController), 'Controls/Controllers/_SearchController'));
      });
      
      it('_search', function() {
         var searchController = getSearchController();
         var value;
         searchController._dataOptions = defaultOptions;
         //initialize searchController
         Search._private.getSearchController(searchController);
         
         //moch method
         searchController._searchController.search = function(searchVal) {
            value = searchVal;
         };
   
         searchController._search(null, 'test');
         
         assert.equal(value, 'test');
      });
      
   });
   
});