import {Control, IControlOptions} from 'UI/Base';
import {RecordSet, List} from 'Types/collection';
import {default as LookupController, ILookupBaseControllerOptions, SelectedItems} from './BaseControllerClass';
import {SyntheticEvent} from 'Vdom/Vdom';
import {descriptor, Model} from 'Types/entity';
import {IStackPopupOptions} from 'Controls/_popup/interface/IStack';
// @ts-ignore
import * as isEmpty from 'Core/helpers/Object/isEmpty';
import * as Clone from 'Core/core-clone';
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';

type LookupReceivedState = SelectedItems|null;

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

    protected _beforeUpdate(newOptions: ILookupOptions): Promise<SelectedItems>|void|boolean {
        const oldSelectedkeys = Clone(this._lookupController.getSelectedKeys());
        const updateResult = this._lookupController.update(newOptions);
        const updateResultCallback = () => {
            this._afterItemsChanged(oldSelectedkeys);
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
        return updateResult;
    }

    protected _updateItems(items: RecordSet|List<Model>): void {
        const oldSelectedkeys = Clone(this._lookupController.getSelectedKeys());
        this._lookupController.setItems(items);
        this._afterItemsChanged(oldSelectedkeys);
    }

    protected _addItem(item: Model): void {
        const oldSelectedkeys = Clone(this._lookupController.getSelectedKeys());
        if (this._lookupController.addItem(item)) {
            this._afterItemsChanged(oldSelectedkeys);
        }
    }

    protected _removeItem(item: Model): void {
        const oldSelectedkeys = Clone(this._lookupController.getSelectedKeys());
        if (this._lookupController.removeItem(item)) {
            this._afterItemsChanged(oldSelectedkeys);
        }
    }

    protected _showSelector(event: SyntheticEvent, popupOptions?: IStackPopupOptions): void|boolean {
        if (this._notify('showSelector') !== false) {
            return this.showSelector(popupOptions);
        }

        return false;
    }

    protected _closeHandler(): void {
        this.activate();
    }

    protected _selectCallback(event: SyntheticEvent, result: SelectedItems): void {
        const oldSelectedkeys = Clone(this._lookupController.getSelectedKeys());
        const selectResult =
            this._notify('selectorCallback', [this._lookupController.getItems(), result]) ||
            result;
        this._lookupController.setItemsAndSaveToHistory(selectResult as SelectedItems);
        this._afterItemsChanged(oldSelectedkeys);
        if (this._options.value) {
            this._notify('valueChanged', ['']);
        }
    }

    private _afterItemsChanged(oldSelectedkeys: string[]): void {
        this._itemsChanged(this._items = this._lookupController.getItems());
        this._notifyChanges(oldSelectedkeys);
    }

    private _setItems(items: SelectedItems): void {
        this._items = items;
        this._lookupController.setItems(items);
    }

    private _notifyChanges(oldSelectedkeys: string[]): void {
        const controller = this._lookupController;
        const newSelectedkeys = controller.getSelectedKeys();
        const selectedKeysDiff = ArrayUtil.getArrayDifference(oldSelectedkeys, newSelectedkeys);
        this._notify('selectedKeysChanged', [newSelectedkeys, selectedKeysDiff.added, selectedKeysDiff.removed]);
        this._notify('itemsChanged', [controller.getItems()]);
        this._notify('textValueChanged', [controller.getTextValue()]);
    }

    abstract showSelector(popupOptions?: IStackPopupOptions): void;

    protected abstract _inheritorBeforeMount(options: ILookupOptions): void;

    protected abstract _inheritorBeforeUpdate(options: ILookupOptions): void;

    protected abstract _itemsChanged(items: SelectedItems): void;

    static _theme: string[] = ['Controls/lookup', 'Controls/Classes'];

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
