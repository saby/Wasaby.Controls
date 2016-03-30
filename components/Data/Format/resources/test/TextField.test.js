/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.TextField'
   ], function (TextField) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.TextField', function() {
         var field;

         beforeEach(function() {
            field = new TextField();
         });

         afterEach(function() {
            field = undefined;
         });

         describe('.getDefaultValue()', function() {
            it('should return null by default', function() {
               assert.isNull(field.getDefaultValue());
            });
         });

         describe('.clone()', function() {
            it('should return the clone', function() {
               var clone = field.clone();
               assert.instanceOf(clone, TextField);
               assert.isTrue(field.isEqual(clone));
            });
         });
      });
   }
);
