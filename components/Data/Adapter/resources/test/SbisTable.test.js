/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Adapter.SbisTable',
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory'
   ], function (SbisTable, FieldsFactory) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Adapter.SbisTable', function () {
         var data,
            adapter;

         beforeEach(function () {
            data = {
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
            };

            adapter = new SbisTable(data);
         });

         afterEach(function () {
            data = undefined;
            adapter = undefined;
         });

         describe('.getEmpty()', function () {
            it('should return empty data', function () {
               assert.strictEqual(
                  0,
                  new SbisTable().getEmpty().d.length
               );
            });
         });

         describe('.getFields()', function () {
            it('should return fields list', function () {
               assert.deepEqual(
                  adapter.getFields(),
                  ['Ид', 'Фамилия']
               );
            });
         });

         describe('.getCount()', function () {
            it('should return records count', function () {
               assert.strictEqual(
                  7,
                  adapter.getCount()
               );
               assert.strictEqual(
                  0,
                  new SbisTable([]).getCount()
               );
               assert.strictEqual(
                  0,
                  new SbisTable({}).getCount()
               );
               assert.strictEqual(
                  0,
                  new SbisTable('').getCount()
               );
               assert.strictEqual(
                  0,
                  new SbisTable(0).getCount()
               );
               assert.strictEqual(
                  0,
                  new SbisTable().getCount()
               );
            });
         });

         describe('.add()', function () {
            it('should append a record', function () {
               adapter.add({d: [30, 'Огурцов']});
               assert.strictEqual(
                  8,
                  data.d.length
               );
               assert.strictEqual(
                  30,
                  data.d[data.d.length - 1][0]
               );
               assert.strictEqual(
                  'Огурцов',
                  data.d[data.d.length - 1][1]
               );
            });

            it('should prepend a record', function () {
               adapter.add({d: [40, 'Перцов']}, 0);
               assert.strictEqual(
                  8,
                  data.d.length
               );
               assert.strictEqual(
                  40,
                  data.d[0][0]
               );
               assert.strictEqual(
                  'Перцов',
                  data.d[0][1]
               );
            });

            it('should insert a record', function () {
               adapter.add({d: [50, 'Горохов']}, 2);
               assert.strictEqual(
                  8,
                  data.d.length
               );
               assert.strictEqual(
                  50,
                  data.d[2][0]
               );
               assert.strictEqual(
                  'Горохов',
                  data.d[2][1]
               );
            });
            
            it('should insert the first record', function () {
               var data = {
                     d: [],
                     s: [{'n': 'id', 't': 'Число целое'}]
                  },
                  adapter = new SbisTable(data);
               adapter.add({d: [5]}, 0);
               assert.strictEqual(
                  1,
                  data.d.length
               );
               assert.strictEqual(
                  5,
                  data.d[0][0]
               );
            });
            
            it('should insert the last record', function () {
               var data = {
                     d: [[1], [2]],
                     s: [{'n': 'id', 't': 'Число целое'}]
                  },
                  adapter = new SbisTable(data);
               adapter.add({d: [33]}, 2);
               assert.strictEqual(
                  3,
                  data.d.length
               );
               assert.strictEqual(
                  33,
                  data.d[2][0]
               );
            });
            
            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapter.add({d: [30, 'aaa']}, 100);
               });
               assert.throw(function () {
                  adapter.add({d: [30, 'aaa']}, -1);
               });
            });

            it('should inherit format from a new record', function () {
               var adapter = new SbisTable({d: [], s: []}),
                  s = [{'n': 'Ид', 't': 'Число целое'}];
               adapter.add({d: [1], s: s});
               assert.deepEqual(adapter.getData().s, s);
            });
         });

         describe('.at()', function () {
            it('should return valid record', function () {
               assert.strictEqual(
                  1,
                  adapter.at(0).d[0]
               );
               assert.strictEqual(
                  3,
                  adapter.at(2).d[0]
               );
            });

            it('should return undefined on invalid position', function () {
               assert.isUndefined(
                  adapter.at(-1)
               );
               assert.isUndefined(
                  adapter.at(99)
               );
            });

            it('should return undefined on invalid data', function () {
               assert.isUndefined(
                  new SbisTable({}).at()
               );
               assert.isUndefined(
                  new SbisTable('').at()
               );
               assert.isUndefined(
                  new SbisTable(0).at()
               );
               assert.isUndefined(
                  new SbisTable().at()
               );
            });
         });

         describe('.remove()', function () {
            it('should remove the record', function () {
               adapter.remove(0);
               assert.strictEqual(
                  2,
                  data.d[0][0]
               );

               adapter.remove(2);
               assert.strictEqual(
                  5,
                  data.d[2][0]
               );

               adapter.remove(4);
               assert.isUndefined(
                  data.d[4]
               );
            });

            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapter.remove(-1);
               });
               assert.throw(function () {
                  adapter.remove(99);
               });
            });
         });

         describe('.merge()', function () {
            it('should merge two records', function () {
               adapter.merge(0, 1, 'Ид');
               assert.strictEqual(
                  'Петров',
                  data.d[0][1]
               );
            });
         });

         describe('.copy()', function () {
            it('should merge two records', function () {
               adapter.copy(0);
               assert.strictEqual(
                  'Иванов',
                  data.d[1][1]
               );
            });
         });

         describe('.replace()', function () {
            it('should replace the record', function () {
               adapter.replace({d: [11]}, 0);
               assert.strictEqual(
                  11,
                  data.d[0][0]
               );

               adapter.replace({d: [12]}, 4);
               assert.strictEqual(
                  12,
                  data.d[4][0]
               );

            });

            it('should throw an error on invalid position', function () {
               assert.throw(function () {
                  adapter.replace({d: [13]}, -1);
               });
               assert.throw(function () {
                  adapter.replace({d: [14]}, 99);
               });
            });

            it('should replace s in raw data', function () {
               var s = [{'n': 'Ид', 't': 'Число целое'}],
                  adapter = new SbisTable({d: [1], s: []});
               adapter.replace({d: [11], s: s}, 0);
               assert.strictEqual(adapter.getData().s,  s);
            });
         });

         describe('.move()', function () {
            it('should move Иванов instead Сидоров', function () {
               adapter.move(0, 2);
               assert.strictEqual(
                  'Петров',
                  data.d[0][1]
               );
               assert.strictEqual(
                  'Сидоров',
                  data.d[1][1]
               );
               assert.strictEqual(
                  'Иванов',
                  data.d[2][1]
               );
            });
            it('should move Сидоров instead Иванов', function () {
               adapter.move(2, 0);
               assert.strictEqual(
                  'Сидоров',
                  data.d[0][1]
               );
               assert.strictEqual(
                  'Иванов',
                  data.d[1][1]
               );
               assert.strictEqual(
                  'Петров',
                  data.d[2][1]
               );
            });
            it('should move Петров to the end', function () {
               adapter.move(1, 6);
               assert.strictEqual(
                  'Петров',
                  data.d[6][1]
               );
               assert.strictEqual(
                  'Арбузнов',
                  data.d[5][1]
               );
            });
            it('should not move Петров', function () {
               adapter.move(1, 1);
               assert.strictEqual(
                  'Петров',
                  data.d[1][1]
               );
               assert.strictEqual(
                  'Годолцов',
                  data.d[5][1]
               );
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
            it('should return string field format', function () {
               var format = adapter.getFormat('Фамилия');
               assert.isTrue($ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.StringField'));
               assert.strictEqual(format.getName(), 'Фамилия');
            });
            it('should throw an error for not exists field', function () {
               assert.throw(function () {
                  adapter.getFormat('Some');
               });
            });
         });

         describe('.addField()', function () {
            it('should add a new field', function () {
               var fieldName = 'New',
                  fieldPos = 1,
                  field = FieldsFactory.create({
                     type: 'string',
                     name: fieldName
                  });
               adapter.addField(field, fieldPos);
               assert.strictEqual(adapter.getFormat(fieldName).getName(), fieldName);
               for (var i = 0; i < adapter.getCount(); i++) {
                  assert.strictEqual(adapter.at(i).s[fieldPos].n, fieldName);
               }
            });
            it('should use a field default value', function () {
               var fieldName = 'New',
                  fieldPos = 1,
                  def = 'abc';
               adapter.addField(FieldsFactory.create({
                  type: 'string',
                  name: fieldName,
                  defaultValue: def
               }), fieldPos);
               for (var i = 0; i < adapter.getCount(); i++) {
                  assert.strictEqual(adapter.at(i).d[fieldPos], def);
               }
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
                  newFields = adapter.getData().s.slice(),
                  newData = adapter.getData().d.slice().map(function(item) {
                     item.slice().splice(index, 1);
                     return item;
                  });

               adapter.removeField(name);
               newFields.splice(index, 1);

               assert.deepEqual(adapter.getData().s, newFields);
               assert.deepEqual(adapter.getData().d, newData);
               for (var i = 0; i < adapter.getCount(); i++) {
                  assert.deepEqual(adapter.at(i).s, newFields);
               }
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
                  newFields = adapter.getData().s.slice().splice(index - 1, 1),
                  newData = adapter.getData().d.slice().map(function(item) {
                     item.slice().splice(index, 1);
                     return item;
                  });
               adapter.removeFieldAt(index);
               assert.deepEqual(adapter.getData().s, newFields);
               assert.deepEqual(adapter.getData().d, newData);
               for (var i = 0; i < adapter.getCount(); i++) {
                  assert.deepEqual(adapter.at(i).s, newFields);
               }
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
