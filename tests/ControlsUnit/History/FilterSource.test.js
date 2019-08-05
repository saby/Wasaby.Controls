define(
   [
      'Controls/history',
      'Types/collection',
      'Types/entity'
   ],
   (historyMod, collection, entity) => {
      describe('history:FilterSource', () => {
         let items = [
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

         let pinnedData = {
            _type: 'recordset',
            d: [
               ['8', null, 'TEST_HISTORY_ID_V1']
            ],
            s: [
               { n: 'ObjectId', t: 'Строка' },
               { n: 'ObjectData', t: 'Строка' },
               { n: 'HistoryId', t: 'Строка' }
            ]
         };

         let recentData = {
            _type: 'recordset',
            d: [
               ['1', null, 'TEST_HISTORY_ID_V1'],
               ['2', null, 'TEST_HISTORY_ID_V1'],
               ['3', null, 'TEST_HISTORY_ID_V1'],
               ['4', null, 'TEST_HISTORY_ID_V1'],
               ['5', null, 'TEST_HISTORY_ID_V1'],
               ['6', null, 'TEST_HISTORY_ID_V1'],
               ['7', null, 'TEST_HISTORY_ID_V1'],
               ['8', null, 'TEST_HISTORY_ID_V1'],
               ['9', null, 'TEST_HISTORY_ID_V1'],
               ['10', null, 'TEST_HISTORY_ID_V1']
            ],
            s: [
               { n: 'ObjectId', t: 'Строка' },
               { n: 'ObjectData', t: 'Строка' },
               { n: 'HistoryId', t: 'Строка' }
            ]
         };

         let getItem = (id, objectData, hId) => {
            return new entity.Model({
               rawData: {
                  d: [id, objectData, hId],
                  s: [{
                     n: 'ObjectId',
                     t: 'Строка'
                  },
                     {
                        n: 'ObjectData',
                        t: 'Строка'
                     },
                     {
                        n: 'HistoryId',
                        t: 'Строка'
                     }
                  ]
               },
               adapter: new entity.adapter.Sbis()
            });
         };

         function createRecordSet(data) {
            return new collection.RecordSet({
               rawData: data,
               idProperty: 'ObjectId',
               adapter: new entity.adapter.Sbis()
            });
         }

         let historyInstance = {
            recent: createRecordSet(recentData),
            pinned: createRecordSet(pinnedData)
         };

         it('fillRecent', () => {
            let itemsRecent = new collection.RecordSet({
               adapter: new entity.adapter.Sbis(),
               idProperty: 'ObjectId'
            });
            historyMod.FilterSource._private.fillRecent({}, historyInstance, itemsRecent);
            assert.equal(itemsRecent.getCount(), 9);

            itemsRecent.clear();
            historyInstance.recent.add(getItem('11', null, 'TEST_HISTORY_ID_V1'));
            historyMod.FilterSource._private.fillRecent({}, historyInstance, itemsRecent);
            assert.equal(itemsRecent.getCount(), 9);

            itemsRecent.clear();
            historyInstance.pinned.clear();
            historyMod.FilterSource._private.fillRecent({}, historyInstance, itemsRecent);
            assert.equal(itemsRecent.getCount(), 10);

            itemsRecent.clear();
            historyInstance.recent.removeAt(10);
            historyMod.FilterSource._private.fillRecent({}, historyInstance, itemsRecent);
            assert.equal(itemsRecent.getCount(), 10);

            itemsRecent.clear();
            historyInstance.recent.removeAt(9);
            historyInstance.recent.add(getItem('11', '{}', 'TEST_HISTORY_ID_V1'));
            historyInstance.recent.add(getItem('11', null, 'TEST_HISTORY_ID_V1'));
            historyMod.FilterSource._private.fillRecent({}, historyInstance, itemsRecent);
            assert.equal(itemsRecent.getCount(), 10);


         });
      });
   }
);
