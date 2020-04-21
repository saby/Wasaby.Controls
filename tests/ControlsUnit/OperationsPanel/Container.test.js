define(['Controls/operations'], function(operations) {
   'use strict';
   describe('Controls/_operations/Panel/Container', function() {
      it('_getSelectedKeys', function() {
         let containerInstance = new operations.PanelContainer();

         assert.deepEqual(containerInstance._getSelectedKeys({
            listMarkedKey: null,
            selectedKeys: []
         }), []);

         assert.deepEqual(containerInstance._getSelectedKeys({
            listMarkedKey: 1,
            selectedKeys: []
         }), [1]);

         assert.deepEqual(containerInstance._getSelectedKeys({
            listMarkedKey: 1,
            selectedKeys: [2]
         }), [2]);
      });

      it('_beforeUpdate', function() {
         let containerInstance = new operations.PanelContainer();

         containerInstance._options.listMarkedKey = null;
         containerInstance._options.selectedKeys = [];

         containerInstance._beforeUpdate({
            listMarkedKey: 1,
            selectedKeys: []
         });
         assert.deepEqual(containerInstance._selectedKeys, [1]);
         assert.deepEqual(containerInstance._selectedKeysCount, 0);

         containerInstance._beforeUpdate({
            listMarkedKey: 1,
            selectedKeys: [2]
         });
         assert.deepEqual(containerInstance._selectedKeys, [2]);
         assert.isUndefined(containerInstance._selectedKeysCount);
      });
   });
});
