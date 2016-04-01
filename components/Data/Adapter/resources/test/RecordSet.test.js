/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Adapter.RecordSet',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
   'js!SBIS3.CONTROLS.Data.Record',
   'js!SBIS3.CONTROLS.Data.Model'
], function (RecordSetAdapter, RecordSet, Record, Model) {
   'use strict';

   describe('SBIS3.CONTROLS.Data.Adapter.RecordSet', function () {
      var data,
         adapter;

      beforeEach(function () {
         data = new RecordSet({
            rawData: [{
               id: 1,
               name: 'Иванов'
            }, {
               id: 2,
               name: 'Петров'
            }, {
               id: 3,
               name: 'Сидоров'
            }]
         });

         adapter = new RecordSetAdapter();
      });

      afterEach(function () {
         data = undefined;
         adapter = undefined;
      });

      describe('.forTable()', function () {
         it('should return table adapter', function () {
            assert.isTrue(
               $ws.helpers.instanceOfModule(
                  adapter.forTable(),
                  'SBIS3.CONTROLS.Data.Adapter.RecordSetTable'
               )
            );
         });
         it('should pass data to the table adapter', function () {
            assert.strictEqual(
               adapter.forTable(data).getData(),
               data
            );
         });
      });

      describe('.forRecord()', function () {
         it('should return record adapter', function () {
            assert.isTrue(
               $ws.helpers.instanceOfModule(
                  adapter.forRecord(),
                  'SBIS3.CONTROLS.Data.Adapter.RecordSetRecord'
               )
            );
         });
         it('should pass data to the record adapter', function () {
            var data = new Record();
            assert.strictEqual(
               adapter.forRecord(data).getData(),
               data
            );
         });
      });

      describe('.getKeyField()', function () {
         it('should return option idProperty for recordset', function () {
            assert.strictEqual(adapter.getKeyField(data), data.getIdProperty());
         });
         it('should return option idProperty for model', function () {
            var data = new Model({
               idProperty: 'test'
            });
            assert.strictEqual(adapter.getKeyField(data), 'test');
         });
      });

      describe('.getProperty()', function () {
         it('should return the property value', function () {
            assert.strictEqual(
               3,
               adapter.getProperty(data, 'count')
            );
            assert.isUndefined(
               adapter.getProperty(data, 'total')
            );
            assert.isUndefined(
               adapter.getProperty(data)
            );
         });

         it('should return undefined on invalid data', function () {
            assert.isUndefined(
               adapter.getProperty({})
            );
            assert.isUndefined(
               adapter.getProperty('')
            );
            assert.isUndefined(
               adapter.getProperty(0)
            );
            assert.isUndefined(
               adapter.getProperty()
            );
         });
      });

      describe('.setProperty()', function () {
         it('should set the property value', function () {
            adapter.setProperty(data, 'idProperty', 'name');
            assert.strictEqual(
               'name',
               data.getIdProperty()
            );
         });
         it('should throw an error if property is not exists', function () {
            assert.throw(function() {
               adapter.setProperty(data, 'some', 'value');
            });
         });
      });
   });
});
