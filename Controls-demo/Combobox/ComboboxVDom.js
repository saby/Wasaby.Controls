define('Controls-demo/Combobox/ComboboxVDom',
   [
      'Core/Control',
      'tmpl!Controls-demo/Combobox/ComboboxVDom',
      'WS.Data/Source/Memory',
      'Controls/Input/ComboBox',
      'tmpl!Controls-demo/Combobox/itemTemplateCombobox',
      'tmpl!Controls-demo/Combobox/itemTemplateMultiline',
      'css!Controls-demo/Combobox/ComboboxVDom'
   ],
   function(Control, template, Memory) {
      'use strict';
      var itemsRegions = [
         {
            id: 1,
            title: 'Yaroslavl'
         },
         {
            id: 2,
            title: 'Moscow'
         },
         {
            id: 3,
            title: 'St-Petersburg'
         }
      ];

      var itemsCode = [
         { id: 1, title: '01-disease', comment: 'The first 3 days are paid by the employer, the remaining days are paid for by the FSS' },
         { id: 2, title: '02-injury', comment: 'The first 3 days are paid by the employer, the remaining days are paid for by the FSS' },
         { id: 3, title: '03-quarantine', comment: 'Fully paid by the FSS' }
      ];

      var itemsWorkers = [
         { id: 1, title: 'Russian commercial organization' },
         { id: 2, title: 'Russian scientific organization' },
         {
            id: 3,
            title: 'Branch, representative of a foreign legal entity accredited in accordance with ' +
               'the established procedure in the territory of the Russian Federation'
         }
      ];

      var defaultItems = [
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
      ];

      var cities = ['Yaroslavl',
         'Moscow',
         'St-Petersburg',
         'Astrahan',
         'Arhangelsk',
         'Abakan',
         'Barnaul',
         'Belgorod',
         'Voronezh',
         'Vladimir',
         'Bryansk',
         'Ekaterinburg',
         'Kostroma',
         'Vologda',
         'Pskov',
         'Kirov'];

      var ComboBox = Control.extend({
         _template: template,
         _itemsCode: null,
         _itemsRegions: null,
         _itemsWorkers: null,
         _defaultItems: null,
         _cities: null,
         _beforeMount: function() {
            this._itemsRegions = itemsRegions;
            this._itemsCode = itemsCode;
            this._itemsWorkers = itemsWorkers;
            this._defaultItems = defaultItems;
            this._cities = cities;
         },
         _createMemory: function(items) {
            return new Memory({
               idProperty: 'id',
               data: items
            });
         },
         _getMultiData: function() {
            var items = [];
            for (var i = 0; i < 16; i++) {
               items.push({
                  id: '' + i + 1,
                  title: this._cities[i]
               });
            }
            return this._createMemory(items);
         },

         _selectedKey: '3',
         _selectedKey7: 'Branch, representative of a foreign legal entity accredited in accordance with ' +
         'the established procedure in the '
      });

      return ComboBox;
   });
