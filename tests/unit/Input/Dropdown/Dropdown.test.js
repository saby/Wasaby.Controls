define(
   [
      'Controls/Input/Dropdown',
      'Core/core-clone',
      'Types/source',
      'Types/collection'
   ],
   (Dropdown, Clone, sourceLib, collection) => {
      describe('Input/Dropdown', () => {
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

         let itemsRecords = new collection.RecordSet({
            idProperty: 'id',
            rawData: items
         });

         let config = {
            selectedKeys: ['2'],
            displayProperty: 'title',
            keyProperty: 'id',
            source: new sourceLib.Memory({
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
            let ddl = getDropdown(config),
               text;
            ddl._notify = (e, data) => {
               if (e === 'textValueChanged') {
                  text = data[0];
               }
            };
            let newConfig = Clone(config);
            newConfig.selectedKeys = ['8'];
            ddl._text = 'Запись 8';
            ddl._afterUpdate(newConfig);
            assert.equal(text, 'Запись 8');
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

         it('_setText emptyText=true', () => {
            let newConfig = Clone(config);
            newConfig.emptyText = true;
            let ddl = getDropdown(newConfig);
            ddl._setText([null]);
            assert.equal(ddl._text, 'Не выбрано');
            assert.isNull(ddl._icon);
            ddl._setText([{id: null}]);
            assert.equal(ddl._text, 'Не выбрано');
            assert.isNull(ddl._icon);
         });
      });
   }
);
