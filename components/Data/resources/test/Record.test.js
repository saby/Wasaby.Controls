/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Record',
      'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
      'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
      'js!SBIS3.CONTROLS.Data.Format.FieldsFactory',
      'js!SBIS3.CONTROLS.Data.Types.Enum',
      'js!SBIS3.CONTROLS.Data.Types.Flags'
   ], function (Record, RecordSet, SbisAdapter, FieldsFactory, Enum, Flags) {
      'use strict';
      describe('SBIS3.CONTROLS.Data.Record', function () {
         var getRecordData = function() {
               return {
                  max: 10,
                  title: 'A',
                  id: 1
               };
            },
            getRecordSbisData = function() {
               return {
                  _type: 'record',
                  d: [
                     1,
                     'A',
                     10,
                     {d: [], s: []}
                  ],
                  s: [{
                     n: 'id',
                     t: 'Число целое'
                  }, {
                     n: 'title',
                     t: 'Строка'
                  }, {
                     n: 'max',
                     t: 'Число целое'
                  }, {
                     n: 'rec',
                     t: 'Запись'
                  }]
               };
            },
            getRecord = function(data) {
               return new Record({
                  rawData: data || getRecordData()
               });
            },
            record,
            recordData;
         beforeEach(function () {
            recordData = getRecordData();
            record = getRecord(recordData);
         });

         describe('.get()', function () {
            it('should return a data value', function () {
               assert.strictEqual(record.get('max'), recordData.max);
               assert.strictEqual(record.get('title'), recordData.title);
               assert.strictEqual(record.get('id'), recordData.id);
            });
            it('should return a single instance for Object', function () {
               var record = new Record({
                     adapter: 'adapter.sbis',
                     rawData: getRecordSbisData()
                  }),
                  value = record.get('rec');
               
               assert.instanceOf(value, Record);
               assert.strictEqual(record.get('rec'), value);
               assert.strictEqual(record.get('rec'), value);
            });
         });

         describe('.getChanged()', function () {
            it('should return a changed value', function () {
               record.set('max', 15);
               record.set('title', 'B');
               assert.include(record.getChanged(), 'max');
               assert.include(record.getChanged(), 'title');
            });
         });

         describe('.applyChanges()', function () {
            it('shouldnt return a changed value', function () {
               record.set('max', 15);
               record.set('title', 'B');
               record.applyChanges();
               assert.deepEqual(record.getChanged(), []);
            });
         });

         describe('.set()', function () {
            it('should set value', function () {
               record.set('max', 13);
               assert.strictEqual(record.get('max'), 13);
            });
            it('should trigger onPropertyChange if value changed', function () {
               var name,
                  newV;
               record.subscribe('onPropertyChange', function(e, field, value) {
                  name = field;
                  newV = value;
               });
               record.set('max', 13);
               assert.strictEqual(name, 'max');
               assert.strictEqual(newV, 13);
            });
            it('should not trigger onPropertyChange if value not changed', function () {
               var name,
                  newV;
               record.subscribe('onPropertyChange', function(e, field, value) {
                  name = field;
                  newV = value;
               });
               record.set('max', record.get('max'));
               assert.isUndefined(name);
               assert.isUndefined(newV);
            });
            it('should not trigger onPropertyChange if value is equal record', function () {
               var name,
                  newV,
                  val = new Record();
               val.set('a', 'b');
               record.set('rec', val);
               record.subscribe('onPropertyChange', function(e, field, value) {
                  name = field;
                  newV = value;
               });
               val = val.clone();
               record.set('rec', val);
               assert.isUndefined(name);
               assert.isUndefined(newV);
            });
            it('should trigger onPropertyChange if value is not equal record', function () {
               var name,
                  newV,
                  val = new Record();
               val.set('a', 'b');
               record.set('rec', val);
               record.subscribe('onPropertyChange', function(e, field, value) {
                  name = field;
                  newV = value;
               });
               val = val.clone();
               val.set('a', 'c');
               record.set('rec', val);
               assert.strictEqual(name, 'rec');
               assert.strictEqual(newV, val);
            });
            it('should not trigger onPropertyChange if value is equal enum', function () {
               var name,
                  newV,
                  val1 = new Enum({dictionary: ['a', 'b', 'c']}),
                  val2 = new Enum({dictionary: ['a', 'b', 'c']});
               record.set('enum', val1);
               record.subscribe('onPropertyChange', function(e, field, value) {
                  name = field;
                  newV = value;
               });
               record.set('enum', val2);
               assert.isUndefined(name);
               assert.isUndefined(newV);
            });
            it('should trigger onPropertyChange if value is not equal enum', function () {
               var name,
                  newV,
                  val1 = new Enum({dictionary: ['a', 'b']}),
                  val2 = new Enum({dictionary: ['a', 'b', 'c']});
               record.set('enum', val1);
               record.subscribe('onPropertyChange', function(e, field, value) {
                  name = field;
                  newV = value;
               });
               record.set('enum', val2);
               assert.strictEqual(name, 'enum');
               assert.strictEqual(newV, val2);
            });
            it('should not trigger onPropertyChange if value is equal flags', function () {
               var name,
                  newV,
                  val1 = new Flags({
                     dictionary: ['a', 'b'],
                     values: [true, false]
                  }),
                  val2 = new Flags({
                     dictionary: ['a', 'b'],
                     values: [true, false]
                  });
               record.set('flags', val1);
               record.subscribe('onPropertyChange', function(e, field, value) {
                  name = field;
                  newV = value;
               });
               record.set('flags', val2);
               assert.isUndefined(name);
               assert.isUndefined(newV);
            });
            it('should trigger onPropertyChange if value is not equal flags', function () {
               var name,
                  newV,
                  val1 = new Flags({
                     dictionary: ['a', 'b'],
                     values: [true, false]
                  }),
                  val2 = new Flags({
                     dictionary: ['a', 'b'],
                     values: [true, true]
                  });
               record.set('flags', val1);
               record.subscribe('onPropertyChange', function(e, field, value) {
                  name = field;
                  newV = value;
               });
               record.set('flags', val2);
               assert.strictEqual(name, 'flags');
               assert.strictEqual(newV, val2);
            });
            it('should change properties cache', function () {
               record.set('obj', {val: 13});
               record.get('obj');
               assert.property(record._propertiesCache, 'obj');
               record.set('obj', {val: 14});
               record.get('obj');
               assert.deepEqual(record._propertiesCache['obj'], {val: 14});
            });
         });

         describe('.has()', function () {
            it('should return true for defined field', function () {
               for (var key in recordData) {
                  if (recordData.hasOwnProperty(key)) {
                     assert.isTrue(record.has(key));
                  }
               }
            });
            it('should return false for undefined field', function () {
               assert.isFalse(record.has('blah'));
               assert.isFalse(record.has('blah'));
            });
         });

         describe('.getEnumerator()', function () {
            it('should return fields in given order', function () {
               var enumerator = record.getEnumerator(),
                  names = Object.keys(recordData),
                  i = 0,
                  name;
               while((name = enumerator.getNext())) {
                  assert.strictEqual(name, names[i]);
                  i++;
               }
            });
            it('should traverse all of fields', function () {
               var enumerator = record.getEnumerator(),
                  count = Object.keys(recordData).length;
               assert.isTrue(count > 0);
               while(enumerator.getNext()) {
                  count--;
               }
               assert.strictEqual(count, 0);
            });
         });

         describe('.each()', function () {
            it('should return equivalent values', function () {
               record.each(function(name, value) {
                  assert.strictEqual(record.get(name), value);
               });
            });
            it('should traverse all of fields', function () {
               var count = Object.keys(recordData).length;
               assert.isTrue(count > 0);
               record.each(function(name) {
                  count--;
               });
               assert.strictEqual(count, 0);
            });
         });

         describe('.getRawData()', function () {
            it('should return a record data', function () {
               assert.deepEqual(recordData, record.getRawData());
            });
         });

         describe('.setRawData()', function () {
            it('should set data', function () {
               var newRecord = new Record({
                  rawData: {}
               });
               newRecord.setRawData(recordData);
               assert.strictEqual(newRecord.getRawData(), recordData);
            });
         });

         describe('.getAdapter()', function () {
            it('should return an adapter', function () {
               var adapter = new SbisAdapter(),
                  record = new Record({
                     adapter: adapter
                  });
               assert.strictEqual(record.getAdapter(), adapter);
            });
         });

         describe('.setAdapter()', function () {
            it('should set adapter', function () {
               var adapter = new SbisAdapter(),
                  record = new Record();
               record.setAdapter(adapter);
               assert.deepEqual(record.getAdapter(), adapter);
            });
         });

         describe('.getFormat()', function () {
            it('should build the format from raw data', function () {
               var format = record.getFormat();
               assert.strictEqual(format.getCount(), Object.keys(recordData).length);
               format.each(function(item) {
                  assert.isTrue(recordData.hasOwnProperty(item.getName()));
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
                  record = new Record({
                     format: declaration,
                     rawData: recordData
                  }),
                  format = record.getFormat();
               assert.strictEqual(format.getCount(), declaration.length);
               format.each(function(item, index) {
                  assert.strictEqual(item.getName(), declaration[index].name);
                  assert.strictEqual(item.getType().toLowerCase(), declaration[index].type);
               });
            });
         });

         describe('.addField()', function () {
            it('should add the field from the declaration', function () {
               var index = 1,
                  fieldName = 'login',
                  fieldDefault = 'user';
               record.addField({
                  name: fieldName,
                  type: 'string',
                  defaultValue: fieldDefault
               }, index);

               assert.strictEqual(record.getFormat().at(index).getName(), fieldName);
               assert.strictEqual(record.getFormat().at(index).getDefaultValue(), fieldDefault);
               assert.strictEqual(record.get(fieldName), fieldDefault);
               assert.strictEqual(record.getRawData()[fieldName], fieldDefault);
            });
            it('should add the field from the instance', function () {
               var fieldName = 'login',
                  fieldDefault = 'username';
               record.addField(FieldsFactory.create({
                  name: fieldName,
                  type: 'string',
                  defaultValue: fieldDefault
               }));
               var index = record.getFormat().getCount() - 1;

               assert.strictEqual(record.getFormat().at(index).getName(), fieldName);
               assert.strictEqual(record.getFormat().at(index).getDefaultValue(), fieldDefault);
               assert.strictEqual(record.get(fieldName), fieldDefault);
               assert.strictEqual(record.getRawData()[fieldName], fieldDefault);
            });
            it('should add the field with the value', function () {
               var fieldName = 'login',
                  fieldValue = 'root';
               record.addField({name: fieldName, type: 'string', defaultValue: 'user'}, 0, fieldValue);

               assert.strictEqual(record.get(fieldName), fieldValue);
               assert.strictEqual(record.getRawData()[fieldName], fieldValue);
            });
            it('should throw an error if the field is already defined', function () {
               assert.throw(function() {
                  record.addField({name: 'title', type: 'string'});
               });
            });
            it('should throw an error if add the field twice', function () {
               record.addField({name: 'new', type: 'string'});
               assert.throw(function() {
                  record.addField({name: 'new', type: 'string'});
               });
            });
            it('should throw an error if the record has an owner', function () {
               record = new Record({
                  rawData: recordData,
                  owner: {}
               });
               assert.throw(function() {
                  record.addField({name: 'new', type: 'string'});
               });
            });
            it('should add the empty record field', function () {
               var fieldName = 'rec';
               record.addField({name: fieldName, type: 'record'});

               assert.isNull(record.get(fieldName));
               assert.isNull(record.getRawData()[fieldName]);
            });
            it('should add the filled record field', function () {
               var fieldName = 'rec';
               record.addField(
                  {name: fieldName, type: 'record'},
                  0,
                  new Record({rawData: {a: 1}})
               );

               assert.strictEqual(record.get(fieldName).get('a'), 1);
               assert.strictEqual(record.getRawData()[fieldName].a, 1);
            });
            it('should add the empty recordset field', function () {
               var fieldName = 'rs';
               record.addField({name: fieldName, type: 'recordset'});

               assert.isNull(record.get(fieldName));
               assert.isNull(record.getRawData()[fieldName]);
            });
            it('should add the filled recordset field', function () {
               var fieldName = 'rs';
               record.addField(
                  {name: fieldName, type: 'recordset'},
                  0,
                  new RecordSet({rawData: [{a: 1}]})
               );

               assert.strictEqual(record.get(fieldName).at(0).get('a'), 1);
               assert.strictEqual(record.getRawData()[fieldName][0].a, 1);
            });
         });

         describe('.removeField()', function () {
            it('should remove the exists field', function () {
               var fieldName = 'title';
               record.removeField(fieldName);

               assert.strictEqual(record.getFormat().getFieldIndex(fieldName), -1);
               assert.isFalse(record.has(fieldName));
               assert.isUndefined(record.get(fieldName));
               assert.isUndefined(record.getRawData()[fieldName]);
            });
            it('should throw an error for not defined field', function () {
               assert.throw(function() {
                  record.removeField('some');
               });
            });
            it('should throw an error if remove the field twice', function () {
               record.removeField('title');
               assert.throw(function() {
                  record.removeField('title');
               });
            });
            it('should throw an error if the record has an owner', function () {
               record = new Record({
                  rawData: recordData,
                  owner: {}
               });
               assert.throw(function() {
                  record.removeField('title');
               });
            });
         });

         describe('.removeFieldAt()', function () {
            it('should throw an error if adapter doesn\'t support fields indexes', function () {
               assert.throw(function() {
                  record.removeFieldAt(1);
               });
            });
            it('should remove the exists field', function () {
               var fieldIndex = 1,
                  fieldName = 'title',
                  record = new Record({
                     adapter: 'adapter.sbis',
                     rawData: getRecordSbisData()
                  });
               var cl = record.clone();
               record.removeFieldAt(fieldIndex);

               assert.notEqual(record.getFormat().at(fieldIndex).getName(), fieldName);
               assert.isFalse(record.has(fieldName));
               assert.isUndefined(record.get(fieldName));
               assert.isUndefined(record.getRawData()[fieldName]);
            });
            it('should throw an error for not exists index', function () {
               assert.throw(function() {
                  var record = new Record({
                     adapter: 'adapter.sbis'
                  });
                  record.removeFieldAt(0);
               });
            });
            it('should throw an error if the record has an owner', function () {
               record = new Record({
                  adapter: 'adapter.sbis',
                  rawData: getRecordSbisData(),
                  owner: {}
               });
               assert.throw(function() {
                  record.removeFieldAt(1);
               });
            });
         });

         describe('.isChanged()', function () {
            it('should return false by default', function () {
               assert.isFalse(record.isChanged('id'));
               assert.isFalse(record.isChanged());
            });
            it('should return false for undefined property', function () {
               assert.isFalse(record.isChanged('not-exists-prop'));
            });
            it('should return true after field change', function () {
               record.set('id', 123);
               assert.isTrue(record.isChanged('id'));
               assert.isTrue(record.isChanged());
            });
            it('should return true after set a new field', function () {
               record.set('aaa', 321);
               assert.isTrue(record.isChanged('aaa'));
               assert.isTrue(record.isChanged());
            });
         });

         describe('.isEqual()', function () {
            it('should accept an invalid argument', function () {
               assert.isFalse(record.isEqual());
               assert.isFalse(record.isEqual(null));
               assert.isFalse(record.isEqual(false));
               assert.isFalse(record.isEqual(true));
               assert.isFalse(record.isEqual(0));
               assert.isFalse(record.isEqual(1));
               assert.isFalse(record.isEqual({}));
               assert.isFalse(record.isEqual([]));
            });
            it('should return true for the same record', function () {
               var same = new Record({
                  rawData: getRecordData()
               });
               assert.isTrue(record.isEqual(same));
            });
            it('should return true for itself', function () {
               assert.isTrue(record.isEqual(record));
            });
            it('should return true for the clone', function () {
               assert.isTrue(record.isEqual(record.clone()));
            });
            it('should return true for empties', function () {
               var record = new Record();
               assert.isTrue(record.isEqual(new Record()));
            });
            it('should return false if field changed', function () {
               var same = new Record({
                  rawData: getRecordData()
               });
               same.set('title', 'B');
               assert.isFalse(record.isEqual(same));
            });
            it('should return true with shared raw data', function () {
               var anotherRecord = getRecord();
               assert.isTrue(record.isEqual(anotherRecord));
            });
            it('should return true with same raw data', function () {
               var anotherRecord = getRecord(getRecordData());
               assert.isTrue(record.isEqual(anotherRecord));
            });
            it('should return false with different raw data', function () {
               var data = getRecordData();
               data.someField = 'someValue';
               var anotherRecord = getRecord(data);
               assert.isFalse(record.isEqual(anotherRecord));

               data = getRecordData();
               for (var key in data) {
                  if (data.hasOwnProperty(key)) {
                     delete data[key];
                     break;
                  }
               }
               anotherRecord = getRecord(data);
               assert.isFalse(record.isEqual(anotherRecord));
            });
            it('should return false for changed and true for reverted back record', function () {
               var anotherRecord = getRecord(getRecordData());
               anotherRecord.set('max', 1 + record.get('max'));
               assert.isFalse(record.isEqual(anotherRecord));

               anotherRecord.set('max', record.get('max'));
               assert.isTrue(record.isEqual(anotherRecord));
            });
            it('should return true with itself', function () {
               assert.isTrue(record.isEqual(record));

               record.set('max', 1 + record.get('max'));
               assert.isTrue(record.isEqual(record));
            });
            it('should return true for same module and submodule', function () {
               var MyRecord = Record.extend({}),
                  recordA = new Record(),
                  recordB = new Record(),
                  recordC = new MyRecord();
               assert.isTrue(recordA.isEqual(recordB));
               assert.isTrue(recordA.isEqual(recordC));
            });
            it('should work fine with invalid argument', function () {
               assert.isFalse(record.isEqual());
               assert.isFalse(record.isEqual(null));
               assert.isFalse(record.isEqual(false));
               assert.isFalse(record.isEqual(true));
               assert.isFalse(record.isEqual(0));
               assert.isFalse(record.isEqual(1));
               assert.isFalse(record.isEqual(''));
               assert.isFalse(record.isEqual('a'));
               assert.isFalse(record.isEqual([]));
               assert.isFalse(record.isEqual({}));
            });
         });

         describe('.clone()', function () {
            it('should not be same as original', function () {
               assert.notEqual(record.clone(), record);
            });
            it('should not be same as previous clone', function () {
               assert.notEqual(record.clone(), record.clone());
            });
            it('should clone rawData', function () {
               var clone = record.clone();
               assert.notEqual(record.getRawData(), clone.getRawData());
               assert.deepEqual(record.getRawData(), clone.getRawData());
            });
            it('should clone changed fields', function () {
               var cloneA = record.clone();
               assert.isFalse(cloneA.isChanged('id'));
               assert.strictEqual(record.isChanged('id'), cloneA.isChanged('id'));
               assert.strictEqual(record.isChanged(), cloneA.isChanged());
               assert.isFalse(cloneA.isChanged());

               record.set('a', 1);
               var cloneB = record.clone();
               assert.strictEqual(record.isChanged('a'), cloneB.isChanged('a'));
               assert.isTrue(cloneB.isChanged('a'));
               assert.strictEqual(record.isChanged('id'), cloneB.isChanged('id'));
               assert.isFalse(cloneB.isChanged('id'));
               assert.strictEqual(record.isChanged(), cloneB.isChanged());
               assert.isTrue(cloneB.isChanged());
            });
            it('should give equal fields', function () {
               var clone = record.clone();
               record.each(function(name, value) {
                  assert.strictEqual(value, clone.get(name));
               });
               clone.each(function(name, value) {
                  assert.strictEqual(value, record.get(name));
               });
            });
            it('should make raw data unlinked from original', function () {
               var cloneA = record.clone();
               assert.equal(cloneA.get('max'), record.get('max'));
               cloneA.set('max', 1);
               assert.notEqual(cloneA.get('max'), record.get('max'));

               var cloneB = record.clone();
               assert.equal(cloneB.get('max'), record.get('max'));
               record.set('max', 12);
               assert.notEqual(cloneB.get('max'), record.get('max'));
            });
            it('should make data unlinked between several clones', function () {
               var cloneA = record.clone();
               var cloneB = record.clone();
               assert.equal(cloneA.get('max'), cloneB.get('max'));
               cloneA.set('max', 1);
               assert.notEqual(cloneA.get('max'), cloneB.get('max'));
            });
         });

         describe('.getOwner()', function () {
            it('should return null by default', function () {
               assert.isNull(record.getOwner());
            });
            it('should owner passed to the constructor', function () {
               var owner = {},
                  record = new Record({
                  owner: owner
               });
               assert.strictEqual(record.getOwner(), owner);
            });
         });

         describe('.setOwner()', function () {
            it('should set the new owner', function () {
               var owner = {};
               record.setOwner(owner);
               assert.strictEqual(record.getOwner(), owner);
            });
         });

         describe('.toJSON()', function () {
            it('should serialize a Record', function () {
               var json = record.toJSON();
               assert.strictEqual(json.module, 'SBIS3.CONTROLS.Data.Record');
               assert.isNumber(json.id);
               assert.isTrue(json.id > 0);
               assert.deepEqual(json.state._options, record._options);
               assert.deepEqual(json.state._changedFields, record._changedFields);
            });
            it('should set subclass\'s module name', function () {
                  var Sub = Record.extend({
                     _moduleName: 'My.Sub'
                  }),
                  record = new Sub(),
                  json = record.toJSON();
               assert.strictEqual(json.module, 'My.Sub');
            });
            it('should throw an error if subclass\'s module name is not defined', function () {
               var Sub = Record.extend({}),
                  record = new Sub();
               assert.throw(function() {
                  record.toJSON();
               });
            });
            it('should hide type signature in rawData', function () {
               var record = new Record({
                     rawData: {
                        _type: 'record',
                        s: [1],
                        d: [2]
                     }
                  }),
                  json = record.toJSON();
               assert.isUndefined(json.state._options.rawData._type);
               assert.strictEqual(json.state._options.rawData.$type, 'record');
               assert.deepEqual(json.state._options.rawData.s, [1]);
               assert.deepEqual(json.state._options.rawData.d, [2]);
            });
         });

         describe('.fromJSON()', function () {
            it('should restore type signature in rawData', function () {
               var record = new Record({
                     rawData: {
                        _type: 'record',
                        s: [],
                        d: []
                     }
                  }),
                  json = record.toJSON(),
                  clone = Record.prototype.fromJSON.call(Record, json);
               assert.strictEqual(clone.getRawData()._type, 'record');
               assert.isUndefined(clone.getRawData().$type);
            });
         });
      });
   }
);