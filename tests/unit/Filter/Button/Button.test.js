define(
   [
      'Controls/Filter/Button'
   ],
   function(FilterButton) {
      describe('FilterButton', function() {

         var button = new FilterButton();

         var filterItems = [
            {id: 'FIO', value: 'Petrov K.K.', resetValue: '', textValue: 'Petrov K.K.', visibility: true},
            {id: 'firstName', value: '', resetValue: '', visibility: true},
            {id: 'Test1', value: [0], resetValue: [0], textValue: '', visibility: false},
            {id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: true},
            {id: 'id', value: [2], resetValue: [2], visibility: false}
         ];

         var filterItemsReseted = [
            {id: 'FIO', value: '', resetValue: '', textValue: 'Petrov K.K.', visibility: false},
            {id: 'firstName', value: '', resetValue: '', visibility: false},
            {id: 'Test1', value: [0], resetValue: [0], textValue: '', visibility: false},
            {id: 'unread', value: false, resetValue: false, textValue: 'Unread', visibility: false},
            {id: 'id', value: [2], resetValue: [2], visibility: false}
         ];

         button._beforeMount({items: filterItems});

         it('_beforeMount', function() {
            button._beforeMount({items: filterItems});
            assert.deepEqual(filterItems, button._items);
         });

         it('get text', function() {
            var text = FilterButton._private.getText(filterItems);
            assert.equal(text, 'Petrov K.K., Unread');
         });

         it('reset items', function() {
            FilterButton._private.resetItems(button, filterItems);
            assert.deepEqual(filterItems, filterItemsReseted);
         });

         it('clear click', function() {
            var items = [];
            button._notify = (e, args) => {
               if (e == 'itemsChanged') {
                  items = args[0];
               }
            };
            button._beforeMount(filterItems);
            button._clearClick();
            assert.deepEqual(items, filterItemsReseted);
            assert.equal(button._text, '');
         });
      });
   });
