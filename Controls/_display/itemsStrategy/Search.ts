import IItemsStrategy, {IOptions as IItemsStrategyOptions} from '../IItemsStrategy';
import Tree from '../Tree';
import TreeItem from '../TreeItem';
import BreadcrumbsItem from '../BreadcrumbsItem';
import {DestroyableMixin, SerializableMixin, ISerializableState} from '../../entity';
import {mixin} from '../../util';
import {Map} from '../../shim';

interface IOptions<S, T> {
   source: IItemsStrategy<S, T>;
}

interface ISortOptions<S, T> {
   originalBreadcrumbs: Map<T, BreadcrumbsItem<S>>;
   originalParents: Map<T, TreeItem<S>>;
   display: Tree<S, T>;
}

/**
 * Strategy-decorator which supposed to join expanded nodes into one element.
 * @class Types/_display/ItemsStrategy/Search
 * @mixes Types/_entity/DestroyableMixin
 * @implements Types/_display/IItemsStrategy
 * @mixes Types/_entity/SerializableMixin
 * @author Мальцев А.А.
 */
export default class Search<S, T> extends mixin<
   DestroyableMixin,
   SerializableMixin
>(
   DestroyableMixin,
   SerializableMixin
) implements IItemsStrategy<S, T> {
   /**
    * Constructor options
    */
   protected _options: IOptions<S, T>;

   /**
    * Original parents: item -> its breadcrumbs
    */
   protected _originalBreadcrumbs: Map<T, BreadcrumbsItem<S>> = new Map<T, BreadcrumbsItem<S>>();

    /**
     * Original parents: item -> original parent
     */
    protected _originalParents: Map<T, TreeItem<S>> = new Map<T, TreeItem<S>>();

   constructor(options: IOptions<S, T>) {
      super();
      this._options = options;
   }

   destroy(): void {
      super.destroy();
      this._originalBreadcrumbs = null;
      this._originalParents = null;
   }

   // region IItemsStrategy

   readonly '[Types/_display/IItemsStrategy]': boolean = true;

   get options(): IItemsStrategyOptions<S, T> {
      return this.source.options;
   }

   get source(): IItemsStrategy<S, T> {
      return this._options.source;
   }

   get count(): number {
      return this._getItems().length;
   }

   get items(): T[] {
      return this._getItems();
   }

   at(index: number): T {
      return this._getItems()[index];
   }

   splice(start: number, deleteCount: number, added?: S[]): T[] {
      return this.source.splice(start, deleteCount, added);
   }

   reset(): void {
      return this.source.reset();
   }

   invalidate(): void {
      return this.source.invalidate();
   }

   getDisplayIndex(index: number): number {
      const sourceIndex = this.source.getDisplayIndex(index);
      const sourceItem = this.source.items[sourceIndex];
      const items = this._getItems();
      const itemIndex = items.indexOf(sourceItem);

      return itemIndex === -1 ? items.length : itemIndex;
   }

   getCollectionIndex(index: number): number {
      const items = this._getItems();
      const item = items[index];
      const sourceIndex = this.source.items.indexOf(item);

      return sourceIndex >= 0 ? this.source.getCollectionIndex(sourceIndex) : -1;
   }

   // endregion

   // region SerializableMixin

   _getSerializableState(state: ISerializableState): ISerializableState {
      const resultState = SerializableMixin.prototype._getSerializableState.call(this, state);

      resultState.$options = this._options;

      return resultState;
   }

   _setSerializableState(state: ISerializableState): Function {
      const fromSerializableMixin = SerializableMixin.prototype._setSerializableState(state);
      return function(): void {
         fromSerializableMixin.call(this);
      };
   }

   // endregion

   // region Protected

   /**
    * Returns elements of display
    * @protected
    */
   protected _getItems(): T[] {
      return Search.sortItems<S, T>(this.source.items, {
         originalBreadcrumbs: this._originalBreadcrumbs,
         originalParents: this._originalParents,
         display: this.options.display as Tree<S, T>
      });
   }

   // endregion

   // region Statics

   /**
    * Returns items in sorted order and by the way joins nodes into breadcrumbs.
    * @param items Display items
    * @param options Options
    */
   static sortItems<S, T>(items: T[], options: ISortOptions<S, T>): T[] {
      const display = options.display;
      const originalBreadcrumbs = options.originalBreadcrumbs;
      const originalParents = options.originalParents;
      const dump = {};

      let currentBreadcrumbs = null;
      let breadcrumbsLevel = null;

      const sortedItems = items.map((item, index) => {
         if (item instanceof TreeItem) {
            if (originalParents.has(item)) {
               item.setParent(originalParents.get(item));
               originalParents.delete(item);
            }

            if (item.isNode()) {
               // Look at the next item
               const next = items[index + 1];

               if (originalParents.has(next) && next instanceof TreeItem) {
                  next.setParent(originalParents.get(next));
                  originalParents.delete(next);
               }

               // Remember the level of the first breadcrumb item
               if (currentBreadcrumbs === null && breadcrumbsLevel === null) {
                   breadcrumbsLevel = item.getLevel();
               }

                // Check that the next item is the node with bigger level.
               // If it's not true that means we reach the last item in current breadcrumbs.
               const isLastBreadcrumb = next instanceof TreeItem && next.isNode() ?
                  item.getLevel() >= next.getLevel() :
                  true;
               if (isLastBreadcrumb) {
                   // If there is no next breadcrumb item let's define current breadcrumbs

                  // Try to use previously created instance if possible
                  if (originalBreadcrumbs.has(item)) {
                      currentBreadcrumbs = originalBreadcrumbs.get(item);
                  } else {
                      currentBreadcrumbs = new BreadcrumbsItem<S>({
                          contents: null,
                          owner: display as any,
                          last: item
                      });
                      originalBreadcrumbs.set(item, currentBreadcrumbs);
                  }

                  // Return completed breadcrumbs
                  return currentBreadcrumbs;
               }

               // If there is previously created instance for this node - forget it
               if (originalBreadcrumbs.has(item)) {
                  currentBreadcrumbs = originalBreadcrumbs.delete(item);
               }

               // This item is not the last node inside the breadcrumbs, therefore skip it and wait for the last node
               currentBreadcrumbs = null;
               return dump;
            } else if (item.getLevel() <= breadcrumbsLevel) {
                currentBreadcrumbs = null;
                breadcrumbsLevel = 0;
            }

            // This is an item outside breadcrumbs so set the current breadcrumbs as its parent.
            // All items outside breadcrumbs should be at first level after breadcrumbs itself.
            if (currentBreadcrumbs) {
                originalParents.set(item, item.getParent());
                item.setParent(currentBreadcrumbs);
            }
         }

         return item;
      }).filter((item) => {
         // Skip nodes included into breadcrumbs
         return item !== dump;
      });

      return sortedItems;
   }

   // endregion
}

Object.assign(Search.prototype, {
   '[Types/_display/itemsStrategy/Search]': true,
   _moduleName: 'Types/display:itemsStrategy.Search',
   _originalBreadcrumbs: null,
   _originalParents: null
});
