import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/dataSource/List/FormControllerContent';

export default class extends Control {
    _template: TemplateFunction = template;
}
