define(
   [
      'Controls/Popup/InfoBox',
      'Controls/Popup/Previewer/OpenerTemplate',
      'Controls/Popup/Opener/InfoBox/InfoBoxController'
   ],
   (InfoBox, OpenerTemplate, InfoBoxController) => {
      'use strict';

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
      });
   }
);
