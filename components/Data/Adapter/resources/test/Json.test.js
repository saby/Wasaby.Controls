/* global define, beforeEach, afterEach, describe, context, it, assert */
define(
   ['js!SBIS3.CONTROLS.Data.Adapter.Json'],
   function (JsonAdapter) {
      'use strict';

      var checkInvalid = function (instance, method) {
         assert.throw(function () {
            instance[method]({});
         });
         assert.throw(function () {
            instance[method]('');
         });
         assert.throw(function () {
            instance[method](0);
         });
         assert.throw(function () {
            instance[method]();
         });
      };

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

            adapterInstance = new JsonAdapter().forTable();
         });

         afterEach(function () {
            data = undefined;
            adapterInstance = undefined;
         });

         describe('.getEmpty()', function () {
            it('should return empty data', function () {
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
                  adapterInstance.getCount(data)
               );
               assert.strictEqual(
                  0,
                  adapterInstance.getCount([])
               );
               assert.strictEqual(
                  0,
                  adapterInstance.getCount({})
               );
               assert.strictEqual(
                  0,
                  adapterInstance.getCount('')
               );
               assert.strictEqual(
                  0,
                  adapterInstance.getCount(0)
               );
               assert.strictEqual(
                  0,
                  adapterInstance.getCount()
               );
            });
         });

         describe('.add()', function () {
            it('should append a record', function () {
               adapterInstance.add(data, {
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
               adapterInstance.add(data, {
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
               adapterInstance.add(data, {
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
                  adapterInstance.add(data, {
                     'Ид': 33
                  }, 100);
               });
               assert.throw(function () {
                  adapterInstance.add(data, {
                     'Ид': 34
                  }, -1);
               });
            });

            it('should throw an error on invalid data', function () {
               checkInvalid(adapterInstance, 'add');
            });
         });

         describe('.at()', function () {
            it('should return valid record', function () {
               assert.strictEqual(
                  1,
                  adapterInstance.at(data, 0)['Ид']
               );
               assert.strictEqual(
                  3,
                  adapterInstance.at(data, 2)['Ид']
               );
            });

            it('should return undefined on invalid position', function () {
               assert.isUndefined(
                  adapterInstance.at(data, -1)
               );
               assert.isUndefined(
                  adapterInstance.at(data, 99)
               );
            });

            it('should return undefined on invalid data', function () {
               assert.isUndefined(
                  adapterInstance.at({})
               );
               assert.isUndefined(
                  adapterInstance.at('')
               );
               assert.isUndefined(
                  adapterInstance.at(0)
               );
               assert.isUndefined(
                  adapterInstance.at()
               );
            });
         });

         describe('.remove()', function () {
            it('should remove the record', function () {
               adapterInstance.remove(data, 0);
               assert.strictEqual(
                  2,
                  data[0]['Ид']
               );

               adapterInstance.remove(data, 2);
               assert.strictEqual(
                  5,
                  data[2]['Ид']
               );

               adapterInstance.remove(data, 5);
               assert.isUndefined(
                  data[5]
               );
            });

            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapterInstance.remove(data, -1);
               });
               assert.throw(function () {
                  adapterInstance.remove(data, 99);
               });
            });

            it('should throw an error on invalid data', function () {
               checkInvalid(adapterInstance, 'remove');
            });
         });

         describe('.replace()', function () {
            it('should replace the record', function () {
               adapterInstance.replace(data, {
                  'Ид': 11
               }, 0);
               assert.strictEqual(
                  11,
                  data[0]['Ид']
               );

               adapterInstance.replace(data, {
                  'Ид': 12
               }, 4);
               assert.strictEqual(
                  12,
                  data[4]['Ид']
               );

            });

            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapterInstance.replace(data, {}, -1);
               });
               assert.throw(function () {
                  adapterInstance.replace(data, {}, 99);
               });
            });

            it('should throw an error on invalid data', function () {
               checkInvalid(adapterInstance, 'replace');
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

            adapterInstance = new JsonAdapter().forRecord();
         });

         afterEach(function () {
            data = undefined;
            adapterInstance = undefined;
         });

         describe('.get()', function () {
            it('should return the property value', function () {
               assert.strictEqual(
                  1,
                  adapterInstance.get(data, 'Ид')
               );
               assert.strictEqual(
                  'Иванов',
                  adapterInstance.get(data, 'Фамилия')
               );
               assert.isUndefined(
                  adapterInstance.get(data, 'Должность')
               );
               assert.isUndefined(
                  adapterInstance.get({}, 'Должность')
               );
               assert.isUndefined(
                  adapterInstance.get(data)
               );
               assert.isUndefined(
                  adapterInstance.get('')
               );
               assert.isUndefined(
                  adapterInstance.get(0)
               );
               assert.isUndefined(
                  adapterInstance.get()
               );
            });
         });

         describe('.set()', function () {
            it('should set the property value', function () {
               adapterInstance.set(data, 'Ид', 20);
               assert.strictEqual(
                  20,
                  data['Ид']
               );

               adapterInstance.set(data, 'а', 5);
               assert.strictEqual(
                  5,
                  data['а']
               );

               adapterInstance.set(data, 'б');
               assert.isUndefined(
                  data['б']
               );
            });

            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapterInstance.replace(data, {}, -1);
               });
               assert.throw(function () {
                  adapterInstance.replace(data, {}, 99);
               });
            });

            it('should throw an error on invalid data', function () {
               assert.throw(function () {
                  adapterInstance.set('');
               });
               assert.throw(function () {
                  adapterInstance.set(0);
               });
               assert.throw(function () {
                  adapterInstance.set();
               });
            });
         });

         describe('.destroy()', function(){
            it('should destroy without error', function() {
               var adapterDestroyInstance = new JsonAdapter();
               adapterDestroyInstance.destroy();
            });
         });
      });
   }
);
