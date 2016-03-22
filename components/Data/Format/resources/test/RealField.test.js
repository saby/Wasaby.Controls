/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.RealField'
   ], function (RealField) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.RealField', function() {
         var field;

         beforeEach(function() {
            field = new RealField();
         });

         afterEach(function() {
            field = undefined;
         });

         describe('.getDefaultValue()', function() {
            it('should return 0 by default', function() {
               assert.strictEqual(field.getDefaultValue(), 0);
            });
         });

         describe('.getPrecision()', function() {
            it('should return 16 by default', function() {
               assert.strictEqual(field.getPrecision(), 16);
            });
            it('should return the value passed to the constructor', function() {
               var prec = 3,
                  field = new RealField({
                     precision: prec
                  });
               assert.strictEqual(field.getPrecision(), prec);
            });
         });

         describe('.setPrecision()', function() {
            it('should set the default value', function() {
               var prec = 2;
               field.setPrecision(prec);
               assert.strictEqual(field.getPrecision(), prec);
            });
         });
      });
   }
);
