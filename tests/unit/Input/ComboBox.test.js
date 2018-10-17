define(
   [
      'Controls/Input/ComboBox',
      'Core/core-clone',
      'WS.Data/Source/Memory',
      'WS.Data/Collection/RecordSet'
   ],
   (Combobox, Clone, Memory, RecordSet) => {
      describe('Combobox', () => {
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


         let getCombobox = function(config) {
            let Combobox = new Combobox(config);
            Combobox.saveOptions(config);
            return Combobox;
         };
         let Combobox = new Combobox(config);

         it('_afterUpdate', () => {
            let ddl = getCombobox(config);
            ddl._notify = (e, data) => {
               assert.deepEqual(data[0], 'Запись 8');
            };
            let newConfig = Clone(config);
            newConfig.selectedKeys = ['8'];
            ddl._beforeUpdate(newConfig);
         });

         it('data load callback', () => {
            let ddl = getCombobox(config);
            ddl._setText([itemsRecords.at(5)]);
            assert.equal(ddl._text, 'Запись 6');
            assert.equal(ddl._icon, 'icon-16 icon-Admin icon-primary');
         });

         it('check selectedItemsChanged event', () => {
            let ddl = getCombobox(config);
            ddl._notify = (e, data) => {
               if (e === 'selectedKeysChanged') {
                  assert.deepEqual(data[0], ['6']);
               }
            };
            ddl._selectedItemsChangedHandler('itemClick', [itemsRecords.at(5)]);
         });
      });
   }
);
