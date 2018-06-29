define(
   [
      'Controls/Popup/Opener/Stack/StackStrategy',
      'Controls/Popup/Opener/Sticky/StickyStrategy',
      'Controls/Popup/Opener/Notification/NotificationStrategy',
      'Controls/Popup/Opener/Dialog/DialogStrategy'
   ],

   function(Stack, Sticky, Notification, Dialog) {
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

         });

         describe('Dialog', function() {
            it('dialog positioning', function() {
               var sizes = {
                  width: 200,
                  height: 300
               };
               var position = Dialog.getPosition(1920, 1080, sizes);
               assert.isTrue(position.top === 390);
               assert.isTrue(position.left === 860);
            });
         });

         describe('Stack', function() {
            let stackShadowWidth = 5;
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
