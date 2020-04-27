import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/Navigation/Direction/Direction"
import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
}