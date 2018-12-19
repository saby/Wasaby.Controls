define(['Controls/Container/Suggest/__ContentLayer'], function(__ContentLayer) {
   
   describe('Controls.Container.Suggest.__ContentLayer', function() {
      
      
      var getComponentObject = function() {
         var self = {};
         self._options = {};
         self._options.suggestTemplate = {};
         self._options.footerTemplate = {};
         return self;
      };
      
      var getContainer = function(size) {
         return {
            getBoundingClientRect: function() {
               return {
                  toJSON: function() {
                     return size;
                  }
               };
            }
         };
      };
      
      var getDropDownContainer = function(height) {
         return {
            getBoundingClientRect: function() {
               return {
                  bottom: 0,
                  top: 0,
                  height: height
               };
            }
         };
      };
      
      it('Suggest::_close', function() {
         var suggestComponent = new __ContentLayer();
         var closed = false;
         
         suggestComponent._notify = function(event) {
            if (event === 'closeButtonClick') {
               closed = true;
            }
         };
         suggestComponent._close();
         assert.isTrue(closed);
      });
   
      it('Suggest::_getChildContext', function() {
         var suggestComponent = new __ContentLayer();
         var context;
         var afterUpdateContext;
         var contextFilterValue;
         var contextSearchValue;
         var afterUpdateFilterValue;
         var afterUpdateSearchValue;
      
         suggestComponent._options.filter = {test: 'test'};
         suggestComponent._options.searchValue = 'test';
         suggestComponent._beforeMount(suggestComponent._options);
         
         context = suggestComponent._getChildContext();
         contextFilterValue = context.filterLayoutField.filter;
         contextSearchValue = context.searchLayoutField.searchValue;
         
         var newOptions = {
            filter: {test: 'test2'},
            searchValue: 'test2'
         };
         suggestComponent._beforeUpdate(newOptions);
         
         afterUpdateContext = suggestComponent._getChildContext();
         afterUpdateFilterValue = afterUpdateContext.filterLayoutField.filter;
         afterUpdateSearchValue = afterUpdateContext.searchLayoutField.searchValue;
      
         assert.isTrue(contextFilterValue !== afterUpdateFilterValue);
         assert.isTrue(contextSearchValue !== afterUpdateSearchValue);
      });
      
      it('Suggest::_private.calcHeight', function() {
         var self = getComponentObject();
         var suggestHeight = 200;
   
         self._container =  getContainer({
            top: 0,
            bottom: 0,
            get height() {
               return suggestHeight;
            }
         });
         self._options.target = getContainer({
            bottom: 324,
            top: 300
         });
         self._height = 'auto';
         assert.equal(__ContentLayer._private.calcHeight(self, getDropDownContainer(900)), 'auto');
         assert.equal(__ContentLayer._private.calcHeight(self, getDropDownContainer(400)), '76px');
      });
      
   });
   
});