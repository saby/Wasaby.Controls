/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Adapter.SbisRecord',
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory'
   ], function (SbisRecord, FieldsFactory) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Adapter.SbisRecord', function () {
         var data,
            adapter;

         beforeEach(function () {
            data = {
               d: [1, 'Иванов', 'Иван', 'Иванович'],
               s: [
                  {'n': 'Ид', 't': 'Число целое'},
                  {'n': 'Фамилия', 't': 'Строка'},
                  {'n': 'Имя', 't': 'Строка'},
                  {'n': 'Отчество', 't': 'Строка'}
               ]
            };

            adapter = new SbisRecord(data);
         });

         afterEach(function () {
            data = undefined;
            adapter = undefined;
         });

         describe('.get()', function () {
            it('should return the property value', function () {
               assert.strictEqual(
                  1,
                  adapter.get('Ид')
               );
               assert.strictEqual(
                  'Иванов',
                  adapter.get('Фамилия')
               );
               assert.isUndefined(
                  adapter.get('Должность')
               );
               assert.isUndefined(
                  adapter.get()
               );
               assert.isUndefined(
                  new SbisRecord({}).get('Должность')
               );
               assert.isUndefined(
                  new SbisRecord('').get()
               );
               assert.isUndefined(
                  new SbisRecord(0).get()
               );
               assert.isUndefined(
                  new SbisRecord().get()
               );
            });
         });

         describe('.set()', function () {
            it('should set the property value', function () {
               adapter.set('Ид', 20);
               assert.strictEqual(
                  20,
                  data.d[0]
               );
            });

            it('should throw an error on undefined property', function () {
               assert.throw(function () {
                  adapter.set('а', 5);
               });
               assert.throw(function () {
                  adapter.set('б');
               });
            });

            it('should throw an error on invalid data', function () {
               assert.throw(function () {
                  new SbisRecord('').set();
               });
               assert.throw(function () {
                  new SbisRecord(0).set(0);
               });
               assert.throw(function () {
                  new SbisRecord().set();
               });
            });
         });

         describe('.getData()', function () {
            it('should return raw data', function () {
               assert.strictEqual(adapter.getData(), data);
            });
         });

         describe('.getFormat()', function () {
            it('should return integer field format', function () {
               var format = adapter.getFormat('Ид');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.IntegerField'));
               assert.strictEqual(format.getName(), 'Ид');
            });
            it('should return real field format', function () {
               var data = {
                     d: [100.9999],
                     s: [{
                        n: 'real',
                        t: {n: 'Число вещественное', p: 20}
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('real');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.RealField'));
               assert.strictEqual(format.getPrecision(), 20);
            });
            it('should return money field format', function () {
               var data = {
                     d: [100.9999],
                     s: [{
                        n: 'money',
                        t: {n: 'Деньги', p: 2}
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('money');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.MoneyField'));
               assert.strictEqual(format.getPrecision(), 2);
            });
            it('should return string field format', function () {
               var format = adapter.getFormat('Фамилия');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.StringField'));
               assert.strictEqual(format.getName(), 'Фамилия');
            });
            it('should return text field format', function () {
               var data = {
                     d: ['Text'],
                     s: [{
                        n: 'text',
                        t: 'Текст'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('text');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.TextField'));
            });
            it('should return xml field format', function () {
               var data = {
                     d: ['<?xml version="1.1" encoding="UTF-8"?>'],
                     s: [{
                        n: 'xml',
                        t: 'XML-файл'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('xml');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.XmlField'));
            });
            it('should return datetime field format', function () {
               var data = {
                     d: [123],
                     s: [{
                        n: 'dt',
                        t: 'Дата и время'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('dt');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.DateTimeField'));
            });
            it('should return date field format', function () {
               var data = {
                     d: [123],
                     s: [{
                        n: 'date',
                        t: 'Дата'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('date');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.DateField'));
            });
            it('should return time field format', function () {
               var data = {
                     d: [123],
                     s: [{
                        n: 'time',
                        t: 'Время'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('time');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.TimeField'));
            });
            it('should return time interval field format', function () {
               var data = {
                     d: [123],
                     s: [{
                        n: 'timeint',
                        t: 'Временной интервал'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('timeint');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.TimeIntervalField'));
            });
            it('should return identity field format', function () {
               var data = {
                     d: [123],
                     s: [{
                        n: 'id',
                        t: 'Идентификатор'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('id');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.IdentityField'));
            });
            it('should return enum field format', function () {
               var data = {
                     d: [1],
                     s: [{
                        n: 'enum',
                        t: {
                           n: 'Перечисляемое',
                           s: {
                              0: 'one',
                              1: 'two'
                           }
                        }
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('enum');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.EnumField'));
               assert.strictEqual(format.getDictionary(), data.s[0].t.s);
            });
            it('should return flags field format', function () {
               var data = {
                     d: [1],
                     s: [{
                        n: 'flags',
                        t: {
                           n: 'Флаги',
                           s: {
                              0: 'one',
                              1: 'two'
                           }
                        }
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('flags');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.FlagsField'));
               assert.strictEqual(format.getDictionary(), data.s[0].t.s);
            });
            it('should return record field format', function () {
               var data = {
                     d: [{d: [], s: []}],
                     s: [{
                        n: 'rec',
                        t: 'Запись'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('rec');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.RecordField'));
            });
            it('should return recordset field format', function () {
               var data = {
                     d: [{d: [], s: []}],
                     s: [{
                        n: 'rs',
                        t: 'Выборка'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('rs');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.RecordSetField'));
            });
            it('should return binary field format', function () {
               var data = {
                     d: [''],
                     s: [{
                        n: 'bin',
                        t: 'Двоичное'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('bin');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.BinaryField'));
            });
            it('should return UUID field format', function () {
               var data = {
                     d: [''],
                     s: [{
                        n: 'uuid',
                        t: 'UUID'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('uuid');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.UuidField'));
            });
            it('should return RPC-File field format', function () {
               var data = {
                     d: [''],
                     s: [{
                        n: 'file',
                        t: 'Файл-rpc'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('file');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.RpcFileField'));
            });
            it('should return hierarchy field format', function () {
               var data = {
                     d: [''],
                     s: [{
                        n: 'hierarchy',
                        t: 'Иерархия'
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('hierarchy');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.HierarchyField'));
            });
            it('should return array field format', function () {
               var data = {
                     d: [''],
                     s: [{
                        n: 'arr',
                        t: {
                           n: 'Массив',
                           t: 'Логическое'
                        }
                     }]
                  },
                  adapter = new SbisRecord(data),
                  format = adapter.getFormat('arr');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.ArrayField'));
               assert.strictEqual(format.getKind(), 'Boolean');
            });
            it('should throw an error for not exists field', function () {
               assert.throw(function () {
                  adapter.getFormat('Some');
               });
            });
         });

         describe('.addField()', function () {
            it('should add a boolean field', function () {
               var fieldName = 'New',
                  fieldIndex = 1,
                  field = FieldsFactory.create({
                     type: 'boolean',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.getFormat(fieldName).getName(), fieldName);
               assert.strictEqual(adapter.getFields()[fieldIndex], fieldName);
               assert.strictEqual(adapter.get(fieldName), false);
            });
            it('should add an integer field', function () {
               var fieldName = 'New',
                  field = FieldsFactory.create({
                     type: 'integer',
                     name: fieldName
                  });
               adapter.addField(field);
               assert.strictEqual(adapter.get(fieldName), 0);
            });
            it('should add a real field', function () {
               var fieldName = 'New',
                  fieldIndex = 0,
                  precision = 3,
                  field = FieldsFactory.create({
                     type: 'real',
                     name: fieldName,
                     precision: precision
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), 0);
               assert.strictEqual(adapter.getData().s[fieldIndex].t.p, precision);
            });
            it('should add a money field', function () {
               var fieldName = 'New',
                  fieldIndex = 0,
                  precision = 3,
                  field = FieldsFactory.create({
                     type: 'money',
                     name: fieldName,
                     precision: precision
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), 0);
               assert.strictEqual(adapter.getData().s[fieldIndex].t.p, precision);
            });
            it('should add a string field', function () {
               var fieldName = 'New',
                  field = FieldsFactory.create({
                     type: 'string',
                     name: fieldName
                  });
               adapter.addField(field);
               assert.strictEqual(adapter.get(fieldName), '');
            });
            it('should use a field default value', function () {
               var fieldName = 'New',
                  def = 'abc';
               adapter.addField(FieldsFactory.create({
                  type: 'string',
                  name: fieldName,
                  defaultValue: def
               }));
               assert.strictEqual(adapter.get(fieldName), def);
            });
            it('should throw an error for already exists field', function () {
               assert.throw(function () {
                  adapter.addField(FieldsFactory.create({
                     type: 'string',
                     name: 'Ид'
                  }));
               });
            });
            it('should throw an error for not a field', function () {
               assert.throw(function () {
                  adapter.addField();
               });
               assert.throw(function () {
                  adapter.addField(null);
               });
               assert.throw(function () {
                  adapter.addField({
                     type: 'string',
                     name: 'New'
                  });
               });
            });
         });

         describe('.removeField()', function () {
            it('should remove exists field', function () {
               var name = 'Ид',
                  index = 0,
                  newFields = adapter.getFields(),
                  newData = adapter.getData().d.slice();
               adapter.removeField(name);
               newFields.splice(index, 1);
               newData.splice(index, 1);

               assert.isUndefined(adapter.get(name));
               assert.deepEqual(adapter.getFields(), newFields);
               assert.deepEqual(adapter.getData().d, newData);
               assert.throw(function () {
                  adapter.getFormat(name);
               });
            });
            it('should throw an error for not exists field', function () {
               assert.throw(function () {
                  adapter.removeField('Some');
               });
            });
         });

         describe('.removeFieldAt()', function () {
            it('should remove exists field', function () {
               var name = 'Ид',
                  index = 0,
                  newFields = adapter.getFields(),
                  newData = adapter.getData().d.slice();
               adapter.removeFieldAt(0);
               newFields.splice(index, 1);
               newData.splice(index, 1);

               assert.isUndefined(adapter.get(name));
               assert.deepEqual(adapter.getFields(), newFields);
               assert.deepEqual(adapter.getData().d, newData);
               assert.throw(function () {
                  adapter.getFormat(name);
               });
            });
            it('should throw an error for not exists field', function () {
               assert.throw(function () {
                  adapter.removeFieldAt(9);
               });
            });
         });
      });
   }
);
