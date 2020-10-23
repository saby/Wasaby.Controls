import {Control, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/grid/Ladder/DragNDrop/DragNDrop';
import {Memory} from 'Types/source';
import {getTasks} from '../../DemoHelpers/DataCatalog';
import * as Dnd from 'Controls/dragnDrop';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Collection} from 'Controls/display';
import {Model, Record} from 'Types/entity';
import {RecordSet} from 'Types/collection';
import {TItemsReadyCallback} from 'Controls-demo/types';
import {IItemAction} from '../../../../Controls/_itemActions/interface/IItemAction';
import {showType} from '../../../../Controls/Utils/Toolbar';

interface INoStickyLadderColumn {
    template: string;
    width: string;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemsReadyCallback: TItemsReadyCallback = this._itemsReady.bind(this);
    protected _columns: INoStickyLadderColumn[] = getTasks().getColumns();
    protected _selectedKeys: Number[] = [];
    private _itemsFirst: RecordSet = null;
    protected _ladderProperties: string[] = ['photo', 'date'];
    protected _itemActions: IItemAction = [{
        id: 1,
        icon: 'icon-Erase icon-error',
        title: 'delete',
        style: 'bordered',
        showType: showType.TOOLBAR,
        handler: function(item: Record): void {
            this._children.remover.removeItems([item.get('id')]);
        }.bind(this)
    }];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: getTasks().getData()
        });
    }

    private _itemsReady(items: RecordSet): void {
        this._itemsFirst = items;
    }

    protected _dragStart(_: SyntheticEvent, items: number[]): void {
        const firstItem = this._itemsFirst.getRecordById(items[0]);

        return new Dnd.ItemsEntity({
            items,
            title: firstItem.get('title')
        });
    }

    protected _dragEnd(_: SyntheticEvent, entity: Collection<Model>, target: unknown, position: string): void {
        this._selectedKeys = [];
        this._children.listMover.moveItems(entity.getItems(), target, position);
    }

    protected _afterItemsRemove(): void {
        this._toggleAddButton();
    }

    private _toggleAddButton(): void {
        // tslint:disable-next-line
        const self = this;
        this._viewSource.query().addCallback((items) => {
            const rawData = items.getRawData();
            const getSumm = (title) => rawData.items.reduce((acc: number, cur: unknown) => {
                // tslint:disable-next-line
                acc += parseInt(cur[title], 10) || 0;
                return acc;
            }, 0);
            const newColumns = self._columns.map((cur) => {
                if (cur.results || cur.results === 0) {
                    return {
                        ...cur, results: getSumm(cur.displayProperty)
                    };
                }
                return cur;
            });
            self._columns = newColumns;
            return items;
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
