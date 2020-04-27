import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/ColumnsView/ColumnsView';
import 'css!Controls-demo/Controls-demo';

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;
}
