import {Model} from 'Types/entity';

/**
 * @typedef {String} TItemActionShowType
 * @remark
 * Эта опция не влияет на иерархию построения меню для тулбара.
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
 * @typedef {string} TItemActionsSize
 * Размер иконок опций записи
 * @variant inside Внутри элемента.
 * @variant outside Под элементом.
 */
export type TItemActionsSize = 'm'|'l';

/**
 * @typedef {string} TItemActionsSize
 * Видимость кнопки "Ещё" в свайпе
 * @variant visible - кнопка видима в любом случае
 * @variant adaptive - Расчёт происходит от количесива элементов в свайпе
 */
export type TMenuButtonVisibility = 'visible'|'adaptive';

/**
 * @typedef {Function} TItemActionHandler
 * Обработчик опции записи. См. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/item-actions/handler-click/ пример обработчика}.
 * @param item Corresponding list item.
 */
export type TItemActionHandler = (item: Model) => void;

/**
 * Интерфейс опции записи
 * @describe
 * Опции записи могут быть использованы в следующих вариантах:
 * 1.	Панель опций записи, отображаемая в desktop браузерах
 * 2.	Панель опций записи, появляющаяся при свайпе по записи влево.
 * 3.	Всплывающее меню, появляющееся при нажатии на кнопку дополнительных опций записи.
 * 4.	Всплывающее (контекстное) меню, появляющееся при нажатии правой кнопкой мыши.
 * @interface Controls/_itemActions/interface/IItemAction
 * @public
 * @author Аверкиев П.А.
 */
/*
 * Interface describing configuration for a button which will be shown when the user hovers over a list item.
 * @interface Controls/_itemActions/interface/IItemAction
 * @public
 * @author Аверкиев П.А.
 */
export interface IItemAction {
    /**
     * @name Controls/_itemActions/itemActions/interface/IItemAction#id
     * @cfg {String|Number} Идентификатор опции записи
     */
    /*
     * @name Controls/_itemActions/interface/IItemAction#id
     * @cfg {String|Number} Identifier of the action.
     */
    id: string | number;

    /**
     * @name Controls/_itemActions/interface/IItemAction#title
     * @cfg {String} Название опции записи.
     */
    /*
     * @name Controls/_itemActions/interface/IItemAction#title
     * @cfg {String} Action name.
     */
    title?: string;

    /**
     * @name Controls/_itemActions/interface/IItemAction#icon
     * @cfg {String} Имя иконки для опции записи.
     */
    /*
     * @name Controls/_itemActions/interface/IItemAction#icon
     * @cfg {String} Action's icon.
     */
    icon?: string;

    /**
     * @name Controls/_itemActions/interface/IItemAction#showType
     * @default MENU
     * @cfg {Controls/itemActions:TItemActionShowType} Определяет, где будет отображаться элемент.
     * Доступные значения:
     * * TItemActionShowType.MENU — элемент отображается только в меню.
     * * TItemActionShowType.MENU_TOOLBAR — элемент отображается в меню и в тулбаре.
     * * TItemActionShowType.TOOLBAR — элемент отображается только в тулбаре.
     */
    /*
     * @name Controls/_itemActions/interface/IItemAction#showType
     * @default MENU
     * @cfg {Controls/itemActions:TItemActionShowType} Determines where item is displayed.
     * Values:
     * * TItemActionShowType.MENU - item is displayed only in the menu
     * * TItemActionShowType.MENU_TOOLBAR - item is displayed in the menu and toolbar
     * * TItemActionShowType.TOOLBAR - item is displayed only in the toolbar
     */
    showType?: TItemActionShowType;

    /**
     * @name Controls/_itemActions/interface/IItemAction#style
     * @cfg {TIconStyle} Значение свойства преобразуется в CSS-класс вида "controls-itemActionsV__action_style_<значение_свойства>".
     * Доступные значения:
     * * secondary
     * * warning
     * * danger
     * * success
     * Он будет установлен для html-контейнера самой опции записи, и свойства класса будут применены как к тексту (см. title), так и к иконке (см. icon).
     */
    /*
     * @name Controls/_itemActions/interface/IItemAction#style
     * @cfg {TIconStyle} Operation style. (secondary | warning | danger | success).
     */
    style?: TIconStyle;

