import {
   DestroyableMixin,
   OptionsToPropertyMixin,
   InstantiableMixin,
   SerializableMixin,
   IInstantiable
} from '../entity';
import Collection, {ISourceCollection} from './Collection';
import {ISerializableState as IDefaultSerializableState} from '../entity';
import {IList} from '../collection';
import {register} from '../di';
import {mixin} from '../util';

export interface IOptions<T> {
   contents: T;
   owner: Collection<T>;
}

export interface ISerializableState<T> extends IDefaultSerializableState {
   $options: IOptions<T>;
   ci: number;
   iid: string;
}

/**
 * Элемент коллекции
 * @class Types/_display/CollectionItem
 * @mixes Types/_entity/DestroyableMixin
 * @mixes Types/_entity/OptionsMixin
 * @implements Types/_entity/IInstantiable
 * @mixes Types/_entity/InstantiableMixin
 * @mixes Types/_entity/SerializableMixin
 * @public
 * @author Мальцев А.А.
 */
export default class CollectionItem<T> extends mixin<
   DestroyableMixin,
   OptionsToPropertyMixin,
   InstantiableMixin,
   SerializableMixin
>(
   DestroyableMixin,
   OptionsToPropertyMixin,
   InstantiableMixin,
   SerializableMixin
) implements IInstantiable {

   // region IInstantiable

   readonly '[Types/_entity/IInstantiable]': boolean;

   getInstanceId: () => string;

   /**
    * Коллекция, которой принадлежит элемент
    */
   protected _$owner: Collection<T>;

   /**
    * Содержимое элемента коллекции
    */
   protected _$contents: T;

   /**
    * Элемент выбран
    */
   protected _$selected: boolean;

   protected _instancePrefix: string;

   /**
    * Индекс содержимого элемента в коллекции (используется для сериализации)
    */
   protected _contentsIndex: number;

   constructor(options: IOptions<T>) {
      super();
      OptionsToPropertyMixin.call(this, options);
      SerializableMixin.call(this);
   }

   // endregion

   // region Public

   /**
    * Возвращает коллекцию, которой принадлежит элемент
    */
   getOwner(): Collection<T> {
      return this._$owner;
   }

   /**
    * Устанавливает коллекцию, которой принадлежит элемент
    * @param owner Коллекция, которой принадлежит элемент
    */
   setOwner(owner: Collection<T>): void {
      this._$owner = owner;
   }

   /**
    * Возвращает содержимое элемента коллекции
    */
   getContents(): T {
      if (this._contentsIndex !== undefined) {
         // Ленивое восстановление _$contents по _contentsIndex после десериализации
         const collection = this.getOwner().getCollection();
         if (collection['[Types/_collection/IList]']) {
            this._$contents = (collection as any as IList<T>).at(this._contentsIndex);
            this._contentsIndex = undefined;
         }
      }
      return this._$contents;
   }

   /**
    * Устанавливает содержимое элемента коллекции
    * @param contents Новое содержимое
    * @param [silent=false] Не уведомлять владельца об изменении содержимого
    */
   setContents(contents: T, silent?: boolean): void {
      if (this._$contents === contents) {
         return;
      }
      this._$contents = contents;
      if (!silent) {
         this._notifyItemChangeToOwner('contents');
      }
   }

   /**
    * Возвращает псевдоуникальный идентификатор элемента коллекции, основанный на значении опции {@link contents}.
    */
   getUid(): string {
      if (!this._$owner) {
         return;
      }
      return this._$owner.getItemUid(this);
   }

   /**
    * Возвращает признак, что элемент выбран
    */
   isSelected(): boolean {
      return this._$selected;
   }

   /**
    * Устанавливает признак, что элемент выбран
    * @param selected Элемент выбран
    * @param [silent=false] Не уведомлять владельца об изменении признака выбранности
    */
   setSelected(selected: boolean, silent?: boolean): void {
      if (this._$selected === selected) {
         return;
      }
      this._$selected = selected;
      if (!silent) {
         this._notifyItemChangeToOwner('selected');
      }
   }

   // endregion

   // region SerializableMixin

   _getSerializableState(state: IDefaultSerializableState): ISerializableState<T> {
      const resultState = SerializableMixin.prototype._getSerializableState.call(this, state) as ISerializableState<T>;

      if (resultState.$options.owner) {
         // save element index if collections implements Types/_collection/IList
         const collection = resultState.$options.owner.getCollection();
         const index = collection['[Types/_collection/IList]']
            ? (collection as any as IList<T>).getIndex(resultState.$options.contents)
            : -1;
         if (index > -1) {
            resultState.ci = index;
            delete resultState.$options.contents;
         }
      }

      // By performance reason. It will be restored at Collection::_setSerializableState
      // delete resultState.$options.owner;

      resultState.iid = this.getInstanceId();

      return resultState;
   }

   _setSerializableState(state: ISerializableState<T>): Function {
      const fromSerializableMixin = SerializableMixin.prototype._setSerializableState(state);
      return function(): void {
         fromSerializableMixin.call(this);
         if (state.hasOwnProperty('ci')) {
            this._contentsIndex = state.ci;
         }
         this._instanceId = state.iid;
      };
   }

   // endregion

   // region Protected

   /**
    * Возвращает коллекцию проекции
    * @protected
    */
   protected _getSourceCollection(): ISourceCollection<T> {
      return this.getOwner().getCollection();
   }

   /**
    * Генерирует событие у владельца об изменении свойства элемента
    * @param property Измененное свойство
    * @protected
    */
   protected _notifyItemChangeToOwner(property: string): void {
      if (this._$owner) {
         this._$owner.notifyItemChange(
            this,
            // @ts-ignore fix argument type
            property
         );
      }
   }

   // endregion
}

Object.assign(CollectionItem.prototype, {
   '[Types/_display/CollectionItem]': true,
   _moduleName: 'Types/display:CollectionItem',
   _$owner: null,
   _$contents: null,
   _$selected: false,
   _instancePrefix: 'collection-item-',
   _contentsIndex: undefined
});

register('Types/display:CollectionItem', CollectionItem);
