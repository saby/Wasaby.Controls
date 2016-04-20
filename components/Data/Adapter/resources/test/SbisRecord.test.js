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
                  adapter.set();
               });
               assert.throw(function () {
                  adapter.set('');
               });
               assert.throw(function () {
                  adapter.set(0);
               });
            });
         });

         describe('.clear()', function () {
            it('should return an empty record', function () {
               assert.isTrue(data.d.length > 0);
               assert.isTrue(data.s.length > 0);
               adapter.clear();
               assert.strictEqual(adapter.getData().d.length, 0);
               assert.strictEqual(adapter.getData().s.length, 0);
            });
            it('should return a same instance', function () {
               adapter.clear();
               assert.strictEqual(data, adapter.getData());
            });
         });

         describe('.getEmpty()', function () {
            it('should return empty raw data', function () {
               assert.deepEqual(
                  adapter.getEmpty(),
                  {d:[], s: data.s}
               );
            });
         });

         describe('.getData()', function () {
            it('should return raw data', function () {
               assert.strictEqual(adapter.getData(), data);
            });
         });

         describe('.getFields()', function () {
            it('should return fields list', function () {
               assert.deepEqual(
                  adapter.getFields(),
                  ['Ид', 'Фамилия', 'Имя', 'Отчество']
               );
            });
         });

         describe('.getFormat()', function () {
            it('should return Integer field format', function () {
               var format = adapter.getFormat('Ид');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.IntegerField'));
               assert.strictEqual(format.getName(), 'Ид');
            });
            it('should return Real field format', function () {
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
            it('should return Money field format', function () {
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
            it('should return String field format', function () {
               var format = adapter.getFormat('Фамилия');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.StringField'));
               assert.strictEqual(format.getName(), 'Фамилия');
            });
            it('should return Text field format', function () {
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
            it('should return XML field format', function () {
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
            it('should return DateTime field format', function () {
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
            it('should return Date field format', function () {
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
            it('should return Time field format', function () {
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
            it('should return TimeInterval field format', function () {
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
            it('should return Identity field format', function () {
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
            it('should return Enum field format', function () {
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
               assert.deepEqual(format.getDictionary(), data.s[0].t.s);
            });
            it('should return Flags field format', function () {
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
               assert.deepEqual(format.getDictionary(), data.s[0].t.s);
            });
            it('should return Record field format', function () {
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
            it('should return RecordSet field format', function () {
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
            it('should return Binary field format', function () {
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
            it('should return Hierarchy field format', function () {
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
            it('should return Array field format', function () {
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
            it('should return String field format for unknown type', function () {
               var adapter = new SbisRecord({
                     d: [0],
                     s: [{n: 'Ид', t: 'Связь'}]
                  }),
                  format = adapter.getFormat('Ид');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.StringField'));
               assert.strictEqual(format.getName(), 'Ид');
            });
            it('should throw an error for not exists field', function () {
               assert.throw(function () {
                  adapter.getFormat('Some');
               });
            });
         });

         describe('.addField()', function () {
            it('should add a Boolean field', function () {
               var fieldName = 'New',
                  fieldIndex = 1,
                  field = FieldsFactory.create({
                     type: 'boolean',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.getFormat(fieldName).getName(), fieldName);
               assert.strictEqual(adapter.getFields()[fieldIndex], fieldName);
               assert.isNull(adapter.get(fieldName));
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Логическое');
            });
            it('should add an Integer field', function () {
               var fieldName = 'New',
                  fieldIndex = 1,
                  field = FieldsFactory.create({
                     type: 'integer',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), 0);
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Число целое');
            });
            it('should add a Real field', function () {
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
               assert.strictEqual(adapter.getData().s[fieldIndex].t.n, 'Число вещественное');
               assert.strictEqual(adapter.getData().s[fieldIndex].t.p, precision);
            });
            it('should add a Money field', function () {
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
               assert.strictEqual(adapter.getData().s[fieldIndex].t.n, 'Деньги');
               assert.strictEqual(adapter.getData().s[fieldIndex].t.p, precision);
            });
            it('should add a String field', function () {
               var fieldName = 'New',
                  fieldIndex = 2,
                  field = FieldsFactory.create({
                     type: 'string',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.isNull(adapter.get(fieldName));
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Строка');
            });
            it('should add a Text field', function () {
               var fieldName = 'New',
                  fieldIndex = 2,
                  field = FieldsFactory.create({
                     type: 'text',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.isNull(adapter.get(fieldName));
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Текст');
            });
            it('should add a XML field', function () {
               var fieldName = 'New',
                  fieldIndex = 3,
                  field = FieldsFactory.create({
                     type: 'xml',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), '');
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'XML-файл');
            });
            it('should add a DateTime field', function () {
               var fieldName = 'New',
                  fieldIndex = 3,
                  field = FieldsFactory.create({
                     type: 'datetime',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), null);
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Дата и время');
            });
            it('should add a Date field', function () {
               var fieldName = 'New',
                  fieldIndex = 4,
                  field = FieldsFactory.create({
                     type: 'date',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), null);
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Дата');
            });
            it('should add a Time field', function () {
               var fieldName = 'New',
                  fieldIndex = 4,
                  field = FieldsFactory.create({
                     type: 'time',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), null);
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Время');
            });
            it('should add a TimeInterval field', function () {
               var fieldName = 'New',
                  fieldIndex = 4,
                  field = FieldsFactory.create({
                     type: 'timeinterval',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), 0);
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Временной интервал');
            });
            it('should add a Identity field', function () {
               var fieldName = 'New',
                  fieldIndex = 4,
                  field = FieldsFactory.create({
                     type: 'identity',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.deepEqual(adapter.get(fieldName), [null]);
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Идентификатор');
            });
            it('should add an Enum field', function () {
               var fieldName = 'New',
                  fieldIndex = 0,
                  field = FieldsFactory.create({
                     type: 'enum',
                     name: fieldName,
                     defaultValue: 1,
                     dictionary: {0: '1st', 1: '2nd'}
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), 1);
               assert.strictEqual(adapter.getData().s[fieldIndex].t.n, 'Перечисляемое');
               assert.strictEqual(adapter.getData().s[fieldIndex].t.s, field.getDictionary());
            });
            it('should add a Flags field', function () {
               var fieldName = 'New',
                  fieldIndex = 0,
                  field = FieldsFactory.create({
                     type: 'flags',
                     name: fieldName,
                     defaultValue: [1],
                     dictionary: {0: '1st', 1: '2nd'}
                  });
               adapter.addField(field, fieldIndex);
               assert.deepEqual(adapter.get(fieldName), [1]);
               assert.strictEqual(adapter.getData().s[fieldIndex].t.n, 'Флаги');
               assert.strictEqual(adapter.getData().s[fieldIndex].t.s, field.getDictionary());
            });
            it('should add a Record field', function () {
               var fieldName = 'New',
                  fieldIndex = 0,
                  field = FieldsFactory.create({
                     type: 'record',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), null);
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Запись');
            });
            it('should add a RecordSet field', function () {
               var fieldName = 'New',
                  fieldIndex = 0,
                  field = FieldsFactory.create({
                     type: 'recordset',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), null);
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Выборка');
            });
            it('should add a Binary field', function () {
               var fieldName = 'New',
                  fieldIndex = 0,
                  field = FieldsFactory.create({
                     type: 'binary',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), null);
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Двоичное');
            });
            it('should add a UUID field', function () {
               var fieldName = 'New',
                  fieldIndex = 0,
                  field = FieldsFactory.create({
                     type: 'uuid',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), null);
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'UUID');
            });
            it('should add a RPC-File field', function () {
               var fieldName = 'New',
                  fieldIndex = 0,
                  field = FieldsFactory.create({
                     type: 'rpcfile',
                     name: fieldName
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), null);
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Файл-rpc');
            });
            it('should add a Hierarchy field', function () {
               var fieldName = 'New',
                  fieldIndex = 0,
                  field = FieldsFactory.create({
                     type: 'hierarchy',
                     name: fieldName,
                     kind: 'identity'
                  });
               adapter.addField(field, fieldIndex);
               assert.deepEqual(adapter.get(fieldName), [null]);
               assert.strictEqual(adapter.getData().s[fieldIndex].s, 'Иерархия');
               assert.strictEqual(adapter.getData().s[fieldIndex].t, 'Идентификатор');
            });
            it('should add an Array field', function () {
               var fieldName = 'New',
                  fieldIndex = 0,
                  field = FieldsFactory.create({
                     type: 'array',
                     name: fieldName,
                     kind: 'Boolean'
                  });
               adapter.addField(field, fieldIndex);
               assert.strictEqual(adapter.get(fieldName), null);
               assert.strictEqual(adapter.getData().s[fieldIndex].t.n, 'Массив');
               assert.strictEqual(adapter.getData().s[fieldIndex].t.t, 'Логическое');
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
