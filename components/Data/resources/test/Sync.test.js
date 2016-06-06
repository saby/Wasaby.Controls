/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Sync',
   'js!SBIS3.CONTROLS.Data.Record',
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet'
], function (Sync, Record, List, RecordSet) {
   'use strict';

   describe('SBIS3.CONTROLS.Data.Sync', function () {
      var source,
         serviceField = '__state__';

      beforeEach(function () {
         source = {
            update: function(record) {
               this.updatedRecord = record;
               this.updatedRecordData = record.clone().getRawData();
               return $ws.proto.Deferred.success();
            },
            destroy: function(id) {
               this.destroyedId = id;
               return $ws.proto.Deferred.success();
            },
            getIdProperty: function() {
               return 'id';
            }
         };
      });

      afterEach(function () {
         source = undefined;
      });

      describe('.record()', function () {
         var rec;

         beforeEach(function () {
            rec = new Record();
         });

         afterEach(function () {
            rec = undefined;
         });

         it('should update the added record', function () {
            rec.setState(Record.RecordState.ADDED);
            Sync.record(rec, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should update the changed record', function () {
            rec.setState(Record.RecordState.CHANGED);
            Sync.record(rec, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should destroy the deleted record', function () {
            rec.set('id', 'test');
            rec.setState(Record.RecordState.DELETED);
            Sync.record(rec, source);
            assert.equal('test', source.destroyedId);
            assert.strictEqual(rec.getState(), Record.RecordState.DETACHED);
         });

         it('should don\'t update the unchanged record', function () {
            rec.setState(Record.RecordState.UNCHANGED);
            Sync.record(rec, source);
            assert.isUndefined(source.updatedRecord);
            assert.isUndefined(source.destroyedId);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should don\'t update the detached record', function () {
            rec.setState(Record.RecordState.DETACHED);
            Sync.record(rec, source);
            assert.isUndefined(source.updatedRecord);
            assert.isUndefined(source.destroyedId);
            assert.strictEqual(rec.getState(), Record.RecordState.DETACHED);
         });
      });

      describe('.collection()', function () {
         var records,
            list;

         beforeEach(function () {
            records = [new Record(), new Record(), new Record()];
            list = new List({items: records.slice()});
         });

         afterEach(function () {
            records = undefined;
            list = undefined;
         });

         it('should update the added record from the array', function () {
            var rec = records[1];
            rec.setState(Record.RecordState.ADDED);
            Sync.collection(records, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should update the added record from the list', function () {
            var rec = list.at(1);
            rec.setState(Record.RecordState.ADDED);
            Sync.collection(list, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should update the changed record from the array', function () {
            var rec = records[0];
            rec.set('id', 'test');
            Sync.collection(records, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should update the changed record from the list', function () {
            var rec = list.at(0);
            rec.set('id', 'test');
            Sync.collection(list, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should destroy the deleted record from the array', function () {
            var rec = records[2];
            rec.set('id', 'test');
            rec.setState(Record.RecordState.DELETED);
            Sync.collection(records, source);
            assert.strictEqual('test', source.destroyedId);
            assert.notEqual(rec, records[2]);
            assert.strictEqual(rec.getState(), Record.RecordState.DETACHED);
         });

         it('should destroy the deleted record from the list', function () {
            var rec = list.at(2);
            rec.set('id', 'test');
            rec.setState(Record.RecordState.DELETED);
            Sync.collection(list, source);
            assert.strictEqual('test', source.destroyedId);
            assert.notEqual(rec, list.at(2));
            assert.strictEqual(rec.getState(), Record.RecordState.DETACHED);
         });

         it('should throw an error for not a collection', function () {
            assert.throw(function() {
               Sync.collection();
            });
            assert.throw(function() {
               Sync.collection(null);
            });
            assert.throw(function() {
               Sync.collection(false);
            });
            assert.throw(function() {
               Sync.collection(true);
            });
            assert.throw(function() {
               Sync.collection(0);
            });
            assert.throw(function() {
               Sync.collection({});
            });
         });
      });

      describe('.recordSet()', function () {
         var rs;

         beforeEach(function () {
            rs = new RecordSet({
               rawData: [
                  {id: 1},
                  {id: 2},
                  {id: 3}
               ]
            });
         });

         afterEach(function () {
            rs = undefined;
         });

         it('should update if it have an added record', function () {
            var rec = rs.at(0);
            rec.setState(Record.RecordState.ADDED);
            Sync.recordSet(rs, source);
            assert.strictEqual(rs, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
            assert.strictEqual(source.updatedRecordData[0][serviceField], Sync.RecordStateSerialized.Added);
         });

         it('should update if it have an changed record', function () {
            var rec = rs.at(1);
            rec.setState(Record.RecordState.CHANGED);
            Sync.recordSet(rs, source);
            assert.strictEqual(rs, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
            assert.strictEqual(source.updatedRecordData[1][serviceField], Sync.RecordStateSerialized.Changed);
         });

         it('should update if it have an deleted record', function () {
            var rec = rs.at(2);
            rec.setState(Record.RecordState.DELETED);
            Sync.recordSet(rs, source);
            assert.strictEqual(rs, source.updatedRecord);
            assert.notEqual(rec, rs.at(2));
            assert.strictEqual(rec.getState(), Record.RecordState.DETACHED);
            assert.strictEqual(source.updatedRecordData[2][serviceField], Sync.RecordStateSerialized.Deleted);
         });

         it('should don\'t update the unchanged record', function () {
            Sync.recordSet(rs, source);
            assert.isUndefined(source.updatedRecord);
            assert.isUndefined(source.destroyedId);
         });

         it('should don\'t update the detached record', function () {
            rs.at(0).setState(Record.RecordState.DETACHED);
            Sync.recordSet(rs, source);
            assert.isUndefined(source.updatedRecord);
            assert.isUndefined(source.destroyedId);
         });

         it('should remove service field from recordset', function () {
            rs.at(0).setState(Record.RecordState.ADDED);
            Sync.recordSet(rs, source);
            assert.equal(rs.getFormat().getFieldIndex(serviceField), -1);
         });
      });
   });
});