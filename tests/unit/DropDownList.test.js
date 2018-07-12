
define(['Controls/Dropdown/resources/template/DropdownList', 'WS.Data/Collection/RecordSet'], function(DropdownList, RecordSet) {
   
   'use strict';
   
   var rawData = [
      {
         id: 1,
         parent: null,
         '@parent': true
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
         parent: 1,
         '@parent': true
      },
      {
         id: 5,
         parent: 1,
         '@parent': false
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
   
   describe('Controls/Dropdown/resources/template/DropdownList', function() {
      
      describe('DropdownList::_beforeUpdate', function() {
         
         it('check hierarchy', function() {
            var dropDownConfig, dropDownList;
            
            dropDownConfig = getDropDownConfig();
            dropDownList = new DropdownList(dropDownConfig);
            dropDownList.saveOptions(dropDownConfig);
   
            dropDownList._beforeMount(dropDownConfig);
            dropDownList._beforeUpdate(dropDownConfig);
   
            assert.isTrue(dropDownList._hasHierarchy);
   
            dropDownConfig = getDropDownConfig();
            dropDownConfig.rootKey = 1;
            dropDownList._beforeUpdate(dropDownConfig);
   
            assert.isTrue(dropDownList._hasHierarchy);
   
            dropDownConfig = getDropDownConfig();
            dropDownConfig.rootKey = 2;
            dropDownList._beforeUpdate(dropDownConfig);
   
            assert.isFalse(dropDownList._hasHierarchy);
         });
         
      });
      
   });
   
});