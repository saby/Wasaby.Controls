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
