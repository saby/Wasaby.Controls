/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
   ['js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Model'],
   function (List, Model) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Collection.List', function() {
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
            items;

         beforeEach(function() {
            items = getItems();
         });

         afterEach(function() {
            items = undefined;
         });

         describe('$constructor()', function() {
            it('should create list with items', function() {
               var list = new List({
                  items: items
               });
               assert.strictEqual(
                  items[0],
                  list.at(0)
               );
               assert.strictEqual(
                  items[6],
                  list.at(6)
               );
            });

            it('should throw an error on invalid argument', function() {
               assert.throw(function() {
                  var list = new List({
                     items: {}
                  });
               });
               assert.throw(function() {
                  var list = new List({
                     items: ''
                  });
               });
               assert.throw(function() {
                  var list = new List({
                     items: 0
                  });
               });
               assert.throw(function() {
                  var list = new List({
                     items: undefined
                  });
               });
            });
         });

         describe('.getEnumerator()', function() {
            it('should return an list enumerator', function() {
               var list = new List();
               assert.isTrue($ws.helpers.instanceOfModule(list.getEnumerator(), 'SBIS3.CONTROLS.Data.Collection.ArrayEnumerator'));
            });
         });

         describe('.each()', function() {
            it('should return every item in original order', function() {
               var list = new List({
                     items: items
                  }),
                  ok = true,
                  index = 0;
               list.each(function(item) {
                  if (item !== items[index]) {
                     ok = false;
                  }
                  index++;
               });
               assert.isTrue(ok);
            });

            it('should return every item index in original order', function() {
               var list = new List({
                     items: items
                  }),
                  ok = true,
                  index = 0;
               list.each(function(item, innerIndex) {
                  if (index !== innerIndex) {
                     ok = false;
                  }
                  index++;
               });
               assert.isTrue(ok);
            });

            it('should use the given context', function() {
               var list = new List({
                     items: items
                  }),
                  ok = true,
                  context = {
                     'blah': 'blah'
                  };
               list.each(function() {
                  if (this !== context) {
                     ok = false;
                  }
               }, context);
               assert.isTrue(ok);
            });
         });

         describe('.append()', function() {
            it('should append items', function() {
               var list = new List({
                     items: items.slice()
                  }),
                  moreItems = [{
                     'Ид': 8
                  }, {
                     'Ид': 9
                  }],
                  ok = true;

               list.append(new List({
                  items: moreItems
               }));

               for (var i = 0, count = items.length + moreItems.length; i < count; i++) {
                  var item = i < items.length ? items[i] : moreItems[i - items.length];
                  if (list.at(i) !== item) {
                     ok = false;
                     break;
                  }
               }
               assert.isTrue(ok);
            });

            it('should append items when items is array', function() {
               var list = new List({
                     items: items.slice()
                  }),
                  moreItems = [{
                     'Ид': 8
                  }, {
                     'Ид': 9
                  }],
                  ok = true;

               list.append(moreItems);

               for (var i = 0, count = items.length + moreItems.length; i < count; i++) {
                  var item = i < items.length ? items[i] : moreItems[i - items.length];
                  if (list.at(i) !== item) {
                     ok = false;
                     break;
                  }
               }
               assert.isTrue(ok);
            });

            it('should throw an error on invalid argument', function() {
               assert.throw(function() {
                  var list = new List();
                  list.append({});
               });
               assert.throw(function() {
                  var list = new List();
                  list.append('');
               });
               assert.throw(function() {
                  var list = new List();
                  list.append(0);
               });
               assert.throw(function() {
                  var list = new List();
                  list.append();
               });
            });
         });

         describe('.prepend()', function() {
            it('should prepend items', function() {
               var list = new List({
                     items: items.slice()
                  }),
                  moreItems = [{
                     'Ид': 8
                  }, {
                     'Ид': 9
                  }],
                  ok = true;

               list.prepend(new List({
                  items: moreItems
               }));

               for (var i = 0, count = items.length + moreItems.length; i < count; i++) {
                  var item = i < moreItems.length ? moreItems[i] : items[i - moreItems.length];
                  if (list.at(i) !== item) {
                     ok = false;
                     break;
                  }
               }
               assert.isTrue(ok);
            });

            it('should prepend items when items is array', function() {
               var list = new List({
                     items: items.slice()
                  }),
                  moreItems = [{
                     'Ид': 8
                  }, {
                     'Ид': 9
                  }],
                  ok = true;

               list.prepend(moreItems);

               for (var i = 0, count = items.length + moreItems.length; i < count; i++) {
                  var item = i < moreItems.length ? moreItems[i] : items[i - moreItems.length];
                  if (list.at(i) !== item) {
                     ok = false;
                     break;
                  }
               }
               assert.isTrue(ok);
            });

            it('should throw an error on invalid argument', function() {
               assert.throw(function() {
                  var list = new List();
                  list.prepend({});
               });
               assert.throw(function() {
                  var list = new List();
                  list.prepend('');
               });
               assert.throw(function() {
                  var list = new List();
                  list.prepend(0);
               });
               assert.throw(function() {
                  var list = new List();
                  list.prepend();
               });
            });
         });

         describe('.assign()', function() {
            it('should replace items', function() {
               var list = new List({
                     items: items
                  }),
                  moreItems = [{
                     'Ид': 8
                  }, {
                     'Ид': 9
                  }],
                  ok = true;

               list.assign(new List({
                  items: moreItems
               }));

               for (var i = 0; i < moreItems.length; i++) {
                  if (list.at(i) !== moreItems[i]) {
                     ok = false;
                     break;
                  }
               }
               assert.isTrue(ok);
            });

            it('should replace items when items is array', function() {
               var list = new List({
                     items: items
                  }),
                  moreItems = [{
                     'Ид': 8
                  }, {
                     'Ид': 9
                  }],
                  ok = true;

               list.assign(moreItems);

               for (var i = 0; i < moreItems.length; i++) {
                  if (list.at(i) !== moreItems[i]) {
                     ok = false;
                     break;
                  }
               }
               assert.isTrue(ok);
            });

            it('should clear items', function() {
               var list = new List({
                     items: items
                  }),
                  ok = true;

               list.assign();

               list.each(function() {
                  ok = false;
               });

               assert.isTrue(ok);
            });

            it('should throw an error on invalid argument', function() {
               assert.throw(function() {
                  var list = new List();
                  list.assign({});
               });
               assert.throw(function() {
                  var list = new List();
                  list.assign('a');
               });
               assert.throw(function() {
                  var list = new List();
                  list.assign(1);
               });
            });
         });

         describe('.clear()', function() {
            it('should reset items count', function() {
               var list = new List({
                     items: items
                  });
               list.clear();
               assert.strictEqual(list.getCount(), 0);
            });
            it('should return an empty enumerator', function() {
               var list = new List({
                  items: items
               });
               list.clear();
               assert.isUndefined(list.getEnumerator().getNext());
            });
            it('should not call callback in each', function() {
               var list = new List({
                  items: items
               });
               list.clear();
               list.each(function() {
                  throw new Error('Callback was called');
               });
            });
         });

         describe('.add()', function() {
            it('should append an item', function() {
               var list = new List({
                     items: items.slice()
                  }),
                  item = {
                     'Ид': 8
                  };

               list.add(item);
               assert.strictEqual(list.at(items.length), item);
            });

            it('should prepend an item', function() {
               var list = new List({
                     items: items
                  }),
                  item = {
                     'Ид': 9
                  };

               list.add(item, 0);
               assert.strictEqual(list.at(0), item);
            });

            it('should insert an item at given position', function() {
               var list = new List({
                     items: items
                  }),
                  item = {
                     'Ид': 10
                  };

               list.add(item, 3);
               assert.strictEqual(list.at(3), item);
            });

            it('should throw an error on invalid index', function() {
               assert.throw(function() {
                  var list = new List();
                  list.add({}, -1);
               });
               assert.throw(function() {
                  var list = new List();
                  list.add({}, items.length);
               });
            });
         });

         describe('.at()', function() {
            it('should return an item at given position', function() {
               var list = new List({
                  items: items
               });

               for (var i = 0; i < items.length; i++) {
                  assert.strictEqual(list.at(i), items[i]);
               }
            });

            it('should return undefined on invalid index', function() {
               var list = new List();
               assert.isUndefined(list.at(-1));
               assert.isUndefined(list.at(items.length));
            });
         });

         describe('.remove()', function() {
            it('should remove given item', function() {
               var list = new List({
                  items: items
               });

               for (var i = items.length; i > 0; i--) {
                  list.remove(items[i - 1]);
                  assert.isUndefined(list.at(i - 1));
               }
            });

            it('should return false if item is undefined', function() {
               var list = new List();
               assert.isFalse(list.remove({}));
               assert.isFalse(list.remove(10));
            });
         });

         describe('.removeAt()', function() {
            it('should remove item at given position', function() {
               var list = new List({
                  items: items
               });

               for (var i = items.length; i > 0; i--) {
                  list.removeAt(i - 1);
                  assert.isUndefined(list.at(i - 1));
               }
            });

            it('should throw an error on on invalid index', function() {
               assert.throw(function() {
                  var list = new List();
                  list.removeAt(-1);
               });
               assert.throw(function() {
                  var list = new List();
                  list.removeAt(0);
               });
               assert.throw(function() {
                  var list = new List({
                     items: items
                  });
                  list.removeAt(items.length);
               });
            });
         });

         describe('.replace()', function() {
            it('should replace item at given position', function() {
               var list = new List({
                  items: items
               });

               for (var i = 0; i < items.length; i++) {
                  var item = {i: i};
                  list.replace(item, i);
                  assert.strictEqual(item, list.at(i));
               }
            });

            it('should throw an error on invalid index', function() {
               assert.throw(function() {
                  var list = new List();
                  list.replace({}, -1);
               });
               assert.throw(function() {
                  var list = new List();
                  list.replace({}, 0);
               });
               assert.throw(function() {
                  var list = new List({
                     items: items
                  });
                  list.replace({}, items.length);
               });
            });
         });

         describe('.getIndex()', function() {
            it('should return an index of given item', function() {
               var list = new List({
                  items: items.slice()
               });
               for (var i = 0; i < items.length; i++) {
                  assert.strictEqual(i, list.getIndex(items[i]));
               }

               var item = {a: 'b'};
               list.add(item, 5);
               assert.strictEqual(5, list.getIndex(item));
            });

            it('should return -1 for undefined item', function() {
               var list = new List();
               assert.strictEqual(-1, list.getIndex({c: 'd'}));
               assert.strictEqual(-1, list.getIndex(''));
               assert.strictEqual(-1, list.getIndex(0));
               assert.strictEqual(-1, list.getIndex(false));
            });

            it('should return  an index of given hashable item', function() {
               var newItems = [];
               $ws.helpers.forEach(items, function(item){
                  newItems.push(new Model({
                     idProperty:'Ид',
                     rawData: item
                  }));
               });

               var list = new List({
                  items: newItems
               });

               for (var i = 0; i < newItems.length; i++) {
                  assert.strictEqual(i, list.getIndex(newItems[i]));
               }

               list.removeAt(0);
               for (var i = 0; i < newItems.length; i++) {
                  assert.strictEqual(i, list.getIndex(newItems[i]), 'after reindex');
               }
            });

            it('should return  an -1 for undefined hashable item', function() {
               var newItems = [];
               $ws.helpers.forEach(items, function(item){
                  newItems.push(new Model({
                     idProperty: 'Ид',
                     rawData: item
                  }));
               });
               var list = new List({
                  items: newItems
               });
               assert.strictEqual(-1, list.getIndex(new Model({
                  idProperty: 'Ид',
                  rawData: {'Ид': 100500}
               })));
               assert.strictEqual(-1, list.getIndex(new Model({
                  idProperty: 'Ид',
                  rawData: items[1]
               })));
            });
         });

         describe('.getCount()', function() {
            it('should return same count like initial collection', function() {
               var list = new List({
                  items: items.slice()
               });
               assert.strictEqual(items.length, list.getCount());
            });

            it('should change after modifications', function() {
               var list = new List();
               assert.strictEqual(0, list.getCount());
               list.add({});
               assert.strictEqual(1, list.getCount());
               list.add({}, 0);
               assert.strictEqual(2, list.getCount());
               list.add({}, 1);
               assert.strictEqual(3, list.getCount());

               list.assign();
               assert.strictEqual(0, list.getCount());

               list.assign(new List({
                  items: [1, 2]
               }));
               assert.strictEqual(2, list.getCount());

               list.append(new List({
                  items: [3, 4, 5]
               }));
               assert.strictEqual(5, list.getCount());

               list.remove(2);
               assert.strictEqual(4, list.getCount());

               list.removeAt(1);
               assert.strictEqual(3, list.getCount());

               list.replace(10, 2);
               assert.strictEqual(3, list.getCount());
            });
         });

         describe('.equals()', function () {
            it('should return true for list with same instances', function () {
               var listA = new List({
                     items: items.slice()
                  }),
                  listB = new List({
                     items: items.slice()
                  });
               assert.isTrue(listA.equals(listB));
            });

            it('should return false for list with different instances', function () {
               var listA = new List({
                     items: getItems()
                  }),
                  listB = new List({
                     items: getItems()
                  });
               assert.isFalse(listA.equals(listB));
            });

            it('should return false for list with different count', function () {
               var listA = new List({
                     items: items.slice()
                  }),
                  listB = new List({
                     items: items.slice()
                  });
               listB.removeAt(5);
               assert.isFalse(listA.equals(listB));
            });

            it('should return false for not a list', function () {
               var list = new List();
               assert.isFalse(list.equals());
               assert.isFalse(list.equals(null));
               assert.isFalse(list.equals(false));
               assert.isFalse(list.equals(true));
               assert.isFalse(list.equals(0));
               assert.isFalse(list.equals(1));
               assert.isFalse(list.equals(''));
               assert.isFalse(list.equals('a'));
               assert.isFalse(list.equals({}));
               assert.isFalse(list.equals([]));
            });
         });

         describe('.toJSON()', function () {
            it('should serialize a list', function () {
               var list = new List({
                     items: items
                  }),
                  json = list.toJSON();
               assert.strictEqual(json.module, 'SBIS3.CONTROLS.Data.Collection.List');
               assert.isNumber(json.id);
               assert.isTrue(json.id > 0);
               assert.deepEqual(json.state._options, list._options);
               assert.deepEqual(json.state._items, list._items);
            });
         });
      });
   }
);
