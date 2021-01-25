import {TemplateFunction} from 'UI/Base';

export interface ICurtainTemplateOptions extends IControlOptions {
    position: 'top' | 'bottom';
    contrastBackground: boolean;
    showControlButton: boolean;
    bodyContentTemplate?: string | TemplateFunction;
}

/**
 * Интерфейс для шаблона попапа-шторки.
 *
 * @interface Controls/_popupCurtain/interface/ICurtainTemplate
 * @implements Controls/_interface/IContrastBackground
 * @public
 * @author Красильников А.С.
 */
export interface ICurtainTemplate {
    readonly '[Controls/_popupCurtain/interface/ICurtainTemplate]'?: boolean;
}

/**
 * @name Controls/_popupCurtain/interface/ICurtainTemplate#position
 * @cfg {String} Определяет с какой стороны отображается попап.
 * @variant top
 * @variant bottom
 * @default bottom
 */

/**
 * @name Controls/_popupCurtain/interface/ICurtainTemplate#showControlButton
 * @cfg {boolean} Определяет показ контроллера для разворота шторки.
 * @default true
 */

/**
 * @name Controls/_popupCurtain/interface/ICurtainTemplate#bodyContentTemplate
 * @cfg {string|TemplateFunction} Пользовательский контент шторки.
 */
