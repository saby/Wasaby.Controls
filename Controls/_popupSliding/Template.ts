import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_popupSliding/Template/Template';
import {ISlidingPanelTemplateOptions} from 'Controls/_popupSliding/interface/ISlidingPanelTemplate';
import {detection} from 'Env/Env';

export enum DESKTOP_MODE {
    STACK = 'stack',
    DIALOG = 'dialog'
}

const DESKTOP_TEMPLATE_BY_MODE = {
    [DESKTOP_MODE.DIALOG]: 'Controls/popupTemplate:Dialog',
    [DESKTOP_MODE.STACK]: 'Controls/popupTemplate:Stack'
};

const MOBILE_TEMPLATE = 'Controls/popupSliding:_SlidingPanel';

/**
 *  Базовый шаблон окна-шторки.
 * @class Controls/_popupSliding/Template
 * @implements Controls/_popupSliding/interface/ISlidingPanelTemplate
 * @public
 * @demo Controls-demo/PopupTemplate/SlidingPanel/Index
 * @author Красильников А.С.
 */
export default class Template extends Control<ISlidingPanelTemplateOptions> {
    protected _template: TemplateFunction = template;
    protected _adaptiveTemplateName: string = MOBILE_TEMPLATE;

    protected _beforeMount(options: ISlidingPanelTemplateOptions): void {
        this._adaptiveTemplateName = this._getDatapriveTemplate(options.slidingPanelData);
    }

    protected _beforeUpdate(options: ISlidingPanelTemplateOptions): void {
        if (options.slidingPanelData !== this._options.slidingPanelData) {
            this._adaptiveTemplateName = this._getDatapriveTemplate(options.slidingPanelData);
        }
    }

    private _getDatapriveTemplate(slidingPanelData: ISlidingPanelTemplateOptions['slidingPanelData']): string {
        return detection.isPhone ? MOBILE_TEMPLATE : DESKTOP_TEMPLATE_BY_MODE[slidingPanelData.desktopMode];
    }
}
