define(
   [
      'Controls/history',
      'Types/source',
      'Core/core-clone',
      'Types/entity',
      'Core/Deferred'
   ],
   function(history, sourceLib, Clone, entity, Deferred) {
      'use strict';

      let items = [
         {
            id: '1',
            title: 'Запись 1'
         },
         {
            id: '2',
            title: 'Запись 2'
         },
         {
            id: '3',
            title: 'Запись 3'
         }
      ];

      var menuConfig = {
         filter: { id: 'test' },
         viewMode: 'link',
         icon: 'icon-small',
         showHeader: true,
         source: new sourceLib.Memory({
            data: items,
            idProperty: 'id'
         })
      };

      var getHistoryMenu = function(config) {
         var hMenu = new history.Menu(config);
         hMenu.saveOptions(config);
         return hMenu;
      };

      describe('Controls/_history/Menu', function() {
         it('_private.getMetaPinned', function() {
            var item = new entity.Model({
               rawData: {
                  pinned: false
               }
            });

            assert.deepEqual(history.Menu._private.getMetaPinned(item), {
               $_pinned: true
            });
         });
         it('_beforeMount', function() {
            var menu = getHistoryMenu(menuConfig);
            menu._beforeMount(menuConfig);
            assert.equal(menu._offsetClassName, 'controls-MenuButton_link_iconSize-small_popup');
         });
         it('_beforeUpdate', function() {
            var menu = getHistoryMenu(menuConfig);
            var newConfig = Clone(menuConfig);
            newConfig.viewMode = 'button';
            menu._beforeUpdate(newConfig);
            assert.equal(menu._offsetClassName, 'controls-MenuButton_button_iconSize-small_popup');
            newConfig.size = 'm';
            newConfig.icon = '';
            menu._beforeUpdate(newConfig);
            assert.equal(menu._offsetClassName, 'controls-MenuButton_button__m_popup');
            newConfig.size = 's';
            menu._beforeUpdate(newConfig);
            assert.equal(menu._offsetClassName, 'controls-MenuButton_button__s_popup');
         });
         it('_onPinClickHandler', function() {
            var newConfig = Clone(menuConfig);
            newConfig.source = new history.Source({
               originSource: new sourceLib.Memory({
                  idProperty: 'id',
                  data: items
               }),
               historySource: new history.Service({
                  historyId: 'TEST_HISTORY_ID'
               }),
               parentProperty: 'parent'
            });
            newConfig.source.update = function(item) {
               item.set('pinned', true);
               return Deferred.success(false);
            };
            var menu = getHistoryMenu(newConfig);
            menu._children = {
               notificationOpener: {
                  open: (popupOptions) => {
                     assert.deepEqual(popupOptions, {
                        template: 'Controls/popupTemplate:NotificationSimple',
                        templateOptions: {
                           style: 'error',
                           text: 'Невозможно закрепить более 10 пунктов',
                           icon: 'Alert'
                        }
                     });
                  }
               }
            };
            let pinnedItem = new entity.Model({
               rawData: {
                  pinned: false
               }
            });
            menu._onPinClickHandler('pinClicked', [pinnedItem]);
            assert.isFalse(pinnedItem.get('pinned'));
         });
      });
   }
);
