import {Control, TemplateFunction} from 'UI/Base';
import {StackOpener, ManagerClass} from 'Controls/popup';
import * as Template from 'wml!Controls-demo/Popup/Loader/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _stackOpener: StackOpener = new StackOpener();

    _openStack(): void {

        // Потому что в странице которая строит демки на WI не задал лоадер
        ManagerClass.prototype._dataLoaderModule = 'Controls-demo/DataLoader';

        this._stackOpener.open({
            template: 'Controls-demo/Popup/Loader/Template',
            width: 900,
            opener: this,
            dataLoaders: [[
                {
                    module: 'Controls-demo/Popup/Loader/Loaders/recordLoader',
                    params: { kek: true },
                    dependencies: [],
                    await: false
                },
                {
                    module: 'Controls-demo/Popup/Loader/Loaders/attachmentLoader'
                }
            ]],
            templateOptions: {
                loaders: {}
            },
            eventHandlers: {
                onClose: () => {
                    ManagerClass.prototype._dataLoaderModule = null;
                }
            }
        });

    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
