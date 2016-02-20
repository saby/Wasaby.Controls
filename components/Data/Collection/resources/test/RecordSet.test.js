/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
      'js!SBIS3.CONTROLS.Data.Collection.List',
      'js!SBIS3.CONTROLS.Data.Bind.ICollection',
      'js!SBIS3.CONTROLS.Data.Model',
      'js!SBIS3.CONTROLS.Data.Source.Memory',
      'js!SBIS3.CONTROLS.Data.Adapter.Sbis'
   ], function (RecordSet, List, IBindCollection, Model, MemorySource, AdapterSbis) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Collection.RecordSet', function() {
         var rs,
            items;


         beforeEach(function() {
            items = [{
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
            rs = new RecordSet({
               rawData: $ws.core.clone(items),
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
            it('should get adapter in strategy', function (){
               var rs = new RecordSet({
                  strategy: new AdapterSbis(),
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
                  rawData: $ws.core.clone(items)
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
                  rawData: $ws.core.clone(items)
               });
               same.add(rs.at(0).clone());
               assert.isFalse(rs.isEqual(same));
            });
            it('should return true if same record replaced', function () {
               var same = new RecordSet({
                  rawData: $ws.core.clone(items)
               });
               same.replace(rs.at(0).clone(), 0);
               assert.isTrue(rs.isEqual(same));
            });
            it('should return false if not same record replaced', function () {
               var same = new RecordSet({
                  rawData: $ws.core.clone(items)
               });
               same.replace(rs.at(1).clone(), 0);
               assert.isFalse(rs.isEqual(same));
            });
            it('should return false if record removed', function () {
               var same = new RecordSet({
                  rawData: $ws.core.clone(items)
               });
               same.removeAt(0);
               assert.isFalse(rs.isEqual(same));
            });
            it('should return false if record updated', function () {
               var same = new RecordSet({
                  rawData: $ws.core.clone(items)
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

            it('should throw an error', function() {
               var data4 = {id: 4},
                  data5 = {id: 5};
               assert.throw(function (){
                  rs.assign([new Model({
                     rawData: data4
                  }), data5]);
               });
            });
         });

         describe('.clear()', function() {
            it('should change raw data', function() {
               rs.clear();
               assert.deepEqual(rs.getRawData(), []);
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

            it('should throw an error', function() {
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
                  data: items,
                  idProperty: 'Ид'
               });
               source.query().addCallback(function(ds){
                  var rs = ds.getAll(),
                     length = rs.getCount(),
                     item_2 = $ws.core.clone(rs.at(0));
                  rs.at(2).setDeleted(true);
                  rs.at(6).setDeleted(true);
                  rs.saveChanges(source);
                  assert.equal(rs.getCount(), length-2);
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
         });

         describe('.merge()', function (){
            it('should merge two recordsets with default params', function() {
               var rs2 =  new RecordSet({
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
               var rs2 =  new RecordSet({
                  rawData: [{
                     'Ид': 2,
                     'Фамилия': 'Пушкин'
                  }],
                  idProperty: "Ид"
               });
               rs.merge(rs2, {remove: false});
               assert.equal(items.length, rs.getCount());
               assert.equal(rs.getRecordById(2).get('Фамилия'), 'Пушкин');

            });

            it('should merge two recordsets without merge', function() {
               var  rs2 =  new RecordSet({
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
               var  rs2 =  new RecordSet({
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

         describe('.getTreeIndex()', function (){
            it('should set meta data', function() {
               var rs =  new RecordSet({
                  rawData: [{
                     'Ид': 1,
                     'Раздел': null
                  }, {
                     'Ид': 2,
                     'Раздел': 1
                  }]
               });
               var index = rs.getTreeIndex('Раздел');
               assert.equal(index.null)
            });
         });



      });
   }
);
