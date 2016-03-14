/* global define, beforeEach, afterEach, describe, it, assert */
define([
   'js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic'
], function (SbisBusinessLogic) {
   'use strict';

   var provider;
   describe('SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic', function () {
      beforeEach(function (){
         provider = new SbisBusinessLogic({
            endpoint: {
               address: '/users',
               contract: 'user'
            }
         });
      });

      afterEach(function () {
         provider = undefined;
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
            var provider = new SbisBusinessLogic({
               resource: 'user',
               service: '/users'
            });
            assert.equal(provider.getService(), '/users');
         });
      });

      describe('.getResource()', function () {
         it('should return resource', function (){
            var provider = new SbisBusinessLogic({
               resource: 'user'
            });
            assert.equal(provider.getResource(), 'user');
         });
      });
   });
});