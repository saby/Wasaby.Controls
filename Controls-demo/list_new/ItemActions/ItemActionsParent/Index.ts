import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemActions/ItemActionsParent/ItemActionsParent';
import {Memory} from 'Types/source';
import {getActionsWithParent as getItemActions} from '../../DemoHelpers/ItemActionsCatalog';
import { IItemAction } from 'Controls/itemActions';
import {getContactsCatalog} from '../../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemActionsTrue: IItemAction[];
    protected _itemActionsFalse: IItemAction[];
    protected _itemActionsNull: IItemAction[];

    protected _beforeMount(): void {
        this._itemActionsTrue = getItemActions(true);
        this._itemActionsFalse = getItemActions(false);
        this._itemActionsNull = getItemActions(null);
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getContactsCatalog()
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
