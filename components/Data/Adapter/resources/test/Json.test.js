/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
   ['js!SBIS3.CONTROLS.Data.Adapter.Json'],
   function (JsonAdapter) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Adapter.Json', function () {
         var data,
            adapter;

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

            adapter = new JsonAdapter();
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
                     'SBIS3.CONTROLS.Data.Adapter.JsonTable'
                  )
               );
            });
            it('should pass data to the table adapter', function () {
               var data = [{a: 1}, {b: 2}];
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
                     'SBIS3.CONTROLS.Data.Adapter.JsonRecord'
                  )
               );
            });
            it('should pass data to the record adapter', function () {
               var data = {a: 1};
               assert.strictEqual(
                  adapter.forRecord(data).getData(),
                  data
               );
            });
         });

         describe('.getKeyField()', function () {
            it('should return undefined', function () {
               assert.isUndefined(adapter.getKeyField(data));
            });
         });

         describe('.getProperty()', function () {
            it('should return the property value', function () {
               assert.strictEqual(
                  123,
                  adapter.getProperty({
                     items: data,
                     total: 123
                  }, 'total')
               );
               assert.strictEqual(
                  456,
                  adapter.getProperty({
                     employees: {
                        items: data,
                        total: 456
                     }
                  }, 'employees.total')
               );
               assert.isUndefined(
                  adapter.getProperty({
                     items: data
                  }, 'total')
               );
               assert.isUndefined(
                  adapter.getProperty({
                     items: data
                  })
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
               var moreData = {
                  items: data,
                  total: 123
               };
               adapter.setProperty(moreData, 'total', 456);
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
               adapter.setProperty(moreData, 'employees.total', 987);
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
               adapter.setProperty(moreData, 'c.d.e.f', 'g');
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

         describe('.serialize()', function () {
            it('should return data as is', function () {
               assert.deepEqual(adapter.serialize(data), data);
            });
         });
      });
   }
);
