/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Source.Synchronizer',
   'js!SBIS3.CONTROLS.Data.Record',
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet'
], function (Synchronizer, Record, List, RecordSet) {
   'use strict';

   describe('SBIS3.CONTROLS.Data.Source.Synchronizer', function () {
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
            Synchronizer.record(rec, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should update the changed record', function () {
            rec.setState(Record.RecordState.CHANGED);
            Synchronizer.record(rec, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should destroy the deleted record', function () {
            rec.set('id', 'test');
            rec.setState(Record.RecordState.DELETED);
            Synchronizer.record(rec, source);
            assert.equal('test', source.destroyedId);
            assert.strictEqual(rec.getState(), Record.RecordState.DETACHED);
         });

         it('should don\'t update the unchanged record', function () {
            rec.setState(Record.RecordState.UNCHANGED);
            Synchronizer.record(rec, source);
            assert.isUndefined(source.updatedRecord);
            assert.isUndefined(source.destroyedId);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should don\'t update the detached record', function () {
            rec.setState(Record.RecordState.DETACHED);
            Synchronizer.record(rec, source);
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
            Synchronizer.collection(records, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should update the added record from the list', function () {
            var rec = list.at(1);
            rec.setState(Record.RecordState.ADDED);
            Synchronizer.collection(list, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should update the changed record from the array', function () {
            var rec = records[0];
            rec.set('id', 'test');
            Synchronizer.collection(records, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should update the changed record from the list', function () {
            var rec = list.at(0);
            rec.set('id', 'test');
            Synchronizer.collection(list, source);
            assert.strictEqual(rec, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
         });

         it('should destroy the deleted record from the array', function () {
            var rec = records[2];
            rec.set('id', 'test');
            rec.setState(Record.RecordState.DELETED);
            Synchronizer.collection(records, source);
            assert.strictEqual('test', source.destroyedId);
            assert.notEqual(rec, records[2]);
            assert.strictEqual(rec.getState(), Record.RecordState.DETACHED);
         });

         it('should destroy the deleted record from the list', function () {
            var rec = list.at(2);
            rec.set('id', 'test');
            rec.setState(Record.RecordState.DELETED);
            Synchronizer.collection(list, source);
            assert.strictEqual('test', source.destroyedId);
            assert.notEqual(rec, list.at(2));
            assert.strictEqual(rec.getState(), Record.RecordState.DETACHED);
         });

         it('should throw an error for not a collection', function () {
            assert.throw(function() {
               Synchronizer.collection();
            });
            assert.throw(function() {
               Synchronizer.collection(null);
            });
            assert.throw(function() {
               Synchronizer.collection(false);
            });
            assert.throw(function() {
               Synchronizer.collection(true);
            });
            assert.throw(function() {
               Synchronizer.collection(0);
            });
            assert.throw(function() {
               Synchronizer.collection({});
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
            Synchronizer.recordSet(rs, source);
            assert.strictEqual(rs, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
            assert.strictEqual(source.updatedRecordData[0][serviceField], Synchronizer.RecordStateSerialized.Added);
         });

         it('should update if it have an changed record', function () {
            var rec = rs.at(1);
            rec.setState(Record.RecordState.CHANGED);
            Synchronizer.recordSet(rs, source);
            assert.strictEqual(rs, source.updatedRecord);
            assert.strictEqual(rec.getState(), Record.RecordState.UNCHANGED);
            assert.strictEqual(source.updatedRecordData[1][serviceField], Synchronizer.RecordStateSerialized.Changed);
         });

         it('should update if it have an deleted record', function () {
            var rec = rs.at(2);
            rec.setState(Record.RecordState.DELETED);
            Synchronizer.recordSet(rs, source);
            assert.strictEqual(rs, source.updatedRecord);
            assert.notEqual(rec, rs.at(2));
            assert.strictEqual(rec.getState(), Record.RecordState.DETACHED);
            assert.strictEqual(source.updatedRecordData[2][serviceField], Synchronizer.RecordStateSerialized.Deleted);
         });

         it('should don\'t update the unchanged record', function () {
            Synchronizer.recordSet(rs, source);
            assert.isUndefined(source.updatedRecord);
            assert.isUndefined(source.destroyedId);
         });

         it('should don\'t update the detached record', function () {
            rs.at(0).setState(Record.RecordState.DETACHED);
            Synchronizer.recordSet(rs, source);
            assert.isUndefined(source.updatedRecord);
            assert.isUndefined(source.destroyedId);
         });

         it('should remove service field from recordset', function () {
            rs.at(0).setState(Record.RecordState.ADDED);
            Synchronizer.recordSet(rs, source);
            assert.equal(rs.getFormat().getFieldIndex(serviceField), -1);
         });
      });
   });
});