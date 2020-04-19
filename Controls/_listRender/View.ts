import { Control, TemplateFunction, IControlOptions } from 'UI/Base';

import template = require('wml!Controls/_listRender/View/View');

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { create as diCreate } from 'Types/di';

import {
    Collection,
    CollectionItem,
    MarkerCommands,
    ICollectionCommand
} from 'Controls/display';
import {
    ItemActionsController,
    TActionClickCallback,
    TItemActionVisibilityCallback,
    IDropdownConfig,
    IDropdownActionHandler,
    IItemAction} from 'Controls/itemActions';
import tmplNotify = require('Controls/Utils/tmplNotify');

import { load as libraryLoad } from 'Core/library';
import { SyntheticEvent } from 'Vdom/Vdom';

import { constants } from 'Env/Env';
import Mode from "../_dataSource/_error/Mode";

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

    private _actionClickCallbackFn: TActionClickCallback;

    protected async _beforeMount(options: IViewOptions): Promise<void> {
        this._collection = this._createCollection(options.collection, options.items, options);
        this._actionClickCallbackFn = this._actionClickCallback.bind(this);
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

    protected _onRenderMouseEnter(e: SyntheticEvent<MouseEvent>): void {
        this._updateItemActions();
    }

    protected _onRenderTouchStart(e: SyntheticEvent<TouchEvent>): void {
        this._updateItemActions();
    }

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

    // TODO неявный вызов notify, не надо так делать.
    protected _actionClickCallback(clickEvent: SyntheticEvent<MouseEvent>, action: any, contents: Model): void {
        // How to calculate itemContainer?
        // this._notify('actionClick', [action, contents, itemContainer]);
        this._notify('actionClick', [action, contents]);
    }



    /**
     * Открывает меню действий с записью
     * @param menuConfig
     */
    openItemActionsMenu(menuConfig: unknown): void {

    }

    /**
     * Закрывает меню действий с записью
     */
    closeItemActionsMenu(): void {
        this._children.menuOpener.close();
    }

    /**
     * Обрабатывает событие клика по записи и бросает событие actionClick
     * @param clickEvent
     * @param item
     * @param action
     * @private
     */
    protected _onItemActionClick(
        clickEvent: SyntheticEvent<null>,
        item: CollectionItem<Model>,
        action: IItemAction
    ): void {
        const moveMarker = new MarkerCommands.Mark(item.getContents().getKey());
        const contents = item.getContents();
        const itemKey = item.getContents().getKey();

        this._executeCommands([moveMarker]);
        // TODO fire 'markedKeyChanged' event

        if (!action._isMenu && !action['parent@']) {
            this._processItemActionClick(action, contents);
        } else {

        }
    }

    /**
     * Обработка события возникновения контекстногом еню/
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
        this._processDropDownMenuClick(
            item.getContents().getKey(),
            clickEvent,
            null,
            true);
    }

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
     * Исполняет handler callback у операции, а затем бросает событие actionClick
     * @param action
     * @param contents
     * @private
     */
    private _processItemActionClick(action: IItemAction, contents: Model): void {
        if (action.handler) {
            action.handler(contents);
        }
        // How to calculate itemContainer?
        // this._notify('actionClick', [action, contents, itemContainer]);
        this._notify('actionClick', [action, contents]);

        // TODO update some item actions
        // TODO move the marker
    }

    /**
     * Формирует конфиг для контекстного меню и меню, открываемого по клику на _isMenu,
     * задавая коллбек для обработки событий меню,
     * затем изменяет версию модели для того, чтобы показать меню
     * @param itemKey
     * @param clickEvent
     * @param action
     * @param isContextMenu
     * @private
     */
    _processDropDownMenuClick(itemKey: string, clickEvent: SyntheticEvent, action: IItemAction, isContextMenu: boolean): void {
        const menuConfig: IDropdownConfig = this._itemActionsController.prepareActionsMenuConfig(itemKey, clickEvent, !action._isMenu, isContextMenu);
        const eventHandler: IDropdownActionHandler = this._dropdownMenuEventsHandler.bind(this);
        menuConfig.eventHandlers = {
            onResult: eventHandler,
            onClose: eventHandler
        };
        this._collection.setActionsMenuConfig(menuConfig);
        this._collection.nextVersion();
    }

    /**
     * Обработчик событий контекстного меню и меню, открываемого по клмку на _isMenu
     * @param eventName
     * @param data
     * @private
     */
    private _dropdownMenuEventsHandler(eventName: string, data: Model): void {
        // Actions dropdown can start closing after the view itself was unmounted already, in which case
        // the model would be destroyed and there would be no need to process the action itself
        if (this._collection && !this._collection.destroyed) {
            // If menu needs to close because one of the actions was clicked, process
            // the action handler first
            if (eventName === 'itemClick') {
                const action = data && data.getRawData();
                const contents = this._itemActionsController.getActiveItem()?.getContents();
                this._processItemActionClick(action, contents);

                // If this action has children, don't close the menu if it was clicked
                if (action['parent@']) {
                    return;
                }
            }

            if (eventName !== 'menuOpened') {
                this._itemActionsController.setActiveItem(this._collection, null);
                this._collection.setActionsMenuConfig(null);
                this._itemActionsController.deactivateSwipe(this._collection);
                this._collection.nextVersion();
            }
        }
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
