/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic'
], function (SbisBusinessLogic) {
   'use strict';
   var dataSource;
   beforeEach(function (){
      dataSource = new SbisBusinessLogic({
         resource: 'user',
         service: '/users'
      });
   });
   describe('SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic', function () {
      describe('.getService()', function () {
         it('should return service', function (){
            assert.equal(dataSource.getService(), '/users');
         });
      });

      describe('.getResource()', function () {
         it('should return resource', function (){
            assert.equal(dataSource.getResource(), 'user');
         });
      });
   });
});