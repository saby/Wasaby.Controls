define(
   [
      'Controls/Input/Dropdown',
      'WS.Data/Source/Memory'
   ],
   (Dropdown, Memory) => {
      describe('Dropdown', () => {
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
               icon: 'icon-16 icon-Admin icon-primary'
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
            selectedKeys: '2',
            keyProperty: 'id',
            source: new Memory({
               idProperty: 'id',
               data: items
            })
         };

         let dropdownList = new Dropdown(config);
         dropdownList._beforeMount(config);
         dropdownList.saveOptions(config);

         it('check selected text', () => {
            assert.equal(dropdownList._text, 'Запись 2');
         });

         it('check selectedItemsChanged event', () => {
            let selectedKeys;
            //subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
            //(дефолтный метод для vdom компонент который стреляет событием).
            //он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
            //событие и оно полетит с корректными параметрами.
            dropdownList._notify = (e, args) => {
               selectedKeys = args[0];
            };
            dropdownList._selectItem(dropdownList._items.at(5));
            assert.deepEqual(selectedKeys, '6');
         });

         it('check selected icon', () => {
            dropdownList._beforeUpdate({selectedKeys: '3'});
            assert.equal(dropdownList._icon, 'icon-16 icon-Admin icon-primary');
         });
      })
   });