define(
   [
      'Controls/Popup/Opener/Stack/StackStrategy',
      'Controls/popup',
      'Controls/popupTemplate',
      'Controls-demo/Popup/TestMaximizedStack',
      'Controls/Popup/Opener/BaseController',
      'wml!Controls/_popupTemplate/Stack/Opener/StackContent'
   ],
   (StackStrategy, popupMod, popupTemplate, TestMaximizedStack, BaseController, StackContent) => {
      'use strict';

      describe('Controls/Popup/Opener/Stack', () => {
         StackStrategy.getMaxPanelWidth = () => 1000;
         let item = {
            popupOptions: {
               minWidth: 600,
               maxWidth: 800
            }
         };

         it('Opener: getConfig', () => {
            let getStackConfig = popupMod.Stack._private.getStackConfig;
            let config = getStackConfig();
            assert.equal(config.isDefaultOpener, true);

            config = getStackConfig({ isDefaultOpener: false });
            assert.equal(config.isDefaultOpener, false);
         });

         it('stack with config sizes', () => {
            var position = StackStrategy.getPosition({ top: 0, right: 0 }, item);
            assert.isTrue(position.stackMaxWidth === item.popupOptions.maxWidth);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 0);
            assert.isTrue(position.bottom === 0);
            assert.isTrue(position.position === 'fixed');
         });

         it('stack shadow', () => {
            let baseGetItemPosition = popupTemplate.StackController._private.getItemPosition;
            popupTemplate.StackController._private.getItemPosition = items => (items.position);
            popupTemplate.StackController._stack.add({ position: { stackWidth: 720 }, popupOptions: { stackClassName: '' } });
            popupTemplate.StackController._stack.add({ containerWidth: 600, popupOptions: { stackClassName: '' } });
            popupTemplate.StackController._stack.add({ position: { stackWidth: 600 }, popupOptions: { stackClassName: '' } });
            popupTemplate.StackController._stack.add({ position: { stackWidth: 1000 }, popupOptions: { stackClassName: '' } });
            popupTemplate.StackController._stack.add({ position: { stackWidth: 840 }, popupOptions: { stackClassName: '' } });
            popupTemplate.StackController._stack.add({ containerWidth: 600, popupOptions: { stackClassName: '' } });
            popupTemplate.StackController._stack.add({ containerWidth: 720, popupOptions: { stackClassName: '' } });
            popupTemplate.StackController._stack.add({ containerWidth: 200, popupState: 'destroying', popupOptions: { stackClassName: '' } });
            popupTemplate.StackController._stack.add({ containerWidth: 200, popupOptions: { stackClassName: '' } });
            popupTemplate.StackController._update();
            popupTemplate.StackController._update();
            popupTemplate.StackController._update();
            assert.isTrue(popupTemplate.StackController._stack.at(0).popupOptions.stackClassName.indexOf('controls-Stack__shadow') >= 0);
            assert.isTrue(popupTemplate.StackController._stack.at(1).popupOptions.stackClassName.indexOf('controls-Stack__shadow') >= 0);
            assert.isTrue(popupTemplate.StackController._stack.at(2).popupOptions.stackClassName.indexOf('controls-Stack__shadow') < 0);
            assert.isTrue(popupTemplate.StackController._stack.at(3).popupOptions.stackClassName.indexOf('controls-Stack__shadow') >= 0);
            assert.isTrue(popupTemplate.StackController._stack.at(4).popupOptions.stackClassName.indexOf('controls-Stack__shadow') >= 0);
            assert.isTrue(popupTemplate.StackController._stack.at(5).popupOptions.stackClassName.indexOf('controls-Stack__shadow') >= 0);
            assert.isTrue(popupTemplate.StackController._stack.at(6).popupOptions.stackClassName.indexOf('controls-Stack__shadow') >= 0);
            assert.isTrue(popupTemplate.StackController._stack.at(7).popupOptions.stackClassName.indexOf('controls-Stack__shadow') < 0);
            assert.isTrue(popupTemplate.StackController._stack.at(8).popupOptions.stackClassName.indexOf('controls-Stack__shadow') >= 0);

            popupTemplate.StackController._private.getItemPosition = baseGetItemPosition;
         });


         it('stack default position', () => {
            popupTemplate.StackController._private.getWindowSize = () => ({ width: 1920, height: 950 }); // Этот метод зовет получение размеров окна, для этих тестов не нужно
            popupTemplate.StackController._private.getStackParentCoords = () => ({ top: 0, right: 0 }); // Этот метод зовет получение размеров окна, для этих тестов не нужно
            let itemConfig = {
               popupOptions: item.popupOptions
            };
            itemConfig.popupOptions.template = TestMaximizedStack;
            itemConfig.popupOptions.minimizedWidth = undefined;
            popupTemplate.StackController.getDefaultConfig(itemConfig);
            assert.equal(itemConfig.position.top, 0);
            assert.equal(itemConfig.position.right, 0);
            assert.equal(itemConfig.position.stackWidth, 800);
            assert.equal(itemConfig.position.bottom, 0);
            assert.equal(itemConfig.popupOptions.content, StackContent);
         });

         it('stack maximized popup position', () => {
            let item = {
               popupOptions: {
                  minWidth: 600,
                  maxWidth: 800
               },
               hasMaximizePopup: true
            };
            let position = StackStrategy.getPosition({ top: 0, right: 100 }, item);
            assert.equal(position.right, 0);
         });

         it('stack maximized default options', () => {
            let itemConfig = {
               popupOptions: {
                  templateOptions: {},
                  template: TestMaximizedStack
               }
            };
            popupTemplate.StackController.getDefaultConfig(itemConfig);
            assert.equal(itemConfig.popupOptions.stackMinWidth, 500);
            assert.equal(itemConfig.popupOptions.stackMaxWidth, 1000);
            assert.equal(itemConfig.popupOptions.stackWidth, 800);

            itemConfig = {
               popupOptions: {
                  minWidth: 600,
                  maxWidth: 900,
                  templateOptions: {},
                  template: TestMaximizedStack
               }
            };
            popupTemplate.StackController.getDefaultConfig(itemConfig);
            assert.equal(itemConfig.popupOptions.stackMinWidth, 600);
            assert.equal(itemConfig.popupOptions.stackMaxWidth, 900);
            assert.equal(itemConfig.popupOptions.stackWidth, 800);
         });

         it('stack panel maximized', () => {
            popupTemplate.StackController._update = () => {}; // Этот метод зовет получение размеров окна, для этих тестов не нужно
            popupTemplate.StackController._private.prepareSizes = () => {}; // Этот метод зовет получение размеров окна, для этих тестов не нужно
            popupTemplate.StackController._private.getWindowSize = () => ({ width: 1920, height: 950 }); // Этот метод зовет получение размеров окна, для этих тестов не нужно

            let popupOptions = {
               minimizedWidth: 600,
               minWidth: 900,
               maxWidth: 1200,
               templateOptions: {}
            };
            let itemConfig = {
               popupOptions: popupOptions
            };

            StackStrategy.getMaxPanelWidth = () => 1600;

            assert.equal(StackStrategy.isMaximizedPanel(itemConfig), true);

            itemConfig.popupOptions.template = TestMaximizedStack;
            popupTemplate.StackController.getDefaultConfig(itemConfig);
            assert.equal(itemConfig.popupOptions.maximized, false); // default value
            assert.equal(itemConfig.popupOptions.templateOptions.hasOwnProperty('showMaximizedButton'), true);

            popupTemplate.StackController.elementMaximized(itemConfig, {}, false);
            assert.equal(itemConfig.popupOptions.maximized, false);
            assert.equal(itemConfig.popupOptions.templateOptions.maximized, false);
            let position = StackStrategy.getPosition({ top: 0, right: 0 }, itemConfig);
            assert.equal(position.stackWidth, popupOptions.minimizedWidth);

            popupTemplate.StackController.elementMaximized(itemConfig, {}, true);
            assert.equal(itemConfig.popupOptions.maximized, true);
            assert.equal(itemConfig.popupOptions.templateOptions.maximized, true);
            position = StackStrategy.getPosition({ top: 0, right: 0 }, itemConfig);
            assert.equal(position.stackMaxWidth, popupOptions.maxWidth);

            popupTemplate.StackController._private.prepareMaximizedState(1600, itemConfig);
            assert.equal(itemConfig.popupOptions.templateOptions.showMaximizedButton, true);

            popupTemplate.StackController._private.prepareMaximizedState(800, itemConfig);
            assert.equal(itemConfig.popupOptions.templateOptions.showMaximizedButton, false);
            delete itemConfig.popupOptions.width;
         });

         it('stack state', () => {
            let itemConfig = {
               id: '22',
               popupOptions: item.popupOptions
            };
            popupTemplate.StackController._update = () => {}; // Этот метод зовет получение размеров окна, для этих тестов не нужно
            popupTemplate.StackController._private.prepareSizes = () => {}; // Этот метод зовет получение размеров окна, для этих тестов не нужно
            popupTemplate.StackController._private.getWindowSize = () => ({ width: 1920, height: 950 }); // Этот метод зовет получение размеров окна, для этих тестов не нужно

            popupTemplate.StackController._elementCreated(itemConfig, {});

            // Зависит от того где запускаем тесты, под нодой или в браузере
            assert.isTrue(itemConfig.popupState === BaseController.POPUP_STATE_CREATED || itemConfig.popupState === BaseController.POPUP_STATE_CREATING);

            popupTemplate.StackController.elementAnimated(itemConfig);
            assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_CREATED);

            itemConfig.popupOptions.className = '';
            popupTemplate.StackController._elementUpdated(itemConfig, {});
            popupTemplate.StackController._elementUpdated(itemConfig, {});
            popupTemplate.StackController._elementUpdated(itemConfig, {});

            // класс обновился, потому что состояние было opened. После множ. update класс не задублировался
            assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_UPDATING);
            assert.equal(itemConfig.popupOptions.className, ' controls-Stack');

            popupTemplate.StackController._elementAfterUpdated(itemConfig, {});
            assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_UPDATED);

            itemConfig.popupState = 'notOpened';
            itemConfig.popupOptions.className = '';
            popupTemplate.StackController._elementUpdated(itemConfig, {});

            // класс не обновился, потому что состояние не opened
            assert.equal(itemConfig.popupOptions.className, '');

            popupTemplate.StackController._elementDestroyed(itemConfig, {});

            // Зависит от того где запускаем тесты, под нодой или в браузере
            assert.isTrue(itemConfig.popupState === BaseController.POPUP_STATE_DESTROYING || itemConfig.popupState === BaseController.POPUP_STATE_DESTROYED);

            itemConfig._destroyDeferred.addCallback(function() {
               assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_DESTROYED);
            });
            popupTemplate.StackController.elementAnimated(itemConfig, {});
         });

         it('stack from target container', () => {
            var position = StackStrategy.getPosition({ top: 100, right: 100 }, item);
            assert.equal(position.stackMaxWidth, item.popupOptions.maxWidth);
            assert.isTrue(position.top === 100);
            assert.isTrue(position.right === 100);
            assert.isTrue(position.bottom === 0);
         });
         it('stack without config sizes', () => {
            StackStrategy.getMaxPanelWidth = () => 1000;
            let item = {
               popupOptions: {},
               containerWidth: 800
            };
            var position = StackStrategy.getPosition({ top: 0, right: 0 }, item);
            assert.equal(position.stackWidth, undefined);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 0);
            assert.isTrue(position.bottom === 0);

            item.containerWidth = 1200;
            position = StackStrategy.getPosition({ top: 0, right: 0 }, item);
            assert.equal(position.stackWidth, undefined);
         });

         it('stack with wrong options type', () => {
            let item = {
               popupOptions: {
                  minWidth: '600',
                  maxWidth: '800'
               }
            };
            var position = StackStrategy.getPosition({ top: 0, right: 0 }, item);
            assert.equal(position.stackMaxWidth, parseInt(item.popupOptions.maxWidth, 10));
         });

         it('stack reduced width', () => {
            StackStrategy.getMaxPanelWidth = () => 1000;
            let item = {
               popupOptions: {
                  minWidth: 600,
                  maxWidth: 1800
               }
            };
            var position = StackStrategy.getPosition({ top: 0, right: 0 }, item);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 0);
            assert.isTrue(position.bottom === 0);
         });

         it('stack reset offset', () => {
            let item = {
               popupOptions: {
                  minWidth: 800,
                  maxWidth: 1800
               }
            };
            var position = StackStrategy.getPosition({ top: 0, right: 400 }, item);
            assert.equal(position.stackWidth, item.popupOptions.minWidth);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 0);
            assert.isTrue(position.bottom === 0);
         });

         it('stack width', () => {
            let item = {
               popupOptions: {
                  minWidth: 800,
                  width: 900,
                  maxWidth: 1200
               }
            };
            let position = StackStrategy.getPosition({ top: 0, right: 400 }, item);
            assert.equal(position.stackWidth, 900);

            item.popupOptions.width = 1200;
            position = StackStrategy.getPosition({ top: 0, right: 400 }, item);
            assert.equal(position.stackMaxWidth, 1000); //В тесте getMaxPanelWidth === 1000
            assert.equal(position.stackWidth, 1000);
         });

         it('stack compatible popup', () => {
            let item = {
               popupOptions: {
                  template: {},
                  minWidth: 800,
                  maxWidth: 900,
                  isCompoundTemplate: true
               }
            };
            popupTemplate.StackController.getDefaultConfig(item);
            assert.equal(item.position.top, -10000);
            assert.equal(item.position.left, -10000);

            let targetPos = {
               top: 0,
               right: 0
            };

            popupTemplate.StackController._private.getStackParentCoords = () => targetPos;

            popupTemplate.StackController.elementCreated(item);
            assert.equal(item.position.stackWidth, undefined);
         });
      });
   }
);
