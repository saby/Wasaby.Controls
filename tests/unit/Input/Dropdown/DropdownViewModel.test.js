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
                  parent: '1', '@parent': true,
                  additional: true
               },
               {
                  id: '5',
                  title: 'Запись 5',
                  parent: '4', '@parent': false
               },
               {
                  id: '6',
                  title: 'Запись 6',
                  parent: '4', '@parent': false,
                  additional: true
               },
               {
                  id: '7',
                  title: 'Запись 7',
                  parent: '3', '@parent': true,
                  additional: true
               },
               {
                  id: '8',
                  title: 'Запись 8',
                  parent: '7', '@parent': false,
                  additional: true
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
            assert.equal(viewModel._itemsModel._display.getCount(), 3);
         });

         it('check empty hierarchy', () => {
            viewModel._options.nodeProperty = null;
            viewModel.setFilter(viewModel.getDisplayFilter());
            assert.equal(viewModel._itemsModel._display.getCount(), 8);
         });

         it('check additional', () => {
            viewModel._options.nodeProperty = null;
            viewModel._options.additionalProperty = 'additional';
            viewModel.setFilter(viewModel.getDisplayFilter());
            assert.equal(viewModel._itemsModel._display.getCount(), 4);
         });

         it('check additional and hierarchy', () => {
            viewModel._options.additionalProperty = 'additional';
            viewModel._options.nodeProperty = '@parent';
            viewModel.setFilter(viewModel.getDisplayFilter());
            assert.equal(viewModel._itemsModel._display.getCount(), 3);
         });

         it('items count', () => {
            assert.equal(viewModel._itemsModel._display.getCount(), 3);
            assert.equal(viewModel._options.items.getCount(), 8);
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
            assert.equal(null, viewModel._itemsModel._options);
         });
      })
   });