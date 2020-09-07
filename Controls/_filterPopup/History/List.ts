import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {Collection} from 'Controls/display';
import * as Serializer from 'Core/Serializer';
import {HistoryUtils, IFilterItem} from 'Controls/filter';
import * as template from 'wml!Controls/_filterPopup/History/List';
import * as itemTemplate from 'wml!Controls/_filterPopup/History/resources/ItemTemplate';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Constants, FilterSource} from 'Controls/history';
import {object} from 'Types/util';
import {Model} from 'Types/entity';
import {factory} from 'Types/chain';
import {isEqual} from 'Types/object';
import {RecordSet} from 'Types/collection';
import {IItemAction, TItemActionShowType} from 'Controls/itemActions';

interface IEditDialogOptions {
    items: RecordSet;
    editedTextValue: string;
    isClient: boolean;
    isFavorite: boolean;
}
export interface IHistoryListOptions extends IControlOptions {
    items: RecordSet;
    saveMode: 'pinned' | 'favorite';
    filterItems: IFilterItem[];
    orientation: string;
    historyId: string;
}

const MAX_NUMBER_ITEMS = 5;

export default class HistoryList extends Control<IHistoryListOptions> {
    protected _template: TemplateFunction = template;
    protected _itemTemplate: TemplateFunction = itemTemplate;
    protected _collection: Collection<Record<string, any>> = null;
    protected _keyProperty: string = null;
    protected _historyCount: number = null;
    protected _arrowVisible: boolean = false;
    protected _isMaxHeight: boolean = false;
    protected _editItem: Model = null;
    protected _itemsText: Record<string, string> = null;
    protected _itemActions: IItemAction[] = null;

    protected _getItemActions(saveMode: string): IItemAction[] {
        return [{
            id: 0,
            icon: saveMode === 'favorite' ? 'icon-Favorite' : 'icon-PinNull',
            iconStyle: 'info',
            showType: TItemActionShowType.TOOLBAR
        }];
    }

    protected _getCollection(items: RecordSet, keyProperty: string): Collection<Record<string, any>> {
        return new Collection({
            keyProperty,
            collection: items
        });
    }

    protected _getSource(historyId: string): FilterSource {
        return HistoryUtils.getHistorySource({ historyId });
    }

    protected _getHistoryCount(saveMode: string): number {
        return saveMode === 'pinned' ? Constants.MAX_HISTORY : Constants.MAX_HISTORY_REPORTS;
    }

    protected _mapByField(items: IFilterItem[], field: string): Record<string, any> {
        const result = {};
        let value;

        factory(items).each((item) => {
            value = object.getPropertyValue(item, field);

            if (value !== undefined) {
                result[item[this._keyProperty]] = object.getPropertyValue(item, field);
            }
        });

        return result;
    }

    protected _setObjectData(editItem: Model, data: Record<string, any>): void {
        editItem.set('ObjectData', JSON.stringify(data, new Serializer().serialize));
    }

    protected _getStringHistoryFromItems(items: IFilterItem[], resetValues: Record<string, any>): string {
        const textArr = [];
        factory(items).each((elem: IFilterItem): void => {
            const value = object.getPropertyValue(elem, 'value');
            const resetValue = resetValues[elem[this._keyProperty]];
            const textValue = object.getPropertyValue(elem, 'textValue');
            const visibility = object.getPropertyValue(elem, 'visibility');

            if (!isEqual(value, resetValue) && (visibility === undefined || visibility) && textValue) {
                textArr.push(textValue);
            }
        });
        return textArr.join(', ');
    }
    // TODO удалить после перевода всех на name;
    protected _getKeyProperty(items: RecordSet): string {
        const firstItem = factory(items).first();
        return firstItem.hasOwnProperty('id') ? 'id' : 'name';
    }

    private _onResize(): void {
        if (this._options.orientation === 'vertical') {
            const arrowVisibility = this._arrowVisible;
            this._arrowVisible = this._options.items.getCount() > MAX_NUMBER_ITEMS;

            if (arrowVisibility !== this._arrowVisible) {
                this._isMaxHeight = true;
            }
        }
    }

    protected _minimizeHistoryItems(items: IFilterItem[]): void {
        factory(items).each((item) => {
            delete item.caption;
        });
    }

