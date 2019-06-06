define([
   'Controls/dragnDrop'
], function(dragnDrop) {
   'use strict';

   describe('Controls.dragnDrop.ResizingLine', function() {

      it('_calculateCoordinates', function() {
         let rlInstance = new dragnDrop.ResizingLine({});

         let coords = rlInstance._calculateCoordinates(100, 200, -200, 5, 'direct');
         assert.equal(100, coords.cOffset, 'Wrong coords');
         assert.equal('5px', coords.cLeft, 'Wrong coords');
         assert.equal('-100px', coords.cRight, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(300, 200, -200, 5, 'direct');
         assert.equal(200, coords.cOffset, 'Wrong coords');
         assert.equal('5px', coords.cLeft, 'Wrong coords');
         assert.equal('-200px', coords.cRight, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-100, 200, -200, 5, 'direct');
         assert.equal(-100, coords.cOffset, 'Wrong coords');
         assert.equal('0', coords.cRight, 'Wrong coords');
         assert.equal('-100px', coords.cLeft, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-300, 200, -150, 5, 'direct');
         assert.equal(-150, coords.cOffset, 'Wrong coords');
         assert.equal('0', coords.cRight, 'Wrong coords');
         assert.equal('-150px', coords.cLeft, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(100, 200, -200, 5, 'reverse');
         assert.equal(-100, coords.cOffset, 'Wrong coords');
         assert.equal('0', coords.cLeft, 'Wrong coords');
         assert.equal('-100px', coords.cRight, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(300, 200, -200, 5, 'reverse');
         assert.equal(-200, coords.cOffset, 'Wrong coords');
         assert.equal('0', coords.cLeft, 'Wrong coords');
         assert.equal('-200px', coords.cRight, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-100, 200, -200, 5, 'reverse');
         assert.equal(100, coords.cOffset, 'Wrong coords');
         assert.equal('5px', coords.cRight, 'Wrong coords');
         assert.equal('-100px', coords.cLeft, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-300, 200, -150, 5, 'reverse');
         assert.equal(200, coords.cOffset, 'Wrong coords');
         assert.equal('5px', coords.cRight, 'Wrong coords');
         assert.equal('-200px', coords.cLeft, 'Wrong coords');
      });

   });
});
