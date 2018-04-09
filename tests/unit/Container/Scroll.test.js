define(
   [
      'Controls/Container/Scroll'
   ],
   function(Scroll) {

      'use strict';

      describe('Controls.Container.Shadow', function() {
         var result;
         describe('calcShadowPosition', function() {
            it('Тень сверху', function() {
               result = Scroll._private.calcShadowPosition(100, 100, 200);
               assert.equal(result, 'top');
            });
            it('Тень снизу', function() {
               result = Scroll._private.calcShadowPosition(0, 100, 200);
               assert.equal(result, 'bottom');
            });
            it('Тень сверху и снизу', function() {
               result = Scroll._private.calcShadowPosition(50, 100, 200);
               assert.equal(result, 'topbottom');
            });
         });
         describe('getSizes', function() {
            var container = {
               scrollHeight: 200,
               offsetHeight: 100,
               scrollTop: 0
            };

            it('getScrollHeight', function() {
               result = Scroll._private.getScrollHeight(container);
               assert.equal(result, 200);
            });
            it('getContainerHeight', function() {
               result = Scroll._private.getContainerHeight(container);
               assert.equal(result, 100);
            });
            it('getScrollTop', function() {
               result = Scroll._private.getScrollTop(container);
               assert.equal(result, 0);
            });
         });
         it('calcPagingPagesCount', function() {
            result = Scroll._private.calcPagingPagesCount(200, 200);
            assert.equal(result, 1);

            result = Scroll._private.calcPagingPagesCount(200, 201);
            assert.equal(result, 2);
         });
         it('calcPagingSelectedPage', function() {
            result = Scroll._private.calcPagingSelectedPage(200, 200);
            assert.equal(result, 2);

            result = Scroll._private.calcPagingSelectedPage(200, 201);
            assert.equal(result, 3);
         });
      });
   }
);