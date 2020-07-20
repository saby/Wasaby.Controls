import {Model} from 'Types/entity';

/**
 * @typedef {String} TItemActionShowType
 * @remark
 * Эта опция не должна влиять на иерархию построения меню для тулбара.
 * @variant 0 показывать опцию только в дополнительном меню
 * @variant 1 показывать опцию в дополнительном меню и тулбаре
 * @variant 2 показывать опцию только в тулбаре
 */
export enum TItemActionShowType {
    // show only in Menu
    MENU,
    // show in Menu and Toolbar
    MENU_TOOLBAR,
    // show only in Toolbar
    TOOLBAR
}

/**
 * @typedef {String} TActionDisplayMode
 * @variant title показывать только заголовок
 * @variant icon показывать только иконку
 * @variant both показывать иконку и заголовок
 * @variant auto если есть иконка, то показывать иконку, иначе заголовок
 */
export enum TActionDisplayMode {
    TITLE = 'title',
    ICON = 'icon',
    BOTH = 'both',
    AUTO = 'auto'
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
 * @typedef {String} TActionCaptionPosition
 * @variant right Справа от иконки опции записи.
 * @variant bottom Под иконкой опции записи.
 * @variant none Не будет отображаться.
 */
export type TActionCaptionPosition = 'right'|'bottom'|'none';

/**
 * @typedef {String} TItemActionsPosition
 * @variant inside Внутри элемента.
 * @variant outside Под элементом.
 * @variant custom Произвольная позиция отображения. Задаётся через шаблон {@link Controls/interface/IItemTemplate itemTemplate}.
 */
export type TItemActionsPosition = 'inside'|'outside'|'custom';

/**
 * @cfg {string} TItemActionsSize
 * Размер иконок опций записи
 * @variant inside Внутри элемента.
 * @variant outside Под элементом.
 */
export type TItemActionsSize = 'm'|'l';

/**
 * @cfg {string} TItemActionsSize
 * Видимость кнопки "Ещё" в свайпе
 * @variant visible - кнопка видима в любом случае
 * @variant adaptive - Расчёт происходит от количесива элементов в свайпе
 */
export type TMenuButtonVisibility = 'visible'|'adaptive';

/**
 * Configuration object for a button which will be shown when the user hovers over a list item.
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
    style?: TIconStyle;

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

    /**
     * настройка отображения иконки и заголовка
     */
    displayMode?: TActionDisplayMode;

    /**
     * Значение, которое показано в тултипе при наведении на опцию
     */
    tooltip?: string;

    /**
     * Parent action id
     */
    parent?: string | number;
}

/**
 * Расширенный интерфейс IItemAction с полями для использования в шаблоне
 */
interface IShownItemAction extends IItemAction {
    /**
     * Показывать текст операции
     */
    showTitle?: boolean;

    /**
     * Показывать иконку операции
     */
    showIcon?: boolean;
}

export type TItemActionVisibilityCallback = (action: IItemAction, item: unknown) => boolean;

export type TEditArrowVisibilityCallback = (item: unknown) => boolean;

export interface IItemActionsContainer {
    all: IItemAction[];
    showed: IShownItemAction[];
}
