import { Control, TemplateFunction, IControlOptions } from 'UI/Base';

import template = require('wml!Controls/_listRender/Managers/ItemActions/ItemActions');
import itemActionsTemplate = require('wml!Controls/_listRender/Render/resources/ItemActionsTemplate');
import { SyntheticEvent } from 'Vdom/Vdom';
import { CollectionItem, Collection } from 'Controls/display';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

export type TItemActionVisibilityCallback = (action, item: Model) => boolean;

export interface IItemActionsControlOptions extends IControlOptions {
    listModel: Collection<Model>;

    itemActions?: any[];
    itemActionsVisibilityCallback?: TItemActionVisibilityCallback;
    itemActionsPosition?: string;

    contextMenuConfig?: any;
}

export default class ItemActionsControl extends Control<IItemActionsControlOptions> {
    protected _template: TemplateFunction = template;

    protected _itemActionsTemplate: TemplateFunction = itemActionsTemplate;

    protected _afterMount(): void {
        // TODO Item actions should be set on first mouse enter (what about touch devices?)
        this._closeActionsMenu = this._closeActionsMenu.bind(this);

        // FIXME itemActionsManager should be created by the container itself
        // instead of by the model
        this._options.listModel._itemActionsManager.assignItemActions(
            this._options.itemActions,
            this._options.itemActionsVisibilityCallback
        );
    }

    protected _onItemActionsClick(event: SyntheticEvent<MouseEvent>, action: any, item: CollectionItem<Model>): void {
        event.stopPropagation();
        if (action._isMenu) {
            this._showActionsMenu(item, event);
        } else if (action['parent@']) {
            // self._notify('menuActionClick', [itemData, event, action]);
        } else {
            const contents = item.getContents();
            const itemContainer = this._getItemContainer(item);

            // TODO Do we need this in the new model?
            this._notify('actionClick', [ action, contents, itemContainer ]);

            if (action.handler) {
                action.handler(contents);
            }
        }
        // TODO update some item actions
        // TODO move the marker
    }

    protected _onItemContextMenu(
        event: SyntheticEvent<null>,
        item: CollectionItem<Model>,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        this._showActionsMenu(item, clickEvent, true);
    }

    private _showActionsMenu(
        item: CollectionItem<Model>,
        event: SyntheticEvent<MouseEvent>,
        isContext: boolean = false
    ): void {
        // TODO look carefully at the conditions in BaseControl, port them
        // over if needed
        // TODO Part of this should probably be moved into the manager
        const menuActions = this._options.listModel._itemActionsManager.getMenuActions(item);
        if (menuActions && menuActions.length > 0) {
            event.stopPropagation();
            event.preventDefault();

            const menuTarget = isContext ? null : this._getFakeMenuTarget(event.target as HTMLElement);
            const menuRecordSet = new RecordSet({ rawData: menuActions, keyProperty: 'id' });
            const menuConfig = {
                items: menuRecordSet,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'parent@',
                dropdownClassName: 'controls-itemActionsV__popup',
                showClose: true,

                ...this._options.contextMenuConfig
            };
            const dropdownConfig = {
                opener: this,
                target: menuTarget,
                templateOptions: menuConfig,
                eventHandlers: {
                    onResult: this._closeActionsMenu,
                    onClose: this._closeActionsMenu
                },
                closeOnOutsideClick: true,
                targetPoint: {
                    vertical: 'top',
                    horizontal: 'right'
                },
                direction: {
                    horizontal: isContext ? 'right' : 'left'
                },
                className: `controls-Toolbar__popup__list_theme-${this._options.theme}`,
                nativeEvent: isContext ? event.nativeEvent : false
            };

            // TODO Move this to manager
            this._options.listModel.setActiveItem(item);
            // this._itemWithShownMenu = item.getContents();

            import('css!theme?Controls/toolbars').then(() => {
                this._notify('requestDropdownMenuOpen', [dropdownConfig]);
            });
        }
    }

    private _closeActionsMenu(args?: { action: string, event: SyntheticEvent<MouseEvent>, data: any[] }): void {
        // If menu needs to close because one of the actions was clicked, process
        // the action handler first
        if (args && args.action === 'itemClick') {
            const action = args.data && args.data[0] && args.data[0].getRawData();
            this._onItemActionsClick(args.event, action, this._options.listModel.getActiveItem());

            // If this action has children, don't close the menu if it was clicked
            if (action['parent@']) {
                return;
            }
        }

        // TODO Move this to the manager as well??
        this._options.listModel.setActiveItem(null);
        this._notify('requestDropdownMenuClose');
        // TODO Close swipe menu too
    }

    private _getFakeMenuTarget(realTarget: HTMLElement): { getBoundingClientRect(): ClientRect|DOMRect } {
        const rect = realTarget.getBoundingClientRect();
        return {
            getBoundingClientRect: () => rect
        };
    }

    private _getItemContainer(item: CollectionItem<Model>): HTMLElement {
        const container: HTMLElement = this._container[0] || this._container;

        const startIndex = this._options.listModel.getStartIndex();
        const itemIndex = this._options.listModel.getSourceIndexByItem(item);

        // TODO Grid support
        return Array.prototype.filter.call(
            container.querySelector('.controls-ListView__itemV').parentNode.children,
            (el: HTMLElement) => el.className.includes('controls-ListView__itemV')
        )[itemIndex - startIndex];
    }

    static getDefaultOptions(): Partial<IItemActionsControlOptions> {
        return {
            itemActionsPosition: 'inside'
        };
    }
}
