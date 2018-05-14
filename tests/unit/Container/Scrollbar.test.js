define(
   [
      'Controls/Container/Scroll/Scrollbar'
   ],
   function(Scrollbar) {

      'use strict';

      describe('Controls.Container.Scrollbar', function() {
         var result;

         describe('calcPosition', function() {
            var
               bottom = 0,
               top = 200,
               position;
            it('Позиция за пределами нижней границы', function() {
               position = -100;
               result = Scrollbar._private.calcPosition(position, bottom, top);
               assert.equal(result, bottom);
            });
            it('Позиция в пределах границ', function() {
               position = 100;
               result = Scrollbar._private.calcPosition(position, bottom, top);
               assert.equal(result, position);
            });
            it('Позиция за пределами верхней границы', function() {
               position = 300;
               result = Scrollbar._private.calcPosition(300, bottom, top);
               assert.equal(result, top);
            });
         });
         it('calcViewportRatio', function() {
            result = Scrollbar._private.calcViewportRatio(100, 200);
            assert.equal(result, 0.5);
         });
         it('calcScrollRatio', function() {
            result = Scrollbar._private.calcScrollRatio(200, 100, 50, 400);
            assert.equal(result, 0.25);

            result = Scrollbar._private.calcScrollRatio(100, 100, 100, 100);
            assert.equal(result, 1);
         });
         it('calcWheelDelta', function() {
            result = Scrollbar._private.calcWheelDelta(false, 80);
            assert.equal(result, 80);

            result = Scrollbar._private.calcWheelDelta(true, 80);
            assert.equal(result, 100);
         });
         it('calcScrollbarDelta', function() {
            result = Scrollbar._private.calcScrollbarDelta(0, 100, 50);
            assert.equal(result, 75);
         });
         it('getDefaultOptions', function() {
            result = Scrollbar.getDefaultOptions();
            assert.deepEqual(result, {
               position: 0,
               style: 'normal'
            });
         });
      });
   }
);