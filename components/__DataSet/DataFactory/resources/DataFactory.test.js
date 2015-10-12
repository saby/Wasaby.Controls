/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.SbisJSONStrategy',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.DataSet',
   'js!SBIS3.CONTROLS.DataFactory'
], function (SbisJSONStrategy, Record, DataSet, Factory) {
      'use strict';
      var sbisRecord,sbisRecordSet;
      beforeEach(function(){
         sbisRecord = new Record({
            strategy: new SbisJSONStrategy(),
            raw: {
               d:[4,
                  'Строка',
                  1,
                  {d:[1],s:[{n: 'id',t: 'Число целое'}]},
                  {d:[[1]],s:[{n: 'id',t: 'Число целое'}]},
                  [true,false,false],
                  6,
                  '7.2',
                  '5200',
                  '2015-09-24 15:54:28.981+03',
                  '2015-09-24',
                  '15:54:28.981+03',
                  'P10DT0H0M0S',//10 дней
                  [22]
               ],
               s:[{
                  n: 'id',
                  t: 'Число целое'
               },{
                  n: 'title',
                  t: 'Строка'
               },{
                  n: 'enum',
                  t: {n:'Перечисляемое',s:{'0':'one','1':'tt'}}
               },{
                  n: 'record',
                  t: 'Запись'
               },{
                  n: 'recordSet',
                  t: 'Выборка'
               },{
                  n: 'flags',
                  t: {n: "Флаги", s: {0: "one", 1: "two", 2: "three"}}
               },{
                  n: 'link',
                  t: {n:'Связь',s:''}
               },{
                  n: 'double',
                  t: 'Число вещественное'
               },{
                  n: 'money',
                  t: {n:'Деньги',p:'20'}
               },{
                  n: 'dateTime',
                  t: 'Дата и время'
               },{
                  n: 'date',
                  t: 'Дата'
               },{
                  n: 'time',
                  t: 'Время'
               },{
                  n: 'TimeInterval',
                  t: 'Временной интервал'
               },{
                  n: 'identity',
                  t: 'Идентификатор'
               }
               ]
            }
         });
         sbisRecordSet = new Record({
            strategy: new SbisJSONStrategy(),
            raw: {
               d:[null,
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
               ],
               s:[{
                  n: 'id',
                  t: 'Число целое'
               },{
                  n: 'title',
                  t: 'Строка'
               },{
                  n: 'enum',
                  t: {n:'Перечисляемое',s:{'0':'one','1':'tt'}}
               },{
                  n: 'record',
                  t: 'Запись'
               },{
                  n: 'recordSet',
                  t: 'Выборка'
               },{
                  n: 'flags',
                  t: {n: "Флаги", s: {0: "one", 1: "two", 2: "three"}}
               },{
                  n: 'link',
                  t: {n:'Связь',s:''}
               },{
                  n: 'double',
                  t: 'Число вещественное'
               },{
                  n: 'money',
                  t: {n:'Деньги',p:'20'}
               },{
                  n: 'dateTime',
                  t: 'Дата и время'
               },{
                  n: 'date',
                  t: 'Дата'
               },{
                  n: 'time',
                  t: 'Время'
               },{
                  n: 'TimeInterval',
                  t: 'Временной интервал'
               },{
                  n: 'identity',
                  t: 'Идентификатор'
               }
               ]
            }
         });
      });
      describe('SBIS3.CONTROLS.DataFactory', function () {
         describe('.cast()', function () {
            it('should cast value to integer', function () {
               var val = sbisRecord.get('id');
               assert.strictEqual(val,4);
            });
            it('should cast value to string', function () {
               var val = sbisRecord.get('title');
               assert.strictEqual(val,'Строка');

            });
            it('should cast value to enum', function () {
               var val = sbisRecord.get('enum');
               assert.instanceOf(val,$ws.proto.Enum);
            });
            it('should cast value to Record', function () {
               var val = sbisRecord.get('record');
               assert.instanceOf(val,Record);

            });
            it('should cast value to dataSet', function () {
               var val = sbisRecord.get('recordSet');
               if(!(val instanceof DataSet)){
                  assert.fail();
               }
            });
            it('should cast value to flags', function () {
               var val = sbisRecord.get('flags');
               assert.strictEqual(val.get('one'), true);
               assert.strictEqual(val.get('two'), false);
               assert.strictEqual(val.get('three'), false);
               assert.strictEqual(val.get('four'), undefined);
            });
            it('should cast link to integer', function () {
               var val = sbisRecord.get('link');
               assert.strictEqual(val,6)
            });
            it('should cast value to money', function () {
               var val = sbisRecord.get('money');
               assert.strictEqual(val,$ws.helpers.bigNum(val).toString(20));
            });
            it('should cast dateTime to Date', function () {
               var val = sbisRecord.get('dateTime');
               assert.instanceOf(val,Date);
            });
            it('should cast date to Date', function () {
               var val = sbisRecord.get('date');
               assert.instanceOf(val,Date);

            });
            it('should cast time to Date', function () {
               var val = sbisRecord.get('time');
               assert.instanceOf(val,Date);
            });
            it('should cast identity to integer', function () {
               var val = sbisRecord.get('identity');
               assert.equal(val,22);
            });
            it('should cast timeInterval', function () {
               var val = sbisRecord.get('TimeInterval');
               assert.equal(val,'P10DT0H0M0S');
            });
         });
         describe('.serialize()', function () {
            var getData = function(index){
               return sbisRecordSet.getRaw().d[index];
            };
            it('should serialize integer value', function () {
               sbisRecordSet.set('id',1);
               assert.strictEqual(getData(0),1);
            });
            it('should serialize string value', function () {
               var val = sbisRecordSet.set('title','test');
               assert.strictEqual(getData(1),'test');
            });
            it('should serialize enum value', function () {
               var val = sbisRecordSet.get('enum');
               sbisRecordSet.set('enum',1);
               assert.strictEqual(getData(2),1);
            });
            it('should serialize Record', function () {
               var record = new Record({
                  strategy: new SbisJSONStrategy(),
                  raw: {d:[1],s:[{n: 'id',t: 'Число целое'}]}
               });
               sbisRecordSet.set('record',record);
               assert.deepEqual(getData(3),record.getRaw());
            });
            it('should serialize record', function () {
               var record = new $ws.proto.Record();
               record.addColumn('id',$ws.proto.Record.FIELD_TYPE_INTEGER);
               record.set('id',1);
               sbisRecordSet.set('record',record);
               assert.deepEqual(getData(3),record.toJSON());
            });
            it('should serialize dataSet', function () {
               var data = {
                     'd':[[0]],
                     's':[{n: 'id',t: 'Число целое'}]
                  },
                  strategy = new SbisJSONStrategy(),
                  dataSet = Factory.makeDataSet(data, strategy);
               sbisRecordSet.set('recordSet',dataSet);
               assert.deepEqual(getData(4),dataSet.getRawData());
            });
            it('should serialize flags', function () {
               sbisRecordSet.set('flags',null);
               assert.strictEqual(getData(5),null);
            });
            it('should serialize link', function () {
               sbisRecordSet.set('link',1);
               assert.equal(getData(6),1);
            });
            it('should serialize double', function () {
               sbisRecordSet.set('double',5.1);
               assert.strictEqual(getData(7),5.1);
            });
            it('should serialize money', function () {
               var value = 12.003;
               sbisRecordSet.set('money',value);
               assert.strictEqual(getData(8),$ws.helpers.bigNum(value).toString(20));
            });
            it('should serialize date and time', function () {
               var date = new Date();
               sbisRecordSet.set('dateTime',date);
               assert.equal(getData(9),date.toSQL(true));
            });
            it('should serialize date', function () {
               var date = new Date();
               sbisRecordSet.set('date',date);
               assert.equal(getData(10),date.toSQL());
            });
            it('should serialize time', function () {
               var date = new Date();
               sbisRecordSet.set('time',date);
               assert.equal(getData(11),date.toSQL(false));
            });
            it('should serialize identity', function () {
               var date = new Date();
               sbisRecordSet.set('identity',1);
               assert.equal(getData(13),[1]);
            });
         });
      });
   }
);