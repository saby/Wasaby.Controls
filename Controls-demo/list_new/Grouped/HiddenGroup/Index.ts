import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import {Memory} from 'Types/source';
import {groupConstants} from 'Controls/list';
import * as Template from 'wml!Controls-demo/list_new/Grouped/HiddenGroup/HiddenGroup';

function getData(): Array<{
    id: number
    title: string
    brand?: string
}> {
    return [
        {
            id: 1,
            title: 'WebCam X541SA-XO056D',
            brand: groupConstants.hiddenGroup
        },
        {
            id: 2,
            title: 'MacBook Pro',
            brand: 'apple'
        },
        {
            id: 3,
            title: 'ASUS X751SA-TY124D',
            brand: 'asus'
        },
        {
            id: 4,
            title: 'HP 250 G5 (W4N28EA)',
            brand: 'hp'
        },
        {
            id: 5,
            title: 'Apple iPad Pro 2016',
            brand: 'apple'
        },
        {
            id: 6,
            title: 'KeyBoard 5RTX-zxs',
            brand: 'unknown'
        },
        {
            id: 7,
            title: 'MagicMouse 2',
            brand: groupConstants.hiddenGroup
        },
        {
            id: 8,
            title: 'iPhone X Max',
            brand: 'apple'
        },
        {
            id: 9,
            title: 'ASUS Zenbook F-234',
            brand: 'asus'
        }
    ];
}

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getData()
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
