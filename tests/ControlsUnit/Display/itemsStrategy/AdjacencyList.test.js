/* global define, describe, it, assert, beforeEach, afterEach */
define([
   'Types/_display/itemsStrategy/AdjacencyList',
   'Types/_display/CollectionItem',
   'Types/_display/TreeItem',
   'Types/_display/GroupItem'
], function(
   AdjacencyList,
   CollectionItem,
   TreeItem,
   GroupItem
) {
   'use strict';

   AdjacencyList = AdjacencyList.default;
   CollectionItem = CollectionItem.default;
   TreeItem = TreeItem.default;
   GroupItem = GroupItem.default;

   describe('Types/_display/itemsStrategy/AdjacencyList', function() {
      var getDisplay = function(root) {
            return {
               getRoot: function() {
                  return this.root || (this.root = new TreeItem({
                     contents: root
                  }));
               },
               createItem: function(options) {
                  options.node = options.contents.node;
                  options.hasChildren = options.contents.hasChildren;
                  return new TreeItem(options);
               }
            };
         },
         getSource = function(items, root) {
            var wrapItem = function(item) {
                  if (item instanceof CollectionItem) {
                     return item;
                  }
                  return new TreeItem({
                     contents: item
                  });
               },
               display = getDisplay(root),
               options = {
                  display: display,
                  items: items
               },
               wraps = items.map(wrapItem);

            return {
               get options() {
                  return options;
               },
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
                  this.invalidated = true;
               },
               reset: function() {
                  wraps.length = 0;
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
         items = [1, 2, 3];
         source = getSource(items);
         strategy = new AdjacencyList({source: source});
      });

      afterEach(function() {
         source = undefined;
         strategy = undefined;
      });

      describe('.items', function() {
         it('should return items translated from source items contents', function() {
            var items = [
                  {id: 1},
                  {id: 2},
                  {id: 3}
               ],
               source = getSource(items),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               });

            strategy.items.forEach(function(item, index) {
               assert.notEqual(item, source.items[index]);
               assert.strictEqual(item.getContents(), items[index]);
            });

            assert.strictEqual(strategy.items.length, items.length);
         });

         it('should keep groups order', function() {
            var items = [
                  new GroupItem({contents: 'a'}),
                  {id: 1},
                  new GroupItem({contents: 'b'}),
                  {id: 2},
                  {id: 3}
               ],
               source = getSource(items),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expectedInstances = [GroupItem, TreeItem, GroupItem, TreeItem, TreeItem],
               expectedContents = ['a', items[1], 'b', items[3], items[4]];

            strategy.items.forEach(function(item, index) {
               assert.instanceOf(item, expectedInstances[index]);
               assert.strictEqual(item.getContents(), expectedContents[index]);
            });

            assert.strictEqual(strategy.items.length, expectedInstances.length);
         });

         it('should keep groups order on several tree levels', function() {
            var items = [
                  new GroupItem({contents: 'a'}),
                  {id: 11, pid: 1},
                  {id: 1, pid: 0},
                  new GroupItem({contents: 'b'}),
                  {id: 2, pid: 0}
               ],
               source = getSource(items, 0),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = ['a', items[2], items[1], 'b', items[4]];

            strategy.items.forEach(function(item, index) {
               assert.strictEqual(item.getContents(), expected[index]);
            });

            assert.strictEqual(strategy.items.length, expected.length);
         });

         it('should revert parents\'s group if any child join another group', function() {
            var items = [
                  new GroupItem({contents: 'a'}),
                  {id: 1, pid: 0},
                  {id: 2, pid: 0},
                  new GroupItem({contents: 'b'}),
                  {id: 11, pid: 1}
               ],
               source = getSource(items, 0),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = ['a', items[1], 'b', items[4], 'a', items[2]];

            strategy.items.forEach(function(item, index) {
               assert.strictEqual(item.getContents(), expected[index]);
            });

            assert.strictEqual(strategy.items.length, expected.length);
         });

         it('should dont\'t revert parents\'s group if any child join another group but next parent\'s sibling has his own group', function() {
            var items = [
                  new GroupItem({contents: 'a'}),
                  {id: 1, pid: 0},
                  new GroupItem({contents: 'c'}),
                  {id: 2, pid: 0},
                  new GroupItem({contents: 'b'}),
                  {id: 11, pid: 1}
               ],
               source = getSource(items, 0),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = ['a', items[1], 'b', items[5], 'c', items[3]];

            strategy.items.forEach(function(item, index) {
               assert.strictEqual(item.getContents(), expected[index]);
            });

            assert.strictEqual(strategy.items.length, expected.length);
         });

         it('should set valid parent if node joins another group then it\'s previous sibling', function() {
            var items = [
                  new GroupItem({contents: 'a'}),
                  {id: 1},
                  new GroupItem({contents: 'b'}),
                  {id: 2},
                  new GroupItem({contents: 'aa'}),
                  {id: 11, pid: 1},
                  new GroupItem({contents: 'bb'}),
                  {id: 22, pid: 2}
               ],
               source = getSource(items),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               given;

            given = strategy.items.map(function(item) {
               return item.getContents();
            });
            assert.deepEqual(given, ['a', items[1], 'aa', items[5], 'b', items[3], 'bb', items[7]]);

            given = strategy.items.map(function(item) {
               return item instanceof GroupItem ? item.getContents() : item.getParent().getContents();
            });
            assert.deepEqual(given, ['a', undefined, 'aa', items[1], 'b', undefined, 'bb', items[3]]);
         });
      });

      describe('.at()', function() {
         beforeEach(function() {
            items = [
               {id: 1, pid: 0},
               {id: 2, pid: 0},
               {id: 3, pid: 0},
               {id: 4, pid: 0},
               {id: 11, pid: 1},
               {id: 31, pid: 3},
               {id: 21, pid: 2},
               {id: 41, pid: 4},
               {id: 111, pid: 11}
            ];
            source = getSource(items, 0);
            strategy = new AdjacencyList({
               source: source,
               idProperty: 'id',
               parentProperty: 'pid'
            });
         });

         afterEach(function() {
            items = undefined;
            strategy = undefined;
         });

         it('should return items in hierarchical order for root as Number', function() {
            var expected = [1, 11, 111, 2, 21, 3, 31, 4, 41],
               index;

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should return items in hierarchical order for root as object', function() {
            var root = {id: 0},
               source = getSource(items, root),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = [1, 11, 111, 2, 21, 3, 31, 4, 41],
               index;

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should return items in hierarchical order for root as null', function() {
            var rootId = null,
               items = [
                  {id: 1, pid: rootId},
                  {id: 2, pid: rootId},
                  {id: 11, pid: 1},
                  {id: 21, pid: 2}
               ],
               source = getSource(items, rootId),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = [1, 11, 2, 21],
               index;

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
         });


         it('should return items in hierarchical order for root as null and children related to undefined', function() {
            var rootId = null,
               items = [
                  {id: 1},
                  {id: 2},
                  {id: 11, pid: 1},
                  {id: 21, pid: 2}
               ],
               source = getSource(items, rootId),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = [items[0], items[2], items[1], items[3]],
               expectedParent = [rootId, items[0], rootId, items[1]],
               item,
               index;

            for (index = 0; index < expected.length; index++) {
               item = strategy.at(index);
               assert.strictEqual(item.getContents(), expected[index]);
               assert.strictEqual(item.getParent().getContents(), expectedParent[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should return items in hierarchical order for specified root', function() {
            var rootId = 1,
               source = getSource(items, rootId),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = [11, 111],
               index;

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should lookup for various value types to root', function() {
            var items = [
                  {id: 1, pid: 0},
                  {id: 2, pid: '0'},
                  {id: 11, pid: 1},
                  {id: 12, pid: '1'}
               ],
               source = getSource(items, 0),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = [1, 11, 12, 2],
               index;

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should work with scalar root wrapped using Object', function() {
            var root = new Number(0), // eslint-disable-line no-new-wrappers
               items = [
                  {id: 11, pid: 1},
                  {id: 1, pid: 0},
                  {id: 2, pid: 0},
                  {id: 21, pid: 2}
               ],
               source = getSource(items, root),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = [1, 11, 2, 21],
               index;

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should return only root items if idProperty is not injected', function() {
            var strategy = new AdjacencyList({
                  source: source,
                  parentProperty: 'pid'
               }),
               expected = [1, 2, 3, 4],
               index;

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should return different TreeItem instances for repeats and duplicates', function() {
            var rootId = 0,
               items = [
                  {id: 1, pid: 0},
                  {id: 2, pid: 0},
                  {id: 11, pid: 1},
                  {id: 111, pid: 11},
                  {id: 11, pid: 2}
               ],
               source = getSource(items, rootId),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = [1, 11, 111, 2, 11, 111],
               treeItems = [],
               treeItem,
               index;

            for (index = 0; index < expected.length; index++) {
               treeItem = strategy.at(index);
               assert.equal(treeItems.indexOf(treeItem), -1);
               treeItems.push(treeItem);

               assert.strictEqual(treeItem.getContents().id, expected[index]);
            }

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should throw an Error if index is out of bounds', function() {
            var strategy = new AdjacencyList({
               source: source,
               idProperty: 'id',
               parentProperty: 'pid'
            });

            assert.throws(function() {
               strategy.at(99);
            });
         });

         it('should return a TreeItem as node', function() {
            var items = [{node: true}],
               source = getSource(items),
               strategy = new AdjacencyList({
                  source: source,
                  nodeProperty: 'node'
               });

            assert.isTrue(strategy.at(0).isNode());
         });

         it('should return a TreeItem as leaf', function() {
            var items = [{node: false}],
               source = getSource(items),
               strategy = new AdjacencyList({
                  source: source,
                  nodeProperty: 'node'
               });

            assert.isFalse(strategy.at(0).isNode());
         });

         it('should return a TreeItem with children', function() {
            var items = [{hasChildren: true}],
               source = getSource(items),
               strategy = new AdjacencyList({
                  source: source
               });

            assert.isTrue(strategy.at(0).isHasChildren());
         });

         it('should return a TreeItem without children', function() {
            var items = [{hasChildren: false}],
               source = getSource(items),
               strategy = new AdjacencyList({
                  source: source
               });

            assert.isFalse(strategy.at(0).isHasChildren());
         });
      });

      describe('.count', function() {
         beforeEach(function() {
            items = [
               {id: 1, pid: 0},
               {id: 3, pid: 0},
               {id: 11, pid: 1},
               {id: 21, pid: 2}
            ];
            source = getSource(items, 0);
         });

         afterEach(function() {
            items = undefined;
            source = undefined;
         });

         it('should return valid items count', function() {
            var strategy = new AdjacencyList({
               source: source,
               idProperty: 'id',
               parentProperty: 'pid'
            });

            assert.strictEqual(strategy.count, 3);
         });

         it('should return valid items count if idProperty is not injected', function() {
            var strategy = new AdjacencyList({
               source: source,
               parentProperty: 'pid'
            });

            assert.strictEqual(strategy.count, 2);
         });

         it('should return 0 if parentProperty is not injected', function() {
            var strategy = new AdjacencyList({
               source: source,
               idProperty: 'id'
            });

            assert.strictEqual(strategy.count, 0);
         });
      });

      describe('.splice()', function() {
         beforeEach(function() {
            items = [
               {id: 1, pid: 0},
               {id: 2, pid: 0},
               {id: 3, pid: 0},
               {id: 21, pid: 2}
            ];
            source = getSource(items, 0);
         });

         afterEach(function() {
            items = undefined;
            source = undefined;
         });

         it('should insert an item in valid order', function() {
            var strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               newItem = {id: 11, pid: 1},
               position = 3,
               expected = [1, 11, 2, 21, 3],
               index,
               result;

            result = strategy.splice(position, 0, [newItem]);

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(result.length, 0);

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should add items in valid order', function() {
            var strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               newItems = [
                  {id: 11, pid: 1},
                  {id: 12, pid: 1},
                  {id: 22, pid: 2},
                  {id: 4, pid: 0}
               ],
               itemsCount = items.length,
               expected = [1, 11, 12, 2, 21, 22, 3, 4],
               index,
               result;

            result = strategy.splice(itemsCount, 0, newItems);

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(result.length, 0);

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should push item after latest source item', function() {
            var items = [
                  {id: 1, pid: 0},
                  {id: 2, pid: 0},
                  {id: 31, pid: 3}
               ],
               source = getSource(items, 0),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               newItem = {id: 4, pid: 0};

            strategy.splice(items.length, 0, [newItem]);

            assert.strictEqual(items[items.length - 1], newItem);
         });

         it('should add items duplicates in valid order', function() {
            var strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               newItems = [{id: 2, pid: 0}],
               itemsCount = items.length,
               expected = [1, 2, 21, 3, 2, 21],
               displayItems = [],
               item,
               index,
               result;

            result = strategy.splice(itemsCount, 0, newItems);

            for (index = 0; index < expected.length; index++) {
               item = strategy.at(index);
               assert.strictEqual(item.getContents().id, expected[index]);

               assert.equal(displayItems.indexOf(item), -1);
               displayItems.push(item);
            }

            assert.strictEqual(result.length, 0);

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should remove items in valid order', function() {
            var items = [
                  {id: 1, pid: 0},
                  {id: 2, pid: 0},
                  {id: 3, pid: 0},
                  {id: 21, pid: 2},
                  {id: 211, pid: 21},
                  {id: 22, pid: 2}
               ],
               source = getSource(items, 0),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               displayAt = 2,
               removeAt = 3,
               expected = [1, 2, 22, 3],
               index,
               result;

            //Force create item
            assert.strictEqual(strategy.at(displayAt).getContents().id, 21);

            result = strategy.splice(removeAt, 1, []);

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].getContents().id, 21);

            assert.strictEqual(strategy.count, expected.length);
         });

         it('should return removed items', function() {
            var items = [
               {id: 1, pid: 0},
               {id: 2, pid: 0},
               {id: 3, pid: 0},
               {id: 4, pid: 0},
            ];
            var source = getSource(items, 0);
            var strategy = new AdjacencyList({
               source: source,
               idProperty: 'id',
               parentProperty: 'pid'
            });

            var expected = [strategy.at(1), strategy.at(2)];
            var result = strategy.splice(1, 2, []);

            assert.deepEqual(result, expected);
         });

         it('should return undefined for item that\'s not created yet', function() {
            var items = [
                  {id: 1, pid: 0},
                  {id: 2, pid: 0}
               ],
               source = getSource(items, 0),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               result;

            result = strategy.splice(0, 1, []);

            assert.deepEqual(result.length, 1);
            assert.isUndefined(result[0]);
         });

         it('should remove duplicates in valid order', function() {
            var items = [
                  {id: 1, pid: 0},
                  {id: 2, pid: 0},
                  {id: 3, pid: 0},
                  {id: 2, pid: 0},
                  {id: 21, pid: 2}
               ],
               source = getSource(items, 0),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               removeAt = 1,
               expected = [1, 3, 2, 21],
               index,
               result;

            //Force create item
            assert.strictEqual(strategy.at(removeAt).getContents().id, 2);

            result = strategy.splice(removeAt, 1, []);

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.at(index).getContents().id, expected[index]);
            }

            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].getContents().id, 2);

            assert.strictEqual(strategy.count, expected.length);
         });
      });

      describe('.invalidate', function() {
         beforeEach(function() {
            items = [];
            source = getSource(items, 0);
         });

         afterEach(function() {
            items = undefined;
            source = undefined;
         });

         it('should call source method', function() {
            var strategy = new AdjacencyList({
               source: source,
               idProperty: 'id',
               parentProperty: 'pid'
            });

            assert.isUndefined(source.invalidated);
            strategy.invalidate();
            assert.isTrue(source.invalidated);
         });

         it('should change items order and revert it back', function() {
            var items = [
                  {id: 1},
                  {id: 2},
                  {id: 11, pid: 1},
                  {id: 22, pid: 2}
               ],
               source = getSource(items),
               strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               affectedItems,
               given,
               expected;

            given = strategy.items.map(function(item) {
               return item.getContents().id;
            });
            expected = [1, 11, 2, 22];
            assert.deepEqual(given, expected);

            affectedItems = [
               items[1],
               items[3],
               items[0]
            ];
            source = getSource(affectedItems);
            strategy._options.source = source;
            strategy.invalidate();

            given = strategy.items.map(function(item) {
               return item.getContents().id;
            });
            expected = [2, 22, 1];
            assert.deepEqual(given, expected);

            affectedItems = items;
            source = getSource(affectedItems);
            strategy._options.source = source;
            strategy.invalidate();

            given = strategy.items.map(function(item) {
               return item.getContents().id;
            });
            expected = [1, 11, 2, 22];
            assert.deepEqual(given, expected);
         });
      });

      describe('.getDisplayIndex()', function() {
         beforeEach(function() {
            items = [
               {id: 1, pid: 0},
               {id: 2, pid: 0},
               {id: 3, pid: 0},
               {id: 11, pid: 1},
               {id: 21, pid: 2}
            ];
            source = getSource(items, 0);
         });

         afterEach(function() {
            items = undefined;
            source = undefined;
         });

         it('should return valid item index', function() {
            var strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = [0, 2, 4, 1, 3],
               index;

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.getDisplayIndex(index), expected[index]);
            }
         });

         it('should return index witch source index consideration', function() {
            var strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = [2, 4, 1, 3],
               index;

            source.getDisplayIndex = function(index) {
               return index + 1;
            };

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.getDisplayIndex(index), expected[index]);
            }
         });
      });

      describe('.getCollectionIndex()', function() {
         beforeEach(function() {
            items = [
               {id: 1, pid: 0},
               {id: 2, pid: 0},
               {id: 3, pid: 0},
               {id: 11, pid: 1},
               {id: 21, pid: 2}
            ];
            source = getSource(items, 0);
         });

         afterEach(function() {
            items = undefined;
            source = undefined;
         });

         it('should return valid display index', function() {
            var strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = [0, 3, 1, 4, 2],
               index;

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.getCollectionIndex(index), expected[index]);
            }
         });

         it('should return index witch source index consideration', function() {
            var strategy = new AdjacencyList({
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               }),
               expected = [3, 1, 4, 2],
               index;

            source.getCollectionIndex = function(index) {
               return index + 1;
            };

            for (index = 0; index < expected.length; index++) {
               assert.strictEqual(strategy.getCollectionIndex(index), expected[index]);
            }
         });
      });

      describe('.toJSON()', function() {
         it('should serialize the strategy', function() {
            var source = getSource([1, 2, 3]),
               options = {
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               },
               strategy = new AdjacencyList(options),
               items = strategy.items,
               json = strategy.toJSON();

            assert.strictEqual(json.state.$options, options);
            assert.strictEqual(json.state._items, items);
            assert.strictEqual(json.state._itemsOrder.length, items.length);
            assert.strictEqual(json.state._parentsMap.length, items.length);
         });
      });

      describe('::fromJSON()', function() {
         it('should clone the strategy', function() {
            var source = getSource([1, 2, 3]),
               options = {
                  source: source,
                  idProperty: 'id',
                  parentProperty: 'pid'
               },
               strategy = new AdjacencyList(options),
               items = strategy.items,
               clone;

            clone = AdjacencyList.fromJSON(strategy.toJSON());

            assert.deepEqual(clone.items, items);
         });
      });
   });
});
