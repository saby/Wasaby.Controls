import {IControlOptions} from 'UI/Base';
import {INavigationOptions, IFilterOptions, IMultiSelectableOptions, ITooltip, ISearch} from 'Controls/interface';
import { IStickyPopupOptions } from 'Controls/_popup/interface/ISticky';
import {IMenuPopup} from 'Controls/menu';
import {IDropdownSourceOptions} from './IDropdownSource';
export type TKey = string|number|null;

export interface IBaseDropdownOptions extends IControlOptions, IDropdownSourceOptions, INavigationOptions,
    IFilterOptions, IMultiSelectableOptions, IMenuPopup, IStickyPopupOptions, ITooltip, ISearch {
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
