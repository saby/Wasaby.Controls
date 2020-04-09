define(
   [
      'Vdom/Vdom',
      'Controls/input'
   ],
   function(Vdom, input) {
      'use strict';

      describe('Controls/input:InsertFromDrop', function() {
         let inst;
         const data = {
            oldPosition: 5,
            newPosition: 10,
            oldValue: 'my my',
            newValue: 'my my test'
         };
         beforeEach(function() {
            inst = new input.__InsertFromDrop();
         });
         it('Перемещение значения в начало.', function() {
            const event = new Vdom.SyntheticEvent({
               target: {
                  selectionStart: 0,
                  selectionEnd: 0
               }
            });
            inst.focusHandler(event);
            const res = inst.positionForInputProcessing(data);
            assert.deepEqual(res, {
               oldPosition: 0,
               newPosition: 5,
               oldValue: 'my my',
               newValue: ' testmy my'
            });
         });
         it('Перемещение значения в начало. С отменой действия после фокусировки.', function() {
            const event = new Vdom.SyntheticEvent({
               target: {
                  selectionStart: 0,
                  selectionEnd: 0
               }
            });
            inst.focusHandler(event);
            inst.cancel();
            const res = inst.positionForInputProcessing(data);
            assert.equal(res, data);
         });
      });
   }
);
