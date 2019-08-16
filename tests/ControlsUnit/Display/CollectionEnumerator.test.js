/* global define, beforeEach, afterEach, describe, context, it, assert */
define([
   'Types/_display/CollectionEnumerator'
], function(
   DisplayEnumerator
) {
   'use strict';

   DisplayEnumerator = DisplayEnumerator.default;

   describe('Types/_display/CollectionEnumerator', function() {
      var items,
         filterMap,
         sortMap,
         enumerator;

      beforeEach(function() {
         items = [{
            index: 0
         }, {
            index: 1
         }, {
            index: 2
         }, {
            index: 3
         }, {
            index: 4
         }];

         filterMap = [true, true, true, true, true];

         sortMap = [0, 1, 2, 3, 4];

         enumerator = new DisplayEnumerator({
            items: items,
            filterMap: filterMap,
            sortMap: sortMap
         });
      });

      afterEach(function() {
         enumerator = undefined;
         items = undefined;
         filterMap = undefined;
         sortMap = undefined;
      });

      describe('constructor()', function() {
         it('should throw an error on invalid argument', function() {
            assert.throws(function() {
               new DisplayEnumerator({
                  items: {},
                  filterMap: {},
                  sortMap: {}
               });
            });
            assert.throws(function() {
               new DisplayEnumerator({
                  items: '',
                  filterMap: '',
                  sortMap: ''
               });
            });
            assert.throws(function() {
               new DisplayEnumerator({
                  items: 0,
                  filterMap: 1,
                  sortMap: 2
               });
            });
            assert.throws(function() {
               new DisplayEnumerator({
                  items: undefined,
                  filterMap: undefined,
                  sortMap: undefined
               });
            });
            assert.throws(function() {
               new DisplayEnumerator({
                  items: [],
                  filterMap: undefined,
                  sortMap: undefined
               });
            });
            assert.throws(function() {
               new DisplayEnumerator({
                  items: [],
                  filterMap: [],
                  sortMap: undefined
               });
            });
         });
      });

      describe('.getCurrent()', function() {
         it('should return undefined by default', function() {
            assert.isUndefined(enumerator.getCurrent());
         });

         it('should return item by item', function() {
            var index = -1;
            while (enumerator.moveNext()) {
               index++;
               assert.strictEqual(items[index], enumerator.getCurrent());
            }
            assert.strictEqual(items[items.length - 1], enumerator.getCurrent());
         });
      });

      describe('.setCurrent()', function() {
         it('should set the current item', function() {
            var i,
               item;
            for (i = 0; i < items.length; i++) {
               item = items[i];
               enumerator.setCurrent(item);
               assert.strictEqual(item, enumerator.getCurrent());
            }
         });

         it('should change the current position', function() {
            var i,
               item;
            for (i = 0; i < items.length; i++) {
               item = items[i];
               enumerator.setCurrent(item);
               assert.strictEqual(i, enumerator.getPosition());
            }
         });
      });

      describe('.moveNext()', function() {
         it('should return undefined for empty list', function() {
            var enumerator = new DisplayEnumerator();
            assert.isFalse(enumerator.moveNext());
            assert.isUndefined(enumerator.getCurrent());
         });

         it('should return item by item', function() {
            var index = -1,
               item;
            while (enumerator.moveNext()) {
               item = enumerator.getCurrent();
               index++;
               assert.strictEqual(items[index], item);
            }
            assert.isFalse(enumerator.moveNext());
         });

         it('should work fine with repeated elements', function() {
            var items = ['a', 'b', 'c', 'd', 'e'],
               sortMap = [0, 1, 2, 1, 3, 4, 2, 4, 0, 0, 4, 3],
               enumerator = new DisplayEnumerator({
                  items: items,
                  filterMap: [true, true, true, true, true],
                  sortMap: sortMap
               }),
               index = -1,
               item,
               itemIndex;
            while (enumerator.moveNext()) {
               item = enumerator.getCurrent();
               index++;
               itemIndex = sortMap[index];
               assert.strictEqual(items[itemIndex], item);
            }
            assert.strictEqual(index, sortMap.length - 1);
         });
      });

      describe('.getPrevious()', function() {
         it('should return undefined for empty list', function() {
            var enumerator = new DisplayEnumerator();
            assert.isFalse(enumerator.movePrevious());
            assert.isUndefined(enumerator.getCurrent());
         });

         it('should return item by item', function() {
            var index = items.length - 1,
               item;
            enumerator.setPosition(index);
            while (enumerator.movePrevious()) {
               item = enumerator.getCurrent();
               index--;
               assert.strictEqual(items[index], item);
            }
            assert.isFalse(enumerator.movePrevious());
         });
      });

      describe('.reset()', function() {
         it('should set current to undefined', function() {
            enumerator.moveNext();
            assert.isDefined(enumerator.getCurrent());
            enumerator.reset();
            assert.isUndefined(enumerator.getCurrent());
         });

         it('should start enumeration from beginning', function() {
            var index;

            enumerator.moveNext();
            var firstOne = enumerator.getCurrent();
            enumerator.moveNext();
            enumerator.reset();
            enumerator.moveNext();
            assert.strictEqual(firstOne, enumerator.getCurrent());

            enumerator.reset();
            index = -1;
            while (enumerator.moveNext()) {
               index++;
               assert.strictEqual(items[index], enumerator.getCurrent());
            }
         });
      });

      describe('.at()', function() {
         it('should return element at given position', function() {
            var index,
               itemIndex;
            for (index = 0; index < sortMap.length; index++) {
               itemIndex = sortMap[index];
               assert.strictEqual(items[itemIndex], enumerator.at(index));
            }
         });
      });

      describe('.getCount()', function() {
         it('should return value equal to items count', function() {
            assert.strictEqual(items.length, enumerator.getCount());
         });

         it('should return value equal to sort map count', function() {
            var items = ['a', 'b', 'c', 'd', 'e'],
               sortMap = [0, 1, 2, 1, 3, 4, 2, 4, 0, 0, 4, 3],
               filterMap = [true, true, true, true, true],
               enumerator = new DisplayEnumerator({
                  items: items,
                  filterMap: filterMap,
                  sortMap: sortMap
               });

            assert.strictEqual(sortMap.length, enumerator.getCount());
         });

         it('should return value equal to sort map count reduced by filter map', function() {
            var items = ['a', 'b', 'c', 'd', 'e'],
               sortMap = [0, 1, 2, 1, 3, 4, 2, 4, 0, 0, 4, 3],
               filterMap = [true, false, true, true, false],
               expectedCount = sortMap.reduce(function(prev, cur) {
                  var match = filterMap[cur];
                  return prev + (match ? 1 : 0);
               }, 0);
            enumerator = new DisplayEnumerator({
               items: items,
               filterMap: filterMap,
               sortMap: sortMap
            });

            assert.strictEqual(expectedCount, enumerator.getCount());
         });
      });

      describe('.getIndexByValue()', function() {
         it('should save the position unchanged', function() {
            var position = 1;
            enumerator.setPosition(position);
            enumerator.getIndexByValue('index', 999);
            assert.strictEqual(enumerator.getPosition(), position);
         });

         it('should save the current unchanged', function() {
            enumerator.setPosition(1);
            var current = enumerator.getCurrent();
            enumerator.getIndexByValue('index', 999);
            assert.strictEqual(enumerator.getCurrent(), current);
         });
      });

      describe('.getPosition()', function() {
         it('should return -1 by default', function() {
            assert.strictEqual(-1, enumerator.getPosition());
         });

         it('should change through navigation', function() {
            var index = -1;
            while (enumerator.moveNext()) {
               index++;
               assert.strictEqual(index, enumerator.getPosition());
            }
            assert.strictEqual(items.length - 1, enumerator.getPosition());

            while (enumerator.movePrevious()) {
               index--;
               assert.strictEqual(index, enumerator.getPosition());
            }
            assert.strictEqual(0, enumerator.getPosition());
         });
      });

      describe('.setPosition()', function() {
         it('should change the position', function() {
            enumerator.setPosition(0);
            assert.strictEqual(0, enumerator.getPosition());

            enumerator.setPosition(4);
            assert.strictEqual(4, enumerator.getPosition());

            enumerator.setPosition(-1);
            assert.strictEqual(-1, enumerator.getPosition());
         });

         it('should change the current item', function() {
            for (var i = 0; i < items.length; i++) {
               enumerator.setPosition(i);
               assert.strictEqual(items[i], enumerator.getCurrent());
            }
         });

         it('should throw an error on invalid index', function() {
            assert.throws(function() {
               enumerator.setPosition(-2);
            });
            assert.throws(function() {
               enumerator.setPosition(items.length);
            });
         });
      });

      describe('.reIndex()', function() {
         var sortReverse = [4, 3, 2, 1, 0],
            tests = [{

               //0
               'goto': -1,
               hide: [],
               sort: [],
               remove: [0],
               expect: {
                  position: -1,
                  current: false,
                  next: 1,
                  previous: -1,
                  posToOriginal: {
                     0: 1,
                     1: 2
                  }
               }
            }, {

               //1
               'goto': 0,
               hide: [],
               sort: [],
               remove: [0],
               expect: {
                  position: -1,
                  current: false,
                  next: 1,
                  previous: -1
               }
            }, {

               //2
               'goto': 1,
               hide: [],
               sort: [],
               remove: [0],
               expect: {
                  position: 0,
                  current: true,
                  next: 2,
                  previous: -1
               }
            }, {

               //3
               'goto': 4,
               hide: [],
               sort: [],
               remove: [3],
               expect: {
                  position: 3,
                  current: true,
                  next: -1,
                  previous: 2,
                  posToOriginal: {
                     2: 2,
                     3: 4
                  }
               }
            }, {

               //4
               'goto': 1,
               hide: [],
               sort: [],
               remove: [2],
               expect: {
                  position: 1,
                  current: true,
                  next: 3,
                  previous: 0,
                  posToOriginal: {
                     0: 0,
                     1: 1,
                     2: 3
                  }
               }
            }, {

               //5
               'goto': -1,
               hide: [0],
               sort: [],
               remove: [],
               expect: {
                  position: -1,
                  current: false,
                  next: 1,
                  previous: -1,
                  posToOriginal: {
                     0: 1,
                     1: 2
                  }
               }
            }, {

               //6
               'goto': 0,
               hide: [0],
               sort: [],
               remove: [],
               expect: {
                  position: -1,
                  current: false,
                  next: 1,
                  previous: -1
               }
            }, {

               //7
               'goto': 1,
               hide: [0],
               sort: [],
               remove: [],
               expect: {
                  position: 0,
                  current: true,
                  next: 2,
                  previous: -1
               }
            }, {

               //8
               'goto': 4,
               hide: [3],
               sort: [],
               remove: [],
               expect: {
                  position: 3,
                  current: true,
                  next: -1,
                  previous: 2,
                  posToOriginal: {
                     2: 2,
                     3: 4
                  }
               }
            }, {

               //9
               'goto': 1,
               hide: [2],
               sort: [],
               remove: [],
               expect: {
                  position: 1,
                  current: true,
                  next: 3,
                  previous: 0,
                  posToOriginal: {
                     0: 0,
                     1: 1,
                     2: 3
                  }
               }
            }, {

               //10
               'goto': -1,
               hide: [1],
               sort: [],
               remove: [0],
               expect: {
                  position: -1,
                  current: false,
                  next: 2,
                  previous: -1,
                  posToOriginal: {
                     0: 2,
                     1: 3
                  }
               }
            }, {

               //11
               'goto': 0,
               hide: [1],
               sort: [],
               remove: [0],
               expect: {
                  position: -1,
                  current: false,
                  next: 2,
                  previous: -1
               }
            }, {

               //12
               'goto': 1,
               hide: [1],
               sort: [],
               remove: [0],
               expect: {
                  position: -1,
                  current: false,
                  next: 2,
                  previous: -1
               }
            }, {

               //13
               'goto': 2,
               hide: [1],
               sort: [],
               remove: [0],
               expect: {
                  position: 0,
                  current: true,
                  next: 3,
                  previous: -1
               }
            }, {

               //14
               'goto': 1,
               hide: [2],
               sort: [],
               remove: [0],
               expect: {
                  position: 0,
                  current: true,
                  next: 3,
                  previous: -1,
                  posToOriginal: {
                     0: 1,
                     1: 3,
                     2: 4
                  }
               }
            }, {

               //15
               'goto': 2,
               hide: [1, 2, 3],
               sort: [],
               remove: [],
               expect: {
                  position: -1,
                  current: false,
                  next: 0,
                  previous: -1,
                  posToOriginal: {
                     0: 0,
                     1: 4
                  }
               }
            }, {

               //16
               'goto': 2,
               hide: [1, 3],
               sort: [],
               remove: [],
               expect: {
                  position: 1,
                  current: true,
                  next: 4,
                  previous: 0,
                  posToOriginal: {
                     0: 0,
                     1: 2,
                     2: 4
                  }
               }
            }, {

               //17
               'goto': -1,
               hide: [],
               sort: sortReverse,
               remove: [],
               expect: {
                  position: -1,
                  current: false,
                  next: 4,
                  previous: -1,
                  posToOriginal: {
                     0: 4,
                     1: 3,
                     2: 2,
                     3: 1,
                     4: 0
                  }
               }
            }, {

               //18
               'goto': 0,
               hide: [],
               sort: sortReverse,
               remove: [],
               expect: {
                  position: 4,
                  current: true,
                  next: -1,
                  previous: 1
               }
            }, {

               //19
               'goto': 1,
               hide: [],
               sort: sortReverse,
               remove: [],
               expect: {
                  position: 3,
                  current: true,
                  next: 0,
                  previous: 2
               }
            }, {

               //20
               'goto': 2,
               hide: [],
               sort: [1, 3, 0, 4, 2],
               remove: [],
               expect: {
                  position: 4,
                  current: true,
                  next: -1,
                  previous: 4,
                  posToOriginal: {
                     0: 1,
                     1: 3,
                     2: 0,
                     3: 4,
                     4: 2
                  }
               }
            }, {

               //21
               'goto': 0,
               hide: [],
               sort: [1, 3, 0, 4, 2],
               remove: [],
               expect: {
                  position: 2,
                  current: true,
                  next: 4,
                  previous: 3
               }
            }, {

               //22
               'goto': 1,
               hide: [1, 2],
               sort: sortReverse,
               remove: [],
               expect: {
                  position: -1,
                  current: false,
                  next: 4,
                  previous: -1
               }
            }, {

               //23
               'goto': 3,
               hide: [1, 2, 4],
               sort: sortReverse,
               remove: [],
               expect: {
                  position: 0,
                  current: true,
                  next: 0,
                  previous: -1
               }
            }, {

               //24
               'goto': 2,
               hide: [1, 3],
               sort: sortReverse,
               remove: [],
               expect: {
                  position: 1,
                  current: true,
                  next: 0,
                  previous: 4
               }
            }
            ];

         for (var testNum = 0; testNum < tests.length; testNum++) {
            (function(test) {
               var original;

               context(testNum + ': when ' +
                     (test['goto'] > -1 ? 'goto #' + test['goto'] + ', ' : '') +
                     (test.sort.length ? 'sort [' + test.sort.join(',') + '], ' : '') +
                     (test.hide.length ? 'hide [' + test.hide.join(',') + '], ' : '') +
                     (test.remove.length ? 'remove [' + test.remove.join(',') + ']' : ''),
               function() {
                  beforeEach(function() {
                     original = items.slice();

                     if (test['goto'] > -1) {
                        enumerator.setPosition(test['goto']);
                     }

                     if (test.hide.length) {
                        for (var hideNum = 0; hideNum < test.hide.length; hideNum++) {
                           filterMap[test.hide[hideNum]] = false;
                        }
                     }

                     if (test.sort.length) {
                        Array.prototype.splice.apply(sortMap, [0, sortMap.length].concat(test.sort));
                     }

                     if (test.remove.length) {
                        for (var removeNum = 0; removeNum < test.remove.length; removeNum++) {
                           var index = test.remove[removeNum];
                           items.splice(index, 1);
                           filterMap.splice(index, 1);
                           var sortIndex = sortMap.indexOf(index);
                           if (sortIndex > -1) {
                              sortMap.splice(sortIndex, 1);
                              for (var i = 0; i < sortMap.length; i++) {
                                 if (sortMap[i] > index) {
                                    sortMap[i]--;
                                 }
                              }
                           }
                        }
                     }

                     enumerator.reIndex();
                  });

                  it('the position becomes to #' + test.expect.position, function() {
                     assert.strictEqual(test.expect.position, enumerator.getPosition());
                  });

                  it('the current is ' + (test.expect.current ? 'not changed' : 'reset'), function() {
                     if (test.expect.current) {
                        assert.strictEqual(original[test['goto']], enumerator.getCurrent());
                     } else {
                        assert.isUndefined(enumerator.getCurrent());
                     }
                  });

                  it('the next is ' + (test.expect.next === -1 ? 'undefined' : 'original[' + test.expect.next + ']'), function() {
                     assert.strictEqual(original[test.expect.next], enumerator.moveNext() ? enumerator.getCurrent() : undefined);
                  });

                  it('the previous is ' + (test.expect.previous === -1 ? 'undefined' : 'original[' + test.expect.previous + ']'), function() {
                     assert.strictEqual(original[test.expect.previous], enumerator.movePrevious() ? enumerator.getCurrent() : undefined);
                  });

                  if (test.expect.posToOriginal) {
                     it('positions to original is ' + JSON.stringify(test.expect.posToOriginal), function() {
                        for (var position in test.expect.posToOriginal) {
                           if (test.expect.posToOriginal.hasOwnProperty(position)) {
                              enumerator.setPosition(position);
                              assert.strictEqual(original[test.expect.posToOriginal[position]], enumerator.getCurrent());
                           }
                        }
                     });
                  }
               });
            })(tests[testNum]);
         }
      });
   });
});
