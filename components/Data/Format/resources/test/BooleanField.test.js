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
            it('should return null by default', function() {
               assert.isNull(field.getDefaultValue());
            });
         });
      });
   }
);
