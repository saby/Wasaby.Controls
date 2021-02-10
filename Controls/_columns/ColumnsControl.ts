import {TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import {ListControl} from 'Controls/list';
import Collection from 'Controls/_columns/display/Collection';
import ListControlTpl = require('wml!Controls/_columns/ColumnsControl');

export default class ColumnsControl extends ListControl {
    protected _template: TemplateFunction = ListControlTpl;
    private _keyDownHandler: Function;

    protected _beforeMount(): void {
        this._viewModelConstructor = Collection;
        this._keyDownHandler = this.keyDownHandler.bind(this);
    }
    protected keyDownHandler(e: SyntheticEvent<KeyboardEvent>): boolean {
        return this._children.innerView.keyDownHandler.call(this._children.innerView, e);
    }
}
