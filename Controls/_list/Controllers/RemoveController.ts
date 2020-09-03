import { RecordSet } from 'Types/collection';
import {ICrud} from 'Types/source';
import { IHashMap } from 'Types/declarations';
import { ISelectionObject, TSelectionType } from 'Controls/interface';
import { getItemsBySelection } from '../resources/utils/getItemsBySelection';
import { CrudEntityKey } from 'Types/source';

// @todo https://online.sbis.ru/opendoc.html?guid=2f35304f-4a67-45f4-a4f0-0c928890a6fc
type TFilterObject = IHashMap<any>;

/**
 * Контроллер для удаления элементов списка в recordSet и dataSource.
 *
 * @class Controls/_list/Controllers/RemoveController
 * @control
 * @public
 * @author Аверкиев П.А.
 * @category List
 */
export class RemoveController {
    private _source: ICrud;
    private _items: RecordSet;
    private _filter: TFilterObject;
    private _selectionType: TSelectionType

    constructor(source: ICrud, items: RecordSet, filter: TFilterObject, selectionType?: TSelectionType) {
        this.update(source, items, filter, selectionType);
    }

    /**
     * Обновляет поля контроллера
     * @function Controls/_list/Controllers/RemoveController#update
     * @param {Types/source:ICrud} source ресурс данных, из которог производится удаление
     * @param {Types/collection:RecordSet} items Список items, в котором производится удаление
     * @param {TFilterObject} filter Фильтр, применяемый к запросу query при получении из ресурса keys выбранных записей
     * @param {Controls/interface:TSelectionType} selectionType Типы выделенных элементов, определённые SelectionController
     */
    update(source: ICrud, items: RecordSet, filter: IHashMap<any>, selectionType?: TSelectionType): void {
        this._source = source;
        this._items = items;
        this._filter = filter
        this._selectionType = selectionType;
    }

    /**
     * Удаляет элементы из источника данных
     * @function Controls/interface/IRemovable#remove
     * @param {Controls/interface:ISelectionObject} selection Элементы для удаления.
     * @returns {Promise}
     */
    remove(selection: ISelectionObject): Promise<CrudEntityKey[]> {
        return this._extractSelectedKeys(selection).then((selectedItems: CrudEntityKey[]) => (
            this._removeFromSource(selectedItems).then((result) => (
                this._removeFromItems(selectedItems)
            ))
        ));
    }

    private _extractSelectedKeys(selection: ISelectionObject): Promise<CrudEntityKey[]> {
        return getItemsBySelection(selection, this._source, this._items, this._filter, null, this._selectionType)
    }

    private _removeFromSource(selectedKeys: CrudEntityKey[]): Promise<void> {
        return this._source.destroy(selectedKeys);
    }

    private _removeFromItems(selectedKeys: CrudEntityKey[]): CrudEntityKey[] {
        let item;
        this._items.setEventRaising(false, true);
        for (let i = 0; i < selectedKeys.length; i++) {
            item = this._items.getRecordById(selectedKeys[i]);
            if (item) {
                this._items.remove(item);
            }
        }
        this._items.setEventRaising(true, true);
        return selectedKeys;
    }
}
