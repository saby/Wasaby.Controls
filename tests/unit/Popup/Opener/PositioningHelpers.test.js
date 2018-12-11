define(
   [
      'Controls/Popup/Opener/BaseController',
      'Controls/Popup/Opener/Stack/StackStrategy',
      'Controls/Popup/Opener/Sticky/StickyStrategy',
      'Controls/Popup/Opener/Notification/NotificationStrategy',
      'Controls/Popup/Opener/Dialog/DialogStrategy',
      'Controls/Popup/Opener/Stack/StackController',
      'Controls/Popup/Opener/Sticky/StickyController',
      'Controls/Popup/Opener/Dialog/DialogController',
      'Core/Deferred'
   ],

   function(BaseController, Stack, Sticky, Notification, Dialog, StackController, StickyController, DialogController, Deferred) {
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
               var itemConfig = {
                  popupOptions: {}
               };
               StickyController._private.getWindowWidth = () => 1000;
               StickyController.getDefaultConfig(itemConfig);
               assert.isTrue(itemConfig.position.position === 'fixed');
               assert.equal(itemConfig.position.maxWidth, 1000);
               assert.equal(itemConfig.popupOptions.content, 'wml!Controls/Popup/Opener/Sticky/StickyContent');

               StickyController._checkContainer = () => false;
               StickyController._elementCreated(itemConfig);
               assert.isTrue(itemConfig.position.position === 'fixed');
               assert.equal(itemConfig.popupOptions.content, 'wml!Controls/Popup/Opener/Sticky/StickyContent');
            });

            it('Sticky state', function() {
               StickyController._checkContainer = () => false;
               StickyController._isElementVisible = () => true;
               let itemConfig = {
                  popupOptions: {}
               };
               let result = StickyController._elementAfterUpdated(itemConfig);

               // false, т.к. попали в _elementAfterUpdated, но до этого не было _elementUpdated
               assert.equal(result, false);

               StickyController._elementUpdated(itemConfig);
               assert.equal(itemConfig.popupState, undefined); // ничего не произошло, т.к. не было создания
            });

            it('check sticky position option', () => {
               let itemConfig = {
                  popupOptions: {
                     corner: {
                        vertical: 'top',
                        horizontal: 'left'
                     },
                     verticalAlign: {
                        side: 'left'
                     },
                     horizontalAlign: {
                        side: 'bottom'
                     }
                  }
               };
               let sizes = {
                  margins: { left: 0, top: 0 },
                  width: 100,
                  height: 100
               };
               let stickyPosition = {
                  corner: { vertical: 'bottom', horizontal: 'left' },
                  horizontalAlign: { side: 'bottom', offset: 0 },
                  verticalAlign: { side: 'right', offset: -0 }
               };
               StickyController._private.prepareConfig(itemConfig, sizes);
               assert.deepEqual(itemConfig.popupOptions.stickyPosition, stickyPosition);
            });

            it('Sticky initializing state', () => {
               let itemConfig = {
                  popupState: StickyController.POPUP_STATE_INITIALIZING
               };
               let destroyDef = StickyController._elementDestroyed(itemConfig);
               assert.equal(destroyDef.isReady(), true);
            });

            it('Sticky updated classes', function() {
               StickyController._isElementVisible = () => true;
               let item = {
                  position: {},
                  popupOptions: {},
                  sizes: {}
               };
               let container = {
                  offsetWidth: 100,
                  offsetHeight: 100
               };
               StickyController.elementCreated(item, container);
               assert.equal(typeof item.positionConfig, 'object'); // Конфиг сохранился
               assert.equal(item.sizes.width, 100); // Конфиг сохранился
               var classes = item.popupOptions.className;

               StickyController.elementUpdated(item, container);
               assert.equal(item.popupOptions.className, classes); // Классы не поменялись
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
               let windowData = {
                  width: 1920,
                  height: 1080,
                  scrollTop: 0
               };
               let position = Dialog.getPosition(windowData, sizes, { popupOptions: {} });
               assert.equal(position.top, 390);
               assert.equal(position.left, 860);

               windowData.scrollTop = 80;
               position = Dialog.getPosition(windowData, sizes, { popupOptions: {} });
               assert.equal(position.top, 470);
            });

            it('dialog positioning overflow container', function() {
               let windowData = {
                  width: 300,
                  height: 300,
                  scrollTop: 0
               };
               let position = Dialog.getPosition(windowData, sizes, { popupOptions: {} });
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
               let windowData = {
                  width: 500,
                  height: 500,
                  scrollTop: 0
               };
               let position = Dialog.getPosition(windowData, sizes, { popupOptions: popupOptions });
               assert.equal(position.left, 0);
               assert.equal(position.width, 500);
            });

            it('dialog positioning overflow minWidth', function() {
               let popupOptions = {
                  minWidth: 600,
                  maxWidth: 700
               };
               let windowData = {
                  width: 500,
                  height: 500,
                  scrollTop: 0
               };
               let position = Dialog.getPosition(windowData, sizes, { popupOptions: popupOptions });
               assert.equal(position.left, 0);
               assert.equal(position.width, 600);
            });

            it('dialog container sizes after update', function() {
               DialogController.prepareConfig = () => {
                  assert.equal(container.style.width, 'auto');
                  assert.equal(container.style.height, 'auto');
                  assert.equal(container.style.maxWidth, '20px');
                  assert.equal(container.style.maxHeight, '30px');
               };
               let container = {
                  style: {
                     width: 10,
                     height: 10
                  }
               };
               DialogController.elementUpdated({
                  popupOptions: {
                     maxWidth: 20,
                     maxHeight: 30
                  }
               }, container);
               assert.equal(container.style.width, 10);
               assert.equal(container.style.height, 10);
               assert.equal(container.style.maxWidth, '');
               assert.equal(container.style.maxHeight, '');
            });

            it('dialog default position', function() {
               let item = {
                  popupOptions: {
                     maxWidth: 100,
                     maxHeight: 100
                  }
               };
               let position = DialogController.getDefaultConfig(item);
               assert.equal(item.position.width, 100);
               assert.equal(item.position.height, 100);
            });

            it('dialog drag start', function() {
               let item = {
                  position: {
                     left: 100,
                     top: 50
                  },
                  sizes: {
                     width: 50,
                     height: 50
                  }
               };
               let offset = {
                  x: 10,
                  y: 20
               };
               let basePrepareConfig = DialogController._private.prepareConfig;
               DialogController._private.prepareConfig = (item, sizes) => {
                  assert.equal(item.sizes, sizes);
               };
               DialogController.popupDragStart(item, null, offset);
               assert.equal(item.startPosition.left, 100);
               assert.equal(item.startPosition.top, 50);
               assert.equal(item.position.left, 110);
               assert.equal(item.position.top, 70);
               DialogController._private.prepareConfig = basePrepareConfig;
            });

            it('dialog draggable position', function() {
               let itemPosition = { left: 100, top: 100 };
               let windowData = {
                  width: 800,
                  height: 600,
                  scrollTop: 0
               };
               let position = Dialog.getPosition(windowData, sizes, {
                  position: itemPosition,
                  dragged: true
               });
               assert.equal(position.left, itemPosition.left);
               assert.equal(position.top, itemPosition.top);

               itemPosition = {
                  left: 700, top: 500, width: sizes.width, height: sizes.height
               };
               windowData = {
                  width: 800,
                  height: 600,
                  scrollTop: 0
               };
               position = Dialog.getPosition(windowData, sizes, {
                  position: itemPosition,
                  dragged: true
               });
               assert.equal(position.left, 600);
               assert.equal(position.top, 300);
               assert.equal(position.width, sizes.width); // размеры не изменились
               assert.equal(position.height, sizes.height);
            });
         });

         describe('Stack', function() {
            Stack.getMaxPanelWidth = () => 1000;
            let item = {
               popupOptions: {
                  minWidth: 600,
                  maxWidth: 800
               }
            };

            it('stack with config sizes', function() {
               var position = Stack.getPosition({ top: 0, right: 0 }, item);
               assert.isTrue(position.width === item.popupOptions.maxWidth);
               assert.isTrue(position.top === 0);
               assert.isTrue(position.right === 0);
               assert.isTrue(position.bottom === 0);
            });

            it('stack shadow', function() {
               let baseGetItemPosition = StackController._private.getItemPosition;
               StackController._private.getItemPosition = items => (items.position);
               StackController._stack.add({ containerWidth: 840, popupOptions: { stackClassName: '' } });
               StackController._stack.add({ position: { width: 720 }, popupOptions: { stackClassName: '' } });
               StackController._stack.add({ containerWidth: 600, popupOptions: { stackClassName: '' } });
               StackController._stack.add({ position: { width: 600 }, popupOptions: { stackClassName: '' } });
               StackController._stack.add({ position: { width: 840 }, popupOptions: { stackClassName: '' } });
               StackController._stack.add({ containerWidth: 500, popupOptions: { stackClassName: '' } });
               StackController._stack.add({ containerWidth: 720, popupOptions: { stackClassName: '' } });
               StackController._update();
               assert.isTrue(StackController._stack.at(0).popupOptions.stackClassName.indexOf('controls-Stack__shadow') >= 0);
               assert.isTrue(StackController._stack.at(1).popupOptions.stackClassName.indexOf('controls-Stack__shadow') >= 0);
               assert.isTrue(StackController._stack.at(2).popupOptions.stackClassName.indexOf('controls-Stack__shadow') >= 0);
               assert.isTrue(StackController._stack.at(3).popupOptions.stackClassName.indexOf('controls-Stack__shadow') < 0);
               assert.isTrue(StackController._stack.at(4).popupOptions.stackClassName.indexOf('controls-Stack__shadow') < 0);
               assert.isTrue(StackController._stack.at(5).popupOptions.stackClassName.indexOf('controls-Stack__shadow') >= 0);
               assert.isTrue(StackController._stack.at(6).popupOptions.stackClassName.indexOf('controls-Stack__shadow') < 0);
               StackController._private.getItemPosition = baseGetItemPosition;
            });


            it('stack default position', function() {
               StackController._private.getWindowSize = () => ({ width: 1920, height: 950 }); // Этот метод зовет получение размеров окна, для этих тестов не нужно
               let itemConfig = {
                  popupOptions: item.popupOptions
               };
               StackController.getDefaultConfig(itemConfig);
               assert.equal(itemConfig.position.top, -10000);
               assert.equal(itemConfig.position.left, -10000);
               assert.equal(itemConfig.position.width, 800);
               assert.equal(itemConfig.position.height, 950);
               assert.equal(itemConfig.popupOptions.content, 'wml!Controls/Popup/Opener/Stack/StackContent');
            });

            it('stack maximized popup position', function() {
               let item = {
                  popupOptions: {
                     minWidth: 600,
                     maxWidth: 800
                  },
                  hasMaximizePopup: true
               };
               let position = Stack.getPosition({ top: 0, right: 100 }, item);
               assert.equal(position.right, 0);
            });

            it('stack panel maximized', function() {
               StackController._update = () => {}; // Этот метод зовет получение размеров окна, для этих тестов не нужно
               StackController._private.prepareSizes = () => {}; // Этот метод зовет получение размеров окна, для этих тестов не нужно
               StackController._private.getWindowSize = () => ({ width: 1920, height: 950 }); // Этот метод зовет получение размеров окна, для этих тестов не нужно

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
               assert.equal(itemConfig.popupOptions.maximized, false); // default value
               assert.equal(itemConfig.popupOptions.templateOptions.hasOwnProperty('showMaximizedButton'), true);

               StackController.elementMaximized(itemConfig, {}, false);
               assert.equal(itemConfig.popupOptions.maximized, false);
               assert.equal(itemConfig.popupOptions.templateOptions.maximized, false);
               let position = Stack.getPosition({ top: 0, right: 0 }, itemConfig);
               assert.equal(position.width, popupOptions.minimizedWidth);

               StackController.elementMaximized(itemConfig, {}, true);
               assert.equal(itemConfig.popupOptions.maximized, true);
               assert.equal(itemConfig.popupOptions.templateOptions.maximized, true);
               position = Stack.getPosition({ top: 0, right: 0 }, itemConfig);
               assert.equal(position.width, popupOptions.maxWidth);

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
               StackController._update = () => {}; // Этот метод зовет получение размеров окна, для этих тестов не нужно
               StackController._private.prepareSizes = () => {}; // Этот метод зовет получение размеров окна, для этих тестов не нужно
               StackController._private.getWindowSize = () => ({ width: 1920, height: 950 }); // Этот метод зовет получение размеров окна, для этих тестов не нужно

               StackController._elementCreated(itemConfig, {});

               // Зависит от того где запускаем тесты, под нодой или в браузере
               assert.isTrue(itemConfig.popupState === BaseController.POPUP_STATE_CREATED || itemConfig.popupState === BaseController.POPUP_STATE_CREATING);

               StackController.elementAnimated(itemConfig);
               assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_CREATED);

               itemConfig.popupOptions.className = '';
               StackController._elementUpdated(itemConfig, {});
               StackController._elementUpdated(itemConfig, {});
               StackController._elementUpdated(itemConfig, {});

               // класс обновился, потому что состояние было opened. После множ. update класс не задублировался
               assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_UPDATING);
               assert.equal(itemConfig.popupOptions.className, ' controls-Stack');

               StackController._elementAfterUpdated(itemConfig, {});
               assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_UPDATED);

               itemConfig.popupState = 'notOpened';
               itemConfig.popupOptions.className = '';
               StackController._elementUpdated(itemConfig, {});

               // класс не обновился, потому что состояние не opened
               assert.equal(itemConfig.popupOptions.className, '');

               StackController._elementDestroyed(itemConfig, {});

               // Зависит от того где запускаем тесты, под нодой или в браузере
               assert.isTrue(itemConfig.popupState === BaseController.POPUP_STATE_DESTROYING || itemConfig.popupState === BaseController.POPUP_STATE_DESTROYED);

               itemConfig._destroyDeferred.addCallback(function() {
                  assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_DESTROYED);
               });
               StackController.elementAnimated(itemConfig, {});
            });

            it('stack from target container', function() {
               var position = Stack.getPosition({ top: 100, right: 100 }, item);
               assert.equal(position.width, item.popupOptions.maxWidth);
               assert.isTrue(position.top === 100);
               assert.isTrue(position.right === 100);
               assert.isTrue(position.bottom === 0);
            });
            it('stack without config sizes', function() {
               Stack.getMaxPanelWidth = () => 1000;
               let item = {
                  popupOptions: {},
                  containerWidth: 800
               };
               var position = Stack.getPosition({ top: 0, right: 0 }, item);
               assert.equal(position.width, undefined);
               assert.isTrue(position.top === 0);
               assert.isTrue(position.right === 0);
               assert.isTrue(position.bottom === 0);

               item.containerWidth = 1200;
               position = Stack.getPosition({ top: 0, right: 0 }, item);
               assert.equal(position.width, Stack.getMaxPanelWidth());
            });

            it('stack with wrong options type', function() {
               let item = {
                  popupOptions: {
                     minWidth: '600',
                     maxWidth: '800'
                  }
               };
               var position = Stack.getPosition({ top: 0, right: 0 }, item);
               assert.equal(position.width, parseInt(item.popupOptions.maxWidth, 10));
            });

            it('stack reduced width', function() {
               Stack.getMaxPanelWidth = () => 1000;
               let item = {
                  popupOptions: {
                     minWidth: 600,
                     maxWidth: 1800
                  }
               };
               var position = Stack.getPosition({ top: 0, right: 0 }, item);
               assert.isTrue(position.width === Stack.getMaxPanelWidth());
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
               var position = Stack.getPosition({ top: 0, right: 400 }, item);
               assert.equal(position.width, item.popupOptions.minWidth);
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
