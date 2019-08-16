import CollectionItem from './CollectionItem';
import Collection, {
   ISourceCollection as IGeneralSourceCollection,
   IOptions as ICollectionOptions
} from './Collection';
import {IEnum} from '../collection';
import {register} from '../di';
import {DestroyableMixin, ObservableMixin} from '../entity';
import {Object as EventObject} from 'Env/Event';

interface IEnumCollection<T> extends IGeneralSourceCollection<T>, IEnum<T> {
}

interface IOptions<S, T> extends ICollectionOptions<S, T> {
   collection: IEnumCollection<S>;
}

function onSourceChange(event: EventObject, index: number): void {
   this.setCurrentPosition(this.getIndexBySourceIndex(index));
}

/**
 * Проекция для типа "Перечисляемое".
 * @class Types/_display/Enum
 * @extends Types/_display/Collection
 * @public
 * @author Мальцев А.А.
 */
export default class Enum<S, T = CollectionItem<S>> extends Collection<S, T> {
   protected _$collection: IEnumCollection<S>;

   /**
    * Обработчик события об изменении текущего индекса Enum
    */
   protected _onSourceChange: Function;

   constructor(options?: IOptions<S, T>) {
      super(options);

      if (!this._$collection['[Types/_collection/IEnum]']) {
         throw new TypeError(`${this._moduleName}: source collection should implement Types/_collection/IEnum`);
      }

      this._getCursorEnumerator().setPosition(
         this.getIndexBySourceIndex(this._$collection.get() as number)
      );

      if (this._$collection['[Types/_entity/ObservableMixin]']) {
         (this._$collection as ObservableMixin).subscribe('onChange', this._onSourceChange);
      }
   }

   destroy(): void {
      if (this._$collection['[Types/_entity/DestroyableMixin]'] &&
         this._$collection['[Types/_entity/ObservableMixin]'] &&
         !(this._$collection as DestroyableMixin).destroyed
      ) {
         (this._$collection as ObservableMixin).unsubscribe('onChange', this._onSourceChange);
      }

      super.destroy();
   }

   protected _bindHandlers(): void {
      super._bindHandlers();

      this._onSourceChange = onSourceChange.bind(this);
   }

   protected _notifyCurrentChange(
      newCurrent: CollectionItem<S>,
      oldCurrent: CollectionItem<S>,
      newPosition: number,
      oldPosition: number
   ): void {
      let value = null;
      if (newPosition > -1) {
         value = this.getSourceIndexByIndex(newPosition);
      }
      this._$collection.set(value);

      super._notifyCurrentChange(newCurrent, oldCurrent, newPosition, oldPosition);
   }

   protected _getSourceIndex(index: number): number {
      const enumerator = this._$collection.getEnumerator();
      let i = 0;

      if (index > -1) {
         while (enumerator.moveNext()) {
            if (i === index) {
               return enumerator.getCurrentIndex();
            }
            i++;
         }
      }
      return -1;
   }

   protected _getItemIndex(index: number): number {
      const enumerator = this._$collection.getEnumerator();
      let i = 0;

      while (enumerator.moveNext()) {
         // tslint:disable-next-line:triple-equals
         if (enumerator.getCurrentIndex() == index) {
            return i;
         }
         i++;
      }
      return -1;
   }
}

Object.assign(Enum.prototype, {
   '[Types/_display/Enum]': true,
   _moduleName: 'Types/display:Enum',
   _localize: true,
   _onSourceChange: null
});

register('Types/display:Enum', Enum);
