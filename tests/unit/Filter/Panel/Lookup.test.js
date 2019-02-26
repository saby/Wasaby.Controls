define(['Controls/Filter/Button/Panel/Lookup'
], function(PanelLookup) {
   describe('Controls/Filter/Button/Panel/Lookup', function() {
      it('_afterUpdate', function() {
         var
            callResize = false,
            panelLookup = new PanelLookup();

         panelLookup._options.selectedKeys = [];
         panelLookup._children.controlResize = {
            start: function(){
               callResize = true;
            }
         };

         panelLookup._afterUpdate({selectedKeys: []});
         assert.isFalse(callResize);

         panelLookup._afterUpdate({selectedKeys: [2]});
         assert.isFalse(callResize);

         panelLookup._options.selectedKeys = [1];
         panelLookup._afterUpdate({selectedKeys: [2]});
         assert.isFalse(callResize);

         panelLookup._afterUpdate({selectedKeys: []});
         assert.isTrue(callResize);
      });
   });
});
