/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/Filter/Container', [
   'Core/Control',
   'tmpl!Controls-demo/Filter/Container',
   'WS.Data/Source/Memory',
   'Controls-demo/Utils/MemorySourceData',
   'css!Controls-demo/Filter/Container'
], function(Control, template, MemorySource, memorySourceData) {
   
   'use strict';
   
   var filterData = [
      {
         id: 'firstName',
         resetValue: 'По имени',
         value: 'По имени',
         properties: {
            keyProperty: 'title',
            displayProperty: 'title',
            source: {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {id: 0, title: 'По имени'},
                     {id: 1, title: 'Sasha'},
                     {id: 2, title: 'Petr'},
                     {id: 3, title: 'Ivan'},
                     {id: 3, title: 'Andrey'}
                  ]
               }
            }
         }
      },
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
         visibility: true,
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
      _filterData: filterData,
      _filterButtonData: filterButtonData,
      
      _beforeMount: function() {
         this._source = new MemorySource({
            data: memorySourceData,
            idProperty: 'id'
         });
      }
   });
   
   return SearchContainer;
});