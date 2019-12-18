import {Control, TemplateFunction} from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/ReportDialog/Title/Title';
import 'css!Controls-demo/Controls-demo';

export default class extends Control {
   protected _template: TemplateFunction = controlTemplate;
}
