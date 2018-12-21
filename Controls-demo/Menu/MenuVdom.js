define('Controls-demo/Menu/MenuVdom', [
   'Core/Control',
   'wml!Controls-demo/Menu/MenuVdom',
   'Core/core-clone',
   'WS.Data/Source/DataSet',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Source/Memory',
   'Controls/History/Source',
   'Controls/History/Service',
   'Controls/Constants',
   'WS.Data/Query/Query',
   'Core/Deferred',
   'WS.Data/Adapter/Sbis',
   'wml!Controls/Dropdown/resources/template/defaultGroupTemplate',
   'wml!Controls-demo/Menu/DemoGroupTemplate',
   'css!Controls-demo/Dropdown/MenuVdom',
   'css!Controls-demo/Menu/MenuVdom'
], function(Control, template, cClone, DataSet, RecordSet, Memory, historySource, historyService, ControlsConstants, Query, Deferred, SbisAdapter) {
   'use strict';
   var ModuleClass = Control.extend(
      {
         _template: template,
         _itemsGroupText: null,
         _itemsGroup: null,
         _defaultItems: null,
         _beforeMount: function() {
            this.recordData = {
               pinned: {
                  _type: 'recordset',
                  d: [
                     [
                        '1', null, 'TEST_HISTORY_ID_V1'
                     ],
                     [
                        '2', null, 'TEST_HISTORY_ID_V1'
                     ]
                  ],
                  s: [
                     { n: 'ObjectId', t: 'Строка' },
                     { n: 'ObjectData', t: 'Строка' },
                     { n: 'HistoryId', t: 'Строка' }
                  ]
               },
               frequent: {
                  _type: 'recordset',
                  d: [
                     [
                        '3', null, 'TEST_HISTORY_ID_V1'
                     ],

                     [
                        '4', null, 'TEST_HISTORY_ID_V1'
                     ]
                  ],
                  s: [
                     { n: 'ObjectId', t: 'Строка' },
                     { n: 'ObjectData', t: 'Строка' },
                     { n: 'HistoryId', t: 'Строка' }
                  ]
               },
               recent: {
                  _type: 'recordset',
                  d: [
                     [
                        '5', null, 'TEST_HISTORY_ID_V1'
                     ]
                  ],
                  s: [
                     { n: 'ObjectId', t: 'Строка' },
                     { n: 'ObjectData', t: 'Строка' },
                     { n: 'HistoryId', t: 'Строка' }
                  ]
               }
            };
            this._defaultItems = [
               {
                  id: '1',
                  title: 'Запись 1 с длинным названием'
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
               },
               {
                  id: '9',
                  title: 'Запись 9'
               },
               {
                  id: '10',
                  title: 'Запись 10'
               },
               {
                  id: '11',
                  title: 'Запись 11'
               },
               {
                  id: '12',
                  title: 'Запись 12'
               },
               {
                  id: '13',
                  title: 'Запись 13'
               },
               {
                  id: '14',
                  title: 'Запись 14'
               },
               {
                  id: '15',
                  title: 'Запись 15'
               },
               {
                  id: '16',
                  title: 'Запись 16'
               },
            ];
            this._itemsGroupText = {
               method: function(item) {
                  if (item.get('group') === 'hidden' || !item.get('group')) {
                     return ControlsConstants.view.hiddenGroup;
                  }
                  return item.get('group');
               },
               template: 'wml!Controls-demo/Menu/DemoGroupTemplate',
            };
            this._itemsGroup = {
               method: function(item) {
                  if (item.get('group') === 'hidden' || !item.get('group')) {
                     return ControlsConstants.view.hiddenGroup;
                  }
                  return item.get('group');
               },
               template: '',
            };
         },
         _createMemory: function(items) {
            var srcData = new DataSet({
               rawData: {
                  frequent: this._createRecordSet( this.recordData.frequent),
                  pinned: this._createRecordSet( this.recordData.pinned),
                  recent: this._createRecordSet( this.recordData.recent)
               },
               itemsProperty: '',
               idProperty: 'ObjectId'
            });

            // возвращаем historySource
            var hs = new historySource({
               originSource: new Memory({
                  idProperty: 'id',
                  data: items
               }),

               // TEST_HISTORY_ID
               // TEST_HISTORY_ID_V1
               historySource: new historyService({
                  historyIds: ['TEST_HISTORY_ID'],
                  pinned: true,
               }),
               parentProperty: 'parent',
               nodeProperty: '@parent'
            });
            var query = new Query().where({
               $_history: true
            });
            hs.historySource.query = function() {
               var def = new Deferred();
               def.addCallback(function(set) {
                  return set;
               });
               def.callback(srcData);
               return def;
            };
            hs.query(query);
            hs.historySource.query();
            return hs;
         },

         _getHierarchyMenuItems: function() {
            var items = cClone(this._defaultItems);
            var hierConfig = [
               { parent: null, '@parent': false, icon: 'icon-medium icon-Author icon-primary' },
               { parent: null, '@parent': false },
               { parent: null, '@parent': false },
               { parent: null, '@parent': false },
               { parent: null, '@parent': false },
               { group: 'Group 1', '@parent': false },
               { parent: null, '@parent': false },
               { parent: null, '@parent': false },
               { group: 'Group 1', '@parent': true },
               { parent: '9', '@parent': true, icon: 'icon-medium icon-Author icon-primary' },
               { parent: '10', '@parent': false },
               { parent: '10', '@parent': false },
               { group: 'Group 2', parent: null, '@parent': false },
               { group: 'Group 2', parent: null, '@parent': false },
               { group: 'Group 3', parent: null, '@parent': false },
               { group: 'Group 3', parent: null, '@parent': false }
            ];
            for (var i = 0; i < items.length; i++) {
               items[i].parent = hierConfig[i].parent;
               items[i]['@parent'] = hierConfig[i]['@parent'];
               items[i].icon = hierConfig[i].icon;
               items[i].group = hierConfig[i].group;
            }
            return this._createMemory(items);
         },

         _createRecordSet: function(data) {
            return new RecordSet({
               rawData: data,
               idProperty: 'ObjectId',
               adapter: new SbisAdapter()
            });
         },
      }
   );
   return ModuleClass;
});
