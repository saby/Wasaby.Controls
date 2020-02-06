import 'Core/polyfill/PromiseAPIDeferred';

import {assert} from 'chai';
import {Record} from 'Types/entity';
import {RecordSet} from 'Types/collection';

import {ListSourceLoadingController} from 'Controls/_list/SourceControl/ListSourceLoadingController';
import {getGridData, SourceFaker, DataFaker} from 'Controls-demo/List/Utils/listDataGenerator';

const NUMBER_OF_ITEMS = 50;

const rawData = getGridData(NUMBER_OF_ITEMS, {
    title: 'Заголовок',
    text: {
        type: 'string',
        randomData: true
    }
});

describe('Controls/_list/SourceControl/ListSourceLoadingController', () => {
    let instance: ListSourceLoadingController;

    describe ('load', () => {


        it('should load first portion of data', () => {
            instance = new ListSourceLoadingController({
                source: SourceFaker.instance({}, rawData, false),
                keyProperty: 'id'
            });
            const _record = new Record({rawData: rawData[4]});
            return instance.load()
                .then((recordSet: RecordSet) => {
                    assert.equal(recordSet.at(4).get('id'), _record.get('id'));
                });
        });

        it('should change page on demand', () => {
            instance = new ListSourceLoadingController({
                source: SourceFaker.instance({}, rawData, false),
                keyProperty: 'id',
                navigation: {
                    source: 'page',
                    view: 'demand',
                    sourceConfig: {
                        page: 0,
                        pageSize: NUMBER_OF_ITEMS,
                        hasMore: false
                    }
                }
            });
            const _record = new Record({rawData: rawData[4]});
            return instance.load()
                .then((recordSet: RecordSet) => {
                    assert.equal(recordSet.at(4).get('id'), _record.get('id'));
                    return recordSet;
                })
                .then((recordSet: RecordSet) => {
                    return instance.load({direction: 'down'})
                        .then((recordSet2: RecordSet) => {
                            console.log(recordSet2.getRawData());
                        });
                });
        });
    });
});
