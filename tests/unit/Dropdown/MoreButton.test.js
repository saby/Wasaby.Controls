define(
   [
      'Controls/dropdownPopup',
      'Types/collection'
   ],
   function(dropdownPopup, collection) {
      describe('DropdownPopup:MoreButton', function() {

         let defaultItems = new collection.RecordSet({
            idProperty: 'id',
            rawData: [{id: '1', title: 'Test1'},
               {id: '2', title: 'Test2'},
               {id: '3', title: 'Test3'},
               {id: '4', title: 'Test4'},
               {id: '5', title: 'Test5'},
               {id: '6', title: 'Test6'}]
         });

         let defaultConfig = {
            selectedKeys: ['1', '3'],
            items: defaultItems.clone(),
            selectorTemplate: {
               templateName: 'DialogTemplate.wml',
               templateOptions: {
                  option1: '1',
                  option2: '2'
               }
            }
         };

         let getButton = function (config) {
            let button = new dropdownPopup.MoreButton();
            button.saveOptions(config);
            return button;
         };

         it('_openSelectorDialog', function() {
            let actualOptions;
            let button = getButton(defaultConfig);
            button._children = {selectorDialog: {open: (popupOptions) => {
               actualOptions = popupOptions;
            }}};
            button._openSelectorDialog();

            assert.strictEqual(actualOptions.template, defaultConfig.selectorTemplate.templateName);
            assert.strictEqual(actualOptions.isCompoundTemplate, defaultConfig.isCompoundTemplate);
            assert.deepStrictEqual(actualOptions.templateOptions.selectedItems.getCount(), 2);
            assert.strictEqual(actualOptions.templateOptions.option1, '1');
            assert.strictEqual(actualOptions.templateOptions.option2, '2');
            assert.isOk(actualOptions.templateOptions.handlers.onSelectComplete);

            button._options.selectedKeys = [null];
            button._openSelectorDialog();
            assert.deepStrictEqual(actualOptions.templateOptions.selectedItems.getCount(), 0);

         });

         it('_selectorDialogResult', function() {
            let actualResult;
            let items = ['items1', 'items2', 'items3'],
               expectedResult = {
               action: 'selectorResult',
               event: 'selectorResultEvent',
               data: items
            };
            let button = getButton(defaultConfig);
            button._notify = (event, data) => {
               if (event === 'selectorResult') {
                  actualResult = data[0];
               }
            };
            button._selectorDialogResult('selectorResultEvent', items);
            assert.deepStrictEqual(actualResult, expectedResult);
         });
      });
   }
);
