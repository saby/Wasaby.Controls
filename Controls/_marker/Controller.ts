import { TKeySelection as TKey } from 'Controls/interface';
import { CollectionItem, IBaseCollection } from 'Controls/display';
import { Model } from 'Types/entity';

type TVisibility = 'visible' | 'hidden' | 'onactivated';
enum Visibility { Visible = 'visible', Hidden = 'hidden', OnActivated = 'onactivated'}

interface IMarkerModel extends IBaseCollection<CollectionItem<Model>> {
   setMarkedKey(key: TKey, status: boolean): void;
   getFirstItem(): Model;
   getPreviousItemKey(key: TKey): TKey;
   getNextItemKey(key: TKey): TKey;
}

interface IOptions {
   model: IMarkerModel,
   markerVisibility: TVisibility,
   markedKey: TKey
}

export class Controller {
   private _model: IMarkerModel;
   private _markerVisibility: TVisibility;
   private _markedKey: TKey;

   constructor(options: IOptions) {
      this._model = options.model;
      this._markerVisibility = options.markerVisibility;
      this._markedKey = options.markedKey;
   }

   /**
    * Обновить состояние контроллера
    * @param options
    */
   update(options: IOptions) {
      this._model = options.model;
      this._markerVisibility = options.markerVisibility;
      this.setMarkedKey(options.markedKey);
   }

   /**
    * Снимает старый маркер и ставит новый
    * Если по переданному ключу не найден элемент, то маркер ставится на первый элемент списка
    * @param key ключ элемента, на который ставится маркер
    */
   // TODO не забыть нотифай после вызова метода, что маркер изменился,
   //  хотя в старой модели нотифается, может и в новую нужно добавить нотифай,а после этого метода не надо,
   //  вроде в новой тоже нотифается, только из item-а

   // TODO + вызывать при изменении итемс, а при удалении элемента вызывать для ближайшего элемента
   // TODO вызывать после setRoot для TreeViewModel, может лучше на reset делать, хотя это не одно и тоже
   setMarkedKey(key: TKey): void {
      if (this._markedKey === key) {
         return;
      }

      if (this._markerVisibility === Visibility.Hidden || this._markerVisibility === Visibility.OnActivated && key === null) {
         if (key === null) {
            this._model.setMarkedKey(this._markedKey, false);
            this._markedKey = null;
         }
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

      // TODO написать совместимость моделей
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

      // TODO написать совместимость моделей
      const prevKey = this._model.getPreviousItemKey(this._markedKey);
      this.setMarkedKey(prevKey);
   }

   /**
    * Если элемента с текущим ключом маркера не существует,
    * то маркер устанавливается на ближайший элемент.
    *
    * Ближайшим элементом в первую очередь выбирается следующий,
    * при его отсутствии предыдущий, а иначе маркер сбрасывается.
    */
   setMarkerNearlyCurrent(): void {
      const currentItem = this._model.getItemBySourceKey(this._markedKey);
      if (this._markedKey && !currentItem) {
         const nextKey = this._model.getNextItemKey(this._markedKey); // TODO добавить совместимость
         const prevKey = this._model.getPreviousItemKey(this._markedKey); // TODO добавить совместимость
         if (nextKey) {
            this.setMarkedKey(nextKey);
         } else if (prevKey) {
            this.setMarkedKey(prevKey);
         } else {
            this.setMarkedKey(null);
         }
      }
   }

   private _setMarkerOnFirstItem(): TKey {
      const firstItem = this._model.getFirstItem();

      if (firstItem) {
         this._model.setMarkedKey(firstItem.getId(), true);
         return firstItem.getId();
      }

      return null;
   }
}