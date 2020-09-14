import {getDimensions as uDimension} from 'Controls/sizeUtils';
import { IOptions, TVisibility, Visibility } from './interface';
import { Collection, CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import {CrudEntityKey} from 'Types/source';

/**
 * @class Controls/_marker/Controller
 * @author Панихин К.А.
 * @private
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
    * Обновить состояние контроллера
    * @param options
    */
   updateOptions(options: IOptions): void {
      this._model = options.model;
      this._markerVisibility = options.markerVisibility;
   }

   /**
    * Применить переданный ключ к модели
    * @param key Новый ключ
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
    * Пересчитать ключ маркера исходя из текущего
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
               newMarkedKey = this._markedKey;
            } else {
               newMarkedKey = null;
            }
         }
      }

      return newMarkedKey;
   }

   /**
    * Получить текущий ключ маркера
    */
   getMarkedKey(): CrudEntityKey {
      return this._markedKey;
   }

   /**
    * Посчитать ключ следующего элемента
    * @return Ключ средующего элемента
    */
   calculateNextMarkedKey(): CrudEntityKey {
      const index = this._model.getIndex(this._model.getItemBySourceKey(this._markedKey));
      const nextMarkedKey = this._calculateNearbyByDirectionItemKey(index, true);
      return nextMarkedKey === null ? this._markedKey : nextMarkedKey;
   }

   /**
    * Посчитать ключ предыдущего элемента
    * @return Ключ предыдущего элемента
    */
   calculatePrevMarkedKey(): CrudEntityKey {
      const index = this._model.getIndex(this._model.getItemBySourceKey(this._markedKey));
      const prevMarkedKey = this._calculateNearbyByDirectionItemKey(index, false);
      return prevMarkedKey === null ? this._markedKey : prevMarkedKey;
   }

   /**
    * Посчитать новый ключ относительно удаленного элемента
    * Возвращает ключ следующего элемента, при его отустствии предыдущего, иначе null
    * @param removedItemsIndex Индекс удаленной записи в исходной коллекции (RecordSet)
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
    * Сбросить состояние marked для переданных элементов
    * @param items Список элементов коллекции
    */
   resetMarkedState(items: Array<CollectionItem<Model>>): void {
      items.forEach((item) => item.setMarked(false, true));
   }

   /**
    * Посчитать ключ элемента, который полностью виден на странице
    * @param items список HTMLElement-ов на странице
    * @param verticalOffset вертикальное смещение скролла
    */
   calculateFirstVisibleItemKey(items: HTMLElement[], verticalOffset: number): CrudEntityKey {
      let firstItemIndex = this._model.getStartIndex();
      firstItemIndex += this._getFirstVisibleItemIndex(items, verticalOffset);
      firstItemIndex = Math.min(firstItemIndex, this._model.getStopIndex());
      return this._calculateNearbyItemKey(firstItemIndex);
   }

   /**
    * Восстановить состояние для маркированного элемента, если он есть среди newItems
    * @param newItems Список добавленных элементов
    */
   restoreMarkedState(newItems: Array<CollectionItem<Model>>): void {
      if (newItems.some((item) => this._getKey(item) === this._markedKey)) {
         this.applyMarkedKey(this._markedKey);
      }
   }

   /**
    * Занулить все ссылки внутри контроллера
    */
   destroy(): void {
      this._markedKey = null;
      this._markerVisibility = null;
      this._model = null;
   }

   /*
      TODO нужно выпилить этот метод при переписывании моделей. item.getContents() должен возвращать Record
       https://online.sbis.ru/opendoc.html?guid=acd18e5d-3250-4e5d-87ba-96b937d8df13
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
      const limit = next ? this._model.getCount() : 0;
      let item;
      do {
         index += next ? 1 : -1;

         if (next ? index >= limit : index < limit) {
            return null;
         }
         item = this._model.at(index);
      } while (!item?.MarkableItem);

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
