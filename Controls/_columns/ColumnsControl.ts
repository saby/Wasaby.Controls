import {TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';

// todo change this to import {ListControl} from 'Controls/list';
import {default as ListControl} from 'Controls/_list/ListControl';

import ListControlTpl = require('wml!Controls/_columns/ColumnsControl');

export default class ColumnsControl extends ListControl {
    protected _template: TemplateFunction = ListControlTpl;
    private _keyDownHandler: Function;
    protected _afterMount(): void {
        this._keyDownHandler = this.keyDownHandler.bind(this);
    }
    protected keyDownHandler(e: SyntheticEvent<KeyboardEvent>): boolean {
        return this._children.innerView.keyDownHandler.call(this._children.innerView, e);
    }
}
