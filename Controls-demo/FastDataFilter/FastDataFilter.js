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
               source: {
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
               source: {
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