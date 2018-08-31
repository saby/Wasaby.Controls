define('Controls-demo/Selector/FlatListSelector/FlatListSelector',
   [
      'Core/Control',
      'tmpl!Controls-demo/Selector/FlatListSelector/FlatListSelector',
      'Controls/Selector/Browser',
      'Controls-demo/Selector/FlatListSelector/FlatListData',
      'WS.Data/Source/Memory',
      'Controls-demo/Utils/MemorySourceFilter',
      'css!Controls-demo/Selector/FlatListSelector/FlatListSelector'
   ],
   
   function(Control, template, Browser, FlatListData, Memory, memorySourceFilter) {
      
      'use strict';
      
      return Control.extend({
         
         _template: template,
         _filter: {},
         _searchValue: '',
         
         _beforeMount: function() {
            this._source = new Memory({
               data: FlatListData,
               filter: function(item, queryFilter) {
                  var selectionFilterFn = function(item, filter) {
                     var isSelected = false;
                     var itemId = item.get('id');
                     
                     filter.selection.get('marked').forEach(function(selectedId) {
                        if (selectedId === itemId || (selectedId === null && filter.selection.get('excluded').indexOf(itemId) === -1)) {
                           isSelected = true;
                        }
                     });
                     
                     return isSelected;
                  };
                  var normalFilterFn = memorySourceFilter();
   
                  return queryFilter.selection ? selectionFilterFn(item, queryFilter) : normalFilterFn(item, queryFilter);
               },
               idProperty: 'id'
            });
         }
      });
   });
