import Control = require('Core/Control');
import template = require('wml!Controls/_popup/Manager/Manager');
import ManagerController = require('Controls/_popup/Manager/ManagerController');
import randomId = require('Core/helpers/Number/randomId');
import runDelayed = require('Core/helpers/Function/runDelayed');
import collection = require('Types/collection');
import Deferred = require('Core/Deferred');
import ParallelDeferred = require('Core/ParallelDeferred');
import EnvEvent = require('Env/Event');
import Env = require('Env/Env');
import Vdom = require('Vdom/Vdom');

const _private = {
    activeElement: {},

    initializePopupItems() {
        _private.popupItems = new collection.List();
    },

    addElement(element) {
        _private.popupItems.add(element);
        if (element.modal) {
            ManagerController.getContainer().setOverlay(_private.popupItems.getCount() - 1);
        }
    },

    remove(self, id) {
        const item = _private.find(id);
        const removeDeferred = new Deferred();
        if (item) {
            _private.closeChilds(self, item).addCallback(function() {
                _private.finishPendings(id, null, null, function() {
                    _private.removeElement.call(self, item, _private.getItemContainer(id), id).addCallback(function() {
                        removeDeferred.callback();
                    });
                });
            });
        } else {
            removeDeferred.callback();
        }
        return removeDeferred;
    },

    closeChilds(self, item) {
        if (!item.childs.length) {
            return (new Deferred()).callback();
        }
        const parallelDeferred = new ParallelDeferred();
        for (let i = 0; i < item.childs.length; i++) {
            parallelDeferred.push(_private.remove(self, item.childs[i].id));
        }
        return parallelDeferred.done().getResult();
    },

    removeElement(element, container, id) {
        const self = this;
        const removeDeferred = element.controller._elementDestroyed(element, container, id);
        _private.redrawItems();

        if (element.popupOptions.maximize) {
            self._hasMaximizePopup = false;
        }

        self._notify('managerPopupBeforeDestroyed', [element, _private.popupItems, container], {bubbling: true});
        return removeDeferred.addCallback(function afterRemovePopup() {
            _private.fireEventHandler(id, 'onClose');
            _private.popupItems.remove(element);
            _private.removeFromParentConfig(element);

            _private.updateOverlay();
            _private.redrawItems();
            self._notify('managerPopupDestroyed', [element, _private.popupItems], {bubbling: true});
        });
    },

    removeFromParentConfig(item) {
        const parent = _private.find(item.parentId);
        if (parent) {
            for (let i = 0; i < parent.childs.length; i++) {
                if (parent.childs[i].id === item.id) {
                    parent.childs.splice(i, 1);
                    return;
                }
            }
        }
    },

    activatePopup(item) {
        if (item.controller.needRestoreFocus(item.isActive)) {
            const maxId = _private.getMaxZIndexPopupIdForActivate();
            if (maxId) {
                const child = ManagerController.getContainer().getPopupById(maxId);

                if (child) {
                    child.activate();
                }
            } else if (_private.needActivateControl(item.activeControlAfterDestroy)) {
                if (item.activeControlAfterDestroy.activate) {
                    item.activeControlAfterDestroy.activate();
                } else if (item.activeControlAfterDestroy.setActive) { // TODO: COMPATIBLE
                    item.activeControlAfterDestroy.setActive(true);
                }
            }
        }
    },

    needActivateControl(control) {
        // check is active control exist, it can be redrawn by vdom or removed from DOM while popup exist
        // The node can be hidden through display: none
        return control && !control._destroyed && control._container !== document.body;
    },

    getMaxZIndexPopupIdForActivate() {
        const items = _private.popupItems;
        for (let i = items.getCount() - 1; i > -1; i--) {
            if (items.at(i).popupState !== items.at(i).controller.POPUP_STATE_DESTROYED) {
                if (items.at(i).popupOptions.autofocus !== false) {
                    return items.at(i).id;
                }
            }
        }
        return null;
    },

    updateOverlay() {
        const indices = _private.popupItems.getIndicesByValue('modal', true);
        ManagerController.getContainer().setOverlay(indices.length ? indices[indices.length - 1] : -1);
    },

    pageScrolled(id: string): boolean {
        const item = _private.find(id);
        if (item) {
            return item.controller.pageScrolled(item, _private.getItemContainer(id));
        }
        return false;
    },

    popupCreated(id) {
        const element = _private.find(id);
        if (element) {
            // Register new popup
            _private.fireEventHandler(id, 'onOpen');
            element.controller._elementCreated(element, _private.getItemContainer(id), id);
            this._notify('managerPopupCreated', [element, _private.popupItems], {bubbling: true});
            return true;
        }
        return false;
    },

    popupUpdated(id) {
        const element = _private.find(id);
        if (element) {
            const needUpdate = element.controller._elementUpdated(element, _private.getItemContainer(id)); // при создании попапа, зарегистрируем его
            this._notify('managerPopupUpdated', [element, _private.popupItems], {bubbling: true});
            return !!needUpdate;
        }
        return false;
    },

    popupMaximized(id, state) {
        const element = _private.find(id);
        if (element) {
            element.controller.elementMaximized(element, _private.getItemContainer(id), state);
            this._notify('managerPopupMaximized', [element, _private.popupItems], {bubbling: true});
            return true;
        }
        return false;
    },

    popupAfterUpdated(id) {
        const element = _private.find(id);
        if (element) {
            return element.controller._elementAfterUpdated(element, _private.getItemContainer(id)); // при создании попапа, зарегистрируем его
        }
        return false;
    },

    popupActivated(id) {
        const item = _private.find(id);
        if (item) {
            item.waitDeactivated = false;
            item.isActive = true;
        }
    },

    popupDeactivated(id) {
        const item = _private.find(id);
        if (item) {
            item.isActive = false;
            if (_private.needClosePopupByDeactivated(item)) {
                if (!_private.isIgnoreActivationArea(_private.getActiveElement())) {
                    _private.finishPendings(id, null, function() {
                        // if pendings is exist, take focus back while pendings are finishing
                        _private.getPopupContainer().getPopupById(id).activate();
                    }, function() {
                        const itemContainer = _private.getItemContainer(id);
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

    needClosePopupByDeactivated(item) {
        return item.popupOptions.closeOnOutsideClick && item.popupState !== item.controller.POPUP_STATE_INITIALIZING;
    },

    getActiveElement() {
        return document && document.activeElement;
    },

    goUpByControlTree(target) {
        return Vdom.goUpByControlTree(target);
    },

    getActiveControl() {
        return _private.goUpByControlTree(_private.getActiveElement())[0];
    },

    popupDragStart(id, offset) {
        const element = _private.find(id);
        if (element) {
            element.controller.popupDragStart(element, _private.getItemContainer(id), offset);
            return true;
        }
        return false;
    },

    popupMouseEnter(id, event) {
        const item = _private.find(id);
        if (item) {
            item.controller.popupMouseEnter(item, _private.getItemContainer(id), event);
        }
        return false;
    },

    popupMouseLeave(id, event) {
        const item = _private.find(id);
        if (item) {
            item.controller.popupMouseLeave(item, _private.getItemContainer(id), event);
        }
        return false;
    },

    popupControlResize(id) {
        const element = _private.find(id);
        if (element) {
            return element.controller.popupResize(element, _private.getItemContainer(id));
        }
        return false;
    },

    popupDragEnd(id, offset) {
        const element = _private.find(id);
        if (element) {
            element.controller.popupDragEnd(element, offset);
            return true;
        }
        return false;
    },

    popupResult(id) {
        const args = Array.prototype.slice.call(arguments, 1);
        return _private.fireEventHandler.apply(this, [id, 'onResult'].concat(args));
    },

    popupClose(id) {
        _private.remove(this, id);
        return false;
    },

    popupAnimated(id) {
        const item = _private.findItemById(id);
        if (item) {
            return item.controller.elementAnimated(item, _private.getItemContainer(id));
        }
        return false;
    },

    fireEventHandler(id, event) {
        const item = _private.findItemById(id);
        const args = Array.prototype.slice.call(arguments, 2);
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

    getItemContainer(id) {
        const popupContainer = ManagerController.getContainer();
        const item = popupContainer && popupContainer._children[id];
        let container = item && item._container;

        // todo https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
        if (container && container.jquery) {
            container = container[0];
        }
        return container;
    },

    redrawItems() {
        _private.popupItems._nextVersion();
        ManagerController.getContainer().setPopupItems(_private.popupItems);
    },

    controllerVisibilityChangeHandler(): void {
        const keyboardAnimationDelay = 250;
        // wait, until keyboard show/hide for positioning popup
        setTimeout(() => {
            _private.popupItems.each((item) => {
                if (item.controller.needRecalcOnKeyboardShow()) {
                    item.controller._elementUpdated(item, _private.getItemContainer(item.id));
                }
            });
            _private.redrawItems();
        }, keyboardAnimationDelay);
    },

    getPopupContainer() {
        return ManagerController.getContainer();
    },

    finishPendings(popupId, popupCallback, pendingCallback, pendingsFinishedCallback) {
        const registrator = _private.getPopupContainer().getPendingById(popupId);
        const item = _private.findItemById(popupId);
        if (item && registrator) {
            popupCallback && popupCallback();

            if (registrator) {
                if (registrator._hasRegisteredPendings()) {
                    pendingCallback && pendingCallback();
                }
                const finishDef = registrator.finishPendingOperations();
                finishDef.addCallbacks(function() {
                    pendingsFinishedCallback && pendingsFinishedCallback();
                }, function(e) {
                    Env.IoC.resolve('ILogger').error('Controls/_popup/Manager/Container', 'Не получилось завершить пендинги: (name: ' + e.name + ', message: ' + e.message + ', details: ' + e.details + ')', e);
                    pendingsFinishedCallback && pendingsFinishedCallback();
                });
            }
        } else {
            pendingsFinishedCallback && pendingsFinishedCallback();
        }
    },

    isIgnoreActivationArea(focusedContainer) {
        while (focusedContainer) {
            if (focusedContainer.classList && focusedContainer.classList.contains('controls-Popup__isolatedFocusingContext')) {
                return true;
            }
            focusedContainer = focusedContainer.parentElement;
        }
        return false;
    },

    find(id) {
        const item = _private.findItemById(id);

        if (!item || item.popupState === item.controller.POPUP_STATE_DESTROYING || item.popupState === item.controller.POPUP_STATE_DESTROYED) {
            return null;
        }

        return item;
    },

    findItemById(id) {
        const index = _private.popupItems && _private.popupItems.getIndexByValue('id', id);
        if (index > -1) {
            return _private.popupItems.at(index);
        }
        return null;
    },

    // TODO Compatible
    // Старые панели прерывали свое закрытие без механизма пендингов, на событие onBeforeClose
    // Зовем метод close с шаблона. Если закрывать по механизму деактивации, то он уничтожит попап =>
    // у compoundArea вызовется сразу destroy. такую логику прервать нельзя
    _getCompoundArea(popupContainer) {
        return $('.controls-CompoundArea', popupContainer)[0].controlNodes[0].control;
    }
};

/**
 * Popups Manager
 * @class Controls/_popup/Manager
 * @private
 * @singleton
 * @category Popup
 * @author Красильников Андрей
 */

const Manager = Control.extend({
    _template: template,
    _afterMount() {
        ManagerController.setManager(this);
        ManagerController.setPopupHeaderTheme(this._options.popupHeaderTheme);
        this._hasMaximizePopup = false;
        _private.initializePopupItems();
        if (Env.detection.isMobileIOS) {
            _private.controllerVisibilityChangeHandler = _private.controllerVisibilityChangeHandler.bind(_private);
            EnvEvent.Bus.globalChannel().subscribe('MobileInputFocus', _private.controllerVisibilityChangeHandler);
            EnvEvent.Bus.globalChannel().subscribe('MobileInputFocusOut', _private.controllerVisibilityChangeHandler);
        }
    },

    /**
     * Show
     * @function Controls/_popup/Manager#show
     * @param options popup configuration
     * @param controller popup controller
     */
    show(options, controller) {
        const item = this._createItemConfig(options, controller);
        controller.getDefaultConfig(item);
        _private.addElement.call(this, item);
        _private.redrawItems();
        return item.id;
    },

    updateOptionsAfterInitializing(id, options) {
        const item = this.find(id);
        if (item && item.popupState === item.controller.POPUP_STATE_INITIALIZING) {
            item.popupOptions = options;
            item.controller.getDefaultConfig(item);
            _private.popupItems._nextVersion();
        }
    },

    _createItemConfig(options, controller) {
        const popupId = randomId('popup-');
        const popupConfig = {
            id: popupId,
            modal: options.modal,
            controller,
            popupOptions: options,
            isActive: false,
            waitDeactivated: options.autofocus === false,
            sizes: {},
            activeControlAfterDestroy: _private.getActiveControl(),
            activeNodeAfterDestroy: _private.getActiveElement(), // TODO: COMPATIBLE
            popupState: controller.POPUP_STATE_INITIALIZING,
            hasMaximizePopup: this._hasMaximizePopup,
            childs: []
        };
        if (!this._hasMaximizePopup && options.maximize) {
            this._hasMaximizePopup = true;
        }

        this._registerPopupLink(popupConfig);
        return popupConfig;
    },

    // Register the relationship between the parent and child popup
    _registerPopupLink(popupConfig) {
        if (popupConfig.popupOptions.opener) {
            const parent = this._findParentPopup(popupConfig.popupOptions.opener);
            if (parent) {
                const id = parent._options.id;
                const item = this.find(id);
                if (item) {
                    item.childs.push(popupConfig);
                    popupConfig.parentId = item.id;
                }
            }
        }
    },

    _findParentPopup(control) {
        while (control && control._moduleName !== 'Controls/_popup/Manager/Popup') {
            control = control._logicParent || (control.getParent && control.getParent());
        }
        return control;
    },

    _mouseDownHandler(event) {
        if (_private.popupItems && !_private.isIgnoreActivationArea(event.target)) {
            const deactivatedPopups = [];
            _private.popupItems.each(function(item) {
                // if we have deactivated popup
                if (item && item.waitDeactivated) {
                    const parentControls = _private.goUpByControlTree(event.target);
                    const popupInstance = ManagerController.getContainer().getPopupById(item.id);

                    // Check the link between target and popup
                    if (_private.needClosePopupByDeactivated(item) && parentControls.indexOf(popupInstance) === -1) {
                        deactivatedPopups.push(item.id);
                    }
                }
            });
            for (let i = 0; i < deactivatedPopups.length; i++) {
                this.remove(deactivatedPopups[i]);
            }
        }
    },

    /**
     * Upgrade options of an existing popup
     * @function Controls/_popup/Manager#update
     * @param id popup id
     * @param options new options of popup
     */
    update(id, options) {
        const element = this.find(id);
        if (element) {
            const oldOptions = element.popupOptions;
            element.popupOptions = options;
            if (element.controller._elementUpdated(element, _private.getItemContainer(id))) {
                _private.updateOverlay();
                _private.redrawItems();

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
     * @function Controls/_popup/Manager#remove
     * @param id popup id
     */
    remove(id) {
        return _private.remove(this, id);
    },

    /**
     * Find popup configuration
     * @function Controls/_popup/Manager#find
     * @param id popup id
     */
    find(id) {
        return _private.find(id);
    },

    /**
     * Reindex a set of popups, for example, after changing the configuration of one of them
     * @function Controls/_popup/Manager#reindex
     */
    reindex() {
        _private.popupItems._reindex();
    },

    _eventHandler(event, actionName) {
        const args = Array.prototype.slice.call(arguments, 2);
        const actionResult = _private[actionName].apply(this, args);
        if (actionResult === true) {
            _private.redrawItems();
        }
    },
    _beforeUnmount() {
        if (Env.detection.isMobileIOS) {
            EnvEvent.Bus.globalChannel().unsubscribe('MobileInputFocus', _private.controllerVisibilityChangeHandler);
            EnvEvent.Bus.globalChannel().unsubscribe('MobileInputFocusOut', _private.controllerVisibilityChangeHandler);
        }
    }
});

Manager.prototype._private = _private;
export = Manager;
