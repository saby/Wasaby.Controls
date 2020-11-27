import { mixin } from 'Types/util';
import TreeItem from './TreeItem';
import GridItemMixin from './GridItemMixin';
import GridColumn from './GridColumn';
import TreeGridColumn from 'Controls/_display/TreeGridColumn';

export default class TreeGridCollectionItem<T>
    extends mixin<TreeItem<any>, GridItemMixin<any>>(TreeItem, GridItemMixin) {
    readonly '[Controls/_display/TreeGridCollectionItem]': boolean;

    constructor(options: any) {
        super(options);
        GridItemMixin.call(this, options);
    }

    // region Expander

    shouldDisplayExpanderBlock(column: GridColumn<T>): boolean {
        const columnIndex = column.getColumnIndex();
        return columnIndex === 0;
    }

    protected _getGridColumnConstructor(): new (options: any) => TreeGridColumn<T> {
        return TreeGridColumn;
    }

    // endregion Expander

    // TODO duplicate code with GridCollectionItem. Нужно придумать как от него избавиться.
    //  Проблема в том, что mixin не умеет объединять одинаковые методы, а логику Grid мы добавляем через mixin
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

Object.assign(TreeGridCollectionItem.prototype, {
    '[Controls/_display/TreeGridCollectionItem]': true,
    _moduleName: 'Controls/display:TreeGridCollectionItem'
});
