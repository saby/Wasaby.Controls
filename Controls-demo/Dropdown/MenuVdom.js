define('Controls-demo/Dropdown/MenuVdom', [
   'Core/Control',
   'tmpl!Controls-demo/Dropdown/MenuVdom',
   'Core/core-clone',
   'WS.Data/Source/Memory',
   'Controls/Constants',
   'tmpl!Controls-demo/Dropdown/resources/itemTemplate1',
   'tmpl!Controls-demo/Dropdown/resources/itemTemplateContent1',
   'tmpl!Controls-demo/Dropdown/resources/ItemsTemplate2',
   'tmpl!Controls-demo/Dropdown/resources/ItemsTemplateContent2',
   'tmpl!Controls-demo/Dropdown/resources/headerTemplate',
   'tmpl!Controls-demo/Dropdown/resources/footerTemplate',
   'tmpl!Controls-demo/Dropdown/resources/contentTemplate',
   'css!Controls-demo/Dropdown/MenuVdom',
   'WS.Data/Collection/RecordSet' //TODO: удалить это когда появится асинк и технология патчинга jsLinks
   //сейчас зависимость тянется асинхронно и десериализовать данные пытаемся раньше, чем это произойдет
], function(Control, template, cClone, Memory, ControlsConstants) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,
         _stateText: 'Выбранный ключ',
         _selectedKeysEmpty: ['1'],
         _selectedKeys0: ['8'],
         _selectedKeys1: ['2'],
         _selectedKeys2: ['3'],
         _selectedKeys3: ['4'],
         _selectedKeys4: ['5'],
         _selectedKeys5: ['6'],
         _selectedItemsChangedHandler: function(event, dropdownIndex, selectedKeys) {
            this._stateText = 'Выбранный ключ: ' + selectedKeys;
         },
         _clickItemsChangedHandler: function(event, data) {
            this._stateText = data.get('title');
         },
         _itemsGroup: {
            method: function(item) {
               if (item.get('group') === 'hidden' || !item.get('group')) {
                  return ControlsConstants.view.hiddenGroup;
               }
               return item.get('group');
            },
            template: '',
         },
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
         _getIconItems: function() {
            var icons = ['AddButton', '1c', 'Admin', 'Admin2', 'Album', 'Alert', 'Archive', 'Home'];
            var items = cClone(this._defaultItems);
            for (var i = 0; i < icons.length; i++) {
               items[i].icon = 'icon-small icon-' + icons[i] + ' icon-primary';
            }
            return this._createMemory(items);
         },
         _getHierarchyItems: function() {
            var items = cClone(this._defaultItems);
            var hierConfig = [
               {parent: null, '@parent': true},
               {parent: null, '@parent': false},
               {parent: null, '@parent': true},
               {parent: '1', '@parent': true},
               {parent: '4', '@parent': false},
               {parent: '4', '@parent': false},
               {parent: '3', '@parent': true},
               {parent: '7', '@parent': false}
            ];
            for (var i = 0; i < items.length; i++) {
               items[i].parent = hierConfig[i].parent;
               items[i]['@parent'] = hierConfig[i]['@parent'];
            }
            return this._createMemory(items);
         },
         _getHierarchyMenuItems: function() {
            var items = cClone(this._defaultItems);
            var hierConfig = [
               {parent: null, '@parent': true, icon: 'icon-medium icon-Author icon-primary'},
               {parent: null, '@parent': false},
               {parent: null, '@parent': true},
               {parent: '1', '@parent': true},
               {parent: '4', '@parent': false},
               {parent: '4', '@parent': false, icon: 'icon-medium icon-Author icon-primary'},
               {parent: '3', '@parent': true},
               {parent: '7', '@parent': false}
            ];
            for (var i = 0; i < items.length; i++) {
               items[i].parent = hierConfig[i].parent;
               items[i]['@parent'] = hierConfig[i]['@parent'];
               items[i].icon = hierConfig[i].icon;
            }
            return this._createMemory(items);
         },
         _getMultiData: function() {
            var items = cClone(this._defaultItems);
            for (var i = 9; i < 101; i++) {
               items.push({
                  id: '' + i,
                  title: 'Запись ' + i
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
   return ModuleClass;
});
