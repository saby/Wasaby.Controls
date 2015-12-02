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
                  item;
               while (item = enumerator.getNext()) {
                  index++;
                  assert.strictEqual(items[index], item);
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
               while (item = enumerator.getNext()) {
                  index++;
                  assert.strictEqual(items[index], item);
               }

               enumerator.reset();
               index = -1;
               while (enumerator.getNext()) {
                  index++;
                  assert.strictEqual(items[index], enumerator.getCurrent());
               }
            });
         });

         describe('.getItemByPropertyValue()', function() {
            it('should return item with given property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               for (var i = 0; i < items.length; i++) {
                  assert.strictEqual(
                     items[i],
                     enumerator.getItemByPropertyValue('Ид', items[i]['Ид'])
                  );
                  assert.strictEqual(
                     items[i],
                     enumerator.getItemByPropertyValue('Фамилия', items[i]['Фамилия'])
                  );
               }
            });
            it('should return undefined with not exists property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               assert.strictEqual(
                  undefined,
                  enumerator.getItemByPropertyValue('Ид', 0)
               );
            });
         });

         describe('.getItemsByPropertyValue()', function() {
            it('should return items with given property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               assert.deepEqual(
                  [items[0]],
                  enumerator.getItemsByPropertyValue('Ид', 1)
               );
               assert.deepEqual(
                  [items[0], items[1], items[3]],
                  enumerator.getItemsByPropertyValue('Пол', 'м')
               );
               assert.deepEqual(
                  [items[2]],
                  enumerator.getItemsByPropertyValue('Пол', 'ж')
               );
            });
            it('should return no items with not exists property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               assert.strictEqual(
                  0,
                  enumerator.getItemsByPropertyValue('Ид', 0).length
               );
            });
         });

         describe('.getItemIndexByPropertyValue()', function() {
            it('should return item index with given property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               for (var i = 0; i < items.length; i++) {
                  assert.strictEqual(
                     i,
                     enumerator.getItemIndexByPropertyValue('Ид', items[i]['Ид'])
                  );
                  assert.strictEqual(
                     i,
                     enumerator.getItemIndexByPropertyValue('Фамилия', items[i]['Фамилия'])
                  );
               }
            });
            it('should return -1 with not exists property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               assert.strictEqual(
                  -1,
                  enumerator.getItemIndexByPropertyValue('Ид', 0)
               );
            });
         });

         describe('.getItemsIndexByPropertyValue()', function() {
            it('should return items indexes with given property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               assert.deepEqual(
                  [0],
                  enumerator.getItemsIndexByPropertyValue('Ид', 1)
               );
               assert.deepEqual(
                  [0, 1, 3],
                  enumerator.getItemsIndexByPropertyValue('Пол', 'м')
               );
               assert.deepEqual(
                  [2],
                  enumerator.getItemsIndexByPropertyValue('Пол', 'ж')
               );
            });
            it('should return no indexes with not exists property', function() {
               var enumerator = new ArrayEnumerator({
                  items: items
               });
               assert.strictEqual(
                  0,
                  enumerator.getItemsIndexByPropertyValue('Ид', 0).length
               );
            });
         });
      });
   }
);
