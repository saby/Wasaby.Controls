import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/dataSource/List/EditTemplate';
import FakeSource from './FakeSource';
import {IBLResponse} from './List';

export default class extends Control<IBLResponse> {
    _template: TemplateFunction = template;
    _source: FakeSource = new FakeSource();

    protected _beforeMount(options?: IBLResponse): void {
        this._source.setResult(options.statusCode);
    }
}
