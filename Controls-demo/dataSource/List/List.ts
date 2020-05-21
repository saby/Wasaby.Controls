import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
// import { constants } from 'Env/Env';
import FakeSource from './FakeSource';
import { Memory } from 'Types/source';
import * as template from 'wml!Controls-demo/dataSource/List/List';
import 'css!Controls-demo/dataSource/List/style';
// import { isInit as AppIsInit } from 'Application/Initializer';
import { location as appEnvLocation } from 'Application/Env';
import { Edit } from 'Controls/popup';
import { View } from 'Controls/list';

export interface IBLResponse extends IControlOptions {
    statusCode: string;
}

export default class TestListControl extends Control<IControlOptions, IBLResponse> {
    _template: TemplateFunction = template;
    _fsource: FakeSource = new FakeSource();
    selectedCode: string = '200';
    code: Memory = new Memory({
        keyProperty: 'title',
        data: [
            { title: '200' },
            // { title: '401' },
            { title: '403' },
            { title: '404' },
            { title: '500' },
            { title: '502' },
            { title: '503' },
            { title: '504' },
            { title: 'Connection_Error' }
        ]
    });
    // @ts-ignore
    _children: {
        editOpener: Edit,
        listControl: View
    };

    _beforeMount(options: IBLResponse, _: any, state?: IBLResponse): Promise<IBLResponse> {
        this.selectedCode = state && state.statusCode ||
            options && options.statusCode ||
            getLocationParam().statusCode || '200';

        this._fsource.setResult(this.selectedCode);
        return Promise.resolve({ statusCode: this.selectedCode });
    }

    select200(): void {
        this.selectedCode = '200';
    }

    reloadList(): void {
        if (this._children && this._children.editOpener && this._children.editOpener.isOpened()) {
            this._children.editOpener.close();
        }
        this._fsource.setResult(this.selectedCode);
        // @ts-ignore
        this._children.listControl.reload();
    }

    _itemClickHandler(_event: Event, record: any): void {
        const statusCode = this.selectedCode || 200;
        const key = record.getId();
        if (this._children.editOpener.isOpened()) {
            this._children.editOpener.close();
        }
        this._children.editOpener.open({ key }, {
            template: 'Controls-demo/dataSource/List/EditTemplate',
            templateOptions: { id: key, statusCode }
        });
    }
}

function getLocationParam(): Partial<IBLResponse> {
    const envLocation = window === undefined
        ? appEnvLocation
        : window.location;

    if (!envLocation) {
        return {};
    }

    const search = (envLocation.search || '').replace('?', '');
    const result = {};
    search.split('&').forEach((param) => {
        const [key, value]: string[] = param.split('=');
        result[key] = value;
    });
    return result;
}
