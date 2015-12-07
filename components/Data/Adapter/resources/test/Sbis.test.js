/* global define, beforeEach, afterEach, describe, context, it, assert */
define([
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Source.DataSet'
], function (SbisAdapter, Model, DataSet) {
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

            adapterInstance = new SbisAdapter();
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


         describe('.setProperty()', function () {
            it('should set the property value', function () {
               adapterInstance.setProperty(data, 'n', 456);
               assert.strictEqual(
                  456,
                  data.n
               );
               assert.strictEqual(
                  1,
                  data.d[0][0]
               );
               assert.strictEqual(
                  5,
                  data.d[4][0]
               );
               assert.strictEqual(
                  'Годолцов',
                  data.d[5][1]
               );

               var moreData = {
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
                  moreData.employees.items.d[0][0]
               );
               assert.strictEqual(
                  5,
                  moreData.employees.items.d[4][0]
               );
               assert.strictEqual(
                  'Годолцов',
                  moreData.employees.items.d[5][1]
               );

               adapterInstance.setProperty(data, 'c.d.e.f', 'g');
               assert.strictEqual(
                  'g',
                  data.c.d.e.f
               );
               assert.strictEqual(
                  1,
                  moreData.employees.items.d[0][0]
               );
               assert.strictEqual(
                  5,
                  moreData.employees.items.d[4][0]
               );
               assert.strictEqual(
                  'Годолцов',
                  moreData.employees.items.d[5][1]
               );
            });
         });

         describe('.serialize()', function () {
            it('should create valid deep structure', function () {
               var adapter = new SbisAdapter(),
                  result = adapter.serialize({
                     'null': null,
                     'false': false,
                     'true': true,
                     '0': 0,
                     '10': 10,
                     'Строка': 'String',
                     'Date': new Date('2015-12-03'),
                     'Массив': [false, true, 0, 1, 'S', new Date('2001-09-11'), [], {}],
                     'EmptyObject': {},
                     'Запись': {
                        'ВызовИзБраузера': true,
                        'Количество': 1,
                        'Вес': 2.5,
                        'Тип': 'Пустой',
                        'Дата': new Date('2015-10-10')
                     }
                  }),
                  expect = {
                     'null': null,
                     'false': false,
                     'true': true,
                     '0': 0,
                     '10': 10,
                     'Строка': 'String',
                     'Date': '2015-12-03',
                     'Массив': [false, true, 0, 1, 'S', '2001-09-11', [], {d: [], s: []}],
                     'EmptyObject': {
                        d: [],
                        s: []
                     },
                     'Запись': {
                        d: [
                           true,
                           1,
                           2.5,
                           'Пустой',
                           '2015-10-10'
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
                     }
                  };
               assert.deepEqual(result['null'], expect['null'], 'wrong null');
               assert.deepEqual(result['false'], expect['false'], 'wrong false');
               assert.deepEqual(result['true'], expect['true'], 'wrong true');
               assert.deepEqual(result['0'], expect['0'], 'wrong 0');
               assert.deepEqual(result['10'], expect['10'], 'wrong 10');
               assert.deepEqual(result['Строка'], expect['Строка'], 'wrong Строка');
               assert.deepEqual(result['Массив'], expect['Массив'], 'wrong Массив');
               assert.deepEqual(result['EmptyObject'], expect['EmptyObject'], 'wrong EmptyObject');
               assert.deepEqual(result['Запись'], expect['Запись'], 'wrong Запись');
            });

            it('should serialize model', function () {
               var adapter = new SbisAdapter(),
                  model = new Model({
                     rawData: {
                        some: {deep: {object: 'here'}}
                     }
                  }),
                  result = adapter.serialize(model),
                  expect = model.getRawData();
               expect._type = 'record';
               assert.deepEqual(result, expect);
            });

            it('should serialize dataset', function () {
               var adapter = new SbisAdapter(),
                  ds = new DataSet({
                     adapter: adapter,
                     rawData: {
                        d: [], s: []
                     }
                  }),
                  result = adapter.serialize(ds),
                  expect = ds.getRawData();
               expect._type = 'recordset';
               assert.deepEqual(result, expect);
            });

            it('should serialize models and datasets in deep structure', function () {
               var adapter = new SbisAdapter(),
                  model = new Model(),
                  ds = new DataSet(),
                  result = adapter.serialize({
                     some: {
                        model: model
                     },
                     and: {
                        also: ds
                     }
                  }),
                  expect = {
                     some: {
                        model: model.getRawData() || {}
                     },
                     and: {
                        also: ds.getRawData() || {}
                     }
                  };
               expect.some.model._type = 'record';
               expect.and.also._type = 'recordset';
               assert.deepEqual(result, expect);
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

         describe('.merge()', function () {
            it('should merge two records', function () {
               adapterInstance.merge(data, 0, 1, 'Ид');
               assert.strictEqual(
                  'Петров',
                  data.d[0][1]
               );
            });
         });

         describe('.copy()', function () {
            it('should merge two records', function () {
               adapterInstance.copy(data, 0);
               assert.strictEqual(
                  'Иванов',
                  data.d[1][1]
               );
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

         describe('.move()', function () {
            it('should move Иванов instead Сидоров', function () {
               adapterInstance.move(data, 0, 2);
               assert.strictEqual(
                  'Петров',
                  data.d[0][1]
               );
               assert.strictEqual(
                  'Сидоров',
                  data.d[1][1]
               );
               assert.strictEqual(
                  'Иванов',
                  data.d[2][1]
               );
            });
            it('should move Сидоров instead Иванов', function () {
               adapterInstance.move(data, 2, 0);
               assert.strictEqual(
                  'Сидоров',
                  data.d[0][1]
               );
               assert.strictEqual(
                  'Иванов',
                  data.d[1][1]
               );
               assert.strictEqual(
                  'Петров',
                  data.d[2][1]
               );
            });
            it('should move Петров to the end', function () {
               adapterInstance.move(data, 1, 6);
               assert.strictEqual(
                  'Петров',
                  data.d[6][1]
               );
               assert.strictEqual(
                  'Арбузнов',
                  data.d[5][1]
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
