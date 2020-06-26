/* global define, beforeEach, afterEach, describe, it, assert, sinon */
define([
   'Controls/dataSource',
   'Env/Env',
   'Browser/Transport',
   'Types/entity',
   'UI/Utils'
], function(
   dataSource,
   { constants },
   Transport,
   { PromiseCanceledError },
   { Logger }
) {
   describe('Controls/dataSource:error.Controller', function() {
      const Controller = dataSource.error.Controller;
      let controller;
      let popupHelper;

      function createController() {
         popupHelper = {
            openConfirmation: sinon.stub().returns(Promise.resolve())
         };
         controller = new Controller({}, popupHelper);
      }

      afterEach(() => {
         sinon.restore();
      });

      it('is defined', function() {
         assert.isDefined(Controller);
      });

      it('is constructor', function() {
         assert.isFunction(Controller);
         createController();
         assert.instanceOf(controller, Controller);
      });

      describe('addHandler()', function() {
         createController();

         it('adds to _handlers', function() {
            const handler = () => undefined;
            controller.addHandler(handler);
            assert.include(controller.__controller._handlers, handler);
         });

         it('doesn\'t add to _handlers twice', function() {
            const handler = () => undefined;
            controller.addHandler(handler);
            controller.addHandler(handler);
            assert.equal(
               controller.__controller._handlers.indexOf(handler),
               controller.__controller._handlers.lastIndexOf(handler)
            );
         });
      });

      describe('removeHandler()', function() {
         createController();

         it('is function', function() {
            assert.isFunction(controller.removeHandler);
         });

         it('removes from _handlers', function() {
            const handler = () => undefined;
            controller.addHandler(handler);
            controller.removeHandler(handler);
            assert.notInclude(controller.__controller._handlers, handler);
         });

         it('doesn\'t remove other handlers', function() {
            const handler1 = () => undefined;
            const handler2 = () => undefined;
            controller.addHandler(handler1);
            controller.addHandler(handler2);
            controller.removeHandler(handler1);
            assert.include(controller.__controller._handlers, handler2);
         });
      });

      describe('process()', function() {
         let error;

         beforeEach(function() {
            createController();
            error = new Error('test error');
            sinon.stub(Logger, 'error');
         });

         afterEach(function() {
            controller.destroy();
            controller = null;
            error = null;
         });

         const addHandlerPromise =
            () => new Promise(resolve => controller.addHandler(resolve));

         const addFailHandler =
            () => controller.addHandler(() => assert.fail('handler should not be called'));

         it('calls registered handler', function() {
            const handlerPromise = addHandlerPromise();
            return controller.process(error).then(() => handlerPromise);
         });

         it('doesn\'t call handler with processed error', function() {
            addFailHandler();
            error.processed = true;
            return controller.process(error);
         });

         it('doesn\'t call handler with canceled error', function() {
            addFailHandler();
            error.canceled = true;
            return controller.process(error);
         });

         it('doesn\'t call handlers with Abort error', function() {
            addFailHandler();
            return controller.process(new Transport.fetch.Errors.Abort('test page'));
         });

         it('calls handler with current args', function() {
            const ARGS = {
               error: error,
               mode: dataSource.error.Mode.include
            };
            const handlerPromise = addHandlerPromise();
            return controller.process(ARGS)
               .then(() => handlerPromise)
               .then(args => assert.deepEqual(args, ARGS));
         });

         it('calls all registered handlers', function() {
            const promises = [];
            for (let i = 0; i < 5; i++) {
               promises.push(addHandlerPromise());
            }
            return controller.process(error).then(() => Promise.all(promises));
         });

         it('stops calling handlers after receiving an answer', function() {
            for (let i = 0; i < 5; i++) {
               controller.addHandler(() => undefined);
            }
            controller.addHandler(() => ({
               template: 'test',
               options: {}
            }));
            addFailHandler();
            return controller.process(error);
         });

         it('returns current handler result', function() {
            const RESULT = {
               template: 'test',
               options: {},
               mode: dataSource.error.Mode.include
            };
            controller.addHandler(() => RESULT);
            return controller.process(error).then((result) => {
               assert.deepEqual(RESULT, {
                  mode: result.mode,
                  template: result.template,
                  options: result.options
               });
            });
         });

         it('shows default dialog if gets no result from handlers', function() {
            for (let i = 0; i < 5; i++) {
               controller.addHandler(() => undefined);
            }
            const theme = 'test';
            return controller.process({
               error,
               theme
            }).then((viewConfig) => {
               assert.isUndefined(viewConfig, 'returns undefined');
               assert.isTrue(popupHelper.openConfirmation.calledOnce, 'openConfirmation called');
               assert.include(popupHelper.openConfirmation.getCall(0).args[0], {
                  theme,
                  message: error.message
               }, 'openConfirmation called with theme and message');
            });
         });

         it('executes async handlers', () => {
            const viewConfig = {
               template: 'test',
               options: {},
               mode: dataSource.error.Mode.include
            };

            const handlerPromises = [

               // Обработчик #1 возвращает undefined.
               new Promise(resolve => controller.addHandler(() => {
                  resolve();
                  return Promise.resolve();
               })),

               // Обработчик #2 бросает исключение, оно должно игнорироваться.
               new Promise(resolve => controller.addHandler(() => {
                  resolve();
                  throw new Error('Throw test error');
               })),

               // Обработчик #3 возвращает промис с ошибкой, она должна игнорироваться.
               new Promise(resolve => controller.addHandler(() => {
                  resolve();
                  return Promise.reject(new Error('Test rejected promise'));
               }))
            ];

            // Обработчик #4 возвращает конфиг, он должен стать результатом всей цепочки.
            controller.addHandler(() => Promise.resolve(viewConfig));

            // Обработчик #5 не должен выполняться.
            addFailHandler();

            return controller.process(error).then((result) => {
               assert.deepEqual(viewConfig, {
                  mode: result.mode,
                  template: result.template,
                  options: result.options
               }, 'viewConfig');

               assert.isTrue(Logger.error.calledTwice, 'all handler errors were logged');

               return Promise.all(handlerPromises);
            });
         });

         it('stops processing when handler throws PromiseCanceledError', () => {
            const handlerPromises = [

               // Обработчик #1 возвращает undefined.
               addHandlerPromise(),

               // Обработчик #2 бросает исключение отмены.
               new Promise(resolve => controller.addHandler(() => {
                  resolve();
                  throw new PromiseCanceledError();
               }))
            ];

            // Обработчик #3 не должен выполняться.
            addFailHandler();

            return controller.process(error).then((viewConfig) => {
               assert.isUndefined(viewConfig, 'returns undefined');
               assert.isNotOk(popupHelper.openConfirmation.called, 'openConfirmation not called');

               return Promise.all(handlerPromises);
            });
         });

         it('stops processing when handler rejects promise with PromiseCanceledError', () => {
            const handlerPromises = [

               // Обработчик #1 возвращает undefined.
               addHandlerPromise(),

               // Обработчик #2 возвращает промис с исключением отмены.
               new Promise(resolve => controller.addHandler(() => {
                  resolve();
                  return Promise.reject(new PromiseCanceledError());
               }))
            ];

            // Обработчик #3 не должен выполняться.
            addFailHandler();

            return controller.process(error).then((viewConfig) => {
               assert.isUndefined(viewConfig, 'returns undefined');
               assert.isNotOk(popupHelper.openConfirmation.called, 'openConfirmation not called');

               return Promise.all(handlerPromises);
            });
         });

         // call application handler
         // default mode in handler's config
         // default mode in result
         // dafault template
      });

      describe('_getIVersion()', () => {
         it('returns empty object on server side', () => {
            const { isServerSide } = constants;
            constants.isServerSide = true;
            try {
               assert.isEmpty(Controller._getIVersion());
            } finally {
               constants.isServerSide = isServerSide;
            }
         });

         it('returns IVersionable on browser side', () => {
            const { isServerSide } = constants;
            constants.isServerSide = false;
            try {
               const result = Controller._getIVersion();
               assert.isObject(result, 'must return an object');
               assert.isTrue(result['[Types/_entity/IVersionable]'], 'must have [Types/_entity/IVersionable]');
               assert.isFunction(result.getVersion, 'must have getVersion()');
               assert.isNumber(result.getVersion(), 'getVersion() must return a number');
            } finally {
               constants.isServerSide = isServerSide;
            }
         });
      });

      describe('_isNeedHandle()', () => {
         it('returns false for Abort error', () => {
            const error = new Transport.fetch.Errors.Abort('test-url');
            assert.isFalse(Controller._isNeedHandle(error));
         });

         it('returns false for processed error', () => {
            const error = { processed: true };
            assert.isFalse(Controller._isNeedHandle(error));
         });

         it('returns false for canceled error', () => {
            const error = { canceled: true };
            assert.isFalse(Controller._isNeedHandle(error));
         });

         it('returns true for other types', () => {
            const error = new Error();
            assert.isTrue(Controller._isNeedHandle(error));
         });
      });

      describe('_prepareConfig()', () => {
         it('returns a config for an error', () => {
            const error = new Error();
            const result = Controller._prepareConfig(error);
            assert.deepEqual(result, {
               error,
               mode: 'dialog'
            });
         });

         it('returns a config with default mode', () => {
            const error = new Error();
            const config = { error };
            const result = Controller._prepareConfig(config);
            assert.notStrictEqual(result, config, 'must return a new object');
            assert.deepEqual(result, {
               error,
               mode: 'dialog'
            });
         });

         it('returns a copy of the config', () => {
            const error = new Error();
            const config = {
               error,
               mode: 'include'
            };
            const result = Controller._prepareConfig(config);
            assert.notStrictEqual(result, config, 'must return a new object');
            assert.deepEqual(result, config);
         });
      });
   });
});
