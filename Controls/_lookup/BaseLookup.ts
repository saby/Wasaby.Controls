import {Control} from 'UI/Base';
import {RecordSet, List} from 'Types/collection';
import {default as LookupController, ILookupBaseControllerOptions, SelectedItems} from './BaseControllerClass';
import {SyntheticEvent} from 'Vdom/Vdom';
import {descriptor, Model} from 'Types/entity';
import {IStackPopupOptions} from 'Controls/_popup/interface/IStack';
import * as isEmpty from 'Core/helpers/Object/isEmpty';

type LookupReceivedState = RecordSet|null;

export default abstract class BaseLookup extends Control {
    protected _lookupController: LookupController;
    protected _items: SelectedItems;

    protected _beforeMount(
        options: ILookupBaseControllerOptions,
        context: object,
        receivedState: LookupReceivedState
    ): Promise<LookupReceivedState> | void {
        this._lookupController = new LookupController(options);

        if (receivedState && !isEmpty(receivedState)) {
            this._setItems(receivedState);
        } else if (options.selectedKeys.length) {
            return this._lookupController.loadItems().then((items) => {
                this._setItems(items);
                return items;
            });
        } else {
            this._items = this._lookupController.getItems();
        }
    }

    protected _beforeUpdate(newOptions: ILookupBaseControllerOptions): void {
        const updateResult = this._lookupController.update(newOptions);
        const updateResultCallback = () => {
            this._afterItemsChanged();
        };

        if (updateResult instanceof Promise) {
            updateResult.then((items) => {
                this._lookupController.setItems(items);
                updateResultCallback();
            });
        } else if (updateResult) {
            updateResultCallback();
        }
    }

    protected _updateItemsHandler(event: SyntheticEvent|null, items: RecordSet|List<Model>): void {
        this._updateItems(items);
    }

    protected _updateItems(items: RecordSet|List<Model>): void {
        this._lookupController.setItems(items);
        this._afterItemsChanged();
    }

    protected _addItemHandler(event: SyntheticEvent, item: Model): void {
        this._addItem(item);
    }

    protected _addItem(item: Model): void {
        if (this._lookupController.addItem(item)) {
            this._afterItemsChanged();
        }
    }

    protected _removeItemHandler(event: SyntheticEvent, item: Model): void {
        this._removeItem(item);
    }

    protected _removeItem(item: Model): void {
        if (this._lookupController.removeItem(item)) {
            this._afterItemsChanged();
        }
    }

    protected _showSelectorHandler(event: SyntheticEvent, popupOptions?: IStackPopupOptions): void|boolean {
        return this._showSelector(popupOptions);
    }

    protected _showSelector(popupOptions?: IStackPopupOptions): void|boolean {
        if (this._notify('showSelector') !== false) {
            return this.showSelector(popupOptions);
        }

        return false;
    }

    protected _closeHandler(): void {
        this.activate();
    }

    protected _selectCallback(event: SyntheticEvent, result: SelectedItems): void {
        const selectResult =
            this._notify('selectorCallback', [this._lookupController.getItems(), result]) ||
            result;
        this._lookupController.setItemsAndSaveToHistory(selectResult);
        this._afterItemsChanged();
        if (this._options.value) {
            this._notify('valueChanged', ['']);
        }
    }

    abstract showSelector(popupOptions?: IStackPopupOptions): void;

    private _afterItemsChanged(): void {
        this._items = this._lookupController.getItems();
        this._notifyChanges();
    }

    private _setItems(items: SelectedItems): void {
        this._items = items;
        this._lookupController.setItems(items);
    }

    private _notifyChanges(): void {
        const controller = this._lookupController;
        this._notify('selectedKeysChanged', [controller.getSelectedKeys()]);
        this._notify('itemsChanged', [controller.getItems()]);
        this._notify('textValueChanged', [controller.getTextValue()]);
    }

    static _theme: string[] = ['Controls/toggle', 'Controls/Classes'];

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
