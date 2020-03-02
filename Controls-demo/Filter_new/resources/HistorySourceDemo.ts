import {register} from 'Types/di';
import {RecordSet} from 'Types/collection';
import Serializer = require('Core/Serializer');
import {getChangedHistoryItems} from './FilterItemsStorage';
import {DataSet} from 'Types/source';

const pinnedData = {
    _type: 'recordset',
    d: [],
    s: [
        {n: 'ObjectId', t: 'Строка'},
        {n: 'ObjectData', t: 'Строка'},
        {n: 'HistoryId', t: 'Строка'}
    ]
};
const frequentData = {
    _type: 'recordset',
    d: [
        [
            '6', 'History 6', 'TEST_HISTORY_ID_V1'
        ],
        [
            '4', 'History 4', 'TEST_HISTORY_ID_V1'
        ],
        [
            '9', 'History 9', 'TEST_HISTORY_ID_V1'
        ]
    ],
    s: [
        {n: 'ObjectId', t: 'Строка'},
        {n: 'ObjectData', t: 'Строка'},
        {n: 'HistoryId', t: 'Строка'}
    ]
};
const recentData = {
    _type: 'recordset',
    d: [
        [
            '8', JSON.stringify(getChangedHistoryItems(3), new Serializer().serialize), 'TEST_HISTORY_ID_2'
        ],
        [
            '5', JSON.stringify(getChangedHistoryItems(), new Serializer().serialize), 'TEST_HISTORY_ID_1'
        ]
    ],
    s: [
        {n: 'ObjectId', t: 'Строка'},
        {n: 'ObjectData', t: 'Строка'},
        {n: 'HistoryId', t: 'Строка'}
    ]
};

function createRecordSet(data: any): RecordSet {
    return new RecordSet({
        rawData: data,
        keyProperty: 'ObjectId',
        adapter: 'adapter.sbis'
    });
}

export default class DemoHistorySource {
    protected _recent: number = null;

    constructor(cfg: Record<string, any>) {
        this._recent = cfg.recent;
    }

    query(): Promise<any> {
        return new Promise((resolve): void => {
            resolve(this.getData());
        });
    }

    saveHistory(): void {
        // for demo
    }

    getHistoryId(): string {
        return 'DEMO_HISTORY_ID';
    }

    update(): object {
        return {};
    }

    private getData(): DataSet {
        return new DataSet({
            rawData: {
                frequent: createRecordSet(frequentData),
                pinned: createRecordSet(pinnedData),
                recent: createRecordSet(recentData)
            },
            itemsProperty: '',
            keyProperty: 'ObjectId'
        });
    }
}
register('demoSourceHistory', DemoHistorySource);
