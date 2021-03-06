import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/Explorer_new/EditArrowWithLongFolderName/EditArrowWithLongFolderName';
import {DataWithLongFolderName} from '../DataHelpers/DataCatalog';
import * as MemorySource from 'Controls-demo/Explorer/ExplorerMemory';
import {IColumn} from 'Controls/grid';
import {TRoot} from 'Controls-demo/types';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: MemorySource;
    protected _columns: IColumn[] = DataWithLongFolderName.getColumns();
    protected _root: TRoot = null;

    protected _beforeMount(): void {
        this._viewSource = new MemorySource({
            keyProperty: 'id',
            data: DataWithLongFolderName.getData()
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
