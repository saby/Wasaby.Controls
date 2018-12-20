define(['Controls/List/Container'], function(Container) {
   
   describe('Controls.List.Container', function() {
      
      it('_beforeUpdate', function() {
         var indicatorVisible = false;
         var options = {loading: false};
         var listContainer = new Container(options);
         listContainer.saveOptions(options);
         listContainer._children = {
            indicator: {
               hide: function() {
                  indicatorVisible = false;
               },
               show: function() {
                  indicatorVisible = true;
               }
            }
         };
   
         listContainer._beforeUpdate({loading: true});
         assert.isTrue(indicatorVisible);
   
         listContainer._beforeUpdate({loading: false});
         assert.isFalse(indicatorVisible);
      });
      
   });
});
