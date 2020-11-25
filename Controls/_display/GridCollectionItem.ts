import CollectionItem, { IOptions as IBaseOptions } from './CollectionItem';
import GridCollection from './GridCollection';
import { TColumns } from 'Controls/grid';
import { mixin } from 'Types/util';
import GridItemMixin from 'Controls/_display/GridItemMixin';

export interface IOptions<T> extends IBaseOptions<T> {
    owner: GridCollection<T>;
    columns: TColumns;
}

export default class GridCollectionItem<T>
    extends mixin<CollectionItem<any>, GridItemMixin<any>>(CollectionItem, GridItemMixin) {
    readonly '[Controls/_display/GridCollectionItem]': boolean;

    constructor(options?: IOptions<T>) {
        super(options);
        GridItemMixin.call(this, options);
    }

    // region overrides

    setMultiSelectVisibility(multiSelectVisibility: string): boolean {
        const isChangedMultiSelectVisibility = super.setMultiSelectVisibility(multiSelectVisibility);
        if (isChangedMultiSelectVisibility) {
            this._reinitializeColumns();
        }
        return isChangedMultiSelectVisibility;
    }

    setMarked(marked: boolean, silent?: boolean): void {
        const changed = marked !== this.isMarked();
        super.setMarked(marked, silent);
        if (changed) {
            this._redrawColumns('first');
        }
    }

    setSelected(selected: boolean|null, silent?: boolean): void {
        const changed = this._$selected !== selected;
        super.setSelected(selected, silent);
        if (changed) {
            this._redrawColumns('first');
        }
    }

    setActive(active: boolean, silent?: boolean): void {
        const changed = active !== this.isActive();
        super.setActive(active, silent);
        if (changed) {
            this._redrawColumns('all');
        }
    }

    // endregion
}

Object.assign(GridCollectionItem.prototype, {
    '[Controls/_display/GridCollectionItem]': true,
    _moduleName: 'Controls/display:GridCollectionItem',
    _instancePrefix: 'grid-item-'
});
