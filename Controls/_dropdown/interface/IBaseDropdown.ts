import {IControlOptions} from 'UI/Base';
import {INavigationOptions, IFilterOptions, IMultiSelectableOptions, ITooltipOptions, ISearchOptions} from 'Controls/interface';
import { IStickyPopupOptions } from 'Controls/_popup/interface/ISticky';
import {IMenuPopupOptions} from 'Controls/_menu/interface/IMenuPopup';
import {IDropdownSourceOptions} from './IDropdownSource';
export type TKey = string|number|null;

export interface IBaseDropdownOptions extends IControlOptions, IDropdownSourceOptions, INavigationOptions,
    IFilterOptions, IMultiSelectableOptions, IMenuPopupOptions, IStickyPopupOptions, ITooltipOptions, ISearchOptions {
    dropdownClassName?: string;
    historyId?: string;
    popupClassName?: string;
    dataLoadCallback?: Function;
    keyProperty: string;
    emptyText?: string;
    displayProperty: string;
}

export default interface IBaseDropdown {
    readonly '[Controls/_dropdown/interface/IBaseDropdown]': boolean;
}
