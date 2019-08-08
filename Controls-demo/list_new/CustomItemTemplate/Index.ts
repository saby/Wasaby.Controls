import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/list_new/CustomItemTemplate/CustomItemTemplate"
import {Memory} from "Types/source"
import 'wml!Controls-demo/list_new/CustomItemTemplate/itemTemplate'
import 'wml!Controls-demo/list_new/CustomItemTemplate/noHighlightTemplate'
import 'css!Controls-demo/Controls-demo'


export default class extends Control {
    protected _template: TemplateFunction = Template;

    private _viewSource: Memory;

    constructor() {
        super({});
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: 1,
                    title: 'Notebooks',
                    description: 'Trusted Reviews ranks all your top laptop and notebook options, whether you want a ...',
                    tplPath: 'wml!Controls-demo/list_new/CustomItemTemplate/noHighlightTemplate'
                },
                {
                    id: 2,
                    title: 'Tablets',
                    description: 'Tablets are great for playing games, reading, homework, keeping kids entertained in the back seat of the car'
                },
                {
                    id: 3,
                    title: 'Laptop computers',
                    description: 'Explore PCs and laptops to discover the right device that powers all that you do',
                    tplPath: 'wml!Controls-demo/list_new/CustomItemTemplate/itemTemplate'
                },
                {
                    id: 4,
                    title: 'Apple gadgets',
                    description: 'Explore new Apple accessories for a range of Apple products',
                    tplPath: 'wml!Controls-demo/list_new/CustomItemTemplate/noHighlightTemplate'
                },
                {
                    id: 5,
                    title: 'Android gadgets',
                    description: 'These 25 clever phone accessories and Android-compatible gadgets',
                    tplPath: 'wml!Controls-demo/list_new/CustomItemTemplate/itemTemplate'
                }
            ]
        });
    }

}