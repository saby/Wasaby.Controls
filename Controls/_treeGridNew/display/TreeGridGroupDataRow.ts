import TreeGridDataRow from 'Controls/_treeGridNew/display/TreeGridDataRow';
import {GridCell, IItemTemplateParams} from "Controls/gridNew";
import { Model } from 'Types/entity';

export default class TreeGridGroupDataRow<T extends Model> extends TreeGridDataRow<T>{
    '[Controls/treeGrid:TreeGridGroupDataRow]': boolean;
    readonly Markable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly GroupNode: boolean = true;

    // region Row

    getItemClasses(params: IItemTemplateParams = { theme: 'default' }): string {
        let classes = super.getItemClasses(params);
        classes += ' controls-ListView__group';
        return classes;
    }

    // endregion Row

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

    // region treeItem

    // Смещаем все дочерние уровни на -1
    getLevel(): number {
        const level = super.getLevel();
        return level - 1;
    }

    // endregion treeItem
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
