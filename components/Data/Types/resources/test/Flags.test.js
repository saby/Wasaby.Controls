/* global beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Types.Flags'
   ], function (Flags) {
      'use strict';

      var getDict = function() {
            return ['one', 'two', 'three'];
         },
         getValues = function() {
            return [true, false, null];
         },
         dict,
         values,
         testFlags;

      beforeEach(function () {
         dict = getDict();
         values = getValues();
         testFlags = new Flags({
            dictionary: dict,
            values: values
         });
      });

      afterEach(function () {
         dict = undefined;
         values = undefined;
         testFlags = undefined;
      });

      describe('SBIS3.CONTROLS.Data.Types.Flags', function () {
         describe('.$create()', function () {
            it('should create Flags', function () {
               assert.isTrue($ws.helpers.instanceOfModule(testFlags, 'SBIS3.CONTROLS.Data.Types.Flags'));
            });
         });

         describe('.get()', function () {
            it('should return flags value', function () {
               assert.strictEqual(testFlags.get('one'), true);
               assert.strictEqual(testFlags.get('two'), false);
               assert.strictEqual(testFlags.get('three'), null);
            });
         });

         describe('.set()', function () {
            it('should change a flags value', function () {
               testFlags.set('two',true);
               assert.strictEqual(testFlags.get('two'), true);
               testFlags.set('two',null);
               assert.strictEqual(testFlags.get('two'), null);
            });
            it('should return an error', function () {
               assert.throw(function () {
                  testFlags.set('dev',true);
               });
            });
         });

         describe('.getByIndex()', function () {
            it('should return flags value by index', function () {
               assert.strictEqual(testFlags.getByIndex(0), true);
               assert.strictEqual(testFlags.getByIndex(1), false);
               assert.strictEqual(testFlags.getByIndex(2), null);
            });
         });

         describe('.setByIndex()', function () {
            it('should change a flags value by index', function () {
               testFlags.setByIndex(1, null);
               assert.strictEqual(testFlags.get('two'), null);
               testFlags.setByIndex(2, true);
               assert.strictEqual(testFlags.get('three'), true);
            });
            it('should return an error', function () {
               assert.throw(function () {
                  testFlags.setByIndex(400, true);
               });
            });
         });

         describe('.setAll()', function () {
            it('should set false to all flags', function () {
               testFlags.setFalseAll();
               testFlags.each(function (name){
                  assert.strictEqual(testFlags.get(name), false);
               });
            });
            it('should set true to all flags', function () {
               testFlags.setTrueAll();
               testFlags.each(function (name){
                  assert.strictEqual(testFlags.get(name), true);
               });
            });
            it('should set null to all flags', function () {
               testFlags.setNullAll();
               testFlags.each(function (name){
                  assert.strictEqual(testFlags.get(name), null);
               });
            });
         });

         describe('.equals()', function () {
            it('should equals to shared data', function () {
               var e = new Flags({
                  dictionary: dict,
                  values: values
               });
               assert.isTrue(testFlags.equals(e));
            });
            it('should equals to equal data', function () {
               var e = new Flags({
                  dictionary: getDict(),
                  values: getValues()
               });
               assert.isTrue(testFlags.equals(e));
            });
            it('should not equals if dictionary is different', function () {
               var dict = getDict();
               dict[0] = 'uno';
               var e = new Flags({
                  dictionary: dict,
                  values: values
               });
               assert.isFalse(testFlags.equals(e));
            });
            it('should not equals if values is different', function () {
               var values = getValues();
               values[1] = null;
               var e = new Flags({
                  dictionary: dict,
                  values: values
               });
               assert.isFalse(testFlags.equals(e));
            });
            it('should not equals when not flags', function () {
               assert.isFalse(testFlags.equals());
               assert.isFalse(testFlags.equals(null));
               assert.isFalse(testFlags.equals(false));
               assert.isFalse(testFlags.equals(true));
               assert.isFalse(testFlags.equals(0));
               assert.isFalse(testFlags.equals(1));
               assert.isFalse(testFlags.equals({}));
               assert.isFalse(testFlags.equals([]));
            });
         });
      });
   }
);
