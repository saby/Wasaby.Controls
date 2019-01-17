define([
   'Controls/StickyHeader/_StickyHeader',
   'Controls/StickyHeader/Utils',
   'Core/core-merge'
], function(
   StickyHeader,
   stickyUtils,
   coreMerge
) {

   'use strict';

   const
      createComponent = function(Component, cfg) {
         let mv;
         if (Component.getDefaultOptions) {
            cfg = coreMerge(cfg, Component.getDefaultOptions(), {preferSource: true});
         }
         mv = new Component(cfg);
         mv.saveOptions(cfg);
         mv._beforeMount(cfg);
         return mv;
      },
      options = {
      };

   describe('Controls.StickyHeader._StickyHeader', function() {
      describe('Initialisation', function() {
         it('should set correct header id', function() {
            const component = createComponent(StickyHeader, options);
            assert.strictEqual(component._index, stickyUtils._lastId);
         });
      });

      describe('_getStyle', function() {
         it('should set correct z-index', function() {
            const component = createComponent(StickyHeader, {fixedZIndex: 2});
            component._context = {
               stickyHeader: { position: 0 }
            };
            component._model = { shouldBeFixed: true };

            assert.include(component._getStyle(), 'z-index: 2;');
         });

         it('should return correct top.', function() {
            const component = createComponent(StickyHeader, {fixedZIndex: 2});
            component._context = {
               stickyHeader: { position: 2 }
            };
            component._model = { shouldBeFixed: true };
            component._stickyHeadersHeight = 10;

            assert.include(component._getStyle(), 'top: 12px;');
         });
      });

      describe('_updateStickyHeight', function() {
         it('should update height if header not fixed', function() {
            const component = createComponent(StickyHeader, {});
            component._model = { shouldBeFixed: false };

            assert.strictEqual(component._stickyHeadersHeight, 0);
            component._updateStickyHeight(null, 10);
            assert.strictEqual(component._stickyHeadersHeight, 10);
         });

         it('should not update height if header fixed', function() {
            const component = createComponent(StickyHeader, {});
            component._model = { shouldBeFixed: true };

            assert.strictEqual(component._stickyHeadersHeight, 0);
            component._updateStickyHeight(null, 10);
            assert.strictEqual(component._stickyHeadersHeight, 0);
         });
      });

      describe('_getTopObserverStyle', function() {
         it('should return correct style', function() {
            const component = createComponent(StickyHeader, {});
            component._model = { shouldBeFixed: false };

            assert.strictEqual(component._getTopObserverStyle(), 'top: -2px;');
            component._stickyHeadersHeight = 2;
            assert.strictEqual(component._getTopObserverStyle(), 'top: -4px;');
         });
      });
   });

});
