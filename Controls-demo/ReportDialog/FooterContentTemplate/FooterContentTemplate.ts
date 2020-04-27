import {Control, TemplateFunction} from "UI/Base";
import * as controlTemplate from 'wml!Controls-demo/ReportDialog/FooterContentTemplate/FooterContentTemplate';
import 'css!Controls-demo/ReportDialog/Index';
import 'css!Controls-demo/Controls-demo';

export default class extends Control {
   protected _template: TemplateFunction = controlTemplate;
}