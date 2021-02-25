import TreeGridDataRow from 'Controls/_treeGridNew/display/TreeGridDataRow';
import {GridCell, IGridDataCellOptions, IItemTemplateParams} from 'Controls/gridNew';
import { Model } from 'Types/entity';
import {IColumn} from 'Controls/_grid/interface/IColumn';
import IGroupNode from '../interface/IGroupNode';

export default class TreeGridGroupDataRow<T extends Model> extends TreeGridDataRow<T> implements IGroupNode {
    '[Controls/treeGrid:TreeGridGroupDataRow]': boolean;
    readonly Markable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly LadderSupport: boolean = false;
    readonly GroupNode: boolean = true;

    // region overrides

    getItemClasses(params: IItemTemplateParams = { theme: 'default' }): string {
        params.highlightOnHover = false;
        let classes = super.getItemClasses(params);
        classes += ' controls-ListView__group';
        return classes;
    }

    setExpanded(expanded: boolean, silent?: boolean): void {
        super.setExpanded(expanded, silent);
        this._reinitializeColumns();
    }

    shouldDisplayExpanderBlock(column: GridCell<T, TreeGridDataRow<T>>): boolean {
        return false;
    }

    protected _getColumnFactoryParams(column: IColumn, columnIndex: number): Partial<IGridDataCellOptions<T>> {
        return {
            ...super._getColumnFactoryParams(column, columnIndex),
            isExpanded: this.isExpanded()
        };
    }

    getLevel(): number {
        const level = super.getLevel();
        return level - 1;
    }

    // endregion overrides
}

Object.assign(TreeGridGroupDataRow.prototype, {
    '[Controls/treeGrid:TreeGridGroupDataRow]': true,
    '[Controls/treeGrid:TreeGridDataRow]': true,
    '[Controls/_display/grid/Row]': true,
    '[Controls/_display/TreeItem]': true,
    _cellModule: 'Controls/treeGrid:TreeGridGroupDataCell',
    _moduleName: 'Controls/treeGrid:TreeGridDataRow',
    _$searchValue: '',
    _instancePrefix: 'tree-grid-group-row-'
});
