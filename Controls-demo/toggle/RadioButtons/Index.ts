import {Control, TemplateFunction} from "UI/Base";
import * as Template from "wml!Controls-demo/toggle/RadioButtons/RadioButtons";

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _captions: string[] = ['название1', 'название2'];

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
