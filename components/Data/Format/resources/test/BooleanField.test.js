/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.BooleanField'
   ], function (BooleanField) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.BooleanField', function() {
         var field;

         beforeEach(function() {
            field = new BooleanField();
         });

         afterEach(function() {
            field = undefined;
         });

         describe('.getDefaultValue()', function() {
            it('should return false by default', function() {
               assert.isFalse(field.getDefaultValue());
            });
         });
      });
   }
);
