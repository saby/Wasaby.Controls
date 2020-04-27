import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/MarkupTest/MarkupTest');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/LoadingIndicator/MarkupTest/MarkupTest';

class MarkupTest extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    static _theme: string[] = ['Controls/Classes'];
}
export default MarkupTest;