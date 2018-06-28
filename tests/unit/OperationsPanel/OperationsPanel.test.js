define(['Controls/OperationsPanel/MassSelector'], function(MassSelector) {
   'use strict';
   describe('Controls.OperationsPanel.MassSelector', function() {
      it('_updateMultiSelectStatus', function() {
         var instance = new MassSelector();
         instance._updateMultiSelectStatus('all');
         assert.equal(instance._multiSelectStatus, true);
         instance._updateMultiSelectStatus('part');
         assert.equal(instance._multiSelectStatus, null);
         instance._updateMultiSelectStatus(0);
         assert.equal(instance._multiSelectStatus, false);
         instance._updateMultiSelectStatus(10);
         assert.equal(instance._multiSelectStatus, null);
      });
      it('_updateMultiSelectCaption', function() {
         var instance = new MassSelector();
         instance._updateMultiSelectStatus('all');
         instance._updateMultiSelectCaption('all');
         assert.equal(instance._menuCaption, 'Отмечено всё');
         instance._updateMultiSelectStatus('part');
         instance._updateMultiSelectCaption('part');
         assert.equal(instance._menuCaption, 'Отмечено');
         instance._updateMultiSelectStatus(0);
         instance._updateMultiSelectCaption(0);
         assert.equal(instance._menuCaption, 'Отметить');
         instance._updateMultiSelectStatus(10);
         instance._updateMultiSelectCaption(10);
         assert.equal(instance._menuCaption, 'Отмечено (10)');
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

   describe('Controls.OperationsPanel.MassSelector', function() {
      it('_updateMultiSelectStatus', function() {
         var instance = new MassSelector();
         instance._updateMultiSelectStatus('all');
         assert.equal(instance._multiSelectStatus, true);
         instance._updateMultiSelectStatus('part');
         assert.equal(instance._multiSelectStatus, null);
         instance._updateMultiSelectStatus(0);
         assert.equal(instance._multiSelectStatus, false);
         instance._updateMultiSelectStatus(10);
         assert.equal(instance._multiSelectStatus, null);
      });
      it('_updateMultiSelectCaption', function() {
         var instance = new MassSelector();
         instance._updateMultiSelectStatus('all');
         instance._updateMultiSelectCaption('all');
         assert.equal(instance._menuCaption, 'Отмечено всё');
         instance._updateMultiSelectStatus('part');
         instance._updateMultiSelectCaption('part');
         assert.equal(instance._menuCaption, 'Отмечено');
         instance._updateMultiSelectStatus(0);
         instance._updateMultiSelectCaption(0);
         assert.equal(instance._menuCaption, 'Отметить');
         instance._updateMultiSelectStatus(10);
         instance._updateMultiSelectCaption(10);
         assert.equal(instance._menuCaption, 'Отмечено (10)');
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
