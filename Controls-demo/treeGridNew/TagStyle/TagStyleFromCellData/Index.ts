import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {Memory} from 'Types/source';
import {CollectionItem} from 'Controls/display';
import {Record} from 'Types/entity';
import {IColumn, TCellAlign} from 'Controls/gridNew';

import {Gadgets, IData} from '../../DemoHelpers/DataCatalog';

import * as template from 'wml!Controls-demo/treeGridNew/TagStyle/TagStyleFromCellData/TagStyleFromCellData';

const MAXITEM = 7;

export default class TagStyleGridDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    protected _columns: IColumn[];

    // Название свойства, из которого следует брать стильдля тега
    protected _tagStyleProperty: string;

    // Номер выбранной колонки
    protected _currentColumnIndex: number = null;

    // Тип события
    protected _currentEvent: string;

    // Значение выбранной колонки
    protected _currentValue: string;

    // Раскрытые элементы дерева
    protected _expandedItems: any[] = [1];

    constructor(cfg: IControlOptions) {
        super(cfg);
        this._tagStyleProperty = 'customProperty';
        this._columns = this._getModifiedColumns();
    }

    protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
        const data = this._getModifiedData().slice(0, MAXITEM);
        this._viewSource = new Memory({
            keyProperty: 'id',
            data
        });
    }

    /**
     * Эти хандлеры срабатывают при клике на Tag в шаблоне BaseControl.wml
     * @param event
     * @param item
     * @param columnIndex
     * @param nativeEvent
     * @private
     */
    protected _onTagClickCustomHandler(
        event: Event, item: CollectionItem<Record>, columnIndex: number, nativeEvent: Event
    ): void {
        this._currentColumnIndex = columnIndex;
        this._currentEvent = 'click';
        this._currentValue = item.getContents().get('title');
    }

    /**
     * Эти хандлеры срабатывают при наведении на Tag в шаблоне BaseControl.wml
     * @param event
     * @param item
     * @param columnIndex
     * @param nativeEvent
     * @private
     */
    protected _onTagHoverCustomHandler(
        event: Event, item: CollectionItem<Record>, columnIndex: number, nativeEvent: Event
    ): void {
        this._currentColumnIndex = columnIndex;
        this._currentEvent = 'hover';
        this._currentValue = item.getContents().get('title');
    }

    /**
     * Получаем список колонок с необходимыми настройками
     * @private
     */
    private _getModifiedColumns(): IColumn[] {
        return Gadgets.getColumnsForFlat().map((col) => {
            col.width = '200px';
            return col;
        }).concat([
            {
                displayProperty: 'rating',
                width: '150px'
            },
            {
                displayProperty: 'country',
                width: '150px',
                align: 'right' as TCellAlign,
                tagStyleProperty: this._tagStyleProperty
            }
        ] as IColumn[]);
    }

    private _getModifiedData(): IData[] {
        const styleVariants = [
            null,
            'info',
            'danger',
            'primary',
            'success',
            'warning',
            'secondary'
        ];
        return Gadgets.getFlatData().map((cur, i) => {
            const index = i <= (styleVariants.length - 1) ? i : i % (styleVariants.length - 1);
            return {
                ...cur,
                [this._tagStyleProperty]: styleVariants[index]
            };
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
