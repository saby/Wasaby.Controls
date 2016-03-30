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
            it('should return an empty string by default', function() {
               assert.strictEqual(field.getDefaultValue(), '');
            });
         });

         describe('.clone()', function() {
            it('should return the clone', function() {
               var clone = field.clone();
               assert.instanceOf(clone, StringField);
               assert.isTrue(field.isEqual(clone));
            });
         });
      });
   }
);
