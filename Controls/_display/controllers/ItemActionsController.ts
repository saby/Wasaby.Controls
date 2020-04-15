import { IBaseCollection, TItemKey } from '../interface';
import { IItemActionsTemplateConfig, ISwipeConfig, IEditingConfig } from '../Collection';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import {Memory} from 'Types/source';

// FIXME: https://online.sbis.ru/opendoc.html?guid=380045b2-1cd8-4868-8c3f-545cc5c1732f
const showType = {
    MENU: 0,
    MENU_TOOLBAR: 1,
    TOOLBAR: 2
};

// TODO Написать реальный тип для action'ов
type TItemAction = any;

type TActionsGetterFunction = (item) => TItemAction[];

export type TItemActionVisibilityCallback = (
    action: TItemAction,
    item: unknown
) => boolean;

export interface IItemActionsContainer {
    all: TItemAction[];
    showed: TItemAction[];
}

export interface IItemActionsTemplateOptions {
    style?: string;
    itemActionsPosition: string;
    actionAlignment?: string;
    actionCaptionPosition: 'right'|'bottom'|'none';
    itemActionsClass?: string;
    actionClickCallback?: Function;
}

export interface IItemActionsItem {
    getActions(): IItemActionsContainer;
    getContents(): Model;
    setActions(actions: IItemActionsContainer): void;
    setActive(active: boolean): void;
    isActive(): boolean;
    setSwiped(swiped: boolean): void;
    isSwiped(): boolean;
}

export interface IItemActionsCollection extends IBaseCollection<IItemActionsItem> {
    destroyed: boolean;
    each(cb: (item: IItemActionsItem) => void): void;
    setEventRaising?(raising: boolean, analyze?: boolean): void;
    areActionsAssigned(): boolean;
    setActionsAssigned(assigned: boolean): void;
    setActionsMenuConfig(config: any): void;
    getActionsMenuConfig(): any;
    getContextMenuConfig(): any;
    setActionsTemplateConfig(config: IItemActionsTemplateConfig): void;
    getActionsTemplateConfig(): IItemActionsTemplateConfig;
    setSwipeConfig(config: ISwipeConfig): void;
    getSwipeConfig(): ISwipeConfig;
    getEditingConfig(): IEditingConfig;
}

const ITEM_ACTION_ICON_CLASS = 'controls-itemActionsV__action_icon icon-size';

/**
 * Контроллер, управляющий состоянием ItemActions в коллекции
 * @Author Пуханов В, Аверкиев П.А
 */
export class ItemActionsController {
    /**
     * Вычисляет операции над записью для каждого элемента коллекции
     * @param collection Коллекция элементов, содержащих операции над записью
     * @param actionsGetter callback-функция, возвращающая список операций по модели элемента коллекции
     * @param visibilityCallback callback-функция, возвращающая видимость операции над записью
     * TODO обнови тесты. Было return void стало return boolean
     */
    assignActions(
        collection: IItemActionsCollection,
        actionsGetter: TActionsGetterFunction,
        visibilityCallback: TItemActionVisibilityCallback = () => true
    ): boolean {
        if (collection.areActionsAssigned()) {
            return;
        }

        const supportsEventRaising = typeof collection.setEventRaising === 'function';
        let hasChanges = false;

        if (supportsEventRaising) {
            collection.setEventRaising(false, true);
        }

        collection.each((item) => {
            if (!item.isActive()) {
                const actionsForItem = this.getActionsForItem(item, actionsGetter, visibilityCallback);
                const itemChanged = this._setItemActions(item, this._wrapActionsInContainer(actionsForItem));
                hasChanges = hasChanges || itemChanged;
            }
        });

        if (supportsEventRaising) {
            collection.setEventRaising(true, true);
        }

        collection.setActionsAssigned(true);

        if (hasChanges) {
            collection.nextVersion();
        }

        return hasChanges;
    }

