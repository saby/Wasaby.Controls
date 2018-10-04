define(['Controls/Operations/MultiSelector'], function(MultiSelector) {
   'use strict';
   describe('Controls.OperationsPanel.MultiSelector', function() {
      it('_updateSelection', function() {
         var instance = new MultiSelector();
         var selection = {
            selectedKeys: [null],
            excludedKeys: []
         };
         instance._updateSelection(selection);
         assert.equal(instance._multiSelectStatus, true);
         selection = {
            selectedKeys: [],
            excludedKeys: []
         };
         instance._updateSelection(selection);
         assert.equal(instance._multiSelectStatus, false);
         selection = {
            selectedKeys: [1, 2],
            excludedKeys: [],
            count: 2
         };
         instance._updateSelection(selection);
         assert.equal(instance._multiSelectStatus, null);
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
   });
});
