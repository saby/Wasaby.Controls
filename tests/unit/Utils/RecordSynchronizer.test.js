/**
 * Created by as.krasilnikov on 11.09.2018.
 */
define(
   [
      'Controls/Utils/RecordSynchronizer',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Entity/Model'
   ],
   (RecordSynchronizer, RecordSet, Record) => {
      let items = new RecordSet({
         idProperty: 'id',
         rawData: [
            {
               id: 0,
               title: 'Rooney'
            },
            {
               id: 1,
               title: 'Ronaldo'
            },
            {
               id: 2,
               title: 'Vidic'
            }
         ]
      });
      describe('RecordSynchronizer', () => {
         it('add record', () => {
            let editRecord = new Record({
               rawData: {
                  id: 4,
                  title: 'Lukaku'
               },
               idProperty: 'id'
            });
            let additionalData = {
               at: 1,
               isNewRecord: true,
               key: 4
            };
            RecordSynchronizer.addRecord(editRecord, additionalData, items);
            assert.equal(items.at(additionalData.at).getId(), editRecord.getId());
         });

         it('merge record', () => {
            let editRecord = new Record({
               rawData: {
                  id: 0,
                  title: 'Rashford',
                  club: 'mu'
               },
               idProperty: 'id'
            });
            let linkedKey = 0;
            RecordSynchronizer.mergeRecord(editRecord, items, linkedKey);
            assert.equal(items.at(0).get('title'), editRecord.get('title'));
            assert.equal(items.at(0).getId(), editRecord.getId());
            assert.equal(items.at(0).get('club'), undefined);
         });

         it('delete record', () => {
            let linkedKey = 0;
            RecordSynchronizer.deleteRecord(items, linkedKey);
            var removeRecord = items.getRecordById(0);
            assert.equal(removeRecord, undefined);
         });
      });
   });
