define(
   [
      'Core/Control',
      'js!WSControls/ProgressBars/ProgressBar'
   ],
   (Control, ProgressBar) => {

      'use strict';

      describe('WSControls.ProgressBars.ProgressBar', () => {
         var PB;


         beforeEach(function () {
            if (typeof $ === 'undefined') {
               this.skip();
            } else {
               PB = Control.createControl(ProgressBar, {}, $('<div id="progressBar-test"></div>').appendTo('#mocha'));
            }
         });


         describe('_getProgressPercent', () => {
            it('return', () => {
               assert.equal(PB._getProgressPercent(0, 100, 50, 1), 50);
               assert.equal(PB._getProgressPercent(-100, 100, 50, 1), 75);
               assert.equal(PB._getProgressPercent(0, 100, 50, 25), 50);
               assert.equal(PB._getProgressPercent(0, 100, 50, 40), 40);
            });
         });
      });
   }
);