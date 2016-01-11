/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Adapter.Json',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Factory',
   'js!SBIS3.CONTROLS.Data.Types.Enum',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet'
], function (AdapterJson, AdapterSbis, Model, List, DataSet, Factory, Enum, RecordSet) {
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
         [22]
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
            assert.instanceOf(sbisModel.get('recordSet'), List);
         });
         it('should cast value to RecordSet', function () {
            sbisModel.setUsingDataSetAsList(false);
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
            assert.strictEqual(val, $ws.helpers.bigNum(val).toString(20));
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
                  d: dataEmpty.map(function() {
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
                  it('should store record', function () {
                     var model = getModel(type),
                        record = new $ws.proto.Record();
                     record.addColumn('id', $ws.proto.Record.FIELD_TYPE_INTEGER);
                     record.set('id', 1);
                     model.set('record', record);
                     assert.deepEqual(getData(model, 3), record.toJSON());
                  });
                  it('should store a list', function () {
                     var model = getModel(type),
                        list = new List();
                     list.add(new Model({
                        adapter: new AdapterSbis(),
                        rawData: {
                           d: [2],
                           s: [{n: 'id', t: 'Число целое'}]
                        }
                     }));
                     list.add(new Model({
                        adapter: new AdapterSbis(),
                        rawData: {
                           d: [3],
                           s: [{n: 'id', t: 'Число целое'}]
                        }
                     }));
                     model.set('recordSet', list);
                     assert.strictEqual(2, model.get('recordSet').getCount());
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
                        dataSet = Factory._makeDataSet(data, adapter);
                     model.setUsingDataSetAsList(false);
                     model.set('recordSet', dataSet);
                     assert.deepEqual(getData(model, 4), dataSet.getRawData());
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
                     assert.strictEqual(getData(model, 8), $ws.helpers.bigNum(value).toString(20));
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
                  it('should store flags', function () {
                     var model = getModel(type),
                        d = [true, true, false],
                        testModel = new Model({
                           adapter: new AdapterSbis(),
                           rawData: {
                              d: d,
                              s: [{n: 'id', t: 'Логическое'},{n: 'id1', t: 'Логическое'},{n: 'id2', t: 'Логическое'}]
                           }
                        });
                     model.set('flags', testModel);
                     assert.deepEqual(getData(model, 5), d);
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
            assert.strictEqual(getData(sbisModelEmpty, identityIndex), 1);
         });
         it('should store [null] for Identity in filled model', function () {
            sbisModel.set('identity', null);
            assert.deepEqual(getData(sbisModel, identityIndex), [null]);
         });
         it('should store null for Identity in empty model', function () {
            sbisModelEmpty.set('identity', null);
            assert.isNull(getData(sbisModelEmpty, identityIndex));
         });
         it('should accept an empty list', function () {
            var res = Factory.serialize(new List(), 'RecordSet', new AdapterJson());
            assert.instanceOf(res, Array);
            assert.strictEqual(res.length, 0);
         });
      });
   });
});