/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.MoneyField'
   ], function (MoneyField) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.MoneyField', function() {
         var field;

         beforeEach(function() {
            field = new MoneyField();
         });

         afterEach(function() {
            field = undefined;
         });

         describe('.getPrecision()', function() {
            it('should return 2 by default', function() {
               assert.strictEqual(field.getPrecision(), 2);
            });
         });
      });
   }
);
