/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Adapter.Json',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Factory',
   'js!SBIS3.CONTROLS.Data.Types.Enum',
   'js!SBIS3.CONTROLS.Data.Types.Flags'
], function (AdapterJson, AdapterSbis, Model, List, RecordSet, DataSet, Factory, Enum, Flags) {
   'use strict';

   var dataScheme,
      dataValues,
      dataEmpty,
      sbisModel,
      sbisModelEmpty,
      identityIndex = 13;

   beforeEach(function () {
      dataScheme = [{
         n: 'id',
         t: 'Число целое'
      }, {
         n: 'title',
         t: 'Строка'
      }, {
         n: 'enum',
         t: {n: 'Перечисляемое', s: {'0': 'one', '1': 'tt'}}
      }, {
         n: 'record',
         t: 'Запись'
      }, {
         n: 'recordSet',
         t: 'Выборка'
      }, {
         n: 'flags',
         t: {n: 'Флаги', s: {0: 'one', 1: 'two', 2: 'three'}}
      }, {
         n: 'link',
         t: {n: 'Связь', s: ''}
      }, {
         n: 'double',
         t: 'Число вещественное'
      }, {
         n: 'money',
         t: {n: 'Деньги', p: '20'}
      }, {
         n: 'dateTime',
         t: 'Дата и время'
      }, {
         n: 'date',
         t: 'Дата'
      }, {
         n: 'time',
         t: 'Время'
      }, {
         n: 'TimeInterval',
         t: 'Временной интервал'
      }, {
         n: 'identity',
         t: 'Идентификатор'
      }, {
         n: 'arrayBool',
         t: {n: 'Массив', t: 'Логическое'}
      }, {
         n: 'arrayDate',
         t: {n: 'Массив', t: 'Дата'}
      }, {
         n: 'arrayDatetime',
         t: {n: 'Массив', t: 'Дата и время'}
      }, {
         n: 'arrayInt',
         t: {n: 'Массив', t: 'Число целое'}
      }, {
         n: 'arrayFloat',
         t: {n: 'Массив', t: 'Число вещественное'}
      }, {
         n: 'arrayString',
         t: {n: 'Массив', t: 'Текст'}
      }, {
         n: 'arrayTime',
         t: {n: 'Массив', t: 'Время'}
      }, {
         n: 'moneyShort',
         t: {n: 'Деньги', p: '2'}
      }];

      dataValues = [
         4,
         'Строка',
         1,
         {d: [1], s: [{n: 'id', t: 'Число целое'}]},
         {d: [[1]], s: [{n: 'id', t: 'Число целое'}]},
         [true, false, false],
         6,
         '7.2',
         '5200',
         '2015-09-24 15:54:28.981+03',
         '2015-09-24',
         '15:54:28.981+03',
         'P10DT0H0M0S',//10 дней
         [22],
         [true, false],
         ['2015-12-25'],
         ['2007-12-06 16:29:43.079+03'],
         [15, 19],
         [1.2, 1.3],
         ['text', 'text2'],
         ['12:30:00+03'],
         '7.2'
      ];

      dataEmpty = [
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null,
         null
      ];

      sbisModel = new Model({
         adapter: new AdapterSbis(),
         rawData: {
            d: dataValues,
            s: dataScheme
         }
      });

      sbisModelEmpty = new Model({
         adapter: (new AdapterSbis()),
         rawData: {
            d: dataEmpty,
            s: dataScheme
         }
      });
   });

   describe('SBIS3.CONTROLS.Data.Factory', function () {
      describe('.cast()', function () {
         it('should cast value to integer', function () {
            var val = sbisModel.get('id');
            assert.strictEqual(val, 4);
         });
         it('should cast value to string', function () {
            var val = sbisModel.get('title');
            assert.strictEqual(val, 'Строка');

         });
         it('should cast value to enum', function () {
            assert.instanceOf(sbisModel.get('enum'), Enum);
         });
         it('should cast value to model', function () {
            assert.instanceOf(sbisModel.get('record'), Model);

         });
         it('should cast value to List', function () {
            sbisModel.setUsingDataSetAsList(true);
            assert.isTrue($ws.helpers.instanceOfModule(sbisModel.get('recordSet'), 'SBIS3.CONTROLS.Data.Collection.List'));
         });
         it('should cast value to RecordSet', function () {
            assert.instanceOf(sbisModel.get('recordSet'), RecordSet);
         });


         it('should cast link to integer', function () {
            var val = sbisModel.get('link');
            assert.strictEqual(val, 6);
         });
         it('should cast value to double', function () {
            var val = sbisModel.get('double');
            assert.strictEqual(val, 7.2);
         });
         it('should cast value to money', function () {
            var val = sbisModel.get('money');
            assert.strictEqual(val, $ws.helpers.prepareMoneyByPrecision(val, 20));
         });
         it('should cast value to moneyShort', function () {
            var val = sbisModel.get('moneyShort');
            assert.strictEqual(val, '7.2');
         });

         it('should cast dateTime to Date', function () {
            assert.instanceOf(sbisModel.get('dateTime'), Date);
         });
         it('should cast date to Date', function () {
            assert.instanceOf(sbisModel.get('date'), Date);
         });
         it('should cast time to Date', function () {
            assert.instanceOf(sbisModel.get('time'), Date);
         });
         it('should cast undefined dateTime, date and time to undefined', function () {
            var model = new Model({
               adapter: new AdapterSbis(),
               rawData: {
                  d: $ws.helpers.map(dataEmpty, function() {
                     return undefined;
                  }),
                  s: dataScheme
               }
            });
            assert.isUndefined(model.get('dateTime'));
            assert.isUndefined(model.get('date'));
            assert.isUndefined(model.get('time'));
         });
         it('should cast identity to integer', function () {
            var val = sbisModel.get('identity');
            assert.equal(val, 22);
         });
         it('should cast timeInterval', function () {
            var val = sbisModel.get('TimeInterval');
            assert.equal(val, 'P10DT0H0M0S');
         });
         it('should cast timeInterval when value instance of TimeInterval', function () {
            var sbisModel = new Model({
               adapter: new AdapterSbis(),
               rawData: {
                  d:[new $ws.proto.TimeInterval('P10DT0H0M0S')],
                  s:[{
                     n: 'TimeInterval',
                     t: 'Временной интервал'
                  }]
               }
            });
            assert.equal(sbisModel.get('TimeInterval'), 'P10DT0H0M0S');
         });
         it('should cast flags', function () {
            var val = sbisModel.get('flags');
            assert.strictEqual(true, val.get('one'));
            assert.strictEqual(false, val.get('two'));
            assert.strictEqual(false, val.get('three'));
            assert.strictEqual(undefined, val.get('four'));
         });
         it('should return null for null value in raw data', function () {
            for (var i = 0; i < dataScheme.length; i++) {
               assert.isNull(sbisModelEmpty.get(dataScheme[i].n));
            }
         });
         it('should cast to array bool', function (){
            var val = sbisModel.get('arrayBool');
            assert.deepEqual(dataValues[14], val);
         });
         it('should cast to array arrayDate', function (){
            var val = sbisModel.get('arrayDate');
            assert.deepEqual([Date.fromSQL(dataValues[15][0])], val);
         });
         it('should cast to array arrayDateTime', function (){
            var val = sbisModel.get('arrayDatetime');
            assert.deepEqual([Date.fromSQL(dataValues[16][0])], val);
         });
         it('should cast to array arrayInt', function (){
            var val = sbisModel.get('arrayInt');
            assert.deepEqual(dataValues[17], val);
         });
         it('should cast to array arrayFloat', function (){
            var val = sbisModel.get('arrayFloat');
            assert.deepEqual(dataValues[18], val);
         });
         it('should cast to array string', function (){
            var val = sbisModel.get('arrayString');
            assert.deepEqual(dataValues[19], val);
         });
         it('should cast to array arrayTime', function (){
            var val = sbisModel.get('arrayTime');
            assert.deepEqual([Date.fromSQL(dataValues[20][0])], val);
         });

         it('should cast to array when value is null', function (){
            var sbisModel = new Model({
               adapter: new AdapterSbis(),
               rawData: {
                  d:[null],
                  s:[{
                     'n': 'arrayBool',
                     't': {'n': 'Массив', 't': 'Логическое'}
                  }]
               }
            });
            assert.equal(sbisModel.get('arrayBool'), null);
         });

         it('should get value from enum', function (){
            var
               enumNew = new Enum({
                  dictionary: ['one', 'tt'],
                  currentValue: 1
               }),
               enumOld = new $ws.proto.Enum({
                  availableValues: {'0': 'one', '1': 'tt'},
                  currentValue: 0
               });
               sbisModel = new Model({
               adapter: new AdapterSbis(),
               rawData: {
                  d:[enumNew, enumOld],
                  s:[{
                     n: 'enumNew',
                     t: {n: 'Перечисляемое', s: {'0': 'one', '1': 'tt'}}
                  },{
                     n: 'enumOld',
                     t: {n: 'Перечисляемое', s: {'0': 'one', '1': 'tt'}}
                  }]
               }
            });
            sbisModel.set('enumNew', enumNew);
            sbisModel.set('enumOld', enumOld);
            assert.equal(sbisModel.get('enumNew').get(), 1);
            assert.equal(sbisModel.get('enumOld').get(), 0);
         });
      });

      describe('.serialize()', function () {
         var getData = function (model, index) {
               return model.getRawData().d[index];
            },
            getModel = function (type) {
               return type === 'filled' ? sbisModel : sbisModelEmpty;
            },
            types = ['filled', 'empty'],
            type,
            model;
         while (types.length) {
            (function(type) {
               context('for ' + type + ' model', function () {
                  it('should store integer value', function () {
                     var model = getModel(type);
                     model.set('id', 1);
                     assert.strictEqual(getData(model, 0), 1);
                  });
                  it('should store string value', function () {
                     var model = getModel(type);
                     model.set('title', 'test');
                     assert.strictEqual(getData(model, 1), 'test');
                  });
                  it('should store enum value', function () {
                     var model = getModel(type);
                     //model.get('enum');
                     model.set('enum', 1);
                     assert.strictEqual(getData(model, 2), 1);
                  });
                  it('should store model', function () {
                     var model = getModel(type),
                        record = new Model({
                           adapter: (new AdapterSbis()),
                           rawData: {d: [1], s: [{n: 'id', t: 'Число целое'}]}
                        });
                     model.set('record', record);
                     assert.deepEqual(getData(model, 3), record.getRawData());
                  });
                  it('should throw an error if set model as not a model', function () {
                     var model = getModel(type);
                     assert.throw(function() {
                        model.set('record', {id: 502});
                     });
                  });
                  it('should store record', function () {
                     var model = getModel(type),
                        record = new $ws.proto.Record();
                     record.addColumn('id', $ws.proto.Record.FIELD_TYPE_INTEGER);
                     record.set('id', 1);
                     model.set('record', record);
                     assert.deepEqual(getData(model, 3), record.toJSON());
                  });
                  it('should throw an error if the record adapter is incompatible', function () {
                     var model = getModel(type),
                        record = new Model();
                     assert.throw(function() {
                        model.set('record', record);
                     });
                  });
                  it('should store a recordset', function () {
                     var model = getModel(type),
                        recordset = new RecordSet({
                           rawData: {
                              d: [[0], [1], [2]],
                              s: [{n: 'id', t: 'Число целое'}]
                           },
                           adapter: 'adapter.sbis'
                        });
                     model.set('recordSet', recordset);
                     assert.deepEqual(getData(model, 4).d, recordset.getRawData().d);
                     assert.deepEqual(getData(model, 4).s, recordset.getRawData().s);
                  });
                  it('should throw an error if the recordset adapter is incompatible', function () {
                     var model = getModel(type),
                        recordset = new RecordSet();
                     assert.throw(function() {
                        model.set('recordSet', recordset);
                     });
                  });
                  it('should store a list of records', function () {
                     var model = getModel(type),
                        items = [
                           getModel(type),
                           getModel(type),
                           getModel(type)
                        ];
                     model.set('recordSet', new List({
                        items: items
                     }));
                     for (var i = 0; i < items.length; i++) {
                        assert.deepEqual(getData(model, 4).d[i], items[i].getRawData().d);
                        assert.deepEqual(getData(model, 4).s, items[i].getRawData().s);
                     }
                  });
                  it('should throw an error if set recordset not as a list', function () {
                     var model = getModel(type);
                     assert.throw(function() {
                        model.set('recordSet', [{id: 502}]);
                     });
                  });
                  it('should store an old recordset', function () {
                     var model = getModel(type),
                        coldef = {
                           'keyColumnName': {
                              index: 0,
                              title: 'key',
                              type: 'Идентификатор'
                           },
                           'Название': {
                              index: 1,
                              title: 'name',
                              type: 'Строка'
                           }
                        },
                        recordset = new $ws.proto.RecordSetStatic({
                           defaultColumns: coldef,
                           records: [
                              new $ws.proto.Record({
                                 row: [0, 'b'],
                                 colDef: coldef,
                                 pkValue: 0
                              }),
                              new $ws.proto.Record({
                                 row: [1, 'c'],
                                 colDef: coldef,
                                 pkValue: 1
                              })
                           ]
                        });
                     model.set('recordSet', recordset);
                     model.get('recordSet').each(function(item, index) {
                        assert.deepEqual(getData(model, 4).d[index], item.getRawData().d);
                        assert.deepEqual(getData(model, 4).s, item.getRawData().s);
                     });
                  });
                  it('should store dataSet', function () {
                     var model = getModel(type),
                        data = {
                           d: [[0]],
                           s: [{n: 'id', t: 'Число целое'}]
                        },
                        adapter = new AdapterSbis(),
                        rs = Factory._makeRecordSet(data, adapter);
                     model.set('recordSet', rs);
                     assert.deepEqual(getData(model, 4), rs.getRawData());
                  });
                  it('should store link', function () {
                     var model = getModel(type);
                     model.set('link', 1);
                     assert.equal(getData(model, 6), 1);
                  });
                  it('should store double', function () {
                     var model = getModel(type);
                     model.set('double', 5.1);
                     assert.strictEqual(getData(model, 7), 5.1);
                  });
                  it('should store money', function () {
                     var model = getModel(type),
                        value = 12.003;
                     model.set('money', value);
                     assert.strictEqual(getData(model, 8), $ws.helpers.prepareMoneyByPrecision(value, 20));
                  });
                  it('should store date and time', function () {
                     var model = getModel(type),
                        date = new Date();
                     model.set('dateTime', date);
                     assert.equal(getData(model, 9), date.toSQL(true));
                  });
                  it('should store date', function () {
                     var model = getModel(type),
                        date = new Date();
                     model.set('date', date);
                     assert.equal(getData(model, 10), date.toSQL());
                  });
                  it('should store time', function () {
                     var model = getModel(type),
                        date = new Date();
                     model.set('time', date);
                     assert.equal(getData(model, 11), date.toSQL(false));
                  });
                  it('should store flags as flags', function () {
                     var model = getModel(type),
                        d = [true, false, null],
                        flags = new Flags({
                           dictionary: ['one', 'two', 'three'],
                           values: [true, false, null]
                        });
                     model.set('flags', flags);
                     assert.deepEqual(getData(model, 5), d);
                  });
                  it('should store flags as model', function () {
                     var model = getModel(type),
                        d = [true, true, false],
                        testModel = new Model({
                           adapter: new AdapterSbis(),
                           rawData: {
                              d: d,
                              s: [
                                 {n: 'id', t: 'Логическое'},
                                 {n: 'id1', t: 'Логическое'},
                                 {n: 'id2', t: 'Логическое'}
                              ]
                           }
                        });
                     model.set('flags', testModel);
                     assert.deepEqual(getData(model, 5), d);
                  });

                  it('should store flags from array', function () {
                     var model = getModel(type);
                     var d = [true, true, false];
                     model.set('flags', [true, true, false]);
                     assert.deepEqual(getData(model, 5), d);
                  });

                  it('should store flags from $ws record', function () {
                     var model = getModel(type);
                     var record = new $ws.proto.Record();
                     record.addColumn('one', $ws.proto.Record.FIELD_TYPE_BOOLEAN);
                     record.addColumn('two', $ws.proto.Record.FIELD_TYPE_BOOLEAN);
                     record.addColumn('three', $ws.proto.Record.FIELD_TYPE_BOOLEAN);
                     record.set('one', true);
                     record.set('two', false);
                     model.set('flags', record);
                     assert.deepEqual(getData(model, 5), [true, false, null]);
                  });

                  it('should store flags from null', function () {
                     var model = getModel(type);
                     model.set('flags', null);
                     assert.deepEqual(getData(model, 5), null);
                  });

                  it('should store null for not Identity', function () {
                     var model = getModel(type);
                     for (var i = 0; i < dataScheme.length; i++) {
                        if (dataScheme[i].t === 'Идентификатор') {
                           continue;
                        }
                        model.set(dataScheme[i].n, null);
                        assert.isNull(getData(model, i));
                     }
                  });
               });
            })(types.shift());
         }

         it('should store Identity in filled model', function () {
            sbisModel.set('identity', 1);
            assert.deepEqual(getData(sbisModel, identityIndex), [1]);
         });
         it('should store Identity in empty model', function () {
            sbisModelEmpty.set('identity', 1);
            assert.deepEqual(getData(sbisModelEmpty, identityIndex), [1]);
         });
         it('should store [null] for Identity in filled model', function () {
            sbisModel.set('identity', null);
            assert.deepEqual(getData(sbisModel, identityIndex), [null]);
         });
         it('should store null for Identity in empty model', function () {
            sbisModelEmpty.set('identity', null);
            assert.isNull(getData(sbisModelEmpty, identityIndex));
         });
         it('should accept an empty recordset', function () {
            var res = Factory.serialize(new RecordSet(), 'RecordSet', new AdapterJson());
            assert.isNull(res);

            res = Factory.serialize(new RecordSet({rawData: []}), 'RecordSet', new AdapterJson());
            assert.instanceOf(res, Array);
            assert.strictEqual(res.length, 0);
         });
         it('should serialize array of date', function (){
            var  date = new Date(2016,1,1);
            sbisModelEmpty.set('arrayDate',[date]);
            assert.deepEqual([date.toSQL()], getData(sbisModelEmpty, 15));
         });
         it('should serialize array of date and time', function (){
            var date = new Date(2016,1,1);
            sbisModelEmpty.set('arrayDatetime',[date]);
            assert.deepEqual([date.toSQL(true)], getData(sbisModelEmpty, 16));
         });
         it('should serialize array of int', function (){
            sbisModelEmpty.set('arrayInt',[2,3]);
            assert.deepEqual([2,3], getData(sbisModelEmpty, 17));
         });
         it('should serialize array of float', function (){
            sbisModelEmpty.set('arrayFloat',[2.1,3.3]);
            assert.deepEqual([2.1,3.3], getData(sbisModelEmpty, 18));

         });
         it('should serialize array of string', function (){
            sbisModelEmpty.set('arrayString',['stop','bomb']);
            assert.deepEqual(['stop','bomb'], getData(sbisModelEmpty, 19));
         });
         it('should serialize array of time', function (){
            var  date = new Date(2016,1,1);
            sbisModelEmpty.set('arrayTime',[date]);
            assert.deepEqual([date.toSQL(false)], getData(sbisModelEmpty, 20));
         });

      });
   });
});