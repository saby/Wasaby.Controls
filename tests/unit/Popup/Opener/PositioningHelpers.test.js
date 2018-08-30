define(
   [
      'Controls/Popup/Opener/Stack/StackStrategy',
      'Controls/Popup/Opener/Sticky/StickyStrategy',
      'Controls/Popup/Opener/Notification/NotificationStrategy',
      'Controls/Popup/Opener/Dialog/DialogStrategy',
      'Controls/Popup/Opener/Stack/StackController',
      'Controls/Popup/Opener/Sticky/StickyController',
      'Controls/Popup/Opener/Dialog/DialogController',
      'Core/Deferred'
   ],

   function(Stack, Sticky, Notification, Dialog, StackController, StickyController, DialogController, Deferred) {
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

               StickyController._checkContainer = () => { return false; };
               StickyController.elementCreated(itemConfig);
               assert.isTrue(itemConfig.position.position === undefined);
            });

            it('Sticky state', function() {
               StickyController._checkContainer = () => { return false; };
               StickyController._isElementVisible = () => { return true; };
               let itemConfig = {
                  popupOptions: {}
               };
               let result = StickyController.elementAfterUpdated(itemConfig);
               //false, т.к. попали в elementAfterUpdated, но до этого не было elementUpdated
               assert.equal(result, false);

               StickyController.elementUpdated(itemConfig);
               assert.equal(itemConfig.stickyState, 'updated');

               StickyController.elementAfterUpdated(itemConfig);
               //false, т.к. попали в elementAfterUpdated, но до этого не было elementUpdated
               assert.equal(itemConfig.stickyState, 'afterUpdated');
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
               let position = Dialog.getPosition(1920, 1080, sizes , {popupOptions: {}});
               assert.equal(position.top, 390);
               assert.equal(position.left, 860);
            });

            it('dialog positioning overflow container', function() {
               let position = Dialog.getPosition(300, 300, sizes, {popupOptions: {}});
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
               let position = Dialog.getPosition(500, 500, sizes, {popupOptions: popupOptions});
               assert.equal(position.left, 0);
               assert.equal(position.width, 500);
            });

            it('dialog positioning overflow minWidth', function() {
               let popupOptions = {
                  minWidth: 600,
                  maxWidth: 700
               };
               let position = Dialog.getPosition(500, 500, sizes, {popupOptions: popupOptions});
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

            it('dialog draggable position', function() {
               let itemPosition = {left: 100, top: 100};
               let position = Dialog.getPosition(800, 600, sizes, {
                  position: itemPosition,
                  dragged: true
               });
               assert.equal(position.left, itemPosition.left);
               assert.equal(position.top, itemPosition.top);

               itemPosition = {left: 700, top: 500};
               position = Dialog.getPosition(800, 600, sizes, {
                  position: itemPosition,
                  dragged: true
               });
               assert.equal(position.left, 600);
               assert.equal(position.top, 300);
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
               StackController._private.getWindowSize = () => { return {width: 1920, height: 950}}; //Этот метод зовет получение размеров окна, для этих тестов не нужно
               let itemConfig = {
                  popupOptions: item.popupOptions
               };
               StackController.getDefaultConfig(itemConfig);
               assert.equal(itemConfig.position.top, -10000);
               assert.equal(itemConfig.position.left, -10000);
               assert.equal(itemConfig.position.width, 800 + stackShadowWidth);
               assert.equal(itemConfig.position.height, 950);
            });

            it('stack maximized popup position', function() {
               let item = {
                  popupOptions: {
                     minWidth: 600,
                     maxWidth: 800
                  },
                  hasMaximizePopup: true
               };
               let position = Stack.getPosition({top: 0, right: 100}, item);
               assert.equal(position.right, 0);
            });

            it('stack panel maximized', function() {
               StackController._update = () => {}; //Этот метод зовет получение размеров окна, для этих тестов не нужно
               StackController._private.prepareSizes = () => {}; //Этот метод зовет получение размеров окна, для этих тестов не нужно
               StackController._private.getWindowSize = () => { return {width: 1920, height: 950}}; //Этот метод зовет получение размеров окна, для этих тестов не нужно

               let popupOptions = {
                  minimizedWidth: 600,
                  minWidth: 900,
                  maxWidth: 1200,
                  templateOptions: {}
               };
               let itemConfig = {
                  popupOptions: popupOptions
               };

               Stack.getMaxPanelWidth = () => 1600;

               assert.equal(Stack.isMaximizedPanel(itemConfig), true);

               StackController.getDefaultConfig(itemConfig);
               assert.equal(itemConfig.popupOptions.maximized, false); //default value
               assert.equal(itemConfig.popupOptions.templateOptions.hasOwnProperty('showMaximizedButton'), true);

               StackController.elementMaximized(itemConfig, {}, false);
               assert.equal(itemConfig.popupOptions.maximized, false);
               assert.equal(itemConfig.popupOptions.templateOptions.maximized, false);
               let position = Stack.getPosition({top: 0, right: 0}, itemConfig);
               assert.equal(position.width, popupOptions.minimizedWidth + stackShadowWidth);

               StackController.elementMaximized(itemConfig, {}, true);
               assert.equal(itemConfig.popupOptions.maximized, true);
               assert.equal(itemConfig.popupOptions.templateOptions.maximized, true);
               position = Stack.getPosition({top: 0, right: 0}, itemConfig);
               assert.equal(position.width, popupOptions.maxWidth + stackShadowWidth);

               StackController._private.prepareMaximizedState(1600, itemConfig);
               assert.equal(itemConfig.popupOptions.templateOptions.showMaximizedButton, true);

               StackController._private.prepareMaximizedState(800, itemConfig);
               assert.equal(itemConfig.popupOptions.templateOptions.showMaximizedButton, false);

            });

            it('stack state', function() {
               let itemConfig = {
                  id: '22',
                  popupOptions: item.popupOptions
               };
               StackController._update = () => {}; //Этот метод зовет получение размеров окна, для этих тестов не нужно
               StackController._private.prepareSizes = () => {}; //Этот метод зовет получение размеров окна, для этих тестов не нужно
               StackController._private.getWindowSize = () => { return {width: 1920, height: 950}}; //Этот метод зовет получение размеров окна, для этих тестов не нужно

               StackController.elementCreated(itemConfig, {});
               //Зависит от того где запускаем тесты, под нодой или в браузере
               assert.isTrue(itemConfig.stackState === 'opened' || itemConfig.stackState === 'creating');

               StackController.elementAnimated(itemConfig);
               assert.equal(itemConfig.stackState, 'opened');

               itemConfig.popupOptions.className = '';
               StackController.elementUpdated(itemConfig, {});
               StackController.elementUpdated(itemConfig, {});
               StackController.elementUpdated(itemConfig, {});
               //класс обновился, потому что состояние было opened. После множ. update класс не задублировался
               assert.isTrue(itemConfig.stackState === 'opened' && itemConfig.popupOptions.className === "controls-Stack");

               itemConfig.stackState = 'notOpened';
               itemConfig.popupOptions.className = '';
               StackController.elementUpdated(itemConfig, {});
               //класс не обновился, потому что состояние не opened
               assert.equal(itemConfig.popupOptions.className, '');

               StackController.elementDestroyed(itemConfig, {});
               //Зависит от того где запускаем тесты, под нодой или в браузере
               assert.isTrue(itemConfig.stackState === 'destroying' || itemConfig.stackState === 'destroyed');

               itemConfig.stackState = 'destroying';
               StackController._destroyDeferred[itemConfig.id] = new Deferred();
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

            it('stack with wrong options type', function() {
               let item = {
                  popupOptions: {
                     minWidth: '600',
                     maxWidth: '800'
                  }
               };
               var position = Stack.getPosition({top: 0, right: 0}, item);
               assert.equal(position.width, parseInt(item.popupOptions.maxWidth, 10) + stackShadowWidth);
            });

            it('stack reduced width', function() {
               Stack.getMaxPanelWidth = () => 1000;
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
