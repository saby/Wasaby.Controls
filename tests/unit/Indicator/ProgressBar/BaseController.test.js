define(
   [
      'Controls/Indicator/Progress/BaseController'
   ],
   function(BaseController) {
      'use strict';

      describe('Controls/Indicator/Progress/BaseController', function() {
         it('_private.calcProgressPercent 10%', function() {
            assert.equal(BaseController._private.calcProgressPercent(10, 100), 10);
         });

         it('_private.calcProgressPercent over max percentage', function() {
            assert.equal(BaseController._private.calcProgressPercent(110, 100), 100);
         });

         it('_private.calcProgressPercent under min percentage', function() {
            assert.equal(BaseController._private.calcProgressPercent(-10, 100), 0);
         });

         it('_private.calcStepSize. Diff = 5', function() {
            assert.equal(BaseController._private.calcStepSize(5), 1);
         });

         it('_private.calcStepSize. Diff = 15', function() {
            assert.equal(BaseController._private.calcStepSize(15), 3);
         });

         it('_private.calcStepSize. Diff = 50', function() {
            assert.equal(BaseController._private.calcStepSize(50), 7);
         });

         it('_private.calcMovementDirection. old > new', function() {
            assert.equal(BaseController._private.calcMovementDirection(50, 15), -1);
         });

         it('_private.calcMovementDirection. old < new', function() {
            assert.equal(BaseController._private.calcMovementDirection(15, 50), 1);
         });

         it('_private.calcMovementDirection. old == new', function() {
            assert.equal(BaseController._private.calcMovementDirection(15, 15), 0);
         });
      });
   }
);
