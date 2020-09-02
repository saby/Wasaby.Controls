import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGrid/Mover/Base/Base';
import {HierarchicalMemory} from 'Types/source';
import {Gadgets} from '../../DemoHelpers/DataCatalog';
import { IColumn } from 'Controls/_grid/interface/IColumn';
import { TExpandOrColapsItems } from 'Controls-demo/types';
import {MoveController, IMoveControllerOptions} from 'Controls/list';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[];
    private _selectedKeys: [];
    private _excludedKeys: TExpandOrColapsItems;
    private _filter: object;

    private _mover: MoveController;

    protected _beforeMount(): void {
        this._columns = [{
            displayProperty: 'title',
            width: ''
        }];
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'id',
            data: Gadgets.getFlatData(),
            filter: (item, filter) => {
                const parent = filter.hasOwnProperty('parent') ? filter.parent : null;
                if (parent && parent.forEach) {
                    for (let i = 0; i < parent.length; i++) {
                        if (item.get('parent') === parent[i]) {
                            return true;
                        }
                    }
                    return false;
                } else {
                    return item.get('parent') === parent;
                }
            }
        });
        this._setMoverOptions();
    }

    protected _moveButtonClick(): void {
        if (this._selectedKeys.length) {
            this._mover.moveItemsWithDialog({
                selectedKeys: this._selectedKeys,
                excludedKeys: this._excludedKeys,
                filter: this._filter
            }).then(() => {
                this._children.treeGrid.reload();
            });
        }
    }

    private _setMoverOptions() {
        const moverCgf: IMoveControllerOptions = {
            parentProperty: 'parent',
            root: null,
            nodeProperty: 'type',
            source: this._viewSource,
            keyProperty: 'id',
            dialog: {
                opener: this,
                template: 'Controls/moverDialog:Template',
                templateOptions: {
                    showRoot: true,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    searchParam: 'title',
                    filter: this._filter,
                    nodeProperty: 'type',
                    source: this._viewSource,
                    columns: this._columns
                }
            }
        }
        if (!this._mover) {
            this._mover = new MoveController(moverCgf);
        } else {
            this._mover.update(moverCgf)
        }
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
