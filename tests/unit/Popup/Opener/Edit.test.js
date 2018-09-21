/**
 * Created by as.krasilnikov on 11.09.2018.
 */
define(
   [
      'Controls/Popup/Opener/Edit',
      'WS.Data/Collection/RecordSet',
      'Core/Deferred',
      'WS.Data/Entity/Model'
   ],
   (Edit, RecordSet, Deferred) => {
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
      editOpener._beforeMount({});
      editOpener._options.items = dataRS;

      describe('EditOpener', () => {
         it('get config', () => {
            let record = dataRS.at(0);
            let meta = {
               record: record
            };
            var config = Edit._private.getConfig(editOpener, meta);
            assert.equal(editOpener._linkedKey, record.getId());
            assert.notEqual(config.templateOptions.record, record); // by link
            assert.equal(config.templateOptions.record.getId(), record.getId()); // by link
         });

         it('onResult', () => {
            let isProcessingResult = false;
            let data = {
               formControllerEvent: 'update',
               record: dataRS.at(0),
               additionalData: {}
            };
            let baseSynchronize = Edit._private.synchronize;

            Edit._private.loadSynchronizer = () => (new Deferred()).callback();

            Edit._private.synchronize = () => {
               isProcessingResult = true;
            };

            editOpener._notify = () => Edit.CANCEL;
            editOpener._onResult(data);
            assert.equal(isProcessingResult, false);

            editOpener._notify = () => true;
            editOpener._onResult(data);
            assert.equal(isProcessingResult, true);
            Edit._private.synchronize = baseSynchronize;
         });

         it('processing result', () => {
            let action = '';
            let synchronizer = {
               addRecord: function(record, additionalData, items) {
                  assert.equal(record.get('title'), 'Rooney');
                  assert.equal(additionalData.isNewRecord, true);
                  assert.equal(items, editOpener._options.items);
                  action = 'create';
               },
               mergeRecord: function(record, items, editKey) {
                  assert.equal(record.get('title'), 'Rooney');
                  assert.equal(items, editOpener._options.items);
                  assert.equal(editKey, editOpener._linkedKey);
                  action = 'merge';
               },
               deleteRecord: function(items, editKey) {
                  assert.equal(items, editOpener._options.items);
                  assert.equal(editKey, editOpener._linkedKey);
                  action = 'delete';
               }
            };

            let data = {
               formControllerEvent: 'update',
               record: dataRS.at(0),
               additionalData: {}
            };

            Edit._private.processingResult(synchronizer, data, editOpener._options.items, editOpener._linkedKey);
            assert.equal(action, 'merge');

            data.additionalData.isNewRecord = true;
            Edit._private.processingResult(synchronizer, data, editOpener._options.items, editOpener._linkedKey);
            assert.equal(action, 'create');

            data.formControllerEvent = 'delete';
            Edit._private.processingResult(synchronizer, data, editOpener._options.items, editOpener._linkedKey);
            assert.equal(action, 'delete');
         });

         it('synchronize', () => {
            let baseProcessingResult = Edit._private.processingResult;
            let isProcessingResult = false;
            let synchronizer = 'synchronizer';
            let data = {
               formControllerEvent: 'update',
               record: dataRS.at(0),
               additionalData: {}
            };
            Edit._private.processingResult = (_synchronizer, _data, _items, _editKey) => {
               assert.equal(synchronizer, _synchronizer);
               assert.equal(data, _data);
               assert.equal(_items, editOpener._options.items);
               assert.equal(_editKey, editOpener._linkedKey);
               isProcessingResult = true;
            };
            Edit._private.synchronize(editOpener, '', data, synchronizer);
            assert.equal(isProcessingResult, true);

            isProcessingResult = false;
            let def = new Deferred();
            Edit._private.synchronize(editOpener, def, data, synchronizer);
            assert.equal(isProcessingResult, false);
            def.callback();
            assert.equal(isProcessingResult, true);
         });
      });
   }
);
