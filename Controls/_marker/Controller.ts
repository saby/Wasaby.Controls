import {getDimensions as uDimension} from 'Controls/sizeUtils';
import { IOptions, TVisibility, Visibility } from './interface';
import { Collection, CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import {CrudEntityKey} from 'Types/source';

/**
 * Контроллер управляющий маркером в списке
 * @class Controls/_marker/Controller
 * @author Панихин К.А.
 * @public
 */
export class Controller {
   private _model: Collection<Model, CollectionItem<Model>>;
   private _markerVisibility: TVisibility;
   private _markedKey: CrudEntityKey;

   constructor(options: IOptions) {
      this._model = options.model;
      this._markerVisibility = options.markerVisibility;
      this._markedKey = options.markedKey;
   }

   /**
    * Обновляет состояние контроллера
    * @param {IOptions} options Новые опции
    * @void
    */
   updateOptions(options: IOptions): void {
      this._model = options.model;
      this._markerVisibility = options.markerVisibility;
   }

   /**
    * Применяет переданный ключ
    * @param {CrudEntityKey} key Новый ключ
    * @void
    */
   applyMarkedKey(key: CrudEntityKey): void {
      // TODO после перехода на новую модель, удалить setMarkedKey и работать с CollectionItem
      if (this._markedKey !== key) {
         this._model.setMarkedKey(this._markedKey, false);
      }
      this._model.setMarkedKey(key, true);
      this._markedKey = key;
   }

   /**
    * Высчитывает новый ключ маркера
    * @return {CrudEntityKey} Новый ключ
    */
   calculateMarkedKey(): CrudEntityKey {
      const existsMarkedItem = !!this._model.getItemBySourceKey(this._markedKey);

      let newMarkedKey;

      if (existsMarkedItem) {
         newMarkedKey = this._markedKey;
      } else {
         if (this._markerVisibility === Visibility.Visible) {
            if (this._model.getCount()) {
               newMarkedKey = this._getFirstItemKey();
            } else {
               newMarkedKey = this._markedKey;
            }
         } else {
            if (this._model.getCount()) {
               newMarkedKey = null;
            } else {
               newMarkedKey = this._markedKey;
            }
         }
      }

      return newMarkedKey;
   }

   /**
    * Возвращает текущий ключ маркера
    * @return {CrudEntityKey} Текущий ключ
    */
   getMarkedKey(): CrudEntityKey {
      return this._markedKey;
   }

   /**
    * Высчитывает ключ следующего элемента
    * @return {CrudEntityKey} Ключ следующего элемента
    */
   calculateNextMarkedKey(): CrudEntityKey {
      const index = this._model.getIndex(this._model.getItemBySourceKey(this._markedKey));
      const nextMarkedKey = this._calculateNearbyByDirectionItemKey(index + 1, true);
      return nextMarkedKey === null ? this._markedKey : nextMarkedKey;
   }

   /**
    * Высчитывает ключ предыдущего элемента
    * @return {CrudEntityKey} Ключ предыдущего элемента
    */
   calculatePrevMarkedKey(): CrudEntityKey {
      const index = this._model.getIndex(this._model.getItemBySourceKey(this._markedKey));
      const prevMarkedKey = this._calculateNearbyByDirectionItemKey(index - 1, false);
      return prevMarkedKey === null ? this._markedKey : prevMarkedKey;
   }

   /**
    * Высчитывает новый ключ относительно удаленного элемента
    * @remark Возвращает ключ следующего элемента, при его отустствии предыдущего, иначе null
    * @param {number} removedItemsIndex Индекс удаленной записи в коллекции
    * @return {CrudEntityKey} Новый ключ маркера
    */
   calculateMarkedKeyAfterRemove(removedItemsIndex: number): CrudEntityKey {
      // Если элемент с текущем маркером не удален или маркер не проставлен, то маркер не нужно менять
      const item = this._model.getItemBySourceKey(this._markedKey);
      if (item || this._markedKey === null || this._markedKey === undefined) {
         return this._markedKey;
      }
      return this._calculateNearbyItemKey(removedItemsIndex);
   }

   /**
    * Высчитывает ключ первого полностью видимого на странице элемента
    * @param {HTMLElement[]} items список HTMLElement-ов на странице
    * @param {number} verticalOffset вертикальное смещение скролла
    * @returns {CrudEntityKey} Новый ключ маркера
    */
   calculateFirstVisibleItemKey(items: HTMLElement[], verticalOffset: number): CrudEntityKey {
      let firstItemIndex = this._model.getStartIndex();
      firstItemIndex += this._getFirstVisibleItemIndex(items, verticalOffset);
      firstItemIndex = Math.min(firstItemIndex, this._model.getStopIndex());
      const item = this._model.at(firstItemIndex);
      return item && item.MarkableItem ? item.getContents().getKey() : this._calculateNearbyItemKey(firstItemIndex);
   }

   /**
    * Сбрасывает состояние marked для переданных элементов
    * @param {Array<CollectionItem<Model>>} items Список элементов коллекции
    * @void
    */
   resetMarkedState(items: Array<CollectionItem<Model>>): void {
      items.forEach((item) => item.setMarked(false, true));
   }

   /**
    * Восстанавливает состояние marked для элемента с ключом равным markedKey, если он есть среди items
    * @param {Array<CollectionItem<Model>>} items Список добавленных элементов
    * @void
    */
   restoreMarkedState(items: Array<CollectionItem<Model>>): void {
      if (items.some((item) => this._getKey(item) === this._markedKey)) {
         this.applyMarkedKey(this._markedKey);
      }
   }

   /**
    * Зануляет все ссылки внутри контроллера
    * @void
    */
   destroy(): void {
      this._markedKey = null;
      this._markerVisibility = null;
      this._model = null;
   }

   /**
    * @private
    * TODO нужно выпилить этот метод при переписывании моделей. item.getContents() должен возвращать Record
    *  https://online.sbis.ru/opendoc.html?guid=acd18e5d-3250-4e5d-87ba-96b937d8df13
    */
   private _getKey(item: CollectionItem<Model>): CrudEntityKey {
      let contents = item.getContents();
      if (item['[Controls/_display/BreadcrumbsItem]'] || item.breadCrumbs) {
         contents = contents[(contents as any).length - 1];
      }

      // Для GroupItem нет ключа, в contents хранится не Model
      if (item['[Controls/_display/GroupItem]']) {
         return undefined;
      }

      return contents.getKey();
   }

   /**
    * Возвращает ключ ближайшего следующего элемента, если нет следующего, то предыдущего, а иначе null
    * @param index Индекс элемента, к которому искать ближайший элемент
    * @private
    */
   private _calculateNearbyItemKey(index: number): CrudEntityKey {
      // Считаем ключ следующего элемента
      let newMarkedKey = this._calculateNearbyByDirectionItemKey(index, true);

      // Считаем ключ предыдущего элемента, если следующего нет
      if (newMarkedKey === null) {
         newMarkedKey = this._calculateNearbyByDirectionItemKey(index, false);
      }

      return newMarkedKey;
   }

   /**
    * Возвращает ключ ближайшего элемента в направлении next
    * @param index Индекс элемента, к которому искать ближайший элемент
    * @param next Следующий или предыдущий
    * @private
    */
   private _calculateNearbyByDirectionItemKey(index: number, next: boolean): CrudEntityKey {
      const count = this._model.getCount();
      let item;

      const indexInBounds = (i) => next ? i < count : i >= 0;
      while (indexInBounds(index)) {
         item = this._model.at(index);
         if (item && item.MarkableItem) { break; }
         index += next ? 1 : -1;
      }

      return item ? this._getKey(item) : null;
   }

   /**
    * Возвращает ключ первого элемента модели
    * @private
    */
   private _getFirstItemKey(): CrudEntityKey {
      if (!this._model.getCount()) {
         return null;
      }

      const firstItem = this._model.getFirstItem();
      if (!firstItem) {
         return null;
      }

      return firstItem.getKey();
   }

   /**
    * Возращает индекс первого полностью видимого элемента
    * @param {HTMLElement[]} items
    * @param {number} verticalOffset
    * @private
    */
   private _getFirstVisibleItemIndex(items: HTMLElement[], verticalOffset: number): number {
      const itemsCount = items.length;
      let itemsHeight = 0;
      let i = 0;
      if (verticalOffset <= 0) {
         return 0;
      }
      while (itemsHeight < verticalOffset && i < itemsCount) {
         itemsHeight += uDimension(items[i]).height;
         i++;
      }
      return i;
   }
}
