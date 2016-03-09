/* global beforeEach, afterEach, describe, context, it, assert, define, $ws */
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
         describe('$constructor', function(){
            it('should create Enum', function () {
               if (!$ws.helpers.instanceOfModule(testEnum, 'SBIS3.CONTROLS.Data.Types.Enum')) {
                  assert.fail("Type doesn't of instances Enum");
               }
            });
            it('should init Enums current value', function () {
               assert.equal(testEnum.get(), 1);
            });
            it('should throw an error', function () {
               assert.throw(function(){
                  testEnum = new Enum({
                     data: {'1':'one', '2':'two', '3':'three'},
                     currentValue: 1
                  });
               });
            });
         });

         describe('.get()', function (){
            it('should return current value', function (){
               assert.equal(testEnum.get(), 1);
               assert.equal(testEnum.getCurrentValue(), 1);
            });
         });

         describe('.getValues()', function (){
            it('should return values', function (){
               assert.deepEqual(testEnum.getValues(), {0: "one", 1: "two", 2: "three"});
            });
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
               var data = [];
               testEnum.each(function (val){
                  data.push(val);
               });
               var e = new Enum({
                  data: data,
                  currentValue: testEnum.get()
               });
               if (!testEnum.equals(e)) {
                  assert.fail('testEnum dosnt equals to new enum');
               }
            });
            it('should not equals to testEnum when data testEnum and new emun equals', function () {
               var data = [];
               testEnum.each(function (val){
                  data.push(val);
               });
               var e = new Enum({
                  data: data,
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
         describe('.getEnumerator', function (){
            it('should return enumerator', function (){
               assert.isTrue($ws.helpers.instanceOfModule(
                  testEnum.getEnumerator(),
                  'SBIS3.CONTROLS.Data.Collection.ArrayEnumerator')
               );
            });
         });
      });
   }
);
