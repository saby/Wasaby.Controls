/**
 * Created by am.gerasimov on 26.01.2018.
 */
/**
 * Created by kraynovdo on 01.11.2017.
 */
define('Controls-demo/Layouts/SearchLayout', [
   'Core/Control',
   'tmpl!Controls-demo/Layouts/SearchLayout/SearchLayout',
   'WS.Data/Source/Memory',
   'Controls/List',
   'css!Controls-demo/Layouts/SearchLayout/SearchLayout',
   'Controls/Input/Text',
   'Controls-demo/Layouts/LayoutFilterComponent',
   'Controls/Layout/Filter',
   'Controls/Layout/Search'
], function (BaseControl,
             template,
             MemorySource
) {
   'use strict';

   var sourceData = [
      { id: 1, title: 'Sasha', lastName: 'aaaa' },
      { id: 2, title: 'Dmitry', lastName: 'aaaa' },
      { id: 3, title: 'Andrey', lastName: 'aaaa' },
      { id: 4, title: 'Aleksey', lastName: 'aaaa' },
      { id: 5, title: 'Sasha', lastName: 'aaaa' },
      { id: 6, title: 'Ivan', lastName: 'dfsf'},
      { id: 7, title: 'Petr', lastName: 'dfsf'},
      { id: 8, title: 'Roman', lastName: 'dfsf'},
      { id: 9, title: 'Maxim', lastName: 'dfsf'},
      { id: 10, title: 'Andrey', lastName: 'dfsf'},
      { id: 12, title: 'Sasha', lastName: 'dfsf'},
      { id: 13, title: 'Sasha', lastName: 'dfsf'},
      { id: 14, title: 'Sasha', lastName: 'dfsf'},
      { id: 15, title: 'Sasha', lastName: 'dfsf'},
      { id: 16, title: 'Sasha', lastName: 'dfsf'},
      { id: 17, title: 'Sasha', lastName: 'dfsf'},
      { id: 18, title: 'Dmitry', lastName: 'dfsf'},
      { id: 19, title: 'Andrey', lastName: 'dfsf'},
      { id: 20, title: 'Aleksey', lastName: 'dfsf'},
      { id: 21, title: 'Sasha', lastName: 'dfsf'},
      { id: 22, title: 'Ivan', lastName: 'dfsf'},
      { id: 23, title: 'Petr', lastName: 'dfgdfg' }
   ];

   var filterData = [
      {
         id: 'title',
         idProperty: 'title',
         displayProperty: 'title',
         source: {
            module: 'WS.Data/Source/Memory',
            options: {
               data: [
                  {id: 0, title: 'All'},
                  {id: 1, title: 'Sasha'},
                  {id: 2, title: 'Petr'},
                  {id: 3, title: 'Ivan'},
                  {id: 3, title: 'Andrey'}
               ]
            }
         }
      },
      {
         id: 'id',
         idProperty: 'id',
         displayProperty: 'title',
         source: {
            module: 'WS.Data/Source/Memory',
            options: {
               data: [
                  {id: 0, title: 'All'},
                  {id: 1, title: '0'},
                  {id: 2, title: '1'},
                  {id: 3, title: '2'},
                  {id: 3, title: '3'}
               ]
            }
         }
      },
      {
         id: 'name',
         idProperty: 'lastName',
         displayProperty: 'title',
         source: {
            module: 'WS.Data/Source/Memory',
            options: {
               data: [
                  {id: 0, title: 'All', lastName: 'aaaa'},
                  {id: 1, title: '0', lastName: 'aaaa'},
                  {id: 2, title: '1', lastName: 'aaaa'},
                  {id: 3, title: '2', lastName: 'aaaa'},
                  {id: 3, title: '3', lastName: 'aaaa'}
               ]
            }
         }
      }
   ];

   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         _dataSource: new MemorySource({
            idProperty: 'id',
            data: sourceData
         }),
         _switchValue: false,
         _filterSource: new MemorySource({
            idProperty: 'id',
            data: filterData
         })
      });
   return ModuleClass;
});