/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.MoveStrategy.Base',
      'js!SBIS3.CONTROLS.Data.Collection.RecordSet'
   ],
   function (BaseMoveStrategy, RecordSet) {
      'use strict';
      var ds, rs, id1 = 1, id2 = 2, moveStrategy;
      describe('SBIS3.CONTROLS.Data.MoveStrategy.Base', function() {

         beforeEach(function() {
            ds = {
               call : function (command, params) {
                  assert.equal(command, 'move');
                  this.move.call(this, params);
                  return new $ws.proto.Deferred().callback(true);
               },
               update: assert.fail,
               move: assert.fail
            };
            rs = new RecordSet({
               rawData:[{
                  'id': id1,
                  'name': 'Иванов',
                  'parent': null
               }, {
                  'id': id2,
                  'name': 'Петров',
                  'parent': null
               }],
               idProperty: 'id'
            });
            moveStrategy = new BaseMoveStrategy({
               hierField: 'parent',
               dataSource: ds
            });
         });

         describe('.move()', function() {
            it('should move record to up', function () {
               ds.move = function(params) {
                  assert.deepEqual(params.from, rs.at(0));
                  assert.deepEqual(params.to, rs.at(1));
                  assert.isFalse(params.details.after);
               };
               moveStrategy.move([rs.at(0)], rs.at(1), false);
            });

            it('should move record to down', function () {
               ds.move = function(params) {
                  assert.deepEqual(params.from, rs.at(0));
                  assert.deepEqual(params.to, rs.at(1));
                  assert.isTrue(params.details.after);
               };
               moveStrategy.move([rs.at(0)], rs.at(1), true);
            });
         });

         describe('.hierarhyMove()', function() {
            it('should move record to folder', function (done) {
               ds.update = function () {
                  return new $ws.proto.Deferred().callback(true);
               };
               moveStrategy.hierarhyMove([rs.at(0)], rs.at(1), false).addCallback(function(){
                  assert.equal(rs.at(0).get('parent'), rs.at(1).getId());
                  done();
               });
            });

            it('should throw an error hierarhy field is undefined', function () {
               var moveStrategy = new BaseMoveStrategy({
                  dataSource: ds
               });
               assert.throw(function () {
                  moveStrategy.hierarhyMove([rs.at(0)], rs.at(1), false);
               });
            });

            it('should throw an error data source is undefined', function () {
               var moveStrategy = new BaseMoveStrategy({
                  hierField: 'parent'
               });
               assert.throw(function () {
                  moveStrategy.hierarhyMove([rs.at(0)], rs.at(1), false);
               });
            });
         });
      });
   }
);
