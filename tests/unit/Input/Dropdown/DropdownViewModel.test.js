define(
   [
      'Controls/Dropdown/resources/DropdownViewModel',
      'WS.Data/Collection/RecordSet'
   ],
   (DropdownViewModel, RecordSet) => {
      describe('DropdownViewModel', () => {
         let rs = new RecordSet({
            idProperty: 'id',
            rawData: [
               {
                  id: '1',
                  title: 'Запись 1',
                  parent: null, '@parent': true
               },
               {
                  id: '2',
                  title: 'Запись 2',
                  parent: null, '@parent': false
               },
               {
                  id: '3',
                  title: 'Запись 3',
                  parent: null, '@parent': true
               },
               {
                  id: '4',
                  title: 'Запись 4',
                  parent: '1', '@parent': true
               },
               {
                  id: '5',
                  title: 'Запись 5',
                  parent: '4', '@parent': false
               },
               {
                  id: '6',
                  title: 'Запись 6',
                  parent: '4', '@parent': false
               },
               {
                  id: '7',
                  title: 'Запись 7',
                  parent: '3', '@parent': true
               },
               {
                  id: '8',
                  title: 'Запись 8',
                  parent: '7', '@parent': false
               }
            ]
         });

         let config = {
            items: rs,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: '@parent',
            selectedKeys: '3',
            rootKey: null
         };

         let viewModel = new DropdownViewModel(config);
         let viewModel2 = new DropdownViewModel(config);

         it('check hier items collection', () => {
            assert.equal(viewModel._itemsModel._options.items.length, 3);
         });

         it('check empty hierarchy', () => {
            let items = viewModel._getCurrentRootItems({
               items: rs
            });
            assert.equal(items.getCount(), 8);
         });

         it('items count', () => {
            assert.equal(viewModel.getCount(), 3);
         });

         it('check current item data', () => {
            viewModel.reset();
            viewModel.goToNext();
            viewModel.goToNext();
            let current = viewModel.getCurrent();
            let checkData = current.isSelected && current.hasChildren && current.item.get(config.keyProperty) === '3' && viewModel.isEnd();
            assert.isTrue(checkData);
         });

         it('destroy', () => {
            viewModel.destroy();
            assert.equal(viewModel._itemsModel.isDestroyed(), true);
         });
      })
   });