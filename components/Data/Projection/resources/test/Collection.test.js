/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Projection.Projection',
      'js!SBIS3.CONTROLS.Data.Projection.Collection',
      'js!SBIS3.CONTROLS.Data.Collection.ObservableList',
      'js!SBIS3.CONTROLS.Data.Collection.List',
      'js!SBIS3.CONTROLS.Data.Bind.ICollectionProjection',
      'js!SBIS3.CONTROLS.Data.Adapter.Json',
      'js!SBIS3.CONTROLS.Data.Model'
   ], function (Projection, CollectionProjection, ObservableList, List, IBindCollectionProjection, JsonAdapter, Model) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Projection.Collection', function() {
         var getItems = function() {
               return [{
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
            },
            items,
            list,
            projection;

         beforeEach(function() {
            items = getItems();

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

         describe('.setFilter()', function() {
            var getItems = function() {
               return [1, 2, 3, 4];
            };

            it('should filter projection', function() {
               var list = new ObservableList({
                     items: getItems()
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

            it('should filter projection after assign an items', function() {
               var list = new ObservableList({
                     items: getItems()
                  }),
                  filter = function(item){
                     return item === 5 || item === 6;
                  };
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setFilter(filter);
               list.assign([4, 5, 6, 7]);
               var count = 0;
               projection.each(function(item){
                  assert.equal(item.getContents(), 5 + count);
                  count++;
               });
               assert.equal(count, 2);
            });

            it('should filter projection after add item', function() {
               var list = new ObservableList({
                     items: getItems()
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

            it('should not refilter projection after change item', function() {
               var
                  changeModel = new Model({
                     rawData: {max: 2}
                  }),
                  list = new ObservableList({
                     items: [
                        new Model({
                           rawData: {max: 1}
                        }),
                        new Model({
                           rawData: {max: 3}
                        }),
                        new Model({
                           rawData: {max: 4}
                        }),
                        changeModel
                     ]
                  }),
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
               assert.equal(count, 1);
            });

            it('should refilter projection after change item', function() {
               var
                  changeModel = new Model({
                     rawData: {max: 2}
                  }),
                  list = new ObservableList({
                     items: [
                        new Model({
                           rawData: {max: 1}
                        }),
                        new Model({
                           rawData: {max: 3}
                        }),
                        new Model({
                           rawData: {max: 4}
                        }),
                        changeModel
                     ]
                  }),
                  filter = function(item) {
                     return item.get('max') === 3;
                  };
               var projection = new CollectionProjection({
                  collection: list,
                  importantItemProperties: ['max']
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

         describe('.setSort()', function() {
            var getItems = function() {
                 return [1, 2, 3, 4];
               },
               getSortedItems = function() {
                  return [4, 3, 2, 1];
               },
               sort = function(a, b){
                  return a.item <= b.item ? 1 : -1;
               };

            it('should sort projection', function() {
               var list = new ObservableList({
                     items: getItems()
                  }),
                  sortedItems = getSortedItems();
               var projection = Projection.getDefaultProjection(list);
               projection.setSort(sort);
               projection.each(function(item, i){
                  assert.equal(sortedItems[i], item.getContents());
               });
            });

            it('should reset a sort projection', function() {
               var list = new ObservableList({
                     items: getItems()
                  }),
                  sortedItems = getItems();
               var projection = Projection.getDefaultProjection(list);
               projection.setSort(sort);
               projection.setSort();
               projection.each(function(item, i){
                  assert.equal(sortedItems[i], item.getContents());
               });
            });

            it('should sort projection after add item', function() {
               var list = new ObservableList({
                     items: getItems()
                  }),
                  sortedItems = [5, 4, 3, 2, 1];
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setSort(sort);
               projection.getCollection().add(5);
               projection.each(function(item, i) {
                  assert.equal(sortedItems[i], item.getContents());
               });
            });

            it('should sort projection after remove item', function() {
               var list = new ObservableList({
                     items: [1, 2, 10, 3, 4]
                  }),
                  sortedItems = getSortedItems();
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setSort(sort);
               projection.getCollection().removeAt(2);
               projection.each(function(item, i){
                  assert.equal(sortedItems[i], item.getContents());
               });
            });

            it('should sort projection after replace item', function() {
               var list = new ObservableList({
                     items: [1, 2, 2, 3, 5]
                  }),
                  sortedItems = [5, 4, 3, 2, 1];
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setSort(sort);
               projection.getCollection().replace(4, 2);
               projection.each(function(item, i) {
                  assert.equal(sortedItems[i], item.getContents());
               });
            });

            it('should not resort projection after change item', function() {
               var
                  changeModel = new Model({
                     rawData: {max: 2}
                  }),
                  list = new ObservableList({
                     items: [
                        new Model({
                           rawData: {max: 1}
                        }),
                        new Model({
                           rawData: {max: 3}
                        }),
                        new Model({
                           rawData: {max: 4}
                        }),
                        changeModel
                     ]
                  }),
                  sortedItems = [4, 3, 10, 1];
               var projection = new CollectionProjection({
                  collection: list
               });
               projection.setSort(function(a, b){
                  return a.item.get('max') <= b.item.get('max') ? 1 : -1;
               });
               changeModel.set('max', 10);
               projection.each(function(item, i) {
                  assert.equal(sortedItems[i], item.getContents().get('max'));
               });
            });

            it('should resort projection after change item', function() {
               var
                  changeModel = new Model({
                     rawData: {max: 2}
                  }),
                  list = new ObservableList({
                     items: [
                        new Model({
                           rawData: {max: 1}
                        }),
                        new Model({
                           rawData: {max: 3}
                        }),
                        new Model({
                           rawData: {max: 4}
                        }),
                        changeModel
                     ]
                  }),
                  sortedItems = [10, 4, 3, 1];
               var projection = new CollectionProjection({
                  collection: list,
                  importantItemProperties: ['max']
               });
               projection.setSort(function(a ,b){
                  return a.item.get('max') <= b.item.get('max') ? 1 : -1;
               });
               changeModel.set('max', 10);
               projection.each(function(item, i) {
                  assert.equal(sortedItems[i], item.getContents().get('max'));
               });
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

         context('shortcuts', function() {
            beforeEach(function() {
               list = new ObservableList({
                  items: [1, 2, 3, 4]
               });
               projection = new CollectionProjection({
                  collection: list
               });
            });

            describe('.getSourceIndexByIndex()', function() {

               it('should return equal indexes', function() {
                  projection.each(function(item, index) {
                     assert.equal(projection.getSourceIndexByIndex(index), index);
                  });
               });
               it('should return inverted indexes', function() {
                  var max = projection.getCount() - 1;
                  projection.setSort(function(a, b){
                     return a.item <= b.item ? 1 : -1;
                  });
                  projection.each(function(item, index) {
                     assert.equal(projection.getSourceIndexByIndex(index), max - index);
                  });
               });
               it('should return -1', function() {
                  assert.equal(projection.getSourceIndexByIndex(-1), -1);
                  assert.equal(projection.getSourceIndexByIndex(99), -1);
                  assert.equal(projection.getSourceIndexByIndex(null), -1);
                  assert.equal(projection.getSourceIndexByIndex(), -1);
               });
            });

            describe('.getSourceIndexByItem()', function() {
               it('should return equal indexes', function() {
                  projection.each(function(item, index) {
                     assert.equal(projection.getSourceIndexByItem(item), index);
                  });
               });
               it('should return inverted indexes', function() {
                  var max = projection.getCount() - 1;
                  projection.setSort(function(a, b){
                     return a.item <= b.item ? 1 : -1;
                  });
                  projection.each(function(item, index) {
                     assert.equal(projection.getSourceIndexByItem(item), max - index);
                  });
               });
               it('should return -1', function() {
                  assert.equal(projection.getSourceIndexByItem({}), -1);
                  assert.equal(projection.getSourceIndexByItem(null), -1);
                  assert.equal(projection.getSourceIndexByItem(), -1);
               });
            });

            describe('.getIndexBySourceIndex()', function() {
               it('should return equal indexes', function() {
                  projection.getCollection().each(function(item, index) {
                     assert.equal(projection.getIndexBySourceIndex(index), index);
                  });
               });
               it('should return inverted indexes', function() {
                  var max = projection.getCount() - 1;
                  projection.setSort(function(a, b){
                     return a.item <= b.item ? 1 : -1;
                  });
                  projection.getCollection().each(function(item, index) {
                     assert.equal(projection.getIndexBySourceIndex(index), max - index);
                  });
               });
               it('should return -1', function() {
                  assert.equal(projection.getIndexBySourceIndex(-1), -1);
                  assert.equal(projection.getIndexBySourceIndex(99), -1);
                  assert.equal(projection.getIndexBySourceIndex(null), -1);
                  assert.equal(projection.getIndexBySourceIndex(), -1);
               });
            });

            describe('.getIndexBySourceItem()', function() {
               it('should return equal indexes', function() {
                  projection.getCollection().each(function(item, index) {
                     assert.equal(projection.getIndexBySourceItem(item), index);
                  });
               });
               it('should return inverted indexes', function() {
                  var max = projection.getCount() - 1;
                  projection.setSort(function(a, b){
                     return a.item <= b.item ? 1 : -1;
                  });
                  projection.getCollection().each(function(item, index) {
                     assert.equal(projection.getIndexBySourceItem(item), max - index);
                  });
               });
               it('should return -1', function() {
                  assert.equal(projection.getIndexBySourceItem({}), -1);
                  assert.equal(projection.getIndexBySourceItem(null), -1);
                  assert.equal(projection.getIndexBySourceItem(), -1);
               });
            });

            describe('.getItemBySourceIndex()', function() {
               it('should return equal indexes', function() {
                  projection.getCollection().each(function(item, index) {
                     assert.strictEqual(projection.getItemBySourceIndex(index), projection.at(index));
                  });
               });
               it('should return inverted indexes', function() {
                  var max = projection.getCount() - 1;
                  projection.setSort(function(a, b){
                     return a.item <= b.item ? 1 : -1;
                  });
                  projection.getCollection().each(function(item, index) {
                     assert.strictEqual(projection.getItemBySourceIndex(index), projection.at(max - index));
                  });
               });
               it('should return undefined', function() {
                  assert.isUndefined(projection.getItemBySourceIndex(-1));
                  assert.isUndefined(projection.getItemBySourceIndex(99));
                  assert.isUndefined(projection.getItemBySourceIndex(null));
                  assert.isUndefined(projection.getItemBySourceIndex());
               });
            });

            describe('.getItemBySourceItem()', function() {
               it('should return equal indexes', function() {
                  projection.getCollection().each(function(item, index) {
                     assert.strictEqual(projection.getItemBySourceItem(item), projection.at(index));
                  });
               });
               it('should return inverted indexes', function() {
                  var max = projection.getCount() - 1;
                  projection.setSort(function(a, b){
                     return a.item <= b.item ? 1 : -1;
                  });
                  projection.getCollection().each(function(item, index) {
                     assert.strictEqual(projection.getItemBySourceItem(item), projection.at(max - index));
                  });
               });
               it('should return undefined', function() {
                  assert.isUndefined(projection.getItemBySourceItem({}));
                  assert.isUndefined(projection.getItemBySourceItem(null));
                  assert.isUndefined(projection.getItemBySourceItem());
               });
            });
         });

         describe('.setEventRaising()', function() {
            it('should enable and disable onCurrentChange', function() {
               var handler = function () {
                     fired = true;
                  },
                  fired;

               projection.subscribe('onCurrentChange', handler);

               fired = false;
               projection.setEventRaising(true);
               projection.moveToNext();
               assert.isTrue(fired);

               fired = false;
               projection.setEventRaising(false);
               projection.moveToNext();
               assert.isFalse(fired);

               projection.unsubscribe('onCurrentChange', handler);
            });

            it('should enable and disable onCollectionItemChange', function() {
               var handler = function() {
                     fired = true;
                  },
                  fired;

               projection.subscribe('onCollectionItemChange', handler);

               fired = false;
               projection.setEventRaising(true);
               projection.at(0).setSelected(true);
               assert.isTrue(fired);

               fired = false;
               projection.setEventRaising(false);
               projection.at(1).setSelected(true);
               assert.isFalse(fired);

               projection.unsubscribe('onCollectionItemChange', handler);
            });

            it('should enable and disable onCollectionChange', function() {
               var handler = function() {
                     fired = true;
                  },
                  fired;

               projection.subscribe('onCollectionChange', handler);

               fired = false;
               projection.setEventRaising(true);
               projection.getCollection().add({id: 'testA'});
               assert.isTrue(fired);

               fired = false;
               projection.setEventRaising(false);
               projection.getCollection().add({id: 'testB'});
               assert.isFalse(fired);

               projection.unsubscribe('onCollectionItemChange', handler);
            });

            it("should trigger event onCollectionItemChange after onCollectionChange", function(done){
               var
                  list = new ObservableList({
                     items: [
                        new Model({
                           rawData: {max: 1}
                        }),
                        new Model({
                           rawData: {max: 3}
                        }),
                        new Model({
                           rawData: {max: 4}
                        })
                     ]
                  });
               list.subscribe('onCollectionChange', function(e, act, newItems, index, oldItems, oldIndex ){
                  var item = list.at(oldIndex+1);
                  item.set('max', 502);
               });

               var  projection = new CollectionProjection({
                     collection: list
                  });

               projection.subscribe('onCollectionItemChange', function(e, item) {
                  if(item.getContents().get('max') === 502){
                     done();
                  }
               });
               list.removeAt(0);
            });
         });

         describe('.isEventRaising()', function() {
            it('should return true by default', function() {
               assert.isTrue(projection.isEventRaising());
            });
            it('should return true if enabled', function() {
               projection.setEventRaising(true);
               assert.isTrue(projection.isEventRaising());
            });
            it('should return false if disabled', function() {
               projection.setEventRaising(false);
               assert.isFalse(projection.isEventRaising());
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

         describe('.getItems()', function() {
            it('should return array of items', function() {
               var items = projection.getItems();
               assert.isTrue(items.length > 0);
               for (var i = 0; i < items.length; i++) {
                  assert.strictEqual(
                     items[i],
                     projection.at(i)
                  );
               }
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
                        assert.strictEqual(newPosition, position, 'Invalid newPosition');
                        assert.strictEqual(oldPosition, prevPosition, 'Invalid oldPosition');
                        assert.strictEqual(oldCurrent, prevCurrent, 'Invalid oldCurrent');
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
                        assert.strictEqual(newPosition, oldPosition + 1, 'Invalid newPosition');
                        if (oldCurrent) {
                           assert.strictEqual(oldCurrent.getContents(), items[oldPosition], 'Invalid oldCurrent');
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
                        assert.strictEqual(newPosition, oldPosition - 1, 'Invalid newPosition');
                        if (oldCurrent) {
                           assert.strictEqual(oldCurrent.getContents(), items[oldPosition], 'Invalid oldCurrent');
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

         describe('[onCollectionChange]', function() {
            var getItems = function() {
                  return [1, 2, 3, 4];
               },
               getSortedItems = function() {
                  return [4, 3, 2, 1];
               },
               sort = function(a, b) {
                  return a.item <= b.item ? 1 : -1;
               },
               filter = function(item) {
                  return outsideItems.indexOf(item) === -1;
               },
               outsideItems = [1, 3];

            it('should fire after add an item', function(done) {
               var items = getItems(),
                  list = new ObservableList({
                     items: items
                  }),
                  projection = new CollectionProjection({
                     collection: list
                  }),
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     try {
                        assert.strictEqual(action, IBindCollectionProjection.ACTION_ADD, 'Invalid action');
                        assert.strictEqual(newItems[0].getContents(), 5, 'Invalid newItems');
                        assert.strictEqual(newItemsIndex, items.length - 1, 'Invalid newItemsIndex');
                        assert.strictEqual(oldItems.length, 0, 'Invalid oldItems');
                        assert.strictEqual(oldItemsIndex, 0, 'Invalid oldItemsIndex');
                        done();
                     } catch (err) {
                        done(err);
                     }
                  };
               projection.subscribe('onCollectionChange', handler);
               projection.getCollection().add(5);
               projection.unsubscribe('onCollectionChange', handler);
            });

            it('should fire after remove an item', function(done) {
               var items = getItems(),
                  list = new ObservableList({
                     items: items
                  }),
                  projection = new CollectionProjection({
                     collection: list
                  }),
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     try {
                        assert.strictEqual(action, IBindCollectionProjection.ACTION_REMOVE, 'Invalid action');
                        assert.strictEqual(newItems.length, 0, 'Invalid newItems');
                        assert.strictEqual(newItemsIndex, 0, 'Invalid newItemsIndex');
                        assert.strictEqual(oldItems[0].getContents(), 2, 'Invalid oldItems');
                        assert.strictEqual(oldItemsIndex, 1, 'Invalid oldItemsIndex');
                        done();
                     } catch (err) {
                        done(err);
                     }
                  };
               projection.subscribe('onCollectionChange', handler);
               projection.getCollection().remove(2);
               projection.unsubscribe('onCollectionChange', handler);
            });

            it('should fire after replace an item', function(done) {
               var items = getItems(),
                  list = new ObservableList({
                     items: items
                  }),
                  projection = new CollectionProjection({
                     collection: list
                  }),
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     try {
                        assert.strictEqual(action, IBindCollectionProjection.ACTION_REPLACE, 'Invalid action');
                        assert.strictEqual(newItems[0].getContents(), 33, 'Invalid newItems');
                        assert.strictEqual(newItemsIndex, 2, 'Invalid newItemsIndex');
                        assert.strictEqual(oldItems[0].getContents(), 3, 'Invalid oldItems');
                        assert.strictEqual(oldItemsIndex, 2, 'Invalid oldItemsIndex');
                        done();
                     } catch (err) {
                        done(err);
                     }
                  };
               projection.subscribe('onCollectionChange', handler);
               projection.getCollection().replace(33, 2);
               projection.unsubscribe('onCollectionChange', handler);
            });

            context('when change a collection', function() {
               var itemsOld = getItems(),
                  itemsNew = [9, 8, 7],
                  cases = [
                     {method: 'assign', action: IBindCollectionProjection.ACTION_RESET, newAt: 0, newItems: itemsNew,  oldAt: 0, oldItems: itemsOld},
                     {method: 'append', action: IBindCollectionProjection.ACTION_ADD, newAt: 4, newItems: itemsNew, oldAt: 0, oldItems: []},
                     {method: 'prepend', action: IBindCollectionProjection.ACTION_ADD, newAt: 0, newItems: itemsNew, oldAt: 0, oldItems: []},
                     {method: 'clear', action: IBindCollectionProjection.ACTION_RESET, newAt: 0, newItems: [], oldAt: 0, oldItems: itemsOld}
                  ];

               while (cases.length) {
                  (function(theCase) {
                     it('should fire after ' + theCase.method, function(done) {
                        var handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                              var i;
                              try {
                                 assert.strictEqual(action, theCase.action, 'Invalid action');

                                 assert.strictEqual(newItems.length, theCase.newItems.length, 'Invalid newItems length');
                                 for (i = 0; i < theCase.newItems.length; i++) {
                                    assert.strictEqual(newItems[i].getContents(), theCase.newItems[i], 'Invalid newItems[' + i + ']');
                                 }
                                 assert.strictEqual(newItemsIndex, theCase.newAt, 'Invalid newItemsIndex');

                                 assert.strictEqual(oldItems.length, theCase.oldItems.length, 'Invalid oldItems length');
                                 for (i = 0; i < theCase.oldItems.length; i++) {
                                    assert.strictEqual(oldItems[i].getContents(), theCase.oldItems[i], 'Invalid oldItems[' + i + ']');
                                 }
                                 assert.strictEqual(oldItemsIndex, theCase.oldAt, 'Invalid oldItemsIndex');

                                 done();
                              } catch (err) {
                                 done(err);
                              }
                           },
                           list = new ObservableList({
                              items: itemsOld.slice()
                           }),
                           projection = new CollectionProjection({
                              collection: list
                           });

                        projection.subscribe('onCollectionChange', handler);
                        projection.getCollection()[theCase.method](itemsNew);
                        projection.unsubscribe('onCollectionChange', handler);
                     });
                  })(cases.shift());
               }
            });

            it('should fire after sort the projection', function(done) {
               var list = new ObservableList({
                     items: getItems()
                  }),
                  expectedNewItems = [[1], [2], [4]],
                  expectedNewIndexes = [3, 2, 0],
                  expectedOldItems = expectedNewItems,
                  expectedOldIndexes = [0, 0, 1],
                  projection = new CollectionProjection({
                     collection: list
                  }),
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     try {
                        assert.strictEqual(action, IBindCollectionProjection.ACTION_MOVE, 'Invalid action');

                        assert.deepEqual($ws.helpers.map(newItems, function(item) {
                           return item.getContents();
                        }), expectedNewItems[fireId], 'Invalid newItems');
                        assert.strictEqual(newItemsIndex, expectedNewIndexes[fireId], 'Invalid newItemsIndex');

                        assert.deepEqual($ws.helpers.map(oldItems, function(item) {
                           return item.getContents();
                        }), expectedOldItems[fireId], 'Invalid oldItems');
                        assert.strictEqual(oldItemsIndex, expectedOldIndexes[fireId], 'Invalid oldItemsIndex');

                        if (fireId === expectedNewItems.length - 1) {
                           done();
                        }
                     } catch (err) {
                        done(err);
                     }
                     fireId++;
                  },
                  fireId = 0;
               projection.subscribe('onCollectionChange', handler);
               projection.setSort(sort);
               projection.unsubscribe('onCollectionChange', handler);
            });

            it('should fire after sort the projection if items moved forward', function(done) {
               var list = new ObservableList({
                     items: [1, 2, 4, 5, 6, 3, 7, 8, 9, 10]
                  }),
                  expectedNewItems = [[4, 5, 6]],
                  expectedNewIndexes = [3],
                  expectedOldIndexes = [2],
                  projection = new CollectionProjection({
                     collection: list
                  }),
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     try {
                        assert.strictEqual(action, IBindCollectionProjection.ACTION_MOVE, 'Invalid action');

                        assert.deepEqual($ws.helpers.map(newItems, function(item) {
                           return item.getContents();
                        }), expectedNewItems[fireId], 'Invalid newItems');
                        assert.strictEqual(newItemsIndex, expectedNewIndexes[fireId], 'Invalid newItemsIndex');

                        if (fireId === expectedNewItems.length - 1) {
                           done();
                        }
                     } catch (err) {
                        done(err);
                     }
                     fireId++;
                  },
                  fireId = 0;
               projection.subscribe('onCollectionChange', handler);
               projection.setSort(function(a, b) {
                     return a.item >= b.item ? 1 : -1;
                  }
               );
               projection.unsubscribe('onCollectionChange', handler);
            });

            it('should fire after filter the projection', function(done) {
               var list = new ObservableList({
                     items: getItems()
                  }),
                  sortedItems = getSortedItems(),
                  projection = new CollectionProjection({
                     collection: list
                  }),
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     try {
                        assert.strictEqual(action, IBindCollectionProjection.ACTION_REMOVE, 'Invalid action');
                        assert.strictEqual(newItems.length, 0, 'Invalid newItems');
                        assert.strictEqual(newItemsIndex, 0, 'Invalid newItemsIndex');
                        assert.notEqual(outsideItems.indexOf(oldItems[0].getContents()), -1, 'Invalid oldItems');
                        assert.strictEqual(oldItemsIndex, fireId, 'Invalid oldItemsIndex');
                        if (fireId === firesToBeDone) {
                           done();
                        }
                     } catch (err) {
                        done(err);
                     }
                     fireId++;
                  },
                  fireId = 0,
                  firesToBeDone = 1;
               projection.subscribe('onCollectionChange', handler);
               projection.setFilter(filter);
               projection.unsubscribe('onCollectionChange', handler);
            });
         });
      });
   }
);
