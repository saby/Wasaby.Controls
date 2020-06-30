import uDimension = require('Controls/Utils/getDimensions');
import { IMarkerModel, IOptions, TVisibility, Visibility, TKey } from './interface';
import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';

export class Controller {
   private _model: IMarkerModel;
   private _markerVisibility: TVisibility;
   private _markedKey: TKey;

   constructor(options: IOptions) {
      this._model = options.model;
      this._markerVisibility = options.markerVisibility;
      this.setMarkedKey(options.markedKey);
   }

   /**
    * Обновить состояние контроллера
    * @param options
    * @param [silent=false]
    * @return {number|string} измененный или нет ключ маркера
    */
   update(options: IOptions, silent: boolean = false): TKey {
      const markerVisibilityChanged = this._markerVisibility !== options.markerVisibility;

      this._model = options.model;
      this._markerVisibility = options.markerVisibility;

      // если visibility изменили на visible и не передали ключ, то ставим marker на первый элемент,
      // иначе проставляем переданный ключ
      if (markerVisibilityChanged && this._markerVisibility === Visibility.Visible && !options.markedKey) {
         this._markedKey = this._setMarkerOnFirstItem(silent);
      } else {
         this.setMarkedKey(options.markedKey, silent);
      }

      return this._markedKey;
   }

   /**
    * Снимает старый маркер и ставит новый
    * Если по переданному ключу не найден элемент, то маркер ставится на первый элемент списка
    * @param key ключ элемента, на который ставится маркер
    * @param [silent=false]
    * @return {string|number} новый ключ маркера
    */
   setMarkedKey(key: TKey, silent: boolean = false): TKey {
      if ((key === undefined || key === null) && this._markerVisibility !== Visibility.Visible) {
         if (this._markedKey === key) {
            return this._markedKey;
         }

         this._model.setMarkedKey(this._markedKey, false, silent);
         this._markedKey = key;
         return this._markedKey;
      }

      const item = this._model.getItemBySourceKey(key);
      if (this._markedKey === key && item) {
         // если список перестроится, то в модели сбросится маркер, а в контроллере сохранится
         if (!item.isMarked()) {
            this._model.setMarkedKey(this._markedKey, false, true);
            this._model.setMarkedKey(key, true, silent);
         }
         return this._markedKey;
      }

      if (item) {
         this._model.setMarkedKey(this._markedKey, false, true);
         this._model.setMarkedKey(key, true, silent);
         this._markedKey = key;
      } else {
         switch (this._markerVisibility) {
            case Visibility.OnActivated:
               // Маркер сбросим только если список не пустой и элемента с текущим маркером не найдено
               if (this._model.getCount() > 0) {
                  if (this._markedKey) {
                     this._markedKey = this._setMarkerOnFirstItem();
                  } else {
                     this._model.setMarkedKey(this._markedKey, false, true);
                     this._markedKey = null;
                  }
               }
               break;
            case Visibility.Visible:
               this._markedKey = this._setMarkerOnFirstItem(silent);
               break;
         }
      }

      return this._markedKey;
   }

   /**
    * Проставляет заново маркер в модели
    * @remark Не уведомляет о проставлении маркера
    * Если markerVisibility='visible' или ='onactivated' и маркер уже был проставлен и элемента с marked key не существует,
    * то маркер поставим на первый элемент
    */
   restoreMarker(): TKey {
      const item = this._model.getItemBySourceKey(this._markedKey);
      if (item) {
         item.setMarked(true, true);
      } else if (this._model.getCount() > 0
          && (this._markerVisibility === Visibility.Visible || this._markerVisibility === Visibility.OnActivated && this._markedKey)) {
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
      this.setMarkedKey(nextKey);
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
      this.setMarkedKey(prevKey);
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
         this.setMarkedKey(this._getKey(nextItem));
      } else if (prevItem) {
         this.setMarkedKey(this._getKey(prevItem));
      } else {
         this.setMarkedKey(undefined);
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
         this.setMarkedKey(itemKey);
      } else {
         this.setMarkedKey(undefined);
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

   private _setMarkerOnFirstItem(silent: boolean = false): TKey {
      // если модель пустая, то не на что ставить маркер
      if (!this._model.getCount()) {
         // TODO удалить после перехода на новую модель. В старой модели markedKey хранится в состоянии, нужно сбрасывать
         this._model.setMarkedKey(this._markedKey, false, true);
         return null;
      }

      const firstItem = this._model.getFirstItem();
      if (!firstItem) {
         // TODO удалить после перехода на новую модель. В старой модели markedKey хранится в состоянии, нужно сбрасывать
         this._model.setMarkedKey(this._markedKey, false, true);
         return null;
      }

      const firstItemKey = firstItem.getKey();
      if (this._markedKey !== firstItemKey) {
         this._model.setMarkedKey(this._markedKey, false, true);
         this._model.setMarkedKey(firstItemKey, true, silent);
      }
      return firstItemKey;
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
