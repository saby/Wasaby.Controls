/* global define, beforeEach, afterEach, describe, context, it, assert */
define([
'js!SBIS3.CONTROLS.Data.Adapter.RecordSetRecord',
'js!SBIS3.CONTROLS.Data.Record',
'js!SBIS3.CONTROLS.Data.Format.FieldsFactory'
], function (RecordSetRecordAdapter, Record, FieldsFactory) {
   'use strict';

   describe('SBIS3.CONTROLS.Data.Adapter.RecordSetRecord', function () {
      var data,
         adapter;

      beforeEach(function () {
         data = new Record({
            rawData: {
               id: 1,
               name: 'Иванов'
            }
         });

         adapter = new RecordSetRecordAdapter(data);
      });

      afterEach(function () {
         data = undefined;
         adapter = undefined;
      });

      describe('.get()', function () {
         it('should return the property value', function () {
            assert.strictEqual(
               1,
               adapter.get('id')
            );
            assert.strictEqual(
               'Иванов',
               adapter.get('name')
            );
            assert.isUndefined(
               adapter.get('age')
            );
            assert.isUndefined(
               new RecordSetRecordAdapter().get('age')
            );
            assert.isUndefined(
               new RecordSetRecordAdapter(null).get('age')
            );
            assert.isUndefined(
               new RecordSetRecordAdapter().get()
            );
         });
      });

      describe('.set()', function () {
         it('should set the property value', function () {
            adapter.set('id', 20);
            assert.strictEqual(
               20,
               data.get('id')
            );

            adapter.set('a', 5);
            assert.strictEqual(
               5,
               data.get('a')
            );

            adapter.set('b');
            assert.isUndefined(
               data.get('b')
            );
         });
         it('should throw an error on invalid data', function () {
            assert.throw(function () {
               adapter.set();
            });
            assert.throw(function () {
               adapter.set('');
            });
            assert.throw(function () {
               adapter.set(0);
            });
         });
      });

      describe('.clear()', function () {
         it('should return an empty record', function () {
            adapter.clear();
            var hasFields = false;
            adapter.getData().each(function() {
               hasFields = true;
            });
            assert.isFalse(hasFields);
         });
         it('should return a same instance', function () {
            adapter.clear();
            assert.strictEqual(data, adapter.getData());
         });
      });

      describe('.getEmpty()', function () {
         it('should return an empty Record', function () {
            assert.instanceOf(adapter.getEmpty(), Record);
            var count = 0;
            adapter.getEmpty().each(function() {
               count++;
            });
            assert.strictEqual(count, 0);
         });
      });

      describe('.getData()', function () {
         it('should return raw data', function () {
            assert.strictEqual(adapter.getData(), data);
         });
      });

      describe('.getFields()', function () {
         it('should return fields list', function () {
            assert.deepEqual(
               adapter.getFields(),
               ['id', 'name']
            );
         });
      });

      describe('.getFormat()', function () {
         it('should return exists field format', function () {
            var format = adapter.getFormat('id');
            assert.strictEqual(format.getName(), 'id');
         });
         it('should throw an error for not exists field', function () {
            assert.throw(function () {
               adapter.getFormat('Some');
            });
         });
      });

      describe('.addField()', function () {
         it('should add a new field', function () {
            var fieldName = 'New',
               field = FieldsFactory.create({
                  type: 'string',
                  name: fieldName
               });
            adapter.addField(field, 0);
            assert.strictEqual(adapter.getFormat(fieldName).getName(), fieldName);
         });
         it('should use a field default value', function () {
            var fieldName = 'New',
               def = 'abc';
            adapter.addField(FieldsFactory.create({
               type: 'string',
               name: fieldName,
               defaultValue: def
            }));
            assert.strictEqual(adapter.get(fieldName), def);
            assert.strictEqual(data.get(fieldName), def);
         });
         it('should throw an error for already exists field', function () {
            assert.throw(function () {
               adapter.addField(FieldsFactory.create({
                  type: 'string',
                  name: 'name'
               }));
            });
         });
         it('should throw an error for not a field', function () {
            assert.throw(function () {
               adapter.addField();
            });
            assert.throw(function () {
               adapter.addField(null);
            });
            assert.throw(function () {
               adapter.addField({
                  type: 'string',
                  name: 'new'
               });
            });
         });
      });

      describe('.removeField()', function () {
         it('should remove exists field', function () {
            var name = 'id',
               oldFields = adapter.getFields();
            adapter.removeField(name);
            assert.isUndefined(adapter.get(name));
            assert.strictEqual(Array.indexOf(adapter.getFields(), name), -1);
            assert.strictEqual(adapter.getFields().length, oldFields.length - 1);
            assert.throw(function () {
               adapter.getFormat(name);
            });
         });
         it('should throw an error for not exists field', function () {
            assert.throw(function () {
               adapter.removeField('Some');
            });
         });
      });

      describe('.removeFieldAt()', function () {
         var getRawData = function() {
            return {
               d: [
                  1,
                  'Иванов'
               ],
               s: [
                  {'n': 'id', 't': 'Число целое'},
                  {'n': 'name', 't': 'Строка'}
               ]
            };
         };

         it('should remove exists field', function () {
            var data = new Record({
                  rawData: getRawData(),
                  adapter: 'adapter.sbis'
               }),
               adapter = new RecordSetRecordAdapter(data),
               oldF = adapter.getFields();

            adapter.removeFieldAt(0);
            var newF = adapter.getFields();
            assert.notEqual(oldF[0], newF[0]);
            assert.strictEqual(oldF[1], newF[0]);
            assert.throw(function () {
               adapter.getFormat(oldF.getName());
            });
         });
         it('should throw an error', function () {
            var data = new Record({
                  rawData: getRawData(),
                  adapter: 'adapter.sbis'
               }),
               adapter = new RecordSetRecordAdapter(data);

            assert.throw(function () {
               adapter.removeFieldAt(-1);
            });
            assert.throw(function () {
               adapter.removeFieldAt(10);
            });
         });
      });
   });
});
