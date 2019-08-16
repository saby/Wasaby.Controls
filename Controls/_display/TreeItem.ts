import CollectionItem, {
   IOptions as ICollectionItemOptions,
   ISerializableState as ICollectionItemSerializableState
} from './CollectionItem';
import BreadcrumbsItem from './BreadcrumbsItem';
import Tree from './Tree';
import {register} from '../di';

export interface IOptions<T> extends ICollectionItemOptions<T> {
   owner: Tree<T>;
   node?: boolean;
   expanded?: boolean;
   hasChildren?: boolean;
   loaded?: boolean;
   parent?: Function;
}

interface ISerializableState<T> extends ICollectionItemSerializableState<T> {
   $options: IOptions<T>;
}

/**
 * Элемент древовидной коллеции
 * @class Types/_display/TreeItem
 * @extends Types/_display/CollectionItem
 * @public
 * @author Мальцев А.А.
 */
export default class TreeItem<T> extends CollectionItem<T> {
   protected _$owner: Tree<T>;

   /**
    * Родительский узел
    */
   protected _$parent: TreeItem<T> | BreadcrumbsItem<T>;

   /**
    * Является узлом
    */
   protected _$node: boolean;

   /**
    * Развернут или свернут узел. По умолчанию свернут.
    */
   protected _$expanded: boolean;

   /**
    * Есть ли дети у узла. По умолчанию есть.
    */
   protected _$hasChildren: boolean;

   /**
    * Название свойства, содержащего дочерние элементы узла. Используется для анализа на наличие дочерних элементов.
    */
   protected _$childrenProperty: string;

   constructor(options: IOptions<T>) {
      super(options);

      if (options && !options.hasOwnProperty('hasChildren') && options.hasOwnProperty('loaded')) {
         this._$hasChildren = !options.loaded;
      }

      this._$node = !!this._$node;
      this._$expanded = !!this._$expanded;
      this._$hasChildren = !!this._$hasChildren;
   }

   // region Public methods

   getOwner: () => Tree<T>;
   setOwner: (owner: Tree<T>) => void;

   /**
    * Возвращает родительский узел
    */
   getParent(): TreeItem<T> {
      return this._$parent as TreeItem<T>;
   }

   /**
    * Устанавливает родительский узел
    * @param parent Новый родительский узел
    */
   setParent(parent: TreeItem<T>): void {
      this._$parent = parent;
   }

   /**
    * Возвращает корневой элемент дерева
    */
   getRoot(): TreeItem<T> {
      const parent = this.getParent();
      if (parent === this) {
         return;
      }
      return parent ? parent.getRoot() : this;
   }

   /**
    * Является ли корнем дерева
    */
   isRoot(): boolean {
      return !this.getParent();
   }

   /**
    * Возвращает уровень вложенности относительно корня
    */
   getLevel(): number {
      const parent = this._$parent;
      if (parent) {
         // FIXME: Here is an error: if parent is a root, it causes root items to have 1 level value nevertheless of
         // isRootEnumerable() result. Root items should have 0 level if root is not enumerable.
         return (parent instanceof TreeItem || parent instanceof BreadcrumbsItem ? parent.getLevel() : 0) + 1;
      }

      const owner = this.getOwner();
      return owner && owner.isRootEnumerable() ? 1 : 0;
   }

   /**
    * Возвращает признак, является ли элемент узлом
    */
   isNode(): boolean {
      return this._$node;
   }

   /**
    * Устанавливает признак, является ли элемент узлом
    * @param node Является ли элемент узлом
    */
   setNode(node: boolean): void {
      this._$node = node;
   }

   /**
    * Возвращает признак, что узел развернут
    */
   isExpanded(): boolean {
      return this._$expanded;
   }

   /**
    * Устанавливает признак, что узел развернут или свернут
    * @param expanded Развернут или свернут узел
    * @param [silent=false] Не генерировать событие
    */
   setExpanded(expanded: boolean, silent?: boolean): void {
      if (this._$expanded === expanded) {
         return;
      }
      this._$expanded = expanded;
      if (!silent) {
         this._notifyItemChangeToOwner('expanded');
      }
   }

   /**
    * Переключает признак, что узел развернут или свернут
    */
   toggleExpanded(): void {
      this.setExpanded(!this.isExpanded());
   }

   /**
    * Возвращает признак наличия детей у узла
    */
   isHasChildren(): boolean {
      return this._$hasChildren;
   }

   /**
    * Устанавливает признак наличия детей у узла
    */
   setHasChildren(value: boolean): void {
      this._$hasChildren = value;
   }

   isLoaded(): boolean {
      return !this._$hasChildren;
   }

   setLoaded(value: boolean): void {
      this._$hasChildren = !value;
   }

   /**
    * Возвращает название свойства, содержащего дочерние элементы узла
    */
   getChildrenProperty(): string {
      return this._$childrenProperty;
   }

   // region SerializableMixin

   _getSerializableState(state: ICollectionItemSerializableState<T>): ISerializableState<T> {
      const resultState = super._getSerializableState(state) as ISerializableState<T>;

      // It's too hard to serialize context related method. It should be restored at class that injects this function.
      if (typeof resultState.$options.parent === 'function') {
         delete resultState.$options.parent;
      }

      return resultState;
   }

   _setSerializableState(state: ISerializableState<T>): Function {
      const fromSuper = super._setSerializableState(state);
      return function(): void {
         fromSuper.call(this);
      };
   }

   // endregion

   // region Protected methods

   /**
    * Генерирует событие у владельца об изменении свойства элемента.
    * Помимо родительской коллекции уведомляет также и корневой узел дерева.
    * @param property Измененное свойство
    * @protected
    */
   protected _notifyItemChangeToOwner(property: string): void {
      super._notifyItemChangeToOwner(property);

      const root = this.getRoot();
      const rootOwner = root ? root.getOwner() : undefined;
      if (rootOwner && rootOwner !== this._$owner) {
         rootOwner.notifyItemChange(this, {property});
      }
   }

   // endregion
}

Object.assign(TreeItem.prototype, {
   '[Types/_display/TreeItem]': true,
   _moduleName: 'Types/display:TreeItem',
   _$parent: undefined,
   _$node: false,
   _$expanded: false,
   _$hasChildren: true,
   _$childrenProperty: '',
   _instancePrefix: 'tree-item-'
});

register('Types/display:TreeItem', TreeItem);
