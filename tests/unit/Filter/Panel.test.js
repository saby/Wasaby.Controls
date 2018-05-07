define(
   [
      'Controls/Filter/Button/Panel'
   ],
   function(FilterPanel) {
      describe('FilterPanelVDom', function() {
         var template = 'tmpl!Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/filterItemsTemplate';
         var config = {},
            items = [
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
         config.items = items;
         config.itemTemplate = template;

         var panel = new FilterPanel(config);
         var isNotifyClose,
            filter;

         panel._notify = (e, args) => {
            if (e == 'close') {
               isNotifyClose = true;
            } else if (e == 'sendResult') {
               filter = args[0];
            }
         };

         it('Init', function() {
            panel._beforeMount(config);
            assert.deepEqual(panel._items, config.items);
            assert.isTrue(panel._isChanged);
         });

         it('before update', function() {
            config.items[2].visibility = false;
            panel._beforeMount(config);
            panel._beforeUpdate();
            assert.isTrue(panel._isChanged);
            assert.isTrue(panel._hasAdditionalParams);
         });

         it('apply', function() {
            isNotifyClose = false;
            panel._beforeMount(config);
            panel._applyFilter();
            assert.deepEqual({text: '123'}, filter);
            assert.isTrue(isNotifyClose);
         });

         it('reset and filter', function() {
            panel._beforeMount(config);
            panel._resetFilter();
            assert.deepEqual({}, FilterPanel._private.getFilter(panel));
            assert.isFalse(panel._isChanged);
         });

         it('isChangeValue', function() {
            panel._beforeMount(config);
            panel._resetFilter();
            assert.isFalse(FilterPanel._private.isChangedValue(panel._items));
         });

         it('without add params', function() {
            items[2].visibility = true;
            assert.isFalse(FilterPanel._private.hasAdditionalParams(items));
         });

         it('Close', function() {
            isNotifyClose = false;
            panel._close();
            assert.isTrue(isNotifyClose);
         });
      });
   });
