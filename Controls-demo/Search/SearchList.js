/**
 * Created by am.gerasimov on 26.01.2018.
 */
/**
 * Created by kraynovdo on 01.11.2017.
 */
define('Controls-demo/Search/SearchList',
   [
      'Core/Control',
      'tmpl!Controls-demo/Search/SearchList',
      'WS.Data/Source/Memory',
      'css!Controls-demo/Search/SearchList'
   ],
   
   function(BaseControl, template, MemorySource) {
      
      'use strict';
      
      var sourceData = [
         { id: 1, firstName: 'Sasha', lastName: 'aaaa' },
         { id: 2, firstName: 'Dmitry', lastName: 'aaaa' },
         { id: 3, firstName: 'Andrey', lastName: 'aaaa' },
         { id: 4, firstName: 'Aleksey', lastName: 'aaaa' },
         { id: 5, firstName: 'Sasha', lastName: 'aaaa' },
         { id: 6, firstName: 'Ivan', lastName: 'Lalala'},
         { id: 7, firstName: 'Petr', lastName: 'dfsf'},
         { id: 8, firstName: 'Roman', lastName: 'dfsf'},
         { id: 9, firstName: 'Maxim', lastName: 'dfsf'},
         { id: 10, firstName: 'Andrey', lastName: 'Lalala'},
         { id: 12, firstName: 'Sasha', lastName: 'dfsf'},
         { id: 13, firstName: 'Sasha', lastName: 'dfsf'},
         { id: 14, firstName: 'Sasha', lastName: 'dfsf'},
         { id: 15, firstName: 'Sasha', lastName: 'dfsf'},
         { id: 16, firstName: 'Sasha', lastName: 'Lalala'},
         { id: 17, firstName: 'Sasha', lastName: 'dfsf'},
         { id: 18, firstName: 'Dmitry', lastName: 'Lalala'},
         { id: 19, firstName: 'Andrey', lastName: 'dfsf'},
         { id: 20, firstName: 'Aleksey', lastName: 'dfsf'},
         { id: 21, firstName: 'Sasha', lastName: 'dfsf'},
         { id: 22, firstName: 'Ivan', lastName: 'dfsf'},
         { id: 23, firstName: 'Petr', lastName: 'dfgdfg' }
      ];
      
      return BaseControl.extend(
         {
            _template: template,
            _searchValue: '',
            _sourceSearch: new MemorySource({
               idProperty: 'id',
               data: sourceData
            }),
            _sourceFilter: new MemorySource({
               idProperty: 'id',
               data: sourceData
            })
         });
   });
