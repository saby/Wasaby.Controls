import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/ItemPadding/ItemPadding"
import {Memory} from "Types/source";
import 'css!Controls-demo/Controls-demo';


export default class extends Control {
    protected _template: TemplateFunction = Template;

    private _viewSource: Memory;

    constructor() {
        super({});
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: [
                {id: 1, title: 'Notebooks'},
                {id: 2, title: 'Tablets'},
                {id: 3, title: 'Laptop computers'},
                {id: 4, title: 'Apple gadgets'},
                {id: 5, title: 'Android gadgets'}
            ]
        });
    }

}