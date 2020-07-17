import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Filter_new/AdditionalParams/AdditionalParams';
import {getAdditionalTemplateItems} from '../resources/FilterItemsStorage';

export default class extends Control<IControlOptions, TemplateFunction[]> {
    protected _template: TemplateFunction = Template;
    protected _source: unknown[] = getAdditionalTemplateItems().filter((el: any) => !!el.additionalTemplate);
    static _styles: string[] = ['Controls-demo/Controls-demo'];
    static _theme: string[] = ['Controls/filterPopup'];

    private loadTemplates(): Promise<any> {
        const templates = this._source.map((el: any) => {
            return import(el.additionalTemplate);
        });
        return Promise.all(templates).then(() => {
            return null;
        });
    }

    protected _beforeMount(options: IControlOptions): Promise<TemplateFunction[]> {
        return this.loadTemplates();
    }
}
