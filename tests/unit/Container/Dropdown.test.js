define(
   [
      'Controls/Container/Dropdown',
      'WS.Data/Source/Memory',
      'WS.Data/Collection/RecordSet'
   ],
   (Dropdown, Memory, RecordSet) => {
      describe('Container/Dropdown', () => {
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

         let itemsRecords = new RecordSet({
            idProperty: 'id',
            rawData: items
         });

         let config = {
            selectedKeys: '2',
            keyProperty: 'id',
            source: new Memory({
               idProperty: 'id',
               data: items
            })
         };

         let dropdownContainer = new Dropdown(config);
         dropdownContainer._options = config;
         beforeEach(() => {
            return new Promise((resolve) => {
               dropdownContainer.saveOptions({
               selectedKeys: '2',
               keyProperty: 'id'
            });
               dropdownContainer._beforeMount(config).addCallback(resolve);
            });
         });

         it('before mount', (done) => {
            dropdownContainer._beforeMount(config).addCallback(function (items) {
               assert.deepEqual(items.getRawData(), itemsRecords.getRawData());
               done();
            });
         });

         it('check received state', () => {
            dropdownContainer._beforeMount(config, null, itemsRecords);
         assert.deepEqual(dropdownContainer._items.getRawData(), itemsRecords.getRawData());
         });

         it('after mount', () => {
            let selectedItem;
            dropdownContainer._notify = (e, args) => {
               if ( e == 'selectedItemChanged') {
                  selectedItem = args[0];
               }
            };
            dropdownContainer._afterMount();
            assert.deepEqual(selectedItem, dropdownContainer._items.at(1));
         });

         it('check selectedItemsChanged event', () => {
            let selectedKeys,
               selectedItem;
            //subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
            //(дефолтный метод для vdom компонент который стреляет событием).
            //он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
            //событие и оно полетит с корректными параметрами.
            dropdownContainer._notify = (e, args) => {
               if (e == 'selectedKeysChanged') {
                  selectedKeys = args[0];
               } else if ( e == 'selectedItemChanged') {
                  selectedItem = args[0];
               }
            };
            Dropdown._private.selectItem.call(dropdownContainer, dropdownContainer._items.at(5));
            assert.equal(selectedKeys, '6');
            assert.deepEqual(selectedItem, dropdownContainer._items.at(5));

         });

         it('before update source', () => {
            items.push({
               id: '9',
               title: 'Запись 9'
            });
            return new Promise((resolve) => {
               dropdownContainer._beforeUpdate({
                  selectedKeys: '2',
                  keyProperty: 'id',
                  source: new Memory({
                     idProperty: 'id',
                     data: items
                  })
               }).addCallback(() => {
                  assert.equal(dropdownContainer._items.getCount(), items.length);
                  resolve();
               });
            });
         });

         it('open dropdown', () => {
            dropdownContainer._children.DropdownOpener = {
               close: setTrue.bind(this, assert),
               open: setTrue.bind(this, assert)
            };
            dropdownContainer._open();
         });

         it('notify footer click', () => {
            dropdownContainer._notify = (e) => {
               assert.equal(e, 'footerClick');
            };
            dropdownContainer._onResult(['footerClick', 'event'])
      });

         it('check item click', () => {
            dropdownContainer._notify = (e) => {
               assert.equal(e, 'selectedKeysChanged');
            };
            dropdownContainer._onResult(['itemClick', 'event', [dropdownContainer._items.at(4)]])
         });

         function setTrue(assert) {
            assert.equal(true, true);
         }
      });
});
