import {Control, TemplateFunction} from 'UI/Base';
import {Memory} from 'Types/source';
import 'css!Controls-demo/Controls-demo';

import {getTasks} from '../../DemoHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/grid/Ladder/Basic/Basic';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _ladderProperties: string[] = ['photo', 'date'];

    protected _beforeMount(options?: {}, contexts?: object, receivedState?: void): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getTasks().getData()
        });
    }

}
