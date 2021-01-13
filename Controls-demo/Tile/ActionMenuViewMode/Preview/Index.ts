import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Tile/ActionMenuViewMode/Preview/template';
import {Gadgets} from 'Controls-demo/Tile/DataHelpers/DataCatalog';
import {HierarchicalMemory} from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _currentItems: any[] = null;

    protected _beforeMount(): void {
        this._currentItems = Gadgets.getPreviewActionItems();
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: this._currentItems
        });
    }

    protected _imageUrlResolver(width: number, height: number, url: string): string {
        const [name, extension] = url.split('.');
        return `${name}${width}${height}.${extension}`;
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
