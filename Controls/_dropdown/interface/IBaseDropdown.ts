import {IControlOptions} from 'UI/Base';
import {INavigationOptions, IFilterOptions, IMultiSelectableOptions} from 'Controls/interface';
import {IMenuPopup} from 'Controls/menu';
import {IDropdownSourceOptions} from './IDropdownSource';
export type TKey = string|number|null;

export interface IBaseDropdownOptions extends IControlOptions, IDropdownSourceOptions, INavigationOptions,
    IFilterOptions, IMultiSelectableOptions, IMenuPopup {
    notifySelectedItemsChanged: Function;
    keyProperty: string;
    notifyEvent: Function;
    lazyItemsLoading?: boolean;
    emptyText?: string;
    selectedItemsChangedCallback?: Function;
    dataLoadErrback?: Function;
    historyId?: string;
    historyNew?: string;
    allowPin?: boolean;
    width?: number;
    popupClassName?: string;
    marker?: boolean;
    typeShadow?: string;
}

/**
 * Интерфейс контрола, отображающего список меню
 * @interface Controls/_dropdown/interface/IBaseDropdown
 * @public
 * @author Золотова Э.Е.
 */

export default interface IMenuBase {
    readonly '[Controls/_dropdown/interface/IBaseDropdown]': boolean;
}
