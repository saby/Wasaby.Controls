import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_popupSliding/Template/Desktop/Desktop';
import {ISlidingPanelTemplateOptions} from 'Controls/_popupSliding/interface/ISlidingPanelTemplate';

/**
 * Интерфейс для шаблона попапа-шторки.
 *
 * @interface Controls/_popupSliding/Template/Desktop
 * @public
 * @author Красильников А.С.
 */
export default class Template extends Control<ISlidingPanelTemplateOptions> {
    protected _template: TemplateFunction = template;
    protected _dialogTemplate: string = 'Controls/popupTemplate:Stack';
}
