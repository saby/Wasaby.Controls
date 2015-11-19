/* global beforeEach, afterEach, describe, context, it */
define([
      'js!SBIS3.CONTROLS.Data.Types.Enum'
   ], function (Enum) {
      'use strict';
      var
         data, testEnum;
      beforeEach(function () {
         data = ['one', 'two', 'three'];
         testEnum = new Enum({
            data: data,
            currentValue: 1
         });
      });
      afterEach(function () {
         data = undefined;
         testEnum = undefined;
      });
      describe('SBIS3.CONTROLS.Data.Types.Enum', function () {
         it('should create Enum', function () {
            if (!$ws.helpers.instanceOfModule(testEnum, 'SBIS3.CONTROLS.Data.Types.Enum')) {
               assert.fail("Type doesn't of instances Enum");
            }
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
         describe('.setbyValue()', function () {
            it('should changes enums current value by value', function () {
               testEnum.setByValue('one');
               assert.equal(testEnum.get(), 0);
            });
            it('should changes enums current value by value to null', function () {
               testEnum.setByValue(null);
               assert.strictEqual(testEnum.get(), null);
            });
            it('should trow exception the value was not found', function () {
               assert.throw(function () {
                  testEnum.setByValue('doesntExistingValue');
               });
            });
         });
         describe('.equals()', function () {
            it('should equals to testEnum', function () {
               var e = new Enum({
                  data: testEnum.toArray(),
                  currentValue: testEnum.get()
               });
               if (!testEnum.equals(e)) {
                  assert.fail('testEnum dosnt equals to new enum');
               }
            });
            it('should not equals to testEnum when data testEnum and new emun equals', function () {
               var e = new Enum({
                  data: testEnum.toArray(),
                  currentValue: 0
               });
               if (testEnum.equals(e)) {
                  assert.fail('testEnum equals to new enum');
               }
            });
            it('should not equals to testEnum when current value testEnum and new emun equals', function () {
               var e = new Enum({
                  data: ['one', 'two'],
                  currentValue: 1
               });
               if (testEnum.equals(e)) {
                  assert.fail('testEnum equals to new enum');
               }
            });
            it('should not equals to testEnum when not enum', function () {
               var e = 1;
               if (testEnum.equals(e)) {
                  assert.fail('testEnum equals to new enum');
               }
            });
         });
      });
   }
);
