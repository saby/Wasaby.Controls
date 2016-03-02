/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Query.Join'
], function (QueryJoin) {
   'use strict';
   describe('SBIS3.CONTROLS.Data.Query.Join', function () {
      var select = {'select':''},
         on = {'on':''},
         as = 'prod',
         resource = 'product',
         inner = true,
         join = new QueryJoin({
         resource: resource,
         as: as,
         on: on,
         select: select,
         inner: inner
      });
      describe('.getResource', function (){
         it('should return resource', function (){
            assert.equal(join.getResource(), resource);
         });
      });
      describe('.getAs', function (){
         it('should return as', function (){
            assert.equal(join.getAs(), as);
         });
      });
      describe('.getOn', function (){
         it('should return on', function (){
            assert.equal(join.getOn(), on);
         });
      });
      describe('.getSelect', function (){
         it('should return select', function (){
            assert.equal(join.getSelect(), select);
         });
      });
      describe('.isInner', function (){
         it('should return inner', function (){
            assert.equal(join.isInner(), inner);
         });
      });
   });
});