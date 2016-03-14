/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic'
], function (SbisBusinessLogic) {
   'use strict';

   var provider;
   describe('SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic', function () {
      beforeEach(function (){
         provider = new SbisBusinessLogic({
            resource: 'user',
            service: '/users'
         });
      });

      describe('.getEndpoint()', function () {
         it('should return endpoint', function (){
            assert.deepEqual(provider.getEndpoint(), {
               address: '/users',
               contract: 'user'
            });
         });
      });

      describe('.getService()', function () {
         it('should return service', function (){
            assert.equal(provider.getService(), '/users');
         });
      });

      describe('.getResource()', function () {
         it('should return resource', function (){
            assert.equal(provider.getResource(), 'user');
         });
      });
   });
});