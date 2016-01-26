/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
      'js!SBIS3.CONTROLS.Data.Collection.List',
      'js!SBIS3.CONTROLS.Data.Bind.ICollection',
      'js!SBIS3.CONTROLS.Data.Model',
      'js!SBIS3.CONTROLS.Data.Adapter.Json'
   ], function (RecordSet, List, IBindCollection, Model, JsonAdapter) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Collection.RecordSet', function() {
         var items, sbisList;

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
            }];
         });

         afterEach(function() {
            items = undefined;
         });

         describe('.append()', function() {
            it('should change raw data', function() {
               var rd = [{ 'Ид': 50, 'Фамилия': '50'},{ 'Ид': 51, 'Фамилия': '51'}],
                  list = new RecordSet({
                     rawData: items.slice()
                  });
               list.append(new RecordSet({
                  rawData: rd
               }));
               Array.prototype.push.apply(items,rd);
               assert.deepEqual(list.getRawData(), items);
               assert.deepEqual(list.getCount(), items.length);
               $ws.helpers.forEach(items, function (item, i) {
                  assert.deepEqual(list.at(i).getRawData(), item);
               });
            });

         });

         describe('.prepend', function (){
            it('should change raw data', function() {
               var rd = [{ 'Ид': 50, 'Фамилия': '50'},{ 'Ид': 51, 'Фамилия': '51'}],
                  list = new RecordSet({
                     rawData: items.slice()
                  });
               list.prepend(new RecordSet({
                  rawData: rd
               }));
               Array.prototype.splice.apply(items,([0, 0].concat(rd)));
               assert.deepEqual(list.getRawData(), items);
               assert.deepEqual(list.getCount(), items.length);
               $ws.helpers.forEach(items, function (item, i) {
                  assert.deepEqual(list.at(i).getRawData(), item);
               });
            });
         });

         describe('.assign()', function() {
            it('should change raw data', function() {
               var items = [{id:1},{id:2}],
                  list = new RecordSet({
                     rawData: items.slice()
                  });
               var addItem = new Model({
                  rawData: {id: 3}
               });
               list.add(addItem);
               items.push({id: 3});
               assert.deepEqual(list.getRawData(), items);
               assert.deepEqual(list.getCount(), items.length);
               $ws.helpers.forEach(items, function (item, i) {
                  assert.deepEqual(list.at(i).getRawData(), item);
               });
            });
         });

         describe('.clear()', function() {
            it('should change raw data', function() {
               var items = [{id:1},{id:2}],
                  list = new RecordSet({
                     rawData: items.slice()
                  });
               list.clear();
               assert.deepEqual(list.getRawData(), []);
            });
         });

         describe('.add()', function() {
            it('should change raw data', function() {
               var list = new RecordSet({
                     rawData: items.slice()
                  });
               var rd =  { 'Ид': 502, 'Фамилия': '502'},
                  addItem = new Model({
                  rawData: rd
               });
               list.add(addItem);
               items.push(rd);
               assert.deepEqual(list.getRawData(), items);
            });
         });

         describe('.removeAt()', function() {
            it('should change raw data', function() {
               var list = new RecordSet({
                     rawData: items.slice()
                  });
               list.removeAt(0);
               assert.deepEqual(list.getRawData(),items.slice(1))
            });

         });

         describe('.replace()', function() {
            it('should change raw data', function() {
               var rd = { 'Ид': 50, 'Фамилия': '50'},
                  list = new RecordSet({
                     rawData: items.slice()
                  }),
                  newItem = new Model({rawData:rd});
               list.replace(newItem, 0);
               items[0] = rd;
               assert.deepEqual(list.getRawData(), items);
            });
         });

         describe('.getIndex()', function (){
            it('should return an index of given item', function() {
               var list = new RecordSet({
                     rawData: items.slice()
                  });

               for (var i = 0; i < items.length; i++){
                  assert.equal(i, list.getIndex(list.at(i)));
               }

            });
         });

      });
   }
);
