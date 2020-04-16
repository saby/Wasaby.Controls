import {IBaseCollection, TItemKey} from '../interface';
import {IItemActionsTemplateConfig, ISwipeConfig, IEditingConfig} from '../Collection';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Model} from 'Types/entity';
import {Memory} from 'Types/source';
import { isEqual } from 'Types/object';

// FIXME: https://online.sbis.ru/opendoc.html?guid=380045b2-1cd8-4868-8c3f-545cc5c1732f
const showType = {
    MENU: 0,
    MENU_TOOLBAR: 1,
    TOOLBAR: 2
};

// TODO Написать реальный тип для action'ов
type TItemAction = any;

export type TActionClickCallback = (clickEvent: SyntheticEvent<MouseEvent>, action: TItemAction, contents: Model) => void;

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
    actionClickCallback?: TActionClickCallback;
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

export interface IItemActionsControllerOptions {
    /**
     * Коллекция элементов, содержащих операции с записью
     */
    collection: IItemActionsCollection;
    /**
     * Действия с записью
     */
    itemActions: TItemAction[];
    /**
     * Свойство элемента коллекции, по которому из элемента можно достать настроенные для него операции
     */
    itemActionsProperty?: string;
    /**
     * Callback для определения видимости операции
     */
    visibilityCallback?: TItemActionVisibilityCallback;
    itemActionsPosition?: string;
    style?: string;
    itemActionsClass?: string;
    actionAlignment?: string;
    actionCaptionPosition?: 'right'|'bottom'|'none';
}

const ITEM_ACTION_ICON_CLASS = 'controls-itemActionsV__action_icon icon-size';

/**
 * Контроллер, управляющий состоянием ItemActions в коллекции
 * @Author Пуханов В, Аверкиев П.А
 */
export class ItemActionsController {
    private readonly _collection: IItemActionsCollection;
    private _commonItemActions: TItemAction[];
    private _itemActionsProperty?: string;
    private _visibilityCallback?: TItemActionVisibilityCallback;

    constructor(collection: IItemActionsCollection) {
        this._collection = collection;
    }

    init(options: IItemActionsControllerOptions): boolean {
        let hasChanges = false;
        if (!isEqual(this._commonItemActions, options.itemActions) ||
            this._itemActionsProperty !== options.itemActionsProperty ||
            this._visibilityCallback !== options.visibilityCallback
        ) {
            this._commonItemActions = options.itemActions;
            this._itemActionsProperty = options.itemActionsProperty;
            this._visibilityCallback = options.visibilityCallback;
            this._collection.setActionsAssigned(false);
        }
        if (!this._collection.areActionsAssigned()) {
            hasChanges = this._assignActions();
            this._calculateActionsTemplateConfig({
                itemActionsPosition: options.itemActionsPosition,
                style: options.style,
                actionAlignment: options.actionAlignment,
                actionCaptionPosition: options.actionCaptionPosition,
                itemActionsClass: options.itemActionsClass
            });
        }
        return hasChanges;
    }

