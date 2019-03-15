define(
   [
      'Controls/Popup/Manager',
      'Controls/Popup/Manager/ManagerController',
      'Controls/Popup/Manager/Container',
      'Controls/Popup/Opener/BaseController',
      'Core/Deferred'
   ],

   function(ManagerConstructor, ManagerController, ManagerContainer, BaseController, Deferred) {
      'use strict';

      function getManager() {
         let Manager = new ManagerConstructor();
         let Container = new ManagerContainer();
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
            ManagerController._manager = undefined;
            assert.equal(ManagerController.find(), false);
         });

         it('callMethod', () => {
            getManager();
            let arg0 = '1';
            let arg1 = '2';
            let methodName;

            let baseMethod = ManagerController._callManager;

            ManagerController._callManager = (method, args) => {
               assert.equal(methodName, method);
               assert.equal(args[0], arg0);
               assert.equal(args[1], arg1);
            };

            for (methodName of ['find', 'remove', 'update', 'show', 'reindex']) {
               ManagerController[methodName](arg0, arg1);
            }

            ManagerController._callManager = baseMethod;
         });
      });

      describe('Controls/Popup/Manager', function() {
         var id, element;
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
               isModal: false,
               testOption: 'created'
            }, new BaseController());

            Manager.show({
               isModal: true,
               testOption: 'created'
            }, new BaseController());

            let indices = Manager._private.popupItems.getIndicesByValue('isModal', true);
            assert.equal(indices.length, 1);
            assert.equal(indices[0], 1);

            Manager.remove(id1);

            indices = Manager._private.popupItems.getIndicesByValue('isModal', true);
            assert.equal(indices.length, 1);
            assert.equal(indices[0], 0);
         });

         it('add maximized popup', function() {
            let Manager = getManager();
            let id0 = Manager.show({
               isModal: false,
               maximize: true,
               testOption: 'created'
            }, new BaseController());

            assert.equal(Manager._hasMaximizePopup, true);

            let id1 = Manager.show({
               isModal: true,
               testOption: 'created'
            }, new BaseController());

            assert.equal(Manager._private.popupItems.at(1).hasMaximizePopup, true);

            Manager.remove(id0);

            assert.equal(Manager._hasMaximizePopup, false);

            let id2 = Manager.show({
               isModal: true,
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
               isModal: false,
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
               isModal: false,
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
         it('managerPopupCreated notified', function() {
            let isPopupOpenedEventTriggered = false;
            let popupOptions = {
               isModal: false,
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
