/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Projection.CollectionEnumerator'
   ], function (ProjectionEnumerator) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Projection.CollectionEnumerator', function() {
         var itemsMap,
            sourceMap,
            filterMap,
            sortMap,
            enumerator,
            fillFilter = function() {
               sortMap.splice(0, 0, 0, 1, 2, 3, 4);
            },
            reverseFilter = function() {
               sortMap.reverse();
            };

         beforeEach(function() {
            itemsMap = [{
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
            sourceMap = [{
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
            }];

            filterMap = [true, true, true, true, true];

            sortMap = [];

            enumerator = new ProjectionEnumerator({
               itemsMap: itemsMap,
               sourceMap: sourceMap,
               filterMap: filterMap,
               sortMap: sortMap
            });
         });

         afterEach(function() {
            enumerator = undefined;
            itemsMap = undefined;
            sourceMap = undefined;
            filterMap = undefined;
            sortMap = undefined;
         });

         describe('$constructor()', function() {
            it('should throw an error on invalid argument', function() {
               assert.throw(function() {
                  var enumerator = new ProjectionEnumerator({
                     itemsMap: {},
                     sourceMap: {},
                     filterMap: {},
                     sortMap: {}
                  });
               });
               assert.throw(function() {
                  var enumerator = new ProjectionEnumerator({
                     itemsMap: '',
                     sourceMap: '',
                     filterMap: '',
                     sortMap: ''
                  });
               });
               assert.throw(function() {
                  var enumerator = new ProjectionEnumerator({
                     itemsMap: 0,
                     sourceMap: 0,
                     filterMap: 1,
                     sortMap: 2
                  });
               });
               assert.throw(function() {
                  var enumerator = new ProjectionEnumerator({
                     itemsMap: undefined,
                     sourceMap: undefined,
                     filterMap: undefined,
                     sortMap: undefined
                  });
               });
               assert.throw(function() {
                  var enumerator = new ProjectionEnumerator({
                     itemsMap: [],
                     sourceMap: [],
                     filterMap: undefined,
                     sortMap: undefined
                  });
               });
               assert.throw(function() {
                  var enumerator = new ProjectionEnumerator({
                     itemsMap: [],
                     sourceMap: [],
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
               while (enumerator.getNext()) {
                  index++;
                  assert.strictEqual(itemsMap[index], enumerator.getCurrent());
               }
               assert.strictEqual(itemsMap[itemsMap.length - 1], enumerator.getCurrent());
            });
         });

         describe('.getNext()', function() {
            it('should return undefined for empty list', function() {
               var enumerator = new ProjectionEnumerator();
               assert.isUndefined(enumerator.getNext());
            });

            it('should return item by item', function() {
               var index = -1,
                  item;
               while ((item = enumerator.getNext())) {
                  index++;
                  assert.strictEqual(itemsMap[index], item);
               }
               assert.isUndefined(enumerator.getNext());
            });
         });

         describe('.getPrevious()', function() {
            it('should return undefined for empty list', function() {
               var enumerator = new ProjectionEnumerator();
               assert.isUndefined(enumerator.getPrevious());
            });

            it('should return item by item', function() {
               var index = sourceMap.length - 1,
                  item;
               enumerator.setPosition(index);
               while ((item = enumerator.getPrevious())) {
                  index--;
                  assert.strictEqual(itemsMap[index], item);
               }
               assert.isUndefined(enumerator.getPrevious());
            });
         });

         describe('.reset()', function() {
            it('should set current to undefined', function() {
               enumerator.getNext();
               assert.isDefined(enumerator.getCurrent());
               enumerator.reset();
               assert.isUndefined(enumerator.getCurrent());
            });

            it('should start enumeration from beginning', function() {
               var item,
                  index;

               var firstOne = enumerator.getNext();
               enumerator.getNext();
               enumerator.reset();
               assert.strictEqual(firstOne, enumerator.getNext());

               enumerator.reset();
               index = -1;
               while ((item = enumerator.getNext())) {
                  index++;
                  assert.strictEqual(itemsMap[index], item);
               }

               enumerator.reset();
               index = -1;
               while (enumerator.getNext()) {
                  index++;
                  assert.strictEqual(itemsMap[index], enumerator.getCurrent());
               }
            });
         });

         describe('.getPosition()', function() {
            it('should return -1 by default', function() {
               assert.strictEqual(-1, enumerator.getPosition());
            });

            it('should change through navigation', function() {
               var index = -1;
               while (enumerator.getNext()) {
                  index++;
                  assert.strictEqual(index, enumerator.getPosition());
               }
               assert.strictEqual(itemsMap.length - 1, enumerator.getPosition());

               while (enumerator.getPrevious()) {
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
               for (var i = 0; i < sourceMap.length; i++) {
                  enumerator.setPosition(i);
                  assert.strictEqual(itemsMap[i], enumerator.getCurrent());
               }
            });

            it('should throw an error on invalid index', function() {
               assert.throw(function() {
                  enumerator.setPosition(-2);
               });
               assert.throw(function() {
                  enumerator.setPosition(sourceMap.length);
               });
            });
         });

         describe('.reIndex()', function() {
            var sortDirect = [0, 1, 2, 3, 4],
               sortReverse = [4, 3, 2, 1, 0],
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
               } , {
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
               (function(test){
                  var original;

                  context(testNum + ': when ' +
                     (test['goto'] > -1 ? 'goto #' + test['goto'] + ', ' : '' ) +
                     (test.sort.length ? 'sort [' + test.sort.join(',') + '], ' : '') +
                     (test.hide.length ? 'hide [' + test.hide.join(',') + '], ' : '') +
                     (test.remove.length ? 'remove [' + test.remove.join(',') + ']' : ''),
                  function() {
                     beforeEach(function() {
                        original = itemsMap.slice();

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
                              itemsMap.splice(index, 1);
                              sourceMap.splice(index, 1);
                              filterMap.splice(index, 1);
                              var sortIndex = Array.indexOf(sortMap, index);
                              if (sortIndex > -1) {
                                 sortMap.splice(sortIndex, 1);
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
                        assert.strictEqual(original[test.expect.next], enumerator.getNext());
                     });

                     it('the previous is ' + (test.expect.previous === -1 ? 'undefined' : 'original[' + test.expect.previous + ']'), function() {
                        assert.strictEqual(original[test.expect.previous], enumerator.getPrevious());
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
   }
);
