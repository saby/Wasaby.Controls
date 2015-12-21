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

         describe('.destroy()', function(){
            it('should destroy without error', function() {
               var adapterDestroyInstance = new JsonAdapter();
               adapterDestroyInstance.destroy();
            });
         });
      });

      describe('SBIS3.CONTROLS.Data.Adapter.Json::forTable()', function () {
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

            adapterInstance = new JsonAdapter().forTable(data);
         });

         afterEach(function () {
            data = undefined;
            adapterInstance = undefined;
         });

         describe('.getEmpty()', function () {
            it('should return an empty array', function () {
               assert.instanceOf(adapterInstance.getEmpty(), Array);
               assert.strictEqual(
                  0,
                  adapterInstance.getEmpty().length
               );
            });
         });

         describe('.getCount()', function () {
            it('should return records count', function () {
               assert.strictEqual(
                  7,
                  adapterInstance.getCount()
               );
               assert.strictEqual(
                  0,
                  new JsonAdapter().forTable().getCount([])
               );
               assert.strictEqual(
                  0,
                  new JsonAdapter().forTable().getCount({})
               );
               assert.strictEqual(
                  0,
                  new JsonAdapter().forTable().getCount('')
               );
               assert.strictEqual(
                  0,
                  new JsonAdapter().forTable().getCount(0)
               );
               assert.strictEqual(
                  0,
                  new JsonAdapter().forTable().getCount()
               );
            });
         });

         describe('.add()', function () {
            it('should append a record', function () {
               adapterInstance.add({
                  'Ид': 30
               });
               assert.strictEqual(
                  8,
                  data.length
               );
               assert.strictEqual(
                  30,
                  data[data.length - 1]['Ид']
               );
            });

            it('should prepend a record', function () {
               adapterInstance.add({
                  'Ид': 31
               }, 0);
               assert.strictEqual(
                  8,
                  data.length
               );
               assert.strictEqual(
                  31,
                  data[0]['Ид']
               );
            });

            it('should insert a record', function () {
               adapterInstance.add({
                  'Ид': 32
               }, 2);
               assert.strictEqual(
                  8,
                  data.length
               );
               assert.strictEqual(
                  32,
                  data[2]['Ид']
               );
            });

            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapterInstance.add({
                     'Ид': 33
                  }, 100);
               });
               assert.throw(function () {
                  adapterInstance.add({
                     'Ид': 34
                  }, -1);
               });
            });
         });

         describe('.at()', function () {
            it('should return valid record', function () {
               assert.strictEqual(
                  1,
                  adapterInstance.at(0)['Ид']
               );
               assert.strictEqual(
                  3,
                  adapterInstance.at(2)['Ид']
               );
            });

            it('should return undefined on invalid position', function () {
               assert.isUndefined(
                  adapterInstance.at(-1)
               );
               assert.isUndefined(
                  adapterInstance.at(99)
               );
            });

            it('should return undefined on invalid data', function () {
               assert.isUndefined(
                  new JsonAdapter().forTable({}).at()
               );
               assert.isUndefined(
                  new JsonAdapter().forTable('').at()
               );
               assert.isUndefined(
                  new JsonAdapter().forTable(0).at()
               );
               assert.isUndefined(
                  new JsonAdapter().forTable().at()
               );
            });
         });

         describe('.remove()', function () {
            it('should remove the record', function () {
               adapterInstance.remove(0);
               assert.strictEqual(
                  2,
                  data[0]['Ид']
               );

               adapterInstance.remove(2);
               assert.strictEqual(
                  5,
                  data[2]['Ид']
               );

               adapterInstance.remove(5);
               assert.isUndefined(
                  data[5]
               );
            });

            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapterInstance.remove(-1);
               });
               assert.throw(function () {
                  adapterInstance.remove(99);
               });
            });
         });

         describe('.replace()', function () {
            it('should replace the record', function () {
               adapterInstance.replace({
                  'Ид': 11
               }, 0);
               assert.strictEqual(
                  11,
                  data[0]['Ид']
               );

               adapterInstance.replace({
                  'Ид': 12
               }, 4);
               assert.strictEqual(
                  12,
                  data[4]['Ид']
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

         describe('.move()', function () {
            it('should move Иванов instead Сидоров', function () {
               adapterInstance.move(0, 2);
               assert.strictEqual(
                  'Петров',
                  data[0]['Фамилия']
               );
               assert.strictEqual(
                  'Сидоров',
                  data[1]['Фамилия']
               );
               assert.strictEqual(
                  'Иванов',
                  data[2]['Фамилия']
               );
            });
            it('should move Сидоров instead Иванов', function () {
               adapterInstance.move(2, 0);
               assert.strictEqual(
                  'Сидоров',
                  data[0]['Фамилия']
               );
               assert.strictEqual(
                  'Иванов',
                  data[1]['Фамилия']
               );
               assert.strictEqual(
                  'Петров',
                  data[2]['Фамилия']
               );
            });
            it('should move Петров to the end', function () {
               adapterInstance.move(1, 6);
               assert.strictEqual(
                  'Петров',
                  data[6]['Фамилия']
               );
               assert.strictEqual(
                  'Арбузнов',
                  data[5]['Фамилия']
               );
            });
         });
      });

      describe('SBIS3.CONTROLS.Data.Adapter.Json::forRecord()', function () {
         var data,
            adapterInstance;

         beforeEach(function () {
            data = {
               'Ид': 1,
               'Фамилия': 'Иванов',
               'Имя': 'Иван',
               'Отчество': 'Иванович'
            };

            adapterInstance = new JsonAdapter().forRecord(data);
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
                  new JsonAdapter().forRecord({}).get('Должность')
               );
               assert.isUndefined(
                  new JsonAdapter().forRecord().get()
               );
               assert.isUndefined(
                  new JsonAdapter().forRecord('').get()
               );
               assert.isUndefined(
                  new JsonAdapter().forRecord(0).get()
               );
               assert.isUndefined(
                  new JsonAdapter().forRecord().get()
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
