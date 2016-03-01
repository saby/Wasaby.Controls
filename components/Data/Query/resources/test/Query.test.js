/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Query.Query'
], function (Query) {
   'use strict';
   var query, select;
   beforeEach(function (){
      select = ['id'];
      query = new Query({
         select: select,
         as: 'prod',
         resource: 'product'
      });
   });
   describe('SBIS3.CONTROLS.Data.Query.Query', function () {
      describe('.getSelect()', function () {
         it('should return select', function (){
            assert.deepEqual(query.getSelect(), select);
         });
      });

      describe('.select', function (){
         it('should set select from array', function () {
            var fields = ['id', 'name'];
            query.select(fields);
            assert.deepEqual(query.getSelect(), fields);
         });

         it('should set select from string', function () {
            var fields = ['id', 'name'];
            query.select(fields.join(','));
            assert.deepEqual(query.getSelect(), fields);
         });

         it('should throw an error fields is a invalid', function () {
            var fields = {1:'id', 2:'name'};
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

      describe('.as', function (){
         it('should return as', function (){
            assert.equal(query.getAs(), 'prod');
         });
      });

      describe('.orderBy', function (){
         it('should set order by', function (){
            query.orderBy({
               customerId: true,
               date: false
            });
            assert.equal(query.getOrder().length, 2);
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