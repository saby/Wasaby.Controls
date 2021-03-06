import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/ChildNodes/ChildNodes';
import {HierarchicalMemory} from 'Types/source';
import {extendedData as data} from '../data/NodeTypePropertyData';
import {TColspanCallbackResult} from 'Controls/gridNew';
import {Model} from 'Types/entity';
import {INavigation} from 'Controls-demo/types';

const NODE_TYPE_PROPERTY = 'nodeType';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _nodeTypeProperty: string = NODE_TYPE_PROPERTY;
    protected _navigation: INavigation = {
        source: 'page',
        view: 'demand',
        sourceConfig: {
            pageSize: 3,
            page: 0,
            hasMore: false
        },
        viewConfig: {
            pagingMode: 'basic'
        }
    };

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            data
        });
    }

    protected _colspanCallback(item: Model, column, columnIndex: number, isEditing: boolean): TColspanCallbackResult {
        if (item.get(NODE_TYPE_PROPERTY) === 'group' && columnIndex === 0) {
            return 3;
        }
        return 1;
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
