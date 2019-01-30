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
                  shadowPosition: ''
               }).shadowPosition;

               assert.equal(result, '');
            });

            it('Create a component with a visible shadow', function() {
               result = new StickyHeader({
                  shadowPosition: 'top'
               }).shadowPosition;

               assert.equal(result, 'top');
            });
         });

         it('The value of the properties upon creation', function() {
            result = {
               top: StickyHeader.prototype.top,
               bottom: StickyHeader.prototype.bottom,
               shadowPosition: StickyHeader.prototype.shadowPosition
            };

            assert.deepEqual(result, {
               top: 0,
               bottom: 0,
               shadowPosition: ''
            });
         });
      });
   }
);
