import {Control, TemplateFunction} from 'UI/Base';
import {Memory} from 'Types/source';
import {Gadgets} from '../../DemoHelpers/DataCatalog';
import {getActionsForContacts as getItemActions} from '../../../list_new/DemoHelpers/ItemActionsCatalog';
import {IColumn} from 'Controls/_grid/interface/IColumn';
import {IItemAction} from 'Controls/itemActions';

import * as Template from 'wml!Controls-demo/treeGrid/ItemActions/CustomPosition/CustomPosition';
import * as CountryColumnTemplate from 'wml!Controls-demo/treeGrid/ItemActions/CustomPosition/CountryColumn';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = Gadgets.getColumnsWithFixedWidth().map((cur, i) => {
        if (cur.displayProperty === 'country') {
            cur.template = CountryColumnTemplate;
        }
        return cur;
    });
    protected _itemActions: IItemAction[] = getItemActions();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: Gadgets.getFlatData()
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
