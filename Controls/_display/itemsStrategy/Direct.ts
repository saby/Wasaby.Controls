import AbstractStrategy, {
   IOptions as IAbstractOptions,
   ISerializableState as IDefaultSerializableState
} from './AbstractStrategy';
import CollectionItem from '../CollectionItem';
import {object} from '../../util';
import {Set} from '../../shim';

interface IOptions<S, T> extends IAbstractOptions<S, T> {
   unique: boolean;
   idProperty: string;
}

interface ISortOptions {
   unique: boolean;
   idProperty: string;
}

interface ISerializableState<T> extends IDefaultSerializableState<T> {
   _itemsOrder: number[];
}

/**
 * Стратегия получения элементов проекции напрямую по коллекции
 * @class Types/_display/ItemsStrategy/Direct
 * @extends Types/_display/ItemsStrategy/Abstract
 * @author Мальцев А.А.
 */
export default class Direct<S, T> extends AbstractStrategy<S, T> {
   protected _options: IOptions<S, T>;

   /**
    * Индекс в в стратегии -> оригинальный индекс
    */
   protected _itemsOrder: number[];

   /**
    * @typedef {Object} Options
    * @property {Types/_display/Collection} display Проекция
    * @property {Boolean} unique Признак обеспечения униconstьности элементов
    * @property constring} idProperty Название свойства элемента коллекции, содержащего его уникальный идентификатор
    */

   constructor(options: IOptions<S, T>) {
      super(options);
   }

   /**
    * Устанавливает признак обеспечения уникальности элементов
    */
   set unique(value: boolean) {
      this._options.unique = value;
   }

   // region IItemsStrategy

   get count(): number {
      return this._getItemsOrder().length;
   }

   get items(): T[] {
      const items = this._getItems();
      const itemsOrder = this._getItemsOrder();

      return itemsOrder.map((position) => items[position]);
   }

   at(index: number): T {
      const items = this._getItems();
      const itemsOrder = this._getItemsOrder();
      const position = itemsOrder[index];

      if (position === undefined) {
         throw new ReferenceError(`Display index ${index} is out of bounds.`);
      }

      return items[position];
   }

   splice(start: number, deleteCount: number, added?: S[]): T[] {
      added = added || [];

      const reallyAdded: T[] = added.map(
         (contents) => contents instanceof CollectionItem ? contents as any as T : this._createItem(contents)
      );
      const result = this._getItems().splice(start, deleteCount, ...reallyAdded);

      this._itemsOrder = null;

      return result;
   }

   reset(): void {
      super.reset();
      this._itemsOrder = null;
   }

   invalidate(): void {
      super.invalidate();
      this._itemsOrder = null;
   }

   getDisplayIndex(index: number): number {
      const itemsOrder = this._getItemsOrder();
      const itemIndex = itemsOrder.indexOf(index);

      return itemIndex === -1 ? itemsOrder.length : itemIndex;
   }

   getCollectionIndex(index: number): number {
      const itemsOrder = this._getItemsOrder();
      const itemIndex = itemsOrder[index];
      return itemIndex === undefined ? -1 : itemIndex;
   }

   // endregion

   // region SerializableMixin

   _getSerializableState(state: IDefaultSerializableState<T>): ISerializableState<T> {
      const resultState = super._getSerializableState(state) as ISerializableState<T>;

      resultState._itemsOrder = this._itemsOrder;

      return resultState;
   }

   _setSerializableState(state: ISerializableState<T>): Function {
      const fromSuper = super._setSerializableState(state);
      return function(): void {
         this._itemsOrder = state._itemsOrder;
         fromSuper.call(this);
      };
   }

   // endregion

   // region Protected

   protected _initItems(): void {
      super._initItems();

      const items = this._items;
      const sourceItems = this._getSourceItems();
      const count = items.length;
      for (let index = 0; index < count; index++) {
         items[index] = this._createItem(sourceItems[index]);
      }
   }

   /**
    * Returns relation between internal and original indices
    * @protected
    */
   protected _getItemsOrder(): number[] {
      if (!this._itemsOrder) {
         this._itemsOrder = this._createItemsOrder();
      }
      return this._itemsOrder;
   }

   protected _createItemsOrder(): number[] {
      return Direct.sortItems<T>(this._getItems(), {
         idProperty: this._options.idProperty,
         unique: this._options.unique
      });
   }

   // endregion

   // region Statics

   /**
    * Создает индекс сортировки в том же порядке, что и коллекция
    * @param items Элементы проекции.
    * @param options Опции
    */
   static sortItems<T>(items: T[], options: ISortOptions): number[] {
      const idProperty = options.idProperty;

      if (!options.unique || !idProperty) {
         return items.map((item, index) => index);
      }

      const processed = new Set();
      const result = [];
      let itemId;

      (items as any as Array<CollectionItem<any>>).forEach((item, index) => {
         itemId = object.getPropertyValue(
            item.getContents(),
            idProperty
         );
         if (processed.has(itemId)) {
            return;
         }

         processed.add(itemId);
         result.push(index);
      });

      return result;
   }

   // endregion
}

Object.assign(Direct.prototype, {
   '[Types/_display/itemsStrategy/Direct]': true,
   _moduleName: 'Types/display:itemsStrategy.Direct',
   _itemsOrder: null
});