    /**
     * @name Controls/_itemActions/interface/IItemAction#iconStyle
     * @cfg {Controls/itemActions:TIconStyle} [iconStyle=secondary] Стиль иконки.
     * Каждому значению свойства соответствует стиль, который определяется {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/themes/ темой оформления} приложения.
     * Доступные значения:
     * * secondary
     * * warning
     * * danger
     * * success
     * @default secondary
     */
    /*
     * @name Controls/_itemActions/interface/IItemAction#iconStyle
     * @cfg {TIconStyle} Style of the action's icon. (secondary | warning | danger | success).
     * @default secondary
     */
    iconStyle?: TIconStyle;

    /**
     * @name Controls/_itemActions/interface/IItemAction#handler
     * @cfg {TItemActionHandler} Обработчик опции записи. См. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/item-actions/handler-click/ пример обработчика}.
     */
    /*
     * @name Controls/_itemActions/interface/IItemAction#handler
     * @cfg {TItemActionHandler} item action handler callback
     */
    handler?: TItemActionHandler;

    /**
     * @name Controls/_itemActions/interface/IItemAction#parent@
     * @cfg {Boolean} Поле, описывающее тип узла (список, узел, скрытый узел).
     * Подробнее о различиях между типами узлов можно прочитать {@link https://wi.sbis.ru/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy здесь}.
     */
    /*
     * @name Controls/_itemActions/interface/IItemAction#parent@
     * @cfg {Boolean} Field that describes the type of the node (list, node, hidden node).
     */
    'parent@'?: boolean;

    /**
     * @name Controls/_itemActions/interface/IItemAction#displayMode
     * @cfg {Controls/itemActions:TActionDisplayMode} Режим отображения опции записи.
     * Доступные значения:
     * * TActionDisplayMode.TITLE - Показывать только название
     * * TActionDisplayMode.ICON - Показывать только иконку
     * * TActionDisplayMode.BOTH - Показывать название и иконку
     * * TActionDisplayMode.AUTO - если есть иконка, то показывать иконку, иначе заголовок
     */
    /*
     * @name Controls/_itemActions/interface/IItemAction#displayMode
     * @cfg {Controls/itemActions:TActionDisplayMode} item action display mode
     * Available values:
     * * TActionDisplayMode.TITLE - display title only
     * * TActionDisplayMode.ICON - display icon only
     * * TActionDisplayMode.BOTH - display title and icon
     * * TActionDisplayMode.AUTO - display icon when item action has icon otherwise show title
     */
    displayMode?: TActionDisplayMode;

    /**
     * @name Controls/_itemActions/interface/IItemAction#tooltip
     * @cfg {String} Текст подсказки при наведении мыши.
     */
    /*
     * @name Controls/_itemActions/interface/IItemAction#tooltip
     * @cfg {String} tooltip showing on mouse hover
     */
    tooltip?: string;

    /**
     * @name Controls/_itemActions/interface/IItemAction#parent
     * @cfg {String|Number} Идентификатор родительской опции записи.
     * Используется для создания {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/item-actions/hierarchy/ многоуровневого контекстного меню}.
     */
    /*
     * @name Controls/_itemActions/interface/IItemAction#parent
     * @cfg {String|Number} Key of the action's parent.
     */
    parent?: string | number;
}

/**
 * Расширенный интерфейс IItemAction с полями для использования в шаблоне
 * @interface
 * @private
 * @author Аверкиев П.А.
 */
/*
 * Extended interface for itemActions to use it inside of template
 * @interface
 * @private
 * @author Аверкиев П.А.
 */
export interface IShownItemAction extends IItemAction {
    /**
     * Показывать текст операции
     */
    showTitle?: boolean;

    /**
     * Показывать иконку операции
     */
    showIcon?: boolean;

    /**
     * Определяет, что опция является меню
     */
    _isMenu?: boolean;
}

/**
 * @typedef {Function} TItemActionVisibilityCallback
 * @description
 * Функция обратного вызова для определения видимости опций записи.
 * @param action Item Action to check
 * @param item Model
 */
export type TItemActionVisibilityCallback = (action: IItemAction, item: Model) => boolean;

/**
 * @typedef {Function} TItemActionVisibilityCallback
 * @description
 * Функция обратного вызова для определения видимости кнопки редактирования в свайпе.
 * @param item Model
 */
export type TEditArrowVisibilityCallback = (item: Model) => boolean;

export interface IItemActionsContainer {
    all: IItemAction[];
    showed: IShownItemAction[];
}
