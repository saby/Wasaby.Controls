import {RecordSet} from 'Types/collection';
import {Memory, DataSet} from 'Types/source';
import {DataController} from 'Controls/list';
import {deepStrictEqual, ok} from 'assert';

function getData(): object[] {
    return [
        {
            id: 0,
            title: 'Sasha'
        },
        {
            id: 1,
            title: 'Aleksey'
        },
        {
            id: 2,
            title: 'Dmitry'
        }
    ];
}

function getRecordSet(): RecordSet {
    return new RecordSet({
       rawData: getData(),
       keyProperty: 'id'
    });
}

function getDataController(): DataController {
    const options = {
        source: new Memory(),
        keyProperty: 'id',
        filter: {}
    };
    return new DataController(options);
}

describe('Controls/list:DataController', () => {

    describe('setItems', () => {

        it('simple set items', () => {
            const controller = getDataController();
            const items = controller.setItems(getRecordSet());
            deepStrictEqual(items.getRawData(), getRecordSet().getRawData());
        });

        it('set items with same keyProperty', () => {
            const controller = getDataController();
            const recordSet = getRecordSet();
            const emptyRecordSet = recordSet.clone();
            const items = controller.setItems(getRecordSet());

            emptyRecordSet.clear();
            controller.setItems(emptyRecordSet);
            ok(!items.getCount());
        });

        it('set items with different keyProperty ', () => {
            const controller = getDataController();
            const recordSet = getRecordSet();
            const recordSetWithAnotherKeyProp = recordSet.clone();
            recordSetWithAnotherKeyProp.setKeyProperty('title');
            controller.setItems(recordSet);
            deepStrictEqual(controller.setItems(recordSetWithAnotherKeyProp).getKeyProperty(), 'title');
        });

    });

});
