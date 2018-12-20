define([
   'Controls/StickyHeader/Group',
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

   describe('Controls/StickyHeader/Group', function() {
      describe('Initialisation', function() {
         it('should set correct header id', function() {
            const component = createComponent(StickyHeader, options);
            component._afterMount();
            assert.strictEqual(component._index, stickyUtils._lastId);
         });
      });

      describe('_fixedHandler', function() {
         const
            event = { stopImmediatePropagation: sinon.fake() };

         it('should add fixed header to list of fixed headers', function() {
            const
               component = createComponent(StickyHeader, options),
               headerId = stickyUtils.getNextId();

            component._fixedHandler(event, { shouldBeFixed: true, id: headerId });

            assert.lengthOf(component._stickyHeaderIds, 1);
            assert.include(component._stickyHeaderIds, headerId);
         });

         it('should remove fixed header from list of fixed headers on header unfixed', function() {
            const
               component = createComponent(StickyHeader, options),
               headerId = stickyUtils.getNextId();

            component._stickyHeaderIds.push(headerId);
            component._fixedHandler(event, { shouldBeFixed: false, id: headerId });

            assert.lengthOf(component._stickyHeaderIds, 0);
            assert.notInclude(component._stickyHeaderIds, headerId);
         });
      });
   });

});
