import {Control, TemplateFunction} from 'UI/Base';
import {ICrud} from 'Types/source';
import {SourceControl} from 'Controls/list';

import * as Template from 'wml!Controls-demo/List/ColumnsView/ColumnsView';
import {getListData, SourceFaker} from '../Utils/listDataGenerator';

const NUMBER_OF_ITEMS = 100;

const rawData = getListData(NUMBER_OF_ITEMS, {
    title: {
        type: 'string',
        value: 'title',
        addId: true
    }
});

/**
 * http://localhost:3000/Controls-demo/app/Controls-demo%2FList%2FRenderContainer%2FIndex
 * http://localhost:3000/Controls-demo/app/Controls-demo%2Flist%2FColumnsView%2FIndex
 */
export default class RenderColumnsViewContainerDemo extends Control {
    protected _template: TemplateFunction = Template;

    protected _children = {
        sourceControl: SourceControl
    };

    protected _itemsSource: ICrud;

    protected _itemActions: any[];

    protected _beforeMount(options?: {}, contexts?: object, receivedState?: void): Promise<void> | void {
        this._itemsSource = SourceFaker.instance({}, rawData, false);
        this._itemActions = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                style: 'success',
                iconStyle: 'success',
                showType: 0,
                handler: (item) => alert(`phone clicked at ${item.getId()}`)
            },
            {
                id: 2,
                icon: 'icon-Edit',
                title: 'fake',
                style: 'danger',
                iconStyle: 'danger',
                showType: 0
            }
        ];
    }
}
