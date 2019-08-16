import TreeItem from './TreeItem';
import {List, IListOptions} from '../collection';
import {register} from '../di';

export interface IOptions<T> extends IListOptions<T> {
   owner?: T;
}

/**
 * Список дочерних элементов узла дерева.
 * @class Types/_display/TreeChildren
 * @extends Types/_collection/List
 * @public
 * @author Мальцев А.А.
 */
export default class TreeChildren<S, T = TreeItem<S>> extends List<T> {
   /**
    * Узел-владелец
    */
   _$owner: TreeItem<S>;

   constructor(options: IOptions<T>) {
      super(options);

      if (!(this._$owner instanceof Object)) {
         throw new TypeError('Tree children owner should be an object');
      }
      if (!(this._$owner instanceof TreeItem)) {
         throw new TypeError('Tree children owner should be an instance of Types/display:TreeItem');
      }
   }

   /**
    * Возвращает узел-владелец
    * @return {Types/_display/TreeItem}
    */
   getOwner(): TreeItem<S> {
      return this._$owner;
   }

}

TreeChildren.prototype['[Types/_display/TreeChildren]'] = true;
TreeChildren.prototype._$owner = null;

register('Types/display:TreeChildren', TreeChildren);
