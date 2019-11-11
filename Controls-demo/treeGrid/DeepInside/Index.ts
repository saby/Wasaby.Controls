import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGrid/DeepInside/DeepInside';
import {Memory} from 'Types/source';
import {DeepInside} from '../DemoHelpers/DataCatalog';

import 'css!Controls-demo/Controls-demo';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _columns = DeepInside.getColumns();

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: DeepInside.getData()
        });
    }
}
