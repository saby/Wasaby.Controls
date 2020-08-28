import { RecordSet } from 'Types/collection';
import { ISelectionObject, TKeysSelection, TSelectionRecord, TSelectionType } from 'Controls/interface';
import { ICrud } from 'Types/source';

import {getItemsBySelection} from '../resources/utils/getItemsBySelection';
import {IHashMap} from "WS.Core/ext/requirejs/require";

/**
 * Контроллер для удаления элементов списка в recordSet и dataSource.
 *
 * @remark
 * Полезные ссылки:
 * * <a href="/materials/Controls-demo/app/Controls-demo%2FList%2FRemove">демо-пример</a>
 * * <a href="/doc/platform/developmentapl/interface-development/controls/list-environment/actions/remover/">руководство разработчика</a>
 * * <a href="https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_list.less">переменные тем оформления</a>
 *
 * @class Controls/_list/Controllers/Remove
 * @control
 * @public
 * @author Авраменко А.С.
 * @category List
 */

/*
 * Сontrol to remove the list items in recordSet and dataSource.
 * Сontrol must be in one Controls.Container.Data with a list.
 * <a href="/materials/Controls-demo/app/Controls-demo%2FOperationsPanel%2FDemo">Demo examples</a>.
 * @class Controls/_list/Controllers/Remover
 * @control
 * @public
 * @author Авраменко А.С.
 * @category List
 */

export class Remove {
    private _source: ICrud;
    private _items: RecordSet;
    private _filter: IHashMap<any>;

    constructor(source: ICrud, items: RecordSet, filter: IHashMap<any>) {
        this.update(source, items, filter);
    }

    /**
     * Обновляет поля контроллера
     * @param source
     * @param items
     * @param filter
     */
    update(source: ICrud, items: RecordSet, filter: IHashMap<any>): void {
        this._source = source;
        this._items = items;
        this._filter = filter
    }

    /**
     * Удаляет элементы из источника данных по идентификаторам элементов коллекции.
     * @function Controls/interface/IRemovable#removeItems
     * @param {Controls/interface:TKeysSelection} items Массив элементов для удаления.
     * @example
     * В следующем примере показано, как удалить элементы из списка после клика по кнопке.
     * <pre>
     *    <Controls.breadcrumbs:Path caption="RemoveItem" on:click="_onRemoveButtonClick()"/>
     * </pre>
     *
     * <pre>
     *     import {Control} from 'Base/UI';
     *     import {Remove} from 'Controls/list';
     *    export default class extends Control {
     *       ...
     *       _keysForRemove: [...];
     *       _remover: Remove;
     *
     *       _beforeMount(options) {
     *           this._updateRemover(options.source, options.items, options.filter);
     *       }
     *
     *       _beforeUpdate(options) {
     *           this._updateRemover(options.source, options.items, options.filter);
     *       }
     *
     *       _onRemoveButtonClick() {
     *          this._remover.removeItems(this._keysForRemove).then(() => {
     *              alert('Items were removed from source as well from items!');
     *          });
     *       }
     *
     *       _updateRemover(source: ICrud, items: RecordSet, filter: IHashMap) {
     *          if (!this._remover) {
     *              this._remover = new Remove(source, items, filter);
     *          } else {
     *              this._remover.update(source, items, filter);
     *          }
     *       }
     *       ...
     *    });
     * </pre>
     * @see afterItemsRemove
     * @see beforeItemsRemove
     */

    /*
     * Removes items from the data source by identifiers of the items in the collection.
     * @function Controls/interface/IRemovable#removeItems
     * @param {Controls/interface:TKeysSelection} items Array of items to be removed.
     * @example
     * The following example shows how to remove items from list after click on the button.
     * <pre>
     *    <Controls.breadcrumbs:Path caption="RemoveItem" on:click="_onRemoveButtonClick()"/>
     * </pre>
     *
     * <pre>
     *     import {Control} from 'Base/UI';
     *     import {Remove} from 'Controls/list';
     *    export default class extends Control {
     *       ...
     *       _keysForRemove: [...];
     *       _remover: Remove;
     *
     *       _beforeMount(options) {
     *           this._updateRemover(options.source, options.items, options.filter);
     *       }
     *
     *       _beforeUpdate(options) {
     *           this._updateRemover(options.source, options.items, options.filter);
     *       }
     *
     *       _onRemoveButtonClick() {
     *          this._remover.removeItems(this._keysForRemove).then(() => {
     *              alert('Items were removed from source as well from items!');
     *          });
     *       }
     *
     *       _updateRemover(source: ICrud, items: RecordSet, filter: IHashMap) {
     *          if (!this._remover) {
     *              this._remover = new Remove(source, items, filter);
     *          } else {
     *              this._remover.update(source, items, filter);
     *          }
     *       }
     *       ...
     *    });
     * </pre>
     * @see afterItemsRemove
     * @see beforeItemsRemove
     */
    removeItems(items: TKeysSelection) {
        return this._removeFromSource(items).then(() => (
            this._removeFromItems(items)
        ));
    }

    /**
     * Возвращает Promise с массивом выбранных записей для удаления
     * @param {Controls/interface:TKeysSelection|Controls/interface:ISelectionObject|Controls/interface:TSelectionRecord} items
     * @param {Controls/interface:TSelectionType} selectionType
     */
    getSelectedItems(items: TKeysSelection|ISelectionObject|TSelectionRecord, selectionType: TSelectionType) {
        //Support removing with mass selection.
        //Full transition to selection will be made by:
        // https://online.sbis.ru/opendoc.html?guid=080d3dd9-36ac-4210-8dfa-3f1ef33439aa
        return items instanceof Array
            ? Promise.resolve(items)
            : getItemsBySelection(items, this._source, this._items, this._filter, null, selectionType);
    }

    private _removeFromSource(items: TKeysSelection): Promise<void> {
        return this._source.destroy(items);
    }

    private _removeFromItems(items: TKeysSelection): void {
        let item;
        this._items.setEventRaising(false, true);
        for (let i = 0; i < items.length; i++) {
            item = this._items.getRecordById(items[i]);
            if (item) {
                this._items.remove(item);
            }
        }
        this._items.setEventRaising(true, true);
    }
}
