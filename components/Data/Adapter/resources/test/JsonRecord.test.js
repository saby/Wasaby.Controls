/* global define, beforeEach, afterEach, describe, context, it, assert */
define([
   'js!SBIS3.CONTROLS.Data.Adapter.JsonRecord',
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory'
   ], function (JsonRecord, FieldsFactory) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Adapter.JsonRecord', function () {
         var data,
            adapter;

         beforeEach(function () {
            data = {
               'Ид': 1,
               'Фамилия': 'Иванов',
               'Имя': 'Иван',
               'Отчество': 'Иванович'
            };

            adapter = new JsonRecord(data);
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
                  new JsonRecord({}).get('Должность')
               );
               assert.isUndefined(
                  new JsonRecord().get()
               );
               assert.isUndefined(
                  new JsonRecord('').get()
               );
               assert.isUndefined(
                  new JsonRecord(0).get()
               );
               assert.isUndefined(
                  new JsonRecord().get()
               );
            });
         });

         describe('.set()', function () {
            it('should set the property value', function () {
               adapter.set('Ид', 20);
               assert.strictEqual(
                  20,
                  data['Ид']
               );

               adapter.set('а', 5);
               assert.strictEqual(
                  5,
                  data['а']
               );

               adapter.set('б');
               assert.isUndefined(
                  data['б']
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

         describe('.getEmpty()', function () {
            it('should return an empty object', function () {
               assert.instanceOf(adapter.getEmpty(), Object);
               assert.isTrue(Object.isEmpty(adapter.getEmpty()));
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
                  ['Ид', 'Фамилия', 'Имя', 'Отчество']
               );
            });
         });

         describe('.getFormat()', function () {
            it('should return exists field format', function () {
               var format = adapter.getFormat('Ид');
               assert.strictEqual(format.getName(), 'Ид');
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
            it('should throw an error', function () {
               assert.throw(function () {
                  adapter.removeFieldAt(0);
               });
            });
         });
      });
   }
);
