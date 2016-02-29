/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Format.Field'
   ], function (Field) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Format.Field', function() {
         var field;

         beforeEach(function() {
            field = new Field();
         });

         afterEach(function() {
            field = undefined;
         });

         describe('.getDefaultValue()', function() {
            it('should return null', function() {
               assert.isNull(field.getDefaultValue());
            });
            it('should return the value passed to the constructor', function() {
               var def = 'a',
                  field = new Field({
                     defaultValue: def
                  });
               assert.strictEqual(field.getDefaultValue(), def);
            });
         });

         describe('.setDefaultValue()', function() {
            it('should set the default value', function() {
               var value = 'a';
               field.setDefaultValue(value);
               assert.strictEqual(field.getDefaultValue(), value);
            });
         });

         describe('.getName()', function() {
            it('should return empty string', function() {
               assert.strictEqual(field.getName(), '');
            });
            it('should return the value passed to the constructor', function() {
               var name = 'a',
                  field = new Field({
                     name: name
                  });
               assert.strictEqual(field.getName(), name);
            });
         });

         describe('.setName()', function() {
            it('should set the name', function() {
               var name = 'a';
               field.setName(name);
               assert.strictEqual(field.getName(), name);
            });
         });

         describe('.isNullable()', function() {
            it('should return false', function() {
               assert.isFalse(field.isNullable());
            });
            it('should return the value passed to the constructor', function() {
               var nullable = true,
                  field = new Field({
                     nullable: nullable
                  });
               assert.strictEqual(field.isNullable(), nullable);
            });
         });

         describe('.setNullable()', function() {
            it('should set the nullable option', function() {
               var nullable = true;
               field.setNullable(nullable);
               assert.strictEqual(field.isNullable(), nullable);
            });
         });

         describe('.clone()', function() {
            it('should return the clone', function() {
               var clone = field.clone();
               assert.notEqual(field, clone);
               assert.deepEqual(field, clone);
            });
         });

         describe('.copyFrom()', function() {
            it('should return the same configured object', function() {
               var name = 'a',
                  def = 'b',
                  nullable = true,
                  donor = new Field({
                     name: name,
                     defaultValue: def,
                     nullable: nullable
                  }),
                  acceptor = new Field();
               acceptor.copyFrom(donor);
               assert.strictEqual(donor.getName(), acceptor.getName());
               assert.strictEqual(donor.getDefaultValue(), acceptor.getDefaultValue());
               assert.strictEqual(donor.isNullable(), acceptor.isNullable());
            });
         });

         describe('.isEqual()', function() {
            it('should return true', function() {
               var other = new Field();
               assert.isTrue(field.isEqual(other));
            });
            it('should return false for different module', function() {
               var Ext = Field.extend({}),
                  other = new Ext();
               assert.isFalse(field.isEqual(other));
            });
            it('should return false for different name', function() {
               var other = new Field({
                  name: 'a'
               });
               assert.isFalse(field.isEqual(other));
            });
            it('should return false for different defaultValue', function() {
               var other = new Field({
                  defaultValue: 'a'
               });
               assert.isFalse(field.isEqual(other));
            });
            it('should return false for different nullable', function() {
               var other = new Field({
                  nullable: true
               });
               assert.isFalse(field.isEqual(other));
            });
         });
      });
   }
);
