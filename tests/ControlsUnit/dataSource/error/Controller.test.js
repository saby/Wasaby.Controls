define([
    'Controls/dataSource',
    'Env/Env',
    'Browser/Transport'
], function (dataSource, Env, Transport) {
    describe('Controls/dataSource:error.Controller', function () {
        var Controller = dataSource.error.Controller;
        // eslint-disable-next-line no-empty-function
        Controller.prototype._getDefault = () => {};
        it('is defined', function () {
            assert.isDefined(Controller);
        });
        it('is constructor', function () {
            assert.isFunction(Controller);
            var controller = new Controller();
            assert.instanceOf(controller, Controller);
        });
        describe('addHandler', function () {
            var controller = new Controller();
            it('is function', function () {
                assert.isFunction(controller.addHandler);
            });
            it('add to __handlers', function () {
                var handler = function(args) {

                };
                controller.addHandler(handler);
                assert.include(controller.__controller.__handlers, handler);
            });
            it("don't add to __handlers twice", function () {
                var handler = function(args) {

                };
                controller.addHandler(handler);
                controller.addHandler(handler);
                assert.equal(
                    controller.__controller.__handlers.indexOf(handler),
                    controller.__controller.__handlers.lastIndexOf(handler)
                );
            });
        });
        describe('removeHandler', function () {
            var controller = new Controller();
            it('is function', function () {
                assert.isFunction(controller.removeHandler);
            });
            it('removed from __handlers', function () {
                var handler = function(args) {

                };
                controller.addHandler(handler);
                controller.removeHandler(handler);
                assert.notInclude(controller.__controller.__handlers, handler);
            });
            it("don't remove other handlers", function () {
                var handler_1 = function(args) {};
                var handler_2 = function(args) {};
                controller.addHandler(handler_1);
                controller.addHandler(handler_2);

                controller.removeHandler(handler_1);
                assert.include(controller.__controller.__handlers, handler_2);
            });
        });
        describe('process', function () {
            var controller;
            var error;
            beforeEach(function () {
                controller = new Controller();
                error = new Error('test error');
            });
            afterEach(function () {
                controller.destroy();
                controller = null;
                error = null;
            });
            function getAppConfig () {
                var applicationConfig = Env.constants.ApplicationConfig;
                if (!applicationConfig) {
                    applicationConfig = Env.constants.ApplicationConfig = {};
                }
                return applicationConfig;
            }
            it('is function', function () {
                assert.isFunction(controller.process);
            });
            it('return Promise', function () {
                assert.instanceOf(
                    controller.process(error),
                    Promise
                );
            });
            it('call registered handler', function (done) {
                var handler = function(args) {
                    done();
                };
                controller.addHandler(handler);
                controller.process(error);
            });
            it("don't call with processed error", function (done) {
                var handler = function(args) {
                    done(new Error('handler should not be called'));
                };
                controller.addHandler(handler);
                error.processed = true;
                controller.process(error).then(function() {
                    done();
                });
            });
            it("don't call with canceled error", function (done) {
                var handler = function(args) {
                    done(new Error('handler should not be called'));
                };
                controller.addHandler(handler);
                error.canceled = true;
                controller.process(error).then(function() {
                    done();
                });
            });
            it("don't call with Abort error", function (done) {
                var handler = function(args) {
                    done(new Error('handler should not be called'));
                };
                controller.addHandler(handler);
                controller.process(new Transport.fetch.Errors.Abort('test page')).then(function() {
                    done();
                });
            });
            it('call with current args', function (done) {
                var ARGS = {
                    error: error,
                    mode: dataSource.error.Mode.include
                };
                var handler = function(args) {
                    assert.deepEqual(args, ARGS);
                    done();
                };
                controller.addHandler(handler);
                controller.process(ARGS);
            });
            it('call all registered handlers', function (done) {
                var promises = [];
                for (var i = 0; i < 10; i++) {
                    promises.push(new Promise(function(resolve) {
                        var handler = function(args) {
                            resolve();
                        };
                        controller.addHandler(handler);
                    }));
                }
                controller.process(error);
                Promise.all(promises).then(function() {
                    done();
                }, done);
            });
            it('stop calling when find answer', function (done) {
                for (var i = 0; i < 5; i++) {
                    controller.addHandler(function(args) {});
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
                controller.process(error).then(function() {
                    done();
                }, done);
            });
            it('return current handler result', function (done) {
                var RESULT = {
                    template: 'test',
                    options: {},
                    mode: dataSource.error.Mode.include
                };
                controller.addHandler(function(args) {
                    return RESULT;
                });
                controller.process(error).then(function(result) {
                    assert.deepEqual(RESULT, {
                        mode: result.mode,
                        template: result.template,
                        options: result.options
                    });
                    done();
                }).catch(done);
            });

            // call application handler
            // default mode in handler's config
            // default mode in result
            // dafault template
        });
    });
});
