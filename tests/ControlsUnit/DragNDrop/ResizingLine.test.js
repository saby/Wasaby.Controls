define([
   'Controls/dragnDrop',
   'ControlsUnit/resources/ProxyCall'
], function(dragnDrop, ProxyCall) {
   'use strict';

   describe('Controls.dragnDrop.ResizingLine', function() {

      it('_offset', function() {
         let rlInstance = new dragnDrop.ResizingLine({});

         rlInstance._options = {
            minOffset: 300,
            maxOffset: 300,
            direction: 'direct'
         };
         let offset = rlInstance._offset(100);
         assert.strictEqual('left: 100%', offset.style, 'Wrong offset');
         assert.strictEqual(100, offset.value, 'Wrong offset');

         offset = rlInstance._offset(400);
         assert.strictEqual('left: 100%', offset.style, 'Wrong offset');
         assert.strictEqual(300, offset.value, 'Wrong offset');

         offset = rlInstance._offset(-100);
         assert.strictEqual('right: 0', offset.style, 'Wrong offset');
         assert.strictEqual(-100, offset.value, 'Wrong offset');

         offset = rlInstance._offset(-400);
         assert.strictEqual('right: 0', offset.style, 'Wrong offset');
         assert.strictEqual(-300, offset.value, 'Wrong offset');

         rlInstance._options.direction = 'reverse';

         offset = rlInstance._offset(100);
         assert.strictEqual('left: 0', offset.style, 'Wrong offset');
         assert.strictEqual(-100, offset.value, 'Wrong offset');

         offset = rlInstance._offset(400);
         assert.strictEqual('left: 0', offset.style, 'Wrong offset');
         assert.strictEqual(-300, offset.value, 'Wrong offset');

         offset = rlInstance._offset(-100);
         assert.strictEqual('right: 100%', offset.style, 'Wrong offset');
         assert.strictEqual(100, offset.value, 'Wrong offset');

         offset = rlInstance._offset(-400);
         assert.strictEqual('right: 100%', offset.style, 'Wrong offset');
         assert.strictEqual(300, offset.value, 'Wrong offset');
      });
      it('_isResizing', function() {
         var ctrl = new dragnDrop.ResizingLine({});

         assert.isFalse(ctrl._isResizing(0, 0));
         assert.isTrue(ctrl._isResizing(100, 0));
         assert.isTrue(ctrl._isResizing(0, 100));
         assert.isTrue(ctrl._isResizing(100, 100));
      });
   });
});
