/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
      'js!SBIS3.CONTROLS.Data.Collection.List',
      'js!SBIS3.CONTROLS.Data.Bind.ICollection',
      'js!SBIS3.CONTROLS.Data.Model',
      'js!SBIS3.CONTROLS.Data.Source.Memory',
      'js!SBIS3.CONTROLS.Data.Format.FieldsFactory',
      'js!SBIS3.CONTROLS.Data.Adapter.Sbis'
   ], function (RecordSet, List, IBindCollection, Model, MemorySource, FieldsFactory, SbisAdapter) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Collection.RecordSet', function() {
         var rs,
            items,
            getItems,
            getSbisItems;

         beforeEach(function() {
            getItems = function (){
               return [{
                  'Ид': 1,
                  'Фамилия': 'Иванов'
               }, {
                  'Ид': 2,
                  'Фамилия': 'Петров'
               }, {
                  'Ид': 3,
                  'Фамилия': 'Сидоров'
               }, {
                  'Ид': 4,
                  'Фамилия': 'Пухов'
               }, {
                  'Ид': 5,
                  'Фамилия': 'Молодцов'
               }, {
                  'Ид': 6,
                  'Фамилия': 'Годолцов'
               }, {
                  'Ид': 7,
                  'Фамилия': 'Арбузнов'
               }, {
                  'Ид': 8,
                  'Фамилия': 'Арбузнов'
               }];
            },
            getSbisItems = function() {
               return {
                  d: [
                     [1, 'Иванов'],
                     [2, 'Петров'],
                     [3, 'Сидоров'],
                     [4, 'Пухов'],
                     [5, 'Молодцов'],
                     [6, 'Годолцов'],
                     [7, 'Арбузнов'],
                     [8, 'Арбузнов']
                  ],
                  s: [{
                     n: 'Ид',
                     t: 'Число целое'
                  }, {
                     n: 'Фамилия',
                     t: 'Строка'
                  }]
               };
            };
            items = getItems();
            rs = new RecordSet({
               rawData: getItems(),
               idProperty: 'Ид'
            });
         });

         afterEach(function() {
            items = undefined;
         });

         describe('.$constructor()', function () {
            it('should take limited time', function() {
               this.timeout(5000);

               var testFor = function(factory) {
                     var start = Date.now(),
                        obj;
                     obj = factory(getItems());
                     obj = undefined;
                     return Date.now() - start;
                  },
                  getItems = function() {
                     var items = [],
                        item,
                        i,
                        j;
                     for (i = 0; i < count; i++) {
                        item = {};
                        for (j = 0; j < fields; j++) {
                           item['f' + j] = j;
                        }
                        items.push(item);
                     }
                     return items;
                  },
                  count = 10000,
                  fields = 100;

               var mine = testFor(function(items) {
                     return new RecordSet({
                        rawData: items
                     });
                  }),
                  native = testFor(function(items) {
                     var arr = [],
                        i;
                     for (i = 0; i < items.length; i++) {
                        arr.push(items[i]);
                     }
                     return arr;
                  }),
                  rel = mine / native;
               if (window) {
                  window.console.log('RecordSet batch creating: ' + [mine, native, rel].join(', '));
               }
               assert.isBelow(rel, 5);
            });

            it('should add fields to raw data from declarative format', function () {
               var declaration = [{
                     name: 'Имя',
                     type: 'string',
                     defaultValue: 'test1'
                  }, {
                     name: 'День рождения',
                     type: 'datetime',
                     defaultValue: new Date()
                  }],
                  rs = new RecordSet({
                     format: declaration,
                     rawData: items
                  });
               rs.each(function(item) {
                  for (var i = 0; i < declaration.length; i++) {
                     assert.isTrue(item.has(declaration[i].name));
                     assert.strictEqual(item.get(declaration[i].name), declaration[i].defaultValue);
                  }
               });
            });

            it('should get adapter in strategy', function (){
               var rs = new RecordSet({
                  strategy: new SbisAdapter(),
                  rawData: {
                     d: [
                        [1, 'Иванов'],
                        [2, 'Петров'],
                        [3, 'Сидоров'],
                        [4, 'Пухов'],
                        [5, 'Молодцов'],
                        [6, 'Годолцов'],
                        [7, 'Арбузнов']
                     ],
                     s: [
                        {'n': 'Ид', 't': 'Число целое'},
                        {'n': 'Фамилия', 't': 'Строка'}
                     ]
                  }
               });
               assert.equal(rs.at(1).get('Ид'), 2);
            });

            it('should get adapter in strategy', function (){
               assert.equal(rs.at(1).get('Ид'), 2);
            });
         });

         describe('.getEnumerator()', function() {
            it('should return records', function() {
               var enumerator = rs.getEnumerator(),
                  record;
               while((record = enumerator.getNext())) {
                  assert.isTrue($ws.helpers.instanceOfModule(record, 'SBIS3.CONTROLS.Data.Record'));
               }
            });
            it('should return records owned by itself', function() {
               var enumerator = rs.getEnumerator(),
                  record;
               while((record = enumerator.getNext())) {
                  assert.strictEqual(record.getOwner(), rs);
               }
            });
         });

         describe('.isEqual()', function () {
            it('should accept an invalid argument', function () {
               var rs = new RecordSet();
               assert.isFalse(rs.isEqual());
               assert.isFalse(rs.isEqual(null));
               assert.isFalse(rs.isEqual(false));
               assert.isFalse(rs.isEqual(true));
               assert.isFalse(rs.isEqual(0));
               assert.isFalse(rs.isEqual(1));
               assert.isFalse(rs.isEqual({}));
               assert.isFalse(rs.isEqual([]));
            });
            it('should return true for the same recordset', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               assert.isTrue(rs.isEqual(same));
            });
            it('should return true for itself', function () {
               assert.isTrue(rs.isEqual(rs));
            });
            it('should return true for the clone', function () {
               assert.isTrue(rs.isEqual(rs.clone()));
            });
            it('should return true for empties', function () {
               var rs = new RecordSet();
               assert.isTrue(rs.isEqual(new RecordSet()));
            });
            it('should return false if record added', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               same.add(rs.at(0).clone());
               assert.isFalse(rs.isEqual(same));
            });
            it('should return true if same record replaced', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               same.replace(rs.at(0).clone(), 0);
               assert.isTrue(rs.isEqual(same));
            });
            it('should return false if not same record replaced', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               same.replace(rs.at(1).clone(), 0);
               assert.isFalse(rs.isEqual(same));
            });
            it('should return false if record removed', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               same.removeAt(0);
               assert.isFalse(rs.isEqual(same));
            });
            it('should return false if record updated', function () {
               var same = new RecordSet({
                  rawData: getItems()
               });
               same.at(0).set('Фамилия', 'Aaa');
               assert.isFalse(rs.isEqual(same));
            });
         });

         describe('.getRawData()', function() {
            it('should return the value that was passed to the constructor', function() {
               var data = [{}],
                  rs = new RecordSet({
                     rawData: data
                  });
               assert.strictEqual(rs.getRawData(), data);
            });
            it('should return the changed value after add a new record', function() {
               var rs = new RecordSet(),
                  data = {'a': 1};
               rs.add(new Model({
                  rawData: data
               }));
               assert.strictEqual(rs.getRawData()[0], data);
            });
         });

         describe('.setRawData()', function (){
            it('should return elem by index', function () {
               var rs = new RecordSet({
                  rawData: getItems(),
                  idProperty: "Ид"
               });
               rs.setRawData([{
                  'Ид': 1000,
                  'Фамилия': 'Пушкин'
               }, {
                  'Ид': 1001,
                  'Фамилия': 'Пушкин1'
               }]);
               assert.equal(rs.getIndex(rs.at(1)), 1);
            });

            it('should trigger an event with valid arguments', function() {
               var firesCount = 0,
                  handler = function() {
                     firesCount++;
                  };

               rs.subscribe('onCollectionChange', handler);
               rs.setRawData([{
                  'Ид': 1,
                  'Фамилия': 'Иванов'
               }, {
                  'Ид': 2,
                  'Фамилия': 'Петров'
               }, {
                  'Ид': 13,
                  'Фамилия': 'Сидоров'
               }]);
               rs.unsubscribe('onCollectionChange', handler);
               rs.destroy();
               assert.strictEqual(firesCount, 4);
            });
         });

         describe('.getFormat()', function () {
            it('should build the format from json raw data', function () {
               var format = rs.getFormat();
               assert.strictEqual(format.getCount(), 2);
               assert.strictEqual(format.at(0).getName(), 'Ид');
               assert.strictEqual(format.at(1).getName(), 'Фамилия');
            });
            it('should build the empty format from empty json raw data', function () {
               var rs = new RecordSet();
               var format = rs.getFormat();
               assert.strictEqual(format.getCount(), 0);
            });
            it('should build the format from sbis raw data', function () {
               var data = getSbisItems(),
                  rs = new RecordSet({
                     rawData: data,
                     adapter: 'adapter.sbis'
                  }),
                  format = rs.getFormat();
               assert.strictEqual(format.getCount(), data.s.length);
               format.each(function(item, index) {
                  assert.strictEqual(item.getName(), data.s[index].n);
               });
            });
            it('should build the record format from declarative option', function () {
               var declaration = [{
                     name: 'id',
                     type: 'integer'
                  }, {
                     name: 'title',
                     type: 'string'
                  }, {
                     name: 'max',
                     type: 'integer'
                  }, {
                     name: 'main',
                     type: 'boolean'
                  }],
                  rs = new RecordSet({
                     format: declaration,
                     rawData: items
                  }),
                  format = rs.getFormat();
               assert.strictEqual(format.getCount(), declaration.length);
               format.each(function(item, index) {
                  assert.strictEqual(item.getName(), declaration[index].name);
                  assert.strictEqual(item.getType().toLowerCase(), declaration[index].type);
               });
            });
         });

         describe('.getIndexByValue()', function(){
            it('should return records index from recordset by value', function(){
               var data = getSbisItems(),
                  rs = new RecordSet({
                     rawData: data,
                     adapter: 'adapter.sbis'
                  });
               for(var i= data.d.length; i<=0;i-- ) {
                  assert.equal(rs.getIndexByValue('Фамилия', data.d[i][1]), i);
               }
            });
         });

         describe('.addField()', function () {
            it('should add the field from the declaration for JSON adapter', function () {
               var index = 0,
                  fieldName = 'login',
                  fieldDefault = 'user';
               rs.addField({
                  name: fieldName,
                  type: 'string',
                  defaultValue: fieldDefault
               }, index);

               assert.strictEqual(rs.getFormat().at(index).getName(), fieldName);
               assert.strictEqual(rs.getFormat().at(index).getDefaultValue(), fieldDefault);
               rs.each(function(record) {
                  assert.strictEqual(record.get(fieldName), fieldDefault);
                  assert.strictEqual(record.getRawData()[fieldName], fieldDefault);
               });
            });
            it('should add the field from the declaration for SBIS adapter', function () {
               var rs = new RecordSet({
                     rawData: getSbisItems(),
                     adapter: 'adapter.sbis',
                     idProperty: 'Ид'
                  }),
                  index = 0,
                  fieldName = 'login',
                  fieldDefault = 'user';

               //Just initiate for creating lazy indexes
               rs.each(function(record) {
                  record.getId();
               });
               
               rs.addField({
                  name: fieldName,
                  type: 'string',
                  defaultValue: fieldDefault
               }, index);

               assert.strictEqual(rs.getFormat().at(index).getName(), fieldName);
               assert.strictEqual(rs.getFormat().at(index).getDefaultValue(), fieldDefault);
               rs.each(function(record) {
                  assert.strictEqual(record.get(fieldName), fieldDefault);
               });
            });
            it('should add the field from the instance', function () {
               var fieldName = 'login',
                  fieldDefault = 'username';
               rs.addField(FieldsFactory.create({
                  name: fieldName,
                  type: 'string',
                  defaultValue: fieldDefault
               }));
               var index = rs.getFormat().getCount() - 1;

               assert.strictEqual(rs.getFormat().at(index).getName(), fieldName);
               assert.strictEqual(rs.getFormat().at(index).getDefaultValue(), fieldDefault);
               rs.each(function(record) {
                  assert.strictEqual(record.get(fieldName), fieldDefault);
                  assert.strictEqual(record.getRawData()[fieldName], fieldDefault);
               });
            });
            it('should add the field with the value', function () {
               var fieldName = 'login',
                  fieldValue = 'root';
               rs.addField({name: fieldName, type: 'string', defaultValue: 'user'}, 0, fieldValue);

               rs.each(function(record) {
                  assert.strictEqual(record.get(fieldName), fieldValue);
                  assert.strictEqual(record.getRawData()[fieldName], fieldValue);
               });
            });
            it('should throw an error if the field is already defined', function () {
               assert.throw(function() {
                  rs.addField({name: 'Фамилия', type: 'string'});
               });
            });
            it('should throw an error if add the field twice', function () {
               rs.addField({name: 'new', type: 'string'});
               assert.throw(function() {
                  rs.addField({name: 'new', type: 'string'});
               });
            });
         });

         describe('.removeField()', function () {
            it('should remove the exists field', function () {
               var fieldName = 'Фамилия',
                  rs = new RecordSet({
                     adapter: 'adapter.sbis',
                     rawData: getSbisItems()
                  });
               rs.removeField(fieldName);

               assert.strictEqual(rs.getFormat().getFieldndex(fieldName), -1);
               assert.strictEqual(rs.getRawData().s.length, 1);
               rs.each(function(record) {
                  assert.isFalse(record.has(fieldName));
                  assert.isUndefined(record.get(fieldName));
                  assert.strictEqual(record.getRawData().s.length, 1);
               });
            });
            it('should throw an error if adapter doesn\'t support fields detection', function () {
               var rs = new RecordSet(),
                  fieldName = 'Фамилия';
               assert.throw(function() {
                  rs.removeField(fieldName);
               });
            });
            it('should throw an error for not defined field', function () {
               var rs = new RecordSet({
                  adapter: 'adapter.sbis',
                  rawData: getSbisItems()
               });
               assert.throw(function() {
                  rs.removeField('some');
               });
            });
            it('should throw an error if remove the field twice', function () {
               var rs = new RecordSet({
                  adapter: 'adapter.sbis',
                  rawData: getSbisItems()
               });
               rs.removeField('Фамилия');
               assert.throw(function() {
                  rs.removeField('Фамилия');
               });
            });
         });

         describe('.removeFieldAt()', function () {
            it('should throw an error if adapter doesn\'t support fields indexes', function () {
               assert.throw(function() {
                  rs.removeFieldAt(1);
               });
            });
            it('should remove the exists field', function () {
               var fieldIndex = 1,
                  fieldName = 'title',
                  rs = new RecordSet({
                     adapter: 'adapter.sbis',
                     rawData: getSbisItems()
                  });
               rs.removeFieldAt(fieldIndex);

               assert.isUndefined(rs.getFormat().at(fieldIndex));
               assert.strictEqual(rs.getRawData().s.length, 1);
               rs.each(function(record) {
                  assert.isFalse(record.has(fieldName));
                  assert.isUndefined(record.get(fieldName));
                  assert.strictEqual(record.getRawData().s.length, 1);
               });
            });
            it('should throw an error for not exists index', function () {
               assert.throw(function() {
                  var rs = new Record({
                     adapter: 'adapter.sbis'
                  });
                  rs.removeFieldAt(0);
               });
            });
         });

         describe('.append()', function() {
            it('should change raw data', function() {
               var rd = [{
                  'Ид': 50,
                  'Фамилия': '50'
               }, {
                  'Ид': 51,
                  'Фамилия': '51'
               }];
               rs.append(new RecordSet({
                  rawData: rd
               }));
               Array.prototype.push.apply(items,rd);
               assert.deepEqual(rs.getRawData(), items);
               assert.deepEqual(rs.getCount(), items.length);
               $ws.helpers.forEach(items, function (item, i) {
                  assert.deepEqual(rs.at(i).getRawData(), item);
               });
            });

            it('should throw an error', function() {
               var data4 = {id: 4},
                  data5 = {id: 5};
               assert.throw(function (){
                  rs.append([new Model({
                     rawData: data4
                  }), data5]);
               });
            });

            it('should trigger an event with valid arguments', function(done) {
               var newItemsExpected = [13],
                  newItemsIndexExpected = rs.getCount(),
                  firesCount = 0,
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     firesCount++;
                     try {
                        assert.strictEqual(action, IBindCollection.ACTION_ADD);
                        assert.strictEqual(newItemsIndex, newItemsIndexExpected);
                        assert.deepEqual($ws.helpers.map(newItems, function(item) {
                           return item.get('Ид');
                        }), newItemsExpected);
                        assert.deepEqual(oldItems, []);
                     } catch (err) {
                        done(err);
                     }
                  };

               rs.subscribe('onCollectionChange', handler);
               rs.append(new RecordSet({
                  rawData: [{
                     'Ид': 13,
                     'Фамилия': 'ООов'
                  }]
               }));
               rs.unsubscribe('onCollectionChange', handler);
               rs.destroy();
               assert.strictEqual(firesCount, 1);
               done();
            });
         });

         describe('.prepend', function (){
            it('should change raw data', function() {
               var rd = [{
                  'Ид': 50,
                  'Фамилия': '50'
               }, {
                  'Ид': 51,
                  'Фамилия': '51'
               }];
               rs.prepend(new RecordSet({
                  rawData: rd
               }));
               Array.prototype.splice.apply(items,([0, 0].concat(rd)));
               assert.deepEqual(rs.getRawData(), items);
               assert.deepEqual(rs.getCount(), items.length);
               $ws.helpers.forEach(items, function (item, i) {
                  assert.deepEqual(rs.at(i).getRawData(), item);
               });
            });

            it('should throw an error', function() {
               var  data4 = {id: 4},
                  data5 = {id: 5};
               assert.throw(function (){
                  rs.prepend([new Model({
                     rawData: data4
                  }), data5]);
               });
            });

            it('should trigger an event with valid arguments', function(done) {
               var newItemsExpected = [13],
                  firesCount = 0,
                  handler = function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
                     firesCount++;
                     try {
                        assert.strictEqual(action, IBindCollection.ACTION_ADD);
                        assert.strictEqual(newItemsIndex, 0);
                        assert.deepEqual($ws.helpers.map(newItems, function(item) {
                           return item.get('Ид');
                        }), newItemsExpected);
                        assert.deepEqual(oldItems, []);
                     } catch (err) {
                        done(err);
                     }
                  };

               rs.subscribe('onCollectionChange', handler);
               rs.prepend(new RecordSet({
                  rawData: [{
                     'Ид': 13,
                     'Фамилия': 'ООов'
                  }]
               }));
               rs.unsubscribe('onCollectionChange', handler);
               rs.destroy();
               assert.strictEqual(firesCount, 1);
               done();
            });
         });

         describe('.assign()', function() {
            it('should change raw data and count', function() {
               var rs = new RecordSet({
                     rawData: [{id: 1}, {id: 2}, {id: 3}]
                  }),
                  data4 = {id: 4},
                  data5 = {id: 5};

               rs.assign([new Model({
                  rawData: data4
               }), new Model({
                  rawData: data5
               })]);
               assert.deepEqual(rs.getRawData()[0], data4);
               assert.deepEqual(rs.getRawData()[1], data5);
               assert.deepEqual(rs.at(0).getRawData(), data4);
               assert.deepEqual(rs.at(1).getRawData(), data5);
               assert.strictEqual(rs.getCount(), 2);
            });

            it('should get format from assigning recordset', function () {
               var s = [
                     {'n': 'Ид', 't': 'Число целое'},
                     {'n': 'Фамилия', 't': 'Строка'},
                     {'n': 'Количество', 't': 'Число целое'}
                  ],
                  rs = new RecordSet({
                     rawData:  {
                        d: [
                           [7, 'Арбузнов']
                        ],
                        s: [
                           {'n': 'Ид', 't': 'Число целое'},
                           {'n': 'Фамилия', 't': 'Строка'}
                        ]
                     },
                     adapter: new SbisAdapter()
                  }),
                  rs2 = new RecordSet({
                     rawData: {
                        d: [
                           [7, 'Арбузнов','4']
                        ],
                        s: s
                     },
                     adapter: new SbisAdapter()
                  });
               rs.assign(rs2);
               assert.deepEqual(rs.getRawData().s, s);
            });

            it('should throw an error if pass not a record', function() {
               var data4 = {id: 4},
                  data5 = {id: 5};
               assert.throw(function (){
                  rs.assign([new Model({
                     rawData: data4
                  }), data5]);
               });
            });

            it('should change format with new one', function() {
               var rs = new RecordSet({
                     rawData:  {
                        d: [[7]],
                        s: [{n: 'Ид', t: 'Число целое'}]
                     },
                     adapter: 'adapter.sbis'
                  }),
                  rs2 = new RecordSet({
                     rawData: {
                        d: [['Арбузнов']],
                        s: [{n: 'Фамилия', t: 'Строка'}]
                     },
                     adapter: 'adapter.sbis'
                  });
               rs.addField({name: 'login', type: 'string'});
               rs.assign(rs2);
               assert.deepEqual(rs.getRawData().s, [{n: 'Фамилия', t: 'Строка'}]);
            });

            it('should throw an error if format is defined directly', function() {
               var rs = new RecordSet({
                     rawData:  {
                        d: [[7]],
                        s: [{n: 'Ид', t: 'Число целое'}]
                     },
                     adapter: 'adapter.sbis',
                     format: [{name: 'Ид', type: 'Integer'}]
                  }),
                  rs2 = new RecordSet({
                     rawData: {
                        d: [['Арбузнов']],
                        s: [{n: 'Фамилия', t: 'Строка'}]
                     },
                     adapter: 'adapter.sbis'
                  });
               rs.addField({name: 'login', type: 'string'});
               assert.throw(function() {
                  rs.assign(rs2);
               });
            });

            it('should trigger an event with valid arguments', function(done) {
               var newItemsExpected = [1, 2, 13],
                  oldItemsExpected = $ws.helpers.map(rs.getRawData(), function(item) {
                     return item['Ид'];
                  }),
                  firesCount = 0,
                  handler = function(event, action, newItems, newItemsIndex, oldItems) {
                     firesCount++;
                     try {
                        assert.strictEqual(action, IBindCollection.ACTION_RESET);
                        assert.deepEqual($ws.helpers.map(newItems, function(item) {
                           return item.get('Ид');
                        }), newItemsExpected);
                        assert.strictEqual(newItemsIndex, 0);
                        assert.deepEqual($ws.helpers.map(oldItems, function(item) {
                           return item.get('Ид');
                        }), oldItemsExpected);
                        assert.strictEqual(newItemsIndex, 0);
                     } catch (err) {
                        done(err);
                     }
                  };

               rs.subscribe('onCollectionChange', handler);
               rs.assign(new RecordSet({
                  rawData: [{
                     'Ид': 1,
                     'Фамилия': 'Иванов'
                  }, {
                     'Ид': 2,
                     'Фамилия': 'Петров'
                  }, {
                     'Ид': 13,
                     'Фамилия': 'Сидоров'
                  }]
               }));
               rs.unsubscribe('onCollectionChange', handler);
               rs.destroy();
               assert.strictEqual(firesCount, 1);
               done();
            });
         });

         describe('.clear()', function() {
            it('should change raw data', function() {
               rs.clear();
               assert.deepEqual(rs.getRawData(), []);
            });
         });

         describe('.clone()', function () {
            it('should not be same as original', function () {
               assert.instanceOf(rs.clone(), RecordSet);
               assert.notEqual(rs.clone(), rs);
            });
            it('should not be same as previous clone', function () {
               assert.notEqual(rs.clone(), rs.clone());
            });
            it('should clone rawData', function () {
               var clone = rs.clone();
               assert.notEqual(rs.getRawData(), clone.getRawData());
               assert.deepEqual(rs.getRawData(), clone.getRawData());
            });
            it('should make raw data unlinked from original', function () {
               var cloneA = rs.clone();
               assert.deepEqual(cloneA.getRawData(), rs.getRawData());
               cloneA.removeAt(0);
               assert.notEqual(cloneA.getRawData(), rs.getRawData());

               var cloneB = rs.clone();
               assert.deepEqual(cloneB.getRawData(), rs.getRawData());
               cloneB.at(0).set('Фамилия', 'test');
               assert.notEqual(cloneB.getRawData(), rs.getRawData());
            });
            it('should equals recordsets items to service enumerators items ', function(){
               var data = getSbisItems(),
                  rs = new RecordSet({
                     rawData: data,
                     adapter: 'adapter.sbis'
                  }),
                  clone = rs.clone();
               assert.strictEqual(clone._items, clone._getServiceEnumerator()._options.items);
            });
         });

         describe('.add()', function() {
            it('should change raw data', function() {
               var rd = {
                     'Ид': 502,
                     'Фамилия': '502'
                  },
                  addItem = new Model({
                     rawData: rd
                  });
               rs.add(addItem);
               items.push(rd);
               assert.deepEqual(rs.getRawData(), items);
            });

            it('should throw an error if pass not a record ', function() {
               var rd = {
                     'Ид': 502,
                     'Фамилия': '502'
                  };
               assert.throw(function (){
                  rs.add(rd);
               });
            });
         });

         describe('.removeAt()', function() {
            it('should change raw data', function() {
               rs.removeAt(0);
               assert.deepEqual(rs.getRawData(), items.slice(1));
            });

         });

         describe('.replace()', function() {
            it('should change raw data', function() {
               var rd = {
                     'Ид': 50,
                     'Фамилия': '50'
                  },
                  newItem = new Model({rawData: rd});
               rs.replace(newItem, 0);
               items[0] = rd;
               assert.deepEqual(rs.getRawData(), items);
            });

            it('should throw an error', function() {
               var rd = {
                     'Ид': 50,
                     'Фамилия': '50'
                  },
                  newItem = new Model({rawData: rd});
               assert.throw(function (){
                  rs.append([new Model({
                     rawData: data4
                  }), data5]);
               });
            });
         });

         describe('.getIndex()', function (){
            it('should return an index of given item', function() {
               for (var i = 0; i < items.length; i++){
                  assert.equal(i, rs.getIndex(rs.at(i)));
               }
            });
         });

         describe('.saveChanges()', function (){
            it('should return an index of given item', function(done) {
               var source = new MemorySource({
                  data: getItems(),
                  idProperty: 'Ид'
               });
               source.query().addCallback(function(ds){
                  var rs = ds.getAll(),
                     length = rs.getCount(),
                     item_2 = $ws.core.clone(rs.at(0));
                  rs.removeAt(2);
                  rs.removeAt(5);
                  rs.saveChanges(source);
                  assert.equal(rs.getCount(), length - 2);
                  assert.notDeepEqual(item_2, rs.at(2));
                  done();
               });
            });

            it('should update record', function() {
               var source = new MemorySource({
                     idProperty: 'Ид'
                  }),
                  rec = rs.at(2);
               source.update = function (model){
                  assert.equal(rec, model);
                  return new $ws.proto.Deferred().callback(model);
               };

               rec.set('Фамилия', 'Зернов');
               rs.saveChanges(source);
               assert.isFalse(rec.isChanged());
            });

            it('should return record by updated id', function() {
               var source = new MemorySource({
                     idProperty: 'Ид'
                  }),
                  rs = new RecordSet({
                     idProperty: 'Ид',
                     rawData: items.slice()
                  }),
                  rec = new Model({
                     idProperty: 'Ид'
                  }),
                  byKeyRec;
               rs.add(rec);
               byKeyRec = rs.getRecordById(rec.getId());
               rs.saveChanges(source);
               assert.strictEqual(rec, byKeyRec);
               assert.strictEqual(rec, rs.getRecordById(rec.getId()));
            });
         });

         describe('.merge()', function (){
            it('should merge two recordsets with default params', function() {
               var rs = new RecordSet({
                  rawData: getItems(),
                  idProperty: "Ид"
               }), rs2 =  new RecordSet({
                  rawData: [{
                     'Ид': 1000,
                     'Фамилия': 'Карпов'
                  }, {
                     'Ид': 2,
                     'Фамилия': 'Пушкин'
                  }],
                  idProperty: "Ид"
               });
               rs.merge(rs2);
               assert.equal(rs.getCount(), 2);
               assert.equal(rs.getRecordById(2).get('Фамилия'), 'Пушкин');
               assert.equal(rs.getRecordById(1000).get('Фамилия'), 'Карпов');

            });

            it('should merge two recordsets without remove', function() {
               var rs = new RecordSet({
                  rawData: getItems(),
                  idProperty: "Ид"
               }), rs2 =  new RecordSet({
                  rawData: [{
                     'Ид': 2,
                     'Фамилия': 'Пушкин'
                  }],
                  idProperty: "Ид"
               });
               rs.merge(rs2, {remove: false});
               assert.equal(getItems().length, rs.getCount());
               assert.equal(rs.getRecordById(2).get('Фамилия'), 'Пушкин');

            });

            it('should merge two recordsets without merge', function() {
               var rs = new RecordSet({
                  rawData: getItems(),
                  idProperty: "Ид"
               }), rs2 =  new RecordSet({
                  rawData: [{
                     'Ид': 2,
                     'Фамилия': 'Пушкин'
                  }],
                  idProperty: "Ид"
               });
               rs.merge(rs2, {merge: false});
               assert.notEqual(rs.getRecordById(2).get('Фамилия'), 'Пушкин');

            });

            it('should merge two recordsets without add', function() {
               var rs = new RecordSet({
                  rawData: getItems(),
                  idProperty: "Ид"
               }), rs2 =  new RecordSet({
                  rawData: [{
                     'Ид': 1000,
                     'Фамилия': 'Пушкин'
                  }],
                  idProperty: "Ид"
               });
               rs.merge(rs2, {add: false});
               assert.isUndefined(rs.getRecordById(1000));

            });
         });

         describe('.toJSON()', function () {
            it('should serialize a RecordSet', function () {
               var json = rs.toJSON();
               assert.strictEqual(json.module, 'SBIS3.CONTROLS.Data.Collection.RecordSet');
               assert.isNumber(json.id);
               assert.isTrue(json.id > 0);
               assert.deepEqual(json.state._options, rs._options);
            });
            it('should hide type signature in rawData', function () {
               var rs = new RecordSet({
                     adapter: new SbisAdapter(),
                     rawData: {
                        _type: 'recordset',
                        s: [1],
                        d: [2]
                     }
                  }),
                  json = rs.toJSON();
               assert.isUndefined(json.state._options.rawData._type);
               assert.strictEqual(json.state._options.rawData.$type, 'recordset');
               assert.deepEqual(json.state._options.rawData.s, [1]);
               assert.deepEqual(json.state._options.rawData.d, [2]);
            });
         });

         describe('.getIdProperty()', function (){
            it('should return id property', function() {
               assert.equal("Ид", rs.getIdProperty());
            });

            it('should return false', function() {
               var  rs2 =  new RecordSet({
                  rawData: [{
                     'Ид': 1000,
                     'Фамилия': 'Пушкин'
                  }]
               });
               assert.isTrue(!rs2.getIdProperty());
            });
         });

         describe('.setIdProperty()', function (){
            it('should set id property', function() {
               rs.setIdProperty('Фамилия');
               assert.equal("Фамилия", rs.getIdProperty());
            });

            it('shouldnt set id property', function() {
               rs.setIdProperty('Лицо');
               assert.equal("Лицо", rs.getIdProperty());
            });
         });

         describe('.removeRecord()', function (){
            it('should mark record as remove', function() {
               rs.removeRecord(1);
               assert.isTrue(rs.getRecordById(1).isDeleted());
            });

            it('should mark records as remove', function() {
               rs.removeRecord([1,2]);
               assert.isTrue(rs.getRecordById(1).isDeleted());
               assert.isTrue(rs.getRecordById(2).isDeleted());
            });
         });

         describe('.getRecordById()', function (){
            it('should return record by id', function() {
               assert.equal(rs.getRecordById(2).get('Фамилия'), 'Петров');
               assert.equal(rs.getRecordById(3).get('Фамилия'), 'Сидоров');
            });
         });

         describe('.getRecordBykey()', function (){
            it('should return record by id', function() {
               assert.equal(rs.getRecordByKey(2).get('Фамилия'), 'Петров');
               assert.equal(rs.getRecordByKey(3).get('Фамилия'), 'Сидоров');
            });
         });

         describe('.getIndexById()', function (){
            it('should return record by id', function() {
               assert.equal(rs.getIndexById(2), 1);
            });
         });

         describe('.getRecordKeyByIndex()', function (){
            it('should return record by id', function() {
               assert.equal(rs.getRecordKeyByIndex(1), 2);
            });
         });

         describe('.getStrategy()', function (){
            it('should return adapter', function() {
               $ws.helpers.instanceOfModule(rs.getStrategy(), 'SBIS3.CONTROLS.Data.Adapter.JSON');
            });
         });

         describe('.getAdapter()', function (){
            it('should return adapter', function() {
               $ws.helpers.instanceOfModule(rs.getStrategy(), 'SBIS3.CONTROLS.Data.Adapter.JSON');
            });
         });

         describe('.push()', function (){
            it('should append record', function() {
               var m =new Model({
                  rawData: {'Ид':100, 'Фамилия':'Карпов'}
               });
               rs.push(m);
               assert.equal(rs.getRecordById('100').get('Фамилия'),'Карпов');
            });

            it('should make record and append in recordset', function() {
               var m =  {'Ид':100, 'Фамилия':'Карпов'};
               rs.push(m);
               assert.equal(rs.getRecordById('100').get('Фамилия'),'Карпов');
            });
         });

         describe('.filter()', function (){
            it('should return fitered record set', function() {
               var newRs = rs.filter(function (model){
                  return model.get('Фамилия') === 'Арбузнов';
               });
               assert.equal(newRs.getCount(), 2);
               assert.equal(newRs.at(0).get('Фамилия'), 'Арбузнов');
            });
         });

         describe('.insert()', function (){
            it('should insert record in recordset', function() {
               var m = new Model({
                  rawData: {'Ид':100, 'Фамилия':'Карпов'}
               });
               rs.insert(m, 0);
               assert.equal(rs.at(0).get('Фамилия'), 'Карпов');
               var length = rs.getCount();
               rs.insert(m, 5);
               assert.equal(rs.getCount(), length);
            });


         });

         describe('.setMetaData()', function (){
            it('should set meta data', function() {
               var meta = {'test': true};
               rs.setMetaData(meta);
               assert.equal(meta, rs.getMetaData());
            });
         });

         describe('.getMetaData()', function (){
            it('should return meta data path', function() {
               rs.setMetaData({'path':[{'s':1}]});
               var meta = rs.getMetaData();
               assert.equal(meta.path.at(0).get('s'), 1);
            });

            it('should return meta data results', function() {
               rs.setMetaData({'results':{'s':1}});
               var meta = rs.getMetaData();
               assert.equal(meta.results.get('s'), 1);
            });
         });

         describe('.getTreeIndex()', function () {
            it('should return TreeIndex', function() {
               var rs =  new RecordSet({
                  rawData: [{
                     'Ид': 1,
                     'Раздел': null
                  }, {
                     'Ид': 2,
                     'Раздел': 1
                  }],
                  idProperty: 'Ид'
               });
               var index = rs.getTreeIndex('Раздел');
               assert.deepEqual(index.null, [1]);
            });
         });

         describe('.getChildItems()', function () {
            it('should return child items', function() {
               var rs =  new RecordSet({
                  rawData: [{
                     'Ид': 1,
                     'Раздел': null
                  }, {
                     'Ид': 2,
                     'Раздел': 1
                  }, {
                     'Ид': 3,
                     'Раздел': 1
                  }, {
                     'Ид': 4,
                     'Раздел': 2
                  }],
                  idProperty: 'Ид'
               });
               assert.deepEqual(rs.getChildItems(1, true, 'Раздел'), [2, 3, 4]);
               assert.deepEqual(rs.getChildItems(4, true, 'Раздел'), []);
               assert.deepEqual(rs.getChildItems(1, false, 'Раздел'), [2, 3]);
            });
         });

         describe('.hasChild()', function (){
            it('should check child', function() {
               var rs =  new RecordSet({
                  rawData: [{
                     'Ид': 1,
                     'Раздел': null
                  }, {
                     'Ид': 2,
                     'Раздел': 1
                  }, {
                     'Ид': 3,
                     'Раздел': 1
                  }, {
                     'Ид': 4,
                     'Раздел': 2
                  }],
                  idProperty: 'Ид'
               });
               assert.isTrue(rs.hasChild(1,'Раздел'));
               assert.isFalse(rs.hasChild(4,'Раздел'));
            });
         });
      });
   }
);
