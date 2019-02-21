define(['Controls/Filter/Button/Panel/Lookup'
], function(PanelLookup) {
   describe('Controls/Filter/Button/Panel/Lookup', function() {
      it('_beforeMount', function() {
         var panelLookup = new PanelLookup();

         panelLookup._beforeMount({
            selectedKeys: [1, 2, 3]
         });
         assert.isTrue(panelLookup._isSelected);

         panelLookup._beforeMount({
            selectedKeys: []
         });
         assert.isFalse(panelLookup._isSelected);
      });

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

         panelLookup._afterUpdate();
         assert.isFalse(panelLookup._isSelected);
         assert.isFalse(callResize);

         panelLookup._options.selectedKeys = [1];
         panelLookup._afterUpdate();
         assert.isTrue(panelLookup._isSelected);
         assert.isTrue(callResize);

         callResize = false;
         panelLookup._afterUpdate();
         assert.isFalse(callResize);
      });
   });
});
