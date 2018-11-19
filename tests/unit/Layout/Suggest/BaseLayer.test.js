define(['Controls/Container/Suggest/__BaseLayer'], function(__LayerBase) {
   
   describe('Controls.Container.Suggest.__LayerBase', function() {
   
      it('__LayerBase::_getChildContext', function() {
         var baseLayer = new __LayerBase();
         baseLayer._options.filter = {test: 'test'};
         baseLayer._options.searchValue = 'test';
   
         assert.equal(baseLayer._getChildContext().searchLayoutField.searchValue, 'test');
         assert.deepEqual(baseLayer._getChildContext().filterLayoutField.filter, {test: 'test'});
      });
      
   });
   
});