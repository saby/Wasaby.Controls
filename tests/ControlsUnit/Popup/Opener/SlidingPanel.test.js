define(
   [
      'Controls/popupSliding',
      'Controls/_popupSliding/Strategy',
      'Controls/popup'
   ],
   (popupSliding, Strategy, popupLib) => {
      'use strict';
      var SlidingPanelStrategy = Strategy.default;
      var Controller = popupSliding.Controller;
      var PopupController = popupLib.Controller;
      var getPopupItem = () => {
         return {
            id: 'randomId',
            popupOptions: {
               position: 'bottom',
               slidingPanelSizes: {
                  minHeight: 400,
                  maxHeight: 800
               }
            }
         };
      };

      describe('Controls/popupSliding', () => {
         describe('Strategy', () => {
            it('default case', () => {
               const item = getPopupItem();
               const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
               SlidingPanelStrategy.getWindowHeight = () => 900;
               const position = SlidingPanelStrategy.getPosition(item);

               assert.deepEqual(position, {
                  left: 0,
                  right: 0,
                  bottom: -400,
                  maxHeight: 800,
                  minHeight: 400,
                  height: 400,
                  position: 'fixed'
               });

               SlidingPanelStrategy.getWindowHeight = getWindowHeight;
            });
            it('with initial position', () => {
               const item = getPopupItem();
               item.position = {
                  bottom: 0,
                  height: 500
               };
               const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
               SlidingPanelStrategy.getWindowHeight = () => 900;
               const position = SlidingPanelStrategy.getPosition(item);

               assert.equal(position.height, item.position.height);
               assert.equal(position.bottom, 0);

               SlidingPanelStrategy.getWindowHeight = getWindowHeight;
            });
            describe('check overflow', () => {
               it('window height < minHeight', () => {
                  const item = getPopupItem();
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  const heightForOverflow = 300;
                  SlidingPanelStrategy.getWindowHeight = () => heightForOverflow;
                  const position = SlidingPanelStrategy.getPosition(item);

                  assert.equal(position.height, heightForOverflow);
                  assert.equal(position.minHeight, heightForOverflow);
                  assert.equal(position.maxHeight, heightForOverflow);
                  assert.equal(position.bottom, -heightForOverflow);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
               it('minHeight < window height < maxHeight', () => {
                  const item = getPopupItem();
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  const heightForOverflow = 500;
                  SlidingPanelStrategy.getWindowHeight = () => heightForOverflow;
                  const position = SlidingPanelStrategy.getPosition(item);

                  assert.equal(position.height, 400);
                  assert.equal(position.minHeight, 400);
                  assert.equal(position.maxHeight, heightForOverflow);
                  assert.equal(position.bottom, -400);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
            });
            describe('position', () => {
               it('bottom', () => {
                  const item = getPopupItem();
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;
                  item.popupOptions.position = 'bottom';
                  const position = SlidingPanelStrategy.getPosition(item);

                  assert.equal(position.bottom, -400);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
               it('bottom', () => {
                  const item = getPopupItem();
                  item.popupOptions.position = 'top';
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;
                  const position = SlidingPanelStrategy.getPosition(item);

                  assert.equal(position.top, -400);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
            });
         });
         describe('Controller', () => {
            describe('elementCreated', () => {
               it('position bottom', () => {
                  const item = getPopupItem();
                  item.popupOptions.position = 'bottom';
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;
                  const position = SlidingPanelStrategy.getPosition(item);
                  item.position = position;

                  assert.equal(item.position.bottom, -400);

                  const result = Controller.elementCreated(item, {});

                  assert.equal(item.position.bottom, 0);
                  assert.equal(result, true);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
               it('position top', () => {
                  const item = getPopupItem();
                  item.popupOptions.position = 'top';
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;
                  item.position = SlidingPanelStrategy.getPosition(item);

                  assert.equal(item.position.top, -400);

                  const result = Controller.elementCreated(item, {});

                  assert.equal(item.position.top, 0);
                  assert.equal(result, true);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
            });
            it('elementUpdated', () => {
               const item = getPopupItem();
               const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
               SlidingPanelStrategy.getWindowHeight = () => 900;
               item.position = SlidingPanelStrategy.getPosition(item);
               item.position.height = 500;

               SlidingPanelStrategy.getWindowHeight = () => 400;

               const result = Controller.elementUpdated(item, {});

               assert.equal(result, true);
               assert.equal(item.position.height, 400);
               assert.equal(item.position.maxHeight, 400);

               SlidingPanelStrategy.getWindowHeight = getWindowHeight;
            });
            it('elementDestroyed + elementAnimated', (resolve) => {
               const item = getPopupItem();
               const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
               SlidingPanelStrategy.getWindowHeight = () => 900;
               item.position = SlidingPanelStrategy.getPosition(item);
               let destroyedPromiseResolved = false;

               const result = Controller.elementDestroyed(item);

               assert.equal(result instanceof Promise, true);

               Controller.elementAnimated(item);
               SlidingPanelStrategy.getWindowHeight = getWindowHeight;

               const timeoutId = setTimeout(() => {
                  assert.equal(destroyedPromiseResolved, true);
                  resolve();
               }, 200);

               result.then(() => {
                  destroyedPromiseResolved = true;
                  assert.equal(destroyedPromiseResolved, true);
                  clearTimeout(timeoutId);
                  resolve();
               });
            });
            describe('getDefaultConfig', () => {
               it('postion bottom', () => {
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;

                  const item = getPopupItem();
                  item.popupOptions.position = 'bottom';
                  const position = SlidingPanelStrategy.getPosition(item);
                  Controller.getDefaultConfig(item);

                  assert.equal(item.popupOptions.className.includes('controls-SlidingPanel__animation-position-bottom'), true);
                  assert.deepEqual(item.popupOptions.slidingPanelPosition, {
                     minHeight: item.position.minHeight,
                     maxHeight: item.position.maxHeight,
                     height: item.position.height,
                     position: item.popupOptions.position
                  });
                  assert.equal(item.popupOptions.hasOwnProperty('content'), true);
                  assert.deepEqual(item.position, position);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });

               it('postion top', () => {
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;

                  const item = getPopupItem();
                  item.popupOptions.position = 'top';
                  const position = SlidingPanelStrategy.getPosition(item);
                  Controller.getDefaultConfig(item);

                  assert.equal(
                     item.popupOptions.className.includes('controls-SlidingPanel__animation-position-top'),
                     true
                  );
                  assert.deepEqual(item.popupOptions.slidingPanelPosition, {
                     minHeight: item.position.minHeight,
                     maxHeight: item.position.maxHeight,
                     height: item.position.height,
                     position: item.popupOptions.position
                  });
                  assert.equal(item.popupOptions.hasOwnProperty('content'), true);
                  assert.deepEqual(item.position, position);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
            });
            describe('popupDragStart', () => {
               it('position bottom', () => {
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;

                  const item = getPopupItem();
                  item.popupOptions.position = 'bottom';
                  item.position = SlidingPanelStrategy.getPosition(item);
                  item.position.height = item.position.height + 100;
                  const startHeight = item.position.height;

                  Controller.popupDragStart(item, {}, {
                     x: 0,
                     y: 10
                  });
                  Controller.popupDragEnd(item);
                  assert.equal(item.position.height, startHeight - 10);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });

               it('position top', () => {
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;

                  const item = getPopupItem();
                  item.popupOptions.position = 'top';
                  item.position = SlidingPanelStrategy.getPosition(item);
                  item.position.height = item.position.height + 100;
                  const startHeight = item.position.height;

                  Controller.popupDragStart(item, {}, {
                     x: 0, y: 10
                  });
                  Controller.popupDragEnd(item);
                  assert.equal(item.position.height, startHeight + 10);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
               it('double drag', () => {
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;

                  const item = getPopupItem();
                  item.popupOptions.position = 'bottom';
                  item.position = SlidingPanelStrategy.getPosition(item);
                  item.position.height = item.position.height + 100;
                  const startHeight = item.position.height;

                  Controller.popupDragStart(item, {}, {
                     x: 0,
                     y: 10
                  });
                  Controller.popupDragStart(item, {}, {
                     x: 0,
                     y: -20
                  });
                  Controller.popupDragEnd(item);
                  assert.equal(item.position.height, startHeight + 20);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
               it('overflow max', () => {
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;

                  const item = getPopupItem();
                  item.position = SlidingPanelStrategy.getPosition(item);
                  item.position.height = item.position.height + 100;

                  Controller.popupDragStart(item, {}, {
                     x: 0, y: -10000
                  });
                  Controller.popupDragEnd(item);
                  assert.equal(item.position.height, item.position.maxHeight);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
               it('overflow min', () => {
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;

                  const item = getPopupItem();
                  item.position = SlidingPanelStrategy.getPosition(item);
                  item.position.height = item.position.height + 100;

                  Controller.popupDragStart(item, {}, {
                     x: 0, y: 10000
                  });
                  Controller.popupDragEnd(item);
                  assert.equal(item.position.height, item.position.minHeight);

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
               it('close by drag', () => {
                  const getWindowHeight = SlidingPanelStrategy.getWindowHeight;
                  SlidingPanelStrategy.getWindowHeight = () => 900;

                  const item = getPopupItem();
                  const removePopup = PopupController.remove;
                  let popupRemoved = false;
                  PopupController.remove = (popupId) => {
                     popupRemoved = popupId === item.id;
                  };
                  item.position = SlidingPanelStrategy.getPosition(item);

                  Controller.popupDragStart(item, {}, {
                     x: 0, y: 10
                  });
                  Controller.popupDragEnd(item);
                  assert.equal(popupRemoved, true);

                  PopupController.remove = removePopup;

                  SlidingPanelStrategy.getWindowHeight = getWindowHeight;
               });
            });
         });
      });
   }
);
