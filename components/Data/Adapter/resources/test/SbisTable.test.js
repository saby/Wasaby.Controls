/* global define, beforeEach, afterEach, describe, context, it, assert */
define([
      'js!SBIS3.CONTROLS.Data.Adapter.SbisTable'
   ], function (SbisTable) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Adapter.SbisTable', function () {
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

            adapterInstance = new SbisTable(data);
         });

         afterEach(function () {
            data = undefined;
            adapterInstance = undefined;
         });

         describe('.getEmpty()', function () {
            it('should return empty data', function () {
               assert.strictEqual(
                  0,
                  new SbisTable().getEmpty().d.length
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
                  new SbisTable([]).getCount()
               );
               assert.strictEqual(
                  0,
                  new SbisTable({}).getCount()
               );
               assert.strictEqual(
                  0,
                  new SbisTable('').getCount()
               );
               assert.strictEqual(
                  0,
                  new SbisTable(0).getCount()
               );
               assert.strictEqual(
                  0,
                  new SbisTable().getCount()
               );
            });
         });

         describe('.add()', function () {
            it('should append a record', function () {
               adapterInstance.add({d: [30, 'Огурцов']});
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
               adapterInstance.add({d: [40, 'Перцов']}, 0);
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
               adapterInstance.add({d: [50, 'Горохов']}, 2);
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
                  adapterInstance.add({d: [30, 'aaa']}, 100);
               });
               assert.throw(function () {
                  adapterInstance.add({d: [30, 'aaa']}, -1);
               });
            });
         });

         describe('.at()', function () {
            it('should return valid record', function () {
               assert.strictEqual(
                  1,
                  adapterInstance.at(0).d[0]
               );
               assert.strictEqual(
                  3,
                  adapterInstance.at(2).d[0]
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
                  new SbisTable({}).at()
               );
               assert.isUndefined(
                  new SbisTable('').at()
               );
               assert.isUndefined(
                  new SbisTable(0).at()
               );
               assert.isUndefined(
                  new SbisTable().at()
               );
            });
         });

         describe('.remove()', function () {
            it('should remove the record', function () {
               adapterInstance.remove(0);
               assert.strictEqual(
                  2,
                  data.d[0][0]
               );

               adapterInstance.remove(2);
               assert.strictEqual(
                  5,
                  data.d[2][0]
               );

               adapterInstance.remove(4);
               assert.isUndefined(
                  data.d[4]
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

         describe('.merge()', function () {
            it('should merge two records', function () {
               adapterInstance.merge(0, 1, 'Ид');
               assert.strictEqual(
                  'Петров',
                  data.d[0][1]
               );
            });
         });

         describe('.copy()', function () {
            it('should merge two records', function () {
               adapterInstance.copy(0);
               assert.strictEqual(
                  'Иванов',
                  data.d[1][1]
               );
            });
         });

         describe('.replace()', function () {
            it('should replace the record', function () {
               adapterInstance.replace({d: [11]}, 0);
               assert.strictEqual(
                  11,
                  data.d[0][0]
               );

               adapterInstance.replace({d: [12]}, 4);
               assert.strictEqual(
                  12,
                  data.d[4][0]
               );

            });

            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapterInstance.replace({d: [13]}, -1);
               });
               assert.throw(function () {
                  adapterInstance.replace({d: [14]}, 99);
               });
            });
         });

         describe('.move()', function () {
            it('should move Иванов instead Сидоров', function () {
               adapterInstance.move(0, 2);
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
               adapterInstance.move(2, 0);
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
               adapterInstance.move(1, 6);
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
   }
);
