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
         assert.deepEqual(self._templateOptions.items, items);

         // Проверка на то что список элементов не будет меняться по ссылке
         self._templateOptions.items.push(10);
         assert.notDeepEqual(self._templateOptions.items, items);

         // Проверка что items не будут перезаписаны, если не подверглись изменениям(self._options.items === newOptions.items)
         self._options.items = items;
         self._templateOptions.items = items2;
         self._templateOptions = SelectedCollection._private.getTemplateOptions(self, self._options);
         assert.deepEqual(self._templateOptions.items, items2);
      });
   });
});