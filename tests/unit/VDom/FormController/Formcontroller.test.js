define([
   'Controls/FormController'
], (FormController) => {
   'use strict';

   describe('FormController', () => {
      it('beforeUpdate', () => {
         let FC = new FormController();
         let setRecordCalled = false;
         let readCalled = false;
         let createCalled = false;

         FC._setRecord = () => {
            setRecordCalled = true;
         };
         FC.read = () => {
            readCalled = true;
         };
         FC.create = () => {
            createCalled = true;
         };

         FC._beforeUpdate({
            record: 'record'
         });
         assert.equal(setRecordCalled, true);
         assert.equal(readCalled, false);
         assert.equal(createCalled, false);

         setRecordCalled = false;
         FC._beforeUpdate({
            record: 'record',
            key: 'key'
         });

         assert.equal(setRecordCalled, true);
         assert.equal(readCalled, true);
         assert.equal(createCalled, false);
         assert.equal(FC._isNewRecord, false);

         setRecordCalled = false;
         readCalled = false;
         FC._beforeUpdate({
            isNewRecord: true
         });

         assert.equal(setRecordCalled, false);
         assert.equal(readCalled, false);
         assert.equal(createCalled, true);
         assert.equal(FC._isNewRecord, true);
      });

      it('delete new record', () => {
         let FC = new FormController();
         let isDestroyCalled = false;
         FC._options.dataSource = {
            destroy: () => {
               isDestroyCalled = true;
            }
         };
         FC._tryDeleteNewRecord();
         assert.equal(isDestroyCalled, false);

         FC._record = {
            getId: () => null
         };
         FC._isNewRecord = true;

         FC._tryDeleteNewRecord();
         assert.equal(isDestroyCalled, false);

         FC._record = {
            getId: () => 'key'
         };
         FC._tryDeleteNewRecord();
         assert.equal(isDestroyCalled, true);

         FC.destroy();
      });
   });
});
