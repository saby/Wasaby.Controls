import { CollectionItem, ItemActionsController, VirtualScrollController } from 'Controls/display';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { RecordSet } from 'Types/collection';

export function processItemActionClick(
    event: SyntheticEvent<MouseEvent>,
    action: any,
    item: CollectionItem<Model>,
    fromDropdown: boolean = false
): void {
    event.stopPropagation();
    if (action._isMenu) {
        openActionsMenu.call(this, item, event);
    } else if (action['parent@']) {
        if (!fromDropdown) {
            openActionsSubmenu.call(this, item, action, event);
        }
    } else {
        const contents = item.getContents();
        const itemContainer = getItemContainer.call(this, item);

        // TODO Do we need this in the new model?
        this._notify('actionClick', [ action, contents, itemContainer ]);

        if (action.handler) {
            action.handler(contents);
        }
    }
    // TODO update some item actions
    // TODO move the marker
}

export function openActionsMenu(
    item: CollectionItem<Model>,
    event: SyntheticEvent<MouseEvent>,
    isContext: boolean = false
): void {
    // TODO look carefully at the conditions in BaseControl, port them
    // over if needed
    // TODO Part of this should probably be moved into the manager
    const menuActions = ItemActionsController.getMenuActions(item);
    if (menuActions && menuActions.length > 0) {
        event.stopPropagation();
        event.preventDefault();

        const closeHandler = closeActionsMenu.bind(this);
        const menuTarget = isContext ? null : getFakeMenuTarget.call(this, event.target as HTMLElement);
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
            className: `controls-Toolbar__popup__list_theme-${this._options.theme}`,
            nativeEvent: isContext ? event.nativeEvent : false
        };

        // TODO Move this to manager
        ItemActionsController.setActiveItem(this._options.listModel, item.getContents().getId());
        // this._itemWithShownMenu = item.getContents();

        import('css!theme?Controls/toolbars').then(() => {
            this._notify('requestDropdownMenuOpen', [dropdownConfig]);
        });
    }
}

// TODO A lot of common dropdown code between openActionsMenu and openActionsSubmenu,
// but it's not 100% the same. Refactor the common code into a separate function.
function openActionsSubmenu(
    item: CollectionItem<Model>,
    parentAction: any,
    event: SyntheticEvent<MouseEvent>
): void {
    const childActions = ItemActionsController.getChildActions(item, parentAction);
    if (childActions.length > 0) {
        const closeHandler = closeActionsMenu.bind(this);
        const submenuRecordSet = new RecordSet({ rawData: childActions, keyProperty: 'id' });
        const menuConfig = {
            items: submenuRecordSet,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'parent@',
            groupTemplate: this._options.contextMenuConfig && this._options.contextMenuConfig.groupTemplate,
            groupingKeyCallback: this._options.contextMenuConfig && this._options.contextMenuConfig.groupingKeyCallback,
            rootKey: parentAction.id,
            showHeader: true,
            dropdownClassName: 'controls-itemActionsV__popup',
            headConfig: {
                caption: parentAction.title
            }
        };
        const dropdownConfig = {
            opener: this,
            target: event.target,
            templateOptions: menuConfig,
            eventHandlers: {
                onResult: closeHandler,
                onClose: closeHandler
            },
            className: 'controls-DropdownList__margin-head'
        };

        ItemActionsController.setActiveItem(this._options.listModel, item.getContents().getId());

        import('css!Controls/input').then(() => {
            this._notify('requestDropdownMenuOpen', [dropdownConfig]);
        });
    }
}

export function closeActionsMenu(args?: { action: string, event: SyntheticEvent<MouseEvent>, data: any[] }): void {
    // Actions dropdown can start closing after the view itself was unmounted already, in which case
    // the model would be destroyed and there would be no need to process the action itself
    if (this._options.listModel && !this._options.listModel.destroyed) {
        // If menu needs to close because one of the actions was clicked, process
        // the action handler first
        if (args && args.action === 'itemClick') {
            const action = args.data && args.data[0] && args.data[0].getRawData();
            processItemActionClick.call(
                this,
                args.event,
                action,
                ItemActionsController.getActiveItem(this._options.listModel),
                true
            );

            // If this action has children, don't close the menu if it was clicked
            if (action['parent@']) {
                return;
            }
        }

        ItemActionsController.setActiveItem(this._options.listModel, null);
    }
    this._notify('requestDropdownMenuClose');
}

function getFakeMenuTarget(realTarget: HTMLElement): { getBoundingClientRect(): ClientRect|DOMRect } {
    const rect = realTarget.getBoundingClientRect();
    return {
        getBoundingClientRect: () => rect
    };
}

function getItemContainer(item: CollectionItem<Model>): HTMLElement {
    const container: HTMLElement = this._container[0] || this._container;

    const startIndex = VirtualScrollController.getStartIndex(this._options.listModel);
    const itemIndex = this._options.listModel.getSourceIndexByItem(item);

    // TODO Grid support
    return Array.prototype.filter.call(
        container.querySelector('.controls-ListView__itemV').parentNode.children,
        (el: HTMLElement) => el.className.includes('controls-ListView__itemV')
    )[itemIndex - startIndex];
}
