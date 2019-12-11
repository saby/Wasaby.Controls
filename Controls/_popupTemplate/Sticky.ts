import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_popupTemplate/Sticky/Sticky');
import {Controller as ManagerController} from 'Controls/popup';
import {default as IPopupTemplate, IPopupTemplateOptions} from "./interface/IPopupTemplate";

/**
 * @class Controls/_popupTemplate/Sticky
 * @extends Core/Control
 * @control
 * @public
 * @category Popup
 * @author Красильников А.С.
 * @implements Controls/_popupTemplate/interface/IPopupTemplate
 */

class StickyTemplate extends Control implements IControlOptions, IPopupTemplateOptions {
    protected _template: TemplateFunction = template;
    protected _headerTheme: string;

    protected _beforeMount(options): void {
        this._prepareTheme();
    }

    protected _beforeUpdate(options): void {
        this._prepareTheme();
    }

    protected close(): void {
        this._notify('close', [], {bubbling: true});
    }

    private _prepareTheme(): void {
        this._headerTheme = ManagerController.getPopupHeaderTheme();
    }

    static _theme: string[] = ['Controls/popupTemplate'];

    static getDefaultOptions() {
        return {
            closeButtonVisibility: true,
            closeButtonViewMode: 'link'
        };
    }
}

export default StickyTemplate;
