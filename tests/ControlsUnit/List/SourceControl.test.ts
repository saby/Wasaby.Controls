import {assert} from 'chai';
import {Record} from 'Types/entity';
import {RecordSet} from 'Types/collection';

import SourceControl, {ISourceControlOptions} from 'Controls/_list/SourceControl';
import {getGridData, SourceFaker} from 'Controls-demo/List/Utils/listDataGenerator';

const NUMBER_OF_ITEMS = 100;

const rawData = getGridData(NUMBER_OF_ITEMS, {
    title: 'Заголовок',
    text: {
        type: 'string',
        randomData: true
    }
});

describe('Controls/_list/SourceControl', () => {
    let instance: SourceControl;

    beforeEach(() => {
        // @ts-ignore
        instance = new SourceControl();
    });

    describe ('_beforeMount', () => {
        it('should load first portion of data on _beforeMount', () => {
            const _record = new Record();
            _record.setRawData(rawData[0]);
            const mountResult: Promise<RecordSet> | any = instance._beforeMount(<ISourceControlOptions> {
                source: SourceFaker.instance({}, rawData, false),
                content: () => ''
            });
            assert.isTrue(typeof mountResult.then === 'function');
            if (typeof mountResult.then === 'function') {
                mountResult.then((recordSet: RecordSet) => {
                    assert.equal(recordSet.at(0).get('id'), _record.get('id'));
                });
            }
        });

        // TODO CHANGE PAGE!
    });
});
