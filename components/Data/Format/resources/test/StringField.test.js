/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.StringField'
   ], function (StringField) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.StringField', function() {
         var field;

         beforeEach(function() {
            field = new StringField();
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
