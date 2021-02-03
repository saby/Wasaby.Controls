import {TemplateFunction, IControlOptions} from 'UI/Base';
import {ISlidingPanelData} from 'Controls/popup';

export interface ISlidingPanelTemplateOptions extends IControlOptions {
    controlButtonVisibility: boolean;
    bodyContentTemplate?: string | TemplateFunction;
    slidingPanelData: ISlidingPanelData;
}

/**
 * Интерфейс для шаблона попапа-шторки.
 *
 * @interface Controls/_popupSliding/interface/ISlidingPanelTemplate
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
 * @name Controls/_popupSliding/interface/ISlidingPanelTemplate#slidingPanelData
 * @cfg {object} Содержит сведения о позиционировании шторки.
 * @remark
 * При открытии шторки с помощью {@link Controls/popup:SlidingPanelOpener}, в шаблон передаётся значение для опции slidingPanelData.
 * Его рекомендуется использовать для конфигурации Controls/popupSliding:Template, что и показано в следующем примере.
 * <pre>
 * <Controls.popupSliding:Template slidingPanelData="{{_options.slidingPanelData}}" />
 * </pre>
 * Значение опции задавать вручную не нужно.
 */
