import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { TColumns, THeader } from 'Controls/grid';
/*import RawData from 'Controls-demo/grid/data/ResultsColspan';*/
import * as Template from 'wml!Controls-demo/grid/ResultsColspan/ResultsColspan';
import * as TotalResult from 'wml!Controls-demo/grid/ResultsColspan/TotalResult';
import * as CountResult from 'wml!Controls-demo/grid/ResultsColspan/CountResult';
import { TColspanCallbackResult } from 'Controls/_display/grid/mixins/Grid';

const RawData = [
    {
        key: 1,
        name: 'Молоко ДОМИК В ДЕРЕВНЕ пастеризованное 3,5-4,5%, 1400 мл',
        count: 2,
        price: 99.90,
        total: 199.8
    },
    {
        key: 2,
        name: 'Сыр ЛАМБЕР 50%, 100 г',
        count: 1,
        price: 59.99,
        total: 59.99
    },
    {
        key: 3,
        name: 'Минеральная вода БОРЖОМИ 0,5 л.',
        count: 3,
        price: 64.90,
        total: 194.7
    },
    {
        key: 4,
        name: 'Шоколад РИТТЕР СПОРТ молочный, 100 г',
        count: 1,
        price: 79.99,
        total: 79.99
    },
    {
        key: 5,
        name: 'Пельмени Сибирская коллекция, 4 вида мяса, 700 г',
        count: 1,
        price: 191.90,
        total: 191.90
    }
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemsReadyCallback: Function;
    protected _columns: TColumns = [
        {
            displayProperty: 'name',
            width: '250px'
        },
        {
            displayProperty: 'count',
            width: '50px',
            resultTemplate: CountResult
        },
        {
            displayProperty: 'price',
            width: '75px',
            align: 'right',
            resultTemplate: TotalResult
        },
        {
            displayProperty: 'total',
            width: '75px',
            align: 'right'
        }
    ];

    protected _header: THeader = [
        {
            caption: 'Наименование'
        },
        {
            caption: 'Кол.'
        },
        {
            caption: 'Цена'
        },
        {
            caption: 'Сумма'
        }
    ];

    protected _resultsData: {} = {
        count: 8,
        total: 726.38
    };

    protected _resultsColspanCallback(column, columnIndex, hasEditing): TColspanCallbackResult {
        if (columnIndex === 2) {
            return 'end';
        }
    }

    protected _beforeMount(): void {
        this._itemsReadyCallback = this._itemsReadyCallbackFn.bind(this);
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: RawData
        });
    }

    protected _itemsReadyCallbackFn(items): void {
        const results = new Model({
            rawData: this._resultsData
        });
        items.setMetaData({
            results
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
