define('Controls-demo/Menu/MenuVdom', [
   'Core/Control',
   'tmpl!Controls-demo/Menu/MenuVdom',
   'Core/core-clone',
   'WS.Data/Source/Memory',
   'Controls/History/Source',
   'Controls/History/Service',
   'css!Controls-demo/Dropdown/MenuVdom'
], function (Control, template, cClone, Memory, historySource, historyService) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,
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
         _createMemory: function (items) {
            // возвращаем historySource
            return new historySource({
                originSource: new Memory({
                   idProperty: 'id',
                    data: items
                }),
                historySource: new historyService({
                    historyId: 'TEST_HISTORY_ID'
                }),
                parentProperty: 'parent',
                nodeProperty: '@parent'
            });
         },
         _getHierarchyMenuItems: function() {
            var items = cClone(this._defaultItems);
            var hierConfig = [
               {parent: null, '@parent': false, icon: 'icon-medium icon-Author icon-primary'},
               {parent: null, '@parent': false},
               {parent: null, '@parent': true},
               {parent: null, '@parent': false},
               {parent: null, '@parent': false},
               {parent: null, '@parent': false, icon: 'icon-medium icon-Author icon-primary'},
               {parent: '3', '@parent': false},
               {parent: null, '@parent': false}
            ];
            for (var i = 0; i < items.length; i++) {
               items[i].parent = hierConfig[i].parent;
               items[i]['@parent'] = hierConfig[i]['@parent'];
               items[i].icon = hierConfig[i].icon;
            }
            return this._createMemory(items);
         }
      });
   return ModuleClass;
});