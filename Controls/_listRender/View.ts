import { Control, TemplateFunction, IControlOptions } from 'UI/Base';

import template = require('wml!Controls/_listRender/View/View');

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { create as diCreate } from 'Types/di';
import { Sticky } from 'Controls/popup';

import {
    Collection,
    CollectionItem,
    MarkerCommands,
    ICollectionCommand
} from 'Controls/display';
import {
    ItemActionsController,
    TItemActionVisibilityCallback,
    IItemAction} from 'Controls/itemActions';
import tmplNotify = require('Controls/Utils/tmplNotify');

import { load as libraryLoad } from 'Core/library';
import { SyntheticEvent } from 'Vdom/Vdom';

import { constants } from 'Env/Env';

export interface IViewOptions extends IControlOptions {
    items: RecordSet;

    collection: string;
    render: string;

    itemActions?: any[];
    itemActionVisibilityCallback?: TItemActionVisibilityCallback;
    itemActionsPosition?: string;
    itemActionsProperty?: string;
    style?: string;
    itemActionsClass?: string;

    actionAlignment?: string;
    actionCaptionPosition?: 'right'|'bottom'|'none';

    editingConfig?: any;
}

interface ISwipeEvent extends Event {
    direction: string;
}

export default class View extends Control<IViewOptions> {
    protected _template: TemplateFunction = template;
    protected _tmplNotify: Function = tmplNotify;

    protected _collection: Collection<Model>;

    private _itemActionsController: ItemActionsController;

    private _popupId: string;

    protected async _beforeMount(options: IViewOptions): Promise<void> {
        this._collection = this._createCollection(options.collection, options.items, options);
        return libraryLoad(options.render).then(() => null);
    }

    protected _beforeUpdate(options: IViewOptions): void {
        let collectionRecreated = false;

        if (options.items !== this._options.items) {
            if (this._collection) {
                this._collection.destroy();
            }
            this._collection = this._createCollection(options.collection, options.items, options);
            collectionRecreated = true;
        }

        if (options.editingConfig !== this._options.editingConfig || options.editingConfig && collectionRecreated) {
            this._collection.setEditingConfig(options.editingConfig);
        }

        if (
            options.itemActions !== this._options.itemActions ||
            options.itemActionVisibilityCallback !== this._options.itemActionVisibilityCallback ||
            (options.itemActions || options.itemActionsProperty) && collectionRecreated ||
            options.itemActionsProperty
        ) {
            // TODO Only reassign actions if Render is hovered. Otherwise wait
            //  for mouseenter or touchstart to recalc the items
            this._updateItemActions();
        }
    }

    protected _beforeUnmount(): void {
        if (this._collection) {
            this._collection.destroy();
            this._collection = null;
        }
    }

    /**
     * При наведении на запись в списке мы должны показать операции
     * @param e
     * @private
     */
    protected _onRenderMouseEnter(e: SyntheticEvent<MouseEvent>): void {
        this._updateItemActions();
    }

    /**
     * По событию youch мы должны показать операции
     * @param e
     * @private
     */
    protected _onRenderTouchStart(e: SyntheticEvent<TouchEvent>): void {
        this._updateItemActions();
    }

    /**
     * По клику на запись в списке нужно переместить маркер
     * @param e
     * @param item
     * @param clickEvent
     * @private
     */
    protected _onItemClick(
        e: SyntheticEvent<null>,
        item: Model,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        const moveMarker = new MarkerCommands.Mark(item.getKey());
        this._executeCommands([moveMarker]);
        // TODO fire 'markedKeyChanged' event
    }

    protected _onItemSwipe(
        e: SyntheticEvent<null>,
        item: CollectionItem<Model>,
        swipeEvent: SyntheticEvent<ISwipeEvent>,
        swipeContainerHeight: number
    ): void {
        switch (swipeEvent.nativeEvent.direction) {
        case 'left':
            this._itemActionsController.activateSwipe(
                this._collection,
                item.getContents().getKey(),
                swipeContainerHeight
            );
            break;
        default:
            // TODO How to close swipe with animation
            this._itemActionsController.deactivateSwipe(this._collection);
            break;
        }
    }

    /**
     * Обработчик клика по операции в выпадающем/контекстном меню
     * @param e
     * @param eventName
     * @param actionData
     * @param clickEvent
     * @private
     */
    protected _onItemActionsMenuResult(
        e: SyntheticEvent<MouseEvent>,
        eventName: string,
        actionData: Model,
        clickEvent: SyntheticEvent<MouseEvent>) {
        // Actions dropdown can start closing after the view itself was unmounted already, in which case
        // the model would be destroyed and there would be no need to process the action itself
        if (this._collection && !this._collection.destroyed) {
            if (eventName === 'itemClick') {
                const actionRawData = actionData && actionData.getRawData();
                const contents = this._itemActionsController.getActiveItem()?.getContents();

                // Если кликнули по экшну, и он не должен открывать меню
                if (actionRawData && !actionRawData['parent@']) {
                    this._itemActionsController.processItemActionClick(actionRawData, contents);
                    // How to calculate itemContainer?
                    // this._notify('actionClick', [action, contents, itemContainer]);
                    this._notify('actionClick', [actionRawData, contents]);

                    this._closeActionsMenu();

                    // Если экшн должен открывать меню. Проверь, бывают ли меню третьего уровня
                } else {
                    const opener = this._children.renderer;
                    this._openItemActionsMenu(contents, null, clickEvent, opener, true);
                }
            }
        }
    }

