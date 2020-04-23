import {IBaseCollection, IItemActionsTemplateConfig, ISwipeConfig, IEditingConfig, ANIMATION_STATE} from 'Controls/display';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Model} from 'Types/entity';
import {ISource} from 'Controls/interface';

/**
 * @typedef {String} TIconStyle
 * @variant secondary
 * @variant warning
 * @variant danger
 * @variant success
 * TODO duplicated from IList
 */
export type TIconStyle = 'secondary'|'warning'|'danger'|'success';

/**
 * @typedef {String} TActionDisplayMode
 * @variant title показывать только заголовок
 * @variant icon показывать только иконку
 * @variant both показывать иконку и заголовок
 * @variant auto если есть иконка, то показывать иконку, иначе заголовок
 * TODO duplicated from IList
 */
export type TActionDisplayMode = 'title'|'icon'|'both'|'auto';

/**
 * TODO duplicated from IList
 */
export interface IItemAction {
    id: string;
    title?: string;
    icon?: string;
    showType?: 0|1|2;
    style?: string;
    iconStyle?: TIconStyle;
    displayMode?: TActionDisplayMode;
    tooltip?: string;
    handler?: (item) => void;
    parent?: string;
    'parent@'?: boolean|null;
    _isMenu?: boolean;
}

export type TActionClickCallback = (clickEvent: SyntheticEvent<MouseEvent>, action: IItemAction, contents: Model) => void;

export type TItemActionVisibilityCallback = (
    action: IItemAction,
    item: unknown
) => boolean;

export interface IItemActionsContainer {
    all: IItemAction[];
    showed: IItemAction[];
}

export interface IItemActionsTemplateOptions {
    style?: string;
    itemActionsPosition: string;
    actionAlignment?: string;
    actionCaptionPosition: 'right'|'bottom'|'none';
    itemActionsClass?: string;
    actionClickCallback?: TActionClickCallback;
}

export interface IItemActionsItem {
    getActions(): IItemActionsContainer;
    getContents(): Model;
    setActions(actions: IItemActionsContainer): void;
    setActive(active: boolean): void;
    isActive(): boolean;
    setSwiped(swiped: boolean): void;
    isSwiped(): boolean;
}

export interface IItemActionsCollection extends IBaseCollection<IItemActionsItem> {
    destroyed: boolean;
    each(cb: (item: IItemActionsItem) => void): void;
    setEventRaising?(raising: boolean, analyze?: boolean): void;
    areActionsAssigned(): boolean;
    setActionsAssigned(assigned: boolean): void;
    setActionsMenuConfig(config: any): void;
    getActionsMenuConfig(): any;
    setActionsTemplateConfig(config: IItemActionsTemplateConfig): void;
    getActionsTemplateConfig(): IItemActionsTemplateConfig;
    setSwipeConfig(config: ISwipeConfig): void;
    getSwipeConfig(): ISwipeConfig;
    getEditingConfig(): IEditingConfig;
    setSwipeAnimation(state: ANIMATION_STATE): void;
}

export interface IMenuTemplateOptions {
    source: ISource;
    keyProperty: string;
    parentProperty: string;
    nodeProperty: string;
    dropdownClassName: string;
    closeButtonVisibility: boolean;
    root: string;
    showHeader: boolean;
    headConfig?: {
        title: string;
        icon: string;
    };
}

export type IMenuActionHandler = (event: SyntheticEvent, action: string, data: Model) => void;

export interface IMenuConfig {
    target: HTMLElement;
    templateOptions: IMenuTemplateOptions;
    closeOnOutsideClick: boolean;
    targetPoint: {
        vertical: string,
        horizontal: string
    };
    direction: {
        horizontal: string
    };
    className: string;
    nativeEvent: Event;
    autofocus: boolean;
    eventHandlers: {
         onResult: IMenuActionHandler;
         onClose: IMenuActionHandler;
    };
}
