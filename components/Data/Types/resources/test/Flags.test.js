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
         describe('.constructor()', function () {
            it('should create Flags', function () {
               assert.isTrue($ws.helpers.instanceOfModule(testFlags, 'SBIS3.CONTROLS.Data.Types.Flags'));
            });
         });

         describe('.getEnumerator', function (){
            it('should return the enumerator', function (){
               assert.isTrue($ws.helpers.instanceOfModule(
                  testFlags.getEnumerator(),
                  'SBIS3.CONTROLS.Data.Collection.ArrayEnumerator')
               );
            });
         });

         describe('.get()', function () {
            it('should return value for the each flag', function () {
               assert.isTrue(testFlags.get('one'));
               assert.isFalse(testFlags.get('two'));
               assert.isNull(testFlags.get('three'));
            });
         });

         describe('.set()', function () {
            it('should change the flags value', function () {
               testFlags.set('two', true);
               assert.isTrue(testFlags.get('two'));
               assert.isTrue(testFlags.getByIndex(1));

               testFlags.set('two', null);
               assert.isNull(testFlags.get('two'));
               assert.isNull(testFlags.getByIndex(1));
            });
            it('should throw an error for undefined value', function () {
               assert.throw(function () {
                  testFlags.set('dev', true);
               });
            });
         });

         describe('.getByIndex()', function () {
            it('should return flags value by index', function () {
               assert.isTrue(testFlags.getByIndex(0));
               assert.isFalse(testFlags.getByIndex(1));
               assert.isNull(testFlags.getByIndex(2));
            });
         });

         describe('.setByIndex()', function () {
            it('should change the flags value by index', function () {
               testFlags.setByIndex(1, null);
               assert.isNull(testFlags.get('two'));
               assert.isNull(testFlags.getByIndex(1));

               testFlags.setByIndex(2, true);
               assert.isTrue(testFlags.get('three'));
               assert.isTrue(testFlags.getByIndex(2));
            });
            it('should throw an error for undefined index', function () {
               assert.throw(function () {
                  testFlags.setByIndex(400, true);
               });
            });
         });

         describe('.setAll()', function () {
            it('should set false to all flags', function () {
               testFlags.setFalseAll();
               testFlags.each(function (name){
                  assert.isFalse(testFlags.get(name));
               });
            });
            it('should set true to all flags', function () {
               testFlags.setTrueAll();
               testFlags.each(function (name){
                  assert.isTrue(testFlags.get(name));
               });
            });
            it('should set null to all flags', function () {
               testFlags.setNullAll();
               testFlags.each(function (name){
                  assert.isNull(testFlags.get(name));
               });
            });
         });

         describe('.isEqual()', function () {
            it('should return true for the same dictionary and values', function () {
               var e = new Flags({
                  dictionary: dict,
                  values: values
               });
               assert.isTrue(testFlags.isEqual(e));
            });
            it('should return true for the equal dictionary and values', function () {
               var e = new Flags({
                  dictionary: getDict(),
                  values: getValues()
               });
               assert.isTrue(testFlags.isEqual(e));
            });
            it('should return false for the different dictionary', function () {
               var dict = getDict();
               dict[0] = 'uno';
               var e = new Flags({
                  dictionary: dict,
                  values: values
               });
               assert.isFalse(testFlags.isEqual(e));
            });
            it('should return false for the different values', function () {
               var values = getValues();
               values[1] = null;
               var e = new Flags({
                  dictionary: dict,
                  values: values
               });
               assert.isFalse(testFlags.isEqual(e));
            });
            it('should return false for not an Flags', function () {
               assert.isFalse(testFlags.isEqual());
               assert.isFalse(testFlags.isEqual(null));
               assert.isFalse(testFlags.isEqual(false));
               assert.isFalse(testFlags.isEqual(true));
               assert.isFalse(testFlags.isEqual(0));
               assert.isFalse(testFlags.isEqual(1));
               assert.isFalse(testFlags.isEqual({}));
               assert.isFalse(testFlags.isEqual([]));
            });
         });

         describe('.toString()', function () {
            it('should return the default signature', function () {
               assert.equal(testFlags + '', '[true,false,null]');
            });
         });
      });
   }
);
