/* global define, describe, it, assert, beforeEach, afterEach */
define([
   'Types/_display/itemsStrategy/Root'
], function(
   Root
) {
   'use strict';

   Root = Root.default;

   describe('Types/_display/itemsStrategy/Root', function() {
      var getSource = function(items) {
            return {
               options: {foo: 'bar'},
               get count() {
                  return items.length;
               },
               get items() {
                  return items.slice();
               },
               at: function(index) {
                  return items[index];
               },
               getDisplayIndex: function(index) {
                  return index;
               },
               getCollectionIndex: function(index) {
                  return index;
               },
               splice: function(start, deleteCount, added) {
                  return Array.prototype.splice.apply(
                     items,
                     [start, deleteCount].concat(added || [])
                  );
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
         root,
         source,
         strategy;

      beforeEach(function() {
         items = ['one', 'two', 'three'];
         root = function() {
            return 'root';
         };
         source = getSource(items);
         strategy = new Root({
            source: source,
            root: root
         });
      });

      afterEach(function() {
         items = undefined;
         root = undefined;
         source = undefined;
         strategy = undefined;
      });

      describe('.getOptions()', function() {
         it('should return the source options', function() {
            assert.strictEqual(strategy.options, source.options);
         });
      });

      describe('.at()', function() {
         it('should return root at 0', function() {
            assert.strictEqual(strategy.at(0), root());
         });

         it('should return item with offset', function() {
            source.items.forEach(function(item, index) {
               assert.strictEqual(strategy.at(1 + index), item);
            });
         });
      });

      describe('.count', function() {
         it('should return items count with root', function() {
            assert.strictEqual(strategy.count, 1 + source.items.length);
         });
      });

      describe('.items', function() {
         it('should return an items with root', function() {
            assert.deepEqual(strategy.items, [root()].concat(source.items));
         });
      });

      describe('.getDisplayIndex()', function() {
         it('should return an index with offset', function() {
            assert.strictEqual(strategy.getDisplayIndex(0), 1);
            assert.strictEqual(strategy.getDisplayIndex(1), 2);
         });
      });

      describe('.getCollectionIndex()', function() {
         it('should return an index with offset', function() {
            assert.strictEqual(strategy.getCollectionIndex(1), 0);
            assert.strictEqual(strategy.getCollectionIndex(2), 1);
         });
      });

      describe('.splice()', function() {
         it('should add items', function() {
            var items = [1, 2],
               count = strategy.count;
            strategy.splice(0, 0, items);
            assert.strictEqual(strategy.count, items.length + count);
         });
      });

      describe('.reset()', function() {
         it('should reset items', function() {
            strategy.reset();
            assert.strictEqual(strategy.items.length, 1);
         });
      });
   });
});
