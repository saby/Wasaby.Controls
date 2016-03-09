/* global beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Types.Enum'
   ], function (Enum) {
      'use strict';

      var getDict = function() {
            return ['one', 'two', 'three'];
         },
         dict,
         testEnum;

      beforeEach(function () {
         dict = getDict();
         testEnum = new Enum({
            dictionary: dict,
            currentValue: 1
         });
      });

      afterEach(function () {
         dict = undefined;
         testEnum = undefined;
      });

      describe('SBIS3.CONTROLS.Data.Types.Enum', function () {
         describe('.$create()', function () {
            it('should create Enum', function () {
               assert.isTrue($ws.helpers.instanceOfModule(testEnum, 'SBIS3.CONTROLS.Data.Types.Enum'));
            });
         });

         it('should init Enums current value', function () {
            assert.equal(testEnum.get(), 1);
         });

         describe('.set()', function () {
            it('should changes enums current value by index', function () {
               testEnum.set(2);
               assert.equal(testEnum.get(), 2);
            });
            it('should changes enums current value to null', function () {
               testEnum.set(null);
               assert.strictEqual(testEnum.get(), null);
            });
            it('should trow exception index out of range', function () {
               assert.throw(function () {
                  testEnum.set(569);
               });
            });
         });

         describe('.setByValue()', function () {
            it('should change enums current value', function () {
               testEnum.setByValue('one');
               assert.equal(testEnum.get(), 0);
            });
            it('should change enums current value to null', function () {
               testEnum.setByValue(null);
               assert.strictEqual(testEnum.get(), null);
            });
            it('should trow exception for not exists value', function () {
               assert.throw(function () {
                  testEnum.setByValue('doesntExistingValue');
               });
            });
         });

         describe('.equals()', function () {
            it('should equals to same dictionary', function () {
               var e = new Enum({
                  dictionary: getDict(),
                  currentValue: testEnum.get()
               });
               assert.isTrue(testEnum.equals(e));
            });
            it('should not equals to different value', function () {
               var e = new Enum({
                  dictionary: getDict(),
                  currentValue: 0
               });
               assert.isFalse(testEnum.equals(e));
            });
            it('should not equals to different dictionary', function () {
               var dict = getDict();
               dict[0] = 'uno';
               var e = new Enum({
                  dictionary: dict,
                  currentValue: testEnum.get()
               });
               assert.isFalse(testEnum.equals(e));
            });
            it('should not equals when not enum', function () {
               assert.isFalse(testEnum.equals());
               assert.isFalse(testEnum.equals(null));
               assert.isFalse(testEnum.equals(false));
               assert.isFalse(testEnum.equals(true));
               assert.isFalse(testEnum.equals(0));
               assert.isFalse(testEnum.equals(1));
               assert.isFalse(testEnum.equals({}));
               assert.isFalse(testEnum.equals([]));
            });
         });
      });
   }
);
