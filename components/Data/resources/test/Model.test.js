/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.Data.Model',
      'js!SBIS3.CONTROLS.Data.Adapter.Json',
      'js!SBIS3.CONTROLS.Data.Source.Memory'
   ], function (Model, JsonAdapter,MemorySource) {
      'use strict';
      describe('SBIS3.CONTROLS.Data.Model', function() {
         var adapter,model,modelData,source;
         beforeEach(function(){
            adapter = new JsonAdapter();
            modelData =  {
               max:10,
               title:'',
               id:1
            },
            model = new Model({
               idField:'id',
               data: modelData,
               adapter:adapter
            }),
            source = new MemorySource({
               modelIdField: 'id',
               data: [
                  {'id':1,value: 'save'},
                  {'id':2,value: 'load'},
                  {'id':3,value: 'delete'}
               ]
            });
         });
         describe('.getAdapter()', function() {
            it('should return an adapter', function() {
               assert.deepEqual(model.getAdapter(),adapter.forRecord());
            });
         });
         describe('.get()',function(){
            it('should return a data value',function(){
               assert.strictEqual(model.get('max'),modelData['max']);
            });
         });
         describe('.getData()',function(){
            it('should return a model data',function(){
               assert.deepEqual(modelData,model.getData());
            });
         });
         describe('.set()',function(){
            it('should set value',function(){
               var title = 'test';
               model.set('title',title);
               assert.strictEqual(model.get('title'),title);
            });
         });
         describe('.setAdapter()',function(){
            it('should set adapter',function(){
               var myModel = new Model({
                  idField:'id',
                  data: modelData
               });
               myModel.setAdapter(adapter);
               assert.deepEqual(myModel.getAdapter(),adapter.forRecord());
            });
         });
         describe('.getId()',function(){
            it('should return id',function(){
               assert.strictEqual(model.getId(),modelData['id']);
            });

            it('should throw error for empty key field',function(){
               var newModel = new Model({
                  data: modelData
               });
               assert.throw(function(){
                  newModel.getId();
               });
            });
         });
         describe('.clone()',function(){
            it('should clone a model',function(){
               var clone = model.clone();
               assert.deepEqual(clone,model);
               clone.set('max',1);
               assert.notEqual(clone.get('max'),model.get('max'));
            });

         });
         describe('.getIdField()',function(){
            it('should return id field',function(){
               assert.strictEqual(model.getIdField(),'id');
            });
         });
         describe('.getSource()',function(){
            it('sould save data to source',function(done){
               source.read(1).addCallback(function(sourceModel){
                  try {
                     assert.equal(sourceModel.getSource(),source);
                     done();
                  } catch (err) {
                     done(err);
                  }
               });
            });
         });
         describe('.setIdField()',function(){
            it('should set id field',function(){
               var newModel = new Model({
                  data: modelData
               });
               newModel.setIdField('id');
               assert.strictEqual(newModel.getId(),modelData['id']);
            });
         });
         describe('.setData()',function(){
            it('should set data',function(){
               var newModel = new Model({
                  idField:'id',
                  data: {}
               });
               newModel.setData(modelData);
               assert.strictEqual(newModel.getId(),modelData['id']);
            });
         });
         describe('.merge()',function(){
            it('should merging models',function(){
               var newModel = new Model({
                  idField:'id',
                  data: {
                     'title':'new',
                     'link':'123'
                  }
               });
               newModel.merge(model);
               assert.strictEqual(newModel.getId(),modelData['id']);
            });
         });
         describe('.load()',function(){
            it('sould load data in source',function(done){
               var modelSource = new Model({idField:'id',data:{'id':2}});
               modelSource.setSource(source);
               modelSource.load().addCallback(function(){
                  try {
                     assert.equal(modelSource.get('value'),'load');
                     done();
                  } catch (err) {
                     done(err);
                  }
               });
            });
            it('should throw exception model without source',function(){
               assert.throw(function(){
                  model.load();
               });
            });
         });
         describe('.save()',function(){
            it('sould save data to source',function(done){
               source.read(1).addCallback(function(sourceModel){
                  try {
                     sourceModel.set('value1','save');
                     sourceModel.save().addCallback(function(sourceModel){
                        try {
                           assert.equal(sourceModel.get('value'),'save');
                           done();
                        } catch (err) {
                           done(err);
                        }
                     });
                  } catch (err) {
                     done(err);
                  }
               });
            });
            it('should throw exception model without source',function(){
               assert.throw(function(){
                  model.save();
               });
            });
         });
         describe('.delete()',function(){
            it('sould delete data to source',function(done){
               source.read(3).addCallback(function(sourceModel){
                  try {
                     sourceModel.delete().addCallback(function(sourceModel){
                        try{
                           assert.isTrue(sourceModel.isDeleted())
                        } catch(err){
                           done(err);
                        }
                     });
                     done();
                  } catch (err) {
                     done(err);
                  }
               });
            });
            it('should throw exception model without source',function(){
               assert.throw(function(){
                  model.delete();
               });
            });
         });
      });
   }
);