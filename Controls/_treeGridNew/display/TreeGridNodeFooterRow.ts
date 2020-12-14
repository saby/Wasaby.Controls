import TreeGridDataRow from 'Controls/_treeGridNew/display/TreeGridDataRow';
import { TemplateFunction } from 'UI/Base';
import { TreeItem } from 'Controls/display';
import TreeGridNodeFooterCell from 'Controls/_treeGridNew/display/TreeGridNodeFooterCell';

export default class TreeGridNodeFooterRow<S> extends TreeGridDataRow<S> {
    readonly Markable: boolean = false;

    readonly '[Controls/treeGrid:TreeGridNodeFooterRow]': boolean;

    getNode(): TreeItem<S> {
        return this.getParent();
    }

    getColumns(colspan: boolean|undefined): Array<TreeGridNodeFooterCell<S, TreeGridNodeFooterRow<S>>> {
        const columns = super.getColumns();
        return colspan !== false ? [columns[0]] : columns;
    }

    hasMoreStorage(): boolean {
        return this.getNode().hasMoreStorage();
    }

    getTemplate(): TemplateFunction | string {
        return this._$owner.getNodeFooterTemplate() || 'Controls/treeGridNew:NodeFooterTemplate';
    }

    getNodeFooterTemplateMoreButton(): TemplateFunction {
        return this._$owner.getNodeFooterTemplateMoreButton();
    }

    getItemClasses(): string {
        return 'controls-Grid__row controls-TreeGrid__nodeFooter';
    }

    getExpanderPaddingClasses(tmplExpanderSize: string, theme: string = 'default'): string {
        let classes = super.getExpanderPaddingClasses(tmplExpanderSize, theme);

        classes = classes.replace(
           `controls-TreeGrid__row-expanderPadding_theme-${theme}`,
           `controls-TreeGrid__node-footer-expanderPadding_theme-${theme}`
        );

        return classes;
    }
}

Object.assign(TreeGridNodeFooterRow.prototype, {
    '[Controls/treeGrid:TreeGridNodeFooterRow]': true,
    _moduleName: 'Controls/treeGrid:TreeGridNodeFooterRow',
    _cellModule: 'Controls/treeGrid:TreeGridNodeFooterCell',
    _instancePrefix: 'tree-grid-node-footer-row-'
});
