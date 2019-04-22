define(
   [
      'Controls/Popup/InfoBox',
      'Controls/Popup/Previewer/OpenerTemplate',
      'Controls/Popup/Opener/InfoBox/InfoBoxController',
      'Controls/_popupTemplate/InfoBox'
   ],
   (InfoBox, OpenerTemplate, InfoBoxController, InfoBoxTemplate) => {
      'use strict';

      describe('Controls/Popup/InfoBoxController', () => {
         it('InfoBoxController: getDefaultConfig', () => {
            let item = {
               popupOptions: {
                  position: 'tl',
                  target: {
                     offsetWidth: 1,
                     offsetHeight: 1
                  }
               }
            };
            InfoBoxController.getDefaultConfig(item);
            assert.equal(item.position.top, -10000);
            assert.equal(item.position.left, -10000);
            assert.equal(item.position.right, undefined);
            assert.equal(item.position.bottom, undefined);
         });
      });

      describe('Controls/Popup/InfoBox', () => {
         it('PopupInfoBox: getConfig', () => {
            let config = {
               floatCloseButton: true,
               style: 'error',
               position: 'tl',
               template: OpenerTemplate
            };
            let Infobox = new InfoBox(config);
            Infobox.saveOptions(config);
            let newConfig = InfoBox._private.getCfg(Infobox);

            assert.equal(newConfig.floatCloseButton, true);
            assert.equal(newConfig.style, 'error');
            assert.equal(newConfig.position, 'tl');
            assert.equal(newConfig.template, OpenerTemplate);
         });

         it('PopupInfoBox: resetTimeOut', () => {
            let Infobox = new InfoBox();
            Infobox._openId = 300;
            Infobox._closeId = 500;
            assert.equal(Infobox._closeId, 500);
            assert.equal(Infobox._openId, 300);
            InfoBox._private.resetTimeOut(Infobox);
            assert.equal(Infobox._closeId, null);
            assert.equal(Infobox._openId, null);
         });

         it('InfoBoxController: check position', () => {
            let arrowOffset = 12;
            let arrowWidth = 16;

            let tests = [{
               cfg: {
                  targetWidth: 10,
                  alignSide: 'l'
               },
               value: -15
            }, {
               cfg: {
                  targetWidth: 10,
                  alignSide: 'c'
               },
               value: 0
            }, {
               cfg: {
                  targetWidth: 10,
                  alignSide: 'r'
               },
               value: 15
            }, {
               cfg: {
                  targetWidth: 100,
                  alignSide: 'r'
               },
               value: 0
            }];

            tests.forEach((test) => {
               it('align: ' + JSON.stringify(test.cfg), () => {
                  let offset = InfoBoxController._private.getOffset(test.cfg.targetWidth, test.cfg.alignSide, arrowOffset, arrowWidth);
                  assert.equal(offset, test.value);
               });
            });
         });

         it('InfoBoxController: calculate offset target size', () => {
            let offsetHeight;
            InfoBoxController._private.getOffset = (height) => {
               offsetHeight = height;
            };
            let target = {
               offsetHeight: 100,
               offsetWidth: 100
            };
            InfoBoxController._private.getVerticalOffset(target, false);
            assert.equal(offsetHeight, 100);
            offsetHeight = null;
            InfoBoxController._private.getHorizontalOffset(target, true);
            assert.equal(offsetHeight, 100);

            target = {
               clientHeight: 200,
               clientWidth: 200
            };

            InfoBoxController._private.getVerticalOffset(target, false);
            assert.equal(offsetHeight, 200);
            offsetHeight = null;
            InfoBoxController._private.getHorizontalOffset(target, true);
            assert.equal(offsetHeight, 200);
         });
      });

      describe('Controls/Popup/Template/InfoBox', () => {
         let getStickyPosition = (hAlign, vAlign, hCorner, vCorner) => ({
            horizontalAlign: {
               side: hAlign
            },
            verticalAlign: {
               side: vAlign
            },
            corner: {
               vertical: vCorner,
               horizontal: hCorner
            }
         });
         let InfoBoxInstance = new InfoBoxTemplate();
         it('InfoBoxTemplate: beforeUpdate', () => {
            let stickyPosition = getStickyPosition('left', 'top', 'left');
            InfoBoxInstance._beforeUpdate({ stickyPosition });
            assert.equal(InfoBoxInstance._arrowSide, 'right');
            assert.equal(InfoBoxInstance._arrowPosition, 'end');

            stickyPosition = getStickyPosition('right', 'bottom', 'right');
            InfoBoxInstance._beforeUpdate({ stickyPosition });
            assert.equal(InfoBoxInstance._arrowSide, 'left');
            assert.equal(InfoBoxInstance._arrowPosition, 'start');

            stickyPosition = getStickyPosition('right', 'top', 'left', 'top');
            InfoBoxInstance._beforeUpdate({ stickyPosition });
            assert.equal(InfoBoxInstance._arrowSide, 'bottom');
            assert.equal(InfoBoxInstance._arrowPosition, 'start');

            stickyPosition = getStickyPosition('left', 'bottom', 'right', 'bottom');
            InfoBoxInstance._beforeUpdate({ stickyPosition });
            assert.equal(InfoBoxInstance._arrowSide, 'top');
            assert.equal(InfoBoxInstance._arrowPosition, 'end');
         });
      });
   }
);
