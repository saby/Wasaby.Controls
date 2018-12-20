define([
   'Controls/StickyHeader/Utils'
], function(
   stickyUtils
) {

   'use strict';

   describe('Controls/StickyHeader/Utils', function() {
      describe('getNextId', function() {
         it('should return increasing ids', function() {
            const
               id1 = stickyUtils.getNextId(),
               id2 = stickyUtils.getNextId();

            assert.strictEqual(id2, id1 + 1);
         });
      });

   });

});
