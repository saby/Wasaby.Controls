define('Controls-demo/Input/Dropdown/Dropdown', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Input/Dropdown/Dropdown',
   'tmpl!Controls-demo/Input/Dropdown/itemTemplateDropdown',
   'css!Controls-demo/Input/Dropdown/Dropdown'
], function(Control, Memory, template) {

   'use strict';

   var DropdownDemo = Control.extend({
      _template: template,
      _selectedKeysSimple: [1],
      _selectedKeysHierarchy: [8],
      _selectedKeysEmpty: [2],
      _selectedKeysIcon: [1],
      _selectedKeysScroll: [4],
      _selectedKeysMyTemplate: [1],
      _selectedKeys5: ['6'],

      _simpleItems: [
         {id: 1, title: 'All directions'},
         {id: 2, title: 'Incoming'},
         {id: 3, title: 'Outgoing'}
      ],

      _hierarchyItems: [
         {id: 1, title: 'Task in development', parent: null, '@parent': false},
         {id: 2, title: 'Error in development', parent: null, '@parent': false},
         {id: 3, title: 'Application', parent: null, '@parent': false},
         {id: 4, title: 'Assignment', parent: null, '@parent': true},
         {id: 5, title: 'Approval', parent: null, '@parent': false},
         {id: 6, title: 'Working out', parent: null, '@parent': false},
         {id: 7, title: 'Assignment for accounting', parent: 4, '@parent': false},
         {id: 8, title: 'Assignment for delivery', parent: 4, '@parent': false},
         {id: 9, title: 'Assignment for logisticians', parent: 4, '@parent': false}
      ],

      _iconItems: [
         {id: 1, title: 'In the work', icon: 'icon-16 icon-Trade icon-primary'},
         {id: 2, title: 'It is planned', icon: 'icon-16 icon-Sandclock icon-primary'},
         {id: 3, title: 'Completed', icon: 'icon-16 icon-Successful icon-done'},
         {id: 4, title: 'Not done', icon: 'icon-16 icon-Decline icon-error'}
      ],

      _myTemplateItems: [
         {id: 1, title: 'Subdivision'},
         {id: 2, title: 'Separate unit', icon: 'icon-size icon-24 icon-Company icon-primary',
            comment: 'A territorially separated subdivision with its own address. For him, you can specify a legal entity'},
         {id: 3, title: 'Working group', icon: 'icon-size icon-24 icon-Groups icon-primary',
            comment: 'It is not a full-fledged podcasting, it serves for grouping. As a unit, the employees will have a higher department or office'}
      ],

      _emptyItems: [
         {id: 1, title: 'Yaroslavl'},
         {id: 2, title: 'Moscow'},
         {id: 3, title: 'St-Petersburg'}
      ],

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
            group: 'group 2',
            title: 'Запись 3'
         },
         {
            id: '4',
            group: 'group 2',
            title: 'Запись 4'
         },
         {
            id: '5',
            group: 'group 3',
            title: 'Запись 5'
         },
         {
            id: '6',
            group: 'group 3',
            title: 'Запись 6'
         },
         {
            id: '7',
            group: 'group 4',
            title: 'Запись 7'
         },
         {
            id: '8',
            group: 'group 3',
            title: 'Запись 8'
         }
      ],
      _createMemory: function(items) {
         return new Memory({
            idProperty: 'id',
            data: items
         });
      },
      _getDefaultMemory: function() {
         return this._createMemory(this._defaultItems);
      },
      _getItemTemplateData: function() {
         var items = cClone(this._defaultItems);
         items[0].myTemplate = 'tmpl!Controls-demo/Dropdown/resources/itemTemplate1';
         items[4].myTemplate = 'tmpl!Controls-demo/Dropdown/resources/itemTemplate1';
         return this._createMemory(items);
      },

      _getMultiData: function() {
         var items = [];
         for (var i = 1; i < 16; i++) {
            items.push({
               id: i,
               title: (i < 10 ? '0' + i : i) + ':00'
            });
         }
         return this._createMemory(items);
      },
      _getAdditionalData: function() {
         var items = cClone(this._defaultItems);
         var additionalProperty = 'additional';
         for (var i = 3; i < items.length; i++) {
            items[i][additionalProperty] = true;
         }
         return this._createMemory(items);
      },
      footerClickHandler: function() {
         alert('Обработка клика по футеру');
      }
   });
   return DropdownDemo;
});
