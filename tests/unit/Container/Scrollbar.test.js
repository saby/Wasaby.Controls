define(
   [
      'Controls/Container/Scroll/Scrollbar',
      'Core/core-merge'
   ],
   function(Scrollbar, coreMerge) {

      'use strict';

      let createComponent = function(Component, cfg) {
         let cmp;
         if (Component.getDefaultOptions) {
            cfg = coreMerge(cfg, Component.getDefaultOptions(), {preferSource: true});
         }
         cmp = new Component(cfg);
         cmp.saveOptions(cfg);
         cmp._beforeMount(cfg);
         return cmp;
      };

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
               direction: 'vertical'
            });
         });

         describe('_afterUpdate', function() {
            it('Should update scroll position', function() {
               let
                  sandbox = sinon.sandbox.create(),
                  component = createComponent(Scrollbar, {contentHeight: 100, position: 0});
               component._children.scrollbar = {
                  offsetHeight: 50,
                  clientHeight: 50
               };
               sandbox.stub(component, '_setSizes');
               sandbox.stub(component, '_setPosition');
               component._afterUpdate({contentHeight: 200, position: 10});
               sinon.assert.called(component._setPosition);
               sandbox.restore();
            });

         });
      });
   }
);
