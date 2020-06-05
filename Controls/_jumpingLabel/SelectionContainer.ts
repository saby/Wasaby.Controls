import Base, {IBaseOptions} from './Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import {TemplateFunction} from 'UI/Base';
import {ISingleSelectable, ISingleSelectableOptions, IMultiSelectable, IMultiSelectableOptions} from 'Controls/interface';

// tslint:disable-next-line:ban-ts-ignore
// @ts-ignore
import * as template from 'wml!Controls/_jumpingLabel/SelectionContainer/SelectionContainer';

export interface ISelectionContainerOptions extends IBaseOptions, ISingleSelectableOptions, IMultiSelectableOptions {}

class SelectionContainer extends Base<ISelectionContainerOptions> implements ISingleSelectable, IMultiSelectable {
    private _hasKeys: boolean = null;

    protected _template: TemplateFunction = template;

    readonly '[Controls/_interface/IMultiSelectable]': boolean = true;
    readonly '[Controls/_interface/ISingleSelectable]': boolean = true;

    protected _setShowFromAbove(options: ISelectionContainerOptions): void {
        if ('selectedKey' in options) {
            this._showFromAbove = true;
            return;
        }
        if ('selectedKeys' in options) {
            this._showFromAbove = Boolean(options.selectedKeys.length);
            return;
        }

        this._showFromAbove = false;
        return;
    }

    private _valueChangedHandler(event: SyntheticEvent, value: string): void {
        if (!this._hasKeys) {
            this._showFromAbove = Boolean(value);
        }
    }

    private _selectedChangedHandler(event: SyntheticEvent, keys: any[]): void {
        const hasKeys: boolean = Boolean(keys.length);
        this._hasKeys = hasKeys;
        this._showFromAbove = hasKeys;
    }
}

export default SelectionContainer;
