define(
   [
      'Controls/StickyHeader/Context'
   ],
   function(StickyHeader) {

      'use strict';

      describe('Controls.StickyHeader.Context', function() {
         var result;
         describe('constructor', function() {
            it('Create a component with a invisible shadow', function() {
               result = new StickyHeader({
                  shadowVisible: false
               }).shadowVisible;

               assert.equal(result, false);
            });

            it('Create a component with a visible shadow', function() {
               result = new StickyHeader({
                  shadowVisible: true
               }).shadowVisible;

               assert.equal(result, true);
            });
         });
      });
   }
);
