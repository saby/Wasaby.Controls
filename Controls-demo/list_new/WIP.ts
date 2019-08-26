import {Control, IControlOptions, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/WIPPlaceholder/WIPPlaceholder"
import {cookie} from "Env/Env"
import 'css!Controls-demo/Controls-demo'

export interface IWIPOptions extends IControlOptions {
    byTask?: string
    afterSolve?: string
}

export default class extends Control<IWIPOptions> {
    protected _template: TemplateFunction = Template;
    private _canShowTask: boolean = false;

    constructor(cfg: IWIPOptions){
        super(cfg);
        this._canShowTask = cookie.get('s3debug') === 'true';
    }
}