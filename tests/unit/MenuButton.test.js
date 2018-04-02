define(
   [
       'Controls/Button/MenuButton',
      'WS.Data/Source/Memory'
   ],
   (MenuButton, Memory) => {
      describe('MenuButton', () => {
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
               title: 'Запись 3',
               icon: 'icon-medium icon-Doge icon-primary'
            },
            {
               id: '4',
               title: 'Запись 4'
            },
            {
               id: '5',
               title: 'Запись 5'
            },
            {
               id: '6',
               title: 'Запись 6'
            },
            {
               id: '7',
               title: 'Запись 7'
            },
            {
               id: '8',
               title: 'Запись 8'
            }
         ];

         let config = {
            icon: 'icon-medium icon-Doge icon-primary',
            style: 'linkMain',
            keyProperty: 'id',
            source: new Memory({
               idProperty: 'id',
               data: items
            })
         };

         let menu = new MenuButton(config);

         it('check received state', () => {
             menu._beforeMount(config, null, items);
            assert.equal(menu._items, items);
         });

         it('before mount source', () => {
         items.push({
            id: '9',
            title: 'Запись 9'
         });
         return new Promise((resolve) => {
                  menu._beforeMount({
                  keyProperty: 'id',
                  source: new Memory({
                     idProperty: 'id',
                     data: items
                  })
              }).addCallback(() => {
                  assert.equal(menu._items.getCount(), items.length);
                  resolve();
               });
            });
         });

         it('before update source', () => {
            items.push({
               id: '10',
               title: 'Запись 10'
            });
            return new Promise((resolve) => {
               menu._beforeUpdate({
                  keyProperty: 'id',
                  source: new Memory({
                     idProperty: 'id',
                     data: items
                  })
               }).addCallback(() => {
                  assert.equal(menu._items.getCount(), items.length);
                  resolve();
               });
            });
         });

         it('open menu', () => {
            menu._children.DropdownOpener = {
               close: setTrue.bind(this, assert),
               open: setTrue.bind(this, assert)
            };
            menu._children.popupTarget = {
               _container: 'target'
            };
            menu._open();
         });

         it('check item click', () => {
            menu._notify = (e) => {
               assert.equal(e, 'onMenuItemActivate');
            };
            menu._onResult(['itemClick', 'event', [menu._items.at(4)]]);
         });

         function setTrue(assert) {
            assert.equal(true, true);
         }
      })
   });