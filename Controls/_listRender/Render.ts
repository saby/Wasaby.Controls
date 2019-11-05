import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_listRender/Render/Render');

import defaultItemTemplate = require('wml!Controls/_listRender/Render/resources/ItemTemplateWrapper');

import { SyntheticEvent } from 'Vdom/Vdom';
import { CollectionItem, Collection } from 'Controls/display';
import { constants } from 'Env/Env';

export interface IRenderOptions extends IControlOptions {
    listModel: Collection<unknown>;
    contextMenuEnabled?: boolean;
    contextMenuVisibility?: boolean;
    multiselectVisibility?: string;
    itemTemplate?: TemplateFunction;
}

export interface IRenderChildren {
    itemsContainer?: HTMLDivElement;
}

export default class Render extends Control<IRenderOptions> {
    protected _template: TemplateFunction = template;
    protected _children: IRenderChildren;

    protected _templateKeyPrefix: string;
    protected _itemTemplate: TemplateFunction;

    protected _beforeMount(options: IRenderOptions): void {
        this._templateKeyPrefix = `list-render-${this.getInstanceId()}`;
        this._itemTemplate = options.itemTemplate || defaultItemTemplate;
    }

    getItemsContainer(): HTMLDivElement {
        return this._children.itemsContainer;
    }

    protected _onItemClick(
        e: SyntheticEvent<MouseEvent> & { preventItemEvent?: boolean },
        item: CollectionItem<unknown>
    ): void {
        if (!e.preventItemEvent && !item.isEditing()) {
            this._notify('itemClick', [item.getContents(), e], { bubbling: true });
        }
    }

    protected _onItemContextMenu(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        if (
            this._options.contextMenuEnabled !== false &&
            this._options.contextMenuVisibility !== false &&
            !this._options.listModel.isEditing()
        ) {
            this._notify('itemContextMenu', [item, e, false]);
        }
    }

    protected _onItemSwipe(e: SyntheticEvent<null>, item: CollectionItem<unknown>): void {
        e.stopPropagation();
        this._notify('itemSwipe', [item, e]);
    }

    protected _onItemMouseEnter(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        // this._notify('itemMouseEnter', [item, e]);
    }

    protected _onItemMouseMove(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        // this._notify('itemMouseLeave', [item, e]);
    }

    protected _onItemMouseLeave(e: SyntheticEvent<MouseEvent>, item: CollectionItem<unknown>): void {
        // this._notify('itemMouseMove', [item, e]);
    }

    protected _onItemWheel(e: SyntheticEvent<WheelEvent>, item: CollectionItem<unknown>): void {
        // Empty handler
    }

    protected _onItemKeyDown(e: SyntheticEvent<KeyboardEvent>, item: CollectionItem<unknown>): void {
        if (item.isEditing()) {
            // TODO Will probably be moved to EditInPlace container
            // keydown event should not bubble if processed here, but if we stop propagation
            // the rich text editor and tab focus movement would break because they listen
            // to the keydown event on the bubbling phase
            // https://online.sbis.ru/opendoc.html?guid=cefa8cd9-6a81-47cf-b642-068f9b3898b7
            //
            // Escape should not bubble above the edit in place row, because it is only
            // used to cancel the edit mode. If the keydown event bubbles, some parent
            // control might handle the event when it is not needed (e.g. if edit in
            // place is inside of a popup, the popup will be closed).
            if (
                e.nativeEvent.keyCode === constants.key.esc ||
                (
                    !e.target.closest('.richEditor_TinyMCE') &&
                    e.nativeEvent.keyCode !== constants.key.tab
                )
            ) {
                e.stopPropagation();
            }
            // Compatibility with BaseControl and EditInPlace control
            this._notify('editingRowKeyDown', [e.nativeEvent], {bubbling: true});
        }
    }

    protected _canHaveMultiselect(options: IRenderOptions): boolean {
        const visibility = options.multiselectVisibility;
        return visibility === 'onhover' || visibility === 'visible';
    }
}
