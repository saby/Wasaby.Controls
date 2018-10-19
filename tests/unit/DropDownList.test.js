
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
            assert.equal(dropDownList._verticalOrientation, 'top');
            assert.equal(dropDownList._horizontalOrientation, 'right');
            assert.equal(dropDownList._typeShadow, 'suggestionsContainer-top');

            context.stickyCfg.horizontalAlign.side = 'left';
            context.stickyCfg.verticalAlign.side = 'bottom';
            dropDownList._beforeUpdate(dropDownConfig, context);
            assert.deepEqual(dropDownList._popupOptions.horizontalAlign, { side: 'left' });
            assert.equal(dropDownList._verticalOrientation, 'bottom');
            assert.equal(dropDownList._horizontalOrientation, 'left');
            assert.equal(dropDownList._typeShadow, 'suggestionsContainer-bottom');

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
            dropDownList = getDropDownListWithConfig(dropDownConfig);
            dropDownList._beforeMount(dropDownConfig);

            var expectedConfig = {
               templateOptions: {
                  items: dropDownList._options.items,
                  itemTemplate: dropDownList._options.itemTemplate,
                  itemTemplateProperty: dropDownList._options.itemTemplateProperty,
                  keyProperty: dropDownList._options.keyProperty,
                  parentProperty: dropDownList._options.parentProperty,
                  nodeProperty: dropDownList._options.nodeProperty,
                  selectedKeys: dropDownList._options.selectedKeys,
                  rootKey: items.at(0).get(dropDownList._options.keyProperty),
                  showHeader: false,
                  defaultItemTemplate: dropDownList._options.defaultItemTemplate
               },
               corner: dropDownList._popupOptions.corner,
               horizontalAlign: dropDownList._popupOptions.horizontalAlign,
               target: "MyTarget"
            };

            var inFactConfig = DropdownList._private.getSubMenuOptions(dropDownList, { target: "MyTarget"}, items.at(0));
            assert.deepEqual(expectedConfig, inFactConfig);


         });

      });

   });

});
