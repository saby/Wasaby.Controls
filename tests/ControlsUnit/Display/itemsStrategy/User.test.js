/* global define, describe, it, assert, beforeEach, afterEach */
define([
   'Types/_display/itemsStrategy/User',
   'Types/_display/CollectionItem'
], function(
   User,
   CollectionItem
) {
   'use strict';

   User = User.default;
   CollectionItem = CollectionItem.default;

   describe('Types/_display/itemsStrategy/User', function() {
      var wrapItem = function(item) {
            return new CollectionItem({
               contents: item
            });
         },
         getStrategy = function(source, handlers) {
            return new User({
               source: source,
               handlers: handlers
            });
         },
         getSource = function(items) {
            var wraps = items.map(wrapItem);

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
                  added = added || [];
                  Array.prototype.splice.apply(
                     items,
                     [start, deleteCount].concat(added)
                  );
                  return Array.prototype.splice.apply(
                     wraps,
                     [start, deleteCount].concat(added.map(wrapItem))
                  );
               },
               reset: function() {
                  items.length = 0;
                  wraps.length = 0;
               },
               getSorters: function() {
                  return [];
               }
            };
         },
         source,
         strategy;

      beforeEach(function() {
         source = getSource(['one', 'two', 'three']);
         strategy = getStrategy(source, []);
      });

      afterEach(function() {
         source = undefined;
         strategy = undefined;
      });

      describe('.options', function() {
         it('should return the source options', function() {
            assert.strictEqual(strategy.options, source.options);
         });
      });

      describe('.at()', function() {
         it('should return every item', function() {
            source.items.forEach(function(item, index) {
               assert.strictEqual(strategy.at(index), item);
            });
         });

         it('should return direct items order', function() {
            var source = getSource([1, 2, 3]),
               strategy = getStrategy(source, [function(a, b) {
                  return a.item.getContents() > b.item.getContents();
               }]),
               expected = [1, 2, 3];

            expected.forEach(function(item, index) {
               assert.strictEqual(strategy.at(index).getContents(), item);
            });
         });

         it('should return reversed items order', function() {
            var source = getSource([1, 2, 3]),
               strategy = getStrategy(source, [function(a, b) {
                  return b.item.getContents() - a.item.getContents();
               }]),
               expected = [3, 2, 1];

            expected.forEach(function(item, index) {
               assert.strictEqual(strategy.at(index).getContents(), item);
            });
         });
      });

      describe('.count', function() {
         it('should return items count', function() {
            assert.strictEqual(strategy.count, source.items.length);
         });
      });

      describe('.items', function() {
         it('should return an items', function() {
            assert.deepEqual(strategy.items, source.items);
         });

         it('should return direct items order', function() {
            var source = getSource([1, 2, 3]),
               strategy = getStrategy(source, [function(a, b) {
                  return a.item.getContents() > b.item.getContents();
               }]),
               items = strategy.items,
               expected = [1, 2, 3];

            items.forEach(function(item, index) {
               assert.strictEqual(item.getContents(), expected[index]);
            });
            assert.equal(items.length, expected.length);
         });


         it('should return direct items order', function() {
            var source = getSource([1, 2, 3]),
               strategy = getStrategy(source, [function(a, b) {
                  return b.item.getContents() - a.item.getContents();
               }]),
               items = strategy.items,
               expected = [3, 2, 1];

            items.forEach(function(item, index) {
               assert.strictEqual(item.getContents(), expected[index]);
            });
            assert.equal(items.length, expected.length);
         });
      });

      describe('.splice()', function() {
         it('should add items', function() {
            var items = [1, 2],
               count = strategy.count;
            strategy.splice(0, 0, items);
            assert.strictEqual(strategy.count, items.length + count);
         });

         it('should push item after latest source item', function() {
            var items = [1, 2, 3],
               source = getSource(items),
               strategy = getStrategy(source, []),
               newItem = 4;

            strategy.splice(strategy.count, 0, [newItem]);

            assert.strictEqual(items[items.length - 1], newItem);
         });

         it('should remove items', function() {
            strategy.splice(1, 2);
            assert.strictEqual(strategy.at(0), source.items[0]);
            assert.strictEqual(strategy.at(1), source.items[2]);
         });
      });

      describe('.reset()', function() {
         it('should reset items', function() {
            strategy.reset();
            assert.strictEqual(strategy.items.length, 0);
         });
      });

      describe('.getDisplayIndex()', function() {
         it('should return equal indices', function() {
            source.items.forEach(function(item, index) {
               assert.strictEqual(strategy.getDisplayIndex(index), index);
            });
         });

         it('should return direct index', function() {
            var source = getSource([1, 2, 3]),
               strategy = getStrategy(source, [function(a, b) {
                  return a.item.getContents() > b.item.getContents();
               }]),
               expected = [0, 1, 2];

            expected.forEach(function(strategyIndex, collectionIndex) {
               assert.strictEqual(strategy.getDisplayIndex(collectionIndex), strategyIndex);
            });
         });

         it('should return reversed index', function() {
            var source = getSource([1, 2, 3]),
               strategy = getStrategy(source, [function(a, b) {
                  return b.item.getContents() - a.item.getContents();
               }]),
               expected = [2, 1, 0];

            expected.forEach(function(strategyIndex, collectionIndex) {
               assert.strictEqual(strategy.getDisplayIndex(collectionIndex), strategyIndex);
            });
         });
      });

      describe('.getCollectionIndex()', function() {
         it('should return equal indices', function() {
            source.items.forEach(function(item, index) {
               assert.strictEqual(strategy.getCollectionIndex(index), index);
            });
         });

         it('should return direct index', function() {
            var source = getSource([1, 2, 3]),
               strategy = getStrategy(source, [function(a, b) {
                  return a.item.getContents() > b.item.getContents();
               }]),
               expected = [0, 1, 2];

            expected.forEach(function(collectionIndex, strategyIndex) {
               assert.strictEqual(strategy.getCollectionIndex(collectionIndex), strategyIndex);
            });
         });

         it('should return reversed index', function() {
            var source = getSource([1, 2, 3]),
               strategy = getStrategy(source, [function(a, b) {
                  return b.item.getContents() - a.item.getContents();
               }]),
               expected = [2, 1, 0];

            expected.forEach(function(collectionIndex, strategyIndex) {
               assert.strictEqual(strategy.getCollectionIndex(collectionIndex), strategyIndex);
            });
         });
      });

      describe('.toJSON()', function() {
         it('should serialize the strategy', function() {
            var source = getSource([1, 2, 3]),
               handlers = [],
               strategy = getStrategy(source, handlers),
               items = strategy.items,
               json = strategy.toJSON();

            assert.strictEqual(json.state.$options.source, source);
            assert.strictEqual(json.state.$options.handlers, handlers);
            assert.strictEqual(json.state._itemsOrder.length, items.length);
         });

         it('should serialize itemsOrder if handlers is defined', function() {
            var source = getSource([1, 2, 3]),
               handlers = [function() {}],
               strategy = getStrategy(source, handlers),
               json = strategy.toJSON();

            assert.strictEqual(json.state._itemsOrder.length, source.count);
         });
      });

      describe('::fromJSON()', function() {
         it('should clone the strategy', function() {
            var source = getSource([1, 2, 3]),
               handlers = [],
               strategy = getStrategy(source, handlers),
               items = strategy.items,
               clone;

            clone = User.fromJSON(strategy.toJSON());

            assert.deepEqual(clone.items, items);
         });
      });
   });
});
