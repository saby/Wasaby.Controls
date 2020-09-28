/**
 * Created by kraynovdo on 28.04.2018.
 */
define(
   [
      'Controls/source',
      'Types/collection',
      'Types/source'
   ],
   function(controlsSourceLib, collection, sourceLib) {

      'use strict';

      var enumInstance, containerInstance;

      describe('Controls.Container.Adapter.Enum', function() {
         describe('private method', function() {
            beforeEach(function(){
               enumInstance = new collection.Enum({
                  dictionary: ['First', 'Second', 'Third'],
                  index: 1
               });
            });
            it('getArrayFromEnum', function() {
               var cfg = {
                  enum: enumInstance
               };
               containerInstance = new controlsSourceLib.EnumAdapter(cfg);
               var arr = containerInstance._getArrayFromEnum(enumInstance);
               assert.deepEqual([{title : 'First'}, {title : 'Second'}, {title: 'Third'}], arr, 'getArrayFromEnum: Wrong array');
            });
            it('getSourceFromEnum', function(done) {
               var cfg = {
                  enum: enumInstance
               };
               containerInstance = new controlsSourceLib.EnumAdapter(cfg);
               var source = containerInstance._getSourceFromEnum(enumInstance);
               var queryInstance = new sourceLib.Query();
               source.query(queryInstance).addCallback(function(dataSet){
                  var rawData = dataSet.getAll().getRawData();
                  assert.deepEqual([{title : 'First'}, {title : 'Second'}, {title: 'Third'}], rawData, 'getArrayFromEnum: Wrong source');
                  done();
               });

            });
         });
         describe('life cycle', function() {
            beforeEach(function(){
               enumInstance = new collection.Enum({
                  dictionary: ['First', 'Second', 'Third'],
                  index: 1
               });

            });
            it('enumSubscribe', function() {
               var cfg = {
                  enum: enumInstance
               };
               containerInstance = new controlsSourceLib.EnumAdapter(cfg);
               containerInstance._beforeMount(cfg);

               containerInstance._enumSubscribe(enumInstance);
               enumInstance.set(2);
               assert.equal('Third', containerInstance._selectedKey, 'enumSubscribe: selectedKey doesn\'t change');


            });
            it('hooks', function() {
               var cfg = {
                  enum: enumInstance
               };
               containerInstance = new controlsSourceLib.EnumAdapter(cfg);
               containerInstance.saveOptions(cfg);

               containerInstance._beforeMount(cfg);
               assert.equal(enumInstance, containerInstance._enum, '_beforeMount: wrong _enum property');
               assert.equal('Second', containerInstance._selectedKey, '_beforeMount: wrong _selectedKey property');


               var newEnumInstance = new collection.Enum({
                  dictionary: ['Red', 'Blue', 'Yellow'],
                  index: 0
               });

               cfg = {
                  enum: newEnumInstance
               };

               containerInstance._beforeUpdate(cfg);
               assert.equal(newEnumInstance, containerInstance._enum, '_beforeUpdate: wrong _enum property');
               assert.equal('Red', containerInstance._selectedKey, '_beforeUpdate: wrong _selectedKey property');
            });

            it('_beforeUnmount', function() {
               var cfg = {
                  enum: enumInstance
               };
               containerInstance = new controlsSourceLib.EnumAdapter(cfg);
               containerInstance.saveOptions(cfg);
               containerInstance._beforeMount(cfg);

               assert.equal(enumInstance, containerInstance._enum, '_beforeMount: wrong _enum property');
               assert.equal('Second', containerInstance._selectedKey, '_beforeMount: wrong _selectedKey property');

               containerInstance._beforeUnmount();
               enumInstance.setByValue('Third');

               assert.isNull(containerInstance._enum, '_beforeUnmount: wrong _enum property');
               assert.equal('Second', containerInstance._selectedKey, '_beforeUnmount: wrong _selectedKey property');
            });
         });
      });
   }
);
