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

import {IPopupTemplateBaseOptions} from 'Controls/_popupTemplate/interface/IPopupTemplateBase';
export interface IPopupTemplateOptions extends IPopupTemplateBaseOptions {
    headingCaption?: string;
    headingStyle?: string;
    headingSize?: string;
    closeButtonViewMode?: string;
    closeButtonTransparent?: boolean;
}

export default interface IPopupTemplate {
    readonly '[Controls/_popupTemplate/interface/IPopupTemplate]': boolean;
}

