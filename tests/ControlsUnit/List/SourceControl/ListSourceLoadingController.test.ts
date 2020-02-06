import 'Core/polyfill/PromiseAPIDeferred';

import {assert} from 'chai';
import {Record} from 'Types/entity';
import {RecordSet} from 'Types/collection';

import * as ErrorModule from 'Controls/_dataSource/error';
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
                .then((response: {data: RecordSet, error: ErrorModule.ViewConfig}) => {
                    assert.equal(response.data.at(4).get('id'), _record.get('id'));
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
                .then((response: {data: RecordSet, error: ErrorModule.ViewConfig}) => {
                    assert.equal(response.data.at(4).get('id'), _record.get('id'));
                    return response.data;
                })
                .then((recordSet: RecordSet) => {
                    return instance.load({direction: 'down'})
                        .then((response2: {data: RecordSet, error: ErrorModule.ViewConfig}) => {
                            console.log(response2.data.getRawData());
                        });
                });
        });
    });
});
