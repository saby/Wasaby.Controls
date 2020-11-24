import { mixin } from 'Types/util';
import GridCollectionItem from './GridCollectionItem';
import TreeItem from './TreeItem';
import { TemplateFunction } from 'UI/Base';

export default class TreeGridCollectionItem<T>
    extends mixin<GridCollectionItem<any>, TreeItem<any>>(GridCollectionItem, TreeItem) {

    private _treeItem: TreeItem<T>;

    constructor(options: any) {
        super(options);
        this._treeItem = new TreeItem<T>(options);
    }

    isExpanded(): boolean {
        return this._treeItem.isExpanded();
    }

    isDrawExpander(): boolean {
        return this._treeItem.isDrawExpander();
    }

    shouldDrawExpanderPadding(): boolean {
        return this._treeItem.shouldDrawExpanderPadding();
    }

    getExpanderTemplate(expanderTemplate: TemplateFunction): TemplateFunction {
        return this._treeItem.getExpanderTemplate(expanderTemplate);
    }

    getExpanderIcon(expanderIcon: string): string {
        return this._treeItem.getExpanderIcon(expanderIcon);
    }

    getExpanderSize(expanderSize: string): string {
        return this._treeItem.getExpanderSize(expanderSize);
    }
}
