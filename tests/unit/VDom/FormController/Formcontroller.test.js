define([
   'Controls/form',
   'Core/Deferred',
   'Types/entity',
   'Core/polyfill/PromiseAPIDeferred'
], (form, Deferred, entity) => {
   'use strict';

   describe('FormController', () => {
      it('initializingWay', (done) => {
         let FC = new form.Controller();

         let baseReadRecordBeforeMount = form.Controller._private.readRecordBeforeMount;
         let baseCreateRecordBeforeMount = form.Controller._private.createRecordBeforeMount;
         let cfg = {
            record: new entity.Record(),
         };

         let isReading = false;
         let isCreating = false;

         form.Controller._private.readRecordBeforeMount = () => {
            isReading = true;
            return Promise.resolve({ data: true });
         };

         form.Controller._private.createRecordBeforeMount = () => {
            isCreating = true;
            return Promise.resolve({ data: true });
         };

         let p1 = new Promise((resolve) => {
            let beforeMountResult = FC._beforeMount(cfg);
            assert.equal(isReading, false);
            assert.equal(isCreating, false);
            assert.notEqual(beforeMountResult, true);
            resolve();
         });

         let p2 = new Promise((resolve) => {
            cfg.key = '123';
            let beforeMountResult = FC._beforeMount(cfg);
            assert.equal(isReading, true);
            assert.equal(isCreating, false);
            assert.notEqual(beforeMountResult, true);
            resolve();
         }).catch((error) => {
               done(error);
         });

         let p3 = new Promise((resolve) => {
            cfg = {
               key: 123
            };
            isReading = false;
            let beforeMountResult = FC._beforeMount(cfg);
            assert.equal(isReading, true);
            assert.equal(isCreating, false);
            assert.isTrue(
               beforeMountResult instanceof Deferred ||
               beforeMountResult instanceof Promise
            );
            beforeMountResult.then(({data}) => {
               assert.equal(data, true);
               resolve();
            }).catch((error) => {
               done(error);
            });
         });
         let p4 = new Promise((resolve) => {
            isReading = false;
            isCreating = false;
            let beforeMountResult = FC._beforeMount({});
            assert.equal(isReading, false);
            assert.equal(isCreating, true);
            assert.isTrue(
               beforeMountResult instanceof Deferred ||
               beforeMountResult instanceof Promise
            );
            beforeMountResult.then(({data}) => {
               assert.equal(data, true);
               resolve();
            });
         });

         Promise.all([p1, p2, p3, p4]).then(() => {
            form.Controller._private.readRecordBeforeMount = baseReadRecordBeforeMount;
            form.Controller._private.createRecordBeforeMount = baseCreateRecordBeforeMount;
            FC.destroy();
            done();
         });
      });

      it('beforeUpdate', () => {
         let FC = new form.Controller();
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
            record: {
               isChanged: () => false
            },
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

         createCalled = false;
         let updateCalled = false;
         let confirmPopupCalled = false;
         FC._showConfirmPopup = () => {
            confirmPopupCalled = true;
            return (new Deferred()).callback(true);
         };
         FC.update = () => {
            updateCalled = true;
            return (new Deferred()).callback();
         };
         let record = {
            isChanged: () => true
         };
         FC._options.record = record;
         FC._beforeUpdate({
            record: record,
            key: 'key'
         });

         assert.equal(setRecordCalled, false);
         assert.equal(confirmPopupCalled, true);
         assert.equal(readCalled, true);
         assert.equal(updateCalled, true);
         assert.equal(createCalled, false);
         assert.equal(FC._isNewRecord, true);

         FC._showConfirmPopup = () => {
            confirmPopupCalled = true;
            return (new Deferred()).callback(false);
         };

         updateCalled = false;
         readCalled = false;
         confirmPopupCalled = false;
         FC._beforeUpdate({
            record: record,
            key: 'key'
         });

         assert.equal(setRecordCalled, false);
         assert.equal(confirmPopupCalled, true);
         assert.equal(readCalled, true);
         assert.equal(updateCalled, false);
         assert.equal(createCalled, false);

         FC.destroy();
      });

      it('beforeUnmount', () => {
         let isDestroyCall = false;
         let dataSource = {
            destroy: (id) => {
               assert.equal(id, 'id1');
               isDestroyCall = true;
            }
         };
         let FC = new form.Controller();
         FC.saveOptions({dataSource});
         FC._source = dataSource;
         FC._record = {
            getId: () => 'id1'
         };
         FC._beforeUnmount();
         assert.equal(isDestroyCall, false);

         FC._isNewRecord = true;
         FC._beforeUnmount();
         assert.equal(isDestroyCall, true);
         FC.destroy();
      });

      it('delete new record', () => {
         let FC = new form.Controller();
         let isDestroyCalled = false;
         FC._source = {
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
