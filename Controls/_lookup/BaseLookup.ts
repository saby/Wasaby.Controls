import {Control, IControlOptions} from 'UI/Base';
import {RecordSet, List} from 'Types/collection';
import {default as LookupController, ILookupBaseControllerOptions, SelectedItems} from './BaseControllerClass';
import {SyntheticEvent} from 'Vdom/Vdom';
import {descriptor, Model} from 'Types/entity';
import {IStackPopupOptions} from 'Controls/_popup/interface/IStack';
// @ts-ignore
import * as isEmpty from 'Core/helpers/Object/isEmpty';

type LookupReceivedState = RecordSet|null;

export interface ILookupOptions extends ILookupBaseControllerOptions, IControlOptions {
    maxVisibleItems?: number;
    items?: RecordSet;
}

export default abstract class
    BaseLookup<T extends ILookupOptions> extends Control<T, LookupReceivedState> {
    protected _lookupController: LookupController;
    protected _items: SelectedItems;

    protected _beforeMount(
        options: ILookupOptions,
        context: object,
        receivedState: LookupReceivedState
    ): Promise<LookupReceivedState> | void {
        this._lookupController = new LookupController(options);

        if (receivedState && !isEmpty(receivedState)) {
            this._setItems(receivedState);
            this._inheritorBeforeMount(options);
        } else if (options.selectedKeys.length && options.source) {
            return this._lookupController.loadItems().then((items) => {
                this._setItems(items);
                this._inheritorBeforeMount(options);
                return items;
            });
        } else if (options.items) {
            this._setItems(options.items);
            this._inheritorBeforeMount(options);
        } else {
            this._items = this._lookupController.getItems();
            this._inheritorBeforeMount(options);
        }
    }

    protected _beforeUpdate(newOptions: ILookupOptions): void {
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
        this._inheritorBeforeUpdate(newOptions);
    }

    protected _updateItems(items: RecordSet|List<Model>): void {
        this._lookupController.setItems(items);
        this._afterItemsChanged();
    }

    protected _addItem(item: Model): void {
        if (this._lookupController.addItem(item)) {
            this._afterItemsChanged();
        }
    }

    protected _removeItem(item: Model): void {
        if (this._lookupController.removeItem(item)) {
            this._afterItemsChanged();
        }
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
        this._lookupController.setItemsAndSaveToHistory(selectResult as SelectedItems);
        this._afterItemsChanged();
        if (this._options.value) {
            this._notify('valueChanged', ['']);
        }
    }

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

    abstract showSelector(popupOptions?: IStackPopupOptions): void;

    protected abstract _inheritorBeforeMount(options: ILookupOptions): void;

    protected abstract _inheritorBeforeUpdate(options: ILookupOptions): void;

    static _theme: string[] = ['Controls/toggle', 'Controls/Classes'];

    static getDefaultOptions(): object {
        return {
            selectedKeys: [],
            multiSelect: false,
            horizontalPadding: 'xs'
        };
    }

    static getOptionTypes(): object {
        return {
            multiSelect: descriptor(Boolean)
        };
    }
}
