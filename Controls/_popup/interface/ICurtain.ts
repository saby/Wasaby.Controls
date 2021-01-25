export enum CURTAIN_POSITION {
    TOP = 'top',
    BOTTOM = 'bottom'
}
export interface ICurtainPopupOptions {
    modal?: boolean;
    maxHeight?: number;
    minHeight?: number;
    position?: CURTAIN_POSITION;
}

/**
 * Интерфейс для опций окна-шторки.
 * @public
 * @interface Controls/_popup/interface/ICurtain
 * @extends
 * @author Красильников А.С.
 */
export interface ICurtain {
    readonly '[Controls/_popup/interface/ICurtain]': boolean;
}

/**
 * @name Controls/_popup/interface/ICurtain#modal
 * @cfg {Boolean} Определяет, будет ли открываемое окно блокировать работу пользователя с родительским приложением.
 * @default false
 */

/**
 * @name Controls/_popup/interface/ICurtain#minHeight
 * @cfg {Number} Минимальная высота шторки.
 * С такой высотой шторка открывается, при свайпе пниз на минимальной высоте шторка закрывается.
 * @default false
 */

/**
 * @name Controls/_popup/interface/ICurtain#maxHeight
 * @cfg {Number} Максимальная высота шторки.
 * Следует задавать, если на вашем макете шторка может разворачиваться только на определенную высоту.
 * По умолчанию шторка может разворачиваться на всю высоту экрана.
 */

/**
 * @name Controls/_popupCurtain/interface/ICurtainTemplate#position
 * @cfg {String} Определяет с какой стороны отображается попап.
 * @variant top
 * @variant bottom
 * @default bottom
 */
