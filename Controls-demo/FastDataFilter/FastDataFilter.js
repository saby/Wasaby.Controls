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
               id: 'filter1',
               idProperty: 'title',
               displayProperty: 'title',
               value: 'США',
               resetValue: 'все страны',
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

               id: 'filter2',
               idProperty: 'key',
               displayProperty: 'title',
               resetValue: '0',
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
            },
            {
               id: 'fafaf',
               idProperty: 'lastName',
               displayProperty: 'title',
               value: '0',
               resetValue: '3',
               source: {
                  module: 'WS.Data/Source/Memory',
                  options: {
                     data: [
                        {id: 0, lastName: '0', title: 'aaaa'},
                        {id: 1, lastName: '1', title: '333'},
                        {id: 2, lastName: '2', title: 'iwfyls'},
                        {id: 3, lastName: '3', title: 'reset to me'},
                        {id: 3, lastName: '4', title: 'Oomph!'}
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