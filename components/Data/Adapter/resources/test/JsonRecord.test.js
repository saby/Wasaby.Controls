/* global define, beforeEach, afterEach, describe, context, it, assert */
define(
   ['js!SBIS3.CONTROLS.Data.Adapter.JsonRecord'],
   function (JsonRecord) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Adapter.JsonRecord', function () {
         var data,
            adapterInstance;

         beforeEach(function () {
            data = {
               'Ид': 1,
               'Фамилия': 'Иванов',
               'Имя': 'Иван',
               'Отчество': 'Иванович'
            };

            adapterInstance = new JsonRecord(data);
         });

         afterEach(function () {
            data = undefined;
            adapterInstance = undefined;
         });

         describe('.get()', function () {
            it('should return the property value', function () {
               assert.strictEqual(
                  1,
                  adapterInstance.get('Ид')
               );
               assert.strictEqual(
                  'Иванов',
                  adapterInstance.get('Фамилия')
               );
               assert.isUndefined(
                  adapterInstance.get('Должность')
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
               adapterInstance.set('Ид', 20);
               assert.strictEqual(
                  20,
                  data['Ид']
               );

               adapterInstance.set('а', 5);
               assert.strictEqual(
                  5,
                  data['а']
               );

               adapterInstance.set('б');
               assert.isUndefined(
                  data['б']
               );
            });

            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapterInstance.replace({}, -1);
               });
               assert.throw(function () {
                  adapterInstance.replace({}, 99);
               });
            });
         });

         describe('.getEmpty()', function () {
            it('should return an empty object', function () {
               assert.instanceOf(adapterInstance.getEmpty(), Object);
               assert.isTrue(Object.isEmpty(adapterInstance.getEmpty()));
            });
         });
      });
   }
);
