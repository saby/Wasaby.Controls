import {Control, IControlOptions} from 'UI/Base';
import {ISourceOptions, IFilterOptions, INavigationOptions} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {DropdownReceivedState} from 'Controls/_dropdown/BaseDropdown';
export type TKey = string|number|null;

export default interface IDropdownController {
    loadItems(): Promise<DropdownReceivedState>;
    reload(): Promise<RecordSet>;
    setItems(items?: RecordSet): Promise<RecordSet>;
    update(newOptions: IDropdownControllerOptions): Promise<RecordSet>|void;
    loadDependencies(): Promise<unknown[]>;
    setMenuPopupTarget(target: HTMLElement): void;
    openMenu(popupOptions?: object): Promise<unknown[]>;
    closeMenu(): void;
    destroy(): void;
    handleSelectorResult(newItems: RecordSet, needDestroySrcController: boolean): void;
    handleSelectedItems(): void;
    updateItems(items: RecordSet|null): void;
    handleClose(): void;
    setFilter(filter: object): void;
}

export interface IDropdownControllerOptions extends IControlOptions, ISourceOptions, IFilterOptions, INavigationOptions {
    lazyItemsLoading?: boolean;
    menuOptions?: object;
    openerControl: Control;
}
