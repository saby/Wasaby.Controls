/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'Types/_display/FlagsItem',
   'Types/_display/Flags',
   'Types/_collection/Flags'
], function(
   FlagsItem,
   FlagsDisplay,
   FlagsType
) {
   'use strict';

   FlagsItem = FlagsItem.default;
   FlagsDisplay = FlagsDisplay.default;
   FlagsType = FlagsType.default;

   describe('Types/_display/FlagsItem', function() {
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

      describe('.isSelected()', function() {
         it('should return value from the Flags', function() {
            collection.set('two', true);
            collection.set('three', false);

            display.each(function(item) {
               assert.strictEqual(
                  item.isSelected(),
                  collection.get(item.getContents())
               );
            });
         });

         it('should return value from localized Flags', function() {
            var dict = ['one', 'two', 'three'];
            var localeDict = ['uno', 'dos', 'tres'];
            var expected = [true, false, true];

            collection = new FlagsType({
               dictionary: dict,
               localeDictionary: localeDict,
               values: expected
            });

            var display = new FlagsDisplay({
               collection: collection
            });

            display.each(function(item, index) {
               assert.strictEqual(
                  item.isSelected(),
                  expected[index]
               );
            });
         });
      });

      describe('.setSelected()', function() {
         it('should translate value to the Flags', function() {
            var values = [true, false, null];

            display.each(function(item, index) {
               item.setSelected(values[index]);

               assert.strictEqual(
                  item.isSelected(),
                  values[index]
               );

               assert.strictEqual(
                  collection.get(item.getContents()),
                  values[index]
               );
            });
         });

         it('should translate localized value to the Flags', function() {
            var dict = ['one', 'two', 'three'];
            var localeDict = ['uno', 'dos', 'tres'];
            var values = [true, false, null];

            collection = new FlagsType({
               dictionary: dict,
               localeDictionary: localeDict
            });

            var display = new FlagsDisplay({
               collection: collection
            });

            display.each(function(item, index) {
               item.setSelected(values[index]);

               assert.strictEqual(
                  item.isSelected(),
                  values[index]
               );

               assert.strictEqual(
                  collection.get(item.getContents(), true),
                  values[index]
               );
            });
         });
      });
   });
});