    /**
     * Обработчик закрытия выпадающего/контекстного меню
     * @param e
     * @param clickEvent
     * @private
     */
    protected _onItemActionsMenuClose(e: SyntheticEvent<MouseEvent>, clickEvent: SyntheticEvent<MouseEvent>): void {
        this._onCloseActionsMenuHandler();
    }

    /**
     * Обрабатывает событие клика по записи и бросает событие actionClick
     * @param e
     * @param item
     * @param action
     * @param clickEvent
     * @private
     */
    protected _onItemActionClick(
        e: SyntheticEvent<MouseEvent>,
        item: CollectionItem<Model>,
        action: IItemAction,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        const moveMarker = new MarkerCommands.Mark(item.getContents().getKey());
        const contents = item.getContents();

        this._executeCommands([moveMarker]);
        // TODO fire 'markedKeyChanged' event

        // Если кликнули по экшну, и он не должен открывать меню
        if (action && !action._isMenu && !action['parent@']) {
            this._itemActionsController.processItemActionClick(action, contents);
            // How to calculate itemContainer?
            // this._notify('actionClick', [action, contents, itemContainer]);
            this._notify('actionClick', [action, contents]);

        // Если экшн должен открывать меню
        } else {
            const opener = this._children.renderer;
            this._openItemActionsMenu(contents, null, clickEvent, opener, false);
        }
    }

    /**
     * Обработка события возникновения контекстного меню
     * @param e
     * @param item
     * @param clickEvent
     * @private
     */
    protected _onItemContextMenu(
        e: SyntheticEvent<null>,
        item: CollectionItem<Model>,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        const contents = item.getContents();
        const opener = this._children.renderer;
        this._openItemActionsMenu(contents, null, clickEvent, opener, true);
    }

    /**
     * Обработка события клика по элементу списка
     * @param e
     * @param item
     * @param keyDownEvent
     * @private
     */
    protected _onItemKeyDown(
        e: SyntheticEvent<null>,
        item: CollectionItem<Model>,
        keyDownEvent: SyntheticEvent<KeyboardEvent>
    ): void {
        const commands: Array<ICollectionCommand<unknown>> = [];
        switch (keyDownEvent.nativeEvent.keyCode) {
        case constants.key.down:
            commands.push(new MarkerCommands.MarkNext());
            break;
        case constants.key.up:
            commands.push(new MarkerCommands.MarkPrevious());
            break;
        }
        this._executeCommands(commands);
        // TODO fire 'markedKeyChanged' event if needed
    }

    protected _executeCommands(commands: Array<ICollectionCommand<unknown>>): void {
        commands.forEach((command) => command.execute(this._collection));
    }

    /**
     * TODO переедет в контроллер
     * открывает меню операций
     * @param contents
     * @param action
     * @param clickEvent
     * @param opener
     * @param isContextMenu
     */
    private _openItemActionsMenu(
        contents: Model,
        action: IItemAction,
        clickEvent: SyntheticEvent<MouseEvent>,
        opener: Element | Control<{}, void>,
        isContextMenu: boolean): void {
        const itemKey = contents?.getKey();
        const menuConfig = this._itemActionsController.prepareActionsMenuConfig(itemKey, clickEvent, action, opener, isContextMenu);
        this._itemActionsController.setActiveItem(this._collection, itemKey);
        Sticky.openPopup(menuConfig).then((popupId) => {
            this._popupId = popupId;
        });
    }

    /**
     * TODO переедет в контроллер
     * Метод, который должен отработать после закрытия меню
     * @private
     */
    private _onCloseActionsMenuHandler(): void {
        this._itemActionsController.setActiveItem(this._collection, null);
        this._collection.setActionsMenuConfig(null);
        this._itemActionsController.deactivateSwipe(this._collection);
    }

    /**
     * TODO переедет в контроллер
     * Метод, который закрывает меню
     * @private
     */
    private _closeActionsMenu(): void {
        this._onCloseActionsMenuHandler();
        Sticky.closePopup(this._popupId);
    }

    private _createCollection(
        module: string,
        items: RecordSet,
        collectionOptions: IViewOptions
    ): Collection<Model> {
        return diCreate(module, { ...collectionOptions, collection: items });
    }

    protected _updateItemActions(): void {
        if (!this._options.itemActions && !this._options.itemActionsProperty) {
            return;
        }
        if (!this._itemActionsController) {
            this._itemActionsController = new ItemActionsController();
        }
        this._itemActionsController.update({
            collection: this._collection,
            itemActions: this._options.itemActions,
            itemActionsProperty: this._options.itemActionsProperty,
            visibilityCallback: this._options.itemActionVisibilityCallback,
            itemActionsPosition: this._options.itemActionsPosition,
            style: this._options.style,
            actionAlignment: this._options.actionAlignment,
            actionCaptionPosition: this._options.actionCaptionPosition,
            itemActionsClass: this._options.itemActionsClass
        });
    }

    static getDefaultOptions(): Partial<IViewOptions> {
        return {
            itemActionsPosition: 'inside',
            actionAlignment: 'horizontal',
            actionCaptionPosition: 'none',
            style: 'default'
        };
    }
}
