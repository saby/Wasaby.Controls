/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator'
], function (ArrayEnumerator) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Collection.ArrayEnumerator', function() {
         var items;

         beforeEach(function() {
            items = [{
               'Ид': 1,
               'Фамилия': 'Иванов',
               'Пол': 'м'
            }, {
               'Ид': 2,
               'Фамилия': 'Петров',
               'Пол': 'м'
            }, {
               'Ид': 4,
               'Фамилия': 'Иванова',
               'Пол': 'ж'
            }, {
               'Ид': 3,
               'Фамилия': 'Сидоров',
               'Пол': 'м'
            }];
         });

         afterEach(function() {
            items = undefined;
         });

         describe('$constructor()', function() {
            it('should throw an error on invalid argument', function() {
               assert.throw(function() {
                  var enumerator = new ArrayEnumerator({
                     items: {}
                  });
               });
               assert.throw(function() {
                  var enumerator = new ArrayEnumerator({
                     items: ''
                  });
               });
               assert.throw(function() {
                  var enumerator = new ArrayEnumerator({
                     items: 0
                  });
               });
               assert.throw(function() {
                  var enumerator = new ArrayEnumerator({
                     items: undefined
                  });
               });
            });
         });

         describe('.getCurrent()', function() {
            it('should return undefined by default', function() {
               var enumerator = new ArrayEnumerator();
               assert.isUndefined(enumerator.getCurrent());
            });
            it('should return item by item', function() {
               var enumerator = new ArrayEnumerator({
                     items: items
                  }),
                  index = -1;
               while (enumerator.getNext()) {
                  index++;
                  assert.strictEqual(items[index], enumerator.getCurrent());
               }
               assert.strictEqual(items[items.length - 1], enumerator.getCurrent());
            });
         });

         describe('.getNext()', function() {
            it('should return undefined for empty list', function() {
               var enumerator = new ArrayEnumerator();
               assert.isUndefined(enumerator.getNext());
            });
            it('should return item by item', function() {
               var enumerator = new ArrayEnumerator({
                     items: items
                  }),
                  index = -1,
                  item = enumerator.getNext();
               while (item) {
                  index++;
                  assert.strictEqual(items[index], item);
                  item = enumerator.getNext();
               }
               assert.isUndefined(enumerator.getNext());
            });
         });

         describe('.reset()', function() {
            it('should set current to undefined', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               enumerator.getNext();
               assert.isDefined(enumerator.getCurrent());
               enumerator.reset();
               assert.isUndefined(enumerator.getCurrent());
            });

            it('should start enumeration from beginning', function() {
               var enumerator = new ArrayEnumerator({
                     items: items
                  }),
                  item,
                  index;

               var firstOne = enumerator.getNext();
               enumerator.getNext();
               enumerator.reset();
               assert.strictEqual(firstOne, enumerator.getNext());

               enumerator.reset();
               index = -1;
               item = enumerator.getNext();
               while (item) {
                  index++;
                  assert.strictEqual(items[index], item);
                  item = enumerator.getNext();
               }

               enumerator.reset();
               index = -1;
               while (enumerator.getNext()) {
                  index++;
                  assert.strictEqual(items[index], enumerator.getCurrent());
               }
            });
         });

         describe('.getIndexByValue()', function() {
            it('should return item index with given property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               for (var i = 0; i < items.length; i++) {
                  assert.strictEqual(
                     i,
                     enumerator.getIndexByValue('Ид', items[i]['Ид'])
                  );
                  assert.strictEqual(
                     i,
                     enumerator.getIndexByValue('Фамилия', items[i]['Фамилия'])
                  );
               }
            });
            it('should return -1 with not exists property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               assert.strictEqual(
                  -1,
                  enumerator.getIndexByValue('Ид', 0)
               );
            });
         });

         describe('.getIndiciesByValue()', function() {
            it('should return items indexes with given property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               assert.deepEqual(
                  [0],
                  enumerator.getIndiciesByValue('Ид', 1)
               );
               assert.deepEqual(
                  [0, 1, 3],
                  enumerator.getIndiciesByValue('Пол', 'м')
               );
               assert.deepEqual(
                  [2],
                  enumerator.getIndiciesByValue('Пол', 'ж')
               );
            });
            it('should return no indexes with not exists property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               assert.strictEqual(
                  0,
                  enumerator.getIndiciesByValue('Ид', 0).length
               );
            });
         });
      });
   }
);
