import {Control} from 'UI/Base';
import {Model} from 'Types/entity';
import {SyntheticEvent} from 'Vdom/Vdom';
import {IBaseCollection, IItemActionsTemplateConfig, ISwipeConfig, ANIMATION_STATE} from 'Controls/display';
import {ISource} from 'Controls/interface';

export enum TItemActionShowType {
    // show only in Menu
    MENU,
    // show in Menu and Toolbar
    MENU_TOOLBAR,
    // show only in Toolbar
    TOOLBAR
}

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
    /**
     * Identifier of the action.
     */
    id: string | number;

    /**
     * Action's name.
     */
    title?: string;

    /**
     * Action's icon.
     */
    icon?: string;

    /**
     * Location of the action.
     * @default MENU
     */
    showType?: TItemActionShowType;

    /**
     * Action's style.
     */
    style?: string;

    /**
     * Style of the action's icon.
     * @default secondary
     */
    iconStyle?: TIconStyle;

    /**
     * Action's handler.
     * @param item Corresponding list item.
     */
    handler?: (item: Model) => void;

    /**
     * Determines whether the action opens menu.
     */
    _isMenu?: boolean;

    /**
     * Flag of parent
     */
    'parent@'?: boolean|null;
    displayMode?: TActionDisplayMode;
    tooltip?: string;

    /**
     * Parent action id
     */
    parent?: string | number;
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
    size?: string;
    toolbarVisibility?: boolean;
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
    setActionsTemplateConfig(config: IItemActionsTemplateConfig): void;
    getActionsTemplateConfig(): IItemActionsTemplateConfig;
    setSwipeConfig(config: ISwipeConfig): void;
    getSwipeConfig(): ISwipeConfig;
    setSwipeAnimation(state: ANIMATION_STATE): void;
}

export interface IMenuTemplateOptions {
    source: ISource;
    keyProperty: string;
    parentProperty: string;
    nodeProperty: string;
    dropdownClassName: string;
    closeButtonVisibility: boolean;
    root: number | string;
    showHeader: boolean;
    headConfig?: {
        caption: string;
        icon: string;
    };
}

export type IMenuActionHandler = (event: SyntheticEvent, action: string, data: Model) => void;

export interface IMenuConfig {
    opener: Element | Control<object, unknown>;
    template: string;
    actionOnScroll: string;
    target: {
        getBoundingClientRect(): ClientRect;
    };
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
    eventHandlers?: {
         onResult: IMenuActionHandler;
         onClose: IMenuActionHandler;
    };
}
