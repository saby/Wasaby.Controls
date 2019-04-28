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


         it('Sticky with option fittingMode=overflow', () => {
            let left = 1700;
            let right = 1900;
            let top = 800;
            let bottom = 1000;
            let targetC = {
               ...targetCoords, left, right, top, bottom
            };

            var position = StickyStrategy.getPosition({
               fittingMode: 'overflow',
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

            assert.equal(position.top, 640);
            assert.equal(position.left, 1520);
         });

         it('Sticky position', () => {
            StickyStrategy._private.getWindowSizes = () => ({
               width: 1000,
               height: 1000
            });
            let cfg = getPositionConfig();

            // 1 position
            let position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.left, 200);
            assert.equal(position.bottom, 800);
            assert.equal(Object.keys(position).length, 4);

            // 2 position
            cfg = getPositionConfig();
            cfg.corner.horizontal = 'right';
            cfg.align.vertical.side = 'bottom';


            position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.left, 400);
            assert.equal(position.top, 200);
            assert.equal(Object.keys(position).length, 4);

            // 3 position
            cfg = getPositionConfig();
            cfg.corner.horizontal = 'right';
            cfg.corner.vertical = 'bottom';
            cfg.align.vertical.side = 'bottom';
            cfg.align.horizontal.side = 'left';

            position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.right, 600);
            assert.equal(position.top, 400);
            assert.equal(Object.keys(position).length, 4);

            // 4 position
            cfg = getPositionConfig();
            cfg.corner.horizontal = 'left';
            cfg.corner.vertical = 'bottom';
            cfg.align.vertical.side = 'top';
            cfg.align.horizontal.side = 'left';

            position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.right, 800);
            assert.equal(position.bottom, 600);
            assert.equal(Object.keys(position).length, 4);
         });

         it('Sticky with body scroll', () => {
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
            assert.equal(Object.keys(position).length, 4);
         });


         it('Sticky with margins', () => {
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
            assert.equal(Object.keys(position).length, 4);

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
            assert.equal(position.right, 790);
            assert.equal(position.bottom, 590);
            assert.equal(Object.keys(position).length, 4);
         });

         it('Sticky revert position', () => {
            let cfg = getPositionConfig();
            cfg.sizes.height = 400;
            let position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.left, 200);
            assert.equal(position.top, 400);
            assert.equal(Object.keys(position).length, 4);

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
            assert.equal(Object.keys(position).length, 4);
         });

         it('Sticky fittingMode fixed', () => {
            StickyStrategy._private.getWindowSizes = () => ({
               width: 1000,
               height: 1000
            });
            let cfg = getPositionConfig();
            cfg.fittingMode = 'fixed';
            cfg.sizes.height = 400;
            let position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.left, 200);
            assert.equal(position.bottom, 800);
            assert.equal(position.height, 200);
            assert.equal(Object.keys(position).length, 5);

            cfg = getPositionConfig();
            cfg.fittingMode = 'fixed';
            cfg.sizes.width = 400;
            cfg.corner.horizontal = 'left';
            cfg.corner.vertical = 'bottom';
            cfg.align.vertical.side = 'top';
            cfg.align.horizontal.side = 'left';

            position = StickyStrategy.getPosition(cfg, targetCoords);
            assert.equal(position.right, 800);
            assert.equal(position.bottom, 600);
            assert.equal(position.width, 200);
            assert.equal(Object.keys(position).length, 5);
         });

         it('Sticky check overflow', () => {
            let popupCfg = { ...getPositionConfig() };
            let position = { right: 0 };
            let overflow = StickyStrategy._private.checkOverflow(popupCfg, targetCoords, position, 'horizontal');
            assert.equal(overflow, 0);
         });

         it('Sticky invert position', () => {
            let popupCfg = { ...getPositionConfig() };
            let direction = 'vertical';
            popupCfg.align.vertical.offset = 10;
            popupCfg.sizes.margins.top = 15;
            StickyStrategy._private.invertPosition(popupCfg, direction);
            assert.equal(popupCfg.corner.vertical, 'bottom');
            assert.equal(popupCfg.align.vertical.side, 'bottom');
            assert.equal(popupCfg.align.vertical.offset, -10);
            assert.equal(popupCfg.sizes.margins.top, -15);
         });

         it('Sticky fix position', () => {
            let cfg = getPositionConfig();
            cfg.corner.horizontal = 'right';
            cfg.align.vertical.side = 'bottom';
            let baseFixPosition = StickyStrategy._private.fixPosition;
            let baseCheckOverflow = StickyStrategy._private.checkOverflow;
            let i = 0;
            StickyStrategy._private.checkOverflow = () => (i++ === 0 ? 100 : -100);

            StickyStrategy._private.fixPosition = (position) => {
               if (position.bottom) { // метод вызвался, проставилась координата bottom
                  position.bottom = -10;
               }
            };

            let position = StickyStrategy._private.calculatePosition(cfg, targetCoords, 'vertical');
            assert.equal(position.bottom, -10);

            StickyStrategy._private.checkOverflow = baseCheckOverflow;
            StickyStrategy._private.fixPosition = baseFixPosition;
         });

         it('Sticky protect from wrong config', () => {
            let popupCfg = { ...getPositionConfig() };
            popupCfg.align.horizontal.offset = -50;
            let targetC = {
               top: 200,
               left: 0,
               bottom: 400,
               right: 200,
               width: 200,
               height: 200,
               leftScroll: 0,
               topScroll: 0
            };
            let position = StickyStrategy.getPosition(popupCfg, targetC);
            assert.equal(position.left, 0);
         });

         it('Centered sticky', () => {
            StickyStrategy._private.getWindowSizes = () => ({
               width: 1920,
               height: 1040
            });
            let popupCfg = { ...getPositionConfig() };
            popupCfg.align.horizontal.side = 'center';

            popupCfg.sizes.width = 100;
            popupCfg.sizes.height = 100;

            var position = StickyStrategy.getPosition(popupCfg, targetCoords);
            assert.equal(position.bottom, 840);
            assert.equal(position.left, 250);
         });
      });
   }
);
