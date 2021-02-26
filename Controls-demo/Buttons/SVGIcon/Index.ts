import {TemplateFunction, IControlOptions, Control} from 'UI/Base';
import * as template from 'wml!Controls-demo/Buttons/SVGIcon/SVGIcon';

export default class IconDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
