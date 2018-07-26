
define(['Controls/Dropdown/resources/template/DropdownList', 'WS.Data/Collection/RecordSet'], function(DropdownList, RecordSet) {
   
   'use strict';
   
   var rawData = [
      {
         id: 1,
         parent: null,
         '@parent': false
      },
      {
         id: 2,
         parent: 1,
         '@parent': false
      },
      {
         id: 3,
         parent: 1,
         '@parent': false
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
         '@parent': true
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
         parentProperty: 'parent'
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
            
            dropDownList._toggleExpanded();
            assert.isTrue(dropDownList._hasHierarchy);
            
            /*************************************/
         });
         
      });
      
   });
   
});