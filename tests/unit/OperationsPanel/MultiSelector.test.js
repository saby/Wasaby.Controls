define([
   'Controls/Operations/MultiSelector'
], function(
   MultiSelector
) {
   'use strict';
   describe('Controls.OperationsPanel.MultiSelector', function() {
      it('_updateSelection', function() {
         var instance = new MultiSelector();
         var
            selectedKeys = [null],
            excludedKeys = [],
            selectedKeysCount = 0;
         instance._updateSelection(selectedKeys, excludedKeys, selectedKeysCount);
         assert.isTrue(instance._multiSelectStatus);
         selectedKeys = [];
         instance._updateSelection(selectedKeys, excludedKeys, selectedKeysCount);
         assert.isFalse(instance._multiSelectStatus);
         selectedKeys = [1, 2];
         selectedKeysCount = 2;
         instance._updateSelection(selectedKeys, excludedKeys, selectedKeysCount);
         assert.isNull(instance._multiSelectStatus);
      });
      it('_onCheckBoxClick', function() {
         var instance = new MultiSelector();
         instance._multiSelectStatus = true;
         instance.notify = function(eventName, argumentsArray) {
            assert.equal(argumentsArray[0], 'unselectAll');
            assert.equal(eventName, 'selectedTypeChanged');
         };
         instance._onCheckBoxClick();
         instance._multiSelectStatus = false;
         instance.notify = function(eventName, argumentsArray) {
            assert.equal(argumentsArray[0], 'selectAll');
         };
         instance._onCheckBoxClick();
      });
      it('_beforeMount', function() {
         var instance = new MultiSelector();
         var newOptions = {
            selectedKeys: [null],
            excludedKeys: [],
            selectedKeysCount: 0
         };
         instance._beforeMount(newOptions);
         assert.isTrue(instance._multiSelectStatus);
         newOptions.selectedKeys = [];
         instance._beforeMount(newOptions);
         assert.isFalse(instance._multiSelectStatus);
         newOptions.selectedKeys = [1, 2];
         newOptions.selectedKeysCount = 2;
         instance._beforeMount(newOptions);
         assert.isNull(instance._multiSelectStatus);
      });
      it('_beforeUpdate', function() {
         var instance = new MultiSelector();
         var newOptions = {
            selectedKeys: [null],
            excludedKeys: [],
            selectedKeysCount: 0
         };
         instance._beforeUpdate(newOptions);
         assert.isTrue(instance._multiSelectStatus);
         newOptions.selectedKeys = [];
         instance._beforeUpdate(newOptions);
         assert.isFalse(instance._multiSelectStatus);
         newOptions.selectedKeys = [1, 2];
         newOptions.selectedKeysCount = 2;
         instance._beforeUpdate(newOptions);
         assert.isNull(instance._multiSelectStatus);
      });
   });
});
