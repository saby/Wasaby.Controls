define(['Controls/Selector/List/Container', 'WS.Data/Entity/Model'], function(Container, Model) {
   
   
   describe('Controls.Selector.Container.List', function() {
      
      it('resolveOptions', function() {
         var options = {
            selectedKeys: [1, 2, 3]
         };
         var self = {
            _markedKey: null,
         };
         
         Container._private.resolveOptions(self, options);
         
         assert.deepEqual(self._selectedKeys, [1, 2, 3]);
         assert.equal(self._markedKey, null);
   
         options = {
            selectedKeys: [1]
         };
         Container._private.resolveOptions(self, options);
         assert.equal(self._markedKey, 1);
      });
      
      it('getItemClickResult', function() {
         var itemKey;
         var selectedKeys = [1, 2, 3];
         
         itemKey = 4;
         assert.deepEqual(Container._private.getItemClickResult(itemKey, selectedKeys), [[1, 2, 3, 4], [4], []]);
   
         itemKey = 1;
         assert.deepEqual(Container._private.getItemClickResult(itemKey, selectedKeys), [[2, 3], [], [1]]);
      });
   
      it('itemClick', function() {
         var self = {};
         var selectCompleted = false;
         var clickSelection = false;
         
         self._notify = function(eventName) {
            if (eventName === 'listSelectionChange') {
               clickSelection = true;
            }
            if (eventName === 'selectComplete') {
               selectCompleted = true;
            }
         };
   
         Container._private.itemClick(self, 'test', false, []);
         assert.isTrue(selectCompleted);
         assert.isTrue(clickSelection);
   
         selectCompleted = false;
         clickSelection = false;
         Container._private.itemClick(self, 'test', true, []);
         assert.isTrue(selectCompleted);
         assert.isTrue(clickSelection);
   
         selectCompleted = false;
         clickSelection = false;
         Container._private.itemClick(self, 'test', true, [1]);
         assert.isTrue(clickSelection);
         assert.isFalse(selectCompleted);
      });
   
   });
   
});