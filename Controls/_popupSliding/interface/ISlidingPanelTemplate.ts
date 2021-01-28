import {TemplateFunction, IControlOptions} from 'UI/Base';
import {ISlidingPanelPosition} from 'Controls/popup';

export interface ISlidingPanelTemplateOptions extends IControlOptions {
    contrastBackground: boolean;
    controlButtonVisibility: boolean;
    bodyContentTemplate?: string | TemplateFunction;
    slidingPanelPosition: ISlidingPanelPosition;
    closeButtonVisibility?: boolean;
}

/**
 * Интерфейс для шаблона попапа-шторки.
 *
 * @interface Controls/_popupSliding/interface/ISlidingPanelTemplate
 * @implements Controls/_interface/IContrastBackground
 * @public
 * @author Красильников А.С.
 */
export interface ISlidingPanelTemplate {
    readonly '[Controls/_popupSliding/interface/ISlidingPanelTemplate]'?: boolean;
}

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#controlButtonVisibility
 * @cfg {boolean} Определяет показ контроллера для разворота шторки.
 * @default true
 */

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#bodyContentTemplate
 * @cfg {string|TemplateFunction} Пользовательский контент шторки.
 */

/**
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#closeButtonVisibility
 * @cfg {Boolean} Определяет, будет ли отображаться кнопка закрытия.
 */
