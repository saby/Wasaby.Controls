/* global define, beforeEach, afterEach, describe, context, it, assert */
define([
   'js!SBIS3.CONTROLS.Data.Adapter.RecordSetTable',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
   'js!SBIS3.CONTROLS.Data.Record',
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory'
], function (RecordSetTableAdapter, SbisAdapter, RecordSet, Record, FieldsFactory) {
   'use strict';

   describe('SBIS3.CONTROLS.Data.Adapter.RecordSetTable', function () {
      var data,
         adapter;

      beforeEach(function () {
         data = new RecordSet({
            rawData: [{
               id: 1,
               name: 'Иванов'
            }, {
               id: 2,
               name: 'Петров'
            }, {
               id: 3,
               name: 'Сидоров'
            }]
         });

         adapter = new RecordSetTableAdapter(data);
      });

      afterEach(function () {
         data = undefined;
         adapter = undefined;
      });

      describe('.getEmpty()', function () {
         it('should return an empty recordset', function () {
            assert.instanceOf(adapter.getEmpty(), RecordSet);
            assert.strictEqual(
               0,
               adapter.getEmpty().getCount()
            );
         });
      });

      describe('.getFields()', function () {
         it('should return fields list', function () {
            var fields = [];
            data.getFormat().each(function(field) {
               fields.push(field.getName());
            });
            assert.deepEqual(
               adapter.getFields(),
               fields
            );
         });
      });

      describe('.getCount()', function () {
         it('should return records count', function () {
            assert.deepEqual(
               adapter.getCount(),
               data.getCount()
            );
         });
      });

      describe('.add()', function () {
         it('should append a record', function () {
            var count = data.getCount(),
               rec = new Record();
            adapter.add(rec);
            assert.strictEqual(
               data.at(count),
               rec
            );
         });

         it('should prepend a record', function () {
            var rec = new Record();
            adapter.add(rec, 0);
            assert.strictEqual(
               data.at(0),
               rec
            );
         });

         it('should insert a record', function () {
            var rec = new Record();
            adapter.add(rec, 1);
            assert.strictEqual(
               data.at(1),
               rec
            );
         });

         it('should throw an error on invalid position', function () {
            assert.throw(function () {
               var rec = new Record();
               adapter.add(rec, 100);
            });
            assert.throw(function () {
               var rec = new Record();
               adapter.add(rec, -1);
            });
         });
      });

      describe('.at()', function () {
         it('should return valid record', function () {
            assert.strictEqual(
               data.at(0),
               adapter.at(0)
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
      });

      describe('.remove()', function () {
         it('should remove the record', function () {
            var rec = adapter.at(0);
            adapter.remove(0);
            assert.notEqual(
               rec,
               adapter.at(0)
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

      describe('.replace()', function () {
         it('should replace the record', function () {
            var rec = new Record();
            adapter.replace(rec, 0);
            assert.strictEqual(
               data.at(0),
               rec
            );
         });

         it('should throw an error on invalid position', function () {
            var rec = new Record();
            assert.throw(function () {
               adapter.replace(rec, -1);
            });
            assert.throw(function () {
               adapter.replace(rec, 99);
            });
         });
      });

      describe('.move()', function () {
         it('should move Иванов instead Петров', function () {
            adapter.move(0, 2);
            assert.strictEqual(
               'Петров',
               adapter.at(0).get('name')
            );
            assert.strictEqual(
               'Сидоров',
               adapter.at(1).get('name')
            );
            assert.strictEqual(
               'Иванов',
               adapter.at(2).get('name')
            );
         });
         it('should move Сидоров instead Иванов', function () {
            adapter.move(2, 0);
            assert.strictEqual(
               'Сидоров',
               adapter.at(0).get('name')
            );
            assert.strictEqual(
               'Иванов',
               adapter.at(1).get('name')
            );
            assert.strictEqual(
               'Петров',
               adapter.at(2).get('name')
            );
         });
         it('should move Петров to the end', function () {
            adapter.move(1, 2);
            assert.strictEqual(
               'Петров',
               adapter.at(2).get('name')
            );
            assert.strictEqual(
               'Сидоров',
               adapter.at(1).get('name')
            );
         });
         it('should not move Петров', function () {
            adapter.move(1, 1);
            assert.strictEqual(
               'Петров',
               adapter.at(1).get('name')
            );
         });
      });

      describe('.getData()', function () {
         it('should return raw data', function () {
            assert.strictEqual(adapter.getData(), data);
         });
      });

      describe('.getFormat()', function () {
         it('should return exists field format', function () {
            var format = adapter.getFormat('id');
            assert.strictEqual(format.getName(), 'id');
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
               field = FieldsFactory.create({
                  type: 'string',
                  name: fieldName
               });
            adapter.addField(field, 0);
            assert.strictEqual(adapter.getFormat(fieldName).getName(), fieldName);
            assert.strictEqual(data.getFormat().at(0).getName(), fieldName);
         });
         it('should use a field default value', function () {
            var fieldName = 'New',
               def = 'abc';
            adapter.addField(FieldsFactory.create({
               type: 'string',
               name: fieldName,
               defaultValue: def
            }));
            for (var i = 0; i < adapter.getCount(); i++) {
               assert.strictEqual(adapter.at(i).get(fieldName), def);
               assert.strictEqual(data.at(i).get(fieldName), def);
            }
         });
         it('should throw an error for already exists field', function () {
            assert.throw(function () {
               adapter.addField(FieldsFactory.create({
                  type: 'string',
                  name: 'id'
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
            var name = 'id';
            adapter.removeField(name);
            for (var i = 0; i < adapter.getCount(); i++) {
               assert.isUndefined(adapter.at(i).get(name));
               assert.isUndefined(data.at(i).get(name));
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
         var getRawData = function() {
            return {
               d: [
                  [1, 'Иванов'],
                  [2, 'Петров'],
                  [3, 'Сидоров']
               ],
               s: [
                  {'n': 'id', 't': 'Число целое'},
                  {'n': 'name', 't': 'Строка'}
               ]
            };
         };

         it('should remove exists field', function () {
            var data = new RecordSet({
                  rawData: getRawData(),
                  adapter: 'adapter.sbis'
               }),
               adapter = new RecordSetTableAdapter(data),
               oldF = adapter.getFields();

            adapter.removeFieldAt(0);
            var newF = adapter.getFields();
            assert.notEqual(oldF[0], newF[0]);
            assert.strictEqual(oldF[1], newF[0]);
            assert.throw(function () {
               adapter.getFormat(oldF.getName());
            });
         });
         it('should throw an error', function () {
            var data = new RecordSet({
                  rawData: getRawData(),
                  adapter: 'adapter.sbis'
               }),
               adapter = new RecordSetTableAdapter(data);

            assert.throw(function () {
               adapter.removeFieldAt(-1);
            });
            assert.throw(function () {
               adapter.removeFieldAt(10);
            });
         });
      });
   });
});
