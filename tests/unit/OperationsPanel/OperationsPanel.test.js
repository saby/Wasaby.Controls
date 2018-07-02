define(['Controls/OperationsPanel/MassSelector'], function(MassSelector) {
   'use strict';
   describe('Controls.OperationsPanel.MassSelector', function() {
      it('_updateSelection', function() {
         var instance = new MassSelector();
         var selection = {
            selectedKeys: [null],
            excludedKeys: []
         };
         instance._updateSelection(selection);
         assert.equal(instance._multiSelectStatus, true);
         assert.equal(instance._menuCaption, 'Отмечено всё');
         selection = {
            selectedKeys: [],
            excludedKeys: []
         };
         instance._updateSelection(selection);
         assert.equal(instance._multiSelectStatus, false);
         assert.equal(instance._menuCaption, 'Отметить');
         selection = {
            selectedKeys: [1, 2],
            excludedKeys: [],
            count: 2
         };
         instance._updateSelection(selection);
         assert.equal(instance._multiSelectStatus, null);
         assert.equal(instance._menuCaption, 'Отмечено (2)');
      });
      it('_getHierarchyMenuItems', function() {
         var instance = new MassSelector();
         var menuSource = instance._getHierarchyMenuItems();
         assert.equal(menuSource._$data.length, 3);
      });
      it('_onCheckBoxClick', function() {
         var instance = new MassSelector();
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
      it('_onMenuItemActivate', function() {
         var instance = new MassSelector();
         instance._multiSelectStatus = true;
         instance.notify = function(eventName, argumentsArray) {
            assert.equal(argumentsArray[0], 'selectAll');
            assert.equal(eventName, 'selectedTypeChanged');
         };
         instance._onMenuItemActivate(
            {},
            {
               get: function() {
                  return 1;
               }
            }
         );

         instance.notify = function(eventName, argumentsArray) {
            assert.equal(argumentsArray[0], 'unselectAll');
         };
         instance._onMenuItemActivate(
            {},
            {
               get: function() {
                  return 2;
               }
            }
         );
         instance.notify = function(eventName, argumentsArray) {
            assert.equal(argumentsArray[0], 'toggleAll');
         };
         instance._onMenuItemActivate(
            {},
            {
               get: function() {
                  return 3;
               }
            }
         );
      });
   });
});
