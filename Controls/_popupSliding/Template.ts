import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_popupSliding/Template/Template';
import {ISlidingPanelTemplateOptions} from 'Controls/_popupSliding/interface/ISlidingPanelTemplate';
import { detection } from 'Env/Env';

const MOBILE_TEMPLATE = 'Controls/popupSliding:_SlidingPanelTemplate';
const DESKTOP_TEMPLATE = 'Controls/popupTemplate:Stack';

/**
 * Интерфейс для шаблона попапа-шторки.
 *
 * @interface Controls/_popupSliding/Template
 * @implements Controls/_interface/IContrastBackground
 * @public
 * @author Красильников А.С.
 */
export default class Template extends Control<ISlidingPanelTemplateOptions> {
    protected _template: TemplateFunction = template;
    protected _popupTemplateName: string;
    protected _beforeMount(): void {
        this._popupTemplateName = this._getTemplateName(detection.isPhone);
    }
    protected _getTemplateName(isPhone: boolean): string {
        return isPhone ? MOBILE_TEMPLATE : DESKTOP_TEMPLATE;
    }
}
