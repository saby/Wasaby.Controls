import {Control, TemplateFunction} from "UI/Base";
import * as Template from "wml!Controls-demo/Suggest_new/Index";
import 'css!Controls-demo/Controls-demo';

export default class extends Control {
   protected _template: TemplateFunction = Template;
}