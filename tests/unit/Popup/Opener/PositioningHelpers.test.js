define(
   [
      'Controls/Popup/Opener/Stack/StackStrategy',
      'Controls/Popup/Opener/Sticky/StickyStrategy',
      'Controls/Popup/Opener/Notification/NotificationStrategy',
      'Controls/Popup/Opener/Dialog/DialogStrategy',
      'Controls/Popup/Opener/Stack/StackController',
      'Controls/Popup/Opener/Sticky/StickyController',
      'Controls/Popup/Opener/Dialog/DialogController',
   ],

   function(Stack, Sticky, Notification, Dialog, StackController, StickyController, DialogController) {
      'use strict';
      describe('Controls/Popup/Opener/Strategy', function() {
         describe('Sticky', function() {
            var targetCoords = {
               top: 200,
               left: 200,
               bottom: 400,
               right: 400,
               width: 200,
               height: 200,
               leftScroll: 0,
               topScroll: 0
            };

            Sticky._private.getWindowSizes = function() {
               return {
                  width: 1920,
                  height: 1040
               };
            };

            it('Simple sticky', function() {
               var position = Sticky.getPosition({
                  corner: {
                     vertical: 'bottom',
                     horizontal: 'right'
                  },
                  align: {
                     vertical: {
                        side: 'bottom',
                        offset: 0
                     },
                     horizontal: {
                        side: 'right',
                        offset: 0
                     }
                  },
                  config: {},
                  sizes: {
                     width: 100,
                     height: 100,
                     margins: {
                        top: 0,
                        left: 0
                     }
                  }
               }, targetCoords);
               assert.isTrue(position.top === 400);
               assert.isTrue(position.left === 400);
            });

            it('Centered sticky', function() {
               var position = Sticky.getPosition({
                  corner: {
                     vertical: 'bottom',
                     horizontal: 'center'
                  },
                  align: {
                     vertical: {
                        side: 'bottom',
                        offset: 0
                     },
                     horizontal: {
                        side: 'center',
                        offset: 0
                     }
                  },
                  config: {},
                  sizes: {
                     width: 200,
                     height: 200,
                     margins: {
                        top: 0,
                        left: 0
                     }
                  }
               }, targetCoords);
               assert.isTrue(position.top === 400);
               assert.isTrue(position.left === 200);
            });

            it('Sticky with offset', function() {
               var position = Sticky.getPosition({
                  corner: {
                     vertical: 'top',
                     horizontal: 'left'
                  },
                  align: {
                     vertical: {
                        side: 'top',
                        offset: 10
                     },
                     horizontal: {
                        side: 'left',
                        offset: -10
                     }
                  },
                  config: {},
                  sizes: {
                     width: 100,
                     height: 100,
                     margins: {
                        top: 0,
                        left: 0
                     }
                  }
               }, targetCoords);
               assert.isTrue(position.top === 110);
               assert.isTrue(position.left === 90);
            });

            it('Sticky with offset on margins', function() {
               var position = Sticky.getPosition({
                  corner: {
                     vertical: 'top',
                     horizontal: 'left'
                  },
                  align: {
                     vertical: {
                        side: 'top',
                        offset: 0
                     },
                     horizontal: {
                        side: 'left',
                        offset: 0
                     }
                  },
                  config: {},
                  sizes: {
                     width: 100,
                     height: 100,
                     margins: {
                        top: 10,
                        left: -10
                     }
                  }
               }, targetCoords);
               assert.isTrue(position.top === 110);
               assert.isTrue(position.left === 90);
            });

            it('Sticky with inverting', function() {
               var position = Sticky.getPosition({
                  corner: {
                     vertical: 'bottom',
                     horizontal: 'left'
                  },
                  align: {
                     vertical: {
                        side: 'bottom',
                        offset: 0
                     },
                     horizontal: {
                        side: 'left',
                        offset: 0
                     }
                  },
                  config: {},
                  sizes: {
                     width: 400,
                     height: 200,
                     margins: {
                        top: 0,
                        left: 10
                     }
                  }
               }, targetCoords);
               assert.isTrue(position.top === 400);
               assert.isTrue(position.left === 390);
            });
            it('Check fixed state', function() {
               var itemConfig = {};
               StickyController.getDefaultConfig(itemConfig);
               assert.isTrue(itemConfig.position.position === 'fixed');
               try {
                  StickyController.elementCreated(itemConfig);
               } catch (ex) {
                  //Упадет в ошибку, потому что не передан параметр container
                  assert.isTrue(itemConfig.position.position === undefined);
               }
            });

            it('Sticky with option locationStrategy=fixed', function() {
               var position = Sticky.getPosition({
                  locationStrategy: 'fixed',
                  corner: {
                     vertical: 'bottom',
                     horizontal: 'left'
                  },
                  align: {
                     vertical: {
                        side: 'bottom',
                        offset: 0
                     },
                     horizontal: {
                        side: 'left',
                        offset: 0
                     }
                  },
                  config: {},
                  sizes: {
                     width: 400,
                     height: 200,
                     margins: {
                        top: 0,
                        left: 10
                     }
                  }
               }, targetCoords);

               assert.isTrue(position.top === 400);
               assert.isTrue(position.left === -190);
            });
         });

         describe('Dialog', function() {
            let sizes = {
               width: 200,
               height: 300
            };
            it('dialog positioning base', function() {
               let position = Dialog.getPosition(1920, 1080, sizes , {});
               assert.equal(position.top, 390);
               assert.equal(position.left, 860);
            });

            it('dialog positioning overflow container', function() {
               let position = Dialog.getPosition(300, 300, sizes , {});
               assert.equal(position.top, 0);
               assert.equal(position.left, 50);
               assert.equal(position.width, undefined);
               assert.equal(position.height, 300);
            });

            it('dialog positioning overflow popup config', function() {
               let popupOptions = {
                  minWidth: 300,
                  maxWidth: 600
               };
               let position = Dialog.getPosition(500, 500, sizes , popupOptions);
               assert.equal(position.left, 0);
               assert.equal(position.width, 500);
            });

            it('dialog positioning overflow minWidth', function() {
               let popupOptions = {
                  minWidth: 600,
                  maxWidth: 700
               };
               let position = Dialog.getPosition(500, 500, sizes , popupOptions);
               assert.equal(position.left, 0);
               assert.equal(position.width, 600);
            });

            it('dialog container sizes after update', function() {
               DialogController.prepareConfig = () => {
                  assert.equal(container.style.width, 'auto');
                  assert.equal(container.style.height, 'auto');
               };
               let container = {
                  style: {
                     width: 10,
                     height: 10
                  }
               };
               DialogController.elementUpdated(null, container);
               assert.equal(container.style.width, 10);
               assert.equal(container.style.height, 10);
            });

         });

         describe('Stack', function() {
            let stackShadowWidth = 8;
            Stack.getMaxPanelWidth = () => 1000;
            let item = {
               popupOptions: {
                  minWidth: 600,
                  maxWidth: 800
               }
            };

            it('stack with config sizes', function() {
               var position = Stack.getPosition({top: 0, right: 0}, item);
               assert.isTrue(position.width === item.popupOptions.maxWidth + stackShadowWidth);
               assert.isTrue(position.top === 0);
               assert.isTrue(position.right === 0);
               assert.isTrue(position.bottom === 0);
            });

            it('stack default position', function() {
               let itemConfig = {
                  popupOptions: item.popupOptions
               };
               StackController.getDefaultConfig(itemConfig);
               assert.equal(itemConfig.position.top, -10000);
               assert.equal(itemConfig.position.left, -10000);
               assert.equal(itemConfig.position.width, 800 + stackShadowWidth);
            });

            it('stack state', function() {
               let itemConfig = {
                  popupOptions: item.popupOptions
               };
               StackController._update = () => {}; //Этот метод зовет получение размеров окна, для этих тестов не нужно
               StackController._private.prepareSizes = () => {}; //Этот метод зовет получение размеров окна, для этих тестов не нужно

               StackController.elementCreated(itemConfig, {});
               //Зависит от того где запускаем тесты, под нодой или в браузере
               assert.isTrue(itemConfig.stackState === 'opened' || itemConfig.stackState === 'creating');

               StackController.elementAnimated(itemConfig);
               assert.equal(itemConfig.stackState, 'opened');

               itemConfig.popupOptions.className = '';
               StackController.elementUpdated(itemConfig, {});
               //класс обновился, потому что состояние было opened
               assert.isTrue(itemConfig.stackState === 'opened' && itemConfig.popupOptions.className === " controls-Stack");

               itemConfig.stackState = 'notOpened';
               itemConfig.popupOptions.className = '';
               StackController.elementUpdated(itemConfig, {});
               //класс не обновился, потому что состояние не opened
               assert.equal(itemConfig.popupOptions.className, '');

               StackController.elementDestroyed(itemConfig, {});
               //Зависит от того где запускаем тесты, под нодой или в браузере
               assert.isTrue(itemConfig.stackState === 'destroying' || itemConfig.stackState === 'destroyed');

               itemConfig.stackState = 'destroying';
               StackController.elementAnimated(itemConfig, {});
               //Зависит от того где запускаем тесты, под нодой или в браузере
               assert.equal(itemConfig.stackState, 'destroyed');
            });

            it('stack from target container', function() {
               var position = Stack.getPosition({top: 100, right: 100}, item);
               assert.isTrue(position.width === item.popupOptions.maxWidth + stackShadowWidth);
               assert.isTrue(position.top === 100);
               assert.isTrue(position.right === 100);
               assert.isTrue(position.bottom === 0);
            });
            it('stack without config sizes', function() {
               let item = {
                  popupOptions: {},
                  containerWidth: 800
               };
               var position = Stack.getPosition({top: 0, right: 0}, item);
               assert.isTrue(position.width === item.containerWidth + stackShadowWidth);
               assert.isTrue(position.top === 0);
               assert.isTrue(position.right === 0);
               assert.isTrue(position.bottom === 0);
            });
            it('stack reduced width', function() {
               let item = {
                  popupOptions: {
                     minWidth: 600,
                     maxWidth: 1800
                  }
               };
               var position = Stack.getPosition({top: 0, right: 0}, item);
               assert.isTrue(position.width === Stack.getMaxPanelWidth() + stackShadowWidth);
               assert.isTrue(position.top === 0);
               assert.isTrue(position.right === 0);
               assert.isTrue(position.bottom === 0);
            });

            it('stack reset offset', function() {
               let item = {
                  popupOptions: {
                     minWidth: 800,
                     maxWidth: 1800
                  }
               };
               var position = Stack.getPosition({top: 0, right: 400}, item);
               assert.isTrue(position.width === item.popupOptions.minWidth + stackShadowWidth);
               assert.isTrue(position.top === 0);
               assert.isTrue(position.right === 0);
               assert.isTrue(position.bottom === 0);
            });


         });

         describe('Notification', function() {
            it('first notification positioning', function() {
               var position = Notification.getPosition(0);
               assert.isTrue(position.right === 0);
               assert.isTrue(position.bottom === 0);
            });
         });
      });
   }
);
