/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Query.Query'
], function (Query) {
   'use strict';
   var query, select;
   beforeEach(function (){
      select = ['id'];
      query = new Query({
         select: select
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

      describe('.select', function (){

      });
   });
});