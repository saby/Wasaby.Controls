import Tree from './Tree';
import { mixin } from 'Types/util';
import GridMixin from './GridMixin';
import TreeGridCollectionItem from './TreeGridCollectionItem';
import * as GridLadderUtil from 'Controls/_display/utils/GridLadderUtil';
import { ItemsFactory } from 'Controls/_display/Collection';
import { IOptions as IGridCollectionItemOptions } from 'Controls/_display/GridCollectionItem';
import GridGroupItem from 'Controls/_display/GridGroupItem';

export default class TreeGridCollection<S, T extends TreeGridCollectionItem<S> = TreeGridCollectionItem<S>>
    extends mixin<Tree<any>, GridMixin<any, any>>(Tree, GridMixin) {
    readonly '[Controls/_display/TreeGridCollection]': boolean;

    constructor(options: any) {
        super(options);
        GridMixin.call(this, options);
    }

    // TODO duplicate code with GridCollection
    // region override

    setMultiSelectVisibility(visibility: string): void {
        super.setMultiSelectVisibility(visibility);
        this._$colgroup?.reBuild();
    }

    protected _reBuild(reset?: boolean): void {
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties) && !!this._$ladder) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
        }
        super._reBuild(reset);
        this._$colgroup?.reBuild();
    }

    setIndexes(start: number, stop: number): void {
        super.setIndexes(start, stop);
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties)) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }
        this._updateItemsColumns();
    }

    protected _handleAfterCollectionChange(): void {
        super._handleAfterCollectionChange();
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties)) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return function CollectionItemsFactory(options?: IGridCollectionItemOptions<S>): T {
            options.columns = this._$columns;
            return superFactory.call(this, options);
        };
    }

    protected _getGroupItemConstructor(): new() => GridGroupItem<T> {
        return GridGroupItem;
    }

    // endregion
}

Object.assign(TreeGridCollection.prototype, {
    '[Controls/_display/TreeGridCollection]': true,
    _moduleName: 'Controls/display:TreeGridCollection',
    _itemModule: 'Controls/display:TreeGridCollectionItem'
});
