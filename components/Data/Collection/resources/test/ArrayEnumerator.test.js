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

         describe('constructor()', function() {
            it('should throw an error on invalid argument', function() {
               assert.throw(function() {
                  var enumerator = new ArrayEnumerator({});
               });
               assert.throw(function() {
                  var enumerator = new ArrayEnumerator('');
               });
               assert.throw(function() {
                  var enumerator = new ArrayEnumerator(0);
               });
               assert.throw(function() {
                  var enumerator = new ArrayEnumerator(null);
               });
            });
         });

         describe('.getCurrent()', function() {
            it('should return undefined by default', function() {
               var enumerator = new ArrayEnumerator();
               assert.isUndefined(enumerator.getCurrent());
            });
            it('should return item by item', function() {
               var enumerator = new ArrayEnumerator(items),
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
               var enumerator = new ArrayEnumerator(items),
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
               var enumerator = new ArrayEnumerator(items);
               enumerator.getNext();
               assert.isDefined(enumerator.getCurrent());
               enumerator.reset();
               assert.isUndefined(enumerator.getCurrent());
            });

            it('should start enumeration from beginning', function() {
               var enumerator = new ArrayEnumerator(items),
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
               var enumerator = new ArrayEnumerator(items);
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
               var enumerator = new ArrayEnumerator(items);
               assert.strictEqual(
                  -1,
                  enumerator.getIndexByValue('Ид', 0)
               );
            });
            it('should return -1 for not a property name', function() {
               var enumerator = new ArrayEnumerator(items);
               assert.strictEqual(-1, enumerator.getIndexByValue());
               assert.strictEqual(-1, enumerator.getIndexByValue(null));
               assert.strictEqual(-1, enumerator.getIndexByValue(false));
               assert.strictEqual(-1, enumerator.getIndexByValue(0));
               assert.strictEqual(-1, enumerator.getIndexByValue(''));
            });
            it('should work fine with names from Object.prototype', function() {
               var items = [{
                     'constructor': 'a'
                  }, {
                     'hasOwnProperty': 1
                  }, {
                     'toString': false
                  }, {
                     'isPrototypeOf': null
                  }],
                  enumerator = new ArrayEnumerator(items);
               for (var i = 0; i < items.length; i++) {
                  for (var k in items[i]) {
                     if (Object.prototype.hasOwnProperty.call(items[i], k)) {
                        assert.strictEqual(
                           i,
                           enumerator.getIndexByValue(k, items[i][k])
                        );
                     }
                  }
               }
            });
            it('should work fine with values from Object.prototype', function() {
               var items = [{
                     id: 'constructor'
                  }, {
                     id: 'hasOwnProperty'
                  }, {
                     id: 'toString'
                  }, {
                     id: 'isPrototypeOf'
                  }],
                  enumerator = new ArrayEnumerator(items);
               for (var i = 0; i < items.length; i++) {
                  assert.strictEqual(
                     i,
                     enumerator.getIndexByValue('id', items[i].id)
                  );
               }
            });
         });

         describe('.getIndicesByValue()', function() {
            it('should return items indexes with given property', function() {
               var enumerator = new ArrayEnumerator(items);
               assert.deepEqual(
                  [0],
                  enumerator.getIndicesByValue('Ид', 1)
               );
               assert.deepEqual(
                  [0, 1, 3],
                  enumerator.getIndicesByValue('Пол', 'м')
               );
               assert.deepEqual(
                  [2],
                  enumerator.getIndicesByValue('Пол', 'ж')
               );
            });
            it('should return no indexes with not exists property', function() {
               var enumerator = new ArrayEnumerator(items);
               assert.strictEqual(
                  0,
                  enumerator.getIndicesByValue('Ид', 0).length
               );
            });
         });
      });
   }
);
