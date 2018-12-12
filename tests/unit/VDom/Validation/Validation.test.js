define([
   'Core/helpers/Function/runDelayed'
], function (runDelayed) {
   'use strict';

   describe('Validation-tests', function () {
      var testControl, testElement;
      beforeEach(function () {
         if (typeof $ === 'undefined') {//Проверка того, что тесты выполняются в браузере
            this.skip();
         }
         testElement = $('<div id="component123"></div>');
         $('#mocha').append(testElement);//Для добавления верстки на страницу
      });

      function check(done, control, expected, callback) {
         control.validate().addCallback(function(res) {
            try {
               assert.deepEqual(res, expected);
            } catch (e) {
               done(e);
               return;
            }

            callback();
         });
      }

      it('SimpleCase - Validation1 - single validator', function (done) {
         global.requirejs(['Core/Control', 'ControlsSandbox/Validation/Validation1/Validation1'], function (CoreControl, Component) {
            var element = $('#component123');
            testControl = CoreControl.createControl(Component, {element: element}, element);
            testControl._afterMount = function () {
               runDelayed(function() {
                  $(document).ready(function () {
                     setTimeout(function () { // ждем когда оживятся дети

                        testControl._children.validate._deactivatedHandler();
                        runDelayed(function () { // ждем синхронизатор
                           runDelayed(function () { // ждем runDelayed из DOMEnvironment который нужен для reviveSuperOldControls
                              runDelayed(function () { // ждем когда пройдет валидация
                                 assert.deepEqual(testControl._children.textBox._options.style, 'invalid');

                                 testControl.setText('ya@ya.ya');
                                 runDelayed(function () { // ждем синхронизатор
                                    runDelayed(function () { // ждем runDelayed из DOMEnvironment который нужен для reviveSuperOldControls
                                       testControl._children.validate._deactivatedHandler();
                                       runDelayed(function () { // ждем синхронизатор
                                          runDelayed(function () { // ждем runDelayed из DOMEnvironment который нужен для reviveSuperOldControls
                                             runDelayed(function () { // ждем когда пройдет валидация
                                                assert.deepEqual(testControl._children.textBox._options._options.style, 'info');
                                                done();
                                             });
                                          });
                                       });
                                    });
                                 });

                              });
                           });
                        });
                     }, 200);
                  });
               });
            };
         });
      });

      it('SimpleCase - Form1 - single validator', function (done) {
         global.requirejs(['Core/Control', 'ControlsSandbox/Validation/Form1/Form1'], function (CoreControl, Component) {
            var element = $('#component123');
            testControl = CoreControl.createControl(Component, {element: element}, element);

            testControl._afterMount = function () {
               runDelayed(function() {
                  $(document).ready(function () {
                     setTimeout(function () { // ждем когда оживятся дети
                        check(done, testControl, {0: [false] }, function () {
                           testControl._afterUpdate = function () {
                              check(done, testControl, {0: null }, function () {
                                 done();
                              });
                           };
                           testControl.setText('ya@ya.ya');
                        });
                     }, 200);
                  });
               });
            };
         });
      });

      it('SimpleCase - Form2 - multiple validators', function (done) {
         global.requirejs(['Core/Control', 'ControlsSandbox/Validation/Form2/Form2'], function (CoreControl, Component) {
            var element = $('#component123');
            testControl = CoreControl.createControl(Component, {element: element}, element);
            testControl._afterMount = function () {
               runDelayed(function() {
                  $(document).ready(function () {
                     setTimeout(function () { // ждем когда оживятся дети
                        check(done, testControl, {0: [false, "IsRequiredDef: undefined не является строкой"] }, function () {
                           testControl._afterUpdate = function () {
                              check(done, testControl, {0: [false, "IsRequiredDef: пустая строка"] }, function () {
                                 testControl._afterUpdate = function () {
                                    check(done, testControl, {0: [false] }, function () {
                                       testControl._afterUpdate = function () {
                                          check(done, testControl, {0: null }, function () {
                                             done();
                                          });
                                       };
                                       testControl.setText('ya@ya.ya');
                                    });
                                 };
                                 testControl.setText('123');
                              });
                           };
                           testControl.setText('');
                        });
                     }, 200);
                  });
               });
            };
         });
      });

      afterEach(function () {
         testControl && testControl.destroy();
         testElement && testElement.remove();
      });
   });

});
