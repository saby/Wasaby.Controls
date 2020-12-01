import TreeGridRow from 'Controls/_display/TreeGridRow';
import { TemplateFunction } from 'UI/Base';
import TreeItem from 'Controls/_display/TreeItem';
import TreeGridNodeFooterCell from 'Controls/_display/TreeGridNodeFooterCell';

export default class TreeGridNodeFooterRow<S> extends TreeGridRow<S> {
    readonly MarkableItem: boolean = false;

    readonly '[Controls/display:TreeGridNodeFooterRow]': boolean;

    getNode(): TreeItem<S> {
        return this.getParent();
    }

    getColumns(colspan: boolean|undefined): Array<TreeGridNodeFooterCell<any, TreeGridNodeFooterRow<any>>> {
        const columns = super.getColumns();
        return colspan !== false ? [columns[0]] : columns;
    }

    hasMoreStorage(): boolean {
        return this.getNode().hasMoreStorage();
    }

    getItemTemplate(): TemplateFunction | string {
        return this._$owner.getNodeFooterTemplate() || 'Controls/treeGridNew:NodeFooterTemplate';
    }

    getNodeFooterTemplateMoreButton(): TemplateFunction {
        return this._$owner.getNodeFooterTemplateMoreButton();
    }

    getItemClasses(
        templateHighlightOnHover: boolean = true,
        theme: string = 'default',
        style: string = 'default',
        cursor: string = 'pointer',
        clickable: boolean = true
    ): string {
        return 'controls-Grid__row controls-TreeGrid__nodeFooter';
    }
}

Object.assign(TreeGridNodeFooterRow.prototype, {
    '[Controls/display:TreeGridNodeFooterRow]': true,
    _moduleName: 'Controls/display:TreeGridNodeFooterRow',
    _cellModule: 'Controls/display:TreeGridNodeFooterCell',
    _instancePrefix: 'tree-grid-node-footer-row'
});
