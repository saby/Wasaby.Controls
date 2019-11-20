import IItemsStrategy, {IOptions as IItemsStrategyOptions} from '../IItemsStrategy';
import Tree from '../Tree';
import TreeItem from '../TreeItem';
import BreadcrumbsItem from '../BreadcrumbsItem';
import {DestroyableMixin, SerializableMixin, ISerializableState} from 'Types/entity';
import {mixin} from 'Types/util';
import {Map} from 'Types/shim';

interface IOptions<S, T> {
    source: IItemsStrategy<S, T>;
}

interface ISortOptions<S, T extends TreeItem<S>> {
    originalBreadcrumbs: Map<T, BreadcrumbsItem<S>>;
    originalParents: Map<T, TreeItem<S>>;
    display: Tree<S, T>;
}

/**
 * Strategy-decorator which supposed to join expanded nodes into one element.
 * @class Controls/_display/ItemsStrategy/Search
 * @mixes Types/_entity/DestroyableMixin
 * @mixes Types/_entity/SerializableMixin
 * @implements Controls/_display/IItemsStrategy
 * @author Мальцев А.А.
 * @private
 */
export default class Search<S, T extends TreeItem<S> = TreeItem<S>> extends mixin<
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

    readonly '[Controls/_display/IItemsStrategy]': boolean = true;

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
    static sortItems<S, T extends TreeItem<S> = TreeItem<S>>(items: T[], options: ISortOptions<S, T>): T[] {
        const {display, originalBreadcrumbs, originalParents}: ISortOptions<S, T> = options;

        const sortedItems = [];
        let prevBreadCrumbs;
        items.forEach((item, index) => {
            if (item instanceof TreeItem) {
                // Restore original parent
                if (originalParents.has(item)) {
                    item.setParent(originalParents.get(item));
                    originalParents.delete(item);
                }

                if (item.isNode()) {
                    // Create breadcrumbs for each node even though it's not last in chain because it can be used later
                    if (!originalBreadcrumbs.has(item)) {
                        originalBreadcrumbs.set(item, new BreadcrumbsItem<S>({
                            contents: null,
                            owner: display,
                            last: item
                        }));
                    }

                    // Look at the next item after current node
                    const next = items[index + 1];
                    const nextIsTreeItem = next instanceof TreeItem;

                    // Restore original parent in next tree item
                    if (originalParents.has(next) && nextIsTreeItem) {
                        next.setParent(originalParents.get(next));
                        originalParents.delete(next);
                    }

                    // Check that the next tree item is a node with bigger level.
                    // If it's not that means we've reached the end of current breadcrumbs.
                    const isLastBreadcrumb = nextIsTreeItem && next.isNode() ?
                        item.getLevel() >= next.getLevel() :
                        true;

                    // Add completed breadcrumbs to show even empty
                    if (isLastBreadcrumb) {
                        prevBreadCrumbs = originalBreadcrumbs.get(item);
                        sortedItems.push(prevBreadCrumbs);
                    }

                    // Finish here for any node
                    return;
                }

                // Get breadcrumbs by leaf's parent
                const currentBreadcrumbs = originalBreadcrumbs.get(item.getParent() as T);
                if (currentBreadcrumbs) {
                    // Add actual breadcrumbs if it has been changed
                    if (currentBreadcrumbs !== prevBreadCrumbs) {
                        sortedItems.push(currentBreadcrumbs);
                    }

                    // This is a leaf outside breadcrumbs so set the current breadcrumbs as its parent.
                    // All leaves outside breadcrumbs should be at next level after breadcrumbs itself.
                    originalParents.set(item, item.getParent());
                    item.setParent(currentBreadcrumbs as any);
                }
                prevBreadCrumbs = currentBreadcrumbs;
            }

            sortedItems.push(item);
        });

        // Forget unused breadcrumbs
        const toDelete = [];
        originalBreadcrumbs.forEach((value, key) => {
            if (items.indexOf(key) === -1) {
                toDelete.push(key);
            }
        });
        toDelete.forEach((key) => originalBreadcrumbs.delete(key));

        return sortedItems;
    }

    // endregion
}

Object.assign(Search.prototype, {
    '[Controls/_display/itemsStrategy/Search]': true,
    _moduleName: 'Controls/display:itemsStrategy.Search',
    _originalBreadcrumbs: null,
    _originalParents: null
});
