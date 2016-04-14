/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.IdentityField'
   ], function (IdentityField) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.IdentityField', function() {
         var field;

         beforeEach(function() {
            field = new IdentityField();
         });

         afterEach(function() {
            field = undefined;
         });

         describe('.getDefaultValue()', function() {
            it('should return 0 by default', function() {
               assert.deepEqual(field.getDefaultValue(), [null]);
            });
         });

         describe('.clone()', function() {
            it('should return the clone', function() {
               var clone = field.clone();
               assert.instanceOf(clone, IdentityField);
               assert.isTrue(field.isEqual(clone));
            });
         });
      });
   }
);
