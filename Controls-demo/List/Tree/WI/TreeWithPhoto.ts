import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/List/Tree/WI/TreeWithPhoto/TreeWithPhoto';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}