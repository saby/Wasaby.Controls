define('Controls-demo/Buttons/Menu/historySourceMenu',
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
      'WS.Data/Query/Query',
      'WS.Data/Entity/Model',
      'Controls/History/Source'
   ],

   function(Control, Di, Memory, HistoryService, Deferred, DataSet, RecordSet, SbisAdapter, Serializer, Query, Model, HistorySource) {

      'use strict';

      var hierarchyItems = [
         {id: 1, title: 'Task in development'},
         {id: 2, title: 'Error in development'},
         {id: 3, title: 'Commission'},
         {id: 4, title: 'Assignment'},
         {id: 5, title: 'Coordination', '@parent': true},
         {id: 6, title: 'Development', '@parent': true},
         {id: 7, title: 'Assignment for accounting'},
         {id: 8, title: 'Assignment for delivery'},
         {id: 9, title: 'Assignment for logisticians'}
      ];
      
      var coordSub = ['Coordination', 'Negotiate the discount', 'Harmonization of price changes', 'Approval of participation in trading',
         'Matching the layout', 'Matching the layout of the mobile application', 'Harmonization of the standard', 'Harmonization of themes',
         'Harmonization of the mobile application standard', 'Coordination of the change in a limited period',
         'Harmonization of the change of the contract template'];
      
      var devSub = ['The task in development', 'Merge request', 'Error in development',
         'Run on the test bench', 'Harmonization of changes in the database', 'Changing the operation rule',
         'Creating (changing) a printed form', 'The task of developing a standard component (test)', 'Code review',
         'Service update', 'Run on the working', 'Adding / changing a sample application code',
         'Component development (test)', 'Release report', 'Acceptance of the project (functional testing)'
      ];

      function prepareItems() {
         if (hierarchyItems[4].parent !== null) {
            hierarchyItems[4].parent = null;
            for (var i = 0; i < coordSub.length; i++) {
               hierarchyItems.push({
                  id: i + 10,
                  title: coordSub[i],
                  parent: 5,
                  '@parent': false
               });
            }
            hierarchyItems[5].parent = null;
            for (var j = 0; j < devSub.length; j++) {
               hierarchyItems.push({
                  id: j + 22,
                  title: devSub[j],
                  parent: 6,
                  '@parent': false
               });
            }
         }
         return hierarchyItems;
      }

      var pinnedData = {
         _type: 'recordset',
         d: [],
         s: [
            {n: 'ObjectId', t: 'Строка'},
            {n: 'ObjectData', t: 'Строка'},
            {n: 'HistoryId', t: 'Строка'}
         ]
      };
      var frequentData = {
         _type: 'recordset',
         d: [],
         s: [
            {n: 'ObjectId', t: 'Строка'},
            {n: 'ObjectData', t: 'Строка'},
            {n: 'HistoryId', t: 'Строка'}
         ]
      };
      var recentData = {
         _type: 'recordset',
         d: [],
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

      function createMemory() {
         var srcData = new DataSet({
            rawData: {
               frequent: createRecordSet(frequentData),
               pinned: createRecordSet(pinnedData),
               recent: createRecordSet(recentData)
            },
            itemsProperty: '',
            idProperty: 'ObjectId'
         });
         var hs = new HistorySource({
            originSource: new Memory({
               idProperty: 'id',
               data: prepareItems()
            }),
            historySource: new HistoryService({
               historyIds: ['TEST_HISTORY_ID'],
               pinned: true
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
      }

      return {
         createMemory: createMemory
      };
   });
