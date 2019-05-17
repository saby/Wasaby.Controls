define(['Controls/_filterPopup/Panel/Lookup'
], function(PanelLookup) {
   describe('Controls/_filterPopup/Panel/Lookup', function() {
      it('_afterUpdate', function() {
         var
            isActivate = false,
            callResize = false,
            panelLookup = new PanelLookup();

         panelLookup._options.selectedKeys = [];
         panelLookup._options.lookupTemplateName = 'string';
         panelLookup._children.controlResize = {
            start: function(){
               callResize = true;
            }
         };
         panelLookup._children.lookup = {
            activate: function() {
               isActivate = true;
            }
         };

         panelLookup._afterUpdate({selectedKeys: []});
         assert.isFalse(callResize);
         assert.isFalse(isActivate);

         panelLookup._afterUpdate({selectedKeys: [2]});
         assert.isFalse(callResize);
         assert.isFalse(isActivate);

         panelLookup._options.selectedKeys = [1];
         panelLookup._afterUpdate({selectedKeys: [2]});
         assert.isFalse(callResize);
         assert.isFalse(isActivate);

         panelLookup._afterUpdate({selectedKeys: []});
         assert.isTrue(callResize);
         assert.isTrue(isActivate);
      });

      it('showSelector', function() {
         var
            isShowSelector = false,
            pLookup = new PanelLookup();


         pLookup._children.lookup = {
            showSelector: function() {
               isShowSelector = true;
            }
         };

         pLookup._options.content = {};
         pLookup.showSelector();
         assert.isFalse(isShowSelector);

         pLookup._options.lookupTemplateName = 'string';
         pLookup.showSelector();
         assert.isTrue(isShowSelector);
      });
   });
});
