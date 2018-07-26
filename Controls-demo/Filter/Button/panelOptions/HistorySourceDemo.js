define('Controls-demo/Filter/Button/panelOptions/HistorySourceDemo',
   [
      'Core/Control',
      'WS.Data/Di',
      'WS.Data/Source/Memory',
      'Controls/History/Service',
      'Core/Deferred',
      'WS.Data/Source/DataSet',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Adapter/Sbis',
      'Core/Serializer',
      'WS.Data/Entity/Model',
      'Controls/History/Source'
   ],

   function(Control, Di, Memory, HistoryService, Deferred, DataSet, RecordSet, SbisAdapter, Serializer, Model, HistorySource) {

      'use strict';

      var items = [
         {
            id: '1',
            title: 'Запись 1',
            parent: null,
            '@parent': false
         },
         {
            id: '2',
            title: 'Запись 2',
            parent: null,
            '@parent': false
         },
         {
            id: '3',
            title: 'Запись 3',
            parent: null,
            '@parent': true,
            icon: 'icon-medium icon-Doge icon-primary'
         },
         {
            id: '4',
            title: 'Запись 4',
            parent: null,
            '@parent': false
         },
         {
            id: '5',
            title: 'Запись 5',
            parent: null,
            '@parent': false
         },
         {
            id: '6',
            title: 'Запись 6',
            parent: null,
            '@parent': false
         },
         {
            id: '7',
            title: 'Запись 7',
            parent: '3',
            '@parent': false
         },
         {
            id: '8',
            title: 'Запись 8',
            parent: null,
            '@parent': false
         }
      ];

      var config = {
         originSource: new Memory({
            idProperty: 'id',
            data: items
         }),
         historySource: new HistoryService({
            historyId: 'DEMO_HISTORY_ID'
         }),
         parentProperty: 'parent'
      };

      var pinnedData = {
         _type: 'recordset',
         d: [
            [
               '5', 'History 1', 'TEST_HISTORY_ID_V1'
            ]
         ],
         s: [
            {n: 'ObjectId', t: 'Строка'},
            {n: 'ObjectData', t: 'Строка'},
            {n: 'HistoryId', t: 'Строка'}
         ]
      };
      var frequentData = {
         _type: 'recordset',
         d: [
            [
               '6', 'History 6', 'TEST_HISTORY_ID_V1'
            ],
            [
               '4',  'History 4', 'TEST_HISTORY_ID_V1'
            ],
            [
               '9',  'History 9', 'TEST_HISTORY_ID_V1'
            ]
         ],
         s: [
            {n: 'ObjectId', t: 'Строка'},
            {n: 'ObjectData', t: 'Строка'},
            {n: 'HistoryId', t: 'Строка'}
         ]
      };
      var recentData = {
         _type: 'recordset',
         d: [
            [
               '8', 'History 8', 'TEST_HISTORY_ID_V1'
            ]
         ],
         s: [
            {n: 'ObjectId', t: 'Строка'},
            {n: 'ObjectData', t: 'Строка'},
            {n: 'HistoryId', t: 'Строка'}
         ]
      };

      function createRecordSet(data) {
         return new RecordSet({
            rawData: data,
            idProperty: 'ObjectId',
            adapter: new SbisAdapter()
         });
      }

      var data = new DataSet({
         rawData: {
            frequent: createRecordSet(frequentData),
            pinned: createRecordSet(pinnedData),
            recent: createRecordSet(recentData)
         },
         itemsProperty: '',
         idProperty: 'ObjectId'
      });

      var historyMetaFields = ['$_favorite', '$_pinned', '$_history', '$_addFromData'];

      function getSourceByMeta(meta) {
         for (var i in meta) {
            if (meta.hasOwnProperty(i)) {
               if (historyMetaFields.indexOf(i) !== -1) {
                  return config.historySource;
               }
            }
         }
         return config.originSource;
      }

      function updateRecent(self, item) {

      }

      config.historySource.saveHistory = function() {};

      var histSource = Control.extend({
         getHistoryId: function() {
            return 'DEMO_HISTORY_ID';
         },

         saveHistory: function() {

         },

         update: function(data, meta) {
            var self = this;
            var serData, item;

            if (meta.hasOwnProperty('$_pinned')) {
               if (data.get('pinned')) {
                  data.set('pinned', false);
               } else {
                  data.set('pinned', true);
               }
            }
            if (meta.hasOwnProperty('$_addFromData')) {

               serData = JSON.stringify(data, function() {
                  if (!self._serialize) {
                     self._serialize = new Serializer();
                  }
                  return self._serialize;
               }.serialize);

               return getSourceByMeta(meta).update(serData, meta).addCallback(function(dataSet) {
                  updateRecent(
                     self,
                     new Model({
                        rawData: {
                           d: [ dataSet.getRawData(), serData, 'DEMO_HISTORY_ID'],
                           s: [
                              {n: 'ObjectId', t: 'Строка'},
                              {n: 'ObjectData', t: 'Строка'},
                              {n: 'HistoryId', t: 'Строка'}
                           ]
                        },
                        adapter: self._history.recent.getAdapter()
                     }));
               });
            }
            return getSourceByMeta(this, meta).update(data, meta);
         },

         query: function() {
            var def = new Deferred();
            def.addCallback(function(set) {
               return set;
            });
            def.callback(data);
            return def;
         }
      });

      Di.register('sourceHistory', histSource);

      return histSource;
   });
