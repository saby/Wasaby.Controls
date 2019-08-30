define(
   [
      'Controls/filterPopup',
      'Controls/_dropdownPopup/DropdownViewModel',
      'Types/collection'
   ],
   function(filterPopup, DropdownViewModel, collection) {
      describe('SimplePanel:HierarchyList', function() {

         let defaultItems = new collection.RecordSet({
            idProperty: 'id',
            rawData: [
               {id: '-1', title: 'folder 1', node: true},
               {id: '0', title: 'folder 2', node: true},
               {id: '1', title: 'Test1', parent: '-1'},
               {id: '2', title: 'Test2', parent: '-1'},
               {id: '3', title: 'Test3', parent: '-1'},
               {id: '4', title: 'Test4', parent: '0'},
               {id: '5', title: 'Test5', parent: '0'},
               {id: '6', title: 'Test6', parent: '0'}]
         });

         let defaultConfig = {
            displayProperty: 'title',
            keyProperty: 'id',
            nodeProperty: 'node',
            parentProperty: 'parent',
            emptyText: '',
            resetValue: ['2'],
            id: 'text',
            items: defaultItems.clone(),
            selectedKeys: [],
            multiSelect: true
         };

         let getHierarchyList = function (config) {
            let list = new filterPopup._HierarchyList();
            list.saveOptions(config);
            return list;
         };

         it('_beforeMount', function() {
            let expectedListModel = new DropdownViewModel({
               items: defaultConfig.items,
               selectedKeys: defaultConfig.selectedKeys,
               keyProperty: defaultConfig.keyProperty,
               itemTemplateProperty: defaultConfig.itemTemplateProperty,
               displayProperty: defaultConfig.displayProperty,
               emptyText: defaultConfig.emptyText,
               emptyKey: defaultConfig.emptyKey
            });
            let list = getHierarchyList(defaultConfig);
            list._beforeMount(defaultConfig);
            assert.deepStrictEqual(list._listModel._options, expectedListModel._options);
            assert.strictEqual(list._folders.length, 2);
            assert.deepStrictEqual(list._selectedKeys, [[], []]);
            assert.strictEqual(list._nodeItems[0].getCount(), 4);
         });

         it('_itemClickHandler', function() {
            let list = getHierarchyList(defaultConfig),
               itemClickResult, checkBoxClickResult;
            list._notify = (event, data) => {
               if (event === 'itemClick') {
                  itemClickResult = data[0];
               } else if (event === 'checkBoxClick') {
                  checkBoxClickResult = data[0];
               }
            };
            list._beforeMount(defaultConfig);

            // item click without selection
            list._itemClickHandler({}, 0, ['1']);
            assert.deepStrictEqual(itemClickResult, [['1'], []]);

            //checkbox click
            list._itemClickHandler({}, 1, ['5']);
            assert.deepStrictEqual(checkBoxClickResult, [['1'], ['5']]);

            //checkbox click
            list._itemClickHandler({}, 0, []);
            assert.deepStrictEqual(checkBoxClickResult, [[], ['5']]);
         });

         it('_emptyItemClickHandler', function() {
            let list = getHierarchyList(defaultConfig),
               itemClickResult;
            list._notify = (event, data) => {
               if (event === 'itemClick') {
                  itemClickResult = data[0];
               }
            };
            list._beforeMount(defaultConfig);

            list._emptyItemClickHandler();
            assert.deepStrictEqual(list._selectedKeys, ['2']);
            assert.deepStrictEqual(itemClickResult, ['2']);
         });

      });
   }
);
