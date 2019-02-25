define('Controls/Popup/Manager',
   [
      'Core/Control',
      'wml!Controls/Popup/Manager/Manager',
      'Controls/Popup/Manager/ManagerController',
      'Core/helpers/Number/randomId',
      'Core/helpers/Function/runDelayed',
      'Types/collection',
      'Env/Event',
      'Env/Env',
      'Vdom/Vdom'
   ],

   function(Control, template, ManagerController, randomId, runDelayed, collection, EnvEvent, Env, Vdom) {
      'use strict';

      var _private = {
         activeElement: {},

         addElement: function(element) {
            this._popupItems.add(element);
            if (element.isModal) {
               ManagerController.getContainer().setOverlay(this._popupItems.getCount() - 1);
            }
         },

         removeElement: function(element, container, id) {
            var self = this;
            var removeDeferred = element.controller._elementDestroyed(element, container, id);
            _private.redrawItems(self._popupItems);

            if (element.popupOptions.maximize) {
               self._hasMaximizePopup = false;
            }

            self._notify('managerPopupBeforeDestroyed', [element, self._popupItems, container], { bubbling: true });
            return removeDeferred.addCallback(function afterRemovePopup() {
               _private.fireEventHandler.call(self, id, 'onClose');
               self._popupItems.remove(element);

               // If the popup is not active, don't set the focus
               if (element.isActive) {
                  _private.activatePopup(element, self._popupItems);
               }

               _private.updateOverlay.call(self);
               _private.redrawItems(self._popupItems);
               self._notify('managerPopupDestroyed', [element, self._popupItems], { bubbling: true });
            });
         },

         activatePopup: function(element, items) {
            // wait, until closing popup will be removed from DOM
            runDelayed(function activatePopup() {
               // check is active control exist, it can be redrawn by vdom or removed from DOM while popup exist
               if (element.activeNodeAfterDestroy && element.activeNodeAfterDestroy.parentElement) {
                  element.activeNodeAfterDestroy.focus(); // TODO: COMPATIBLE
               } else if (element.activeControlAfterDestroy && !element.activeControlAfterDestroy._unmounted) {
                  element.activeControlAfterDestroy.activate && element.activeControlAfterDestroy.activate();
               } else {
                  var maxId = _private.getMaxZIndexPopupIdForActivate(items);
                  if (maxId) {
                     var child = ManagerController.getContainer().getPopupById(maxId);

                     if (child) {
                        child.activate();
                     }
                  }
               }
            });
         },

         getMaxZIndexPopupIdForActivate: function(items) {
            for (var i = items.getCount() - 1; i > -1; i--) {
               if (items.at(i).popupOptions.autofocus !== false) {
                  return items.at(i).id;
               }
            }
            return null;
         },

         updateOverlay: function() {
            var indices = this._popupItems.getIndicesByValue('isModal', true);
            ManagerController.getContainer().setOverlay(indices.length ? indices[indices.length - 1] : -1);
         },

         popupCreated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               // Register new popup
               _private.fireEventHandler.call(this, id, 'onOpen');
               element.controller._elementCreated(element, _private.getItemContainer(id), id);
               this._notify('managerPopupCreated', [element, this._popupItems], { bubbling: true });
               return true;
            }
            return false;
         },

         popupUpdated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               var needUpdate = element.controller._elementUpdated(element, _private.getItemContainer(id)); // при создании попапа, зарегистрируем его
               this._notify('managerPopupUpdated', [element, this._popupItems], { bubbling: true });
               return !!needUpdate;
            }
            return false;
         },

         popupMaximized: function(id, state) {
            var element = ManagerController.find(id);
            if (element) {
               element.controller.elementMaximized(element, _private.getItemContainer(id), state);
               this._notify('managerPopupMaximized', [element, this._popupItems], { bubbling: true });
               return true;
            }
            return false;
         },

         popupAfterUpdated: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               return element.controller._elementAfterUpdated(element, _private.getItemContainer(id)); // при создании попапа, зарегистрируем его
            }
            return false;
         },

         popupActivated: function(id) {
            var item = ManagerController.find(id);
            if (item) {
               item.waitDeactivated = false;
               item.isActive = true;
            }
            _private.activeElement = {};
         },

         popupDeactivated: function(id) {
            var item = ManagerController.find(id);
            if (item) {
               item.isActive = false;
               if (item.popupOptions.closeByExternalClick) {
                  if (!_private.isIgnoreActivationArea(_private.getActiveElement())) {
                     _private.finishPendings(id, function() {
                        if (!_private.activeElement[id]) {
                           _private.activeElement[id] = _private.getActiveElement();
                        }
                     }, function(popup) {
                        // if pendings is exist, take focus back while pendings are finishing
                        popup._container.focus();
                     }, function() {
                        var itemContainer = _private.getItemContainer(id);
                        if (item.popupOptions.isCompoundTemplate) {
                           _private._getCompoundArea(itemContainer).close();
                        } else {
                           item.controller.popupDeactivated(item, itemContainer);
                        }
                     });
                  } else {
                     item.waitDeactivated = true;
                  }
               }
            }
            return false;
         },

         getActiveElement: function() {
            return document && document.activeElement;
         },

         getActiveControl: function() {
            return Vdom.DOMEnvironment._goUpByControlTree(_private.getActiveElement())[0];
         },

         popupDragStart: function(id, offset) {
            var element = ManagerController.find(id);
            if (element) {
               element.controller.popupDragStart(element, _private.getItemContainer(id), offset);
               return true;
            }
            return false;
         },

         popupControlResize: function(id) {
            var element = ManagerController.find(id);
            if (element) {
               return element.controller.popupResize(element, _private.getItemContainer(id));
            }
            return false;
         },

         popupDragEnd: function(id, offset) {
            var element = ManagerController.find(id);
            if (element) {
               element.controller.popupDragEnd(element, offset);
               return true;
            }
            return false;
         },

         popupResult: function(id) {
            var args = Array.prototype.slice.call(arguments, 1);
            return _private.fireEventHandler.apply(this, [id, 'onResult'].concat(args));
         },

         popupClose: function(id) {
            _private.finishPendings(id, null, null, function() {
               ManagerController.remove(id, _private.getItemContainer(id));
            });
            return false;
         },

         popupDestroyed: function(id) {
            if (_private.activeElement[id]) {
               // its need to focus element on _afterUnmount, thereby _popupDeactivated not be when focus is occured.
               // but _afterUnmount is not exist, thereby its called setTimeout on _beforeUnmount of popup for wait needed state.
               setTimeout(function() {
                  // new popup can be activated and take focus during the timeout
                  // will be fixed by https://online.sbis.ru/opendoc.html?guid=95166dc7-7eae-4728-99e2-e65251dd3ee3
                  if (_private.activeElement[id]) {
                     _private.activeElement[id].focus();
                     delete _private.activeElement[id];
                  }
               }, 0);
            }
            return false;
         },

         popupAnimated: function(id) {
            var item = _private.findItemById(this, id);
            if (item) {
               return item.controller.elementAnimated(item, _private.getItemContainer(id));
            }
            return false;
         },

         fireEventHandler: function(id, event) {
            var item = _private.findItemById(this, id);
            var args = Array.prototype.slice.call(arguments, 2);
            if (item) {
               if (item.popupOptions._events) {
                  item.popupOptions._events[event](event, args);
               }
               if (item.popupOptions.eventHandlers && typeof item.popupOptions.eventHandlers[event] === 'function') {
                  item.popupOptions.eventHandlers[event].apply(item.popupOptions, args);
                  return true;
               }
            }
            return false;
         },

         getItemContainer: function(id) {
            var popupContainer = ManagerController.getContainer();
            var item = popupContainer && popupContainer._children[id];
            var container = item && item._container;

            // todo https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            if (container && container.jquery) {
               container = container[0];
            }
            return container;
         },

         redrawItems: function(items) {
            ManagerController.getContainer().setPopupItems(items);
         },

         controllerVisibilityChangeHandler: function(instance) {
            instance._popupItems.each(function(item) {
               if (item.controller.needRecalcOnKeyboardShow()) {
                  item.controller._elementUpdated(item, _private.getItemContainer(item.id));
               }
            });
            _private.redrawItems(instance._popupItems);
         },

         finishPendings: function(popupId, popupCallback, pendingCallback, pendingsFinishedCallback) {
            var PopupContainer = ManagerController.getContainer();
            var popup = PopupContainer.getPopupById(popupId);
            if (popup) {
               popupCallback && popupCallback(popup);

               var registrator = PopupContainer.getPendingById(popupId);
               if (registrator) {
                  if (registrator._hasRegisteredPendings()) {
                     pendingCallback && pendingCallback(popup);
                  }
                  var finishDef = registrator.finishPendingOperations();
                  finishDef.addCallbacks(function() {
                     pendingsFinishedCallback && pendingsFinishedCallback(popup);
                  }, function(e) {
                     Env.IoC.resolve('ILogger').error('Controls/Popup/Manager/Container', 'Не получилось завершить пендинги: (name: ' + e.name + ', message: ' + e.message + ', details: ' + e.details + ')', e);
                     pendingsFinishedCallback && pendingsFinishedCallback(popup);
                  });
               }
            }
         },

         isIgnoreActivationArea: function(focusedContainer) {
            while (focusedContainer) {
               if (focusedContainer.classList && focusedContainer.classList.contains('controls-Popup__isolatedFocusingContext')) {
                  return true;
               }
               focusedContainer = focusedContainer.parentElement;
            }
            return false;
         },

         findItemById: function(self, id) {
            var index = self._popupItems && self._popupItems.getIndexByValue('id', id);
            if (index > -1) {
               return self._popupItems.at(index);
            }
            return null;
         },

         // TODO Compatible
         // Старые панели прерывали свое закрытие без механизма пендингов, на событие onBeforeClose
         // Зовем метод close с шаблона. Если закрывать по механизму деактивации, то он уничтожит попап =>
         // у compoundArea вызовется сразу destroy. такую логику прервать нельзя
         _getCompoundArea: function(popupContainer) {
            return $('.controls-CompoundArea', popupContainer)[0].controlNodes[0].control;
         }
      };

      /**
       * Popups Manager
       * @class Controls/Popup/Manager
       * @private
       * @singleton
       * @category Popup
       * @author Красильников Андрей
       */

      var Manager = Control.extend({
         _template: template,
         _afterMount: function() {
            ManagerController.setManager(this);
            this._hasMaximizePopup = false;
            this._popupItems = new collection.List();
            if (Env.detection.isMobileIOS) {
               _private.controllerVisibilityChangeHandler = _private.controllerVisibilityChangeHandler.bind(_private, this);
               EnvEvent.Bus.globalChannel().subscribe('MobileInputFocus', _private.controllerVisibilityChangeHandler);
               EnvEvent.Bus.globalChannel().subscribe('MobileInputFocusOut', _private.controllerVisibilityChangeHandler);
            }
         },

         /**
          * Show
          * @function Controls/Popup/Manager#show
          * @param options popup configuration
          * @param controller popup controller
          */
         show: function(options, controller) {
            var item = this._createItemConfig(options, controller);
            controller.getDefaultConfig(item);
            _private.addElement.call(this, item);
            _private.redrawItems(this._popupItems);
            return item.id;
         },

         updateOptionsAfterInitializing: function(id, options) {
            var item = this.find(id);
            if (item && item.popupState === item.controller.POPUP_STATE_INITIALIZING) {
               item.popupOptions = options;
               item.controller.getDefaultConfig(item);
            }
         },

         _createItemConfig: function(options, controller) {
            if (!this._hasMaximizePopup && options.maximize) {
               this._hasMaximizePopup = true;
            }
            return {
               id: randomId('popup-'),
               isModal: options.isModal,
               controller: controller,
               popupOptions: options,
               isActive: false,
               sizes: {},
               activeControlAfterDestroy: _private.getActiveControl(),
               activeNodeAfterDestroy: _private.getActiveElement(), // TODO: COMPATIBLE
               popupState: controller.POPUP_STATE_INITIALIZING,
               hasMaximizePopup: this._hasMaximizePopup
            };
         },

         _contentClick: function(event) {
            this._popupItems.each(function(item) {
               if (item && item.waitDeactivated) {
                  if (!_private.isIgnoreActivationArea(event.target)) {
                     _private.popupDeactivated(item.id);
                  }
               }
            });
         },

         /**
          * Upgrade options of an existing popup
          * @function Controls/Popup/Manager#update
          * @param id popup id
          * @param options new options of popup
          */
         update: function(id, options) {
            var element = this.find(id);
            if (element) {
               var oldOptions = element.popupOptions;
               element.popupOptions = options;
               if (element.controller._elementUpdated(element, _private.getItemContainer(id))) {
                  _private.updateOverlay.call(this);
                  _private.redrawItems(this._popupItems);

                  // wait, until popup will be update options
                  runDelayed(function() {
                     ManagerController.getContainer().activatePopup(id);
                  });
               } else {
                  element.popupOptions = oldOptions;
               }
               return id;
            }
            return null;
         },

         /**
          * Remove popup
          * @function Controls/Popup/Manager#remove
          * @param id popup id
          */
         remove: function(id) {
            var element = this.find(id);
            if (element) {
               _private.removeElement.call(this, element, _private.getItemContainer(id), id);
            }
         },

         /**
          * Find popup configuration
          * @function Controls/Popup/Manager#find
          * @param id popup id
          */
         find: function(id) {
            var item = _private.findItemById(this, id);

            if (!item || item.popupState === item.controller.POPUP_STATE_DESTROYING || item.popupState === item.controller.POPUP_STATE_DESTROYED) {
               return null;
            }

            return item;
         },

         /**
          * Reindex a set of popups, for example, after changing the configuration of one of them
          * @function Controls/Popup/Manager#reindex
          */
         reindex: function() {
            this._popupItems._reindex();
         },

         _eventHandler: function(event, actionName) {
            var args = Array.prototype.slice.call(arguments, 2);
            var actionResult = _private[actionName].apply(this, args);
            if (actionResult === true) {
               _private.redrawItems(this._popupItems);
            }
         },
         _beforeUnmount: function() {
            if (Env.detection.isMobileIOS) {
               EnvEvent.Bus.globalChannel().unsubscribe('MobileInputFocus', _private.controllerVisibilityChangeHandler);
               EnvEvent.Bus.globalChannel().unsubscribe('MobileInputFocusOut', _private.controllerVisibilityChangeHandler);
            }
         }
      });

      Manager.prototype._private = _private;
      return Manager;
   });
