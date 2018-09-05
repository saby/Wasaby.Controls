/**
 * Created by as.krasilnikov on 11.09.2018.
 */
define(
   [
      'Controls/Popup/Opener/Edit',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Entity/Model'
   ],
   (Edit, RecordSet, Record) => {
      let dataRS = new RecordSet({
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
      let editOpener = new Edit();
      editOpener._beforeMount();
      editOpener._options.items = dataRS;

      editOpener._beforeMount();
      describe('EditOpener', () => {
         it('get config', () => {
            let record = dataRS.at(0);
            let meta = {
               record: record
            };
            var config = Edit._private.getConfig(editOpener, meta);
            assert.equal(editOpener._linkedKey, record.getId());
            assert.notEqual(config.templateOptions.record, record); //by link
            assert.equal(config.templateOptions.record.getId(), record.getId()); //by link
         });

         it('onResult', () => {
            let isProcessingResult = false;
            let data = {
               formControllerEvent: 'afterItemUpdate',
               record: dataRS.at(0),
               additionalData: {}
            };

            Edit._private.processingResult = () => {
               isProcessingResult = true;
            };

            editOpener._notify = () => {
               return Edit.SYNC_CUSTOM;
            };
            editOpener._onResult(data);
            assert.equal(isProcessingResult, false);

            editOpener._notify = () => {
               return true;
            };
            editOpener._onResult(data);
            assert.equal(isProcessingResult, true);
         });

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
            Edit._private.addRecord(editOpener, editRecord, additionalData);
            assert.equal(editOpener._options.items.at(additionalData.at).getId(), editRecord.getId());

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
            editOpener._linkedKey = 0;
            Edit._private.mergeRecord(editOpener, editRecord);
            assert.equal(editOpener._options.items.at(0).get('title'), editRecord.get('title'));
            assert.equal(editOpener._options.items.at(0).getId(), editRecord.getId());
            assert.equal(editOpener._options.items.at(0).get('club'), undefined);
         });

         it('delete record', () => {
            editOpener._linkedKey = 0;
            Edit._private.deleteRecord(editOpener);
            var removeRecord = editOpener._options.items.getRecordById(0);
            assert.equal(removeRecord, undefined);
         });

      });
   });
