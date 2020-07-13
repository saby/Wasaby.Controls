import uDimension = require('Controls/Utils/getDimensions');
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
   private _markedKey: TKey = null;
   private _prevMarkedKey: TKey = null;

   constructor(options: IOptions) {
      this._model = options.model;
      this._markerVisibility = options.markerVisibility;
      this.calculateMarkedKey(options.markedKey);

      if (this._markedKey !== null) {
         this.setMarkedKey();
      }
   }

   /**
    * Обновить состояние контроллера
    * @param options
    * @return {number|string} Ключ маркера
    */
   update(options: IOptions): TKey {
      this._model = options.model;
      this._markerVisibility = options.markerVisibility;
      this.calculateMarkedKey(options.markedKey);
      return this._markedKey;
   }

   /**
    * Обновить маркер в модели
    */
   setMarkedKey(): void {
      if (this._prevMarkedKey !== this._markedKey) {
         this._model.setMarkedKey(this._prevMarkedKey, false);
         this._model.setMarkedKey(this._markedKey, true);
         this._prevMarkedKey = this._markedKey;
      }
   }

   /**
    * Снимает старый маркер и ставит новый
    * Если по переданному ключу не найден элемент, то маркер ставится на первый элемент списка
    * @param key ключ элемента, на который ставится маркер
    * @return {string|number} новый ключ маркера
    */
   calculateMarkedKey(key: TKey): TKey {
      if ((key === undefined || key === null) && this._markerVisibility !== Visibility.Visible) {
         this._markedKey = key;
         return this._markedKey;
      }

      const item = this._model.getItemBySourceKey(key);
      if (this._markedKey === key && item) {
         return this._markedKey;
      }

      this._prevMarkedKey = this._markedKey;
      if (item) {
         this._markedKey = key;
      } else {
         switch (this._markerVisibility) {
            case Visibility.OnActivated:
               // Маркер сбросим только если список не пустой и элемента с текущим маркером не найдено
               if (this._model.getCount() > 0) {
                  if (this._markedKey) {
                     this._markedKey = this._setMarkerOnFirstItem();
                  } else {
                     this._markedKey = null;
                  }
               }
               break;
            case Visibility.Visible:
               this._markedKey = this._setMarkerOnFirstItem();
               break;
         }
      }

      return this._markedKey;
   }

   /**
    * Проставляет заново маркер в модели
    * @remark
    *  Если markerVisibility='visible' или ='onactivated' и маркер уже был проставлен и элемента с marked key не существует,
    *  то маркер поставим на первый элемент
    */
   restoreMarker(): TKey {
      const item = this._model.getItemBySourceKey(this._markedKey);
      if (item) {
         item.setMarked(true, true);
      } else if (this._model.getCount() > 0
          && (this._markerVisibility === Visibility.Visible || this._markerVisibility === Visibility.OnActivated && this._markedKey)) {
         this._prevMarkedKey = this._markedKey;
         this._markedKey = this._setMarkerOnFirstItem();
      }

      return this._markedKey;
   }

   /**
    * Переместить маркер на следующий элемент
    * @return ключ, на который поставлен маркер
    */
   moveMarkerToNext(): TKey {
      const nextItem = this._model.getNextByKey(this._markedKey);
      if (!nextItem) {
         return this._markedKey;
      }

      const nextKey = this._getKey(nextItem);
      this.calculateMarkedKey(nextKey);
      return nextKey;
   }

   /**
    * Переместить маркер на предыдущий элемент
    * @return ключ, на который поставлен маркер
    */
   moveMarkerToPrev(): TKey {
      const prevItem = this._model.getPrevByKey(this._markedKey);
      if (!prevItem) {
         return this._markedKey;
      }

      const prevKey = this._getKey(prevItem);
      this.calculateMarkedKey(prevKey);
      return prevKey;
   }

   /**
    * Обработчк удаления элементов
    * Ставит маркер на следующий элемент, при его отустствии на предыдущий, иначе сбрасывает маркер
    * @param removedItemsIndex
    */
   handleRemoveItems(removedItemsIndex: number): TKey {
      // Если элемент с текущем маркером не удален, то маркер не нужно менять
      const item = this._model.getItemBySourceKey(this._markedKey);
      if (item) {
         return this._markedKey;
      }

      const nextItem = this._model.getNextByIndex(removedItemsIndex);
      const prevItem = this._model.getPrevByIndex(removedItemsIndex);

      if (nextItem) {
         this.calculateMarkedKey(this._getKey(nextItem));
      } else if (prevItem) {
         this.calculateMarkedKey(this._getKey(prevItem));
      } else {
         this.calculateMarkedKey(null);
      }

      return this._markedKey;
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

      const item = this._model.getValidItemForMarker(firstItemIndex);
      if (item) {
         const itemKey = this._getKey(item);
         this.calculateMarkedKey(itemKey);
      } else {
         this.calculateMarkedKey(null);
      }

      return this._markedKey;
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
      return contents.getKey();
   }

   /**
    * Устанавливает маркер на первый элемент модели
    * @private
    * @remark Всегда уведомляет о новом ключе, так как у прикладника в этом случае хранится другой ключ
    */
   private _setMarkerOnFirstItem(): TKey {
      // если модель пустая, то не на что ставить маркер
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
