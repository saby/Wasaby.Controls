/* global define, beforeEach, afterEach, describe, context, it, assert */
define([
      'js!SBIS3.CONTROLS.Data.Adapter.SbisRecord'
   ], function (SbisRecord) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Adapter.SbisRecord', function () {
         var data,
            adapterInstance;

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

            adapterInstance = new SbisRecord(data);
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
                  adapterInstance.get()
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
               adapterInstance.set('Ид', 20);
               assert.strictEqual(
                  20,
                  data.d[0]
               );
            });

            it('should throw an error on undefined property', function () {
               assert.throw(function () {
                  adapterInstance.set('а', 5);
               });
               assert.throw(function () {
                  adapterInstance.set('б');
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
      });
   }
);
