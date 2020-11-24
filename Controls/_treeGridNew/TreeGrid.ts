import { View as Grid } from 'Controls/gridNew';
import { TreeControl } from 'Controls/tree';
import { TemplateFunction } from 'UI/Base';
import { descriptor } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import TreeGridView from 'Controls/_treeGridNew/TreeGridView';

export default class TreeGrid extends Grid {
    protected _viewName: TemplateFunction = TreeGridView;
    protected _viewTemplate: TemplateFunction = TreeControl;

    _getModelConstructor(): string {
        return 'Controls/display:TreeGridCollection';
    }

    toggleExpanded(key: CrudEntityKey): void {
        // @ts-ignore
        this._children.listControl.toggleExpanded(key);
    }

    static _theme: string[] = ['Controls/treeGrid', 'Controls/grid'];

    static getOptionTypes(): object {
        return {
            keyProperty: descriptor(String).required(),
            parentProperty: descriptor(String).required()
        };
    }
}
