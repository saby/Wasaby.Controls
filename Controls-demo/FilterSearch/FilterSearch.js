/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/FilterSearch/FilterSearch', [
   'Core/Control',
   'tmpl!Controls-demo/FilterSearch/FilterSearch',
   'WS.Data/Source/Memory',
   'Controls-demo/Utils/MemorySourceData',
   'Controls-demo/Utils/MemorySourceFilter',
   'css!Controls-demo/FilterSearch/FilterSearch'
], function(Control, tempalte, MemorySource, memorySourceData, memorySourceFilter) {
   
   'use strict';
   
   var filterData = [
      {
         id: 'id',
         resetValue: 0,
         value: 0,
         properties: {
            keyProperty: 'id',
            displayProperty: 'title',
            source: {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {id: 0, title: 'По id'},
                     {id: 1, title: '1'},
                     {id: 2, title: '2'},
                     {id: 3, title: '3'},
                     {id: 4, title: '4'},
                     {id: 5, title: '5'},
                     {id: 6, title: '6'},
                     {id: 7, title: '7'}
                  ]
               }
            }
         }
      },
      {
         id: 'lastName',
         resetValue: '0',
         value: '0',
         properties: {
            keyProperty: 'lastName',
            displayProperty: 'title',
            source: {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {id: 0, title: 'По фамилии', lastName: '0'},
                     {id: 1, title: 'Gerasimov', lastName: 'Gerasimov'},
                     {id: 2, title: 'Avramenko', lastName: 'Avramenko'},
                     {id: 3, title: 'Такой нет', lastName: '...'},
                     {id: 4, title: 'UzeUvolen', lastName: 'UzeUvolen'},
                  ]
               }
            }
         }
      }
   ];
   
   var filterButtonData = [{
      id: 'lastName',
      resetValue: '0',
      value: '0',
      visibility: true,
   }];
   
   var SearchContainer = Control.extend({
      _template: tempalte,
      _source: new MemorySource({
         data: memorySourceData,
         filter: memorySourceFilter('firstName'),
         idProperty: 'id'
      }),
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
      _fastFilterData: filterData,
      _filterButtonData: filterButtonData
   });
   
   return SearchContainer;
});