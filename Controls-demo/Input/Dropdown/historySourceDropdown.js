define('Controls-demo/Input/Dropdown/historySourceDropdown',
   [
      'Controls/history',
      'Core/Deferred',
      'Types/collection',
      'Types/entity',
      'Types/source'
   ],

   function(history, Deferred, collection, entity, source) {
      'use strict';

      var items = [
         { id: 1, title: 'Commission' },
         { id: 2, title: 'Task in development' },
         { id: 3, title: 'Issuance of the GO stationary' },
         { id: 4, title: 'Merge request' },
         { id: 5, title: 'Agreement'},
         { id: 6, title: 'Run in the workplace' },
         { id: 7, title: 'AXO commission' },
         { id: 8, title: 'Assignment to the personnel department' }
      ];
      var recentData = {
         _type: 'recordset',
         d: [],
         s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' }
         ]
      };
      var pinnedData = {
         _type: 'recordset',
         d: [
            ['1'], ['2']
         ],
         s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' }
         ]
      };

      function createRecordSet(data) {
         return new collection.RecordSet({
            rawData: data,
            keyProperty: 'ObjectId',
            adapter: new entity.adapter.Sbis()
         });
      }

      function createMemory() {
         var srcData = new source.DataSet({
            rawData: {
               frequent: createRecordSet(),
               pinned: createRecordSet(pinnedData),
               recent: createRecordSet(recentData)
            },
            itemsProperty: '',
            keyProperty: 'ObjectId'
         });
         var hs = new history.Source({
            originSource: new source.Memory({
               keyProperty: 'id',
               data: items
            }),
            historySource: new history.Service({
               historyId: 'TEST_HISTORY_ID_DROPDOWN',
               pinned: true
            })
         });
         var query = new source.Query().where({
            $_history: true
         });
         hs._$historySource.query = function() {
            var def = new Deferred();
            def.addCallback(function(set) {
               return set;
            });
            def.callback(srcData);
            return def;
         };
         // Заглушка, чтобы демка не ломилась не сервис истории
         hs._$historySource.update = function() {
            return {};
         };
         hs.query(query);
         hs._$historySource.query();
         return hs;
      }

      return {
         createMemory: createMemory
      };
   });
