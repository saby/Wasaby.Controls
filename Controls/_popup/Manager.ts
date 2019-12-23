import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import Popup from 'Controls/_popup/Manager/Popup';
import Container from 'Controls/_popup/Manager/Container';
import template = require('wml!Controls/_popup/Manager/Manager');
import ManagerController = require('Controls/_popup/Manager/ManagerController');
import randomId = require('Core/helpers/Number/randomId');
import {delay as runDelayed} from 'Types/function';
import collection = require('Types/collection');
import Deferred = require('Core/Deferred');
import EnvEvent = require('Env/Event');
import Env = require('Env/Env');
import {Logger} from 'UI/Utils';
import {IPopupItem, IPopupOptions, IPopupController} from 'Controls/_popup/interface/IPopup';
import {goUpByControlTree} from 'UI/Focus';
import isNewEnvironment = require('Core/helpers/isNewEnvironment');

const _private = {
    activeElement: {},

    initializePopupItems() {
        _private.popupItems = new collection.List();
    },

    addElement(item: IPopupItem): void {
        _private.popupItems.add(item);
        if (item.modal) {
            ManagerController.getContainer().setOverlay(_private.popupItems.getCount() - 1);
        }
    },

    remove(self, id: string): Promise<void> {
        const item = _private.find(id);
        if (item) {
            // TODO: https://online.sbis.ru/opendoc.html?guid=7a963eb8-1566-494f-903d-f2228b98f25c
            item.startRemove = true;
            return new Promise((resolve) => {
                _private.closeChilds(self, item).then(() => {
                    _private.finishPendings(id, null, null, () => {
                        _private.removeElement.call(self, item, _private.getItemContainer(id), id).then(() => {
                            resolve();
                            const parentItem = _private.find(item.parentId);
                            _private.closeChildHandler(parentItem);
                        });
                    });
                });
            });
        } else {
            return Promise.resolve();
        }
    },

    closeChilds(self, item: IPopupItem): Promise<null> {
        if (!item.childs.length) {
            return Promise.resolve(null);
        }
        for (let i = 0; i < item.childs.length; i++) {
            _private.remove(self, item.childs[i].id);
        }

        return new Promise((resolve) => {
            item.closeChildsPromiseResolver = resolve;
        });
    },

    closeChildHandler(item: IPopupItem): void {
        // Если окно ожидает закрытия, то ждем, пока не закроются все дети
        if (item && !item.childs.length) {
            if (item.closeChildsPromiseResolver) {
                item.closeChildsPromiseResolver();
            }
        }
    },

    removeElement(item: IPopupItem, container: HTMLElement, id: string): Promise<void> {
        const self = this;
        const removeDeferred = item.controller._elementDestroyed(item, container);
        _private.redrawItems();

        if (item.popupOptions.maximize) {
            self._hasMaximizePopup = false;
        }

        self._notify('managerPopupBeforeDestroyed', [item, _private.popupItems, container], {bubbling: true});
        return removeDeferred.addCallback(() => {
            _private.fireEventHandler(id, 'onClose');
            _private.popupItems.remove(item);
            _private.removeFromParentConfig(item);

            _private.updateOverlay();
            _private.redrawItems();
            self._notify('managerPopupDestroyed', [item, _private.popupItems], {bubbling: true});
        });
    },

    removeFromParentConfig(item: IPopupItem): void {
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

    isNewEnvironment(): boolean {
        return isNewEnvironment();
    },

    activatePopup(item: IPopupItem): void {
        // on old page vdom manager don't know about old windows/
        if (_private.isNewEnvironment() && item.controller.needRestoreFocus(item.isActive)) {
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

    needActivateControl(control: Control): boolean {
        // check is active control exist, it can be redrawn by vdom or removed from DOM while popup exist
        // The node can be hidden through display: none
        return control && !control._destroyed && control._container !== document.body;
    },

    getMaxZIndexPopupIdForActivate(): string | null {
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

    updateOverlay(): void {
        const indices = _private.popupItems.getIndicesByValue('modal', true);
        ManagerController.getContainer().setOverlay(indices.length ? indices[indices.length - 1] : -1);
    },

    prepareIsTouchData(self, item: IPopupItem): void {
        item.contextIsTouch = self._contextIsTouch;
    },

    pageScrolled(id: string): boolean {
        const item = _private.find(id);
        if (item) {
            return item.controller.pageScrolled(item, _private.getItemContainer(id));
        }
        return false;
    },

    popupBeforePaintOnMount(id: string): void {
        const item = _private.find(id);
        if (item) {
            if (!item.popupOptions.isCompoundTemplate) {
                this._notify('managerPopupCreated', [item, _private.popupItems], {bubbling: true});
            }
        }
    },

    popupCreated(id: string): boolean {
        const item = _private.find(id);
        if (item) {
            // Register new popup
            _private.fireEventHandler(id, 'onOpen');
            _private.prepareIsTouchData(this, item);
            item.controller._elementCreated(item, _private.getItemContainer(id), id);
            // if it's CompoundTemplate, then compoundArea notify event, when template will ready.
            // notify this event on popupBeforePaintOnMount, cause we need synchronous reaction on created popup
            // if (!item.popupOptions.isCompoundTemplate) {
            //     this._notify('managerPopupCreated', [item, _private.popupItems], {bubbling: true});
            // }
            return true;
        }
        return false;
    },
    popupResizingLine(id: string, offset: number): boolean {
        const element = _private.find(id);
        if (element) {
            element.controller._popupResizingLine(element, offset);
            this._notify('managerPopupUpdated', [element, _private.popupItems], {bubbling: true});
            return true;
        }
        return false;
    },

    popupUpdated(id: string): boolean {
        const element = _private.find(id);
        if (element) {
            const needUpdate = element.controller._elementUpdated(element, _private.getItemContainer(id)); // при создании попапа, зарегистрируем его
            this._notify('managerPopupUpdated', [element, _private.popupItems], {bubbling: true});
            return !!needUpdate;
        }
        return false;
    },

    popupMaximized(id: string, state: boolean): boolean {
        const element = _private.find(id);
        if (element) {
            element.controller._elementMaximized(element, _private.getItemContainer(id), state);
            this._notify('managerPopupMaximized', [element, _private.popupItems], {bubbling: true});
            return true;
        }
        return false;
    },

    popupAfterUpdated(id: string): boolean {
        const element = _private.find(id);
        if (element) {
            // при создании попапа, зарегистрируем его
            return element.controller._elementAfterUpdated(element, _private.getItemContainer(id));
        }
        return false;
    },

    popupActivated(id: string): void {
        const item = _private.find(id);
        if (item) {
            item.waitDeactivated = false;
            item.isActive = true;
        }
    },

    popupDeactivated(id: string): boolean {
        const item = _private.find(id);
        if (item) {
            item.isActive = false;
            if (_private.needClosePopupByDeactivated(item)) {
                if (!_private.isIgnoreActivationArea(_private.getActiveElement())) {
                    _private.finishPendings(id, null, function() {
                        // if pendings is exist, take focus back while pendings are finishing
                        _private.getPopupContainer().getPopupById(id).activate();
                    }, () => {
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

    needClosePopupByDeactivated(item: IPopupItem): boolean {
        return item.popupOptions.closeOnOutsideClick && item.popupState !== item.controller.POPUP_STATE_INITIALIZING;
    },

    getActiveElement(): HTMLElement {
        return document && document.activeElement as HTMLElement;
    },

    getActiveControl(): Control {
        return goUpByControlTree(_private.getActiveElement())[0];
    },

    popupDragStart(id: string, offset: number): boolean {
        const element = _private.find(id);
        if (element) {
            element.controller.popupDragStart(element, _private.getItemContainer(id), offset);
            return true;
        }
        return false;
    },

    popupMouseEnter(id: string, event: Event): boolean {
        const item = _private.find(id);
        if (item) {
            item.controller.popupMouseEnter(item, _private.getItemContainer(id), event);
        }
        return false;
    },

    popupMouseLeave(id: string, event: Event): boolean {
        const item = _private.find(id);
        if (item) {
            item.controller.popupMouseLeave(item, _private.getItemContainer(id), event);
        }
        return false;
    },

    popupResizeInner(id: string): boolean {
        const item = _private.find(id);
        if (item) {
            const parentItem = _private.find(item.parentId);
            // Если над скрытым стековым окном позиционируются другие окна,
            // то не даем им реагировать на внутренние ресайзы
            // иначе позиция может сбиться, т.к. таргет в текущий момент невидим
            if (!parentItem || parentItem.popupOptions.hidden !== true) {
                return item.controller.resizeInner(item, _private.getItemContainer(id));
            }
        }
        return false;
    },

    popupResizeOuter(id: string): boolean {
        const item = _private.find(id);
        if (item) {
            return item.controller.resizeOuter(item, _private.getItemContainer(id));
        }
        return false;
    },

    popupDragEnd(id: string, offset: number): boolean {
        const element = _private.find(id);
        if (element) {
            element.controller._popupDragEnd(element, offset);
            return true;
        }
        return false;
    },

    popupResult(id: string): boolean {
        const args = Array.prototype.slice.call(arguments, 1);
        return _private.fireEventHandler.apply(this, [id, 'onResult'].concat(args));
    },

    popupClose(id: string): boolean {
        _private.remove(this, id);
        return false;
    },

    popupAnimated(id: string): boolean {
        const item = _private.findItemById(id);
        if (item) {
            return item.controller._elementAnimated(item, _private.getItemContainer(id));
        }
        return false;
    },

    fireEventHandler(id: string, event: string): boolean {
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

    getItemContainer(id: string): HTMLElement {
        const popupContainer = ManagerController.getContainer();
        const item = popupContainer && popupContainer._children[id];
        let container = item && item._container;

        // todo https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
        if (container && container.jquery) {
            container = container[0];
        }
        return container;
    },

    redrawItems(): void {
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

    getPopupContainer(): Container {
        return ManagerController.getContainer();
    },

    finishPendings(popupId: string,
                   popupCallback: Function,
                   pendingCallback: Function,
                   pendingsFinishedCallback: Function): void {
        const registrator = _private.getPopupContainer().getPendingById(popupId);
        const item = _private.findItemById(popupId);
        if (item && registrator) {
            popupCallback && popupCallback();

            if (registrator) {
                const hasRegisterPendings = registrator._hasRegisteredPendings();
                if (hasRegisterPendings) {
                    pendingCallback && pendingCallback();
                }
                if (item.removePending) {
                    return item.removePending;
                }
                item.removePending = registrator.finishPendingOperations();

                // TODO: Compatible Пендинги от совместимости старого FormController'a не попадают в _hasRegisteredPendings,
                // но вызываются в finishPendingOperations не завершаясь. (приходит только информация, нужно стопать закрытие или нет)
                // Сдедал правку, чтобы мы не ждали завершения пендинга от совместимости
                if (!hasRegisterPendings) {
                    item.removePending = (new Deferred()).callback();
                }
                item.removePending.addCallbacks(() => {
                    item.removePending = null;
                    pendingsFinishedCallback && pendingsFinishedCallback();
                }, (e) => {
                    item.removePending = null;
                    if (e.canceled !== true) {
                        Logger.error('Controls/_popup/Manager/Container: Не получилось завершить пендинги: ' +
                            '(name: ' + e.name + ', message: ' + e.message + ', details: ' + e.details + ')',
                            undefined, e);
                        pendingsFinishedCallback && pendingsFinishedCallback();
                    }
                });
            }
        } else {
            pendingsFinishedCallback && pendingsFinishedCallback();
        }
    },

    isIgnoreActivationArea(focusedContainer: HTMLElement): boolean {
        while (focusedContainer) {
            if (focusedContainer.classList && focusedContainer.classList.contains('controls-Popup__isolatedFocusingContext')) {
                return true;
            }
            focusedContainer = focusedContainer.parentElement;
        }
        return false;
    },

    find(id: string): IPopupItem {
        const item: IPopupItem = _private.findItemById(id);

        if (!item || item.popupState === item.controller.POPUP_STATE_DESTROYING || item.popupState === item.controller.POPUP_STATE_DESTROYED) {
            return null;
        }

        return item;
    },

    findItemById(id: string): number {
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
    _getCompoundArea(popupContainer: HTMLElement): Control {
        return $('.controls-CompoundArea', popupContainer)[0].controlNodes[0].control;
    },
    updatePopupOptions(id: string, item: IPopupItem, oldOptions: IPopupOptions, result: boolean): void {
        if (result) {
            _private.updateOverlay();
            _private.redrawItems();

            // wait, until popup will be update options
            runDelayed(() => {
                ManagerController.getContainer().activatePopup(id);
            });
        } else {
            item.popupOptions = oldOptions;
        }
    },
    // TODO Должно быть удалено после https://online.sbis.ru/opendoc.html?guid=f2b13a65-f404-4fbd-a05c-bbf6b59358e6
    navigationHandler(event: Event, activeElement: HTMLElement, isIconClick: boolean): void {
        let hasPendings = false;
        // Если пытаются перейти по аккордеону, то закрываем все открытые окна
        // Если есть пендинги - отменяем переход.
        _private.popupItems.each((item) => {
            const registrator = _private.getPopupContainer().getPendingById(item.id);
            if (registrator) {
                if (registrator._hasRegisteredPendings()) {
                    hasPendings = true;
                }
            }
            // Закрываю окна первого уровня, дочерние закроются вместе с ними
            if (!item.parentId) {
                _private.remove(this, item.id);
            }
        });
        // Устанавливаю результат только когда нужно отменить переход, иначе ломается старый механизм spa-переходов,
        // работающий на значении результата события onbeforenavigate
        if (!isIconClick && hasPendings) {
            event.setResult(false);
        }
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

interface IManagerOptions extends IControlOptions {
    popupHeaderTheme: string;
    popupSettingsController: Control;
}

interface IManagerTouchContext {
    isTouch: {
        isTouch: boolean;
    };
}

class Manager extends Control<IManagerOptions> {
    _template: TemplateFunction = template;
    _hasMaximizePopup: boolean = false;
    _contextIsTouch: boolean = false;

    protected _private = _private;

    protected _afterMount(options: IManagerOptions, context: IManagerTouchContext): void {
        this._updateContext(context);
        ManagerController.setManager(this);
        ManagerController.setPopupHeaderTheme(this._options.popupHeaderTheme);
        _private.initializePopupItems();
        EnvEvent.Bus.channel('navigation').subscribe('onBeforeNavigate', _private.navigationHandler.bind(this));
        if (Env.detection.isMobileIOS) {
            _private.controllerVisibilityChangeHandler = _private.controllerVisibilityChangeHandler.bind(_private);
            EnvEvent.Bus.globalChannel().subscribe('MobileInputFocus', _private.controllerVisibilityChangeHandler);
            EnvEvent.Bus.globalChannel().subscribe('MobileInputFocusOut', _private.controllerVisibilityChangeHandler);
        }
    }

    protected _afterUpdate(oldOptions: IManagerOptions, context: IManagerTouchContext): void {
        this._updateContext(context);
        // Theme of the popup header can be changed dynamically.
        // The option is not inherited, so in order for change option in 1 synchronization cycle,
        // we have to make an event model on ManagerController.
        // Now there are no cases where the theme changes when the popup are open,
        // so now just change the theme to afterUpdate.
        ManagerController.setPopupHeaderTheme(this._options.popupHeaderTheme);
    }

    protected _beforeUnmount(): void {
        if (Env.detection.isMobileIOS) {
            EnvEvent.Bus.globalChannel().unsubscribe('MobileInputFocus', _private.controllerVisibilityChangeHandler);
            EnvEvent.Bus.globalChannel().unsubscribe('MobileInputFocusOut', _private.controllerVisibilityChangeHandler);
        }
    }

    /**
     * Show
     * @function Controls/_popup/Manager#show
     * @param options popup configuration
     * @param controller popup controller
     */
    show(options: IPopupOptions, controller: IPopupController): string {
        if (this.find(options.id)) {
            this.update(options.id, options);
            return options.id;
        }
        const item: IPopupItem = this._createItemConfig(options, controller);
        const defaultConfigResult: null | Promise<void> = controller.getDefaultConfig(item);
        if (defaultConfigResult instanceof Promise) {
            defaultConfigResult.then(() => {
                _private.addElement(item);
                _private.redrawItems();
            });
        } else {
            _private.addElement(item);
            _private.redrawItems();
        }
        return item.id;
    }

    updateOptionsAfterInitializing(id: string, options: IPopupOptions): void {
        const item = this.find(id);
        if (item && item.popupState === item.controller.POPUP_STATE_INITIALIZING) {
            item.popupOptions = options;
            item.controller.getDefaultConfig(item);
            _private.popupItems._nextVersion();
        }
    }

    /**
     * Upgrade options of an existing popup
     * @function Controls/_popup/Manager#update
     * @param id popup id
     * @param options new options of popup
     */
    update(id: string, options: IPopupOptions): string | null {
        const item: IPopupItem = this.find(id);
        if (item) {
            const oldOptions: IPopupOptions = item.popupOptions;
            item.popupOptions = options;
            const updateOptionsResult: null | Promise<null> =
                item.controller.elementUpdateOptions(item, _private.getItemContainer(id));
            if (updateOptionsResult instanceof Promise) {
                updateOptionsResult.then((result) => {
                    return _private.updatePopupOptions(id, item, oldOptions, result);
                });
            } else {
                _private.updatePopupOptions(id, item, oldOptions, updateOptionsResult);
            }
            return id;
        }
        return null;
    }

    /**
     * Remove popup
     * @function Controls/_popup/Manager#remove
     * @param id popup id
     */
    remove(id: string): Promise<void> {
        return _private.remove(this, id);
    }

    /**
     * Find popup configuration
     * @function Controls/_popup/Manager#find
     * @param id popup id
     */
    find(id: string): IPopupItem {
        return _private.find(id);
    }

    /**
     * Reindex a set of popups, for example, after changing the configuration of one of them
     * @function Controls/_popup/Manager#reindex
     */
    reindex(): void {
        _private.popupItems._reindex();
    }

    private _updateContext(context: IManagerTouchContext): void {
        this._contextIsTouch = context && context.isTouch && context.isTouch.isTouch;
    }

    private _createItemConfig(options: IPopupOptions, controller: IPopupController): IPopupItem {
        const popupId: string = options.id || randomId('popup-');
        const popupConfig: IPopupItem = {
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
    }

    // Register the relationship between the parent and child popup
    private _registerPopupLink(popupConfig: IPopupItem): void {
        if (popupConfig.popupOptions.opener) {
            const parent: Popup = this._findParentPopup(popupConfig.popupOptions.opener) as Popup;
            if (parent) {
                const id = parent.getPopupId();
                const item = this.find(id);
                if (item) {
                    item.childs.push(popupConfig);
                    popupConfig.parentId = item.id;
                }
            }
        }
    }

    private _findParentPopup(control: Control): Popup|boolean {
        const parentControls: Control[] = goUpByControlTree(control._container);
        for (let i = 0; i < parentControls.length; i++) {
            if (parentControls[i]._moduleName === 'Controls/_popup/Manager/Popup') {
                return parentControls[i];
            }
        }
        return false;
    }

    protected _mouseDownHandler(event: Event): void {
        if (_private.popupItems && !_private.isIgnoreActivationArea(event.target)) {
            const deactivatedPopups = [];
            const target = event.target as HTMLElement;
            // todo https://online.sbis.ru/opendoc.html?guid=ab4ffabb-20ba-4782-8c38-c4ab72b73a1a
            const isResizingLine = target.classList.contains('controls-ResizingLine');
            _private.popupItems.each((item) => {
                // if we have deactivated popup
                // Отказываюсь на старых страницах от закрытия окон по деактивации,
                // сам отслеживаю необходимость закрытия
                // в 20.1000 по работе в план разделю закрытие по клику мимо и по деактивации на 2 разные опции,
                // из этой проверки нужно удалить item.waitDeactivated и isNewEnvironment()
                if (item && (item.waitDeactivated || isResizingLine || !_private.isNewEnvironment())) {
                    const parentControls = goUpByControlTree(event.target);
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
    }

    protected _eventHandler(event: Event, actionName: string): void {
        const args = Array.prototype.slice.call(arguments, 2);
        const actionResult = _private[actionName].apply(this, args);
        if (actionResult === true) {
            _private.redrawItems();
        }
    }
}

export default Manager;
