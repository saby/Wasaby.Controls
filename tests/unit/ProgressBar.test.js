define(
   [
      'Core/Control',
      'js!WSControls/ProgressBars/ProgressBar'
   ],
   (Control, ProgressBar) => {

      'use strict';

      describe('WSControls.ProgressBars.ProgressBar', () => {
         let progressBar;

         beforeEach(() => {
            if (typeof $ === 'undefined') {
               this.skip();
            } else {
               progressBar = Control.createControl(ProgressBar, {}, $('<div id="progressBar-test"></div>').appendTo('#mocha'));
            }
         });
         afterEach(() => {
            if (typeof $ === 'undefined') {
               this.skip();
            } else {
               //progressBar.destroy();
            }
         });

         describe('_getProgressPercent', () => {
            it('return', () => {
               assert.equal(progressBar._getProgressPercent(0, 100, 50, 1), 50);
               assert.equal(progressBar._getProgressPercent(-100, 100, 50, 1), 75);
               assert.equal(progressBar._getProgressPercent(0, 100, 50, 25), 50);
               assert.equal(progressBar._getProgressPercent(0, 100, 50, 40), 40);
            });
         });
      });
   }
);