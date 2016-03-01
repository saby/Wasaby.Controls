/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Adapter.SbisRecord',
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory'
   ], function (SbisRecord, FieldsFactory) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Adapter.SbisRecord', function () {
         var data,
            adapter;

         beforeEach(function () {
            data = {
               d: [1, 'Иванов', 'Иван', 'Иванович'],
               s: [
                  {'n': 'Ид', 't': 'Число целое'},
                  {'n': 'Фамилия', 't': 'Строка'},
                  {'n': 'Имя', 't': 'Строка'},
                  {'n': 'Отчество', 't': 'Строка'}
               ]
            };

            adapter = new SbisRecord(data);
         });

         afterEach(function () {
            data = undefined;
            adapter = undefined;
         });

         describe('.get()', function () {
            it('should return the property value', function () {
               assert.strictEqual(
                  1,
                  adapter.get('Ид')
               );
               assert.strictEqual(
                  'Иванов',
                  adapter.get('Фамилия')
               );
               assert.isUndefined(
                  adapter.get('Должность')
               );
               assert.isUndefined(
                  adapter.get()
               );
               assert.isUndefined(
                  new SbisRecord({}).get('Должность')
               );
               assert.isUndefined(
                  new SbisRecord('').get()
               );
               assert.isUndefined(
                  new SbisRecord(0).get()
               );
               assert.isUndefined(
                  new SbisRecord().get()
               );
            });
         });

         describe('.set()', function () {
            it('should set the property value', function () {
               adapter.set('Ид', 20);
               assert.strictEqual(
                  20,
                  data.d[0]
               );
            });

            it('should throw an error on undefined property', function () {
               assert.throw(function () {
                  adapter.set('а', 5);
               });
               assert.throw(function () {
                  adapter.set('б');
               });
            });

            it('should throw an error on invalid data', function () {
               assert.throw(function () {
                  new SbisRecord('').set();
               });
               assert.throw(function () {
                  new SbisRecord(0).set(0);
               });
               assert.throw(function () {
                  new SbisRecord().set();
               });
            });
         });

         describe('.getData()', function () {
            it('should return raw data', function () {
               assert.strictEqual(adapter.getData(), data);
            });
         });

         describe('.getFormat()', function () {
            it('should return integer field format', function () {
               var format = adapter.getFormat('Ид');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.IntegerField'));
               assert.strictEqual(format.getName(), 'Ид');
            });
            it('should return string field format', function () {
               var format = adapter.getFormat('Фамилия');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.StringField'));
               assert.strictEqual(format.getName(), 'Фамилия');
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
               adapter.addField(field, 1);
               assert.strictEqual(adapter.getFormat(fieldName).getName(), fieldName);
               assert.strictEqual(adapter.getFields()[1], fieldName);
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
            });
            it('should throw an error for already exists field', function () {
               assert.throw(function () {
                  adapter.addField(FieldsFactory.create({
                     type: 'string',
                     name: 'Ид'
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
                     name: 'New'
                  });
               });
            });
         });

         describe('.removeField()', function () {
            it('should remove exists field', function () {
               var name = 'Ид',
                  index = 0,
                  newFields = adapter.getFields(),
                  newData = adapter.getData().d.slice();
               adapter.removeField(name);
               newFields.splice(index, 1);
               newData.splice(index, 1);

               assert.isUndefined(adapter.get(name));
               assert.deepEqual(adapter.getFields(), newFields);
               assert.deepEqual(adapter.getData().d, newData);
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
            it('should remove exists field', function () {
               var name = 'Ид',
                  index = 0,
                  newFields = adapter.getFields(),
                  newData = adapter.getData().d.slice();
               adapter.removeFieldAt(0);
               newFields.splice(index, 1);
               newData.splice(index, 1);

               assert.isUndefined(adapter.get(name));
               assert.deepEqual(adapter.getFields(), newFields);
               assert.deepEqual(adapter.getData().d, newData);
               assert.throw(function () {
                  adapter.getFormat(name);
               });
            });
            it('should throw an error for not exists field', function () {
               assert.throw(function () {
                  adapter.removeFieldAt(9);
               });
            });
         });
      });
   }
);
