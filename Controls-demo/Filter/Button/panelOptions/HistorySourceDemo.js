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
         {id: 'period', value: [1], resetValue: [1]},
         {id: 'state', value: [1], resetValue: [1]},
         {id: 'limit', value: [1], resetValue: '', textValue: 'Due date', visibility: false},
         {id: 'sender', value: '', resetValue: '', visibility: false},
         {id: 'author', value: 'Ivanov K.K.', resetValue: ''},
         {id: 'responsible', value: '', resetValue: '', visibility: false},
         {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
         {id: 'operation', value: '', resetValue: '', visibility: false},
         {id: 'group', value: [1], resetValue: '', visibility: false},
         {id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: false},
         {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
         {id: 'own', value: [2], resetValue: '', textValue: 'On department', visibility: false},
         {id: 'our organisation', value: '', resetValue: '', visibility: false},
         {id: 'document', value: '', resetValue: '', visibility: false},
         {id: 'activity', value: [1], resetValue: '', selectedKeys: [1], visibility: false}
      ];

      var items1 = [
         {id: 'period', value: [3], resetValue: [1], textValue: 'Past month'},
         {id: 'state', value: [1], resetValue: [1]},
         {id: 'limit', value: [1], resetValue: '', textValue: 'Due date', visibility: false},
         {id: 'sender', value: '', resetValue: '', visibility: false},
         {id: 'author', value: 'Ivanov K.K.', textValue: 'Ivanov K.K.', resetValue: ''},
         {id: 'responsible', value: '', resetValue: '', visibility: false},
         {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
         {id: 'operation', value: '', resetValue: '', visibility: false},
         {id: 'group', value: [1], resetValue: '', visibility: false},
         {id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: false},
         {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
         {id: 'own', value: [2], resetValue: '', textValue: 'On department', visibility: false},
         {id: 'our organisation', value: '', resetValue: '', visibility: false},
         {id: 'document', value: '', resetValue: '', visibility: false},
         {id: 'activity', value: [1], resetValue: '', selectedKeys: [1], visibility: false}
      ];

      var items2 = [
         {id: 'period', value: [3], resetValue: [1], textValue: 'Past month'},
         {id: 'state', value: [1], resetValue: [1]},
         {id: 'limit', value: [1], resetValue: '', textValue: 'Due date'},
         {id: 'sender', value: [1], resetValue: '', textValue: 'Petrov B.B'},
         {id: 'author', value: 'Ivanov K.K.', textValue: 'Ivanov K.K.', resetValue: ''},
         {id: 'responsible', value: '', resetValue: '', visibility: false},
         {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
         {id: 'operation', value: '', resetValue: '', visibility: false},
         {id: 'group', value: [1], resetValue: '', visibility: false},
         {id: 'unread', value: true, resetValue: false, textValue: 'Unread'},
         {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
         {id: 'own', value: [2], resetValue: '', textValue: 'On department'},
         {id: 'our organisation', value: '', resetValue: '', visibility: false},
         {id: 'document', value: '', resetValue: '', visibility: false},
         {id: 'activity', value: [1], resetValue: '', selectedKeys: [1], visibility: false}
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
               '5', JSON.stringify(items1, new Serializer().serialize), 'TEST_HISTORY_ID_V1'
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
               '8', JSON.stringify(items2, new Serializer().serialize), 'TEST_HISTORY_ID_V1'
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
