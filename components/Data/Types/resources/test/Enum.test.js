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
         describe('.constructor()', function () {
            it('should create Enum', function () {
               assert.isTrue($ws.helpers.instanceOfModule(testEnum, 'SBIS3.CONTROLS.Data.Types.Enum'));
            });
         });

         describe('.getEnumerator', function (){
            it('should return the enumerator', function (){
               assert.isTrue($ws.helpers.instanceOfModule(
                  testEnum.getEnumerator(),
                  'SBIS3.CONTROLS.Data.Collection.ArrayEnumerator')
               );
            });
         });

         describe('.get()', function () {
            it('should return the default index', function () {
               assert.equal(testEnum.get(), 1);
            });
         });

         describe('.set()', function () {
            it('should change current index', function () {
               testEnum.set(2);
               assert.equal(testEnum.get(), 2);
               assert.equal(testEnum.getAsValue(), 'three');
            });
            it('should change current index to null', function () {
               testEnum.set(null);
               assert.strictEqual(testEnum.get(), null);
               assert.isUndefined(testEnum.getAsValue());
            });
            it('should throw an exception if index is out of range', function () {
               assert.throw(function () {
                  testEnum.set(569);
               });
            });
         });

         describe('.getAsValue()', function () {
            it('should return the default value', function () {
               assert.equal(testEnum.getAsValue(), 'two');
            });
         });

         describe('.setByValue()', function () {
            it('should change current index and value', function () {
               testEnum.setByValue('one');
               assert.equal(testEnum.get(), 0);
               assert.equal(testEnum.getAsValue(), 'one');
            });
            it('should change current index to null', function () {
               testEnum.setByValue(null);
               assert.strictEqual(testEnum.get(), null);
               assert.isUndefined(testEnum.getAsValue());
            });
            it('should trow exception for not exists index', function () {
               assert.throw(function () {
                  testEnum.setByValue('doesntExistingValue');
               });
            });
         });

         describe('.isEqual()', function () {
            it('should return true for the same dictionary', function () {
               var e = new Enum({
                  dictionary: getDict(),
                  currentValue: testEnum.get()
               });
               assert.isTrue(testEnum.isEqual(e));
            });
            it('should return false for the different value', function () {
               var e = new Enum({
                  dictionary: getDict(),
                  currentValue: 0
               });
               assert.isFalse(testEnum.isEqual(e));
            });
            it('should return false for the different dictionary', function () {
               var dict = getDict();
               dict[0] = 'uno';
               var e = new Enum({
                  dictionary: dict,
                  currentValue: testEnum.get()
               });
               assert.isFalse(testEnum.isEqual(e));
            });
            it('should return false for not an Enum', function () {
               assert.isFalse(testEnum.isEqual());
               assert.isFalse(testEnum.isEqual(null));
               assert.isFalse(testEnum.isEqual(false));
               assert.isFalse(testEnum.isEqual(true));
               assert.isFalse(testEnum.isEqual(0));
               assert.isFalse(testEnum.isEqual(1));
               assert.isFalse(testEnum.isEqual({}));
               assert.isFalse(testEnum.isEqual([]));
            });
         });

         describe('.toString()', function () {
            it('should return the default value', function () {
               assert.equal(testEnum + '', 'two');
            });
         });
      });
   }
);
