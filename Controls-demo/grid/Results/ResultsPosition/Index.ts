import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/Results/ResultsPosition/ResultsPosition"
import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
}