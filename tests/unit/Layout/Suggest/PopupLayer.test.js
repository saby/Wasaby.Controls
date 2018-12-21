define(['Controls/Container/Suggest/__PopupLayer'], function(PopupLayer) {
   
   describe('Controls.Container.Suggest.__PopupLayer', function() {
      
      it('_private.getPopupClassName', function() {
         assert.equal(PopupLayer._private.getPopupClassName('top'), 'controls-Suggest__suggestionsContainer_popup_top');
         assert.equal(PopupLayer._private.getPopupClassName('bottom'), 'controls-Suggest__suggestionsContainer_popup_bottom');
      });
      
      it('_onResult', function() {
         var layer = new PopupLayer();
         var resultPopupOptions = {
            verticalAlign: {side: 'test'},
            horizontalAlign: {side: 'test'},
            corner: {side: 'test'},
            className: 'controls-Suggest__suggestionsContainer_popup_test',
            locationStrategy: 'fixed'
         };
         
         layer._popupOptions = {};
         
         layer._onResult({
            verticalAlign: {side: 'test'},
            horizontalAlign: {side: 'test'},
            corner: {side: 'test'}
         });
         
         assert.deepEqual(resultPopupOptions, layer._popupOptions)
      });
      
   });
   
});