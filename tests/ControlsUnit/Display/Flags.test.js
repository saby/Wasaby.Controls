/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'Types/_display/Flags',
   'Types/_collection/Flags',
   'Core/core-instance'
], function(
   FlagsDisplay,
   FlagsType,
   coreInstance
) {
   'use strict';

   FlagsDisplay = FlagsDisplay.default;
   FlagsType = FlagsType.default;

   describe('Types/_display/Flags', function() {
      var dict, collection, display;

      beforeEach(function() {
         dict = ['one', 'two', 'three'];

         collection = new FlagsType({
            dictionary: dict
         });

         display = new FlagsDisplay({
            collection: collection
         });
      });

      afterEach(function() {
         dict = undefined;

         display.destroy();
         display = undefined;

         collection.destroy();
         collection = undefined;
      });

      describe('.constructor()', function() {
         it('should throw an error for not IFlags', function() {
            assert.throws(function() {
               new FlagsDisplay({
                  collection: []
               });
            });
            assert.throws(function() {
               new FlagsDisplay({
                  collection: {}
               });
            });
            assert.throws(function() {
               new FlagsDisplay({
                  collection: null
               });
            });
            assert.throws(function() {
               new FlagsDisplay();
            });
         });

         it('should take selection from the Flags', function() {
            display.each(function(item) {
               assert.strictEqual(item.isSelected(), collection.get(item.getContents()));
            });

            collection.set('one', true);
            var displayToo = new FlagsDisplay({
               collection: collection
            });
            displayToo.each(function(item) {
               assert.strictEqual(item.isSelected(), collection.get(item.getContents()));
            });
         });
      });

      describe('.each()', function() {
         it('should return FlagsItem', function() {
            display.each(function(item) {
               assert.isTrue(coreInstance.instanceOfModule(item, 'Types/_display/FlagsItem'));
            });
         });
      });

      describe('.subscribe()', function() {
         it('should trigger "onCollectionChange" if flag changed', function() {
            var given = {};
            var handler = function(event, action, newItems, newItemsIndex) {
               given.item = newItems[0];
               given.index = newItemsIndex;
            };

            display.subscribe('onCollectionChange', handler);
            collection.set('one', true);
            display.unsubscribe('onCollectionChange', handler);

            assert.strictEqual(given.item.getContents(), 'one');
            assert.strictEqual(given.index, 0);
         });

         it('should trigger "onCollectionChange" if all flags changed', function() {
            var given = [];
            var handler = function(event, action, items, index) {
               given.push({
                  action: action,
                  items: items,
                  index: index
               });
            };

            display.subscribe('onCollectionChange', handler);
            collection.fromArray([true, true, true]);
            display.unsubscribe('onCollectionChange', handler);

            var expected = [{
               action: 'ch',
               items: [display.at(0)],
               index: 0
            }, {
               action: 'ch',
               items: [display.at(1)],
               index: 1
            }, {
               action: 'ch',
               items: [display.at(2)],
               index: 2
            }];
            assert.deepEqual(given, expected);
         });
      });

      it('should trigger "onCollectionChange" if flag with string index changed', function() {
         var dict = {'1': 'one', '2': 'two', '3': 'three'};

         var collection = new FlagsType({
            dictionary: dict
         });

         var display = new FlagsDisplay({
            collection: collection
         });

         var given = {};
         var handler = function(event, action, newItems, newItemsIndex) {
            given.item = newItems[0];
            given.index = newItemsIndex;
         };

         display.subscribe('onCollectionChange', handler);
         collection.set('two', true);
         display.unsubscribe('onCollectionChange', handler);

         assert.strictEqual(given.item.getContents(), 'two');
         assert.strictEqual(given.index, 1);
      });
   });
});
