import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import FlatSelectionStrategy from 'Controls/_operations/MultiSelector/SelectionStrategy/Flat';
import { Collection } from 'Controls/display';

import { SbisService, PrefetchProxy } from 'Types/source';
import { ListViewModel } from 'Controls/list';
import { RecordSet, List } from 'Types/collection';
import { TKeySelection as TKey, TKeysSelection as TKeys, ISelectionObject as ISelection } from 'Controls/interface/';

export interface IOptions {
   listModel: Collection|ListViewModel,
   keyProperty: string,
   selectedKeys?: TKeys,
   excludedKeys?: TKeys,
   selectionStrategy: FlatSelectionStrategy
};

/**
 * @class Controls/_operations/MultiSelector/Selection
 * @extends Core/core-simpleExtend
 * @author Авраменко А.С.
 * @deprecated Модуль устарел и будет удалён в версию 20.ххх. Используйте Controls/operations:FlatSelectionStrategy
 * @private
 */

/**
 * @name Controls/_operations/MultiSelector/Selection#selectedKeys
 * @cfg {Array} Array of selected items' keys.
 * @variant [null] Everything selected.
 * @variant [] Nothing selected.
 */

/**
 * @name Controls/_operations/MultiSelector/Selection#excludedKeys
 * @cfg {Array} Array of keys for items that should be excluded from the selection.
 */

/**
 * @name Controls/_operations/MultiSelector/Selection#keyProperty
 * @cfg {String|Number} Name of the item property that uniquely identifies collection item.
 */

const ALL_SELECTION_VALUE = null;

export default class Selection {
   protected _selectionStrategy: FlatSelectionStrategy;
   protected _listModel: Collection|ListViewModel;
   protected _keyProperty: string;
   protected _selectedKeys: TKeys = [];
   protected _excludedKeys: TKeys = [];
   protected _limit: number = 0;

   public get selectedKeys(): TKeys {
      return this._selectedKeys;
   }

   public set selectedKeys(keys: TKeys): void {
      this._selectedKeys = keys;
   }

   public get excludedKeys(): TKeys {
      return this._excludedKeys;
   }

   public set excludedKeys(keys: TKeys): void {
      this._excludedKeys = keys;
   }

   constructor(options: IOptions): void {
      this._listModel = options.listModel;
      this._keyProperty = options.keyProperty;
      this._selectedKeys = options.selectedKeys.slice();
      this._excludedKeys = options.excludedKeys.slice();
      this._selectionStrategy = options.selectionStrategy;
   }

   /**
    * Add keys to selection.
    * @param {Array} keys Keys to add to selection.
    */
   public select(keys: TKeys): void {
      if (this._limit && keys.length === 1 && !this._excludedKeys.includes(keys[0])) {
         this._increaseLimit(keys.slice());
      }

      let selection: ISelection = this._selectionStrategy.select(keys, this._selectedKeys, this._excludedKeys, this._listModel);

      this._selectedKeys = selection.selected;
      this._excludedKeys = selection.excluded;
   }

   /**
    * Remove keys from selection.
    * @param {Array} keys Keys to remove from selection.
    */
   public unselect(keys: TKeys): void {
      let selection: ISelection = this._selectionStrategy.unSelect(keys, this._selectedKeys, this._excludedKeys, this._listModel);

      this._selectedKeys = selection.selected;
      this._excludedKeys = selection.excluded;
   }

   /**
    * Delete keys from anywhere.
    * @param {Array} keys Keys to remove.
    */
   public remove(keys: TKeys): void {
      this._excludedKeys = ArraySimpleValuesUtil.removeSubArray(this._excludedKeys, keys);
      this._selectedKeys = ArraySimpleValuesUtil.removeSubArray(this._selectedKeys, keys);
   }

   /**
    * Select all items.
    * @remark Sets selectedKeys to [null].
    */
   public selectAll(): void {
      this._selectedKeys = [ALL_SELECTION_VALUE];

      // При выборе "Отметить все" лимит не передается, а предыдущий установленный сбрасывается раньше вызова selectAll,
      // в этом случае массив с исключениями всегда будут очищаться.
      if (!this._limit) {
         this._excludedKeys = [];
      }
   }

   /**
    * Remove selection from all items.
    */
   public unselectAll(): void {
      this._selectedKeys = [];
      this._excludedKeys = [];
   }

   /**
    * Invert selection.
    */
   public toggleAll(): void {
      if (this._selectionStrategy.isAllSelected(ALL_SELECTION_VALUE, this._selectedKeys, this._excludedKeys)) {
         let excludedKeys: TKeys = this._excludedKeys.slice();
         this.unselectAll();
         this.select(excludedKeys);
      } else {
         let selectedKeys: TKeys = this._selectedKeys.slice();
         this.selectAll();
         this.unselect(selectedKeys);
      }
   }

   /**
    * Sets limit.
    * @param {Number} value
    */
   public setLimit(value: number): void {
      this._limit = value;
   }

   /**
    * Returns the number of selected items.
    * @returns {number}
    */
   public getCount(source: SbisService|PrefetchProxy, filter: Object): Promise<number|null> {
      return this._selectionStrategy.getCount({
         selectedKeys: this._selectedKeys,
         excludedKeys: this._excludedKeys,
         model: this._listModel,
         limit: this._limit,
         filter: filter,
         source: source
      });
   }

   /**
    * Transforms selection to single array of selectedKeys and set it to model. Used for rendering checkboxes in lists.
    */
   public updateSelectionForRender(): void {
      let selectionForModel: Map<TKey, boolean> = this._getSelectionForModel();

      if (this._listModel instanceof Collection) {
         this._listModel.setSelection(selectionForModel);
      } else {
         let selectionForOldModel: Object = {};

         selectionForModel.forEach((stateSelection, itemId) => {
            selectionForOldModel[itemId] = stateSelection;
         });
         this._listModel.updateSelection(selectionForOldModel);
      }
   }

   public setListModel(listModel: Collection|ListViewModel): void {
      this._listModel = listModel;
   }

   protected _getSelectionForModel(): Map<TKey, boolean> {
      return this._selectionStrategy.getSelectionForModel(
         this._selectedKeys, this._excludedKeys, this._listModel, this._limit, this._keyProperty);
   }

   /**
    * Increases the limit on the number of selected items, placing all other unselected in excluded list
    * Увеличивает лимит на количество выбранных записей, все предыдущие невыбранные записи при этом попадают в исключение
    * @param {Array} keys
    * @private
    */
   protected _increaseLimit(keys: TKeys): void {
      let
         selectedItemsCount: number = 0,
         limit: number = this._limit ? this._limit - this._excludedKeys.length : 0,
         selectionForModel: Map<TKey, boolean> = this._selectionStrategy.getSelectionForModel(
            this._selectedKeys, this._excludedKeys, this._listModel, this._limit, this._keyProperty);

      this._getItems().forEach((item) => {
         let key: TKey = item.get(this._keyProperty);

         if (selectedItemsCount < limit && selectionForModel.get(key) !== false) {
            selectedItemsCount++;
         } else if (selectedItemsCount >= limit && keys.length) {
            selectedItemsCount++;
            this._limit++;

            if (keys.includes(key)) {
               keys.splice(keys.indexOf(key), 1);
            } else {
               this._excludedKeys.push(key);
            }
         }
      });
   }

   private _getItems(): RecordSet|List {
      if (this._listModel instanceof Collection) {
         return this._listModel.getCollection();
      } else {
         return this._listModel.getItems();
      }
   }
}
