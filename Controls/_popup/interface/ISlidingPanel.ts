import { TemplateFunction } from 'UI/Base';

export interface ISlidingPanelPopupOptions {
    modal?: boolean;
    maxHeight?: number;
    minHeight?: number;
    minWidth?: number;
    maxWidth?: number;
    width?: number;
    position?: 'top' | 'bottom';
    slidingPanelPosition?: ISlidingPanelPosition;
    content?: TemplateFunction;
}

export interface ISlidingPanelPosition {
    minHeight: number;
    maxHeight: number;
    position: string;
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