    /**
     * Обновляет операции с записью элемента коллекции по его ключу
     * @param key TItemKey
     */
    updateActionsForItem(key: TItemKey): void {
            const item = this._collection.getItemBySourceKey(options.key);
            if (item) {
                const itemActions = this._collectActionsForItem(item);
                this._setItemActions(item, this._wrapActionsInContainer(itemActions));
                this._collection.nextVersion();
            }
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
        const oldActiveItem = this._getActiveItem(this._collection);
        const newActiveItem = this._collection.getItemBySourceKey(key);

        if (oldActiveItem) {
            oldActiveItem.setActive(false);
        }
        if (newActiveItem) {
            newActiveItem.setActive(true);
        }

        this._collection.nextVersion();
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
        actionClickCallback: TActionClickCallback
    ): void {
        clickEvent.stopPropagation();
        if (action._isMenu) {
            this.prepareActionsMenuConfig(this._collection, itemKey, clickEvent, null, false, actionClickCallback);
        } else if (action['parent@']) {
            if (!fromDropdown) {
                this.prepareActionsMenuConfig(this._collection, itemKey, clickEvent, action, false, actionClickCallback);
            }
        } else {
            const item = this._collection.getItemBySourceKey(itemKey);
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
     * Собирает конфиг выпадающего меню операций
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
        actionClickCallback: TActionClickCallback
    ): void {
        const item = this._collection.getItemBySourceKey(itemKey);
        if (!item) {
            return;
        }

        const hasParentAction = parentAction !== null && parentAction !== undefined;
        const menuActions = hasParentAction
            ? this.getChildActions(item, parentAction.id)
            : this._getMenuActions(item);

        if (menuActions && menuActions.length > 0) {
            clickEvent.preventDefault();

            // there was a fake target before, check if it is needed
            const menuTarget = isContext ? null : this._getFakeMenuTarget(clickEvent.target as HTMLElement);
            const closeHandler = this._processActionsMenuClose.bind(null, this._collection, actionClickCallback);
            const menuSource = new Memory({
                data: menuActions,
                keyProperty: 'id'
            });
            const headConfig = hasParentAction ? {
                caption: parentAction.title,
                icon: parentAction.icon
            } : null;
            const contextMenuConfig = this._collection.getContextMenuConfig();
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

            this.setActiveItem(this._collection, itemKey);
            this._collection.setActionsMenuConfig(dropdownConfig);

            this._collection.nextVersion();
        }
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
        this._setSwipeItem(this._collection, itemKey);
        this.setActiveItem(this._collection, itemKey);

        if (this._collection.getActionsTemplateConfig().itemActionsPosition !== 'outside') {
            this._updateSwipeConfig(this._collection, actionsContainerHeight);
        }

        this._collection.nextVersion();
    }

    /**
     * Деактивирует Swipe для меню операций с записью
     * @param collection Коллекция элементов, содержащих операции с записью
     */
    deactivateSwipe(collection: IItemActionsCollection): void {
        this._setSwipeItem(this._collection, null);
        this.setActiveItem(this._collection, null);
        this._collection.setSwipeConfig(null);
        this._collection.nextVersion();
    }

    /**
     * Вычисляет операции над записью для каждого элемента коллекции
     */
    private _assignActions(): boolean {
        const supportsEventRaising = typeof this._collection.setEventRaising === 'function';
        let hasChanges = false;

        if (supportsEventRaising) {
            this._collection.setEventRaising(false, true);
        }

        this._collection.each((item) => {
            if (!item.isActive()) {
                const actionsForItem = this._collectActionsForItem(item);
                const itemChanged = this._setItemActions(item, this._wrapActionsInContainer(actionsForItem));
                hasChanges = hasChanges || itemChanged;
            }
        });

        if (supportsEventRaising) {
            this._collection.setEventRaising(true, true);
        }

        this._collection.setActionsAssigned(true);

        if (hasChanges) {
            this._collection.nextVersion();
        }

        return hasChanges;
    }

    /**
     * Получает список операций с записью для указанного элемента коллекции
     * @param item
     */
    private _getMenuActions(item: IItemActionsItem): TItemAction[] {
        const actions = item.getActions();
        return (
            actions &&
            actions.all &&
            actions.all.filter((action) => action.showType !== showType.TOOLBAR)
        );
    }

    /**
     * Получает текущий активный элемент коллекции
     * @param collection Коллекция элементов, содержащих операции с записью
     */
    private _getActiveItem(
        collection: IItemActionsCollection
    ): IItemActionsItem {
        return this._collection.find((item) => item.isActive());
    }

    /**
     * Устанавливает текущий swiped элемент
     * @param collection Коллекция элементов, содержащих операции с записью
     * @param key Ключ элемента коллекции, на котором был выполнен swipe
     */
    private _setSwipeItem(
        collection: IItemActionsCollection,
        key: TItemKey
    ): void {
        const oldSwipeItem = this._getSwipeItem(this._collection);
        const newSwipeItem = this._collection.getItemBySourceKey(key);

        if (oldSwipeItem) {
            oldSwipeItem.setSwiped(false);
        }
        if (newSwipeItem) {
            newSwipeItem.setSwiped(true);
        }

        this._collection.nextVersion();
    }

    /**
     * Получает последний swiped элемент
     * @param collection Коллекция элементов, содержащих операции с записью
     */
    private _getSwipeItem(collection: IItemActionsCollection): IItemActionsItem {
        return this._collection.find((item) => item.isSwiped());
    }

    /**
     * Запоминает измерения для HTML элемента, к которому привязано выпадающее меню
     * @param realTarget
     */
    private _getFakeMenuTarget(realTarget: HTMLElement): {
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
     * Вычисляет конфигурацию, которая используется в качестве scope у itemActionsTemplate
     */
    private _calculateActionsTemplateConfig(options: IItemActionsTemplateOptions): void {
        const editingConfig = this._collection.getEditingConfig();
        this._collection.setActionsTemplateConfig({
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
     * Набирает операции с записью для указанного элемента коллекции
     * @param item IItemActionsItem
     * @private
     */
    private _collectActionsForItem(item: IItemActionsItem): TItemAction[] {
        const itemActions: TItemAction[] = this._itemActionsProperty
                ? item.getContents().get(this._itemActionsProperty)
                : this._commonItemActions;
        const fixedActions = itemActions.map(this._fixActionIcon);
        return fixedActions.filter((action) =>
            this._visibilityCallback(action, item.getContents())
        );
    }

    private _updateSwipeConfig(
        collection: IItemActionsCollection,
        actionsContainerHeight: number
    ): void {
        const item = this._getSwipeItem(collection);
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
        actionClickCallback: TActionClickCallback,
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
                    this._getActiveItem(collection)?.getContents()?.getKey(),
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
