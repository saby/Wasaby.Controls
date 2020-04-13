/* global define, beforeEach, afterEach, describe, it, assert, sinon */
define([
   'Controls/dataSource',
   'Env/Env'
], function(dataSource, Env) {
   describe('Controls/dataSource:parking.Controller', function() {
      var Controller = dataSource.parking.Controller;
      it('is defined', function() {
         assert.isDefined(Controller);
      });
      it('is constructor', function() {
         assert.isFunction(Controller);
         var controller = new Controller();
         assert.instanceOf(controller, Controller);
      });
      describe('addHandler', function() {
         var controller = new Controller();
         it('is function', function() {
            assert.isFunction(controller.addHandler);
         });
         it('add to _handlers', function() {
            var handler = function(args) {

            };
            controller.addHandler(handler);
            assert.include(controller._handlers, handler);
         });
         it('don\'t add to _handlers twice', function() {
            var handler = function(args) {

            };
            controller.addHandler(handler);
            controller.addHandler(handler);
            assert.equal(
               controller._handlers.indexOf(handler),
               controller._handlers.lastIndexOf(handler)
            );
         });
      });
      describe('removeHandler', function() {
         var controller = new Controller();
         it('is function', function() {
            assert.isFunction(controller.removeHandler);
         });
         it('removed from _handlers', function() {
            var handler = function(args) {

            };
            controller.addHandler(handler);
            controller.removeHandler(handler);
            assert.notInclude(controller._handlers, handler);
         });
         it('don\'t remove other handlers', function() {
            var handler_1 = function(args) {
            };
            var handler_2 = function(args) {
            };
            controller.addHandler(handler_1);
            controller.addHandler(handler_2);

            controller.removeHandler(handler_1);
            assert.include(controller._handlers, handler_2);
         });
      });
      describe('process', function() {
         var controller;
         beforeEach(function() {
            controller = new Controller();
         });
         afterEach(function() {
            controller.destroy();
            controller = null;
         });

         function getAppConfig() {
            var applicationConfig = Env.constants.ApplicationConfig;
            if (!applicationConfig) {
               applicationConfig = Env.constants.ApplicationConfig = {};
            }
            return applicationConfig;
         }

         it('is function', function() {
            assert.isFunction(controller.process);
         });
         it('return Promise', function() {
            assert.instanceOf(
               controller.process({}),
               Promise
            );
         });
         it('call registered handler', function(done) {
            var handler = function(args) {
               done();
            };
            controller.addHandler(handler);
            controller.process({});
         });
         it('call with current args', function(done) {
            var ARGS = {
               test: 123
            };
            var handler = function(args) {
               assert.deepEqual(args, ARGS);
               done();
            };
            controller.addHandler(handler);
            controller.process(ARGS);
         });
         it('call all registered handlers', function(done) {
            var promises = [];
            for (var i = 0; i < 10; i++) {
               promises.push(new Promise(function(resolve) {
                  var handler = function(args) {
                     resolve();
                  };
                  controller.addHandler(handler);
               }));
            }
            controller.process({});
            Promise.all(promises).then(function() {
               done();
            }, function(error) {
               done(error);
            })
         });
         it('stop calling when find answer', function(done) {
            for (var i = 0; i < 5; i++) {
               controller.addHandler(function(args) {
               });
            }
            controller.addHandler(function(args) {
               return {
                  template: 'test',
                  options: {}
               }
            });
            controller.addHandler(function(args) {
               done(new Error('handler should not be called'));
            });
            controller.process({}).then(function() {
               done();
            });
         });
         it('return current handler result', function(done) {
            var RESULT = {
               template: 'test',
               options: {}
            };
            controller.addHandler(function(args) {
               return RESULT;
            });
            controller.process({}).then(function(result) {
               assert.deepEqual(RESULT, result);
               done();
            });
         });
         it('call application handler', function(done) {
            var CONFIG_FIELD = 'test-parking-controller';
            controller = new Controller({
               configField: CONFIG_FIELD
            });
            var handler = function(args) {
               done();
            };
            var appConfig = getAppConfig();
            if (!appConfig[CONFIG_FIELD]) {
               appConfig[CONFIG_FIELD] = [];
            }
            appConfig[CONFIG_FIELD].unshift(handler);
            controller.process({});
         });
      });
   });
});
