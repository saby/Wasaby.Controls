define([
   'Controls/dragnDrop'
], function(dragnDrop) {
   'use strict';

   describe('Controls.dragnDrop.ResizingLine', function() {

      it('_calculateCoordinates', function() {
         let rlInstance = new dragnDrop.ResizingLine({});

         rlInstance._clientRect = {
            left: 800,
            top: 400
         };

         let coords = rlInstance._calculateCoordinates(100, 200, -200, 5, 300, 'direct');
         assert.equal(100, coords.cOffset, 'Wrong coords');
         assert.equal('805px', coords.cLeft, 'Wrong coords');
         assert.equal('100px', coords.cWidth, 'Wrong coords');
         assert.equal('auto', coords.cRight, 'Wrong coords');
         assert.equal('400px', coords.cTop, 'Wrong coords');
         assert.equal('300px', coords.cHeight, 'Wrong coords');
         assert.equal('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(300, 200, -200, 5, 300, 'direct');
         assert.equal(200, coords.cOffset, 'Wrong coords');
         assert.equal('805px', coords.cLeft, 'Wrong coords');
         assert.equal('200px', coords.cWidth, 'Wrong coords');
         assert.equal('auto', coords.cRight, 'Wrong coords');
         assert.equal('400px', coords.cTop, 'Wrong coords');
         assert.equal('300px', coords.cHeight, 'Wrong coords');
         assert.equal('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-100, 200, -200, 5, 300, 'direct');
         assert.equal(-100, coords.cOffset, 'Wrong coords');
         assert.equal('700px', coords.cLeft, 'Wrong coords');
         assert.equal('105px', coords.cWidth, 'Wrong coords');
         assert.equal('auto', coords.cRight, 'Wrong coords');
         assert.equal('400px', coords.cTop, 'Wrong coords');
         assert.equal('300px', coords.cHeight, 'Wrong coords');
         assert.equal('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-300, 200, -150, 5, 300, 'direct');
         assert.equal(-150, coords.cOffset, 'Wrong coords');
         assert.equal('650px', coords.cLeft, 'Wrong coords');
         assert.equal('155px', coords.cWidth, 'Wrong coords');
         assert.equal('auto', coords.cRight, 'Wrong coords');
         assert.equal('400px', coords.cTop, 'Wrong coords');
         assert.equal('300px', coords.cHeight, 'Wrong coords');
         assert.equal('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(100, 200, -200, 5, 300, 'reverse');
         assert.equal(-100, coords.cOffset, 'Wrong coords');
         assert.equal('800px', coords.cLeft, 'Wrong coords');
         assert.equal('100px', coords.cWidth, 'Wrong coords');
         assert.equal('auto', coords.cRight, 'Wrong coords');
         assert.equal('400px', coords.cTop, 'Wrong coords');
         assert.equal('300px', coords.cHeight, 'Wrong coords');
         assert.equal('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(300, 200, -200, 5, 300, 'reverse');
         assert.equal(-200, coords.cOffset, 'Wrong coords');
         assert.equal('800px', coords.cLeft, 'Wrong coords');
         assert.equal('200px', coords.cWidth, 'Wrong coords');
         assert.equal('auto', coords.cRight, 'Wrong coords');
         assert.equal('400px', coords.cTop, 'Wrong coords');
         assert.equal('300px', coords.cHeight, 'Wrong coords');
         assert.equal('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-100, 200, -200, 5, 300, 'reverse');
         assert.equal(100, coords.cOffset, 'Wrong coords');
         assert.equal('700px', coords.cLeft, 'Wrong coords');
         assert.equal('100px', coords.cWidth, 'Wrong coords');
         assert.equal('auto', coords.cRight, 'Wrong coords');
         assert.equal('400px', coords.cTop, 'Wrong coords');
         assert.equal('300px', coords.cHeight, 'Wrong coords');
         assert.equal('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-300, 200, -150, 5, 300, 'reverse');
         assert.equal(200, coords.cOffset, 'Wrong coords');
         assert.equal('600px', coords.cLeft, 'Wrong coords');
         assert.equal('200px', coords.cWidth, 'Wrong coords');
         assert.equal('auto', coords.cRight, 'Wrong coords');
         assert.equal('400px', coords.cTop, 'Wrong coords');
         assert.equal('300px', coords.cHeight, 'Wrong coords');
         assert.equal('auto', coords.cBottom, 'Wrong coords');
      });

   });
});
