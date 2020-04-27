import {Control, TemplateFunction} from "UI/Base";
import * as controlTemplate from 'wml!Controls-demo/ReportDialog/OperationsSuccess/OperationsSuccess';
import 'css!Controls-demo/Controls-demo';

export default class extends Control{
   protected _template: TemplateFunction = controlTemplate;
}