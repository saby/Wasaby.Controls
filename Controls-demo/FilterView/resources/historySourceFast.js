define('Controls-demo/FilterView/resources/historySourceFast',
   [
      'Controls/history',
      'Core/Deferred',
      'Types/collection',
      'Types/entity',
      'Types/source',
      'Controls-demo/resources/Images'
   ],

   function(history, Deferred, collection, entity, source, Images) {
      'use strict';

      var items = [
         { id: '1', title: 'My' },
         { id: '2', title: 'My department' },
         { id: '3', title: 'Игнатов Сергей Юрьевич', comment: 'Информационные системы', photo: Images.staff.dogadkin, itemTpl: 'wml!Controls-demo/FilterView/resources/itemTemplatePhoto' },
         { id: '4', title: 'Иванова Надежда Михайловна', comment: 'Офис Тензор/Юридический отдел', photo: Images.staff.kesareva, itemTpl: 'wml!Controls-demo/FilterView/resources/itemTemplatePhoto' },
         { id: '5', title: 'Петровичев Аркадий Аврамович', comment: 'Офис Тензор/Юридический отдел', photo: Images.staff.korbyt, itemTpl: 'wml!Controls-demo/FilterView/resources/itemTemplatePhoto' },
         { id: '6', title: 'Иванов Иван Иванович', comment: 'Информационные системы', photo: Images.staff.krainov, itemTpl: 'wml!Controls-demo/FilterView/resources/itemTemplatePhoto' },
         { id: '7', title: 'Чиркова Валентина Владимировна', comment: 'Информационные системы/Разработка', photo: Images.staff.baturina, itemTpl: 'wml!Controls-demo/FilterView/resources/itemTemplatePhoto' },
         { id: '8', title: 'News Services' },
         { id: '9', title: 'Interface Standards' }
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
            idProperty: 'ObjectId',
            adapter: new entity.adapter.Sbis()
         });
      }

      function getDataSet() {
         return new source.DataSet({
            rawData: {
               frequent: createRecordSet(),
               pinned: createRecordSet(pinnedData),
               recent: createRecordSet(recentData)
            },
            itemsProperty: '',
            idProperty: 'ObjectId'
         });
      }

      function createMemory() {
         var hs = new history.Source({
            originSource: new source.Memory({
               idProperty: 'id',
               data: items
            }),
            historySource: new history.Service({
               historyId: 'TEST_HISTORY_ID_FAST_EMPLOYEE',
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
            def.callback(getDataSet());
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
