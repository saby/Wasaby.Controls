import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Spoiler/View/View');
import 'css!Controls-demo/Controls-demo';
import headerTemplate = require('wml!Controls-demo/Spoiler/View/headerContentTemplate/headerContentTemplate');

class View extends Control<IControlOptions> {
    protected _expanded: boolean = true;
    protected _headerTemplate: TemplateFunction = headerTemplate;

    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
}
export default View;
