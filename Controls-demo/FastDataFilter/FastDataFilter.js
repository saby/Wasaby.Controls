define('Controls-demo/FastDataFilter/FastDataFilter',
   [
      'Core/Control',
      'tmpl!Controls-demo/FastDataFilter/FastDataFilter',
      'WS.Data/Source/Memory',
      'Controls/Filter/FastData',
      'css!Controls-demo/FastDataFilter/FastDataFilter'
   ],

   function (Control, template, Memory) {

      /**
       * @class Controls/Layout/Search
       * @extends Controls/Control
       * @control
       * @public
       */

      'use strict';

      var FastData = Control.extend({

         _template: template,
         dataSourceDemo3: [
            {
               name: 'first',
               idProperty: 'title',
               displayProperty: 'title',
               multiselect: true,
               selectedIndex: '1',
               dataSource: {
                  module: 'WS.Data/Source/Memory',
                  options: {
                     data: [
                        {key: 0, title: 'все страны'},
                        {key: 1, title: 'Россия'},
                        {key: 2, title: 'США'},
                        {key: 3, title: 'Великобритания'}
                     ]
                  }
               }
            },
            {
               name: 'second',
               idProperty: 'key',
               displayProperty: 'title',
               multiselect: false,
               dataSource: {
                  module: 'WS.Data/Source/Memory',
                  options: {
                     data: [
                        {key: 0, title: 'все жанры'},
                        {key: 1, title: 'фантастика'},
                        {key: 2, title: 'фэнтези'},
                        {key: 3, title: 'мистика'}
                     ]
                  }
               }
            },
            {
               name: 'third',
               idProperty: 'id',
               displayProperty: 'title',
               multiselect: false,
               dataSource:
                  [
                     {id: 1, title: 'Sun', kind: 'Star'},
                     {id: 2, title: 'Mercury', kind: 'Planet'},
                     {id: 3, title: 'Venus', kind: 'Planet'},
                     {id: 4, title: 'Earth', kind: 'Planet'},
                     {id: 5, title: 'Mars', kind: 'Planet'},
                     {id: 6, title: 'Jupiter', kind: 'Planet'},
                     {id: 7, title: 'Saturn', kind: 'Planet'},
                     {id: 8, title: 'Uranus', kind: 'Planet'},
                     {id: 9, title: 'Neptune', kind: 'Planet'},
                     {id: 10, title: 'Pluto', kind: 'Dwarf planet'}
                  ]
            }
         ],

         _createMemory: function (items) {
            return new Memory({
               idProperty: 'id',
               data: items
            });
         },
         _getDefaultMemory: function () {
            return this._createMemory(this.dataSourceDemo3);
         }
      });

      return FastData;
   });