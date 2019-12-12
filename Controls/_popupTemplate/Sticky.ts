import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_popupTemplate/Sticky/Sticky');
import {Controller as ManagerController} from 'Controls/popup';
import {default as IPopupTemplateBase, IPopupTemplateBaseOptions} from "./interface/IPopupTemplateBase";

/**
 * @class Controls/_popupTemplate/Sticky
 * @extends Core/Control
 * @control
 * @public
 * @category Popup
 * @author Красильников А.С.
 * @implements Controls/_popupTemplate/interface/IPopupTemplate
 */

class StickyTemplate extends Control<IPopupTemplateBaseOptions> implements IPopupTemplateBase {
    protected _template: TemplateFunction = template;
    protected _headerTheme: string;

    protected _beforeMount(options: IPopupTemplateBaseOptions): void {
        this._headerTheme = this._getTheme();
    }

    protected _beforeUpdate(options: IPopupTemplateBaseOptions): void {
        this._headerTheme = this._getTheme();
    }

    protected close(): void {
        this._notify('close', [], {bubbling: true});
    }

    private _getTheme(): string {
        return ManagerController.getPopupHeaderTheme();
    }

    static _theme: string[] = ['Controls/popupTemplate'];

    static getDefaultOptions(): IPopupTemplateBaseOptions {
        return {
            closeButtonVisibility: true
        };
    }
}

export default StickyTemplate;
