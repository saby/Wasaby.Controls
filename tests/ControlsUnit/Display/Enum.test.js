/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'Types/_display/Enum',
   'Types/_collection/Enum'
], function(
   EnumDisplay,
   EnumType
) {
   'use strict';

   EnumDisplay = EnumDisplay.default;
   EnumType = EnumType.default;

   describe('Types/_display/Enum', function() {
      var dict,
         localeDict,
         collection,
         display,
         holeyDict,
         holeyCollection,
         holeyDisplay;

      beforeEach(function() {
         dict = ['one', 'two', 'three'];
         localeDict = ['uno', 'dos', 'tres'];
         holeyDict = {'1': 'one', '4': 'two', '6': 'three'};

         collection = new EnumType({
            dictionary: dict
         });
         holeyCollection = new EnumType({
            dictionary: holeyDict
         });
         display = new EnumDisplay({
            collection: collection
         });

         holeyDisplay = new EnumDisplay({
            collection: holeyCollection
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
         it('should throw an error for not IEnum', function() {
            assert.throws(function() {
               new EnumDisplay({
                  collection: []
               });
            });
            assert.throws(function() {
               new EnumDisplay({
                  collection: {}
               });
            });
            assert.throws(function() {
               new EnumDisplay({
                  collection: null
               });
            });
            assert.throws(function() {
               new EnumDisplay();
            });
         });

         it('should take current from the Enum', function() {
            assert.strictEqual(display.getCurrent(), undefined);
            assert.strictEqual(display.getCurrentPosition(), -1);

            collection.set(1);
            var displayToo = new EnumDisplay({
               collection: collection
            });
            assert.strictEqual(displayToo.getCurrent().getContents(), collection.getAsValue());
            assert.strictEqual(displayToo.getCurrentPosition(), collection.get());
         });
      });

      describe('.each()', function() {
         it('should return original values', function() {
            var collection = new EnumType({
                  dictionary: dict
               }),
               display = new EnumDisplay({
                  collection: collection
               });

            display.each(function(item, index) {
               assert.strictEqual(item.getContents(), dict[index]);
            });
         });

         it('should return localized values', function() {
            var collection = new EnumType({
                  dictionary: dict,
                  localeDictionary: localeDict
               }),
               display = new EnumDisplay({
                  collection: collection
               });

            display.each(function(item, index) {
               assert.strictEqual(item.getContents(), localeDict[index]);
            });
         });
      });

      describe('.setCurrent()', function() {
         it('should change current of the Enum', function() {
            var index,
               item;

            for (index = 0; index < dict.length; index++) {
               item = display.at(index);
               display.setCurrent(item);
               assert.strictEqual(collection.get(), index);
               assert.strictEqual(collection.getAsValue(), item.getContents());
            }
         });
      });

      describe('.setCurrentPosition()', function() {
         it('should change current of the Enum', function() {
            var index,
               item;

            for (index = 0; index < dict.length; index++) {
               display.setCurrentPosition(index);
               item = display.getCurrent();
               assert.strictEqual(collection.get(), index);
               assert.strictEqual(collection.getAsValue(), item.getContents());
            }
         });

         it('should reset the Enum', function() {
            var collection = new EnumType({
                  dictionary: dict,
                  index: 0
               }),
               display = new EnumDisplay({
                  collection: collection
               });

            assert.strictEqual(collection.get(), 0);
            display.setCurrentPosition(-1);
            assert.isNull(collection.get());
         });
      });

      describe('.moveToNext()', function() {
         it('should change current of the Enum', function() {
            var index,
               item;

            while (display.moveToNext()) {
               index = display.getCurrentPosition();
               item = display.getCurrent();
               assert.strictEqual(collection.get(), index);
               assert.strictEqual(collection.getAsValue(), item.getContents());
            }
         });
      });

      describe('.moveToPrevious()', function() {
         it('should change current of the Enum', function() {
            var index,
               item;

            display.moveToLast();
            while (display.moveToPrevious()) {
               index = display.getCurrentPosition();
               item = display.getCurrent();
               assert.strictEqual(collection.get(), index);
               assert.strictEqual(collection.getAsValue(), item.getContents());
            }
         });
      });

      describe('.getIndexBySourceItem()', function() {
         it('should return value index', function() {
            for (var index = 0; index < dict.length; index++) {
               assert.equal(display.getIndexBySourceItem(dict[index]), index);
            }
         });

         it('should return localized value index', function() {
            var collection = new EnumType({
                  dictionary: dict,
                  localeDictionary: localeDict
               }),
               display = new EnumDisplay({
                  collection: collection
               });

            for (var index = 0; index < localeDict.length; index++) {
               assert.equal(display.getIndexBySourceItem(localeDict[index]), index);
            }
         });
      });

      describe('.getSourceIndexByItem()', function() {
         it('should return localized value index', function() {
            var collection = new EnumType({
                  dictionary: dict,
                  localeDictionary: localeDict
               }),
               display = new EnumDisplay({
                  collection: collection
               }),
               item = display.at(0);

            assert.equal(display.getSourceIndexByItem(item), 0);
         });

         it('should return right source index if enum have holes', function() {
            var item = holeyDisplay.at(1);
            assert.equal(holeyDisplay.getSourceIndexByItem(item), 4);
         });
      });

      describe('.getIndexBySourceIndex()', function() {
         it('should return right source index if enum have holes', function() {
            assert.equal(holeyDisplay.getIndexBySourceIndex(4), 1);
         });
      });

      describe('.subscribe()', function() {
         it('should trigger "onCurrentChange" if current of the Enum changed', function() {
            var given = {},
               handler = function(event, newCurrent, oldCurrent, newPosition, oldPosition) {
                  given.newCurrent = newCurrent;
                  given.oldCurrent = oldCurrent;
                  given.newPosition = newPosition;
                  given.oldPosition = oldPosition;
               };

            display.subscribe('onCurrentChange', handler);
            collection.set(0);
            display.unsubscribe('onCurrentChange', handler);

            assert.strictEqual(given.newCurrent.getContents(), collection.getAsValue());
            assert.strictEqual(given.oldCurrent, undefined);
            assert.strictEqual(given.newPosition, collection.get());
            assert.strictEqual(given.oldPosition, -1);
         });
      });
   });
});
