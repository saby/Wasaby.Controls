/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.TimeIntervalField'
   ], function (TimeIntervalField) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.TimeIntervalField', function() {
         var field;

         beforeEach(function() {
            field = new TimeIntervalField();
         });

         afterEach(function() {
            field = undefined;
         });

         describe('.getDefaultValue()', function() {
            it('should return 0 by default', function() {
               assert.strictEqual(field.getDefaultValue(), 0);
            });
         });
      });
   }
);
