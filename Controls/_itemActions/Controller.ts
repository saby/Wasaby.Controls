import {Control} from 'UI/Base';
import {Memory} from 'Types/source';
import {isEqual} from 'Types/object';
import {SyntheticEvent} from 'Vdom/Vdom';
import {TItemKey, ISwipeConfig, ANIMATION_STATE} from 'Controls/display';
import {
    IItemActionsCollection,
    TItemActionVisibilityCallback,
    IItemActionsItem,
    IItemActionsTemplateOptions,
    IItemActionsContainer,
    IMenuTemplateOptions,
    IMenuConfig,
    TItemActionShowType,
    IItemAction
} from './interface/IItemActions';

const ITEM_ACTION_ICON_CLASS = 'controls-itemActionsV__action_icon icon-size';

const DEFAULT_ACTION_ALIGNMENT = 'horizontal';

const DEFAULT_ACTION_CAPTION_POSITION = 'none';

const DEFAULT_ACTION_POSITION = 'inside';

const DEFAULT_ACTION_SIZE = 'm';

export interface IItemActionsControllerOptions {
    /**
     * Коллекция элементов, содержащих операции с записью
     */
    collection: IItemActionsCollection;
    /**
     * Действия с записью
     */
    itemActions: IItemAction[];
    /**
     * Размер иконок операций с записью
     * варианты 's'|'m'
     */
    iconSize: string;
    /**
     * Свойство элемента коллекции, по которому из элемента можно достать настроенные для него операции
     */
    itemActionsProperty?: string;
    /**
     * Callback для определения видимости операции
     */
    visibilityCallback?: TItemActionVisibilityCallback;
    /**
     * Должна ли быть видна панель с кнопками для редактирования
     */
    editingToolbarVisibility?: boolean;
    itemActionsPosition?: string;
    style?: string;
    itemActionsClass?: string;
    actionAlignment?: string;
    actionCaptionPosition?: 'right'|'bottom'|'none';
}

/**
 * Контроллер, управляющий состоянием ItemActions в коллекции
 * @Author Пуханов В, Аверкиев П.А
 */
export class Controller {
    private _collection: IItemActionsCollection;
    private _commonItemActions: IItemAction[];
    private _itemActionsProperty: string;
    private _visibilityCallback: TItemActionVisibilityCallback;

    update(options: IItemActionsControllerOptions): void {
        if (options.itemActions === undefined ||
            !isEqual(this._commonItemActions, options.itemActions) ||
            this._itemActionsProperty !== options.itemActionsProperty ||
            this._visibilityCallback !== options.visibilityCallback
        ) {
            this._collection = options.collection;
            this._commonItemActions = options.itemActions;
            this._itemActionsProperty = options.itemActionsProperty;
            this._visibilityCallback = options.visibilityCallback || ((action: IItemAction, item: unknown) => true);
            // this._collection.setActionsAssigned(false);
        }
        // Возможно, стоит проверять версию модели, если она меняется при раскрытии веток дерева
        // !this._collection.areActionsAssigned() &&
        if (this._commonItemActions || this._itemActionsProperty) {
            this._assignActions();
        }
        this._calculateActionsTemplateConfig({
            itemActionsPosition: options.itemActionsPosition || DEFAULT_ACTION_POSITION,
            style: options.style,
            size: options.iconSize || DEFAULT_ACTION_SIZE,
            toolbarVisibility: options.editingToolbarVisibility,
            actionAlignment: options.actionAlignment || DEFAULT_ACTION_ALIGNMENT,
            actionCaptionPosition: options.actionCaptionPosition || DEFAULT_ACTION_CAPTION_POSITION,
            itemActionsClass: options.itemActionsClass
        });
    }

