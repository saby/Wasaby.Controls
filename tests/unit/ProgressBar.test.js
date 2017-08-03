define(
   [
      'js!SBIS3.CONTROLS.ProgressBar'
   ],
   (ProgressBar) => {

      'use strict';

      describe('SBIS3.CONTROLS.ProgressBar', () => {
         let progressBar, optionsPB, container;

         beforeEach(() => {
            if ($ === 'undefined') {
               this.skip();
            } else {
               progressBar = new ProgressBar({
                  element: $('<div id="progressBar-test"></div>').appendTo('#mocha')
               });
               optionsPB = progressBar._options;
            }
         });
         afterEach(() => {
            progressBar.destroy();
         });

         describe('State', () => {
            beforeEach(() => {
               progressBar.destroy();
               container = $('<div id="progressBar-test"></div>').appendTo('#mocha');
            });
            afterEach(() => {
               progressBar.destroy();
            });

            it('default', () => {
               progressBar = new ProgressBar({
                  element: container
               });

               assert.equal(progressBar._options.minimum, 0);
               assert.equal(progressBar._options.maximum, 100);
               assert.equal(progressBar._options.step, 1);
               assert.equal(progressBar._options.progress, 0);
               assert.equal(progressBar._options.progressPosition, 'center');
            });
            it('myConfig', () => {
               progressBar = new ProgressBar({
                  element: container,
                  minimum: -100,
                  maximum: 0,
                  step: 2,
                  progress: '-50',
                  progressPosition: 'left'
               });

               assert.equal(progressBar._options.minimum, -100);
               assert.equal(progressBar._options.maximum, 0);
               assert.equal(progressBar._options.step, 2);
               assert.equal(progressBar._options.progress, -50);
               assert.equal(progressBar._options.progressPosition, 'left');
            });
         });
         describe('_checkRanges', () => {
            it('min-progress', () => {
               optionsPB.progress = -100;
               progressBar._checkRanges(optionsPB);
               assert.equal(optionsPB.progress, 0);
            });
            it('max-progress', () => {
               optionsPB.progress = 200;
               progressBar._checkRanges(optionsPB);
               assert.equal(optionsPB.progress, 100);
            });
            it('minimum<=>maximum', () => {
               optionsPB.minimum = 100;
               optionsPB.maximum = -100;
               progressBar._checkRanges(optionsPB);
               assert.equal(optionsPB.minimum, -100);
               assert.equal(optionsPB.maximum, 100);
            });
         });
         describe('_getProgressPercent', () => {
            it('return', () => {
               optionsPB.progress = 50;
               assert.equal(progressBar._getProgressPercent(optionsPB), 50);

               optionsPB.maximum = 200;
               assert.equal(progressBar._getProgressPercent(progressBar._options), 25);

               optionsPB.minimum = -100;
               assert.equal(progressBar._getProgressPercent(progressBar._options), 50);

               optionsPB.step = 40;
               assert.equal(progressBar._getProgressPercent(progressBar._options), 40);
            });
         });
      });
   }
);