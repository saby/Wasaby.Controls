define('Controls-demo/Combobox/historySourceCombobox',
   [
      'Core/Control',
      'Controls/history',
      'Core/Deferred',
      'Types/collection',
      'Types/entity',
      'Types/source'
   ],

   function(Control, history, Deferred, collection, entity, source) {
      'use strict';

      var items = [
         { id: 1, title: 'admin.sbis.ru' },
         { id: 2, title: 'cloud.sbis.ru' },
         { id: 3, title: 'genie.sbis.ru' },
         { id: 4, title: 'my.sbis.ru' },
         { id: 5, title: 'online.sbis.ru' },
         { id: 6, title: 'sbis.ru' },
         { id: 7, title: 'tensor.ru' },
         { id: 8, title: 'wi.sbis.ru' },
         { id: 9, title: 'dev-online.sbis.ru' },
         { id: 10, title: 'fix-online.sbis.ru' }
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

      function createRecordSet(data) {
         return new collection.RecordSet({
            rawData: data,
            idProperty: 'ObjectId',
            adapter: new entity.adapter.Sbis()
         });
      }

      function createMemory() {
         var srcData = new source.DataSet({
            rawData: {
               frequent: createRecordSet(),
               pinned: createRecordSet(),
               recent: createRecordSet(recentData)
            },
            itemsProperty: '',
            idProperty: 'ObjectId'
         });
         var hs = new history.Source({
            originSource: new source.Memory({
               idProperty: 'id',
               data: items
            }),
            historySource: new history.Service({
               historyId: 'TEST_HISTORY_ID_COMBOBOX',
               pinned: true
            })
         });
         var query = new source.Query().where({
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
      }

      return {
         createMemory: createMemory
      };
   });
