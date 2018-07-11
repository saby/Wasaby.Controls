define('Controls-demo/Menu/MenuVdom', [
   'Core/Control',
   'tmpl!Controls-demo/Menu/MenuVdom',
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
   'tmpl!Controls-demo/List/DemoGroupTemplate',
   'css!Controls-demo/Dropdown/MenuVdom'
], function(Control, template, cClone, DataSet, RecordSet, Memory, historySource, historyService, ControlsConstants,Query, Deferred, SbisAdapter) {
   'use strict';
   var recordData = {
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
            {n: 'ObjectId', t: 'Строка'},
            {n: 'ObjectData', t: 'Строка'},
            {n: 'HistoryId', t: 'Строка'}
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
            {n: 'ObjectId', t: 'Строка'},
            {n: 'ObjectData', t: 'Строка'},
            {n: 'HistoryId', t: 'Строка'}
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
            {n: 'ObjectId', t: 'Строка'},
            {n: 'ObjectData', t: 'Строка'},
            {n: 'HistoryId', t: 'Строка'}
         ]
      }
   };


   var ModuleClass = Control.extend(
      {
         _template: template,
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
               title: 'Запись 6 группа 2'
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
               title: 'Запись 9 группа 2'
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
               title: 'Запись 13 группа 3'
            },
            {
               id: '14',
               title: 'Запись 14 группа 3'
            },
            {
               id: '15',
               title: 'Запись 15 группа 4'
            },
            {
               id: '16',
               title: 'Запись 16 группа 4'
            },
         ],
         _createMemory: function(items) {
            var srcData = new DataSet({
               rawData: {
                  frequent: this._createRecordSet(recordData.frequent),
                  pinned: this._createRecordSet(recordData.pinned),
                  recent: this._createRecordSet(recordData.recent)
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
                  pinned:true,
               }),
               parentProperty: 'parent',
               nodeProperty: '@parent'
            });
            var query = new Query().where({
               $_history: true
            });
            hs.historySource.query = function() {
               let def = new Deferred();
               def.addCallback(function(set) {
                  return set;
               });
               def.callback(srcData);
               return def;
            };
            hs.query(query);
            hs.historySource.query();
            return hs
         },

         _getHierarchyMenuItems: function() {
            var items = cClone(this._defaultItems);
            var hierConfig = [
               { parent: null, '@parent': false, icon: 'icon-medium icon-Author icon-primary'},
               { parent: null, '@parent': false},
               { parent: null, '@parent': false},
               { parent: null, '@parent': false},
               { parent: null, '@parent': false},
               {group: 'group_2', parent: null, '@parent': false, icon: 'icon-medium icon-Author icon-primary'},
               {parent: null, '@parent': false},
               { parent: null, '@parent': false},
               {group: 'group_2', parent: null, '@parent': true},
               {parent: '9', '@parent': true, icon: 'icon-medium icon-Author icon-primary'},
               {parent: '10', '@parent': false},
               {parent: '10', '@parent': false},
               {group: 'group_3', parent: null, '@parent': false},
               {group: 'group_3', parent: null, '@parent': false},
               {group: 'group_4', parent: null, '@parent': false},
               {group: 'group_4', parent: null, '@parent': false}
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
            })
         },
      });
   return ModuleClass;
});
