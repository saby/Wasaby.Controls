/* global define, beforeEach, afterEach, describe, context, it, assert */
define(
   ['js!SBIS3.CONTROLS.Data.Adapter.Json'],
   function (JsonAdapter) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Adapter.Json', function () {
         var data,
            adapterInstance;

         beforeEach(function () {
            data = [{
               'Ид': 1,
               'Фамилия': 'Иванов'
            }, {
               'Ид': 2,
               'Фамилия': 'Петров'
            }, {
               'Ид': 3,
               'Фамилия': 'Сидоров'
            }, {
               'Ид': 4,
               'Фамилия': 'Пухов'
            }, {
               'Ид': 5,
               'Фамилия': 'Молодцов'
            }, {
               'Ид': 6,
               'Фамилия': 'Годолцов'
            }, {
               'Ид': 7,
               'Фамилия': 'Арбузнов'
            }];

            adapterInstance = new JsonAdapter();
         });

         afterEach(function () {
            data = undefined;
            adapterInstance = undefined;
         });

         describe('.forTable()', function () {
            it('should return table adapter', function () {
               var adapterInstance = new JsonAdapter();
               assert.isTrue(
                  $ws.helpers.instanceOfModule(
                     adapterInstance.forTable(),
                     'SBIS3.CONTROLS.Data.Adapter.JsonTable'
                  )
               );
            });
            it('should pass data to the table adapter', function () {
               var data = [{a: 1}, {b: 2}],
                  adapterInstance = new JsonAdapter();
               assert.strictEqual(
                  adapterInstance.forTable(data).getData(),
                  data
               );
            });
         });

         describe('.forRecord()', function () {
            it('should return record adapter', function () {
               var adapterInstance = new JsonAdapter();
               assert.isTrue(
                  $ws.helpers.instanceOfModule(
                     adapterInstance.forRecord(),
                     'SBIS3.CONTROLS.Data.Adapter.JsonRecord'
                  )
               );
            });
            it('should pass data to the record adapter', function () {
               var data = {a: 1},
                  adapterInstance = new JsonAdapter();
               assert.strictEqual(
                  adapterInstance.forRecord(data).getData(),
                  data
               );
            });
         });

         describe('.getProperty()', function () {
            it('should return the property value', function () {
               assert.strictEqual(
                  123,
                  adapterInstance.getProperty({
                     items: data,
                     total: 123
                  }, 'total')
               );
               assert.strictEqual(
                  456,
                  adapterInstance.getProperty({
                     employees: {
                        items: data,
                        total: 456
                     }
                  }, 'employees.total')
               );
               assert.isUndefined(
                  adapterInstance.getProperty({
                     items: data
                  }, 'total')
               );
               assert.isUndefined(
                  adapterInstance.getProperty({
                     items: data
                  })
               );
            });

            it('should return undefined on invalid data', function () {
               assert.isUndefined(
                  adapterInstance.getProperty({})
               );
               assert.isUndefined(
                  adapterInstance.getProperty('')
               );
               assert.isUndefined(
                  adapterInstance.getProperty(0)
               );
               assert.isUndefined(
                  adapterInstance.getProperty()
               );
            });
         });

         describe('.setProperty()', function () {
            it('should set the property value', function () {
               var moreData = {
                  items: data,
                  total: 123
               };
               adapterInstance.setProperty(moreData, 'total', 456);
               assert.strictEqual(
                  456,
                  moreData.total
               );
               assert.strictEqual(
                  1,
                  moreData.items[0]['Ид']
               );
               assert.strictEqual(
                  5,
                  moreData.items[4]['Ид']
               );
               assert.strictEqual(
                  'Годолцов',
                  moreData.items[5]['Фамилия']
               );

               moreData = {
                  employees: {
                     items: data,
                     total: 789
                  }
               };
               adapterInstance.setProperty(moreData, 'employees.total', 987);
               assert.strictEqual(
                  987,
                  moreData.employees.total
               );
               assert.strictEqual(
                  1,
                  moreData.employees.items[0]['Ид']
               );
               assert.strictEqual(
                  5,
                  moreData.employees.items[4]['Ид']
               );
               assert.strictEqual(
                  'Годолцов',
                  moreData.employees.items[5]['Фамилия']
               );

               moreData = {
                  a: 1,
                  b: 2
               };
               adapterInstance.setProperty(moreData, 'c.d.e.f', 'g');
               assert.strictEqual(
                  'g',
                  moreData.c.d.e.f
               );
               assert.strictEqual(
                  1,
                  moreData.a
               );
               assert.strictEqual(
                  2,
                  moreData.b
               );
            });
         });
      });
   }
);
