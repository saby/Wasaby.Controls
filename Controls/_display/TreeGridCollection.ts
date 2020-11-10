import TreeGridCollectionItem from 'Controls/_display/TreeGridCollectionItem';
import GridCollection from './GridCollection';
import Tree from './Tree';
import { ItemsFactory } from 'Controls/_display/Collection';
import IItemsStrategy from 'Controls/_display/IItemsStrategy';

export default class TreeGridCollection<S, T extends TreeGridCollectionItem<S> = TreeGridCollectionItem<S>>
    extends GridCollection<S, T> {

    private _tree: Tree<S, T>;

    constructor(options: any) {
        super(options);
        this._tree = new Tree(options);
        // TODO в super уже был такой вызов, нужно сделать один, иначе 2 раза все элементы пересоздаются
        this._reBuild(true);
    }

    getExpandedItems(): string[] {
        return this._tree.getExpandedItems();
    }

    getRoot(): any {
        return this._tree.getRoot();
    }

    resetExpandedItems(): void {
        return this._tree.resetExpandedItems();
    }

    setHasMoreStorage(): void {
        return this._tree.setHasMoreStorage();
    }

    getChildren(): [] {
        return [];
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const gridFactory = super._getItemsFactory();
        // TODO указать тип опций
        return (options: any) => {
            if (this._tree) {
                this._tree.getItemsFactory().call(this, options);
            }
            return gridFactory.call(this, options);
        };
    }
}

Object.assign(TreeGridCollection.prototype, {
    '[Controls/_display/TreeGridCollection]': true,
    _moduleName: 'Controls/display:TreeGridCollection',
    _itemModule: 'Controls/display:TreeGridCollectionItem'
});
