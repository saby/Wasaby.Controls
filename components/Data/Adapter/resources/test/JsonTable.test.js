/* global define, beforeEach, afterEach, describe, context, it, assert */
define(
   ['js!SBIS3.CONTROLS.Data.Adapter.JsonTable'],
   function (JsonTable) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Adapter.JsonTable', function () {
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

            adapterInstance = new JsonTable(data);
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
                  new JsonTable().getCount([])
               );
               assert.strictEqual(
                  0,
                  new JsonTable().getCount({})
               );
               assert.strictEqual(
                  0,
                  new JsonTable().getCount('')
               );
               assert.strictEqual(
                  0,
                  new JsonTable().getCount(0)
               );
               assert.strictEqual(
                  0,
                  new JsonTable().getCount()
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
                  new JsonTable({}).at()
               );
               assert.isUndefined(
                  new JsonTable('').at()
               );
               assert.isUndefined(
                  new JsonTable(0).at()
               );
               assert.isUndefined(
                  new JsonTable().at()
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
   }
);