    protected _getEditDialogOptions(item: Model, historyId: string, savedTextValue: string): IEditDialogOptions {
        const history = this._getSource(historyId).getDataObject(item);
        let items = history.items || history;

        const captionsObject = this._mapByField(this._options.filterItems, 'caption');
        items = factory(items).map((historyItem: IFilterItem) => {
            historyItem.caption = captionsObject[historyItem[this._keyProperty]];
            return historyItem;
        }).value();

        return {
            items,
            editedTextValue: savedTextValue || '',
            isClient: history.globalParams === undefined ? !!history.isClient : !!history.globalParams,
            isFavorite: item.get('pinned') || item.get('client')
        };
    }

    protected _deleteFavorite(data: Record<string, any>): void {
        this._getSource(this._options.historyId).remove(this._editItem, {
            $_favorite: true, isClient: data.isClient
        });

        this._children.stickyOpener.close();
        this._notify('historyChanged');
    }

    protected _saveFavorite(record: Model): void {
        const editItemData = this._getSource(this._options.historyId).getDataObject(this._editItem);
        const ObjectData = Merge(object.clone(editItemData), record.getRawData(), {rec: false});
        this._minimizeHistoryItems(ObjectData.items);

        this._setObjectData(this._editItem, ObjectData);
        this._getSource(this._options.historyId).update(this._editItem, {
            $_favorite: true,
            isClient: record.get('isClient')
        });
        this._notify('historyChanged');
    }

    protected _updateFavorite(item: Model, text: string, target: HTMLElement): void {
        const templateOptions = this._getEditDialogOptions(item, this._options.historyId, text);
        const popupOptions = {
            opener: self,
            target,
            templateOptions,
            targetPoint: {
                vertical: 'bottom',
                horizontal: 'left'
            },
            direction: {
                horizontal: 'left'
            }
        };
        this._children.stickyOpener.open(popupOptions);
    }

    protected _beforeMount(options: IHistoryListOptions): void {
        this._keyProperty = this._getKeyProperty(options.items);
        this._collection = this._getCollection(options.items, this._keyProperty);
        this._historyCount = this._getHistoryCount(options.saveMode);
        this._itemsText = this._getText(options.items,
            options.filterItems,
            this._getSource(options.historyId));
        this._itemActions = this._getItemActions(options.saveMode);
    }

    protected _beforeUpdate(newOptions: IHistoryListOptions): void {
        if (!isEqual(this._options.items, newOptions.items)) {
            if (newOptions.saveMode === 'favorite') {
                this._collection = this._getCollection(
                                   this._getSource(newOptions.historyId).getItems(),
                                   this._keyProperty);
            } else {
                this._collection = this._getCollection(newOptions.items.clone(), this._keyProperty);
            }
            this._itemsText = this._getText(newOptions.items,
                                            newOptions.filterItems,
                                            this._getSource(newOptions.historyId));
            this._itemActions = this._getItemActions(newOptions.saveMode);
        }
    }

    protected _onPinClick(event: SyntheticEvent<Event>, item: Model): void {
        this._getSource(this._options.historyId).update(item, {
            $_pinned: !item.get('pinned')
        });
        this._notify('historyChanged');
    }

    protected _onFavoriteClick(event: SyntheticEvent<Event>, item: Model, text: string): void {
        this._editItem = item;
        this._updateFavorite(item, text, event.target as HTMLElement);
    }

    protected _editDialogResult(event: SyntheticEvent<Event>, data: Record<string, any>): void {
        if (data.action === 'save') {
            this._saveFavorite(data.record);
        } else if (data.action === 'delete') {
            this._deleteFavorite(data);
        }
    }

    protected _itemClickHandler(event: SyntheticEvent<Event>, item: Model): void {
        const history = this._getSource(this._options.historyId).getDataObject(item);
        this._notify('applyHistoryFilter', [history]);
    }

    protected _afterMount(): void {
        this._onResize();
    }

    protected _afterUpdate(): void {
        this._onResize();
    }

    protected _getText(
        items: RecordSet,
        filterItems: IFilterItem[],
        historySource: FilterSource
    ): Record<string, string> {
        const itemsText = {};
        // the resetValue is not stored in history, we take it from the current filter items
        const resetValues = this._mapByField(filterItems, 'resetValue');

        factory(items).each((item) => {
            let text = '';
            const history = historySource.getDataObject(item);

            if (history) {
                text = history.linkText || this._getStringHistoryFromItems(history.items || history, resetValues);
            }
            itemsText[item.get('ObjectId')] = text;
        });
        return itemsText;
    }

    protected _clickSeparatorHandler(): void {
        this._isMaxHeight = !this._isMaxHeight;
        this._notify('controlResize', [], {bubbling: true});
    }

    static _theme: string[] = ['Controls/filterPopup'];
}
