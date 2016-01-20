/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Model',
      'js!SBIS3.CONTROLS.Data.Adapter.Json',
      'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
      'js!SBIS3.CONTROLS.Data.Source.Memory'
   ], function (Model, JsonAdapter, SbisAdapter, MemorySource) {
      'use strict';
      describe('SBIS3.CONTROLS.Data.Model', function () {
         var adapter, model, modelData, modelProperties, source,
            getModelData = function() {
               return {
                  max: 10,
                  calc: 5,
                  calcRead: 5,
                  calcWrite: 5,
                  title: 'A',
                  id: 1
               };
            },
            getModelProperties = function() {
               return {
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
               };
            },
            getModel = function(adapter, modelData, modelProperties) {
               return new Model({
                  idProperty: 'id',
                  adapter: adapter || new JsonAdapter(),
                  rawData: modelData || getModelData(),
                  properties: modelProperties || getModelProperties()
               });
            };
         beforeEach(function () {
            adapter = new JsonAdapter();
            modelData = getModelData(),
            modelProperties = getModelProperties(),
            model = getModel(adapter, modelData, modelProperties),
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
            it('should return a calculated value', function () {
               assert.strictEqual(model.get('calc'), modelData.calc * 10);
               assert.strictEqual(model.get('calcRead'), modelData.calc * 10);
               assert.strictEqual(model.get('calcWrite'), modelData.calc);
               assert.strictEqual(model.get('title'), 'A B');
               assert.strictEqual(model.get('sqMax'), modelData.max * modelData.max);
            });
         });

         describe('.set()', function () {
            it('should set value', function () {
               model.set('max', 13);
               assert.strictEqual(model.get('max'), 13);
            });

            it('should set a calculated value', function () {
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

         describe('.has()', function () {
            it('should return true for raw-defined property', function () {
               for (var key in modelData) {
                  if (modelData.hasOwnProperty(key)) {
                     assert.isTrue(model.has(key));
                  }
               }
            });
            it('should return true for user-defined property', function () {
               for (var key in modelProperties) {
                  if (modelProperties.hasOwnProperty(key)) {
                     assert.isTrue(model.has(key));
                  }
               }
            });
            it('should return false for undefined property', function () {
               assert.isFalse(model.has('blah'));
            });
         });

         describe('.getChanged()', function () {
            it('should return a changed value', function () {
               model.set('max', 15);
               model.set('title', 'B');
               assert.include(model.getChanged(), 'max');
               assert.include(model.getChanged(), 'title');
            });
         });

         describe('.applyChanged()', function () {
            it('shouldnt return a changed value', function () {
               model.set('max', 15);
               model.set('title', 'B');
               model.applyChanged();
               assert.deepEqual(model.getChanged(), []);
            });
         });

         describe('.each()', function () {
            it('should return equivalent values', function () {
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
               });
            });
            it('should traverse all properties', function () {
               var allProps = [],
                  count = 0,
                  key;
               for (key in modelProperties) {
                  if (modelProperties.hasOwnProperty(key)) {
                     allProps.push(key);
                  }
               }
               for (key in modelData) {
                  if (modelData.hasOwnProperty(key) &&
                        Array.indexOf(allProps, key) === -1
                  ) {
                     allProps.push(key);
                  }
               }
               model.each(function() {
                  count++;
               });
               assert.strictEqual(allProps.length, count);
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
                  rawData: {}
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
                  rawData: modelData
               });
               myModel.setAdapter(adapter);
               assert.deepEqual(myModel.getAdapter(), adapter);
            });
         });

         describe('.getId()', function () {
            it('should return id', function () {
               assert.strictEqual(model.getId(), modelData['id']);
            });

            it('should detect idProperty automatically', function () {
               var data = {
                     d: [
                        1,
                        'a',
                        'test'
                     ],
                     s: [
                        {n: 'Num'},
                        {n: '@Key'},
                        {n: 'Name'}]
                  },
                  model = new Model({
                     rawData: data,
                     adapter: new SbisAdapter()
                  });
               assert.strictEqual(model.getId(), data.d[1]);
            });

            it('should throw error for empty key property', function () {
               var newModel = new Model({
                  rawData: modelData
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
                  rawData: modelData
               });
               newModel.setIdProperty('id');
               assert.strictEqual(newModel.getId(), modelData['id']);
            });
         });

         describe('.clone()', function () {
            it('should not be same as original', function () {
               assert.notEqual(model.clone(), model);
            });
            it('should not be same as previous clone', function () {
               assert.notEqual(model.clone(), model.clone());
            });
            it('should clone rawData', function () {
               var clone = model.clone();
               assert.notEqual(model.getRawData(), clone.getRawData());
               assert.deepEqual(model.getRawData(), clone.getRawData());
            });
            it('should clone properties defintion', function () {
               var clone = model.clone();
               assert.notEqual(model.getProperties(), clone.getProperties());
               assert.deepEqual(model.getProperties(), clone.getProperties());
            });
            it('should clone state markers', function () {
               var cloneA = model.clone();
               assert.strictEqual(model.isDeleted(), cloneA.isDeleted());
               assert.strictEqual(model.isChanged(), cloneA.isChanged());
               assert.strictEqual(model.isStored(), cloneA.isStored());

               model._isDeleted = true;
               model.set('a', 1);
               model.setStored(true);
               var cloneB = model.clone();
               assert.strictEqual(model.isDeleted(), cloneB.isDeleted());
               assert.strictEqual(model.isChanged(), cloneB.isChanged());
               assert.strictEqual(model.isStored(), cloneB.isStored());
            });
            it('should clone id property', function () {
               var clone = model.clone();
               assert.strictEqual(model.getId(), clone.getId());
               assert.strictEqual(model.getIdProperty(), clone.getIdProperty());
            });
            it('should give equal result of toObject', function () {
               var clone = model.clone();
               assert.notEqual(model.toObject(), clone.toObject());
               assert.deepEqual(model.toObject(), clone.toObject());
            });
            it('should give equal fields', function () {
               var clone = model.clone();
               model.each(function(name, value) {
                  assert.strictEqual(value, clone.get(name));
               });
               clone.each(function(name, value) {
                  assert.strictEqual(value, model.get(name));
               });
            });
            it('should make data unlinked from original', function () {
               var cloneA = model.clone();
               assert.equal(cloneA.get('max'), model.get('max'));
               cloneA.set('max', 1);
               assert.notEqual(cloneA.get('max'), model.get('max'));

               var cloneB = model.clone();
               assert.equal(cloneB.get('max'), model.get('max'));
               model.set('max', 12);
               assert.notEqual(cloneB.get('max'), model.get('max'));
            });
            it('should make data unlinked between several clones', function () {
               var cloneA = model.clone();
               var cloneB = model.clone();
               assert.equal(cloneA.get('max'), cloneB.get('max'));
               cloneA.set('max', 1);
               assert.notEqual(cloneA.get('max'), cloneB.get('max'));
            });
         });

         describe('.merge()', function () {
            it('should merge models', function () {
               var newModel = new Model({
                  idProperty: 'id',
                  rawData: {
                     'title': 'new',
                     'link': '123'
                  }
               });
               newModel.merge(model);
               assert.strictEqual(newModel.getId(), modelData['id']);
            });
            it('should merge models with various adapter types', function () {
               var data = {
                     d: [
                        48,
                        27,
                        'sdsd'
                     ],
                     s: [
                        {n: 'max'},
                        {n: 'calc'},
                        {n: 'etc'}]
                  },
                  anotherModel = new Model({
                     rawData: data,
                     adapter: new SbisAdapter()
                  });
               model.merge(anotherModel);
               anotherModel.each(function(field, value) {
                  assert.strictEqual(model.get(field), value);
               });
            });
            it('should stay unchanged with empty donor', function () {
               assert.isFalse(model.isChanged());
               var anotherModel = new Model();
               model.merge(anotherModel);
               assert.isFalse(model.isChanged());
            });
            it('should stay unchanged with same donor', function () {
               assert.isFalse(model.isChanged());
               var anotherModel = new Model({
                  rawData: {
                     max: modelData.max
                  }
               });
               model.merge(anotherModel);
               assert.isFalse(model.isChanged());
            });
            it('should stay changed', function () {
               model.set('max', 2);
               assert.isTrue(model.isChanged());
               var anotherModel = new Model({
                  rawData: {
                     max: 157
                  }
               });
               model.merge(anotherModel);
               assert.isTrue(model.isChanged());
            });
            it('should become changed with different donor', function () {
               assert.isFalse(model.isChanged());
               var anotherModel = new Model({
                  rawData: {
                     max: 157
                  }
               });
               model.merge(anotherModel);
               assert.isTrue(model.isChanged());
            });
            it('should stay unstored', function () {
               assert.isFalse(model.isStored());
               var anotherModel = new Model();
               model.merge(anotherModel);
               assert.isFalse(model.isStored());
            });
            it('should become stored', function () {
               assert.isFalse(model.isStored());
               var anotherModel = new Model();
               anotherModel._isStored = true;
               model.merge(anotherModel);
               assert.isTrue(model.isStored());
            });
            it('should stay undeleted', function () {
               assert.isFalse(model.isDeleted());
               var anotherModel = new Model();
               model.merge(anotherModel);
               assert.isFalse(model.isDeleted());
            });
            it('should become deleted', function () {
               assert.isFalse(model.isDeleted());
               var anotherModel = new Model();
               anotherModel._isDeleted = true;
               model.merge(anotherModel);
               assert.isTrue(model.isDeleted());
            });
         });

         describe('.isEqual()', function () {
            it('should return true with shared raw data', function () {
               var anotherModel = getModel(adapter, modelData);
               assert.isTrue(model.isEqual(anotherModel));
            });
            it('should return true with same raw data', function () {
               var anotherModel = getModel(adapter, getModelData());
               assert.isTrue(model.isEqual(anotherModel));
            });
            it('should return false with different raw data', function () {
               var data = getModelData();
               data.someField = 'someValue';
               var anotherModel = getModel(adapter, data);
               assert.isFalse(model.isEqual(anotherModel));

               data = getModelData();
               for (var key in data) {
                  if (data.hasOwnProperty(key)) {
                     delete data[key];
                     break;
                  }
               }
               anotherModel = getModel(adapter, data);
               assert.isFalse(model.isEqual(anotherModel));
            });
            it('should return false for changed and true for reverted back model', function () {
               var anotherModel = getModel(adapter, getModelData());
               anotherModel.set('max', 1 + model.get('max'));
               assert.isFalse(model.isEqual(anotherModel));

               anotherModel.set('max', model.get('max'));
               assert.isTrue(model.isEqual(anotherModel));
            });
            it('should return true with itself', function () {
               assert.isTrue(model.isEqual(model));

               model.set('max', 1 + model.get('max'));
               assert.isTrue(model.isEqual(model));
            });
            it('should return true for same module and false for different module', function () {
               var MyModel = Model.extend({}),
                  modelA = new Model(),
                  modelB = new Model(),
                  modelC = new MyModel();
               assert.isTrue(modelA.isEqual(modelB));
               assert.isFalse(modelA.isEqual(modelC));
            });
            it('should work fine with invalid argument', function () {
               assert.isFalse(model.isEqual());
               assert.isFalse(model.isEqual(null));
               assert.isFalse(model.isEqual(false));
               assert.isFalse(model.isEqual(true));
               assert.isFalse(model.isEqual(0));
               assert.isFalse(model.isEqual(1));
               assert.isFalse(model.isEqual(''));
               assert.isFalse(model.isEqual('a'));
               assert.isFalse(model.isEqual([]));
               assert.isFalse(model.isEqual({}));
            });
         });

         describe('.toJSON()', function () {
            it('should serialize a model', function () {
               var json = model.toJSON();
               assert.strictEqual(json.module, 'SBIS3.CONTROLS.Data.Model');
               assert.isNumber(json.id);
               assert.isTrue(json.id > 0);
               assert.deepEqual(json.state._options, model._options);
               assert.strictEqual(json.state._hash, model.getHash());
               assert.strictEqual(json.state._isStored, model.isStored());
               assert.strictEqual(json.state._isDeleted, model.isDeleted());
               assert.strictEqual(json.state._isChanged, model.isChanged());
            });
         });
      });
   }
);