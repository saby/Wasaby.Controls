/**
 * Интерфейс для стандартных шаблонов окон.
 *
 * @interface Controls/_popupTemplate/interface/IPopupTemplate
 * @public
 * @author Красильников А.С.
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#headingCaption
 * @cfg {String} Текст заголовка.
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#headingStyle
 * @cfg {String} Стиль отображения заголовка.
 * @variant secondary
 * @variant primary
 * @variant info
 * @default secondary
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#headingSize
 * @cfg {String} Размер заголовка
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @default l
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#headerContentTemplate
 * @cfg {function|String} Контент, располагающийся между заголовком и крестиком закрытия.
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#bodyContentTemplate
 * @cfg {function|String} Основной контент шаблона, располагается под headerContentTemplate.
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#footerContentTemplate
 * @cfg {function|String} Контент, располагающийся в нижней части шаблона.
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#closeButtonVisibility
 * @cfg {Boolean} Определяет, будет ли отображаться кнопка закрытия
 * @default true
 */
/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#closeButtonViewMode
 * @cfg {String} Стиль отображения кнопки закрытия
 * @variant toolButton
 * @variant link
 * @variant popup
 * @default popup
 */

/**
 * @name Controls/_popupTemplate/interface/IPopupTemplate#closeButtonTransparent
 * @cfg {Boolean} Определяет прозрачность фона кнопки закрытия.
 * @default true
 */
import {TemplateFunction} from 'UI/Base';
export interface IPopupTemplateOptions {
    headingCaption?: string;
    headingStyle?: string;
    headingSize?: string;
    headerContentTemplate?: TemplateFunction;
    bodyContentTemplate?: TemplateFunction;
    footerContentTemplate?: TemplateFunction;
    closeButtonVisibility?: boolean;
    closeButtonViewMode?: string;
    closeButtonTransparent?: boolean;
}

export default interface IPopupTemplate {
    readonly '[Controls/_popupTemplate/interface/IPopupTemplate]': boolean;
}

