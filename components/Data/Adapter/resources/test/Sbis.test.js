/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Record',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet'
], function (SbisAdapter, Model, Record, RecordSet) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Adapter.Sbis', function () {
         var data,
            adapter;

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

            adapter = new SbisAdapter();
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
                     'SBIS3.CONTROLS.Data.Adapter.SbisTable'
                  )
               );
            });
            it('should pass data to the table adapter', function () {
               var data = {d: [], s: []};
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
                     'SBIS3.CONTROLS.Data.Adapter.SbisRecord'
                  )
               );
            });
            it('should pass data to the record adapter', function () {
               var data = {d: [], s: []};
               assert.strictEqual(
                  adapter.forRecord(data).getData(),
                  data
               );
            });
         });

         describe('.getKeyField()', function () {
            it('should return first field prefixed with "@"', function () {
               var data = {
                  d: [
                  ],
                  s: [
                     {'n': 'Ид', 't': 'Число целое'},
                     {'n': '@Фамилия', 't': 'Строка'}
                  ]
               };
               assert.equal(adapter.getKeyField(data), '@Фамилия');
            });
            it('should return first field', function () {
               assert.equal(adapter.getKeyField(data), 'Ид');
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
                     d: data.d,
                     s: data.s,
                     n: 456
                  }, 'n')
               );
               assert.strictEqual(
                  789,
                  adapter.getProperty({
                     employees: {
                        d: data.d,
                        s: data.s,
                        n: 789
                     }
                  }, 'employees.n')
               );
               assert.isUndefined(
                  adapter.getProperty(data, 'total')
               );
               assert.isUndefined(
                  adapter.getProperty(data)
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
               adapter.setProperty(data, 'n', 456);
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
               adapter.setProperty(moreData, 'employees.total', 987);
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

               adapter.setProperty(data, 'c.d.e.f', 'g');
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
            it('should traverse an arbitrary object', function () {
               var rec = new Record({
                     adapter: 'adapter.sbis',
                     rawData: {
                        d: [
                           true,
                           1,
                           2.5,
                           'Пустой',
                           new Date('2015-10-10')
                        ],
                        s: [
                           {n: 'ВызовИзБраузера', t: 'Логическое'},
                           {n: 'Количество', t: 'Число целое'},
                           {n: 'Вес', t: 'Число вещественное'},
                           {n: 'Тип', t: 'Строка'},
                           {n: 'Дата', t: 'Дата и время'}
                        ]
                     }
                  }),
                  result = adapter.serialize({
                     'null': null,
                     'false': false,
                     'true': true,
                     '0': 0,
                     '10': 10,
                     'string': 'String',
                     'date': new Date('2015-12-03'),
                     'array': [
                        false,
                        true,
                        0,
                        1,
                        'S',
                        new Date('2001-09-11'),
                        [],
                        {}
                     ],
                     'emptyArray': [],
                     'object': {
                        a: false,
                        b: true,
                        c: 0,
                        d: 1,
                        e: 'S',
                        f: new Date('2001-09-11'),
                        g: [],
                        h: {}
                     },
                     'emptyObject': {},
                     'record': rec
                  }),
                  expect = {
                     'null': null,
                     'false': false,
                     'true': true,
                     '0': 0,
                     '10': 10,
                     'string': 'String',
                     'date': '2015-12-03',
                     'array': [
                        false,
                        true,
                        0,
                        1,
                        'S',
                        '2001-09-11',
                        [],
                        {}
                     ],
                     'emptyArray': [],
                     'object': {
                        a: false,
                        b: true,
                        c: 0,
                        d: 1,
                        e: 'S',
                        f: '2001-09-11',
                        g: [],
                        h: {}
                     },
                     'emptyObject': {},
                     'record': rec.getRawData()
                  },
                  key;

               for (key in expect) {
                  if (expect.hasOwnProperty(key)) {
                     assert.deepEqual(result[key], expect[key], 'Wrong ' + key);
                  }
               }
            });

            it('should serialize model', function () {
               var model = new Model({
                     rawData: {
                        some: {deep: {object: 'here'}}
                     }
                  }),
                  result = adapter.serialize(model),
                  expect = model.getRawData();
               assert.deepEqual(result, expect);
            });

            it('should serialize RecordSet', function () {
               var ds = new RecordSet({
                     adapter: adapter,
                     rawData: {
                        d: [], s: []
                     }
                  }),
                  result = adapter.serialize(ds),
                  expect = ds.getRawData();
               assert.deepEqual(result, expect);
            });
         });
      });
   }
);
