import TreeGridDataRow from 'Controls/_treeGridNew/display/TreeGridDataRow';
import {GridCell} from "Controls/gridNew";
import { Model } from 'Types/entity';

export default class TreeGridGroupDataRow<T extends Model> extends TreeGridDataRow<T>{
    '[Controls/treeGrid:TreeGridGroupDataRow]': boolean;
    readonly Markable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly GroupNode: boolean = true;

    // region Expander

    getExpanderIcon(expanderIcon?: string): string {
        return 'hiddenNode';
    }

    getExpanderSize(expanderSize?: string): string {
        return 's';
    }

    shouldDisplayExpanderBlock(column: GridCell<T, TreeGridDataRow<T>>): boolean {
        return false;
    }

    // endregion Expander

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
