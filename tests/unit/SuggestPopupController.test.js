define(['Controls/Input/resources/SuggestPopupController', 'Core/core-instance', 'WS.Data/Source/Memory','WS.Data/Collection/List'],
   function(SuggestPopupController, cInstance, Memory, List) {
   
   'use strict';
      
      describe('Controls.Input.SuggestPopupController', function () {
         
         it('.getSearchController', function() {
            var self = {
               _dataSource: new Memory()
            };
            
            var searchController = SuggestPopupController._private.getSearchController(self);
            assert.isTrue(cInstance.instanceOfModule(searchController, 'Controls/Controllers/SearchController/__Search'));
            assert.isTrue(cInstance.instanceOfModule(searchController._dataSource, 'WS.Data/Source/Memory'));
         });
   
         it('.prepareSuggestFilter', function() {
            var selfTest = {
                  _searchParam: 'test'
               };
   
            selfTest._popupOptions = {
               componentOptions: {
                  filter: {
                     test: 123
                  }
               }
            };
   
            SuggestPopupController._private.prepareSuggestFilter(selfTest, {hasMore: true});
            assert.equal(selfTest._popupOptions.componentOptions.filter.test, 123);
   
            SuggestPopupController._private.prepareSuggestFilter(selfTest, {hasMore: false});
            assert.equal(selfTest._popupOptions.componentOptions.filter.test, undefined);
            
         });
   
         it('.changeSelectedIndex', function() {
            var list = new List({items: [1, 2]}),
                selfTest = {};
   
            selfTest._popupOpener = {
               open: function(){}
            };
            selfTest._selectedIndex = 0;
            selfTest._popupOptions = {
               componentOptions: {
                  items: list
               }
            };
   
            SuggestPopupController._private.increaseSelectedIndex(selfTest);
            assert.equal(selfTest._selectedIndex, 1);
   
            SuggestPopupController._private.increaseSelectedIndex(selfTest);
            assert.equal(selfTest._selectedIndex, 1);
   
            SuggestPopupController._private.decreaseSelectedIndex(selfTest);
            assert.equal(selfTest._selectedIndex, 0);
   
            SuggestPopupController._private.decreaseSelectedIndex(selfTest);
            assert.equal(selfTest._selectedIndex, 0);
   
            SuggestPopupController._private.setSuggestSelectedIndex(selfTest, 2);
            assert.equal(selfTest._selectedIndex, 2);
            assert.equal(selfTest._popupOptions.componentOptions.selectedIndex, 2);
         });
         
      });
      
   }
);