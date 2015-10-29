/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Model',
      'js!SBIS3.CONTROLS.Data.Adapter.Json',
      'js!SBIS3.CONTROLS.Data.Source.Memory'
   ], function (Model, JsonAdapter, MemorySource) {
      'use strict';
      describe('SBIS3.CONTROLS.Data.Model', function () {
         var adapter, model, modelData, modelProperties, source;
         beforeEach(function () {
            adapter = new JsonAdapter();
            modelData = {
               max: 10,
               calc: 5,
               calcRead: 5,
               calcWrite: 5,
               title: 'A',
               id: 1
            },
            modelProperties = {
               calc: {
                  get: function (value) {
                     return 10 * value;
                  },
                  set: function (value) {
                     return value / 10;
                  }
               },
               calcRead: {
                  get: function(value) {
                     return 10 * value;
                  }
               },
               calcWrite: {
                  set: function(value) {
                     return value / 10;
                  }
               },
               title: {
                  get: function(value) {
                     return value + ' B';
                  }
               },
               sqMax: {
                  get: function () {
                     return this.get('max') * this.get('max');
                  }
               }
            },
            model = new Model({
               idProperty: 'id',
               data: modelData,
               properties: modelProperties,
               adapter: adapter
            }),
            source = new MemorySource({
               idProperty: 'id',
               data: [
                  {id: 1, value: 'save'},
                  {id: 2, value: 'load'},
                  {id: 3, value: 'delete'}
               ]
            });
         });
         describe('.get()', function () {
            it('should return a data value', function () {
               assert.strictEqual(model.get('max'), modelData.max);
            });
            it('should return a converted value', function () {
               assert.strictEqual(model.get('calc'), modelData.calc * 10);
               assert.strictEqual(model.get('calcRead'), modelData.calc * 10);
               assert.strictEqual(model.get('calcWrite'), modelData.calc);
               assert.strictEqual(model.get('title'), 'A B');
            });
            it('should return a calculated value', function () {
               assert.strictEqual(model.get('sqMax'), modelData.max * modelData.max);
            });
         });
         describe('.set()', function () {
            it('should set value', function () {
               model.set('max', 13);
               assert.strictEqual(model.get('max'), 13);

               model.set('calc', 50);
               assert.strictEqual(model.get('calc'), 50);

               model.set('calc', 70);
               assert.strictEqual(model.get('calc'), 70);

               model.set('calcRead', 50);
               assert.strictEqual(model.get('calcRead'), 500);

               model.set('calcRead', 70);
               assert.strictEqual(model.get('calcRead'), 700);

               model.set('calcWrite', 50);
               assert.strictEqual(model.get('calcWrite'), 5);

               model.set('calcWrite', 70);
               assert.strictEqual(model.get('calcWrite'), 7);

               model.set('title', 'test');
               assert.strictEqual(model.get('title'), 'test B');
            });
         });
         describe('.each()', function () {
            it('should return all fields', function () {
               var count = 0;
               model.each(function(name, value) {
                  switch (name) {
                     case 'calc':
                     case 'calcRead':
                     case 'title':
                     case 'sqMax':
                        assert.strictEqual(model.get(name), value);
                        break;
                     default:
                        assert.strictEqual(modelData[name], value);
                  }
                  count++;
               });
            });
         });
         describe('.getProperties()', function () {
            it('should return a model properties', function () {
               for (var name in modelProperties) {
                  if (modelProperties.hasOwnProperty(name)) {
                     assert.deepEqual(modelProperties[name], model.getProperties()[name]);
                  }
               }
            });
         });
         describe('.getRawData()', function () {
            it('should return a model data', function () {
               assert.deepEqual(modelData, model.getRawData());
            });
         });
         describe('.setRawData()', function () {
            it('should set data', function () {
               var newModel = new Model({
                  idProperty: 'id',
                  data: {}
               });
               newModel.setRawData(modelData);
               assert.strictEqual(newModel.getId(), modelData['id']);
            });
         });
         describe('.getAdapter()', function () {
            it('should return an adapter', function () {
               assert.deepEqual(model.getAdapter(), adapter);
            });
         });
         describe('.setAdapter()', function () {
            it('should set adapter', function () {
               var myModel = new Model({
                  idProperty: 'id',
                  data: modelData
               });
               myModel.setAdapter(adapter);
               assert.deepEqual(myModel.getAdapter(), adapter);
            });
         });
         describe('.getId()', function () {
            it('should return id', function () {
               assert.strictEqual(model.getId(), modelData['id']);
            });

            it('should throw error for empty key property', function () {
               var newModel = new Model({
                  data: modelData
               });
               assert.throw(function () {
                  newModel.getId();
               });
            });
         });
         describe('.getIdProperty()', function () {
            it('should return id property', function () {
               assert.strictEqual(model.getIdProperty(), 'id');
            });
         });
         describe('.setIdProperty()', function () {
            it('should set id property', function () {
               var newModel = new Model({
                  data: modelData
               });
               newModel.setIdProperty('id');
               assert.strictEqual(newModel.getId(), modelData['id']);
            });
         });
         describe('.clone()', function () {
            it('should clone a model', function () {
               var clone = model.clone();
               assert.deepEqual(clone, model);
               clone.set('max', 1);
               assert.notEqual(clone.get('max'), model.get('max'));
            });

         });
         describe('.merge()', function () {
            it('should merging models', function () {
               var newModel = new Model({
                  idProperty: 'id',
                  data: {
                     'title': 'new',
                     'link': '123'
                  }
               });
               newModel.merge(model);
               assert.strictEqual(newModel.getId(), modelData['id']);
            });
         });
      });
   }
);