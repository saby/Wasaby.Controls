define([
   'Controls/dragnDrop',
   'ControlsUnit/resources/ProxyCall'
], function(dragnDrop, ProxyCall) {
   'use strict';

   describe('Controls.dragnDrop.ResizingLine', function() {
      [{
         orientation: 'vertical',
         positions: ['top', 'bottom']
      }, {
         orientation: 'horizontal',
         positions: ['left', 'right']
      }].forEach(function(test) {
         it(`_offset orientation: ${test.orientation}`, function() {
            let rlInstance = new dragnDrop.ResizingLine({});

            rlInstance._options = {
               minOffset: 300,
               maxOffset: 300,
               direction: 'direct',
               orientation: test.orientation
            };

            let offset = rlInstance._offset(100);
            assert.strictEqual(`${test.positions[0]}: 100%`, offset.style, 'Wrong offset');
            assert.strictEqual(100, offset.value, 'Wrong offset');

            offset = rlInstance._offset(400);
            assert.strictEqual(`${test.positions[0]}: 100%`, offset.style, 'Wrong offset');
            assert.strictEqual(300, offset.value, 'Wrong offset');

            offset = rlInstance._offset(-100);
            assert.strictEqual(`${test.positions[1]}: 0`, offset.style, 'Wrong offset');
            assert.strictEqual(-100, offset.value, 'Wrong offset');

            offset = rlInstance._offset(-400);
            assert.strictEqual(`${test.positions[1]}: 0`, offset.style, 'Wrong offset');
            assert.strictEqual(-300, offset.value, 'Wrong offset');

            rlInstance._options.direction = 'reverse';

            offset = rlInstance._offset(100);
            assert.strictEqual(`${test.positions[0]}: 0`, offset.style, 'Wrong offset');
            assert.strictEqual(-100, offset.value, 'Wrong offset');

            offset = rlInstance._offset(400);
            assert.strictEqual(`${test.positions[0]}: 0`, offset.style, 'Wrong offset');
            assert.strictEqual(-300, offset.value, 'Wrong offset');

            offset = rlInstance._offset(-100);
            assert.strictEqual(`${test.positions[1]}: 100%`, offset.style, 'Wrong offset');
            assert.strictEqual(100, offset.value, 'Wrong offset');

            offset = rlInstance._offset(-400);
            assert.strictEqual(`${test.positions[1]}: 100%`, offset.style, 'Wrong offset');
            assert.strictEqual(300, offset.value, 'Wrong offset');
         });
      });

      it('isResizing', function() {
         var ctrl = new dragnDrop.ResizingLine({});

         assert.isFalse(ctrl._isResizing(0, 0));
         assert.isTrue(ctrl._isResizing(100, 0));
         assert.isTrue(ctrl._isResizing(0, 100));
         assert.isTrue(ctrl._isResizing(100, 100));
      });
   });
});
