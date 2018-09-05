define('Controls-demo/Selector/FlatListSelectorWithTabs/DepartmentsSelector',
   [
      'Core/Control',
      'tmpl!Controls-demo/Selector/FlatListSelectorWithTabs/DepartmentsSelector',
      'Controls/Selector/Browser',
      'Controls-demo/Selector/SelectorData',
      'WS.Data/Source/Memory',
      'Controls-demo/Utils/MemorySourceFilter',
      'css!Controls-demo/Selector/FlatListSelectorWithTabs/DepartmentsSelector'
   ],
   
   function(Control, template, Browser, SelectorData, Memory, memorySourceFilter) {
      
      'use strict';
      
      return Control.extend({
         
         _template: template,
         _filter: {},
         _searchValue: '',
         
         _beforeMount: function() {
            this._source = new Memory({
               data: SelectorData.departments,
               filter: function(item, queryFilter) {
                  var selectionFilterFn = function(item, filter) {
                     var isSelected = false;
                     var itemId = item.get('department');
                     
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
               idProperty: 'department'
            });
         },
         
         _selectionFilter: function(item) {
            return item.has('department');
         }
         
      });
   });
