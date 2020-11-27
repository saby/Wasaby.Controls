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

    getRightPadding(): string {
        return this._$owner.getRightPadding().toLowerCase();
    }

    getItemSpacing(): { left: string, right: string, row: string } {
        return {
            left: this._$owner.getLeftPadding().toLowerCase(),
            right: this._$owner.getRightPadding().toLowerCase(),
            row: this._$owner.getTopPadding().toLowerCase()
        };
    }

    getHoverBackgroundStyle(): string {
        return this._$owner.getHoverBackgroundStyle();
    }

    getEditingBackgroundStyle(): string {
        return this._$owner.getEditingBackgroundStyle();
    }

    getHeader(): GridHeader<T> {
        return this._$owner.getHeader();
    }

    getResultsPosition(): TResultsPosition {
        return this._$owner.getResultsPosition();
    }

    getStickyLadderProperties(column: IColumn): string[] {
        let stickyProperties = column && column.stickyProperty;
        if (stickyProperties && !(stickyProperties instanceof Array)) {
            stickyProperties = [stickyProperties];
        }
        return stickyProperties as string[];
    }
    shouldDrawLadderContent(ladderProperty: string, stickyProperty: string): boolean {
        const stickyLadder = this.getStickyLadder();
        const stickyProperties = this.getStickyLadderProperties(this._$columns[0]);

        if (!stickyLadder) {
            return true;
        }

        const index = stickyProperties.indexOf(stickyProperty);
        const hasMainCell = !!(stickyLadder[stickyProperties[0]].ladderLength);

        if (!this.getOwner().getItemsDragNDrop() && stickyProperty && ladderProperty && stickyProperty !== ladderProperty && (
            index === 1 && !hasMainCell || index === 0 && hasMainCell)) {
            return false;
        }
        return true;
    }
    getLadderWrapperClasses(ladderProperty: string, stickyProperty: string): string {
        let ladderWrapperClasses = 'controls-Grid__row-cell__ladder-content';
        const ladder = this.getLadder();
        const stickyLadder = this.getStickyLadder();
        const stickyProperties = this.getStickyLadderProperties(this._$columns[0]);
        const index = stickyProperties?.indexOf(stickyProperty);
        const hasMainCell = stickyLadder && !!(stickyLadder[stickyProperties[0]].ladderLength);

        if (stickyProperty && ladderProperty && stickyProperty !== ladderProperty && (
            index === 1 && !hasMainCell || index === 0 && hasMainCell)) {
            ladderWrapperClasses += ' controls-Grid__row-cell__ladder-content_displayNoneForLadder';
        }

        if (stickyProperty === ladderProperty && index === 1 && hasMainCell) {
            ladderWrapperClasses += ' controls-Grid__row-cell__ladder-content_additional-with-main';
        }

        if (!ladder || !ladder[ladderProperty] || (stickyProperty === ladderProperty || !stickyProperty) && ladder[ladderProperty].ladderLength >= 1) {

        } else {
            ladderWrapperClasses += ' controls-Grid__row-cell__ladder-content_hiddenForLadder';
        }
        return ladderWrapperClasses;
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
