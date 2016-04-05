/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Source.Provider.IAbstract',
   'js!SBIS3.CONTROLS.Data.Source.Remote'
], function (IAbstractProvider, RemoteSource) {
   'use strict';

   describe('SBIS3.CONTROLS.Data.Source.Remote', function () {
      var dataSource,
         ProviderMock = $ws.core.extend({}, [IAbstractProvider], {
            call: function (name, args) {
               this._lastName = name;
               this._lastArgs = args;
               return $ws.proto.Deferred.success(true);
            }
         }),
         provider = new ProviderMock();

      beforeEach(function () {
         dataSource = new RemoteSource({
            endpoint: '/users/',
            provider: provider,
            binding: {
               query: 'getUsers',
               create: 'createUser',
               read: 'readUser',
               update: 'updateUser',
               destroy: 'deleteUser',
               copy: 'copyUser',
               merge: 'mergeUsers'
            }
         });
      });

      afterEach(function () {
         dataSource = undefined;
      });

      describe('.getProvider()', function () {
         it('should return Provider', function (){
            assert.instanceOf(dataSource.getProvider(), ProviderMock);
         });
      });

      describe('.subscribe()', function () {
         context('onBeforeProviderCall', function (){
            it('should receive service name', function (done) {
               var handler = function(e, name) {
                     try {
                        assert.strictEqual(name, serviceName);
                        done();
                     } catch (e) {
                        done(e);
                     }
                  },
                  serviceName = 'Test';
               dataSource.subscribe('onBeforeProviderCall', handler);
               dataSource.call(serviceName);
               dataSource.unsubscribe('onBeforeProviderCall', handler);
            });
            it('should receive service name and arguments', function (done) {
               var handler = function(e, name, args) {
                     try {
                        assert.strictEqual(name, serviceName);
                        assert.deepEqual(args, serviceArgs);
                        done();
                     } catch (e) {
                        done(e);
                     }
                  },
                  serviceName = 'Test',
                  serviceArgs = [{}, [], 'a', 1, 0, false, true, null];
               dataSource.subscribe('onBeforeProviderCall', handler);
               dataSource.call(serviceName, serviceArgs);
               dataSource.unsubscribe('onBeforeProviderCall', handler);
            });
            it('should change service arguments as an object', function () {
               var handler = function(e, name, args) {
                     args.a = 9;
                     delete args.b;
                     args.c = 3;
                  },
                  serviceArgs = {a: 1, b: 2},
                  expectArgs = {a: 9, c: 3};
               dataSource.subscribe('onBeforeProviderCall', handler);
               dataSource.call('Test', serviceArgs);
               dataSource.unsubscribe('onBeforeProviderCall', handler);
               assert.deepEqual(provider._lastArgs, expectArgs);
               assert.deepEqual(serviceArgs, expectArgs);
            });
            it('should change service arguments as an array', function () {
               var handler = function(e, name, args) {
                     args.push('new');
                  },
                  serviceArgs = [1, 2],
                  expectArgs = [1, 2, 'new'];
               dataSource.subscribe('onBeforeProviderCall', handler);
               dataSource.call('Test', serviceArgs);
               dataSource.unsubscribe('onBeforeProviderCall', handler);
               assert.deepEqual(provider._lastArgs, expectArgs);
               assert.deepEqual(serviceArgs, expectArgs);
            });
            it('should change service arguments and leave original untouched', function () {
               var handler = function(e, name, args) {
                     args = $ws.core.clone(args);
                     args.a = 9;
                     delete args.b;
                     args.c = 3;
                     e.setResult(args);
                  },
                  serviceArgs = {a: 1, b: 2},
                  expectArgs = {a: 9, c: 3};
               dataSource.subscribe('onBeforeProviderCall', handler);
               dataSource.call('Test', serviceArgs);
               dataSource.unsubscribe('onBeforeProviderCall', handler);
               assert.deepEqual(provider._lastArgs, expectArgs);
               assert.notDeepEqual(serviceArgs, expectArgs);
            });
         });
      });
   });
});