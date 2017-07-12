define(
   [
      'js!SBIS3.CONTROLS.ProgressBar'
   ],
   (ProgressBar) => {

      'use strict';

      describe('SBIS3.CONTROLS.ProgressBar', () => {
         let progressBar;

         describe('State', () => {
            it('default', () => {
               progressBar = new ProgressBar({});

               assert.equal(progressBar.minimum, 0);
               assert.equal(progressBar.maximum, 100);
               assert.equal(progressBar.step, 1);
               assert.equal(progressBar.progress, 0);
               assert.equal(progressBar.progressPosition, 'center');
               assert.equal(progressBar.progressPercent, 0);
            });
            it('config', () => {
               progressBar = new ProgressBar({
                  minimum: -100,
                  maximum: 0,
                  step: 2,
                  progress: '-50',
                  progressPosition: 'left'
               });

               assert.equal(progressBar.minimum, -100);
               assert.equal(progressBar.maximum, 0);
               assert.equal(progressBar.step, 2);
               assert.equal(progressBar.progress, -50);
               assert.equal(progressBar.progressPosition, 'left');
               assert.equal(progressBar.progressPercent, 50);
            });
         });
         describe('_checkRanges', () => {
            beforeEach(() => {
               progressBar = new ProgressBar({});
            });

            it('min-progress', () => {
               progressBar.progress = -100;
               progressBar._checkRanges();
               assert.equal(progressBar.progress, 0);
            });
            it('max-progress', () => {
               progressBar.progress = 200;
               progressBar._checkRanges();
               assert.equal(progressBar.progress, 100);
            });
            it('NaN-progress', () => {
               progressBar.progress = 'a200';
               progressBar._checkRanges();
               assert.equal(progressBar.progress, 0);
            });
            it('minimum<=>maximum', () => {
               progressBar.minimum = 100;
               progressBar.maximum = -100;
               progressBar._checkRanges();
               assert.equal(progressBar.minimum, -100);
               assert.equal(progressBar.maximum, 100);
            });
         });
         describe('_getProgressPercent', () => {
            it('return', () => {
               progressBar = new ProgressBar({
                  progress: 50
               });
               assert.equal(progressBar._getProgressPercent(), 50);

               progressBar = new ProgressBar({
                  progress: 50,
                  maximum: 200
               });
               assert.equal(progressBar._getProgressPercent(), 25);

               progressBar = new ProgressBar({
                  progress: 50,
                  minimum: -100,
                  maximum: 100
               });
               assert.equal(progressBar._getProgressPercent(), 75);

               progressBar = new ProgressBar({
                  progress: 50,
                  minimum: -100,
                  maximum: 100,
                  step: 50
               });
               assert.equal(progressBar._getProgressPercent(), 50);
            });
         });
      });
   }
);