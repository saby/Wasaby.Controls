/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Model',
      'js!SBIS3.CONTROLS.Data.Adapter.Sbis'
   ], function (Model, SbisAdapter) {
      'use strict';
      describe('SBIS3.CONTROLS.Data.Model', function () {
         var model, modelData, modelProperties, sqMaxVal;
         beforeEach(function () {
            modelData = {
               max: 10,
               calc: 5,
               calcRead: 5,
               calcWrite: 5,
               title: 'A',
               id: 1
            },
            sqMaxVal = 33,
            modelProperties = {
               calc: {
                  def: 1,
                  get: function (value) {
                     return 10 * value;
                  },
                  set: function (value) {
                     return value / 10;
                  }
               },
               calcRead: {
                  def: 2,
                  get: function(value) {
                     return 10 * value;
                  }
               },
               calcWrite: {
                  def: 3,
                  set: function(value) {
                     return value / 10;
                  }
               },
               title: {
                  def: 4,
                  get: function(value) {
                     return value + ' B';
                  }
               },
               sqMax: {
                  def: function() {
                     return sqMaxVal++;
                  },
                  get: function () {
                     return this.get('max') * this.get('max');
                  }
               }
            },
            model = new Model({
               idProperty: 'id',
               rawData: modelData,
               properties: modelProperties
            });
         });

         describe('.$constructor()', function () {
            it('should take limited time', function() {
               console.time('BatchCreating');
               for (var i = 0; i < 10000; i++) {
                  var item = {};
                  for (var j = 0; j < 200; j++) {
                     item['f' + j] = j;
                  }
                  item.id = i;
                  item.title = 'Item ' + i;

                  var model = new Model({
                     idProperty: 'id',
                     rawData: item
                  });
               }
               console.timeEnd('BatchCreating');
            });
         });

         describe('.get()', function () {
            it('should return a data value', function () {
               assert.strictEqual(model.get('max'), modelData.max);
               assert.strictEqual(model.get('id'), modelData.id);
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
            it('should return true for defined field', function () {
               for (var key in modelData) {
                  if (modelData.hasOwnProperty(key)) {
                     assert.isTrue(model.has(key));
                  }
               }
            });
            it('should return true for defined property', function () {
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

         describe('.getDefault()', function () {
            it('should return undefined for undefined property', function () {
               assert.strictEqual(model.getDefault('max'), undefined);
            });
            it('should return defined value', function () {
               assert.strictEqual(model.getDefault('calc'), 1);
               assert.strictEqual(model.getDefault('calcRead'), 2);
               assert.strictEqual(model.getDefault('calcWrite'), 3);
               assert.strictEqual(model.getDefault('title'), 4);
            });
            it('should return function result and exec this function once', function () {
               assert.strictEqual(model.getDefault('sqMax'), 33);
               assert.strictEqual(model.getDefault('sqMax'), 33);
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
            it('should traverse all properties in given order', function () {
               var allProps = Object.keys(modelProperties),
                  count = 0,
                  key;
               for (key in modelData) {
                  if (modelData.hasOwnProperty(key) &&
                        Array.indexOf(allProps, key) === -1
                  ) {
                     allProps.push(key);
                  }
               }
               model.each(function(name) {
                  assert.strictEqual(name, allProps[count]);
                  count++;
               });
               assert.strictEqual(allProps.length, count);
            });
         });

         describe('.getProperties()', function () {
            it('should return a model properties', function () {
               assert.deepEqual(model.getProperties(), modelProperties);
            });
         });

         describe('.getId()', function () {
            it('should return id', function () {
               assert.strictEqual(model.getId(), modelData.id);
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
               assert.strictEqual(model.getIdProperty(), '@Key');
               assert.strictEqual(model.getId(), data.d[1]);
            });

            it('should return undefined for empty key property', function () {
               var newModel = new Model({
                  rawData: modelData
               });
               assert.isUndefined(newModel.getId());
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
               assert.strictEqual(newModel.getId(), modelData.id);
            });
         });

         describe('.clone()', function () {
            it('should clone properties defintion', function () {
               var clone = model.clone();
               assert.notEqual(model.getProperties(), clone.getProperties());
               assert.deepEqual(model.getProperties(), clone.getProperties());
            });
            it('should clone state markers', function () {
               var cloneA = model.clone();
               assert.strictEqual(model.isDeleted(), cloneA.isDeleted());
               assert.strictEqual(model.isStored(), cloneA.isStored());

               model._setDeleted(true);
               model.setStored(true);
               var cloneB = model.clone();
               assert.strictEqual(model.isDeleted(), cloneB.isDeleted());
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
         });

         describe('.merge()', function () {
            it('should merge models', function () {
               var newModel = new Model({
                  idProperty: 'id',
                  rawData: {
                     title: 'new',
                     link: '123'
                  }
               });
               newModel.merge(model);
               assert.strictEqual(newModel.getId(), modelData.id);
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
               assert.deepEqual(json.state._defaultPropertiesValues, model._defaultPropertiesValues);
               assert.deepEqual(json.state._changedFields, model._changedFields);
            });
         });
      });
   }
);