    /**
     * Получает операции с сзаписью для указанного элемента коллекции
     * @param item
     * @param actionsGetter
     * @param visibilityCallback
     * todo write test!
     */
    getActionsForItem(
        item: IItemActionsItem,
        actionsGetter: TActionsGetterFunction,
        visibilityCallback: TItemActionVisibilityCallback = () => true): TItemAction[] {
        const fixedActions = actionsGetter(item).map(this._fixActionIcon);
        return fixedActions.filter((action) =>
            visibilityCallback(action, item.getContents())
        );
    }

    /**
     * Сбрасывавет у коллекции значение флага ActionsAssignment на false
     * @param collection Коллекция элементов, содержащих операции с записью
     */
    resetActionsAssignment(collection: IItemActionsCollection): void {
        collection.setActionsAssigned(false);
    }

    /**
     * Обновляет операции с записью элемента коллекции по его ключу
     * @param collection Коллекция элементов, содержащих операции с записью
     * @param key Ключ элемента коллекции, для которого нужно обновить операции с записью
     * @param actions объект, содержащий список всех (all) и только показанных (showed) операций с записью
     */
    setActionsToItem(
        collection: IItemActionsCollection,
        key: TItemKey,
        actions: IItemActionsContainer
    ): void {
        const item = collection.getItemBySourceKey(key);
        if (item) {
            this._setItemActions(item, actions);
        }
        collection.nextVersion();
    }

    /**
     * Вычисляет конфигурацию, которая используется в качестве scope у itemActionsTemplate
     * @param collection Коллекция элементов, содержащих операции с записью
     * @param options
     */
    calculateActionsTemplateConfig(
        collection: IItemActionsCollection,
        options: IItemActionsTemplateOptions
    ): void {
        const editingConfig = collection.getEditingConfig();
        collection.setActionsTemplateConfig({
            toolbarVisibility: editingConfig?.toolbarVisibility,
            style: options.style,
            size: editingConfig ? 's' : 'm',
            itemActionsPosition: options.itemActionsPosition,
            actionAlignment: options.actionAlignment,
            actionCaptionPosition: options.actionCaptionPosition,
            itemActionsClass: options.itemActionsClass
        });
    }

    /**
     * Устанавливает флаг активности элементу коллекции по его ключу
     * @param collection Коллекция элементов, содержащих операции с записью
     * @param key Ключ элемента коллекции, для которого нужно обновить операции с записью
     */
    setActiveItem(
        collection: IItemActionsCollection,
        key: TItemKey
    ): void {
        const oldActiveItem = this.getActiveItem(collection);
        const newActiveItem = collection.getItemBySourceKey(key);

        if (oldActiveItem) {
            oldActiveItem.setActive(false);
        }
        if (newActiveItem) {
            newActiveItem.setActive(true);
        }

        collection.nextVersion();
    }

    /**
     * Получает текущий активный элемент коллекции
     * @param collection Коллекция элементов, содержащих операции с записью
     */
    getActiveItem(
        collection: IItemActionsCollection
    ): IItemActionsItem {
        return collection.find((item) => item.isActive());
    }

    /**
     * Получает список операций с записью для указанного элемента коллекции
     * @param item
     */
    getMenuActions(item: IItemActionsItem): TItemAction[] {
        const actions = item.getActions();
        return (
            actions &&
            actions.all &&
            actions.all.filter((action) => action.showType !== showType.TOOLBAR)
        );
    }

    /**
     * Получает список операций с записью для указанного элемента коллекции,
     * дочерних по отношению операции, для которой передан строковый ключ
     * @param item
     * @param parentActionKey
     */
    getChildActions(
        item: IItemActionsItem,
        parentActionKey: TItemAction
    ): TItemAction[] {
        const actions = item.getActions();
        const allActions = actions && actions.all;
        if (allActions) {
            return allActions.filter((action) => action.parent === parentActionKey);
        }
        return [];
    }

