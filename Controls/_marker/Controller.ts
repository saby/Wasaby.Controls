import {getDimensions as uDimension} from 'Controls/sizeUtils';
import { IMarkerModel, IOptions, TKey, TVisibility, Visibility } from './interface';
import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';

/**
 * @class Controls/_marker/Controller
 * @author Панихин К.А.
 * @private
 */
export class Controller {
   private _model: IMarkerModel;
   private _markerVisibility: TVisibility;
   private _markedKey: TKey;

   constructor(options: IOptions) {
      this._model = options.model;
      this._markerVisibility = options.markerVisibility;
      this._markedKey = options.markedKey;
      this._markedKey = this.calculateMarkedKey();
   }

   /**
    * Обновить состояние контроллера
    * @param options
    * @return {number|string} Ключ маркера
    */
   updateOptions(options: IOptions): void {
      this._model = options.model;
      this._markerVisibility = options.markerVisibility;
   }

   applyMarkedKey(newMarkedKey: TKey): void {
      if (this._markedKey !== newMarkedKey) {
         this._model.setMarkedKey(this._markedKey, false);
      }
      this._model.setMarkedKey(newMarkedKey, true);
      this._markedKey = newMarkedKey;
   }

   calculateMarkedKey(): TKey {
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
   getMarkedKey(): TKey {
      return this._markedKey;
   }

   /**
    * Переместить маркер на следующий элемент
    * @return ключ, на который поставлен маркер
    */
   calculateNextMarkedKey(): TKey {
      const index = this._model.getIndex(this._model.getItemBySourceKey(this._markedKey));
      const nextMarkedKey = this._calculateMarkedKey(index, true);
      return nextMarkedKey === null ? this._markedKey : nextMarkedKey;
   }

   /**
    * Переместить маркер на предыдущий элемент
    * @return ключ, на который поставлен маркер
    */
   calculatePrevMarkedKey(): TKey {
      const index = this._model.getIndex(this._model.getItemBySourceKey(this._markedKey));
      const prevMarkedKey = this._calculateMarkedKey(index, false);
      return prevMarkedKey === null ? this._markedKey : prevMarkedKey;
   }

   /**
    * Обработчк удаления элементов
    * Ставит маркер на следующий элемент, при его отустствии на предыдущий, иначе сбрасывает маркер
    * @param removedItemsIndex Индекс удаленной записи в исходной коллекции (RecordSet)
    */
   calculateMarkerAfterRemove(removedItemsIndex: number): TKey {
      // Если элемент с текущем маркером не удален, то маркер не нужно менять
      const item = this._model.getItemBySourceKey(this._markedKey);
      if (item) {
         return this._markedKey;
      }

      let newMarkedKey;
      // Считаем ключ следующего элемента
      newMarkedKey = this._calculateMarkedKey(removedItemsIndex, true);

      // Считаем ключ предыдущего элемента, если следующего нет
      if (newMarkedKey === null) {
         newMarkedKey = this._calculateMarkedKey(removedItemsIndex, false);
      }

      return newMarkedKey;
   }

   /**
    * Сбросить состояние marked для переданных элементов
    * @param items Список элементов коллекции
    */
   resetMarkedState(items: Array<CollectionItem<Model>>): void {
      items.forEach((item) => item.setMarked(false, true));
   }

   /**
    * Устанавливает маркер на первый элемент, который полностью виден на странице
    * @param items список HTMLElement-ов на странице
    * @param verticalOffset вертикальное смещение скролла
    */
   setMarkerOnFirstVisibleItem(items: HTMLElement[], verticalOffset: number): TKey {
      let firstItemIndex = this._model.getStartIndex();
      firstItemIndex += this._getFirstVisibleItemIndex(items, verticalOffset);
      firstItemIndex = Math.min(firstItemIndex, this._model.getStopIndex());

      let newMarkedKey;
      const item = this._model.getValidItemForMarker(firstItemIndex);
      if (item) {
         newMarkedKey = this._getKey(item);
      } else {
         newMarkedKey = null;
      }

      return newMarkedKey;
   }

   /**
    * Обработать добавление элементов
    * @param newItems список новый элементов
    */
   restoreMarkedState(newItems: Array<CollectionItem<Model>>): void {
      if (newItems.some((item) => this._getKey(item) === this._markedKey)) {
         this.applyMarkedKey(this._markedKey);
      }
   }

   /*
      TODO нужно выпилить этот метод при переписывании моделей. item.getContents() должен возвращать Record
       https://online.sbis.ru/opendoc.html?guid=acd18e5d-3250-4e5d-87ba-96b937d8df13
   */
   private _getKey(item: CollectionItem<Model>): TKey {
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

   private _calculateMarkedKey(index: number, next: boolean): TKey {
      const limit = next ? this._model.getCount() : 0;
      let item;
      do {
         index += next ? 1 : -1;

         if (next ? index >= limit : index < limit) {
            return null;
         }
         item = this._model.at(index);
      } while (!item?.Marked);

      return item ? this._getKey(item) : null;
   }

   /**
    * Возвращает ключ первого элемента модели
    * @private
    */
   private _getFirstItemKey(): TKey {
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
