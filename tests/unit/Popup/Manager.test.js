define(
   [
      'Controls/popup',
      'Controls/Popup/Opener/BaseController',
      'Core/Deferred'
   ],

   function(popupMod, BaseController, Deferred) {
      'use strict';

      function getManager() {
         let Manager = new popupMod.Manager();
         let Container = new popupMod.Container();
         Manager._afterMount();
         Container._afterMount();
         return Manager;
      }

      before(() => {
         BaseController.prototype._checkContainer = () => true;
      });

      describe('Controls/Popup/Manager/ManagerController', () => {
         it('initialize', function() {
            // Manager and container doesn't initialized
            popupMod.Controller._manager = undefined;
            assert.equal(popupMod.Controller.find(), false);
         });

         it('callMethod', () => {
            getManager();
            let arg0 = '1';
            let arg1 = '2';
            let methodName;

            let baseMethod = popupMod.Controller._callManager;

            popupMod.Controller._callManager = (method, args) => {
               assert.equal(methodName, method);
               assert.equal(args[0], arg0);
               assert.equal(args[1], arg1);
            };

            for (methodName of ['find', 'remove', 'update', 'show', 'reindex']) {
               popupMod.Controller[methodName](arg0, arg1);
            }

            popupMod.Controller._callManager = baseMethod;
         });
      });

      describe('Controls/Popup/Manager', function() {
         let id, element;
         let Manager = getManager();

         it('initialize', function() {
            let Manager = getManager();
            assert.equal(Manager._private.popupItems.getCount(), 0);
         });

         it('append popup', function() {
            let Manager = getManager();
            id = Manager.show({
               testOption: 'created'
            }, new BaseController());
            assert.equal(Manager._private.popupItems.getCount(), 1);
            element = Manager.find(id);
            assert.equal(element.popupOptions.testOption, 'created');
         });

         it('getMaxZIndexPopupIdForActivate', function() {
            let Manager = getManager();
            let id1 = Manager.show({}, new BaseController());
            let id0 = Manager.show({}, new BaseController());
            element = Manager.find(id0);
            element.popupState = 'destroyed';
            let id2 = Manager.show({ autofocus: false }, new BaseController());
            let id3 = Manager.show({}, new BaseController());

            let maxPopupId = Manager._private.getMaxZIndexPopupIdForActivate();
            assert.equal(maxPopupId, id3);
            Manager.remove(id3);

            maxPopupId = Manager._private.getMaxZIndexPopupIdForActivate();
            assert.equal(maxPopupId, id1);
            Manager.remove(id1);

            maxPopupId = Manager._private.getMaxZIndexPopupIdForActivate();
            assert.equal(maxPopupId, null);
         });

         it('find popup', () => {
            let Manager = getManager();
            id = Manager.show({
               testOption: 'created'
            }, new BaseController());
            element = Manager.find(id);
            assert.equal(element.popupOptions.testOption, 'created');
            element.popupState = 'destroyed';
            element = Manager.find(id);
            assert.equal(element, null);
         });

         it('update popup', function() {
            let Manager = getManager();
            id = Manager.show({
               testOption: 'created'
            }, new BaseController());
            element = Manager.find(id);
            element.popupState = 'created';
            id = Manager.update(id, {
               testOption: 'updated'
            });
            assert.equal(element.popupOptions.testOption, 'updated');
         });

         it('fireEventHandler', function() {
            let Manager = getManager();
            let eventOnCloseFired = false;
            id = Manager.show({
               testOption: 'created'
            }, new BaseController());
            var eventCloseFired = false;
            element = Manager.find(id);
            element.popupState = 'created';
            Manager.update(id, {
               eventHandlers: {
                  onClose: function() {
                     eventCloseFired = true;
                  }
               },
               _events: {
                  onClose: () => {
                     eventOnCloseFired = true;
                  },
                  onResult: (event, args) => {
                     assert.equal(args[0], '1');
                     assert.equal(args[1], '2');
                  }
               }
            });

            Manager._private.fireEventHandler.call(Manager, id, 'onClose');

            assert.isTrue(eventCloseFired, 'event is not fired.');
            assert.isTrue(eventOnCloseFired, 'event is not fired.');

            Manager._private.fireEventHandler.call(Manager, id, 'onResult', '1', '2');
         });

         it('remove popup', function() {
            let Manager = getManager();
            id = Manager.show({
               testOption: 'created'
            }, new BaseController());
            Manager.remove(id);
            assert.equal(Manager._private.popupItems.getCount(), 0);
         });

         it('remove popup with pendings', function() {
            let Manager = getManager();
            let id1 = Manager.show({
               testOption: 'created'
            }, new BaseController());
            let id2 = Manager.show({
               testOption: 'created'
            }, new BaseController());
            let id3 = Manager.show({
               testOption: 'created'
            }, new BaseController());

            let hasPending = true;
            let pendingDeferred = new Deferred();

            let Pending = {
               _hasRegisteredPendings: () => hasPending,
               finishPendingOperations: () => {
                  return pendingDeferred;
               }
            };

            Manager._private.getPopupContainer = () => {
               return {
                  getPendingById: () => Pending
               };
            };

            Manager.remove(id1);
            assert.equal(Manager._private.popupItems.getCount(), 3);

            Pending = false;
            Manager.remove(id2);
            assert.equal(Manager._private.popupItems.getCount(), 2);

            Pending = {
               _hasRegisteredPendings: () => hasPending,
               finishPendingOperations: () => {
                  return pendingDeferred;
               }
            };

            Manager.remove(id3);
            assert.equal(Manager._private.popupItems.getCount(), 2);

            pendingDeferred.callback();
            assert.equal(Manager._private.popupItems.getCount(), 0);
         });

         it('remove popup and check event', function() {
            let Manager = getManager();
            let eventCloseFired = false;
            let eventOnCloseFired = false;
            id = Manager.show({
               eventHandlers: {
                  onClose: function() {
                     eventCloseFired = true;
                  }
               },
               _events: {
                  onClose: () => {
                     eventOnCloseFired = true;
                  }
               }
            }, new BaseController());
            Manager.remove(id);
            assert.equal(eventCloseFired, true);
            assert.equal(eventOnCloseFired, true);
         });

         it('add modal popup', function() {
            let Manager = getManager();
            let id1 = Manager.show({
               modal: false,
               testOption: 'created'
            }, new BaseController());

            Manager.show({
               modal: true,
               testOption: 'created'
            }, new BaseController());

            let indices = Manager._private.popupItems.getIndicesByValue('modal', true);
            assert.equal(indices.length, 1);
            assert.equal(indices[0], 1);

            Manager.remove(id1);

            indices = Manager._private.popupItems.getIndicesByValue('modal', true);
            assert.equal(indices.length, 1);
            assert.equal(indices[0], 0);
         });

         it('add maximized popup', function() {
            let Manager = getManager();
            let id0 = Manager.show({
               modal: false,
               maximize: true,
               testOption: 'created'
            }, new BaseController());

            assert.equal(Manager._hasMaximizePopup, true);

            let id1 = Manager.show({
               modal: true,
               testOption: 'created'
            }, new BaseController());

            assert.equal(Manager._private.popupItems.at(1).hasMaximizePopup, true);

            Manager.remove(id0);

            assert.equal(Manager._hasMaximizePopup, false);

            let id2 = Manager.show({
               modal: true,
               testOption: 'created'
            }, new BaseController());

            assert.equal(Manager._private.popupItems.at(1).hasMaximizePopup, false);
         });

         it('popup deactivated', () => {
            let Manager = getManager();
            let isDeactivated = false;
            let controller = {
               popupDeactivated: () => {
                  isDeactivated = true;
               },
               getDefaultConfig: () => ({}),
               POPUP_STATE_INITIALIZING: 'initializing'
            };
            let id = Manager.show({
               closeOnOutsideClick: true
            }, controller);

            let item = Manager.find(id);

            let baseFinishPendings = Manager._private.finishPendings;
            Manager._private.finishPendings = (popupId, popupCallback, pendingCallback, pendingsFinishedCallback) => {
               pendingsFinishedCallback();
            };
            Manager._private.popupDeactivated(id);
            assert.equal(isDeactivated, false);

            item.popupState = 'create';
            Manager._private.popupDeactivated(id);
            assert.equal(isDeactivated, true);

            isDeactivated = false;
            item.popupOptions.closeOnOutsideClick = false;
            Manager._private.popupDeactivated(id);
            assert.equal(isDeactivated, false);

            Manager._private.finishPendings = baseFinishPendings;
         });

         it('managerPopupMaximized notified', function() {
            let popupOptions = {
               modal: false,
               maximize: false,
               testOption: 'created'
            };
            let Manager = getManager();
            var isMaximizeNotified;
            Manager._private._notify = function(event, args, params) {
               isMaximizeNotified = event === 'managerPopupMaximized';
               assert.isTrue(popupOptions === args[0].popupOptions);
               assert.isTrue(params.hasOwnProperty('bubbling'));
            };
            let id0 = Manager.show(popupOptions, new BaseController());
            Manager._private.popupMaximized(id0);
            assert.isTrue(isMaximizeNotified);
         });
         it('managerPopupUpdated notified', function() {
            let popupOptions = {
               modal: false,
               maximize: false,
               testOption: 'created'
            };
            let Manager = getManager();
            var isUpdateNotified;
            Manager._private._notify = function(event, args, params) {
               isUpdateNotified = event === 'managerPopupUpdated';
               assert.isTrue(popupOptions === args[0].popupOptions);
               assert.isTrue(params.hasOwnProperty('bubbling'));
            };
            let id0 = Manager.show(popupOptions, new BaseController());
            Manager._private.popupUpdated(id0);
            assert.isTrue(isUpdateNotified);
         });
         it('managerPopupDestroyed notified', function() {
            let popupOptions = {
               testOption: 'created'
            };
            let Manager = getManager();
            var isDestroyNotified;
            Manager._notify = function(event, args, params) {
               isDestroyNotified = event === 'managerPopupDestroyed';
               if (event === 'managerPopupDestroyed') {
                  assert.equal(args[1].getCount(), 0);
               }
               assert.equal(popupOptions, args[0].popupOptions);
               assert.equal(params.hasOwnProperty('bubbling'), true);
            };
            id = Manager.show(popupOptions, new BaseController());
            Manager.remove(id);
            assert.isTrue(isDestroyNotified);
         });
         it('isIgnoreActivationArea', function() {
            let focusedContainer = {
               classList: {
                  contains: function(str) {
                     if (str === 'controls-Popup__isolatedFocusingContext') {
                        return true;
                     }
                     return false;
                  }
               }
            };
            let focusedArea = {};
            let Manager = getManager();
            var firstResult = Manager._private.isIgnoreActivationArea(focusedContainer);
            assert.equal(firstResult, true);
            var secondResult = Manager._private.isIgnoreActivationArea(focusedArea);
            assert.equal(secondResult, false);
         });
         it('mousedownHandler', function() {
            let Manager = getManager();
            let deactivatedCount = 0;
            Manager.remove = () => deactivatedCount++;
            Manager._private.isIgnoreActivationArea = () => false;
            Manager._private.needClosePopupByDeactivated = () => true;
            let id1 = Manager.show({
               testOption: 'created',
               autofocus: false
            }, new BaseController());
            let id2 = Manager.show({
               testOption: 'created'
            }, new BaseController());
            let id3 = Manager.show({
               testOption: 'created',
               autofocus: false
            }, new BaseController());
            Manager._mouseDownHandler({});
            assert.equal(deactivatedCount, 2);
            Manager.destroy();
         });
         it('Linked Popups', function() {
            let Manager = getManager();

            let id1 = Manager.show({
            }, new BaseController());

            let fakePopupControl1 = {
                  _moduleName: 'Controls/_popup/Manager/Popup',
                  _options: {
                     id: id1
                  }
               };

            let id2 = Manager.show({
               opener: fakePopupControl1
            }, new BaseController());

            assert.equal(Manager._private.popupItems.at(0).childs[0].id, id2);
            assert.equal(Manager._private.popupItems.at(1).parentId, id1);

            let item1 = Manager._private.popupItems.at(0);
            let removeDeferred2 = new Deferred();
            let baseRemove = Manager._private.removeElement;
            Manager._private.removeElement = (element, container, popupId) => {
               if (popupId === id2) {
                  element.controller._elementDestroyed = () => removeDeferred2;
               }
               Manager._private._notify = () => {};
               return baseRemove.call(Manager._private, element, container, popupId);
            };
            Manager.remove(id1);
            assert.equal(Manager._private.popupItems.getCount(), 2);
            removeDeferred2.callback();
            assert.equal(Manager._private.popupItems.getCount(), 0);

            Manager.destroy();
         });

         it('removeFromParentConfig', function() {
            let Manager = getManager();

            let id1 = Manager.show({
            }, new BaseController());

            let fakePopupControl1 = {
               _moduleName: 'Controls/_popup/Manager/Popup',
               _options: {
                  id: id1
               }
            };

            let id2 = Manager.show({
               opener: fakePopupControl1
            }, new BaseController());

            assert.equal(Manager._private.popupItems.at(0).childs.length, 1);
            Manager._private.removeFromParentConfig(Manager._private.popupItems.at(1));
            assert.equal(Manager._private.popupItems.at(0).childs.length, 0);

            Manager.destroy();
         });
         it('managerPopupCreated notified', function() {
            let isPopupOpenedEventTriggered = false;
            let popupOptions = {
               modal: false,
               maximize: false,
               testOption: 'created',
               _events: {
                  onOpen: () => {
                     isPopupOpenedEventTriggered = true;
                  }
               }
            };
            let Manager = getManager();
            var isCreateNotified;
            Manager._notify = function(event, args, params) {
               isCreateNotified = event === 'managerPopupCreated';
               assert.isTrue(popupOptions === args[0].popupOptions);
               assert.isTrue(params.hasOwnProperty('bubbling'));
            };
            let id0 = Manager.show(popupOptions, new BaseController());
            Manager._private.popupCreated.call(Manager, id0);
            assert.isTrue(isCreateNotified);
            assert.isTrue(isPopupOpenedEventTriggered);
         });
      });
   }
);
