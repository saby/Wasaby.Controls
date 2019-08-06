define([
   'Controls/dragnDrop',
   'ControlsUnit/resources/ProxyCall'
], function(dragnDrop, ProxyCall) {
   'use strict';

   describe('Controls.dragnDrop.ResizingLine', function() {

      it('_calculateCoordinates', function() {
         let rlInstance = new dragnDrop.ResizingLine({});

         rlInstance._clientRect = {
            left: 800,
            top: 400
         };

         let coords = rlInstance._calculateCoordinates(100, 200, -200, 5, 300, 'direct');
         assert.strictEqual(100, coords.cOffset, 'Wrong coords');
         assert.strictEqual('805px', coords.cLeft, 'Wrong coords');
         assert.strictEqual('100px', coords.cWidth, 'Wrong coords');
         assert.strictEqual('auto', coords.cRight, 'Wrong coords');
         assert.strictEqual('400px', coords.cTop, 'Wrong coords');
         assert.strictEqual('300px', coords.cHeight, 'Wrong coords');
         assert.strictEqual('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-5, 200, 0, 5, 300, 'direct');
         assert.strictEqual(-0, coords.cOffset, 'Wrong coords');
         assert.strictEqual('800px', coords.cLeft, 'Wrong coords');
         assert.strictEqual('0px', coords.cWidth, 'Wrong coords');
         assert.strictEqual('auto', coords.cRight, 'Wrong coords');
         assert.strictEqual('400px', coords.cTop, 'Wrong coords');
         assert.strictEqual('300px', coords.cHeight, 'Wrong coords');
         assert.strictEqual('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(300, 200, -200, 5, 300, 'direct');
         assert.strictEqual(200, coords.cOffset, 'Wrong coords');
         assert.strictEqual('805px', coords.cLeft, 'Wrong coords');
         assert.strictEqual('200px', coords.cWidth, 'Wrong coords');
         assert.strictEqual('auto', coords.cRight, 'Wrong coords');
         assert.strictEqual('400px', coords.cTop, 'Wrong coords');
         assert.strictEqual('300px', coords.cHeight, 'Wrong coords');
         assert.strictEqual('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-100, 200, -200, 5, 300, 'direct');
         assert.strictEqual(-100, coords.cOffset, 'Wrong coords');
         assert.strictEqual('700px', coords.cLeft, 'Wrong coords');
         assert.strictEqual('100px', coords.cWidth, 'Wrong coords');
         assert.strictEqual('auto', coords.cRight, 'Wrong coords');
         assert.strictEqual('400px', coords.cTop, 'Wrong coords');
         assert.strictEqual('300px', coords.cHeight, 'Wrong coords');
         assert.strictEqual('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-300, 200, -150, 5, 300, 'direct');
         assert.strictEqual(-150, coords.cOffset, 'Wrong coords');
         assert.strictEqual('650px', coords.cLeft, 'Wrong coords');
         assert.strictEqual('150px', coords.cWidth, 'Wrong coords');
         assert.strictEqual('auto', coords.cRight, 'Wrong coords');
         assert.strictEqual('400px', coords.cTop, 'Wrong coords');
         assert.strictEqual('300px', coords.cHeight, 'Wrong coords');
         assert.strictEqual('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(100, 200, -200, 5, 300, 'reverse');
         assert.strictEqual(-100, coords.cOffset, 'Wrong coords');
         assert.strictEqual('800px', coords.cLeft, 'Wrong coords');
         assert.strictEqual('100px', coords.cWidth, 'Wrong coords');
         assert.strictEqual('auto', coords.cRight, 'Wrong coords');
         assert.strictEqual('400px', coords.cTop, 'Wrong coords');
         assert.strictEqual('300px', coords.cHeight, 'Wrong coords');
         assert.strictEqual('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(300, 200, -200, 5, 300, 'reverse');
         assert.strictEqual(-200, coords.cOffset, 'Wrong coords');
         assert.strictEqual('800px', coords.cLeft, 'Wrong coords');
         assert.strictEqual('200px', coords.cWidth, 'Wrong coords');
         assert.strictEqual('auto', coords.cRight, 'Wrong coords');
         assert.strictEqual('400px', coords.cTop, 'Wrong coords');
         assert.strictEqual('300px', coords.cHeight, 'Wrong coords');
         assert.strictEqual('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-100, 200, -200, 5, 300, 'reverse');
         assert.strictEqual(100, coords.cOffset, 'Wrong coords');
         assert.strictEqual('700px', coords.cLeft, 'Wrong coords');
         assert.strictEqual('100px', coords.cWidth, 'Wrong coords');
         assert.strictEqual('auto', coords.cRight, 'Wrong coords');
         assert.strictEqual('400px', coords.cTop, 'Wrong coords');
         assert.strictEqual('300px', coords.cHeight, 'Wrong coords');
         assert.strictEqual('auto', coords.cBottom, 'Wrong coords');

         coords = rlInstance._calculateCoordinates(-300, 200, -150, 5, 300, 'reverse');
         assert.strictEqual(200, coords.cOffset, 'Wrong coords');
         assert.strictEqual('600px', coords.cLeft, 'Wrong coords');
         assert.strictEqual('200px', coords.cWidth, 'Wrong coords');
         assert.strictEqual('auto', coords.cRight, 'Wrong coords');
         assert.strictEqual('400px', coords.cTop, 'Wrong coords');
         assert.strictEqual('300px', coords.cHeight, 'Wrong coords');
         assert.strictEqual('auto', coords.cBottom, 'Wrong coords');
      });
      it('_onEndDragHandler', function() {
         var calls = [];
         let rlInstance = new dragnDrop.ResizingLine({});
         rlInstance._notify = ProxyCall.apply(rlInstance._notify, 'notify', calls, true);
         rlInstance.getInstanceId = function() {
            return 'testId';
         };
         rlInstance._offset = 100;

         rlInstance._onEndDragHandler({}, {entity: null});
         assert.strictEqual(calls.length, 0);
         rlInstance._onEndDragHandler({}, {entity: new dragnDrop.Entity({})});
         assert.strictEqual(calls.length, 0);
         rlInstance._onEndDragHandler({}, {entity: new dragnDrop.Entity({itemId: 'testId'})});
         assert.deepSrictEqual(calls, [{
            name: 'notify',
            arguments: ['offset', [100]]
         }]);
      });
   });
});
