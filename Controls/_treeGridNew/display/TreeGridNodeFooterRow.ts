import { TemplateFunction } from 'UI/Base';
import { TreeItem } from 'Controls/display';
import { Model } from 'Types/entity';
import TreeGridDataRow from './TreeGridDataRow';

export default class TreeGridNodeFooterRow extends TreeGridDataRow<null> {
    readonly Markable: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly SelectableItem: boolean = false;

    readonly '[Controls/treeGrid:TreeGridNodeFooterRow]': boolean;

    getNode(): TreeItem<Model> {
        return this.getParent();
    }

    // TODO нужно указывать тип TreeGridNodeFooterCell[], но тогда получается циклическая зависимость
    getColumns(colspan?: boolean): any[] {
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

    getExpanderPaddingClasses(tmplExpanderSize?: string, theme: string = 'default'): string {
        let classes = super.getExpanderPaddingClasses(tmplExpanderSize, theme);

        classes = classes.replace(
           `controls-TreeGrid__row-expanderPadding_theme-${theme}`,
           `controls-TreeGrid__node-footer-expanderPadding_theme-${theme}`
        );

        return classes;
    }

    shouldDisplayVisibleFooter(content: TemplateFunction): boolean {
        return this.hasMoreStorage() || !!content;
    }
}

Object.assign(TreeGridNodeFooterRow.prototype, {
    '[Controls/treeGrid:TreeGridNodeFooterRow]': true,
    _moduleName: 'Controls/treeGrid:TreeGridNodeFooterRow',
    _cellModule: 'Controls/treeGrid:TreeGridNodeFooterCell',
    _instancePrefix: 'tree-grid-node-footer-row-'
});
