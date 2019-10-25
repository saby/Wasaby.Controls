import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { RecordSet } from 'Types/collection';

export function processItemActionClick(
    event: SyntheticEvent<MouseEvent>,
    action: any,
    item: CollectionItem<Model>
): void {
    event.stopPropagation();
    if (action._isMenu) {
        openActionsMenu.call(this, item, event);
    } else if (action['parent@']) {
        // self._notify('menuActionClick', [itemData, event, action]);
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
    // FIXME This should not be calling the manager itself
    const menuActions = this._options.listModel.getItemActionsManager().getMenuActions(item);
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
        this._options.listModel.setActiveItem(item);
        // this._itemWithShownMenu = item.getContents();

        import('css!theme?Controls/toolbars').then(() => {
            this._notify('requestDropdownMenuOpen', [dropdownConfig]);
        });
    }
}

export function closeActionsMenu(args?: { action: string, event: SyntheticEvent<MouseEvent>, data: any[] }): void {
    // If menu needs to close because one of the actions was clicked, process
    // the action handler first
    if (args && args.action === 'itemClick') {
        const action = args.data && args.data[0] && args.data[0].getRawData();
        processItemActionClick.call(this, args.event, action, this._options.listModel.getActiveItem());

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

function getFakeMenuTarget(realTarget: HTMLElement): { getBoundingClientRect(): ClientRect|DOMRect } {
    const rect = realTarget.getBoundingClientRect();
    return {
        getBoundingClientRect: () => rect
    };
}

function getItemContainer(item: CollectionItem<Model>): HTMLElement {
    const container: HTMLElement = this._container[0] || this._container;

    const startIndex = this._options.listModel.getStartIndex();
    const itemIndex = this._options.listModel.getSourceIndexByItem(item);

    // TODO Grid support
    return Array.prototype.filter.call(
        container.querySelector('.controls-ListView__itemV').parentNode.children,
        (el: HTMLElement) => el.className.includes('controls-ListView__itemV')
    )[itemIndex - startIndex];
}
