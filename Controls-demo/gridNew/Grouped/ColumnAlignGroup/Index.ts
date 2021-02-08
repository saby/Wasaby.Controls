import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';

import { getTasks } from '../../DemoHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/ColumnAlignGroup/ColumnAlignGroup';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = getTasks().getDefaultColumns().concat([
        {
            displayProperty: 'message',
            width: '200px',
            textOverflow: 'ellipsis'
        }
    ]);

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getTasks().getData()
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
