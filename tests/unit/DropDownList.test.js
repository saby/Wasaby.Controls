
define(['Controls/Dropdown/resources/template/DropdownList', 'WS.Data/Collection/RecordSet'], function(DropdownList, RecordSet) {

   'use strict';

   var rawData = [
      {
         id: 1,
         parent: null,
         '@parent': false,
         myTemplate: 'wml!Path/To/CustomTemplate'
      },
      {
         id: 2,
         parent: 1,
         '@parent': false
      },
      {
         id: 3,
         parent: 1,
         '@parent': false,
         myTemplate: 'wml!Path/To/CustomTemplate'
      },
      {
         id: 4,
         parent: null,
         isAdditional: true,
         '@parent': true
      },
      {
         id: 5,
         parent: 1,
         isAdditional: true,
         '@parent': true,
         myTemplate: 'wml!Path/To/CustomTemplate'
      }
   ];

   var items =  new RecordSet({rawData: rawData, idProperty: 'id'});

   var getDropDownConfig = function() {
      return {
         items: items,
         selectedKeys: [],
         displayProperty: 'id',
         keyProperty: 'id',
         nodeProperty: '@parent',
         parentProperty: 'parent',
         typeShadow: 'suggestionsContainer',
         itemTemplateProperty: 'myTemplate'
      };
   };

   var getDropDownListWithConfig = function(config) {
      var dropDownList = new DropdownList(config);
      dropDownList.saveOptions(config);
      return dropDownList;
   };

   describe('Controls/Dropdown/resources/template/DropdownList', function() {

      describe('DropdownList::_beforeUpdate', function() {

         it('check hierarchy', function() {
            var dropDownConfig, dropDownList;

            dropDownConfig = getDropDownConfig();
            dropDownList = getDropDownListWithConfig(dropDownConfig);

            dropDownList._beforeMount(dropDownConfig);
            dropDownList._beforeUpdate(dropDownConfig);

            assert.isTrue(dropDownList._hasHierarchy);

            /**** CHANGE ROOT *******************/

            dropDownConfig = getDropDownConfig();
            dropDownConfig.rootKey = 1;
            dropDownList._beforeUpdate(dropDownConfig);

            assert.isTrue(dropDownList._hasHierarchy);

            dropDownConfig = getDropDownConfig();
            dropDownConfig.rootKey = 2;
            dropDownList._beforeUpdate(dropDownConfig);

            assert.isFalse(dropDownList._hasHierarchy);

            /******************************/

            /**** CHANGE EXPAND *******************/

            dropDownConfig = getDropDownConfig();
            dropDownConfig.additionalProperty = 'isAdditional';
            dropDownList = getDropDownListWithConfig(dropDownConfig);

            dropDownList._beforeMount(dropDownConfig);
            dropDownList._beforeUpdate(dropDownConfig);

            assert.isFalse(dropDownList._hasHierarchy);

            dropDownList._expanded = true; //В компоненте значение меняется по биндингу
            dropDownList._toggleExpanded();
            assert.isTrue(dropDownList._hasHierarchy);

            /*************************************/

            /**** CHANGE ORIENTATION POPUP *******************/

            dropDownConfig = getDropDownConfig();
            dropDownList = getDropDownListWithConfig(dropDownConfig);

            var context = {
               stickyCfg: {
                  horizontalAlign: {
                     offset: 0,
                     side: 'right'
                  },
                  verticalAlign: {
                     offset: 0,
                     side: 'top'
                  }
               }
            };

            dropDownList._beforeMount(dropDownConfig);
            dropDownList._beforeUpdate(dropDownConfig, context);
            assert.deepEqual(dropDownList._popupOptions.horizontalAlign, { side: 'right' });
            assert.equal(dropDownList._dropdownClass, 'controls-DropdownList__popup-top controls-DropdownList__popup-shadow-suggestionsContainer');

            context.stickyCfg.horizontalAlign.side = 'left';
            context.stickyCfg.verticalAlign.side = 'bottom';
            dropDownList._beforeUpdate(dropDownConfig, context);
            assert.deepEqual(dropDownList._popupOptions.horizontalAlign, { side: 'left' });
            assert.equal(dropDownList._dropdownClass, 'controls-DropdownList__popup-bottom controls-DropdownList__popup-shadow-suggestionsContainer');

         });

      });

      describe('DropdownList::_beforeMount', function() {
         it('check popup options', function() {
            var dropDownConfig, dropDownList;
            dropDownConfig = getDropDownConfig();
            dropDownList = getDropDownListWithConfig(dropDownConfig);

            dropDownList._beforeMount(dropDownConfig);
            assert.isTrue(dropDownList._popupOptions !== undefined);
         });

      });

      describe('DropdownList::_private.getSubMenuOptions', function() {
         it('check assignment subMenu options', function() {
            var dropDownConfig, dropDownList;

            dropDownConfig = getDropDownConfig();
            dropDownConfig.rootKey = 1;
            dropDownList = getDropDownListWithConfig(dropDownConfig);
            dropDownList._beforeMount(dropDownConfig);

            var expectedConfig = {
               templateOptions: {
                  items: dropDownList._options.items,
                  itemTemplate: dropDownList._options.itemTemplate,
                  itemTemplateProperty: dropDownList._options.itemTemplateProperty,
                  keyProperty: dropDownList._options.keyProperty,
                  displayProperty: dropDownList._options.displayProperty,
                  parentProperty: dropDownList._options.parentProperty,
                  nodeProperty: dropDownList._options.nodeProperty,
                  selectedKeys: dropDownList._options.selectedKeys,
                  rootKey: items.at(0).get(dropDownList._options.keyProperty),
                  showHeader: false,
                  defaultItemTemplate: dropDownList._options.defaultItemTemplate,
                  dropdownClassName: dropDownList._options.dropdownClassName
               },
               corner: dropDownList._popupOptions.corner,
               horizontalAlign: dropDownList._popupOptions.horizontalAlign,
               target: "MyTarget"
            };

            var inFactConfig = DropdownList._private.getSubMenuOptions(dropDownList._options, dropDownList._popupOptions, { target: "MyTarget"}, items.at(0));
            assert.deepEqual(expectedConfig, inFactConfig);

            dropDownList._options.rootKey = null;
            expectedConfig.corner.horizontal = 'right';
            expectedConfig.horizontalAlign.side = 'right';

            inFactConfig = DropdownList._private.getSubMenuOptions(dropDownList._options, dropDownList._popupOptions, { target: "MyTarget"}, items.at(0));
            assert.deepEqual(expectedConfig, inFactConfig);
         });

         it('resultHandler itemClick', function() {
            var dropdownList = getDropDownListWithConfig(getDropDownConfig());
            dropdownList._notify = function(event, data) {
               if (event === 'sendResult') {
                  assert.equal(data[0].action, 'itemClick');
               }
            };
            dropdownList._children = { subDropdownOpener: { close: function() {return true;} } };
            dropdownList.resultHandler({ action: 'itemClick' });
         });
         it('resultHandler pinClick', function() {
            var dropdownList = getDropDownListWithConfig(getDropDownConfig());
            dropdownList._notify = function(event, data) {
               if (event === 'sendResult') {
                  assert.equal(data[0].action, 'pinClicked');
               }
            };
            dropdownList.resultHandler({ action: 'pinClicked' });
         });
      });
   });
});
