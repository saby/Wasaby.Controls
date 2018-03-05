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
         it('check received state', () => {
            dropdownList._beforeMount(config, null, items);
            assert.equal(dropdownList._items, items);
         });

         it('check selected text', () => {
            //Запоминаю нормальные опции
            dropdownList._beforeMount(config).addCallback(() => {
               dropdownList.saveOptions({
                  selectedKeys: '2',
                  keyProperty: 'id'
               });
               assert.equal(dropdownList._text, 'Запись 2');
            });
         });

         it('update text', () => {
            dropdownList._beforeMount(config).addCallback(() => {
               let items = dropdownList._items;
               let text = dropdownList._updateText(items.at(0), 'title');
               assert.equal(text, 'Запись 1');
            });
         });

         it('check selectedItemsChanged event', () => {
            dropdownList._beforeMount(config).addCallback(() => {
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

         });

         it('check selected icon', () => {
            dropdownList._beforeMount(config).addCallback(() => {
               dropdownList._beforeUpdate({selectedKeys: '3'});
               assert.equal(dropdownList._icon, 'icon-16 icon-Admin icon-primary');
            });
         });

         it('before update source', () => {
            items.push({
               id: '9',
               title: 'Запись 9'
            });
            dropdownList._beforeUpdate({
               source: new Memory({
                  idProperty: 'id',
                  data: items
               })
            }).addCallback(() => {
               assert.equal(dropdownList._items.getCount(), items.length);
            })
         });

         it('open dropdown', () => {
            dropdownList._children.DropdownOpener = {
               close: setTrue.bind(this, assert),
               open: setTrue.bind(this, assert)
            };
            dropdownList._open();
         });

         it('notify footer click', () => {
            dropdownList._notify = (e) => {
               assert.equal(e, 'footerClick');
            };
            dropdownList._onResult(['footerClick', 'event'])
         });

         it('check item click', () => {
            dropdownList._notify = (e) => {
               assert.equal(e, 'selectedKeysChanged');
            };
            dropdownList._beforeMount(config).addCallback(() => {
               dropdownList._onResult(['itemClick', 'event', [dropdownList._items.at(4)]])
            });
         });

         function setTrue(assert) {
            assert.equal(true, true)
         }
      })
   });