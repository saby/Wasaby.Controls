/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.DictionaryField'
   ], function (DictionaryField) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.DictionaryField', function() {
         var field;

         beforeEach(function() {
            field = new DictionaryField();
         });

         afterEach(function() {
            field = undefined;
         });

         describe('.getDictionary()', function() {
            it('should return null by default', function() {
               assert.isNull(field.getDictionary());
            });
            it('should return the value passed to the constructor', function() {
               var dict = [],
                  field = new DictionaryField({
                     dictionary: dict
                  });
               assert.strictEqual(field.getDictionary(), dict);
            });
         });

         describe('.clone()', function() {
            it('should return the clone', function() {
               var clone = field.clone();
               assert.instanceOf(clone, DictionaryField);
               assert.isTrue(field.isEqual(clone));
               assert.deepEqual(field.getDictionary(), clone.getDictionary());
            });
         });
      });
   }
);
