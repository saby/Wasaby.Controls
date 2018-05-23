define(
   [
      'Controls/Filter/Button/Panel'
   ],
   function(FilterPanel) {
      describe('FilterPanelVDom', function() {
         var config = {},
            items = [
               {
                  id: 'list',
                  value: 1,
                  resetValue: 1,
                  editor: 'Controls/Filter/Panel/Editor/Keys'
               },
               {
                  id: 'text',
                  value: '123',
                  resetValue: '',
                  editor: 'Controls/Filter/Panel/Editor/Text'
               },
               {
                  id: 'bool',
                  value: true,
                  resetValue: false,
                  editor: 'Controls/Filter/Panel/Editor/Boolean',
                  content: 'Controls/Button'
               }
            ];
         config.items = items;

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

         it('apply', function() {
            isNotifyClose = false;
            panel._beforeMount(config);
            panel._applyFilter();
            assert.deepEqual({text: '123', bool: true}, filter);
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

         it('Close', function() {
            isNotifyClose = false;
            panel._close();
            assert.isTrue(isNotifyClose);
         });
      });
   });
