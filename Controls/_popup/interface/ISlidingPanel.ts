import { TemplateFunction } from 'UI/Base';

type TSlidingPanelPosition = 'top' | 'bottom';

export interface ISlidingPanelPopupOptions {
    slidingPanelSizes: ISlidingPanelSizes;
    dialogSizes: IDialogSizes;
    modal?: boolean;
    position?: TSlidingPanelPosition;
    slidingPanelPosition?: ISlidingPanelPosition;
    content?: TemplateFunction;
}

export interface ISlidingPanelSizes {
    maxHeight?: number;
    minHeight?: number;
}

export interface IDialogSizes {
    minHeight?: number;
    maxHeight?: number;
    minWidth?: number;
    maxWidth?: number;
    width?: number;
    height?: number;
}

export interface ISlidingPanelPosition {
    minHeight: number;
    maxHeight: number;
    position: TSlidingPanelPosition;
    height: number;
}

/**
 * Интерфейс для опций окна-шторки.
 * @public
 * @interface Controls/_popup/interface/ISlidingPanel
 * @extends
 * @author Красильников А.С.
 */
export interface ISlidingPanel {
    readonly '[Controls/_popup/interface/ISlidingPanel]': boolean;
}

/**
 * @name Controls/_popup/interface/ISlidingPanel#modal
 * @cfg {Boolean} Определяет, будет ли открываемое окно блокировать работу пользователя с родительским приложением.
 * @default false
 */

/**
 * @name Controls/_popup/interface/ISlidingPanel#minHeight
 * @cfg {Number} Минимальная высота шторки.
 * С такой высотой шторка открывается, при свайпе пниз на минимальной высоте шторка закрывается.
 * @default false
 */

/**
 * @name Controls/_popup/interface/ISlidingPanel#maxHeight
 * @cfg {Number} Максимальная высота шторки.
 * Следует задавать, если на вашем макете шторка может разворачиваться только на определенную высоту.
 * По умолчанию шторка может разворачиваться на всю высоту экрана.
 */

/**
 * @name Controls/_popup/interface/ISlidingPanel#position
 * @cfg {String} Определяет с какой стороны отображается попап.
 * @variant top
 * @variant bottom
 * @default bottom
 */

/**
 * @typedef {Object} Controls/_popup/interface/ISlidingPanel/DialogSizes
 * @description Размеры попапа на настольном копьютере и планшете.
 * @property {Number} minHeight Минимально допустимая высота шторки. С такой высотой она открывается.
 * @property {Number} maxHeight Максимально допустимая высота шторки.
 */

/**
 * @typedef {Object} Controls/_popup/interface/ISlidingPanel/SlidingPanelSizes
 * @description Размеры шторки.(на мобильном устройстве)
 * @property {Number} minHeight Минимально допустимая высота шторки. С такой высотой она открывается.
 * @property {Number} maxHeight Максимально допустимая высота шторки.
 */

/**
 * @typedef {Object} Controls/_popup/interface/ISlidingPanel/PopupOptions
 * @description Конфигурация шторки.
 * @property {Boolean} [modal=false] Определяет, будет ли открываемое окно блокировать работу пользователя с родительским приложением.
 * @property {String} className Имена классов, которые будут применены к корневой ноде всплывающего окна.
 * @property {function|String} template Шаблон всплывающего окна.
 * @property {function|String} templateOptions Опции для контрола, переданного в {@link template}.
 * @property {String} position Определяет с какой стороны отображается попап.
 * @property {Controls/_popup/interface/ISlidingPanel/SlidingPanelSizes.typedef} slidingPanelSizes Конфигурация размеров шторки на мобильном устройстве
 * @property {Controls/_popup/interface/ISlidingPanel/DialogSizes.typedef} dialogSizes Конфигурация размеров попапа на настольном копьютере и планшете
 * @property {Node} opener Логический инициатор открытия всплывающего окна. Читайте подробнее {@link /doc/platform/developmentapl/interface-development/ui-library/focus/index/#control-opener здесь}.
 * @property {Controls/_popup/interface/IBaseOpener/EventHandlers.typedef} eventHandlers Функции обратного вызова на события стековой панели.
 */
