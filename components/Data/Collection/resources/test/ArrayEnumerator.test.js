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
               'Фамилия': 'Иванов'
            }, {
               'Ид': 2,
               'Фамилия': 'Петров'
            }, {
               'Ид': 3,
               'Фамилия': 'Сидоров'
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
      });
   }
);
