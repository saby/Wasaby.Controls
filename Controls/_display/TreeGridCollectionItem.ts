import { mixin } from 'Types/util';
import TreeItem from './TreeItem';
import GridItemMixin from './GridItemMixin';
import GridColumn from './GridColumn';

export default class TreeGridCollectionItem<T>
    extends mixin<TreeItem<any>, GridItemMixin<any>>(TreeItem, GridItemMixin) {
    readonly '[Controls/_display/TreeGridCollectionItem]': boolean;

    constructor(options: any) {
        super(options);
        GridItemMixin.call(this, options);
    }

    // TODO
    // region Expander

    shouldDisplayExpanderBlock(column: GridColumn<T>): boolean {
        const columnIndex = column.getColumnIndex();
        return columnIndex === 0;
    }

    shouldDisplayExpander(expanderIcon: string): boolean {
        if (this.getExpanderIcon(expanderIcon) === 'none' || this.isNode() === false) {
            return false;
        }

        return (this._$expanderVisibility === 'visible' || this.isHasChildren());
    }

    // endregion

    // TODO дублирование кода с GridCollectionItem
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
/*
    protected _initializeColumns(): void {
        super._initializeColumns();

        if (this._$columns) {
            const hasMultiSelectColumn = this._$columnItems[0] instanceof GridCheckboxColumn;
            const expanderColumnIndex = hasMultiSelectColumn ? 1 : 0;
            const expanderColumn = new ExpanderColumn({
                column: {} as IColumn,
                owner: this,
                expanderTemplate: this.getExpanderTemplate(),
                expanderIcon: this.getExpanderIcon(),
                expanderSize: this.getExpanderSize(),
                expanderPosition: this.getExpanderPosition(),
                expanderVisibility: this.getExpanderVisibility()
            });
            this._$columnItems.splice(expanderColumnIndex, 0, expanderColumn);
        }
    }*/
}

Object.assign(TreeGridCollectionItem.prototype, {
    '[Controls/_display/TreeGridCollectionItem]': true,
    _moduleName: 'Controls/display:TreeGridCollectionItem'
});
