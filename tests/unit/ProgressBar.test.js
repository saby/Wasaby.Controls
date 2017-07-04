define(
   [
      'js!SBIS3.CONTROLS.ProgressBar'
   ],
   (ProgressBar) => {

      'use strict';

      describe('SBIS3.CONTROLS.ProgressBar', () => {
         let progressBar;

         describe('Propertyes', () => {
            afterEach(() => {
               progressBar = undefined;
            });

            it('progress', () => {
               try {
                  progressBar = new ProgressBar({
                     progress: -100
                  });
               } catch(exception) {
                  assert.equal(progressBar, undefined);
                  assert.equal(exception.message, 'setProgress. Значение прогресса меньше минимума');
               }

               try {
                  progressBar = new ProgressBar({
                     progress: 200
                  });
               } catch(exception) {
                  assert.equal(progressBar, undefined);
                  assert.equal(exception.message, 'setProgress. Значение прогресса превышает максимальное значение');
               }

               try {
                  progressBar = new ProgressBar({
                     progress: 'cto'
                  });
               } catch(exception) {
                  assert.equal(progressBar, undefined);
                  assert.equal(exception.message, 'setProgress. Значение прогресса не является числом');
               }

               progressBar = new ProgressBar({
                  progress: '50'
               });
               progressBar.setProgress(50);
               assert.equal(progressBar.progress, 50);
               assert.equal(progressBar.progressPercent, '50%');

               progressBar = new ProgressBar({});
               assert.equal(progressBar.progress, 0);
               assert.equal(progressBar.progressPercent, '0%');
            });

            it('minimum', () => {
               try {
                  progressBar = new ProgressBar({
                     minimum: 100
                  });
               } catch(exception) {
                  assert.equal(progressBar, undefined);
                  assert.equal(exception.message, 'setMinimum. Значение прогресса меньше минимума');
               }

               progressBar = new ProgressBar({
                  minimum: -100
               });
               assert.equal(progressBar.minimum, -100);
               assert.equal(progressBar.progressPercent, '50%');

               progressBar = new ProgressBar({});
               assert.equal(progressBar.minimum, 0);
               assert.equal(progressBar.progressPercent, '0%');
            });

            it('maximum', () => {
               try {
                  progressBar = new ProgressBar({
                     maximum: -50
                  });
               } catch(exception) {
                  assert.equal(progressBar, undefined);
                  assert.equal(exception.message, 'setMaximum. Значение максимума меньше минимума');
               }

               progressBar = new ProgressBar({
                  maximum: 50
               });
               assert.equal(progressBar.maximum, 50);
               assert.equal(progressBar.progressPercent, '0%');

               progressBar = new ProgressBar({});
               assert.equal(progressBar.maximum, 100);
               assert.equal(progressBar.progressPercent, '0%');
            });

            it('progressPosition', () => {
               progressBar = new ProgressBar({
                  progressPosition: 'right'
               });
               assert.equal(progressBar.progressPosition, 'right');

               progressBar = new ProgressBar({});
               assert.equal(progressBar.progressPosition, 'center');
            });

            it('progressPercent', () => {
               progressBar = new ProgressBar({
                  progress: 50
               });
               assert.equal(progressBar.progressPercent, '50%');

               progressBar.setMinimum(-200);
               assert.equal(progressBar.progressPercent, '83%');

               progressBar.setProgress(-170);
               progressBar.setMaximum(-150);
               assert.equal(progressBar.progressPercent, '60%');

               progressBar.setProgress(-150);
               assert.equal(progressBar.progressPercent, '100%');

               progressBar.setProgress(-200);
               assert.equal(progressBar.progressPercent, '0%');
            });
         });
         describe('Setter', () => {
            beforeEach(() => {
               progressBar = new ProgressBar({});
            });
            it('setProgress', () => {
               try {
                  progressBar.setProgress(-100);
               } catch(exception) {
                  assert.equal(progressBar.progress, -100);
                  assert.equal(exception.message, 'setProgress. Значение прогресса меньше минимума');
               }
               try {
                  progressBar.setProgress(200);
               } catch(exception) {
                  assert.equal(progressBar.progress, 200);
                  assert.equal(exception.message, 'setProgress. Значение прогресса превышает максимальное значение');
               }
               try {
                  progressBar.setProgress('cto');
               } catch(exception) {
                  assert.isTrue(isNaN(progressBar.progress));
                  assert.equal(exception.message, 'setProgress. Значение прогресса не является числом');
               }
               progressBar.setProgress(50);
               assert.equal(progressBar.progress, 50);
               assert.equal(progressBar.progressPercent, '50%');
            });
            it('setMinimum', () => {
               try {
                  progressBar.setMinimum(100);
               } catch(exception) {
                  assert.equal(progressBar.minimum, 100);
                  assert.equal(exception.message, 'setMinimum. Значение прогресса меньше минимума');
               }
               progressBar.setMinimum(-100);
               assert.equal(progressBar.minimum, -100);
               assert.equal(progressBar.progressPercent, '50%');
            });
            it('setMaximum', () => {
               try {
                  progressBar.setMaximum(-50);
               } catch(exception) {
                  assert.equal(progressBar.maximum, -50);
                  assert.equal(exception.message, 'setMaximum. Значение максимума меньше минимума');
               }
               progressBar.setMaximum(50);
               assert.equal(progressBar.maximum, 50);
               assert.equal(progressBar.progressPercent, '0%');
            });
            it('setProgressPosition', () => {
               progressBar.setProgressPosition('right');
               assert.equal(progressBar.progressPosition, 'right');
            });
         });
      });
   }
);