define('Controls-demo/FastDataFilter/FastDataFilter',
   [
      'Core/Control',
      'tmpl!Controls-demo/FastDataFilter/FastDataFilter',
      'WS.Data/Source/Memory',
      'WS.Data/Chain',
      'Controls/Filter/FastData'
   ],

   function(Control, template, Memory, Chain) {

      /**
       * @class Controls/Layout/Search
       * @extends Controls/Control
       * @control
       * @public
       */

      'use strict';

      var FastData = Control.extend({

         _template: template,
         _selectedKeys2: '3',
         _defaultItems: [
            {
               id: '1',
               title: 'Запись 1'
            },
            {
               id: '2',
               title: 'Запись 2'
            },
            {
               id: '3',
               title: 'Запись 3'
            },
            {
               id: '4',
               title: 'Запись 4'
            },
            {
               id: '5',
               title: 'Запись 5'
            },
            {
               id: '6',
               title: 'Запись 6'
            },
            {
               id: '7',
               title: 'Запись 7'
            },
            {
               id: '8',
               title: 'Запись 8'
            }
         ],
         items: [{_defaultItems1: [
            {
               id: '1',
               title: 'Запись 1'
            },
            {
               id: '2',
               title: 'Запись 2'
            },
            {
               id: '3',
               title: 'Запись 3'
            },
            {
               id: '4',
               title: 'Запись 4'
            },
            {
               id: '5',
               title: 'Запись 5'
            },
            {
               id: '6',
               title: 'Запись 6'
            },
            {
               id: '7',
               title: 'Запись 7'
            },
            {
               id: '8',
               title: 'Запись 8'
            }
         ]}, {_defaultItems2: [
            {
               id: '1',
               title: 'Запись 1'
            },
            {
               id: '2',
               title: 'Запись 2'
            },
            {
               id: '3',
               title: 'Запись 3'
            },
            {
               id: '4',
               title: 'Запись 4'
            },
            {
               id: '5',
               title: 'Запись 5'
            },
            {
               id: '6',
               title: 'Запись 6'
            },
            {
               id: '7',
               title: 'Запись 7'
            },
            {
               id: '8',
               title: 'Запись 8'
            }
         ]}],
         _createMemory: function (items) {
            return new Memory({
               idProperty: 'id',
               data: items
            });
         },
         _getDefaultMemory: function () {
            var self = this;
            return Chain(this.items).map(function (item) {
                  return (self._createMemory(item));
            }).value();
         },

         _getOneList: function () {
            return this._createMemory(this._defaultItems);
         }
      });

      return FastData;
   });