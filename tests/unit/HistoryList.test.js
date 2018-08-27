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
define(['SBIS3.CONTROLS/History/HistoryList'], function(HistoryList) {

   'use strict';
   describe('SBIS3.CONTROLS/History/HistoryList', function() {

      var preloadHistory = function(historyList, callback) {
         historyList.getHistory(true).addCallback(function(history) {
            callback();
            return history;
         });
      };

      describe('.prepend', function() {
         var obj = { myData: 123 };

         describe('simple prepend', function() {
            var List;
            before(function(done) {
               if (typeof $ === 'undefined') {
                  this.skip();
               } else {
                  List = new HistoryList({historyId: 'mySuperTestPrepend'});
                  preloadHistory(List, function() {
                     List.prepend(obj);
                     done();
                  });
               }
            });

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
            var List;
            before(function(done) {
               if (typeof $ === 'undefined') {
                  this.skip();
               } else {
                  List = new HistoryList({historyId: 'mySuperTestEqualPrepend'});
                  preloadHistory(List, function() {
                     List.prepend(obj);
                     List.prepend(obj);
                     done();
                  });
               }
            });

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
            var List;
            var newData;

            before(function(done) {
               if (typeof $ === 'undefined') {
                  this.skip();
               } else {
                  List = new HistoryList({historyId: 'mySuperTestPrependMove'});
                  preloadHistory(List, function() {
                     List.prepend(obj);
                     List.prepend(obj);
                     newData = {myData: 234};
                     List.prepend(newData);
                     List.prepend(obj);
                     done();
                  });
               }
            });

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

      describe('.append', function() {
         var obj = { myData: 123 };

         describe('simple append', function() {
            var List;

            before(function(done) {
               if (typeof $ === 'undefined') {
                  this.skip();
               } else {
                  List = new HistoryList({historyId: 'mySuperTestAppend'});
                  preloadHistory(List, function() {
                     List.append(obj);
                     done();
                  });
               }
            });

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
            var List;

            before(function(done) {
               if (typeof $ === 'undefined') {
                  this.skip();
               } else {
                  List = new HistoryList({historyId: 'mySuperTestEqualAppend'});
                  preloadHistory(List, function() {
                     List.append(obj);
                     List.append(obj);
                     done();
                  });
               }
            });

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
            var List, newData;

            before(function(done) {
               if (typeof $ === 'undefined') {
                  this.skip();
               } else {
                  List = new HistoryList({historyId: 'mySuperTestMoveAppend'});
                  preloadHistory(List, function() {
                     List.append(obj);
                     List.append(obj);
                     newData = {myData: 234};
                     List.append(newData);
                     List.append(obj);
                     done();
                  });
               }
            });

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

      describe('.assign', function() {
         var List;
         var obj;

         before(function(done) {
            if (typeof $ === 'undefined') {
               this.skip();
            } else {
               List = new HistoryList({historyId: 'mySuperTestAssign'});
               preloadHistory(List, function() {
                  obj = [{myData: 123}, {myData: 234}];
                  List.append({test: 'test'});
                  List.assign(obj);
                  done();
               });
            }
         });

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

      describe('.clear', function() {
         var List;
         var obj;

         before(function(done) {
            if (typeof $ === 'undefined') {
               this.skip();
            } else {
               List = new HistoryList({historyId: 'mySuperTestClear'});
               preloadHistory(List, function() {
                  obj = [{myData: 123}, {myData: 234}];
                  List.assign(obj);
                  done();
               });
            }
         });

         it('.should return 2', function() {
            assert.equal(List.getCount(), 2);
            List.clear();
         });

         it('.should return 0', function() {
            assert.equal(List.getCount(), 0);
         });

      });

      describe('.remove', function() {
         var List;
         var obj;

         before(function(done) {
            if (typeof $ === 'undefined') {
               this.skip();
            } else {
               List = new HistoryList({historyId: 'mySuperTestRemove'});
               preloadHistory(List, function() {
                  obj = [{myData: 123}, {myData: 234}];
                  List.assign(obj);
                  List.remove({myData: 123});
                  done();
               });
            }
         });

         it('.should return 1', function() {
            assert.equal(List.getCount(), 1);
         });

         it('.should return { myData: 234 }', function() {
            assert.deepEqual(List.at(0).get('data').getRawData(), { myData: 234 });
         });

      });

      describe('.removeAt', function() {
         var List;
         var obj;

         before(function(done) {
            if (typeof $ === 'undefined') {
               this.skip();
            } else {
               List = new HistoryList({historyId: 'mySuperTestRemoveAt'});
               preloadHistory(List, function() {
                  obj = [{myData: 123}, {myData: 234}];
                  List.assign(obj);
                  List.removeAt(0);
                  done();
               });
            }
         });

         it('.should return 1', function() {
            assert.deepEqual(List.getCount(), 1);
         });

         it('.should return { myData: 234 }', function() {
            assert.deepEqual(List.at(0).get('data').getRawData(), { myData: 234 });
         });

      });

      describe('.at', function() {
         var List;
         var obj;

         before(function(done) {
            if (typeof $ === 'undefined') {
               this.skip();
            } else {
               List = new HistoryList({historyId: 'mySuperTestAt'});
               preloadHistory(List, function() {
                  obj = [{myData: 123}, {myData: 234}];
                  List.assign(obj);
                  done();
               });
            }
         });

         it('.should return { myData: 123 }', function() {
            assert.deepEqual(List.at(0).get('data').getRawData(), { myData: 123 });
         });

         it('.should return { myData: 234 }', function() {
            assert.deepEqual(List.at(1).get('data').getRawData(), { myData: 234 });
         });

      });

      describe('.getIndex', function() {
         var List;
         var obj;

         before(function(done) {
            if (typeof $ === 'undefined') {
               this.skip();
            } else {
               List = new HistoryList({historyId: 'mySuperTestGetIndex'});
               preloadHistory(List, function() {
                  obj = [{myData: 123}, {myData: 234}];
                  List.assign(obj);
                  done();
               });
            }
         });

         it('.should return 0', function() {
            assert.equal(List.getIndex({ myData: 123 }), 0);
         });

         it('.should return 1', function() {
            assert.equal(List.getIndex({ myData: 234 }), 1);
         });
      });

      describe('.getCount', function() {
         var List;
         var obj;

         before(function(done) {
            if (typeof $ === 'undefined') {
               this.skip();
            } else {
               List = new HistoryList({historyId: 'mySuperTestGetCount'});
               preloadHistory(List, function() {
                  obj = [{myData: 123}, {myData: 234}];
                  List.assign(obj);
                  done();
               });
            }
         });

         it('.should return 2, then 3', function() {
            assert.equal(List.getCount(), 2);
            List.append({});
            assert.equal(List.getCount(), 3);
         });
      });
   });
});
