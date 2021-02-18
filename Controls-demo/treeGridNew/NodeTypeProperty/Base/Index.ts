import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/Base/Base';
import {Memory} from 'Types/source';
import {data} from '../resourses';
import {TColspanCallbackResult} from 'Controls/gridNew';
import {Model} from 'Types/entity';
import {INavigation} from 'Controls-demo/types';

const NODE_TYPE_PROPERTY = 'nodeType';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
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
        this._viewSource = new Memory({
            keyProperty: 'id',
            data
        });
    }

    protected _afterMount(): void {
        this._children.tree.toggleExpanded(1);
    }

    protected _colspanCallback(item: Model, column, columnIndex: number, isEditing: boolean): TColspanCallbackResult {
        if (item.get(NODE_TYPE_PROPERTY) === 'group' && columnIndex === 0) {
            return 3;
        }
        return 1;
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
