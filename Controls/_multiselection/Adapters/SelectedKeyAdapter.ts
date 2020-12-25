import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_multiselection/Adapters/SelectedKeyAdapter';
import {SyntheticEvent} from 'Vdom/Vdom';

class SelectedKeyAdapter extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _handleSelectedKeysChanged(event: SyntheticEvent, keys: number[]|string[], added: number[]|string[], deleted: number[]|string[]): void {
        event.stopPropagation();
        let selectedKeys;
        if (this._options.multiSelect) {
            selectedKeys = keys;
        } else {
            selectedKeys = [added[0] || deleted[0]];
        }
        this._notify('selectedKeysChanged', [selectedKeys], {bubbling: true});
    }
}
export default SelectedKeyAdapter;
