import Collection, { ItemsFactory, IOptions as IBaseOptions } from './Collection';
import GridGroupItem from './GridGroupItem';
import * as GridLadderUtil from './utils/GridLadderUtil';
import { mixin } from 'Types/util';
import GridMixin, { IGridMixinOptions } from 'Controls/_display/GridMixin';
import GridRow, {IOptions as IGridRowOptions} from 'Controls/_display/GridRow';

export interface IOptions<
    S,
    T extends GridRow<S> = GridRow<S>
> extends IBaseOptions<S, T>, IGridMixinOptions { }

export default class GridCollection<
    S,
    T extends GridRow<S> = GridRow<S>
> extends mixin<Collection<any>, GridMixin<any, any>>(Collection, GridMixin) {
    constructor(options: IOptions<S, T>) {
        super(options);
        GridMixin.call(this, options);
    }

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
        return function CollectionItemsFactory(options?: IGridRowOptions<S>): T {
            options.columns = this._$columns;
            return superFactory.call(this, options);
        };
    }

    protected _getGroupItemConstructor(): new() => GridGroupItem<T> {
        return GridGroupItem;
    }

    // endregion
}

Object.assign(GridCollection.prototype, {
    '[Controls/_display/GridCollection]': true,
    _moduleName: 'Controls/display:GridCollection',
    _itemModule: 'Controls/display:GridDataRow'
});
