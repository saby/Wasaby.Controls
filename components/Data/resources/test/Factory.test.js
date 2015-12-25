/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Adapter.Json',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Factory',
   'js!SBIS3.CONTROLS.Data.Types.Enum'
], function (AdapterJson, AdapterSbis, Model, List, DataSet, Factory, Enum) {
   'use strict';

   var dataScheme,
      dataValues,
      dataEmpty,
      sbisModel,
      sbisModelEmpty;

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
         "n":"arrayBool",
         "t":{"n":"Массив","t":"Логическое"}
      }, {
         "n":"arrayDate",
         "t":{"n":"Массив","t":"Дата"}
      }, {
         "n":"arrayDatetime",
         "t":{"n":"Массив","t":"Дата и время"}
      }, {
         "n":"arrayInt",
         "t":{"n":"Массив","t":"Число целое"}
      }, {
         "n":"arrayFloat",
         "t":{"n":"Массив","t":"Число вещественное"}
      }, {
         "n":"arrayString",
         "t":{"n":"Массив","t":"Текст"}
      }, {
         "n":"arrayTime",
         "t":{"n":"Массив","t":"Время"}
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
         [true,false],
         ["2015-12-25"],
         ["2007-12-06 16:29:43.079+03"],
         [15,19],
         [1.2,1.3],
         ["text","text2"],
         ["12:30:00+03"]
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
         it('should not cast null to string', function () {
            var val = sbisModelEmpty.get('title');
            assert.strictEqual(val, null);

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
         it('should cast value to DataSet', function () {
            sbisModel.setUsingDataSetAsList(false);
            assert.instanceOf(sbisModel.get('recordSet'), DataSet);
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
         it('should cast null dateTime to null', function () {
            assert.isNull(sbisModelEmpty.get('dateTime'));
         });
         it('should cast date to Date', function () {
            assert.instanceOf(sbisModel.get('date'), Date);
         });
         it('should cast null date to null', function () {
            assert.isNull(sbisModelEmpty.get('date'));
         });
         it('should cast time to Date', function () {
            assert.instanceOf(sbisModel.get('time'), Date);
         });
         it('should cast null time to null', function () {
            assert.isNull(sbisModelEmpty.get('time'));
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
      });
      describe('.serialize()', function () {
         var getData = function (index) {
            return sbisModelEmpty.getRawData().d[index];
         };
         it('should serialize integer value', function () {
            sbisModelEmpty.set('id', 1);
            assert.strictEqual(getData(0), 1);
         });
         it('should serialize string value', function () {
            var val = sbisModelEmpty.set('title', 'test');
            assert.strictEqual(getData(1), 'test');
         });
         it('should serialize enum value', function () {
            var val = sbisModelEmpty.get('enum');
            sbisModelEmpty.set('enum', 1);
            assert.strictEqual(getData(2), 1);
         });
         it('should serialize model', function () {
            var record = new Model({
               adapter: (new AdapterSbis()),
               rawData: {d: [1], s: [{n: 'id', t: 'Число целое'}]}
            });
            sbisModelEmpty.set('record', record);
            assert.deepEqual(getData(3), record.getRawData());
         });
         it('should serialize record', function () {
            var record = new $ws.proto.Record();
            record.addColumn('id', $ws.proto.Record.FIELD_TYPE_INTEGER);
            record.set('id', 1);
            sbisModelEmpty.set('record', record);
            assert.deepEqual(getData(3), record.toJSON());
         });
         it('should serialize a list', function () {
            var list = sbisModel.get('recordSet');
            list.add(new Model({
               adapter: new AdapterSbis(),
               rawData: {
                  d: [2],
                  s: [{n: 'id', t: 'Число целое'}]
               }
            }));
            sbisModelEmpty.set('recordSet', list);
            assert.strictEqual(2, sbisModelEmpty.get('recordSet').getCount());
            assert.deepEqual(getData(4), sbisModelEmpty.getRawData().d[4]);
            sbisModelEmpty.get('recordSet').each(function(item, index) {
               assert.deepEqual(getData(4).d[index], item.getRawData().d);
               assert.deepEqual(getData(4).s, item.getRawData().s);
            });
         });
         it('should serialize an empty list', function () {
            var res = Factory.serialize(new List(), 'DataSet', new AdapterJson());
            assert.instanceOf(res, Array);
            assert.strictEqual(res.length, 0);
         });
         it('should serialize dataSet', function () {
            var data = {
                  d: [[0]],
                  s: [{n: 'id', t: 'Число целое'}]
               },
               adapter = new AdapterSbis(),
               dataSet = Factory._makeDataSet(data, adapter);
            sbisModel.setUsingDataSetAsList(false);
            sbisModelEmpty.set('recordSet', dataSet);
            assert.deepEqual(getData(4), dataSet.getRawData());
         });
         it('should serialize flags', function () {
            sbisModelEmpty.set('flags', null);
            assert.strictEqual(getData(5), null);
         });
         it('should serialize link', function () {
            sbisModelEmpty.set('link', 1);
            assert.equal(getData(6), 1);
         });
         it('should serialize double', function () {
            sbisModelEmpty.set('double', 5.1);
            assert.strictEqual(getData(7), 5.1);
         });
         it('should serialize money', function () {
            var value = 12.003;
            sbisModelEmpty.set('money', value);
            assert.strictEqual(getData(8), $ws.helpers.bigNum(value).toString(20));
         });
         it('should serialize date and time', function () {
            var date = new Date();
            sbisModelEmpty.set('dateTime', date);
            assert.equal(getData(9), date.toSQL(true));
         });
         it('should serialize date', function () {
            var date = new Date();
            sbisModelEmpty.set('date', date);
            assert.equal(getData(10), date.toSQL());
         });
         it('should serialize time', function () {
            var date = new Date();
            sbisModelEmpty.set('time', date);
            assert.equal(getData(11), date.toSQL(false));
         });
         it('should serialize identity', function () {
            var date = new Date();
            sbisModelEmpty.set('identity', 1);
            assert.equal(getData(13), [1]);
         });
         it('should serialize flags', function () {
            var d = [true, true, false],
            testModel = new Model({
               adapter: new AdapterSbis(),
               rawData: {
                  d: d,
                  s: [{n: 'id', t: 'Логическое'},{n: 'id1', t: 'Логическое'},{n: 'id2', t: 'Логическое'}]
               }
            });
            sbisModelEmpty.set('flags', testModel);
            assert.deepEqual(getData(5), d);
         });
      });
   });
});