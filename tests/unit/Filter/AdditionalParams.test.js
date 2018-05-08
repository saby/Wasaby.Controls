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
               resetValue: 1,
               visibility: true
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

         it('count items', function() {
            assert.equal(AddParams._private.countItems(items), 1);
         });

      });
   });
