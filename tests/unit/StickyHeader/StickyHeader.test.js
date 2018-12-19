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
      });
   });

});
