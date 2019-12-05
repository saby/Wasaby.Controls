define([
   'Controls/_operations/__MultiSelector'
], function(
   MultiSelector
) {
   'use strict';
   describe('Controls.OperationsPanel.__MultiSelector', function() {
      var eventQueue;
      function mockNotify(returnValue) {
         return function(event, eventArgs, eventOptions) {
            eventQueue.push({
               event: event,
               eventArgs: eventArgs,
               eventOptions: eventOptions
            });
            return returnValue;
         };
      }

      beforeEach(function() {
         eventQueue = [];
      });

      it('_updateSelection', function() {
         var instance = new MultiSelector.default();
         var
            selectedKeys = [null],
            excludedKeys = [],
            selectedKeysCount = 0;

         instance._updateSelection(selectedKeys, excludedKeys, selectedKeysCount, null);
         assert.equal(instance._menuCaption, 'Отмечено всё');

         selectedKeys = [];
         instance._updateSelection(selectedKeys, excludedKeys, selectedKeysCount, null);
         assert.equal(instance._menuCaption, 'Отметить');

         selectedKeys = [1, 2];
         selectedKeysCount = 2;
         instance._updateSelection(selectedKeys, excludedKeys, selectedKeysCount, null);
         assert.equal(instance._menuCaption, 'Отмечено: 2');

         selectedKeysCount = undefined;
         instance._updateSelection(selectedKeys, excludedKeys, selectedKeysCount, null);
         assert.equal(instance._menuCaption, 'Отмечено: 2');

         selectedKeys = [null];
         excludedKeys = [1, 2, 3];
         selectedKeysCount = 1;
         instance._updateSelection(selectedKeys, excludedKeys, selectedKeysCount, null);
         assert.equal(instance._menuCaption, 'Отмечено: 1');

         excludedKeys = [1, 2, 3, 4];
         selectedKeysCount = 0;
         instance._updateSelection(selectedKeys, excludedKeys, selectedKeysCount, null);
         assert.equal(instance._menuCaption, 'Отметить');

         excludedKeys = [];
         selectedKeys = [];
         selectedKeysCount = 1;
         instance._updateSelection(selectedKeys, excludedKeys, selectedKeysCount, null);
         assert.equal(instance._menuCaption, 'Отметить');
      });
      it('_getMenuSource', function() {
         var instance = new MultiSelector.default();
         var menuSource = instance._getMenuSource();
         assert.equal(menuSource._$data.length, 3);
      });
      it('_onMenuItemActivate', function() {
         var instance = new MultiSelector.default();
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
      it('_beforeMount', function() {
         var instance = new MultiSelector.default();
         var newOptions = {
            selectedKeys: [null],
            excludedKeys: [],
            selectedKeysCount: 0,
            root: null
         };
         instance._beforeMount(newOptions);
         assert.equal(instance._menuSource._$data.length, 3);
         assert.equal(instance._menuCaption, 'Отмечено всё');
         newOptions.selectedKeys = [];
         instance._beforeMount(newOptions);
         assert.equal(instance._menuCaption, 'Отметить');
         newOptions.selectedKeys = [1, 2];
         newOptions.selectedKeysCount = 2;
         instance._beforeMount(newOptions);
         assert.equal(instance._menuCaption, 'Отмечено: 2');
      });
      it('_beforeUpdate', function() {
         var instance = new MultiSelector.default();
         var newOptions = {
            selectedKeys: [null],
            excludedKeys: [],
            selectedKeysCount: 0,
            root: null
         };
         instance._beforeUpdate(newOptions);
         assert.equal(instance._menuCaption, 'Отмечено всё');
         newOptions.selectedKeys = [];
         instance._beforeUpdate(newOptions);
         assert.equal(instance._menuCaption, 'Отметить');
         newOptions.selectedKeys = [1, 2];
         newOptions.selectedKeysCount = 2;
         instance._beforeUpdate(newOptions);
         assert.equal(instance._menuCaption, 'Отмечено: 2');
      });
      it('_afterUpdate', function() {
         var instance = new MultiSelector.default();
         instance._notify = mockNotify();
         instance._afterUpdate();
         assert.equal(eventQueue.length, 0);
         instance._sizeChanged = true;
         instance._afterUpdate();
         assert.equal(eventQueue.length, 1);
         assert.equal(eventQueue[0].event, 'controlResize');
         assert.equal(eventQueue[0].eventArgs.length, 0);
         assert.isTrue(eventQueue[0].eventOptions.bubbling);
      });
   });
});
