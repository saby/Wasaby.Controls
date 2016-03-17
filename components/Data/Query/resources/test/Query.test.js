/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Query.Query'
], function (Query) {
   'use strict';

   describe('SBIS3.CONTROLS.Data.Query.Query', function () {
      var query;

      beforeEach(function () {
         query = new Query();
      });

      afterEach(function () {
         query = undefined;
      });

      describe('.select', function (){
         it('should set select from array', function () {
            var fields = ['id', 'name'];
            query.select(fields);
            assert.deepEqual(query.getSelect(), {'id':'id', 'name': 'name'});
         });

         it('should set select from string', function () {
            var fields = ['id', 'name'];
            query.select(fields.join(','));
            assert.deepEqual(query.getSelect(), { id: 'id', name: 'name' });
         });

         it('should throw an error fields is a invalid', function () {
            var fields = 12;
            assert.throw(function(){
               query.select(fields);
            });
         });
      });

      describe('.clear', function (){
         it('should clear query', function () {
            query.clear();
            assert.deepEqual(query.getSelect(), {});
         });
      });

      describe('.clone', function (){
         it('should clone query', function (){
            assert.deepEqual(query, query.clone());
         });
      });

      describe('.getAs', function (){
         it('should return as', function (){
            query.from('product', 'item');
            assert.equal(query.getAs(), 'item');
         });
      });

      describe('.orderBy', function (){
         it('should set order by', function (){
            query.orderBy({
               customerId: true,
               date: false
            });
            assert.equal(query.getOrderBy().length, 2);
         });
      });

      describe('.groupBy', function (){
         it('should set group by from array', function (){
            var groupBy = ['date', 'customerId'];
            query.groupBy(groupBy);
            assert.equal(query.getGroupBy(), groupBy);
         });

         it('should set group by from string', function (){
            var groupBy = 'customerId';
            query.groupBy(groupBy);
            assert.deepEqual(query.getGroupBy(), [groupBy]);
         });

         it('should set group by from string', function (){
            var groupBy = {'customerId':true};
            assert.throw(function(){
               query.groupBy(groupBy);
            });
         });
      });

      describe('.where', function (){
         it('should set where', function (){
            var where  = {
                'id>': 10,
                'date<=': new Date()
            };
            query.where(where);
            assert.equal(query.getWhere(), where);
         });

         it('should throw an error', function (){
            var where = 'where';
            assert.throw(function(){
               query.where(where);
            });
         });
      });

      describe('.join', function (){
         it('should set join', function (){
            query.join(
               'Customers',
               {id: 'customerId'},
               {
                  customerName: 'name',
                  customerEmail: 'email'
               }
            );
            assert.equal(query.getJoin().length, 1);
         });
      });
   });
});