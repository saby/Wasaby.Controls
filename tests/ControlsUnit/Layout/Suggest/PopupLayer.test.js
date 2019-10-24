define(['Controls/_suggestPopup/Layer/__PopupLayer'], function(PopupLayer) {

   describe('Controls._suggestPopup.Layer.__PopupLayer', function() {

      it('_private.getPopupClassName', function() {
         assert.equal(PopupLayer.default._private.getPopupClassName('top'), 'controls-Suggest__suggestionsContainer_popup_top');
         assert.equal(PopupLayer.default._private.getPopupClassName('bottom'), 'controls-Suggest__suggestionsContainer_popup_bottom');
      });

      it('_onResult', function() {
         var layer = new PopupLayer.default();
         var resultPopupOptions = {
            direction: {
               vertical: 'test',
               horizontal: 'test'
            },
            offset: {
               vertical: 10,
               horizontal: 20
            },
            targetPoint: {side: 'test'},
            className: 'controls-Suggest__suggestionsContainer_popup_test',
            fittingMode: 'fixed'
         };

         layer._popupOptions = {};

         layer._onResult({
            verticalAlign: {side: 'test', offset: 10},
            horizontalAlign: {side: 'test', offset: 20},
            targetPoint: {side: 'test'}
         });

         assert.deepEqual(resultPopupOptions, layer._popupOptions)
      });

      it('_resizeCallback', function() {
         var layer = new PopupLayer.default();
         var resizeCalled = false;

         layer._children = {
            popupContent: {
               resize: () => {
                  resizeCalled = true;
               }
            }
         };

         layer._resizeCallback();
         assert.isTrue(resizeCalled);

         resizeCalled = false;
         layer._children = {};
         layer._resizeCallback();
         assert.isFalse(resizeCalled);
      });

   });

});
