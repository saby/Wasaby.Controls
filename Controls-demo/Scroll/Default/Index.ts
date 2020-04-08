import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/Default/Template');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/Scroll/Default/Style';

export default class DefaultScrollDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    static _theme: string[] = ['Controls/Classes'];
}
