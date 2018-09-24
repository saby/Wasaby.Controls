define(['Controls/Operations/__MultiSelector'], function(MultiSelector) {
   'use strict';
   describe('Controls.OperationsPanel.__MultiSelector', function() {
      it('_updateSelection', function() {
         var instance = new MultiSelector();
         var selection = {
            selectedKeys: [null],
            excludedKeys: []
         };
         instance._updateSelection(selection);
         assert.equal(instance._menuCaption, 'Отмечено всё');
         selection = {
            selectedKeys: [],
            excludedKeys: []
         };
         instance._updateSelection(selection);
         assert.equal(instance._menuCaption, 'Отметить');
         selection = {
            selectedKeys: [1, 2],
            excludedKeys: [],
            count: 2
         };
         instance._updateSelection(selection);
         assert.equal(instance._menuCaption, 'Отмечено: 2');
         selection = {
            selectedKeys: [null],
            excludedKeys: [1, 2, 3],
            count: 1
         };
         instance._updateSelection(selection);
         assert.equal(instance._menuCaption, 'Отмечено: 1');
         selection = {
            selectedKeys: [null],
            excludedKeys: [1, 2, 3, 4],
            count: 0
         };
         instance._updateSelection(selection);
         assert.equal(instance._menuCaption, 'Отметить');
      });
      it('_getHierarchyMenuItems', function() {
         var instance = new MultiSelector();
         var menuSource = instance._getMenuSource();
         assert.equal(menuSource._$data.length, 3);
      });
      it('_onMenuItemActivate', function() {
         var instance = new MultiSelector();
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
