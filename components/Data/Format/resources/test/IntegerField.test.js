/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.IntegerField'
   ], function (IntegerField) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.IntegerField', function() {
         var field;

         beforeEach(function() {
            field = new IntegerField();
         });

         afterEach(function() {
            field = undefined;
         });

         describe('.getDefaultValue()', function() {
            it('should return 0 by default', function() {
               assert.strictEqual(field.getDefaultValue(), 0);
            });
         });

         describe('.clone()', function() {
            it('should return the clone', function() {
               var clone = field.clone();
               assert.instanceOf(clone, IntegerField);
               assert.isTrue(field.isEqual(clone));
            });
         });
      });
   }
);
