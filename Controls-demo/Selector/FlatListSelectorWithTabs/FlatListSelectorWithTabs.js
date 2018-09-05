define('Controls-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs',
   [
      'Core/Control',
      'tmpl!Controls-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs',
      'Controls/Selector/Browser',
      'Controls-demo/Selector/SelectorData',
      'WS.Data/Source/Memory',
      'Controls-demo/Utils/MemorySourceFilter',
      'WS.Data/Collection/RecordSet',
      'Controls/Tabs/Buttons',
      'Controls/SwitchableArea',
      'Controls-demo/Selector/FlatListSelectorWithTabs/DepartmentsSelector',
      'Controls-demo/Selector/FlatListSelectorWithTabs/CompaniesSelector',
      'css!Controls-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs'
   ],
   
   function(Control, template, Browser, SelectorData, Memory, memorySourceFilter, RecordSet) {
      
      'use strict';
      
      var filterFn = function(item, queryFilter) {
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
      };
      
      return Control.extend({
         
         _template: template,
         _selectedTab: 'Companies',
         
         _beforeMount: function() {
            this._tabSource = new Memory({
               data: [
                  {id: 'Companies', title: 'Companies'},
                  {id: 'Departments', title: 'Departments'}
               ],
               idProperty: 'id'
            });
            
            this._switchableAreaItems = new RecordSet({
               rawData: [
                  {id: 'Companies', itemTemplate: 'Controls-demo/Selector/FlatListSelectorWithTabs/CompaniesSelector'},
                  {id: 'Departments', itemTemplate: 'Controls-demo/Selector/FlatListSelectorWithTabs/DepartmentsSelector'}
               ],
               idProperty: 'id'
            });
         }
      });
   });
