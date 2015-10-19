/* global define, beforeEach, afterEach, describe, context, it, assert */
define(
   ['js!SBIS3.CONTROLS.Data.Adapter.Sbis'],
   function (SbisAdapter) {
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

      describe('SBIS3.CONTROLS.Data.Adapter.Sbis', function () {
         describe('.serialize()', function () {
            it('should create identical structure', function () {
               var checkStruct = function(given, expect) {
                     var valid = true;
                     if (typeof expect === 'object') {
                        $ws.helpers.forEach(expect, function(val, key) {
                           checkStruct(val, given[key]);
                        });
                     } else if (expect !== given) {
                        throw new Error(given + ' expect to be ' + expect);
                     }
                  };

               assert.doesNotThrow(function() {
                  var adapter = new SbisAdapter();
                  checkStruct(
                     adapter.serialize({
                        'Фильтр': {
                           'ВызовИзБраузера': true,
                           'Количество': 1,
                           'Вес': 2.5,
                           'Тип':'Пустой',
                           'Дата':new Date('2015-10-10')
                        },
                        'ИмяМетода': null
                     }),
                     {
                        'Фильтр': {
                           d: [
                              true,1,2.5,'Пустой','2015-10-10'
                           ],
                           s: [{
                              n: 'ВызовИзБраузера',
                              t: 'Логическое'
                           },{
                              n: 'Количество',
                              t: 'Число целое'
                           },{
                              n: 'Вес',
                              t: 'Число вещественное'
                           },{
                              n: 'Тип',
                              t: 'Строка'
                           },{
                              n: 'Дата',
                              t: 'Дата и время'
                           }]
                        },
                        'ИмяМетода': null
                     }
                  );
               });
            });
         });
      });

      describe('SBIS3.CONTROLS.Data.Adapter.Sbis::forTable()', function () {
         var data,
            adapterInstance;

         beforeEach(function () {
            data = {
               d: [
                  [1, 'Иванов'],
                  [2, 'Петров'],
                  [3, 'Сидоров'],
                  [4, 'Пухов'],
                  [5, 'Молодцов'],
                  [6, 'Годолцов'],
                  [7, 'Арбузнов']
               ],
               s: [
                  {'n': 'Ид', 't': 'Число целое'},
                  {'n': 'Фамилия', 't': 'Строка'}
               ]
            };

            adapterInstance = new SbisAdapter().forTable();
         });

         afterEach(function () {
            data = undefined;
            adapterInstance = undefined;
         });

         describe('.getEmpty()', function () {
            it('should return empty data', function () {
               assert.strictEqual(
                  0,
                  adapterInstance.getEmpty().d.length
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
               adapterInstance.add(data, {d: [30, 'Огурцов']});
               assert.strictEqual(
                  8,
                  data.d.length
               );
               assert.strictEqual(
                  30,
                  data.d[data.d.length - 1][0]
               );
               assert.strictEqual(
                  'Огурцов',
                  data.d[data.d.length - 1][1]
               );
            });

            it('should prepend a record', function () {
               adapterInstance.add(data, {d: [40, 'Перцов']}, 0);
               assert.strictEqual(
                  8,
                  data.d.length
               );
               assert.strictEqual(
                  40,
                  data.d[0][0]
               );
               assert.strictEqual(
                  'Перцов',
                  data.d[0][1]
               );
            });

            it('should insert a record', function () {
               adapterInstance.add(data, {d: [50, 'Горохов']}, 2);
               assert.strictEqual(
                  8,
                  data.d.length
               );
               assert.strictEqual(
                  50,
                  data.d[2][0]
               );
               assert.strictEqual(
                  'Горохов',
                  data.d[2][1]
               );
            });

            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapterInstance.add(data, {d: [30, 'aaa']}, 100);
               });
               assert.throw(function () {
                  adapterInstance.add(data, {d: [30, 'aaa']}, -1);
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
                  adapterInstance.at(data, 0).d[0]
               );
               assert.strictEqual(
                  3,
                  adapterInstance.at(data, 2).d[0]
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
                  data.d[0][0]
               );

               adapterInstance.remove(data, 2);
               assert.strictEqual(
                  5,
                  data.d[2][0]
               );

               adapterInstance.remove(data, 5);
               assert.isUndefined(
                  data.d[5]
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
               adapterInstance.replace(data, {d: [11]}, 0);
               assert.strictEqual(
                  11,
                  data.d[0][0]
               );

               adapterInstance.replace(data, {d: [12]}, 4);
               assert.strictEqual(
                  12,
                  data.d[4][0]
               );

            });

            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapterInstance.replace(data, {d: [13]}, -1);
               });
               assert.throw(function () {
                  adapterInstance.replace(data, {d: [14]}, 99);
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
                     d: data.d,
                     s: data.s,
                     n: 456
                  }, 'n')
               );
               assert.strictEqual(
                  789,
                  adapterInstance.getProperty({
                     employees: {
                        d: data.d,
                        s: data.s,
                        n: 789
                     }
                  }, 'employees.n')
               );
               assert.isUndefined(
                  adapterInstance.getProperty(data, 'total')
               );
               assert.isUndefined(
                  adapterInstance.getProperty(data)
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

      describe('SBIS3.CONTROLS.Data.Adapter.Sbis::forRecord()', function () {
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

            adapterInstance = new SbisAdapter().forRecord();
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
                  data.d[0]
               );
            });

            it('should throw an error on undefined property', function () {
               assert.throw(function () {
                  adapterInstance.set(data, 'а', 5);
               });
               assert.throw(function () {
                  adapterInstance.set(data, 'б');
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
      });
   }
);
