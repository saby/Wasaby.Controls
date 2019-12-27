import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGrid/Grouping/Grouping';
import {HierarchicalMemory} from 'Types/source';
import 'css!Controls-demo/Controls-demo';

function generateData(count: number): any[] {
    const result = [];
    const countsArray = [5, 7, 12, 3, 8, 6, 22, 1, 4, 16];
    let countIdx = 0;
    for (let i = 0; i < count; i++) {
        result.push({
            key: 'key_' + i,
            title: 'item_' + i,
            count: countsArray[countIdx],
            parent: null,
            hasChildren: i % 3 === 0,
            type: true,
            group: 'group_' + (i < count / 2 ? 1 : 2)
        });
        if (i % 3 === 0) {
            for (let j = 0; j < 3; j++) {
                result.push({
                    key: 'key_' + i + '_' + j,
                    title: 'item_' + i + '_' + j,
                    count: 0,
                    parent: 'key_' + i,
                    hasChildren: false,
                    type: true,
                    group: 'group_' + (i < count / 2 ? 1 : 2)
                });
            }
        }
        countIdx = countIdx < 9 ? countIdx + 1 : 0;
    }
    return result;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: HierarchicalMemory;
    private _columns: object[];
    private _navigation: object;
    private _useNewGrouping: boolean = true;

    protected _beforeMount(): any {
        this._columns = [{
            displayProperty: 'title'
        }, {
            displayProperty: 'count'
        }];
        this._navigation = {
            source: 'position',
            view: 'infinity',
            sourceConfig: {
                limit: 20,
                field: 'key',
                position: 'key_0',
                direction: 'after'
            },
            viewConfig: {
                pagingMode: 'direct'
            }
        };
        const sourceData = generateData(1000);
        let foundedCursor = false;
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: sourceData,
            filter: (item, filter) => {
                const parent = filter.hasOwnProperty('parent') ? filter.parent : null;
                if (parent !== null || filter['key>='] === item.get('key')) {
                    foundedCursor = true;
                }
                if (this._useNewGrouping) {
                    if (filter.group) {
                        return filter.group.indexOf(item.get('group')) !== -1 && item.get('parent') === parent;
                    }
                    let itemInExpandedGroup = true;
                    if (filter.collapsedGroups && filter.collapsedGroups.indexOf(item.get('group')) !== -1) {
                        itemInExpandedGroup = false;
                    }
                    return foundedCursor && itemInExpandedGroup && item.get('parent') === parent;
                }
                return foundedCursor && item.get('parent') === parent;
            }
        });
        const originalQueryFn = this._viewSource.query;
        this._viewSource.query = function() {
            return originalQueryFn.apply(this, arguments).then((result) => {
                const resultData = result.getRawData();
                const lastResultKey = resultData.items[resultData.items.length - 1].key;
                const lastResultIndex = sourceData.findIndex((item) => {
                    return item.key === lastResultKey;
                });
                const nextKey = 'key_' + (+lastResultKey.replace('key_', '') + 1);
                resultData.meta.nextPosition = [nextKey];
                resultData.meta.more = lastResultIndex < sourceData.length;
                foundedCursor = false;
                return result;
            });
        };
    }
}