    /**
     * Обработка клика по операции записи
     * @param collection Коллекция элементов, содержащих операции с записью
     * @param itemKey Ключ элемента коллекции, для которого выполняется действие
     * @param action Операция с записью
     * @param clickEvent событие клика
     * @param fromDropdown флаг, определяющий, произошёл ли клик в выпадающем меню
     * @param actionClickCallback callback-функция, выполняемая после клика
     */
    processActionClick(
        collection: IItemActionsCollection,
        itemKey: TItemKey,
        action: TItemAction,
        clickEvent: SyntheticEvent<MouseEvent>,
        fromDropdown: boolean,
        actionClickCallback: Function
    ): void {
        clickEvent.stopPropagation();
        if (action._isMenu) {
            this.prepareActionsMenuConfig(collection, itemKey, clickEvent, null, false, actionClickCallback);
        } else if (action['parent@']) {
            if (!fromDropdown) {
                this.prepareActionsMenuConfig(collection, itemKey, clickEvent, action, false, actionClickCallback);
            }
        } else {
            const item = collection.getItemBySourceKey(itemKey);
            if (item) {
                const contents = item.getContents();

                // How to calculate itemContainer?
                // this._notify('actionClick', [action, contents, itemContainer]);
                if (actionClickCallback) {
                    actionClickCallback(clickEvent, action, contents);
                }

                if (action.handler) {
                    action.handler(contents);
                }
            }
        }
        // TODO update some item actions
        // TODO move the marker
    }

    /**
     * Подготавливает конфиг выпадающего меню операции с записью
     * @param collection Коллекция элементов, содержащих операции над записью
     * @param itemKey Ключ элемента коллекции, для которого выполняется действие
     * @param clickEvent событие клика
     * @param parentAction Родительская операция с записью
     * @param isContext Флаг, указывающий на то, что расчёты производятся для контекстного меню
     * @param actionClickCallback
     */
    prepareActionsMenuConfig(
        collection: IItemActionsCollection,
        itemKey: TItemKey,
        clickEvent: SyntheticEvent<MouseEvent>,
        parentAction: TItemAction,
        isContext: boolean,
        actionClickCallback: Function
    ): void {
        const item = collection.getItemBySourceKey(itemKey);
        if (!item) {
            return;
        }

        const hasParentAction = parentAction !== null && parentAction !== undefined;
        const menuActions = hasParentAction
            ? this.getChildActions(item, parentAction.id)
            : this.getMenuActions(item);

        if (menuActions && menuActions.length > 0) {
            clickEvent.preventDefault();

            // there was a fake target before, check if it is needed
            const menuTarget = isContext ? null : this.getFakeMenuTarget(clickEvent.target as HTMLElement);
            const closeHandler = this._processActionsMenuClose.bind(null, collection, actionClickCallback);
            const menuSource = new Memory({
                data: menuActions,
                keyProperty: 'id'
            });
            const headConfig = hasParentAction ? {
                caption: parentAction.title,
                icon: parentAction.icon
            } : null;
            const contextMenuConfig = collection.getContextMenuConfig();
            const menuConfig = {
                source: menuSource,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'parent@',
                dropdownClassName: 'controls-itemActionsV__popup',
                closeButtonVisibility: true,
                ...contextMenuConfig,
                root: parentAction && parentAction.id,
                showHeader: hasParentAction,
                headConfig
            };
            const dropdownConfig = {
                // opener: this,
                target: menuTarget,
                templateOptions: menuConfig,
                eventHandlers: {
                    onResult: closeHandler,
                    onClose: closeHandler
                },
                closeOnOutsideClick: true,
                targetPoint: {
                    vertical: 'top',
                    horizontal: 'right'
                },
                direction: {
                    horizontal: isContext ? 'right' : 'left'
                },
                className: 'controls-DropdownList__margin-head controls-ItemActions__popup__list',
                nativeEvent: isContext ? clickEvent.nativeEvent : null,
                autofocus: false
            };

            this.setActiveItem(collection, itemKey);
            collection.setActionsMenuConfig(dropdownConfig);

            collection.nextVersion();
        }
    }

