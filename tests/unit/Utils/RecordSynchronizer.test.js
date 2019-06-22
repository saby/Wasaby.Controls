/**
 * Created by as.krasilnikov on 11.09.2018.
 */
define(
   [
      'Controls/Utils/RecordSynchronizer',
      'Types/collection',
      'Types/entity'
   ],
   (RecordSynchronizer, collection, entity) => {
      let items = new collection.RecordSet({
         idProperty: 'id',
         format: [{
            name: 'id',
            type: 'integer'
         }, {
            name: 'title',
            type: 'string'
         }],
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

      let createRecord = rawData => new entity.Model({
         rawData: rawData,
         idProperty: 'id'
      });

      describe('RecordSynchronizer', () => {
         it('add record', () => {
            let editRecord = new entity.Model({
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
            let editRecord = new entity.Model({
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

         it('add records', () => {
            let editRecord = [];
            items.clear();
            editRecord.push(createRecord({
               id: 0,
               title: 'Lukaku1'
            }));
            editRecord.push(createRecord({
               id: 1,
               title: 'Lukaku2'
            }));
            editRecord.push(createRecord({
               id: 2,
               title: 'Lukaku3'
            }));
            RecordSynchronizer.addRecord(editRecord, null, items);
            assert.equal(items.getCount(), 3);
         });

         it('merge records', () => {
            let editRecord = [];
            editRecord.push(createRecord({
               id: 0,
               title: 'Rooney1'
            }));
            editRecord.push(createRecord({
               id: 1,
               title: 'Rooney2'
            }));
            editRecord.push(createRecord({
               id: 2,
               title: 'Rooney3'
            }));
            RecordSynchronizer.mergeRecord(editRecord, items);
            assert.equal(items.getCount(), 3);
            assert.equal(items.at(0).get('title'), 'Rooney1');
            assert.equal(items.at(1).get('title'), 'Rooney2');
            assert.equal(items.at(2).get('title'), 'Rooney3');
         });

         it('delete records', () => {
            var ids = [];
            items.each(function(model) {
               ids.push(model.getId());
            });
            RecordSynchronizer.deleteRecord(items, ids);
            assert.equal(ids.length, 3);
            assert.equal(items.getCount(), 0);
         });
      });
   }
);
