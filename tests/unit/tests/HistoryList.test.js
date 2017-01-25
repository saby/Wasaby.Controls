/**
 * Created by am.gerasimov on 26.12.2016.
 */
/**
 * Created by am.gerasimov on 18.10.2016.
 */
/**
 * Created by am.gerasimov on 12.10.2016.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.HistoryList'], function (HistoryList) {

   'use strict';
   describe('SBIS3.CONTROLS.HistoryList', function () {

      describe('.prepend', function (){
         var obj = { myData: 123 };

         describe('simple prepend', function() {
            var List = new HistoryList({historyId: 'mySuperTestPrepend'});
            List.prepend(obj);

            it('.should return { myData: 123 }', function() {
               assert.deepEqual(List.at(0).get('data').getRawData(), obj);
            });

            it('.should return 1', function() {
               assert.equal(List.getCount(), 1);
            });

            it('.should return undefined', function() {
               assert.equal(List.at(1), undefined);
            });

         });

         describe('equal object Prepend', function() {
            var List = new HistoryList({historyId: 'mySuperTestEqualPrepend'});
            List.prepend(obj);
            List.prepend(obj);

            it('.should return { myData: 123 }', function() {
               assert.deepEqual(List.at(0).get('data').getRawData(), obj);
            });

            it('.should return 1', function() {
               assert.equal(List.getCount(), 1);
            });

            it('.should return undefined', function() {
               assert.equal(List.at(1), undefined);
            });

         });

         describe('equal object move top', function() {
            var List = new HistoryList({historyId: 'mySuperTestPrependMove'});
            List.prepend(obj);
            List.prepend(obj);
            var newData = { myData: 234 };
            List.prepend(newData);
            List.prepend(obj);

            it('.should return { myData: 123 }', function() {
               assert.deepEqual(List.at(0).get('data').getRawData(), obj);
            });

            it('.should return 2', function() {
               assert.equal(List.getCount(), 2);
            });

            it('.should return { myData: 234 }', function() {
               assert.deepEqual(List.at(1).get('data').getRawData(), newData);
            });

         });
      });

      describe('.append', function (){
         var obj = { myData: 123 };

         describe('simple append', function() {
            var List = new HistoryList({historyId: 'mySuperTestAppend'});
            List.append(obj);

            it('.should return { myData: 123 }', function() {
               assert.deepEqual(List.at(0).get('data').getRawData(), obj);
            });

            it('.should return 1', function() {
               assert.equal(List.getCount(), 1);
            });

            it('.should return undefined', function() {
               assert.equal(List.at(1), undefined);
            });

         });

         describe('equal object append', function() {
            var List = new HistoryList({historyId: 'mySuperTestEqualAppend'});
            List.append(obj);
            List.append(obj);

            it('.should return { myData: 123 }', function() {
               assert.deepEqual(List.at(0).get('data').getRawData(), obj);
            });

            it('.should return 1', function() {
               assert.equal(List.getCount(), 1);
            });

            it('.should return undefined', function() {
               assert.equal(List.at(1), undefined);
            });

         });

         describe('equal object move top', function() {
            var List = new HistoryList({historyId: 'mySuperTestMoveAppend'});
            List.append(obj);
            List.append(obj);
            var newData = { myData: 234 };
            List.append(newData);
            List.append(obj);

            it('.should return { myData: 123 }', function() {
               assert.deepEqual(List.at(0).get('data').getRawData(), obj);
            });

            it('.should return 2', function() {
               assert.equal(List.getCount(), 2);
            });

            it('.should return { myData: 234 }', function() {
               assert.deepEqual(List.at(1).get('data').getRawData(), newData);
            });

         });
      });

      describe('.assign', function (){
         var List = new HistoryList({historyId: 'mySuperTestAssign'});
         var obj = [{ myData: 123 }, { myData: 234 }];

         List.append({test: 'test'});
         List.assign(obj);

         it('.should equal { myData: 123 }', function() {
            assert.deepEqual(List.at(0).get('data').getRawData(), { myData: 123 });
         });

         it('.should equal { myData: 234 }', function() {
            assert.deepEqual(List.at(1).get('data').getRawData(), { myData: 234 });
         });

         it('.should return 2', function() {
            assert.equal(List.getCount(), 2);
         });

      });

      describe('.clear', function (){
         var List = new HistoryList({historyId: 'mySuperTestClear'});
         var obj = [{ myData: 123 }, { myData: 234 }];
         List.assign(obj);

         it('.should return 2', function() {
            assert.equal(List.getCount(), 2);
            List.clear();
         });

         it('.should return 0', function() {
            assert.equal(List.getCount(), 0);
         });

      });

      describe('.remove', function (){
         var List = new HistoryList({historyId: 'mySuperTestRemove'});
         var obj = [{ myData: 123 }, { myData: 234 }];
         List.assign(obj);
         List.remove({ myData: 123 });

         it('.should return 1', function() {
            assert.equal(List.getCount(), 1);
         });

         it('.should return { myData: 234 }', function() {
            assert.deepEqual(List.at(0).get('data').getRawData(), { myData: 234 });
         });

      });

      describe('.removeAt', function (){
         var List = new HistoryList({historyId: 'mySuperTestRemoveAt'});
         var obj = [{ myData: 123 }, { myData: 234 }];
         List.assign(obj);
         List.removeAt(0);

         it('.should return 1', function() {
            assert.deepEqual(List.getCount(), 1);
         });

         it('.should return { myData: 234 }', function() {
            assert.deepEqual(List.at(0).get('data').getRawData(), { myData: 234 });
         });

      });

      describe('.at', function (){
         var List = new HistoryList({historyId: 'mySuperTestAt'});
         var obj = [{ myData: 123 }, { myData: 234 }];
         List.assign(obj);

         it('.should return { myData: 123 }', function() {
            assert.deepEqual(List.at(0).get('data').getRawData(), { myData: 123 });
         });

         it('.should return { myData: 234 }', function() {
            assert.deepEqual(List.at(1).get('data').getRawData(), { myData: 234 });
         });

      });

      describe('.getIndex', function (){
         var List = new HistoryList({historyId: 'mySuperTestGetIndex'});
         var obj = [{ myData: 123 }, { myData: 234 }];
         List.assign(obj);

         it('.should return 0', function() {
            assert.equal(List.getIndex({ myData: 123 }), 0);
         });

         it('.should return 1', function() {
            assert.equal(List.getIndex({ myData: 234 }), 1);
         });
      });

      describe('.getCount', function (){
         var List = new HistoryList({historyId: 'mySuperTestGetCount'});
         var obj = [{ myData: 123 }, { myData: 234 }];
         List.assign(obj);

         it('.should return 2', function() {
            assert.equal(List.getCount(), 2);
            List.append({});
         });

         it('.should return 3', function() {
            assert.equal(List.getCount(), 3);
         });

      });
   });
});