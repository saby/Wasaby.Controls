define(
   [
      'Controls/Indicator/Progress/BaseController'
   ],
   function(BaseController) {
      'use strict';

      describe('Controls/Indicator/Progress/BaseController', function() {
         describe('_private.calcProgressPercent', function() {
            it('10%', function () {
               assert.equal(BaseController._private.calcProgressPercent(10, 100), 10);
            });

            it('over max percentage', function () {
               assert.equal(BaseController._private.calcProgressPercent(110, 100), 100);
            });

            it('under min percentage', function () {
               assert.equal(BaseController._private.calcProgressPercent(-10, 100), 0);
            });
         });

         describe('_private.calcStepSize', function() {
            it('Diff = 5', function() {
               assert.equal(BaseController._private.calcStepSize(5), 1);
            });

            it('Diff = 15', function() {
               assert.equal(BaseController._private.calcStepSize(15), 3);
            });

            it('Diff = 50', function() {
               assert.equal(BaseController._private.calcStepSize(50), 7);
            });
         });

         describe('_private.calcMovementDirection', function() {
            it('old > new', function() {
               assert.equal(BaseController._private.calcMovementDirection(50, 15), -1);
            });

            it('old < new', function() {
               assert.equal(BaseController._private.calcMovementDirection(15, 50), 1);
            });

            it('old == new', function() {
               assert.equal(BaseController._private.calcMovementDirection(15, 15), 0);
            });
         });
      });
   }
);
