define([
   'Core/helpers/Function/runDelayed',
   'Core/Deferred',
   'require'
], function(runDelayed, Deferred, require) {
   'use strict';

   describe('FormController-tests', function() {
      var testControl, testElement;

      function mountControl(moduleName) {
         var def = new Deferred();
         require(['Core/Control', moduleName], function(CoreControl, Component) {
            var element =  document.body.querySelectorAll('#formControllerComponent')[0];
            testControl = CoreControl.createControl(Component, { element: element }, element);
            var baseAfterMount = testControl._afterMount;

            testControl._afterMount = function() {
               baseAfterMount.apply(this, arguments);
               runDelayed(function() {
                  waiting(function() {
                     def.callback(testControl);
                  });
               });
            };
         });
         return def;
      }

      function check(cfg) {
         assert.equal(document.body.querySelectorAll('.form-content__key')[0].innerText, cfg.key);
         assert.equal(document.body.querySelectorAll('.form-content__name .controls-InputRender__field')[0].value, cfg.name);
         assert.equal(document.body.querySelectorAll('.form-content__email .controls-InputRender__field')[0].value, cfg.email);
         assert.equal(document.body.querySelectorAll('.form-content__create .controls-BaseButton__text')[0].innerText, cfg.createButtonText);
         assert.equal(document.body.querySelectorAll('.form-content__select>*').length, cfg.selectButtonsCount);
      }
      function waiting(cb) {
         var self = this, args = arguments;
         setTimeout(function() {
            setTimeout(function() {
               setTimeout(function() {
                  setTimeout(function() {
                     setTimeout(function() {
                        setTimeout(function() {
                           setTimeout(function() {
                              setTimeout(function() {
                                 setTimeout(function() {
                                    setTimeout(function() {
                                       cb.apply(self, args);
                                    }, 0);
                                 }, 0);
                              }, 0);
                           }, 0);
                        }, 0);
                     }, 0);
                  }, 0);
               }, 0);
            }, 0);
         }, 0);
      }
      function doSteps(control, arr) {
         function step(stepCfg) {
            var action = stepCfg.action;
            var updateId = stepCfg.updateId;
            var answer = stepCfg.answer;
            var checkCfg = stepCfg.checkCfg;
            var def = new Deferred();
            switch (action) {
               case 'create':
                  var initValues = {
                     nameText: 'no name',
                     emailText: 'no@email.com'
                  };
                  control._children.formControllerInst.__$resultForTests = answer;
                  control._create({ initValues: initValues, ResultForTests: answer }).addCallbacks(function() {
                     waiting(function() {
                        check(checkCfg);
                        def.callback();
                     });
                  }, function(e) {
                     def.errback(e);
                  });
                  break;
               case 'read':
                  control._children.formControllerInst.__$resultForTests = answer;
                  waiting(function() {
                     control._read({ key: updateId, ResultForTests: answer }).addCallbacks(function() {
                        waiting(function() {
                           check(checkCfg);
                           waiting(function() {
                              def.callback();
                           });
                        });
                     }, function(e) {
                        def.errback(e);
                     });
                  });
                  break;
               case 'update':
                  control._update().addCallbacks(function() {
                     waiting(function() {
                        check(checkCfg);
                        def.callback();
                     });
                  }, function(e) {
                     def.errback(e);
                  });
                  break;
               case 'delete':
                  control._delete().addCallbacks(function() {
                     waiting(function() {
                        check(checkCfg);
                        def.callback();
                     });
                  }, function(e) {
                     def.errback(e);
                  });
                  break;
            }
            return def;
         }


         function recur(i, resultDef) {
            if (i === arr.length) {
               resultDef.callback();
               return;
            }
            var def = step(arr[i]);
            def.addCallback(function() {
               recur(i + 1, resultDef);
            });
            def.addErrback(function(e) {
               resultDef.errback(e);
            });
         }
         var def = new Deferred();
         recur(0, def);
         return def;
      }

      beforeEach(function () {
         if (!document || !document.body) {//Проверка того, что тесты выполняются в браузере
            this.skip();
         }
         else {
            var el = document.body.querySelectorAll('#mocha')[0];
            var testElement = document.createElement("div");
            testElement.setAttribute('id', 'formControllerComponent');
            el.appendChild(testElement);
         }

      });

      it('FormController - SimpleCase', function(done) {
         waiting.call(this, function () {

            var mountedDef = mountControl('Controls-demo/FormController/FormController');
            mountedDef.addCallback(function(control) {
               check({ // при инициализации
                  key: 'now is ' + 0,
                  name: '',
                  email: '',
                  createButtonText: 'create with id = ' + 1,
                  selectButtonsCount: 1
               });

               var resultDef = doSteps(control, [{
                  action: 'create',
                  answer: true,
                  checkCfg: {
                     key: 'now is ' + 1, // нажали создать новый
                     name: 'no name',
                     email: 'no@email.com',
                     createButtonText: 'create with id = ' + 2,
                     selectButtonsCount: 1
                  }
               }, {
                  action: 'update',
                  answer: true,
                  checkCfg: {
                     key: 'now is ' + 1,
                     name: 'no name',
                     email: 'no@email.com',
                     createButtonText: 'create with id = ' + 2,
                     selectButtonsCount: 2 // сохранили новый
                  }
               }, {
                  action: 'create',
                  answer: true,
                  checkCfg: {
                     key: 'now is ' + 2, // еше раз нажали создать новый
                     name: 'no name',
                     email: 'no@email.com',
                     createButtonText: 'create with id = ' + 3,
                     selectButtonsCount: 2
                  }
               }, {
                  action: 'create',
                  answer: true, // на вопрос сохранить отвечаем да
                  checkCfg: {
                     key: 'now is ' + 3,
                     name: 'no name',
                     email: 'no@email.com',
                     createButtonText: 'create with id = ' + 4,
                     selectButtonsCount: 3 // при еще одном сохранили 2й
                  }
               }, {
                  action: 'create',
                  answer: false, // на вопрос сохранить отвечаем нет
                  checkCfg: {
                     key: 'now is ' + 4,
                     name: 'no name',
                     email: 'no@email.com',
                     createButtonText: 'create with id = ' + 5,
                     selectButtonsCount: 3 // а теперь при создании ответили не сохранять и 3й не сохранился
                  }
               }, {
                  action: 'read', // читаем 0й
                  updateId: 0,
                  answer: true, // при этом отвечаем сохранить 4й
                  checkCfg: {
                     key: 'now is ' + 0,
                     name: '',
                     email: '',
                     createButtonText: 'create with id = ' + 5,
                     selectButtonsCount: 4 // итого у нас 0, 1, 2, 4 сохранены.
                  }
               }, {
                  action: 'read',
                  updateId: 1,
                  answer: true,
                  checkCfg: {
                     key: 'now is ' + 1,
                     name: 'no name',
                     email: 'no@email.com',
                     createButtonText: 'create with id = ' + 5,
                     selectButtonsCount: 4
                  }
               }, {
                  action: 'read',
                  updateId: 2,
                  answer: true,
                  checkCfg: {
                     key: 'now is ' + 2,
                     name: 'no name',
                     email: 'no@email.com',
                     createButtonText: 'create with id = ' + 5,
                     selectButtonsCount: 4
                  }
               }, {
                  action: 'read',
                  updateId: 3,
                  answer: true,
                  checkCfg: {
                     key: 'now is',
                     name: '',
                     email: '',
                     createButtonText: 'create with id = ' + 5,
                     selectButtonsCount: 4
                  }
               }, {
                  action: 'read',
                  updateId: 4,
                  answer: true,
                  checkCfg: {
                     key: 'now is ' + 4,
                     name: 'no name',
                     email: 'no@email.com',
                     createButtonText: 'create with id = ' + 5,
                     selectButtonsCount: 4
                  }
               }, {
                  action: 'delete',
                  answer: true,
                  checkCfg: {
                     key: 'now is',
                     name: '',
                     email: '',
                     createButtonText: 'create with id = ' + 5,
                     selectButtonsCount: 3
                  }
               }
               ]);
               resultDef.addCallbacks(function() {
                  done();
               }, function(e) {
                  done(e);
               });
            });
            mountedDef.addErrback(function(e) {
               done(e);
            });
         });

      }).timeout(6000);

      afterEach(function() {
         testControl && testControl.destroy();
         testElement && testElement.remove();
      });
   });
});
