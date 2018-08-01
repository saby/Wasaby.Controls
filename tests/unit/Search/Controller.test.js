define(['Controls/Search/Controller', 'WS.Data/Source/Memory', 'Core/core-instance'], function(Search, Memory, cInstance) {
   
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
   
         controller._notify = function(eventName) {
            if (eventName = 'filterChanged') {
               filterChanged = true;
            }
   
            if (eventName = 'itemsChanged') {
               itemsChanged = true;
            }
         };
         
         Search._private.searchCallback(controller, {});
         
         assert.isTrue(filterChanged);
         assert.isTrue(itemsChanged);
         assert.isTrue(controller._searchMode);
      });
   
      it('_private.abortCallback', function() {
         var controller = getSearchController();
         controller._searchMode = true;
         var filterChanged = false;
   
         controller._notify = function(eventName) {
            if (eventName = 'filterChanged') {
               filterChanged = true;
            }
         };
   
         Search._private.abortCallback(controller);
   
         assert.isTrue(filterChanged);
         assert.isFalse(controller._searchMode);
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