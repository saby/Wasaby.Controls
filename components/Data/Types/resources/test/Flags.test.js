/* global beforeEach, afterEach, describe, context, it */
define([
      'js!SBIS3.CONTROLS.Data.Types.Flags'
   ], function (Flags) {
      'use strict';

      var
         data, testFlags;

      beforeEach(function () {
         data = {'one':true, 'two':false, 'three':null};
         testFlags = new Flags({
            data: data
         });
      });

      afterEach(function () {
         data = undefined;
         testFlags = undefined;
      });

      describe('SBIS3.CONTROLS.Data.Types.Flags', function () {
         it('should create Flags', function () {
            if (!$ws.helpers.instanceOfModule(testFlags, 'SBIS3.CONTROLS.Data.Types.Flags')) {
               assert.fail("Type doesn't of instances Flags");
            }
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
            it('should equals to testFlags', function () {
               var e = new Flags({
                  data: data
               });
               if (!testFlags.equals(e)) {
                  assert.fail('testFlags not equals to new flags');
               }
            });
            it('should not equals to testEnum when data testFlags and new emun flags', function () {
               var e = new Flags({
                  data: {'one':true, 'two':false, 'three':null, 'four': true}
               });
               if (testFlags.equals(e)) {
                  assert.fail('testFlags equals to new flags');
               }
            });

         });
      });
   }
);
