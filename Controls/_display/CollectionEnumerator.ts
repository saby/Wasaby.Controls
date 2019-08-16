import {DestroyableMixin, OptionsToPropertyMixin} from '../entity';
import {IEnumerator, IndexedEnumeratorMixin} from '../collection';
import {mixin} from '../util';

/**
 * Энумератор для проекции коллекции
 * @class Types/_display/CollectionEnumerator
 * @mixes Types/_entity/DestroyableMixin
 * @mixes Types/_entity/OptionsMixin
 * @implements Types/_collection/IEnumerator
 * @mixes Types/_collection/IndexedEnumeratorMixin
 * @public
 * @author Мальцев А.А.
 */
export default class CollectionEnumerator<T> extends mixin<
   DestroyableMixin,
   OptionsToPropertyMixin,
   IndexedEnumeratorMixin<any>
>(
   DestroyableMixin,
   OptionsToPropertyMixin,
   IndexedEnumeratorMixin
) implements IEnumerator<T> {
   protected readonly _moduleName: string;

   get items(): T[] {
      if (!this._itemsCache) {
         this._itemsCache = this._$items instanceof Function ? this._$items() : this._$items;
      }
      return this._itemsCache;
   }

   // region IEnumerator

   readonly '[Types/_collection/IEnumerator]': boolean = true;
   /**
    * Элементы проекции
    */
   protected _$items: T[] | Function = [];

   /**
    * Результат применения фильтра
    */
   protected _$filterMap: boolean[] = [];

   /**
    * Результат применения сортировки
    */
   protected _$sortMap: number[] = [];

   /**
    * Кэш элементов проекции
    */
   protected _itemsCache: T[];

   /**
    * Текущая позиция
    */
   protected _position: number;

   /**
    * Текущий элемент
    */
   protected _current: T;

   /**
    * Порядковый индекс -> индекс элемента проекции
    */
   protected _internalToSource: number[];

   /**
    * Индекс элемента проекции -> Порядковый индекс
    */
   protected _sourceToInternal: number[] = [];

   constructor(options: object) {
      super();
      OptionsToPropertyMixin.call(this, options);
      IndexedEnumeratorMixin.call(this);

      if (!(this._$items instanceof Array) && !(this._$items instanceof Function)) {
         throw new TypeError(this._moduleName + '::constructor(): items should be instance of an Array or Function');
      }
      if (!(this._$filterMap instanceof Array)) {
         throw new TypeError(this._moduleName + '::constructor(): filter map should be instance of an Array');
      }
      if (!(this._$sortMap instanceof Array)) {
         throw new TypeError(this._moduleName + '::constructor(): sort map should be instance of an Array');
      }
   }

   // endregion

   // region Statics

   /**
    * Возвращает массив соответствия порядкового индекса и индекса элемента проекции
    * @param sortMap Индекс после сортировки -> индекс элемента проекции
    * @param filterMap Индекс элемента проекции -> прошел фильтр
    * @return Порядковый индекс -> индекс элемента проекции
    * @public
    * @static
    */
   static getAssociativeMap(sortMap: number[], filterMap: boolean[]): number[] {
      const result = [];
      let index;

      for (let i = 0; i < sortMap.length; i++) {
         index = sortMap[i];
         if (filterMap[index]) {
            result.push(index);
         }
      }

      return result;
   }

   getCurrent(): T {
      return this._current;
   }

   getCurrentIndex(): number {
      return this._position;
   }

   reset(): void {
      this._itemsCache = null;
      this._position = -1;
      this._setCurrentByPosition();
   }

   // endregion

   // region IndexedEnumeratorMixin

   reIndex(action?: string, start?: number, count?: number): void {
      super.reIndex.call(this, action, start, count);
      this._itemsCache = null;
      this._internalToSource = null;
      this._sourceToInternal = [];
      this._position = -1;
      if (this._current) {
         this._setPositionByCurrent();
      }
   }

   _createIndex(property: string): void {
      const savedPosition = this._position;
      const savedCurrent = this._current;
      super._createIndex.call(this, property);
      this._position = savedPosition;
      this._current = savedCurrent;
   }

   // endregion

   // region Public methods

   /**
    * Возвращает элемент по индексу
    * @param index Индекс
    * @state mutable
    */
   at(index: number): T {
      return index === undefined
         ? undefined
         : this.items[this.getSourceByInternal(index)];
   }

   /**
    * Возвращает кол-во элементов
    */
   getCount(): number {
      this._initInternalMap();
      return this._internalToSource.length;
   }

   /**
    * Устанавливает текущий элемент
    * item Текущий элемент
    */
   setCurrent(item: T): void {
      this._itemsCache = null;
      this._position = this.getInternalBySource(this.items.indexOf(item));
      this._setCurrentByPosition();
   }

   /**
    * Возвращает текущую позицию проекции
    */
   getPosition(): number {
      return this._position;
   }

   /**
    * Устанавливает текущую позицию
    * @param position Позиция проекции
    */
   setPosition(position: number): void {
      this._itemsCache = null;
      this._checkPosition(position);
      this._position = position;
      this._setCurrentByPosition();
   }

   /**
    * Возвращает признак корректности позиции
    * @param position Позиция
    */
   isValidPosition(position: number): boolean {
      return position >= -1 && position < this.getCount();
   }

   /**
    * Сдвигает позицию на предыдущий элемент
    */
   movePrevious(): boolean {
      if (this._position < 1) {
         return false;
      }
      this._position--;
      this._setCurrentByPosition();
      return true;
   }

   moveNext(): boolean {
      if (this._position >= this.getCount() - 1) {
         return false;
      }
      this._position++;
      this._setCurrentByPosition();
      return true;
   }

   /**
    * Вычисляет позицию в проекции относительно позиции в коллекции
    * @param source Позиция в коллекции
    */
   getInternalBySource(source: number): number {
      if (source === undefined || source === null || source === -1) {
         return source;
      }
      this._initInternalMap();

      if (this._sourceToInternal[source] === undefined) {
         this._sourceToInternal[source] = this._internalToSource.indexOf(source);
      }
      return this._sourceToInternal[source];
   }

   /**
    * Вычисляет позицию в исходной коллекции относительно позиции в проекции
    * @param internal Позиция в проекции
    * @protected
    */
   getSourceByInternal(internal: number): number {
      if (internal === undefined || internal === null || internal === -1) {
         return internal;
      }
      this._initInternalMap();
      return this._internalToSource[internal];
   }

   // endregion

   // region Protected methods

   /**
    * Инициализирует массив соответствия позиций проекции и исходной коллекции
    * @protected
    */
   protected _initInternalMap(): void {
      if (this._internalToSource === null) {
         this._internalToSource = CollectionEnumerator.getAssociativeMap(this._$sortMap, this._$filterMap);
      }
   }

   /**
    * Проверяет корректность позиции
    * @param position Позиция
    * @protected
    */
   protected _checkPosition(position: number): void {
      if (!this.isValidPosition(position)) {
         throw new Error(`${this._moduleName}: position is out of bounds`);
      }
   }

   /**
    * Устанавливает текущий элемент исходя из позиции
    * @protected
    */
   protected _setCurrentByPosition(): void {
      this._current = this._position > -1
         ? this.items[this.getSourceByInternal(this._position)]
         : undefined;
   }

   /**
    * Устанавливает позицию исходя из текущего элемента
    * @protected
    */
   protected _setPositionByCurrent(): void {
      this._position = -1;
      const index = this._current ? this.items.indexOf(this._current) : -1;
      if (
         index > -1 &&
         this._$filterMap[index]
      ) {
         this._position = this.getInternalBySource(index);
      } else {
         this._current = undefined;
      }
   }

   // endregion
}

Object.assign(CollectionEnumerator.prototype, {
   '[Types/_display/CollectionEnumerator]': true,
   _$items: null,
   _$filterMap: null,
   _$sortMap: null,
   _itemsCache: null,
   _position: -1,
   _current: undefined,
   _internalToSource: null,
   _sourceToInternal: null
});
