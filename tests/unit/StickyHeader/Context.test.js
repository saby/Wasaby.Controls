define(
   [
      'Controls/scroll'
   ],
   function(scroll) {

      'use strict';

      describe('Controls.StickyHeader.Context', function() {
         var result;
         describe('constructor', function() {
            it('Create a component with a invisible shadow', function() {
               result = new scroll._stickyHeaderContext({
                  shadowPosition: ''
               }).shadowPosition;

               assert.equal(result, '');
            });

            it('Create a component with a visible shadow', function() {
               result = new scroll._stickyHeaderContext({
                  shadowPosition: 'top'
               }).shadowPosition;

               assert.equal(result, 'top');
            });
         });

         it('The value of the properties upon creation', function() {
            result = {
               top: scroll._stickyHeaderContext.prototype.top,
               bottom: scroll._stickyHeaderContext.prototype.bottom,
               shadowPosition: scroll._stickyHeaderContext.prototype.shadowPosition
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
