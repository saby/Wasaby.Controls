define(['Controls/Selector/SelectedCollection'], function(SelectedCollection) {
   describe('Controls/Selector/SelectedCollection', function() {
      it('getTemplateOptions', function() {
         var
            items = [1, 2, 3, 4],
            items2 = [1, 5, 7],
            self = {
               _options: {},
               _onResult: function(){}
            };


         self._templateOptions = SelectedCollection._private.getTemplateOptions(self, {
            items: items
         });
         assert.isFalse(!!self._templateOptions.items);

         items.clone = function(){ return items.slice(); };
         self._templateOptions = SelectedCollection._private.getTemplateOptions(self, {
            items: items
         });
         assert.deepEqual(self._templateOptions.items, items);

         self._options.items = items;
         self._templateOptions.items = items2;
         self._templateOptions = SelectedCollection._private.getTemplateOptions(self, self._options);
         assert.deepEqual(self._templateOptions.items, items2);
      });
   });
});