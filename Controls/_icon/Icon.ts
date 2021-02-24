import {TemplateFunction, IControlOptions, Control} from 'UI/Base';
import * as template from 'wml!Controls/_icon/Icon';
import {IIconSize, IIconSizeOptions, IIconStyle, IIconStyleOptions, IIcon, IIconOptions} from 'Controls/interface';
import {getSVGIconURL} from 'Controls/Utils/getSVGIconURL';
import 'css!Controls/CommonClasses';

interface ISVGIconOptions extends IControlOptions, IIconStyleOptions, IIconSizeOptions, IIconOptions {}

export default class Icon extends Control<ISVGIconOptions> implements IIconStyle, IIconSize, IIcon {
    protected _template: TemplateFunction = template;
    protected _iconUrl: string = null;
    readonly '[Controls/_interface/IIconStyle]': boolean = true;
    readonly '[Controls/_interface/IIconSize]': boolean = true;
    readonly '[Controls/_interface/IIcon]': boolean = true;

    protected _beforeMount(options: IIconOptions): void {
        this._iconUrl = getSVGIconURL(options.icon);
    }

    protected _beforeUpdate(options: IIconOptions): void {
        if (options.icon !== this._options.icon) {
            this._iconUrl = getSVGIconURL(options.icon);
        }
    }
}
