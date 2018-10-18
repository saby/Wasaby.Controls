define(
   [
      'Controls/Filter/Button/Panel/AdditionalParams'
   ],
   function(AddParams) {
      describe('FilterPanelAdditionalVDom', function() {

         var items = [
            {
               id: 'list',
               value: 1,
               resetValue: 1
            },
            {
               id: 'text',
               value: '123',
               resetValue: '',
               visibility: true
            },
            {
               id: 'bool',
               value: true,
               resetValue: false,
               visibility: false
            }
         ];

         var addParams = new AddParams();
         addParams.saveOptions({items: items});
         addParams._beforeMount({items: items});

         it('is visible', function() {
            assert.equal(addParams._isItemVisible(items[0]), true);
            assert.equal(addParams._isItemVisible(items[1]), true);
            assert.equal(addParams._isItemVisible(items[2]), false);
         });

         it('count items', function() {
            assert.equal(AddParams._private.countItems(addParams, items), 1);
         });

         it('_valueChangedHandler', function() {
            addParams._valueChangedHandler('valueChanged', 2, undefined);
            assert.equal(true, addParams._options.items[2].value);
            addParams._valueChangedHandler('valueChanged', 2, 'newValue');
            assert.equal('newValue', addParams._options.items[2].value);
         });

      });
   });