    /**
     * Запоминает измерения для HTML элемента, к которому привязано выпадающее меню
     * @param realTarget
     */
    getFakeMenuTarget(realTarget: HTMLElement): {
        getBoundingClientRect(): ClientRect;
    } {
        const rect = realTarget.getBoundingClientRect();
        return {
            getBoundingClientRect(): ClientRect {
                return rect;
            }
        };
    }

    /**
     * Активирует Swipe для меню операций с записью
     * @param collection Коллекция элементов, содержащих операции с записью
     * @param itemKey Ключ элемента коллекции, для которого выполняется действие
     * @param actionsContainerHeight высота контейнера для отображения операций с записью
     */
    activateSwipe(
        collection: IItemActionsCollection,
        itemKey: TItemKey,
        actionsContainerHeight: number
    ): void {
        this.setSwipeItem(collection, itemKey);
        this.setActiveItem(collection, itemKey);

        if (collection.getActionsTemplateConfig().itemActionsPosition !== 'outside') {
            this._updateSwipeConfig(collection, actionsContainerHeight);
        }

        collection.nextVersion();
    }

    /**
     * Деактивирует Swipe для меню операций с записью
     * @param collection Коллекция элементов, содержащих операции с записью
     */
    deactivateSwipe(collection: IItemActionsCollection): void {
        this.setSwipeItem(collection, null);
        this.setActiveItem(collection, null);
        collection.setSwipeConfig(null);
        collection.nextVersion();
    }

    /**
     * Устанавливает текущий swiped элемент
     * @param collection Коллекция элементов, содержащих операции с записью
     * @param key Ключ элемента коллекции, на котором был выполнен swipe
     */
    setSwipeItem(
        collection: IItemActionsCollection,
        key: TItemKey
    ): void {
        const oldSwipeItem = this.getSwipeItem(collection);
        const newSwipeItem = collection.getItemBySourceKey(key);

        if (oldSwipeItem) {
            oldSwipeItem.setSwiped(false);
        }
        if (newSwipeItem) {
            newSwipeItem.setSwiped(true);
        }

        collection.nextVersion();
    }

    /**
     * Получает последний swiped элемент
     * @param collection Коллекция элементов, содержащих операции с записью
     */
    getSwipeItem(collection: IItemActionsCollection): IItemActionsItem {
        return collection.find((item) => item.isSwiped());
    }

    private _updateSwipeConfig(
        collection: IItemActionsCollection,
        actionsContainerHeight: number
    ): void {
        const item = this.getSwipeItem(collection);
        if (!item) {
            return;
        }

        const actions = item.getActions().all;
        const actionsTemplateConfig = collection.getActionsTemplateConfig();

        let swipeConfig = this._calculateSwipeConfig(
            actions,
            actionsTemplateConfig.actionAlignment,
            actionsContainerHeight,
            actionsTemplateConfig.actionCaptionPosition
        );

        if (
            actionsTemplateConfig.actionAlignment !== 'horizontal' &&
            this._needsHorizontalMeasurement(swipeConfig)
        ) {
            swipeConfig = this._calculateSwipeConfig(
                actions,
                'horizontal',
                actionsContainerHeight,
                actionsTemplateConfig.actionCaptionPosition
            );
        }

        this._setItemActions(item, swipeConfig.itemActions);

        if (swipeConfig.twoColumns) {
            const visibleActions = swipeConfig.itemActions.showed;
            swipeConfig.twoColumnsActions = [
                [visibleActions[0], visibleActions[1]],
                [visibleActions[2], visibleActions[3]]
            ];
        }

        collection.setSwipeConfig(swipeConfig);
    }

    private _calculateSwipeConfig(
        actions: TItemAction[],
        actionAlignment: string,
        actionsContainerHeight: number,
        actionCaptionPosition: 'right'|'bottom'|'none'
    ): ISwipeConfig {
        // FIXME: https://online.sbis.ru/opendoc.html?guid=380045b2-1cd8-4868-8c3f-545cc5c1732f
        // TODO Move these measurers to listRender, maybe rewrite them
        const {SwipeVerticalMeasurer, SwipeHorizontalMeasurer} = require('Controls/list');

        const measurer =
            actionAlignment === 'vertical'
                ? SwipeVerticalMeasurer.default
                : SwipeHorizontalMeasurer.default;
        const config: ISwipeConfig = measurer.getSwipeConfig(
            actions,
            actionsContainerHeight,
            actionCaptionPosition
        );
        config.needTitle = measurer.needTitle;
        config.needIcon = measurer.needIcon;
        return config;
    }

