define([
   'Controls/scroll'
], function(
   scroll
) {

   'use strict';

   describe('Controls/scroll:Utils', function() {
      describe('getNextId', function() {
         it('should return increasing ids', function() {
            const
               id1 = scroll.Utils.getNextId(),
               id2 = scroll.Utils.getNextId();

            assert.strictEqual(id2, id1 + 1);
         });
      });

   });

});
