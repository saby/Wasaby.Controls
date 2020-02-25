import {Control, TemplateFunction} from "UI/Base"
import * as Template from "wml!Controls-demo/grid/EditInPlace/Validation/Validation"
import {Memory} from "Types/source"
import {getEditing} from "../../DemoHelpers/DataCatalog"
import 'wml!Controls-demo/grid/EditInPlace/Validation/_cellEditor';
import 'wml!Controls-demo/grid/EditInPlace/Validation/_cellEditorDate';
import 'wml!Controls-demo/grid/EditInPlace/Validation/_cellEditorRequired';
import LengthChecker = require('Controls-demo/grid/EditInPlace/Validation/Custom');

import 'css!Controls-demo/Controls-demo'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _columns = getEditing().getEditingColumnsValidation();
    private _header = getEditing().getEditingHeaderValidations();
    protected _markedKey;
    protected _dataLoadCallback = this._dataCallback.bind(this);
    protected _items;
    private _showType = {
        //show only in Menu
        MENU: 0,
        //show in Menu and Toolbar
        MENU_TOOLBAR: 1,
        //show only in Toolbar
        TOOLBAR: 2
    };
    protected _itemActions = [{
        id: 1,
        icon: 'icon-Erase icon-error',
        title: 'delete',
        style: 'bordered',
        showType: this._showType.MENU_TOOLBAR
    }]

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getEditing().getEditingValidationData()
        });
    }

    private _dataCallback(items) {
        this._items = items;
    }

}

export {
    LengthChecker
}
