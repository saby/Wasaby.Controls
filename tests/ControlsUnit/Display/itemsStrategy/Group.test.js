/* global define, describe, it, assert, beforeEach, afterEach */
define([
   'Types/_display/itemsStrategy/Group',
   'Types/_display/GroupItem',
   'Types/_display/CollectionItem',
   'Types/_display/TreeItem'
], function(
   Group,
   GroupItem,
   CollectionItem,
   TreeItem
) {
   'use strict';

   Group = Group.default;
   GroupItem = GroupItem.default;
   CollectionItem = CollectionItem.default;
   TreeItem = TreeItem.default;

   describe('Types/_display/itemsStrategy/Group', function() {
      var getSource = function(items) {
            var wrapItem = function(item) {
                  return new TreeItem({
                     contents: item
                  });
               },
               wraps = items.map(wrapItem);

            return {
               options: {foo: 'bar'},
               get count() {
                  return wraps.length;
               },
               get items() {
                  return wraps.slice();
               },
               at: function(index) {
                  return wraps[index];
               },
               getDisplayIndex: function(index) {
                  return index;
               },
               getCollectionIndex: function(index) {
                  return index;
               },
               splice: function(start, deleteCount, added) {
                  Array.prototype.splice.apply(
                     items,
                     [start, deleteCount].concat(added)
                  );
                  return Array.prototype.splice.apply(
                     wraps,
                     [start, deleteCount].concat(added.map(wrapItem))
                  );
               },
               invalidate: function() {
               },
               reset: function() {
                  items.length = 0;
               },
               getSorters: function() {
                  return [];
               }
            };
         },
         items,
         source,
         strategy;

      beforeEach(function() {
         items = ['one', 'two', 'three'];
         source = getSource(items);
         strategy = new Group({source: source});
      });

      afterEach(function() {
         items = undefined;
         source = undefined;
         strategy = undefined;
      });

      describe('.options', function() {
         it('should return the source options', function() {
            assert.strictEqual(strategy.options, source.options);
         });
      });

      describe('.at()', function() {
         it('should return item', function() {
            source.items.forEach(function(item, index) {
               assert.strictEqual(strategy.at(index), item);
            });
         });

         it('should return group before item', function() {
            var strategy = new Group({
                  source: source,
                  handler: function() {
                     return 'foo';
                  }
               }),
               expected = [
                  'foo',
                  source.items[0].getContents(),
                  source.items[1].getContents(),
                  source.items[2].getContents()
               ];

            assert.instanceOf(strategy.at(0), GroupItem);
            expected.forEach(function(item, index) {
               assert.strictEqual(strategy.at(index).getContents(), item);
            });
         });

         it('should throw an ReferenceError if index is out of bounds', function() {
            assert.throws(function() {
               strategy.at(-1);
            }, ReferenceError);

            assert.throws(function() {
               strategy.at(strategy.count);
            }, ReferenceError);
         });
      });

      describe('.count', function() {
         it('should return items count', function() {
            assert.strictEqual(strategy.count, source.items.length);
         });

         it('should return items count with groups', function() {
            var strategy = new Group({
               source: source,
               handler: function(item) {
                  return item;
               }
            });
            assert.strictEqual(strategy.count, 2 * source.items.length);
         });
      });

      describe('.items', function() {
         it('should return source items', function() {
            assert.deepEqual(strategy.items, source.items);
         });

         it('should return items with groups', function() {
            var strategy = new Group({
                  source: source,
                  handler: function(item) {
                     return '#' + item;
                  }
               }),
               expected = [];

            source.items.forEach(function(item) {
               expected.push('#' + item.getContents());
               expected.push(item.getContents());
            });

            assert.deepEqual(strategy.items.map(function(item) {
               return item.getContents();
            }), expected);
         });

         it('should place groups before their items', function() {
            var items = [
                  {id: 'a', group: 'one'},
                  {id: 'b', group: 'two'},
                  {id: 'c', group: 'one'},
                  {id: 'd', group: 'two'}
               ],
               source = getSource(items),
               strategy = new Group({
                  source: source,
                  handler: function(item) {
                     return item.group;
                  }
               }),
               expected = [
                  'one',
                  items[0],
                  items[2],
                  'two',
                  items[1],
                  items[3]
               ];

            assert.deepEqual(strategy.items.map(function(item) {
               return item.getContents();
            }), expected);
         });

         it('should return items after group has gone', function() {
            var items = ['one', 'two', 'three'];
            var source = getSource(items);
            var strategy = new Group({
               source: source,
               handler: function(item) {
                  return '#' + item;
               }
            });

            ['#one', 'one', '#two', 'two', '#three', 'three'].forEach(function(expect, index) {
               assert.strictEqual(strategy.items[index].getContents(), expect);
            });

            source.splice(1, 1, ['four']);
            strategy.invalidate();

            ['#one', 'one', '#four', 'four', '#three', 'three'].forEach(function(expect, index) {
               assert.strictEqual(strategy.items[index].getContents(), expect);
            });
         });
      });

      describe('.splice()', function() {
         it('should add items', function() {
            var items = [1, 2],
               count = strategy.count;
            strategy.splice(0, 0, items);
            assert.strictEqual(strategy.count, items.length + count);
         });

         it('should add items before first group', function() {
            var strategy = new Group({
                  source: source,
                  handler: function(item) {
                     return '#' + item;
                  }
               }),
               newItems = ['four', 'five'],
               expected = ['#four', 'four', '#five', 'five', '#one', 'one', '#two', 'two', '#three', 'three'];

            strategy.splice(0, 0, newItems);
            expected.forEach(function(expect, index) {
               assert.strictEqual(strategy.at(index).getContents(), expect);
            });
            assert.strictEqual(strategy.count, expected.length);
         });

         it('should add items after first group', function() {
            var strategy = new Group({
                  source: source,
                  handler: function(item) {
                     return '#' + item;
                  }
               }),
               newItems = ['four', 'five'],
               expected = ['#one', 'one', '#four', 'four', '#five', 'five', '#two', 'two', '#three', 'three'];

            strategy.splice(1, 0, newItems);
            expected.forEach(function(expect, index) {
               assert.strictEqual(strategy.at(index).getContents(), expect);
            });
            assert.strictEqual(strategy.count, expected.length);
         });

         it('should add items after last group', function() {
            var strategy = new Group({
                  source: source,
                  handler: function(item) {
                     return '#' + item;
                  }
               }),
               newItems = ['four', 'five'],
               expected = ['#one', 'one', '#two', 'two', '#three', 'three', '#four', 'four', '#five', 'five'];

            strategy.splice(items.length, 0, newItems);
            expected.forEach(function(expect, index) {
               assert.strictEqual(strategy.at(index).getContents(), expect);
            });
            assert.strictEqual(strategy.count, expected.length);
         });

         it('should remove item and group', function() {
            var strategy = new Group({
                  source: source,
                  handler: function(item) {
                     return '#' + item;
                  }
               }),
               expected = ['#two', 'two', '#three', 'three'];

            strategy.splice(0, 1, []);
            expected.forEach(function(expect, index) {
               assert.strictEqual(strategy.at(index).getContents(), expect);
            });
            assert.strictEqual(strategy.count, expected.length);
         });

         it('should remove item and keep group', function() {
            var strategy = new Group({
                  source: source,
                  handler: function() {
                     return '#foo';
                  }
               }),
               expected = ['#foo', 'two', 'three'];

            strategy.splice(0, 1, []);
            expected.forEach(function(expect, index) {
               assert.strictEqual(strategy.at(index).getContents(), expect);
            });
            assert.strictEqual(strategy.count, expected.length);
         });
      });

      describe('.reset()', function() {
         it('should reset group items', function() {
            var strategy = new Group({
                  source: source,
                  handler: function(item) {
                     return '#' + item;
                  }
               }),
               oldItems = strategy.items,
               newItems;

            strategy.reset();
            newItems = strategy.items;

            oldItems.forEach(function(item, index) {
               if (item instanceof GroupItem) {
                  assert.notEqual(newItems[index], oldItems[index]);
                  assert.equal(newItems[index].getContents(), oldItems[index].getContents());
               } else {
                  assert.strictEqual(newItems[index], oldItems[index]);
               }
            });
         });
      });

      describe('.getDisplayIndex()', function() {
         it('should return valid index', function() {
            var strategy = new Group({
               source: source,
               handler: function(item) {
                  return '#' + item;
               }
            });

            source.items.forEach(function(item, index) {
               assert.strictEqual(
                  strategy.getDisplayIndex(index),
                  1 + 2 * index
               );
            });
         });

         it('should return last index', function() {
            var strategy = new Group({
               source: source,
               handler: function() {
                  return 'foo';
               }
            });

            assert.strictEqual(
               strategy.getDisplayIndex(strategy.count),
               strategy.count
            );
         });

         it('should return valid index after group has gone', function() {
            var items = ['one', 'two', 'three'];
            var source = getSource(items);
            var strategy = new Group({
               source: source,
               handler: function(item) {
                  return '#' + item;
               }
            });

            [1, 3, 5].forEach(function(expect, index) {
               assert.strictEqual(strategy.getDisplayIndex(index), expect);
            });

            source.splice(1, 1, ['four']);
            strategy.invalidate();

            [1, 3, 5].forEach(function(expect, index) {
               assert.strictEqual(strategy.getDisplayIndex(index), expect);
            });
         });
      });

      describe('.getCollectionIndex()', function() {
         it('should return valid index', function() {
            var strategy = new Group({
               source: source,
               handler: function(item) {
                  return '#' + item;
               }
            });

            strategy.items.forEach(function(item, index) {
               assert.strictEqual(
                  strategy.getCollectionIndex(index),
                  index % 2 ? (index - 1) / 2 : -1
               );
            });
         });

         it('should return -1 if index out of bounds', function() {
            var strategy = new Group({
               source: source,
               handler: function() {
                  return 'foo';
               }
            });

            assert.strictEqual(
               strategy.getCollectionIndex(strategy.count),
               -1
            );
         });

         it('should return valid index after group has gone', function() {
            var items = ['one', 'two', 'three'];
            var source = getSource(items);
            var strategy = new Group({
               source: source,
               handler: function(item) {
                  return '#' + item;
               }
            });

            [-1, 0, -1, 1, -1, 2].forEach(function(expect, index) {
               assert.strictEqual(strategy.getCollectionIndex(index), expect);
            });

            source.splice(1, 1, ['four']);
            strategy.invalidate();

            [-1, 0, -1, 1, -1, 2].forEach(function(expect, index) {
               assert.strictEqual(strategy.getCollectionIndex(index), expect);
            });
         });
      });

      describe('::sortItems', function() {
         it('should return original items order if handler is not presented', function() {
            var items = [{}, {}, {}],
               groups = [new GroupItem()],
               options = {
                  display: {},
                  groups: groups,
                  handler: null
               },
               expected = [0, 1, 2],
               given = Group.sortItems(items, options);

            assert.deepEqual(given, expected);
         });

         it('should create single group', function() {
            var items = [
                  new CollectionItem({contents: 'one'}),
                  new CollectionItem({contents: 'two'}),
                  new CollectionItem({contents: 'three'})
               ],
               groups = [],
               options = {
                  display: {},
                  groups: groups,
                  handler: function() {
                     return 'foo';
                  }
               },
               expected = [0, 1, 2, 3],
               given = Group.sortItems(items, options);

            assert.deepEqual(given, expected);

            assert.equal(groups.length, 1);
            assert.equal(groups[0].getContents(), 'foo');
         });

         it('should create several groups', function() {
            var items = [
                  new CollectionItem({contents: 'one'}),
                  new CollectionItem({contents: 'two'}),
                  new CollectionItem({contents: 'three'})
               ],
               groups = [],
               options = {
                  display: {},
                  groups: groups,
                  handler: function(item) {
                     return '#' + item;
                  }
               },
               expected = [0, 3, 1, 4, 2, 5],
               expectedGroups = ['#one', '#two', '#three'],
               given = Group.sortItems(items, options);

            assert.deepEqual(given, expected);

            assert.equal(groups.length, 3);
            groups.forEach(function(group, index) {
               assert.equal(group.getContents(), expectedGroups[index]);
            });
         });

         it('should use old groups', function() {
            var items = [
                  new CollectionItem({contents: 'one'}),
                  new CollectionItem({contents: 'two'}),
                  new CollectionItem({contents: 'three'})
               ],
               groups = [
                  new GroupItem({contents: '#one'}),
                  new GroupItem({contents: '#three'})
               ],
               options = {
                  display: {},
                  groups: groups,
                  handler: function(item) {
                     return '#' + item;
                  }
               },
               expected = [0, 3, 2, 4, 1, 5],
               expectedGroups = ['#one', '#three', '#two'],
               oldGroups = groups.slice(),
               given = Group.sortItems(items, options);

            assert.deepEqual(given, expected);

            assert.equal(groups.length, 3);
            groups.forEach(function(group, index) {
               assert.equal(group.getContents(), expectedGroups[index]);
            });

            assert.deepEqual(groups.slice(0, 2), oldGroups);
         });
      });

      describe('.toJSON()', function() {
         it('should serialize the strategy', function() {
            var json = strategy.toJSON();

            assert.strictEqual(json.state.$options.source, source);
            assert.strictEqual(json.state._groups.length, 0);
         });

         it('should serialize itemsOrder if handler is defined', function() {
            var strategy = new Group({
                  source: source,
                  handler: function() {
                     return '#foo';
                  }
               }),
               json = strategy.toJSON();

            assert.strictEqual(json.state._itemsOrder.length, source.count + 1);
         });
      });

      describe('::fromJSON()', function() {
         it('should clone the strategy', function() {
            var groups = strategy.groups,
               clone = Group.fromJSON(strategy.toJSON());

            assert.deepEqual(clone.groups, groups);
         });
      });
   });
});