    /**
     * Устанавливает флаг активности элементу коллекции по его ключу
     * @param key Ключ элемента коллекции, для которого нужно обновить операции с записью
     */
    setActiveItem(key: TItemKey): void {
        const oldActiveItem = this.getActiveItem();
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
     * Получает текущий активный элемент коллекции
     */
    getActiveItem(): IItemActionsItem {
        return this._collection.find((item) => item.isActive());
    }

    /**
     * Активирует Swipe для меню операций с записью
     * @param itemKey Ключ элемента коллекции, для которого выполняется действие
     * @param actionsContainerHeight высота контейнера для отображения операций с записью
     */
    activateSwipe(itemKey: TItemKey, actionsContainerHeight: number): void {
        this._setSwipeItem(itemKey);
        this.setActiveItem(itemKey);

        if (this._collection.getActionsTemplateConfig().itemActionsPosition !== 'outside') {
            this._updateSwipeConfig(actionsContainerHeight);
        }

        this._collection.setSwipeAnimation(ANIMATION_STATE.OPEN);
    }

    /**
     * Деактивирует Swipe для меню операций с записью
     */
    deactivateSwipe(): void {
        this._setSwipeItem(null);
        this.setActiveItem(null);
        this._collection.setSwipeConfig(null);
    }

    /**
     * Получает последний swiped элемент
     * @param collection Коллекция элементов, содержащих операции с записью
     */
    getSwipeItem(collection: IItemActionsCollection): IItemActionsItem {
        return this._collection.find((item) => item.isSwiped());
    }

    /**
     * Собирает конфиг выпадающего меню операций
     * @param itemKey Ключ элемента коллекции, для которого выполняется действие
     * @param clickEvent событие клика
     * @param parentAction Родительская операция с записью
     * @param opener: контрол или элемент - опенер для работы системы автофокусов
     * @param theme Название текущей темы
     * @param isContextMenu Флаг, указывающий на то, что расчёты производятся для контекстного меню
     */
    prepareActionsMenuConfig(
        itemKey: TItemKey,
        clickEvent: SyntheticEvent<MouseEvent>,
        parentAction: IItemAction,
        opener: Element | Control<object, unknown>,
        theme: string,
        isContextMenu: boolean
    ): IMenuConfig {
        const item = this._collection.getItemBySourceKey(itemKey);
        if (!item) {
            return;
        }

        const menuActions = this._getMenuActions(item, parentAction);

        if (!menuActions || menuActions.length === 0) {
            return;
        }

        // there was a fake target before, check if it is needed
        const target = isContextMenu ? null : this._getFakeMenuTarget(clickEvent.target as HTMLElement);
        const source = new Memory({
            data: menuActions,
            keyProperty: 'id'
        });
        const showHeader = parentAction !== null && parentAction !== undefined && !parentAction._isMenu;
        const headConfig = showHeader ? {
            caption: parentAction.title,
            icon: parentAction.icon
        } : null;
        // Не реализовано в модели
        // const contextMenuConfig = this._collection.getContextMenuConfig();
        // ...contextMenuConfig,
        const templateOptions: IMenuTemplateOptions = {
            source,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'parent@',
            dropdownClassName: `controls-itemActionsV__popup_theme-${theme}`,
            closeButtonVisibility: true,
            root: parentAction && parentAction.id,
            showHeader,
            headConfig
        };
        return {
            opener,
            template: 'Controls/menu:Popup',
            actionOnScroll: 'close',
            target,
            templateOptions,
            closeOnOutsideClick: true,
            targetPoint: {
                vertical: 'top',
                horizontal: 'right'
            },
            direction: {
                horizontal: isContextMenu ? 'right' : 'left'
            },
            className: `controls-DropdownList__margin-head controls-ItemActions__popup__list_theme-${theme}`,
            nativeEvent: isContextMenu ? clickEvent.nativeEvent : null,
            autofocus: false
        };
    }

    /**
     * Вычисляет операции над записью для каждого элемента коллекции
     */
    private _assignActions(): void {
        const supportsEventRaising = typeof this._collection.setEventRaising === 'function';
        let hasChanges = false;

        if (supportsEventRaising) {
            this._collection.setEventRaising(false, true);
        }

        this._collection.each((item) => {
            if (!item.isActive()) {
                const actionsForItem = this._collectActionsForItem(item);
                const itemChanged = Controller._setItemActions(item, this._wrapActionsInContainer(actionsForItem));
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
    }

    /**
     * Получает список операций с записью для указанного элемента коллекции,
     * отфильтрованных по признаку "Должны отображаться в подменю".
     * Если указан parentAction, то операции дополнительно фильтруются по признаку
     * "дочерние по отношению к указанной операции".
     * Если у parentAction отсутствует id (напр, кнопка "Показать меню" ("Шеврон")),
     * будут показаны все элементы не-первого уровня, вне зависимости от того, какой у них родитель.
     * @param item
     * @param parentAction
     */
    private _getMenuActions(item: IItemActionsItem, parentAction: IItemAction): IItemAction[] {
        const actions = item.getActions();
        const allActions = actions && actions.all;
        if (allActions) {
            return allActions.filter((action) => (
                action.showType !== TItemActionShowType.TOOLBAR &&
                (parentAction && !!parentAction.id ? action.parent === parentAction.id : true)
            ));
        }
        return [];
    }

    /**
     * Устанавливает текущий swiped элемент
     * @param key Ключ элемента коллекции, на котором был выполнен swipe
     */
    private _setSwipeItem(key: TItemKey): void {
        const oldSwipeItem = this.getSwipeItem(this._collection);
        const newSwipeItem = this._collection.getItemBySourceKey(key);

        if (oldSwipeItem) {
            oldSwipeItem.setSwiped(false);
        }
        if (newSwipeItem) {
            newSwipeItem.setSwiped(true);
        }
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
        this._collection.setActionsTemplateConfig({
            toolbarVisibility: options.toolbarVisibility,
            style: options.style,
            size: options.size,
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
    private _collectActionsForItem(item: IItemActionsItem): IItemAction[] {
        const itemActions: IItemAction[] = this._itemActionsProperty
                ? item.getContents().get(this._itemActionsProperty)
                : this._commonItemActions;
        const fixedActions = itemActions.map(Controller._fixActionIcon);
        return fixedActions.filter((action) =>
            this._visibilityCallback(action, item.getContents())
        );
    }

    private _updateSwipeConfig(actionsContainerHeight: number): void {
        const item = this.getSwipeItem(this._collection);
        if (!item) {
            return;
        }

        const actions = item.getActions().all;
        const actionsTemplateConfig = this._collection.getActionsTemplateConfig();

        let swipeConfig = Controller._calculateSwipeConfig(
            actions,
            actionsTemplateConfig.actionAlignment,
            actionsContainerHeight,
            actionsTemplateConfig.actionCaptionPosition
        );

        if (
            actionsTemplateConfig.actionAlignment !== 'horizontal' &&
            Controller._needsHorizontalMeasurement(swipeConfig)
        ) {
            swipeConfig = Controller._calculateSwipeConfig(
                actions,
                'horizontal',
                actionsContainerHeight,
                actionsTemplateConfig.actionCaptionPosition
            );
        }

        Controller._setItemActions(item, swipeConfig.itemActions);

        if (swipeConfig.twoColumns) {
            const visibleActions = swipeConfig.itemActions.showed;
            swipeConfig.twoColumnsActions = [
                [visibleActions[0], visibleActions[1]],
                [visibleActions[2], visibleActions[3]]
            ];
        }

        this._collection.setSwipeConfig(swipeConfig);
    }

    /**
     * Ищет операции, которые должны быть показаны только в тулбаре или в тулбаре и в меню и возвращает
     * массив {showed, all}
     * @param actions
     * @private
     */
    private _wrapActionsInContainer(
        actions: IItemAction[]
    ): IItemActionsContainer {
        const showed = actions.filter(
            (action) =>
                !action.parent &&
                (action.showType === TItemActionShowType.TOOLBAR ||
                action.showType === TItemActionShowType.MENU_TOOLBAR)
        );
        if (this._isMenuButtonRequired(actions)) {
            showed.push({
                id: null,
                icon: `icon-ExpandDown ${ITEM_ACTION_ICON_CLASS}`,
                style: 'secondary',
                iconStyle: 'secondary',
                _isMenu: true
            });
        }
        return {
            all: actions,
            showed
        };
    }

    /**
     * Ищет операции, которые должны отображаться только в меню или в меню и тулбаре,
     * и у которых нет родительской операции
     * @param actions
     * @private
     */
    private _isMenuButtonRequired(actions: IItemAction[]): boolean {
        return actions.some(
            (action) =>
                !action.parent &&
                (!action.showType ||
                    action.showType === TItemActionShowType.MENU ||
                    action.showType === TItemActionShowType.MENU_TOOLBAR)
        );
    }

    private static _setItemActions(
        item: IItemActionsItem,
        actions: IItemActionsContainer
    ): boolean {
        const oldActions = item.getActions();
        if (!oldActions || (actions && !Controller._isMatchingActions(oldActions, actions))) {
            item.setActions(actions);
            return true;
        }
        return false;
    }

    private static _isMatchingActions(
        oldContainer: IItemActionsContainer,
        newContainer: IItemActionsContainer
    ): boolean {
        return (
            Controller._isMatchingActionLists(oldContainer.all, newContainer.all) &&
            Controller._isMatchingActionLists(oldContainer.showed, newContainer.showed)
        );
    }

    private static _calculateSwipeConfig(
        actions: IItemAction[],
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

    private static _needsHorizontalMeasurement(config: ISwipeConfig): boolean {
        const actions = config.itemActions;
        return (
            actions &&
            actions.showed?.length === 1 &&
            actions.all?.length > 1
        );
    }

    // todo переедет в шаблон
    private static _fixActionIcon(action: IItemAction): IItemAction {
        if (!action.icon || action.icon.includes(ITEM_ACTION_ICON_CLASS)) {
            return action;
        }
        return {
            ...action,
            icon: `${action.icon} ${ITEM_ACTION_ICON_CLASS}`
        };
    }

    private static _isMatchingActionLists(
        aActions: IItemAction[],
        bActions: IItemAction[]
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
