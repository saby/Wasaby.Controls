/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Projection',
      'js!SBIS3.CONTROLS.Data.Projection.Collection',
      'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
      'js!SBIS3.CONTROLS.Data.Collection.List',
      'js!SBIS3.CONTROLS.Data.Bind.ICollection',
      'js!SBIS3.CONTROLS.Data.Adapter.Json',
      'js!SBIS3.CONTROLS.Data.Model'
   ], function (Projection, CollectionProjection, ObservableList, List, IBindCollection, JsonAdapter, Model) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Projection.Collection', function() {
         var items,
            list,
            projection;

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

            list = new ObservableList({
               items: items
            });

            projection = new CollectionProjection({
               collection: list
            });
         });

         afterEach(function() {
            projection.destroy();
            projection = undefined;

            list.destroy();
            list = undefined;

            items = undefined;
         });

         describe('$constructor()', function() {
            it('should throw an error on invalid argument', function() {
               assert.throw(function() {
                  var list = new CollectionProjection({
                     collection: {}
                  });
               });
               assert.throw(function() {
                  var list = new CollectionProjection({
                     collection: 'a'
                  });
               });
               assert.throw(function() {
                  var list = new CollectionProjection({
                     collection: 1
                  });
               });
               assert.throw(function() {
                  var list = new CollectionProjection({
                     collection: undefined
                  });
               });
            });
         });

         describe('.getEnumerator()', function() {
            it('should return a projection enumerator', function() {
               var projection = new CollectionProjection({
                  collection: new ObservableList()
               });
               assert.isTrue($ws.helpers.instanceOfModule(projection.getEnumerator(), 'SBIS3.CONTROLS.Data.Projection.CollectionEnumerator'));
            });
         });

         describe('.setSort()', function() {
            it('should sort projection', function() {
               var list = new ObservableList({
                     items: [1, 2, 3, 4]
                  }),
                  sortedItem = [4, 3, 2, 1],
                  sort = function(a, b){
                     return a.item <= b.item ? 1 : -1;
                  };
               var projection = Projection.getDefaultProjection(list);
               projection.setSort(sort);
               projection.each(function(item, i){
                  assert.equal(sortedItem[i], item.getContents());
               });
            });

            it('should reset a sort projection', function() {
               var list = new ObservableList({
                     items: [1, 2, 3, 4]
                  }),
                  sortedItem = [1, 2, 3, 4],
                  sort = function(a, b) {
                     return a.item <= b.item ? 1 : -1;
                  };
               var projection = Projection.getDefaultProjection(list);
               projection.setSort(sort);
               projection.setSort();
               projection.each(function(item, i){
                  assert.equal(sortedItem[i], item.getContents());
               });
            });

            it('should sort projection after add item', function() {
               var list = new ObservableList({
                     items: [1, 2, 3, 4]
                  }),
                  sortedItem = [5, 4, 3, 2, 1],
                  sort = function(a, b) {
                     return a.item <= b.item ? 1 : -1;
                  };
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setSort(sort);
               projection.getCollection().add(5);
               projection.each(function(item, i) {
                  assert.equal(sortedItem[i], item.getContents());
               });
            });

            it('should sort projection after remove item', function() {
               var list = new ObservableList({
                     items: [1, 2, 10, 3, 4]
                  }),
                  sortedItem = [4, 3, 2, 1],
                  sort = function(a,b){
                     return a.item <= b.item ? 1 : -1;
                  };
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setSort(sort);
               projection.getCollection().removeAt(2);
               projection.each(function(item, i){
                  assert.equal(sortedItem[i], item.getContents());
               });
            });

            it('should sort projection after replace item', function() {
               var list = new ObservableList({
                     items: [1, 2, 2, 3, 5]
                  }),
                  sortedItem = [5, 4, 3, 2, 1],
                  sort = function(a, b) {
                     return a.item <= b.item ? 1 :-1;
                  };
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setSort(sort);
               projection.getCollection().replace(4, 2);
               projection.each(function(item, i) {
                  assert.equal(sortedItem[i], item.getContents());
               });
            });

            it('should sort projection after change item', function() {
               var
                  adapter = new JsonAdapter(),
                  changeModel = new Model({data:{max: 2},adapter:adapter}),
                  list = new ObservableList({
                     items: [
                        new Model({
                           data: {max: 1},
                           adapter: adapter
                        }),
                        new Model({
                           data: {max: 3},
                           adapter: adapter
                        }),
                        new Model({
                           data: {max: 4},
                           adapter: adapter
                        }),
                        changeModel
                     ]
                  }),
                  sortedItem = [10, 4, 3, 1],
                  sort = function(a ,b){
                     return a.item.get('max') <= b.item.get('max') ? 1 : -1;
                  };
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setSort(sort);
               changeModel.set('max',10);
               projection.each(function(item, i) {
                  assert.equal(sortedItem[i], item.getContents().get('max'));
               });
            });



         });

         describe('.setFilter()', function() {
            it('should filter projection', function() {
               var list = new ObservableList({
                     items: [1, 2, 3, 4]
                  }),
                  filter = function(item) {
                     return item === 3;
                  };
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setFilter(filter);
               var count = 0;
               projection.each(function(item){
                  assert.equal(item.getContents(), 3);
                  count++;
               });
               assert.equal(count, 1);
            });

            it('should filter projection after add item', function() {
               var list = new ObservableList({
                     items: [1, 2, 3, 4]
                  }),
                  filter = function(item){
                     return item === 3;
                  };
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setFilter(filter);
               projection.getCollection().add(4);
               projection.getCollection().add(3);
               var count = 0;
               projection.each(function(item){
                  assert.equal(item.getContents(), 3);
                  count++;
               });
               assert.equal(count, 2);
            });

            it('should filter projection after remove item', function() {
               var list = new ObservableList({
                     items: [1, 2, 3, 3]
                  }),
                  filter = function(item){
                     return item === 3;
                  };
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setFilter(filter);
               projection.getCollection().removeAt(3);
               var count = 0;
               projection.each(function(item){
                  assert.equal(item.getContents(), 3);
                  count++;
               });
               assert.equal(count, 1);
            });

            it('should filter projection after replace item', function() {
               var list = new ObservableList({
                     items: [1, 2, 3, 2]
                  }),
                  filter = function(item) {
                     return item === 3;
                  };
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setFilter(filter);
               projection.getCollection().replace(3, 1);
               var count = 0;
               projection.each(function(item){
                  assert.equal(item.getContents(), 3);
                  count++;
               });
               assert.equal(count, 2);
            });

            it('should filter projection after change item', function() {
               var
                  adapter = new JsonAdapter(),
                  changeModel = new Model({
                     data: {max: 2},
                     adapter: adapter
                  }),
                  list = new ObservableList({
                     items: [
                        new Model({
                           data: {max: 1},
                           adapter: adapter
                        }),
                        new Model({
                           data: {max: 3},
                           adapter: adapter
                        }),
                        new Model({
                           data: {max: 4},
                           adapter: adapter
                        }),
                        changeModel
                     ]
                  }),
                  sortedItem = [10, 4, 3, 1],
                  filter = function(item) {
                     return item.get('max') === 3;
                  };
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setFilter(filter);
               changeModel.set('max', 3);
               var count = 0;
               projection.each(function(item){
                  assert.equal(item.getContents().get('max'), 3);
                  count++;
               });
               assert.equal(count, 2);
            });
         });

         describe('.getFilter()', function(){
            it('should return a projection filter', function() {
               var projection = new CollectionProjection({
                     collection: new ObservableList()
                  }),
                  filter = function() {
                     return true;
                  };
               projection.setFilter(filter);
               assert.equal(filter, projection.getFilter());
               projection.setFilter(filter);
               assert.equal(filter, projection.getFilter());
            });
         });
         describe('.getSort()', function(){
            it('should return a projection sort', function() {
               var projection = new CollectionProjection({
                     collection: new ObservableList()
                  }),
                  sort = function() {
                     return 0;
                  };
               projection.setSort(sort);
               assert.equal(sort,projection.getSort());
            });
         });

         describe('.each()', function() {
            it('should return every item in original order', function() {
               var ok = true,
                   index = 0;
               projection.each(function(item) {
                  if (item.getContents() !== items[index]) {
                     ok = false;
                  }
                  index++;
               });
               assert.isTrue(ok);
            });

            it('should return every item index in original order', function() {
               var ok = true,
                  index = 0;
               projection.each(function(item, innerIndex) {
                  if (index !== innerIndex) {
                     ok = false;
                  }
                  index++;
               });
               assert.isTrue(ok);
            });

            it('should use the given context', function() {
               var ok = true,
                  context = {
                     'blah': 'blah'
                  };
               projection.each(function() {
                  if (this !== context) {
                     ok = false;
                  }
               }, context);
               assert.isTrue(ok);
            });
         });

         describe('.concat()', function() {
            it('should throw an error anyway', function() {
               assert.throw(function() {
                  projection.concat(new List());
               });
               assert.throw(function() {
                  projection.concat();
               });
            });
         });

         describe('.getCollection()', function() {
            it('should return source collection', function() {
               assert.strictEqual(
                  list,
                  projection.getCollection()
               );
            });
         });

         describe('.getCurrent()', function() {
            it('should return undefined by default', function() {
               assert.isUndefined(projection.getCurrent());
            });
            it('should change by item enumeration', function() {
               var index = 0;
               while (projection.moveToNext()) {
                  assert.strictEqual(items[index], projection.getCurrent().getContents());
                  index++;
               }
               assert.strictEqual(items[items.length - 1], projection.getCurrent().getContents());
            });
         });

         describe('.getCurrentPosition()', function() {
            it('should return -1 by default', function() {
               assert.strictEqual(-1, projection.getCurrentPosition());
            });

            it('should change through navigation', function() {
               var index = -1;
               while (projection.moveToNext()) {
                  index++;
                  assert.strictEqual(index, projection.getCurrentPosition());
               }
               assert.strictEqual(items.length - 1, projection.getCurrentPosition());

               while (projection.moveToPrevious()) {
                  index--;
                  assert.strictEqual(index, projection.getCurrentPosition());
               }
               assert.strictEqual(0, projection.getCurrentPosition());
            });
         });

         describe('.setCurrentPosition()', function() {
            it('should change the position', function() {
               projection.setCurrentPosition(0);
               assert.strictEqual(0, projection.getCurrentPosition());

               projection.setCurrentPosition(4);
               assert.strictEqual(4, projection.getCurrentPosition());

               projection.setCurrentPosition(-1);
               assert.strictEqual(-1, projection.getCurrentPosition());
            });

            it('should change current item', function() {
               for (var i = 0; i < items.length; i++) {
                  projection.setCurrentPosition(i);
                  assert.strictEqual(items[i], projection.getCurrent().getContents());
               }
            });

            it('should throw an error on invalid index', function() {
               assert.throw(function() {
                  projection.setCurrentPosition(-2);
               });
               assert.throw(function() {
                  projection.setCurrentPosition(items.length);
               });
            });

            it('should trigger an event with valid arguments', function(done) {
               var andDone = false,
                  prevPosition,
                  prevCurrent,
                  position,
                  step,
                  handler = function(event, newCurrent, oldCurrent, newPosition, oldPosition) {
                     try {
                        if (newPosition !== position) {
                           throw new Error('Invalid newPosition');
                        }
                        if (oldPosition !== prevPosition) {
                           throw new Error('Invalid oldPosition');
                        }
                        if (oldCurrent !== prevCurrent) {
                           throw new Error('Invalid oldCurrent');
                        }
                        if (andDone) {
                           done();
                        }
                     } catch (err) {
                        done(err);
                     }
                  };
               projection.subscribe('onCurrentChange', handler);

               for (step = 1; step < 4; step++) {
                  prevPosition = projection.getCurrentPosition();
                  prevCurrent = projection.getCurrent();
                  for (position = 0; position < items.length; position += step) {
                     andDone = step === 3 && position + step >= items.length;

                     projection.setCurrentPosition(position);
                     prevPosition = position;
                     prevCurrent = projection.getCurrent();
                  }
               }

               projection.unsubscribe('onCurrentChange', handler);
            });
         });

         describe('.moveToNext()', function() {
            it('should change the current and the position', function() {
               var position = -1;
               while (projection.moveToNext()) {
                  position++;
                  assert.strictEqual(position, projection.getCurrentPosition());
                  assert.strictEqual(items[position], projection.getCurrent().getContents());
               }
            });

            it('should trigger an event with valid arguments', function(done) {
               var andDone = false,
                  handler = function(event, newCurrent, oldCurrent, newPosition, oldPosition) {
                     try {
                        if (newPosition !== oldPosition + 1) {
                           throw new Error('Invalid newPosition');
                        }
                        if (oldCurrent && oldCurrent.getContents() !== items[oldPosition]) {
                           throw new Error('Invalid oldCurrent');
                        }
                        if (andDone) {
                           done();
                        }
                     } catch (err) {
                        done(err);
                     }
                  };
               projection.subscribe('onCurrentChange', handler);

               var position = -1;
               while (projection.moveToNext()) {
                  position++;
                  andDone = position === items.length - 2;
               }

               projection.unsubscribe('onCurrentChange', handler);
            });
         });

         describe('.moveToPrevious()', function() {
            it('should change the current and the position', function() {
               var position = items.length - 1;
               projection.setCurrentPosition(position);
               while (projection.moveToPrevious()) {
                  position--;
                  assert.strictEqual(position, projection.getCurrentPosition());
                  assert.strictEqual(items[position], projection.getCurrent().getContents());
               }
            });

            it('should trigger an event with valid arguments', function(done) {
               var andDone = false,
                  handler = function(event, newCurrent, oldCurrent, newPosition, oldPosition) {
                     try {
                        if (newPosition !== oldPosition - 1) {
                           throw new Error('Invalid newPosition');
                        }
                        if (oldCurrent && oldCurrent.getContents() !== items[oldPosition]) {
                           throw new Error('Invalid oldCurrent');
                        }
                        if (andDone) {
                           done();
                        }
                     } catch (err) {
                        done(err);
                     }
                  };

               var position = items.length - 1;
               projection.setCurrentPosition(position);

               projection.subscribe('onCurrentChange', handler);

               while (projection.moveToPrevious()) {
                  position--;
                  andDone = position === 1;
               }

               projection.unsubscribe('onCurrentChange', handler);
            });
         });
      });
   }
);
