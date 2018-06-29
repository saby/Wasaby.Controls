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

         it('check item click', () => {
            menu._notify = (e) => {
               assert.equal(e, 'onMenuItemActivate');
            };
            menu._onItemClickHandler('itemClick', [{
               id: '1',
               title: 'Запись 1'
            }]);
         });
      })
   });