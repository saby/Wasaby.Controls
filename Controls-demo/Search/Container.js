/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/Search/Container', [
   'Core/Control',
   'tmpl!Controls-demo/Search/Container',
   'WS.Data/Source/Memory',
   'Controls-demo/Utils/MemorySourceData',
   'Controls-demo/Utils/MemorySourceFilter',
   'css!Controls-demo/Search/Container'
], function(Control, template, MemorySource, memorySourceData, memorySourceFilter) {
   
   'use strict';
   
   var SearchContainer = Control.extend({
      _template: template,
      _navigation: {
         source: 'page',
         view: 'page',
         sourceConfig: {
            pageSize: 20,
            page: 0,
            mode: 'totalCount'
         }
      },
      _filter: {},
      _searchValue: '',
      _searchDelay: 500,
      
      _beforeMount: function() {
         this._source = new MemorySource({
            data: memorySourceData,
            filter: memorySourceFilter('firstName'),
            idProperty: 'id'
         });
      }
   });
   
   return SearchContainer;
});