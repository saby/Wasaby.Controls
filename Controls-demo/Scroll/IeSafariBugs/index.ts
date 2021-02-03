import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/IeSafariBugs/Template');

export default class IntersectionObserverDemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _styles: string[] = ['Controls-demo/Controls-demo', 'Controls-demo/Scroll/IeSafariBugs/Styles'];
}