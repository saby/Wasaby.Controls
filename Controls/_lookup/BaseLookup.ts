import {Control} from 'UI/Base';
import {RecordSet} from 'Types/collection';
import {default as LookupController} from './BaseControllerClass';
import {SyntheticEvent} from 'Vdom/Vdom';
import {descriptor, Model} from 'Types/entity';
import {IStackPopupOptions} from 'Controls/_popup/interface/IStack';
import * as isEmpty from 'Core/helpers/Object/isEmpty';

export default abstract class BaseLookup extends Control {
    protected _lookupController: LookupController;

    protected _beforeMount(options, receivedState: void|RecordSet): void|Promise<RecordSet> {
        this._lookupController = new LookupController(options);

        if (receivedState && !isEmpty(receivedState)) {
            this._lookupController.setItems(receivedState);
        } else {
            return this._lookupController.loadItems();
        }
    }

    protected _beforeUpdate(newOptions): void {
        const updateResult = this._lookupController.update(newOptions);
        const updateResultCallback = () => {
            this._notifyChanges();
        };

        if (updateResult instanceof Promise) {
            updateResult.then(() => {
                updateResultCallback();
            });
        } else if (updateResult) {
            updateResultCallback();
        }
    }

    protected _updateItems(event: SyntheticEvent, items: RecordSet): void {
        this._lookupController.setItems(items);
        this._notifyChanges();
    }

    protected _addItems(event: SyntheticEvent, item: Model): void {
        if (this._lookupController.addItem(item)) {
            this._notifyChanges();
        }
    }

    protected _removeItem(event: SyntheticEvent, item: Model): void {
        if (this._lookupController.removeItem(item)) {
            this._notifyChanges();
        }
    }

    protected _showSelector(event: SyntheticEvent, popupOptions: IStackPopupOptions): void|boolean {
        if (this._notify('showSelector') !== false) {
            return this.showSelector(popupOptions);
        }

        return false;
    }

    protected _closeHandler(): void {
        this.activate();
    }

    protected _selectCallback(event: SyntheticEvent, result): void {
        const selectResult =
            this._notify('selectorCallback', [this._lookupController.getItems(), result]) ||
            result;
        this._lookupController.setItemsAndSaveToHistory(selectResult);
        this._notifyChanges();
        if (this._options.value) {
            this._notify('valueChanged', ['']);
        }
    }

    abstract showSelector(popupOptions: IStackPopupOptions): void;

    private _notifyChanges(): void {
        const controller = this._lookupController;
        this._notify('selectedKeysChanged', [controller.getSelectedKeys()]);
        this._notify('itemsChanged', [controller.getItems()]);
        this._notify('textValueChanged', [controller.getTextValue()]);
    }

    static getDefaultOptions(): object {
        return {
            selectedKeys: [],
            multiSelect: false
        };
    }

    static getOptionTypes(): object {
        return {
            multiSelect: descriptor(Boolean)
        };
    }
}
