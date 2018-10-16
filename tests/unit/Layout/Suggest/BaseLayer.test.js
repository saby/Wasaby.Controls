define(['Controls/Container/Suggest/__BaseLayer'], function(__LayerBase) {
   
   var getContextValues = function() {
     return {
        searchValue: 'text',
        filter: {
           searchValue: 'text'
        }
     };
   };
   
   describe('Controls.Container.Suggest.__LayerBase', function() {
      
      it('Suggest::setLayerContext', function() {
         var baseLayer = new __LayerBase();
         baseLayer.setLayerContext(getContextValues());
         
         assert.equal(baseLayer._searchLayoutField.searchValue, 'text');
         assert.deepEqual(baseLayer._filterLayoutField.filter, {
            searchValue: 'text'
         });
      });
   
      it('Suggest::updateLayerContext', function() {
         var baseLayer = new __LayerBase();
         baseLayer.setLayerContext(getContextValues());
         var contextFilter = baseLayer.getLayerContext().filterLayoutField.filter;
         baseLayer.updateLayerContext(getContextValues());
         assert.isTrue(contextFilter !== baseLayer.getLayerContext().filterLayoutField.filter);
      });
   
      it('Suggest::getLayerContext', function() {
         var baseLayer = new __LayerBase();
         baseLayer.setLayerContext(getContextValues());
         var context = baseLayer.getLayerContext();
   
         assert.equal(context.searchLayoutField.searchValue, 'text');
         assert.deepEqual(context.filterLayoutField.filter, {
            searchValue: 'text'
         });
      });
      
   });
   
});