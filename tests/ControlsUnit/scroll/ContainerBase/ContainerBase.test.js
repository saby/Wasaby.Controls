define([
   'Controls/scroll'
], function(
   containerBase
) {
   'use strict';

   describe('Controls/scroll:ContainerBase', function() {
      describe('updateState', function() {
         it('should not update state if unchanged state arrives', function() {
            var inst = new containerBase.ContainerBase();
            inst._state = {
               scrollTop: 0
            };
            assert.isFalse(inst._updateState({ scrollTop: 0 }));
         });

         it('should update state if changed state arrives', function() {
            var inst = new containerBase.ContainerBase();
            const sandBox = sinon.createSandbox();
            sandBox.stub(inst, '_updateCalculatedState');
            inst._state = {
               scrollTop: 0
            };
            assert.isTrue(inst._updateState({ scrollTop: 1 }));
            sandBox.restore();
         });
      });
   });
});
