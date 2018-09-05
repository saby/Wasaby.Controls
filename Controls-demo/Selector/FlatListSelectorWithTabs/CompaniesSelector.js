define('Controls-demo/Selector/FlatListSelectorWithTabs/CompaniesSelector',
   [
      'Core/Control',
      'tmpl!Controls-demo/Selector/FlatListSelectorWithTabs/CompaniesSelector',
      'Controls/Selector/Browser',
      'Controls-demo/Selector/SelectorData',
      'WS.Data/Source/Memory',
      'Controls-demo/Utils/MemorySourceFilter',
      'css!Controls-demo/Selector/FlatListSelectorWithTabs/CompaniesSelector'
   ],
   
   function(Control, template, Browser, SelectorData, Memory, memorySourceFilter) {
      
      'use strict';
      
      return Control.extend({
         
         _template: template,
         _filter: {},
         _searchValue: '',
         
         _beforeMount: function() {
            this._source = new Memory({
               data: SelectorData.companies,
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
         },
         
         _selectionFilter: function(item) {
            return item.has('city');
         }
      });
   });
