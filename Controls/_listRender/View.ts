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
     * @param data
     * @param clickEvent
     * @private
     */
    _onItemActionsMenuResult(
        e: SyntheticEvent<MouseEvent>,
        eventName: string,
        data: Model,
        clickEvent: SyntheticEvent<MouseEvent>) {
        this._dropdownMenuEventsHandler(eventName, data, clickEvent);
    }

    /**
     * Обработчик закрытия выпадающего/контекстного меню
     * @param e
     * @param clickEvent
     * @private
     */
    _onItemActionsMenuClose(e: SyntheticEvent<MouseEvent>, clickEvent: SyntheticEvent<MouseEvent>) {
        this._dropdownMenuEventsHandler('menuClosed', null, clickEvent);
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

        this._processItemActionClick(contents, action, clickEvent, false);
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
        const contents = item.getContents();
        this._processItemActionClick(contents, null, clickEvent, true);
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
     * Обработчики событий для выпадающего/контекстного меню
     * @param eventName
     * @param data
     * @param event
     * @private
     */
    private _dropdownMenuEventsHandler(
        eventName: string,
        data: Model,
        event: SyntheticEvent<MouseEvent>
    ): void {
        // Actions dropdown can start closing after the view itself was unmounted already, in which case
        // the model would be destroyed and there would be no need to process the action itself
        if (this._collection && !this._collection.destroyed) {
            // If menu needs to close because one of the actions was clicked, process
            // the action handler first
            if (eventName === 'itemClick') {
                const actionRawData = data && data.getRawData();
                const contents = this._itemActionsController.getActiveItem()?.getContents();
                this._processItemActionClick(
                    contents,
                    actionRawData,
                    event,
                    true
                );

                // If this action has children, don't close the menu if it was clicked
                if (actionRawData['parent@']) {
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

    /**
     * Обработка клика по ItemAction
     * @param contents
     * @param action
     * @param clickEvent
     * @param contextMenu
     * @private
     */
    private _processItemActionClick(
        contents: Model,
        action: IItemAction,
        clickEvent: SyntheticEvent<MouseEvent>,
        contextMenu: boolean): void {
        if (action && !action._isMenu && !action['parent@']) {
            this._itemActionsController.processItemActionClick(action, contents);
            // How to calculate itemContainer?
            // this._notify('actionClick', [action, contents, itemContainer]);
            this._notify('actionClick', [action, contents]);
        } else {
            this._itemActionsController.processDropDownMenuClick(contents?.getKey(), clickEvent, action, contextMenu);
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
