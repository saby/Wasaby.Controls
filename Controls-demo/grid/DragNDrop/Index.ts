import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/grid/DragNDrop/DragNDrop';
import * as ListEntity from 'Controls-demo/DragNDrop/ListEntity';
import {Memory} from 'Types/source';
import {DragNDrop} from '../DemoHelpers/DataCatalog';

import 'css!Controls-demo/Controls-demo';


export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _columns = DragNDrop().columns;
    private _selectedKeys = [];

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: DragNDrop().data,
        });
    }

    private _dragStart(_, items) {
        return new ListEntity({
            items: items
        });
    },
    private _dragEnd(_, entity, target, position) {
        this._children.listMover.moveItems(entity.getItems(), target, position);
    }

}
