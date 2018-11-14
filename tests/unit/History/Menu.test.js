define(
   [
      'Controls/History/Menu',
      'WS.Data/Source/Memory',
      'Core/core-clone',
      'WS.Data/Entity/Model'
   ],
   function(Menu, Memory, Clone, Model) {
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
         source: new Memory({
            data: items,
            idProperty: 'id'
         })
      };

      var getHistoryMenu = function(config) {
         var hMenu = new Menu(config);
         hMenu.saveOptions(config);
         return hMenu;
      };

      describe('Controls/History/Menu', function() {
         it('_private.getMetaPinned', function() {
            var item = new Model({
               rawData: {
                  pinned: false
               }
            });

            assert.deepEqual(Menu._private.getMetaPinned(item), {
               $_pinned: true
            });
         });
         it('_beforeMount', function() {
            var menu = getHistoryMenu(menuConfig);
            menu._beforeMount(menuConfig);
            assert.equal(menu._offsetClassName, 'controls-MenuButton controls-MenuButton_link_small');
         });
         it('_beforeUpdate', function() {
            var menu = getHistoryMenu(menuConfig);
            var newConfig = Clone(menuConfig);
            newConfig.viewMode = 'button';
            menu._beforeUpdate(newConfig);
            assert.equal(menu._offsetClassName, 'controls-MenuButton controls-MenuButton_button_small');
            newConfig.size = 'm';
            newConfig.icon = '';
            menu._beforeUpdate(newConfig);
            assert.equal(menu._offsetClassName, 'controls-MenuButton controls-MenuButton_button');
         });
      });
   }
);
