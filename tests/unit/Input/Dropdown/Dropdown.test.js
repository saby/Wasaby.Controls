define(
   [
      'Controls/Input/Dropdown',
      'Core/core-clone',
      'WS.Data/Source/Memory',
      'WS.Data/Collection/RecordSet'
   ],
   (Dropdown, Clone, Memory, RecordSet) => {
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
               title: 'Запись 3'
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
               title: 'Запись 6',
               icon: 'icon-16 icon-Admin icon-primary'
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
            selectedKeys: ['2'],
            displayProperty: 'title',
            keyProperty: 'id',
            source: new Memory({
               idProperty: 'id',
               data: items
            })
         };


         let getDropdown = function(config) {
            let dropdownList = new Dropdown(config);
            dropdownList.saveOptions(config);
            return dropdownList;
         };
         let dropdownList = new Dropdown(config);

         it('_afterUpdate', () => {
            let ddl = getDropdown(config);
            ddl._notify = (e, data) => {
               assert.deepEqual(data[0], 'Запись 8');
            };
            let newConfig = Clone(config);
            newConfig.selectedKeys = ['8'];
            ddl._beforeUpdate(newConfig);
         });

         it('data load callback', () => {
            let ddl = getDropdown(config);
            ddl._setText([itemsRecords.at(5)]);
            assert.equal(ddl._text, 'Запись 6');
            assert.equal(ddl._icon, 'icon-16 icon-Admin icon-primary');
            ddl._setText([{ id: null }]);
            assert.equal(ddl._icon, null);
         });

         it('check selectedItemsChanged event', () => {
            let ddl = getDropdown(config);
            ddl._notify = (e, data) => {
               if (e === 'selectedKeysChanged') {
                  assert.deepEqual(data[0], ['6']);
               }
            };
            ddl._selectedItemsChangedHandler('itemClick', [itemsRecords.at(5)]);
         });

         it('dataLoadCallback empty items', () => {
            let ddl = getDropdown(config);
            ddl._setText([]);
            assert.equal(ddl._text, '');
         });
      });
   }
);
