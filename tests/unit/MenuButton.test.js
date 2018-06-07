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
         menu.saveOptions(config);
   

         it('before update source', () => {
            items.push({
               id: '10',
               title: 'Запись 10'
            });
            menu._beforeUpdate({
               keyProperty: 'id',
               source: new Memory({
                  idProperty: 'id',
                  data: items
               })
            });
            assert.equal(menu._items, null);
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

         it('check item click', (done) => {
            menu._notify = (e) => {
               assert.equal(e, 'onMenuItemActivate');
            };
            menu._open();
            setTimeout(function () {
               menu._onResult(['itemClick', 'event', [menu._items.at(4)]]);
               done();
            }, 50);
         });

         function setTrue(assert) {
            assert.equal(true, true);
         }
      })
   });