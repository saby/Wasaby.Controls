define(
   [
      'Controls/Popup/Opener/Sticky/StickyStrategy',
      'Controls/Popup/Opener/Sticky/StickyController',
      'Controls/Popup/Manager/ManagerController'
   ],
   (StickyStrategy, StickyController, ManagerController) => {
      'use strict';

      describe('Controls/Popup/Opener/Sticky', () => {
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

         StickyStrategy._private.getWindowSizes = () => ({
            width: 1920,
            height: 1040
         });

         function getPositionConfig() {
            return {
               revertPositionStyle: true,
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
                     side: 'right',
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
            };
         }

         it('Simple sticky', () => {
            var position = StickyStrategy.getPosition({
               corner: {
                  vertical: 'bottom',
                  horizontal: 'right'
               },
               align: {
                  vertical: {
                     side: 'bottom',
                     offset: 20
                  },
                  horizontal: {
                     side: 'right',
                     offset: 25
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
            assert.isTrue(position.top === 420);
            assert.isTrue(position.left === 425);
         });

         it('Sticky position fixed', () => {
            var position = StickyStrategy.getPosition({
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
                  height: 700,
                  margins: {
                     top: 0,
                     left: 0
                  }
               },
               locationStrategy: 'fixed'
            }, targetCoords);
            assert.equal(position.top, 400);
            assert.equal(position.left, 400);
            assert.equal(position.height, 640);
         });

         it('Centered sticky', () => {
            var position = StickyStrategy.getPosition({
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

         it('Sticky with offset', () => {
            var position = StickyStrategy.getPosition({
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

         it('Sticky with offset on margins', () => {
            var position = StickyStrategy.getPosition({
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

         it('Sticky with inverting', () => {
            var position = StickyStrategy.getPosition({
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
            StickyController._private.isTargetVisible = () => true;
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
                  horizontalAlign: {
                     side: 'right'
                  },
                  verticalAlign: {
                     side: 'bottom'
                  },
                  target: {
                     getBoundingClientRect: () => {
                        return {
                           bottom: 201,
                           height: 1,
                           left: 200,
                           right: 0,
                           top: 200,
                           width: 1,
                           x: 200,
                           y: 200
                        };
                     },
                     children: []
                  }
               }
            };
            let sizes = {
               margins: { left: 0, top: 0 },
               width: 100,
               height: 100
            };
            let stickyPosition = {
               corner: { vertical: 'top', horizontal: 'left' },
               horizontalAlign: { side: 'right', offset: 0 },
               verticalAlign: { side: 'bottom', offset: 0 }
            };
            StickyController._private.prepareConfig(StickyController, itemConfig, sizes);
            assert.deepEqual(itemConfig.popupOptions.stickyPosition, stickyPosition);
         });

         it('Sticky initializing state', () => {
            let itemConfig = {
               popupState: StickyController.POPUP_STATE_INITIALIZING
            };
            let destroyDef = StickyController._elementDestroyed(itemConfig);
            assert.equal(destroyDef.isReady(), true);
         });

         it('Sticky updated classes', () => {
            StickyController._private.isTargetVisible = () => true;
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

         it('Sticky check visible target on elementCreated', () => {
            StickyController._private.isTargetVisible = () => false;
            let isRemoveCalled = false;
            let ManagerControllerRemove = ManagerController.remove;
            ManagerController.remove = () => {
               isRemoveCalled = true;
            };
            StickyController.elementCreated({});
            assert.equal(isRemoveCalled, true);

            ManagerController.remove = ManagerControllerRemove;
            StickyController._private.isTargetVisible = () => true;
         });

         it('Sticky with option locationStrategy=fixed', () => {
            var position = StickyStrategy.getPosition({
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

         it('Sticky with option locationStrategy=overflow', () => {
            let left = 1700;
            let right = 1900;
            let targetC = {...targetCoords, left, right};

            var position = StickyStrategy.getPosition({
               locationStrategy: 'overflow',
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
                     side: 'right',
                     offset: 0
                  }
               },
               config: {},
               sizes: {
                  width: 400,
                  height: 400,
                  margins: {
                     top: 0,
                     left: 10
                  }
               }
            }, targetC);

            assert.equal(position.top, 0);
            assert.equal(position.left, 1520);
         });

         it ('Sticky [new position]', () => {
            StickyStrategy._private.getWindowSizes = () => ({
               width: 1000,
               height: 1000
            });
            let cfg = getPositionConfig();

            // 1 position
            let position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.left, 200);
            assert.equal(position.bottom, 800);
            assert.equal(Object.keys(position).length, 2);

            // 2 position
            cfg = getPositionConfig();
            cfg.corner.horizontal = 'right';
            cfg.align.vertical.side = 'bottom';


            position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.left, 400);
            assert.equal(position.top, 200);
            assert.equal(Object.keys(position).length, 2);

            // 3 position
            cfg = getPositionConfig();
            cfg.corner.horizontal = 'right';
            cfg.corner.vertical = 'bottom';
            cfg.align.vertical.side = 'bottom';
            cfg.align.horizontal.side = 'left';

            position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.right, 600);
            assert.equal(position.top, 400);
            assert.equal(Object.keys(position).length, 2);

            // 4 position
            cfg = getPositionConfig();
            cfg.corner.horizontal = 'left';
            cfg.corner.vertical = 'bottom';
            cfg.align.vertical.side = 'top';
            cfg.align.horizontal.side = 'left';

            position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.right, 800);
            assert.equal(position.bottom, 600);
            assert.equal(Object.keys(position).length, 2);
         });

         it ('Sticky [new position] with body scroll', () => {
            StickyStrategy._private.getWindowSizes = () => ({
               width: 1000,
               height: 1000
            });
            var targetC = {
               top: 400,
               left: 400,
               bottom: 410,
               right: 410,
               width: 10,
               height: 10,
               leftScroll: 50
            };

            // 3 position
            let cfg = getPositionConfig();
            cfg.corner.horizontal = 'right';
            cfg.corner.vertical = 'bottom';
            cfg.align.vertical.side = 'bottom';
            cfg.align.horizontal.side = 'left';
            let position = StickyStrategy.getPosition(cfg, targetC);
            assert.equal(position.top, 410);
            assert.equal(position.right, 640);
            assert.equal(Object.keys(position).length, 2);
         });


         it ('Sticky [new position] with margins', () => {
            StickyStrategy._private.getWindowSizes = () => ({
               width: 1000,
               height: 1000
            });
            let cfg = getPositionConfig();
            cfg.corner.horizontal = 'right';
            cfg.align.vertical.side = 'bottom';
            cfg.sizes.margins.top = 10;
            cfg.sizes.margins.left = 10;

            let position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.left, 410);
            assert.equal(position.top, 210);
            assert.equal(Object.keys(position).length, 2);

            cfg = getPositionConfig();
            cfg.corner.horizontal = 'left';
            cfg.corner.vertical = 'bottom';
            cfg.align.vertical.side = 'top';
            cfg.align.horizontal.side = 'left';
            cfg.sizes.margins.top = 10;
            cfg.sizes.margins.left = 10;
            cfg.sizes.width = 100;
            cfg.sizes.height = 100;

            position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.right, 810);
            assert.equal(position.bottom, 610);
            assert.equal(Object.keys(position).length, 2);
         });

         it ('Sticky [new position] revert position', () => {
            let cfg = getPositionConfig();
            cfg.sizes.height = 400;
            let position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.left, 200);
            assert.equal(position.top, 400);
            assert.equal(Object.keys(position).length, 2);

            cfg = getPositionConfig();
            cfg.sizes.width = 400;
            cfg.corner.horizontal = 'left';
            cfg.corner.vertical = 'bottom';
            cfg.align.vertical.side = 'top';
            cfg.align.horizontal.side = 'left';
            targetCoords.topScroll = 10;

            StickyStrategy._private.getTopScroll = () => targetCoords.topScroll;

            position = StickyStrategy.getPosition(cfg, targetCoords);
            targetCoords.topScroll = 0;
            assert.equal(position.left, 400);
            assert.equal(position.bottom, 620);
            assert.equal(Object.keys(position).length, 2);
         });

         it ('Sticky [new position] location strategy fixed', () => {
            StickyStrategy._private.getWindowSizes = () => ({
               width: 1000,
               height: 1000
            });
            let cfg = getPositionConfig();
            cfg.locationStrategy = 'fixed';
            cfg.sizes.height = 400;
            let position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.left, 200);
            assert.equal(position.bottom, 800);
            assert.equal(position.height, 200);
            assert.equal(Object.keys(position).length, 3);

            cfg = getPositionConfig();
            cfg.locationStrategy = 'fixed';
            cfg.sizes.width = 400;
            cfg.corner.horizontal = 'left';
            cfg.corner.vertical = 'bottom';
            cfg.align.vertical.side = 'top';
            cfg.align.horizontal.side = 'left';

            position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.right, 800);
            assert.equal(position.bottom, 600);
            assert.equal(position.width, 200);
            assert.equal(Object.keys(position).length, 3);
         });
      });
   }
);
