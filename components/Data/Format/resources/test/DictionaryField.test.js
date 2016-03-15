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
      });
   }
);
