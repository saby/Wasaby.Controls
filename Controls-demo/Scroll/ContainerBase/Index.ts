import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/ContainerBase/Template');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/Scroll/ContainerBase/Style';

export default class ContainerBaseDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    scrollStateChangedHandler(e): void {
        console.log('scrollStateChangedHandler');
    }

    static _theme: string[] = ['Controls/Classes'];
}