    private _needsHorizontalMeasurement(config: ISwipeConfig): boolean {
        const actions = config.itemActions;
        return (
            actions &&
            actions.showed?.length === 1 &&
            actions.all?.length > 1
        );
    }

    private _processActionsMenuClose(
        collection: IItemActionsCollection,
        actionClickCallback: Function,
        action: string, data: Model, event: SyntheticEvent<MouseEvent>
    ): void {
        // Actions dropdown can start closing after the view itself was unmounted already, in which case
        // the model would be destroyed and there would be no need to process the action itself
        if (collection && !collection.destroyed) {
            // If menu needs to close because one of the actions was clicked, process
            // the action handler first
            if (action === 'itemClick') {
                const actionRawData = data && data.getRawData();
                this.processActionClick(
                    collection,
                    this.getActiveItem(collection)?.getContents()?.getKey(),
                    actionRawData,
                    event,
                    true,
                    actionClickCallback
                );

                // If this action has children, don't close the menu if it was clicked
                if (actionRawData['parent@']) {
                    return;
                }
            }

            if (action !== 'menuOpened') {
                this.setActiveItem(collection, null);
                collection.setActionsMenuConfig(null);
                this.deactivateSwipe(collection);
                collection.nextVersion();
            }
        }
    }

    private _setItemActions(
        item: IItemActionsItem,
        actions: IItemActionsContainer
    ): boolean {
        const oldActions = item.getActions();
        if (!oldActions || (actions && !this._isMatchingActions(oldActions, actions))) {
            item.setActions(actions);
            return true;
        }
        return false;
    }

    private _fixActionIcon(action: TItemAction): TItemAction {
        if (!action.icon || action.icon.includes(ITEM_ACTION_ICON_CLASS)) {
            return action;
        }
        return {
            ...action,
            icon: `${action.icon} ${ITEM_ACTION_ICON_CLASS}`
        };
    }

    private _wrapActionsInContainer(
        actions: TItemAction[]
    ): IItemActionsContainer {
        let showed = actions;
        if (showed.length > 1) {
            showed = showed.filter(
                (action) =>
                    action.showType === showType.TOOLBAR ||
                    action.showType === showType.MENU_TOOLBAR
            );
            if (this._isMenuButtonRequired(actions)) {
                showed.push({
                    icon: `icon-ExpandDown ${ITEM_ACTION_ICON_CLASS}`,
                    style: 'secondary',
                    iconStyle: 'secondary',
                    _isMenu: true
                });
            }
        }
        return {
            all: actions,
            showed
        };
    }

    private _isMenuButtonRequired(actions: TItemAction[]): boolean {
        return actions.some(
            (action) =>
                !action.parent &&
                (!action.showType ||
                    action.showType === showType.MENU ||
                    action.showType === showType.MENU_TOOLBAR)
        );
    }

    private _isMatchingActions(
        oldContainer: IItemActionsContainer,
        newContainer: IItemActionsContainer
    ): boolean {
        return (
            this._isMatchingActionLists(oldContainer.all, newContainer.all) &&
            this._isMatchingActionLists(oldContainer.showed, newContainer.showed)
        );
    }

    private _isMatchingActionLists(
        aActions: TItemAction[],
        bActions: TItemAction[]
    ): boolean {
        if (!aActions || !bActions) {
            return false;
        }
        const length = aActions.length;
        if (length !== bActions.length) {
            return false;
        }
        for (let i = 0; i < length; i++) {
            if (
                aActions[i].id !== bActions[i].id ||
                aActions[i].icon !== bActions[i].icon
            ) {
                return false;
            }
        }
        return true;
    }
}
