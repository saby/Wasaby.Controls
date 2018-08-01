define(['Controls/Search/Container', 'WS.Data/Source/Memory', 'Core/core-instance'], function(Search, Memory, cInstance) {
   
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
   
   var getSearchContainer = function() {
      var container = new Search(defaultOptions);
      container.saveOptions(defaultOptions);
      return container;
   };
   
   describe('Controls.Search.Container', function() {
      
      it('_private.searchCallback', function() {
         var container = getSearchContainer();
         var filterChanged = false;
         var itemsChanged = false;
   
         container._notify = function(eventName) {
            if (eventName = 'filterChanged') {
               filterChanged = true;
            }
   
            if (eventName = 'itemsChanged') {
               itemsChanged = true;
            }
         };
         
         Search._private.searchCallback(container, {});
         
         assert.isTrue(filterChanged);
         assert.isTrue(itemsChanged);
         assert.isTrue(container._searchMode);
      });
   
      it('_private.abortCallback', function() {
         var container = getSearchContainer();
         container._searchMode = true;
         var filterChanged = false;
   
         container._notify = function(eventName) {
            if (eventName = 'filterChanged') {
               filterChanged = true;
            }
         };
   
         Search._private.abortCallback(container);
   
         assert.isTrue(filterChanged);
         assert.isFalse(container._searchMode);
      });
   
      it('_private.needUpdateSearchController', function() {
         assert.isFalse(Search._private.needUpdateSearchController({filter: {test: 'test'}}, {filter: {test: 'test'}}));
         assert.isTrue(Search._private.needUpdateSearchController({filter: {test: 'test'}}, {filter: {test: 'test1'}}));
      });
   
      it('_private.getSearchController', function() {
         var searchContainer = getSearchContainer();
         searchContainer._dataOptions = defaultOptions;
         assert.isTrue(cInstance.instanceOfModule(Search._private.getSearchController(searchContainer), 'Controls/Controllers/_SearchController'));
      });
      
      it('_search', function() {
         var searchContainer = getSearchContainer();
         var value;
         searchContainer._dataOptions = defaultOptions;
         //initialize searchController
         Search._private.getSearchController(searchContainer);
         
         //moch method
         searchContainer._searchController.search = function(searchVal) {
            value = searchVal;
         };
   
         searchContainer._search(null, 'test');
         
         assert.equal(value, 'test');
      });
      
   });
   
});