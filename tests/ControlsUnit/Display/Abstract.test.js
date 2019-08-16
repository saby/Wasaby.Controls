/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'Controls/_display/Abstract',
   'Controls/_display/Collection',
   'Controls/_display/Enum',
   'Controls/_display/Flags',
   'Types/collection',
   'Controls/display'
], function(
   Display,
   Collection,
   EnumDisplay,
   FlagsDisplay,
   TypesCollection
) {
   'use strict';

   Display = Display.default;
   Collection = Collection.default;
   const List = TypesCollection.List;
   const EnumType = TypesCollection.Enum;
   EnumDisplay = EnumDisplay.default;
   const FlagsType = TypesCollection.Flags;
   FlagsDisplay = FlagsDisplay.default;

   describe('Controls/_display/Abstract', function() {
      describe('.getDefaultDisplay()', function() {
         it('should return a display', function() {
            var list = new List();

            assert.instanceOf(Display.getDefaultDisplay(list), Display);
         });

         it('should return the special display for Array', function() {
            var options = {idProperty: 'foo'},
               display = Display.getDefaultDisplay([], options);
            assert.instanceOf(display, Collection);
            assert.equal(display.getIdProperty(), options.idProperty);
         });

         it('should return the special display for List', function() {
            var collection = new List(),
               display = Display.getDefaultDisplay(collection);
            assert.instanceOf(display, Collection);
         });

         it('should return the special display for Enum', function() {
            var collection = new EnumType(),
               display = Display.getDefaultDisplay(collection);
            assert.instanceOf(display, EnumDisplay);
         });

         it('should return the special display for Flags', function() {
            var collection = new FlagsType(),
               display = Display.getDefaultDisplay(collection);
            assert.instanceOf(display, FlagsDisplay);
         });

         it('should throw an error for not IEnumerable', function() {
            assert.throws(function() {
               Display.getDefaultDisplay({});
            });
            assert.throws(function() {
               Display.getDefaultDisplay(null);
            });
            assert.throws(function() {
               Display.getDefaultDisplay();
            });
         });

         it('should return various instances', function() {
            var list = new List(),
               displayA = Display.getDefaultDisplay(list),
               displayB = Display.getDefaultDisplay(list);

            assert.notEqual(displayA, displayB);
         });

         it('should return same instances', function() {
            var list = new List(),
               displayA = Display.getDefaultDisplay(list, true),
               displayB = Display.getDefaultDisplay(list, true);

            assert.strictEqual(displayA, displayB);
         });
      });

      describe('.releaseDefaultDisplay()', function() {
         it('should return true if the display has been retrieved as singleton', function() {
            var list = new List(),
               display = Display.getDefaultDisplay(list, true);

            assert.isTrue(Display.releaseDefaultDisplay(display));
         });

         it('should return true if the display has been retrieved as not singleton', function() {
            var list = new List(),
               display = Display.getDefaultDisplay(list);

            assert.isFalse(Display.releaseDefaultDisplay(display));
         });

         it('should destroy the instance after last one was released', function() {
            var list = new List(),
               displayA = Display.getDefaultDisplay(list, true),
               displayB = Display.getDefaultDisplay(list, true);

            Display.releaseDefaultDisplay(displayA);
            assert.isFalse(displayA.destroyed);

            Display.releaseDefaultDisplay(displayB);
            assert.isTrue(displayA.destroyed);
            assert.isTrue(displayB.destroyed);
         });

         it('should force getDefaultDisplay return a new instance after last one was released', function() {
            var list = new List(),
               displayA = Display.getDefaultDisplay(list, true),
               displayB = Display.getDefaultDisplay(list, true),
               displayC;

            Display.releaseDefaultDisplay(displayA);
            Display.releaseDefaultDisplay(displayB);

            displayC = Display.getDefaultDisplay(list, true);
            assert.notEqual(displayC, displayA);
            assert.notEqual(displayC, displayB);
         });
      });
   });
});
