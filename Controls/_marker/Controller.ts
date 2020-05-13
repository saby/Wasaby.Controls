import { TKeySelection as TKey } from 'Controls/interface';
import { CollectionItem, IBaseCollection } from 'Controls/display';
import { Model } from 'Types/entity';
import uDimension = require('Controls/Utils/getDimensions');

type TVisibility = 'visible' | 'hidden' | 'onactivated';
enum Visibility { Visible = 'visible', Hidden = 'hidden', OnActivated = 'onactivated'}

interface IMarkerModel extends IBaseCollection<CollectionItem<Model>> {
   setMarkedKey(key: TKey, status: boolean): void;
   getFirstItem(): Model;
   getPreviousItem(index: number): TKey;
   getNextItem(index: number): TKey;
   getPreviousItemKey(key: TKey): TKey;
   getNextItemKey(key: TKey): TKey;
   getCount(): number;
}

interface IOptions {
   model: IMarkerModel;
   markerVisibility: TVisibility;
   markedKey: TKey;
}

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
    */
   update(options: IOptions): void {
      this._model = options.model;
      this._markerVisibility = options.markerVisibility;
      this.setMarkedKey(options.markedKey);
   }

   /**
    * Снимает старый маркер и ставит новый
    * Если по переданному ключу не найден элемент, то маркер ставится на первый элемент списка
    * @param key ключ элемента, на который ставится маркер
    */
   // TODO + вызывать при изменении итемс
   // TODO вызывать после setRoot для TreeViewModel, может лучше на reset делать, хотя это не одно и тоже
   setMarkedKey(key: TKey): void {
      if (key === undefined
         || this._markedKey === key
         || this._markerVisibility === Visibility.Hidden
         || this._markerVisibility === Visibility.OnActivated && key === null) {
         return;
      }

      this._model.setMarkedKey(this._markedKey, false);
      if (this._model.getItemBySourceKey(key)) {
         this._model.setMarkedKey(key, true);
         this._markedKey = key;
      } else {
         this._markedKey = this._setMarkerOnFirstItem();
      }
   }

   /**
    * Переместить маркер на следующий элемент
    */
   moveMarkerToNext(): void {
      if (this._markerVisibility === Visibility.Hidden) {
         return;
      }

      // TODO совместимость
      const nextKey = this._model.getNextItemKey(this._markedKey);
      this.setMarkedKey(nextKey);
   }

   /**
    * Переместить маркер на предыдущий элемент
    */
   moveMarkerToPrev(): void {
      if (this._markerVisibility === Visibility.Hidden) {
         return;
      }

      // TODO совместимость
      const prevKey = this._model.getPreviousItemKey(this._markedKey);
      this.setMarkedKey(prevKey);
   }

   handleRemoveItems(removedItemsIndex: number): void {
      // TODO совместимость
      const nextKey = this._model.getNextItem(removedItemsIndex);
      const prevKey = this._model.getPreviousItem(removedItemsIndex);
      if (nextKey) {
         this.setMarkedKey(nextKey);
      } else if (prevKey) {
         this.setMarkedKey(prevKey);
      } else {
         this.setMarkedKey(null);
      }
   }

   setMarkerToFirstVisibleItem(items: HTMLElement[], verticalOffset: number): void {
      let firstItemIndex = this._model.getStartIndex();
      firstItemIndex += this._getFirstVisibleItemIndex(items, verticalOffset);
      firstItemIndex = Math.min(firstItemIndex, this._model.getStopIndex());

      const item = this._model.getValidItemForMarker(firstItemIndex);
      this.setMarkedKey(item && item.getId());
   }

   private _setMarkerOnFirstItem(): TKey {
      // если модель пустая, то не на что ставить маркер
      // если маркер undefined, значит сюда попали первый раз после загрузки списка
      if (!this._model.getCount()) {
         return undefined;
      }

      const firstItem = this._model.getFirstItem();
      this._model.setMarkedKey(firstItem.getId(), true);
      return firstItem.getId();
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
