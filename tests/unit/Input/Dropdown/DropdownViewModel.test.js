define(
   [
      'Controls/Dropdown/resources/DropdownViewModel',
      'WS.Data/Collection/RecordSet',
      'Controls/Constants',
   ],
   (DropdownViewModel, RecordSet, ControlsConstants) => {
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
         describe('Groups and separator', function() {
               let newConfig = {
                  keyProperty: 'id',
               };
               newConfig.itemsGroup = {
                  method: function (item) {
                     if (item.get('group') === 'hidden' || !item.get('group')) {
                        return ControlsConstants.view.hiddenGroup;
                     }
                     return item.get('group');
                  },
                  template: '',
               };
               newConfig.items = new RecordSet({
                  idProperty: 'id',
                  rawData: [
                     {id: '1', title: 'Запись 1', parent: null, '@parent': false, recent: true},
                     {id: '2', title: 'Запись 2', parent: null, '@parent': false, pinned: true},
                     {id: '3', title: 'Запись 3', parent: null, '@parent': false},
                     {id: '4', title: 'Запись 4', parent: null, '@parent': false, group: 'group_2'},
                     {id: '5', title: 'Запись 5', parent: null, '@parent': false, group: 'group_1'},
                     {id: '6', title: 'Запись 6', parent: null, '@parent': false, group: 'group_1'},
                     {id: '7', title: 'Запись 7', parent: null, '@parent': false, group: 'group_2'},
                     {id: '8', title: 'Запись 8', parent: null, '@parent': false, group: 'group_2'},
                  ]
               });

               let viewModel3 = new DropdownViewModel(newConfig);
               viewModel3._options.additionalProperty = null;
               viewModel3._options.nodeProperty = '@parent';
            it('groupItems', function() {
               assert.equal(viewModel3._itemsModel._display.getCount(), 11);
               assert.equal(viewModel3._itemsModel._display.at(9).getContents().get('group'), 'group_1');
               assert.equal(viewModel3._itemsModel._display.at(10).getContents().get('group'), 'group_1');
            });
            it('historySeparator', function() {
               viewModel3.goToNext();
               assert.isFalse(DropdownViewModel._private.needToDrawSeparator(viewModel3._itemsModel.getCurrent().item, viewModel3._itemsModel.getNext().item));
               viewModel3.goToNext();
               assert.isTrue(DropdownViewModel._private.needToDrawSeparator(viewModel3._itemsModel.getCurrent().item, viewModel3._itemsModel.getNext().item));
            });
            it('needHideGroup', function() {
               let groupItems = {
                  empty: [],
                  notEmpty: ['test']
               };
               let self = {
                  _itemsModel: {
                     _display: {
                        getGroupItems: function(key) {
                           return groupItems[key];
                        }
                     }
                  }
               };
   
               assert.isTrue(DropdownViewModel._private.needHideGroup(self, 'empty'));
               assert.isFalse(DropdownViewModel._private.needHideGroup(self, 'notEmpty'));
            });
         });

         it('destroy', () => {
            viewModel.destroy();
            assert.equal(null, viewModel._itemsModel._options);
         });
      })
   });