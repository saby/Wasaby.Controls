import {default as BaseControllerClass, ILookupBaseControllerOptions} from 'Controls/_lookup/BaseControllerClass';
import {Memory} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {Model} from 'Types/entity';
import {deepStrictEqual, ok} from 'assert';
import {stub} from 'sinon';
import {error} from 'Controls/dataSource';

const data = [
    {
        id: 0,
        title: 'Sasha'
    },
    {
        id: 1,
        title: 'Aleksey'
    },
    {
        it: 2,
        title: 'Dmitry'
    }
];

function getSource(): Memory {
    return new Memory({
        keyProperty: 'id',
        data
    });
}
const source = getSource();

const sourceWithError = getSource();
sourceWithError.query = () => Promise.reject(new Error());

const recordSet = new RecordSet({
    rawData: data,
    keyProperty: 'id'
});

function getControllerOptions(): object {
    return {
        selectedKeys: [],
        source,
        keyProperty: 'id',
        displayProperty: 'title'
    };
}

function getLookupControllerWithEmptySelectedKeys(): BaseControllerClass {
    const options = getControllerOptions();
    return new BaseControllerClass(options as ILookupBaseControllerOptions);
}

function getLookupControllerWithSelectedKeys(additionalConfig?: object): BaseControllerClass {
    let options = getControllerOptions();
    options.selectedKeys = ['0', '1', '2'];
    options = {...options, ...additionalConfig};
    return new BaseControllerClass(options as ILookupBaseControllerOptions);
}

describe('Controls/_lookup/BaseControllerClass', () => {

    describe('loadItems', () => {
        it('simple loadItems', () => {
            const controller = getLookupControllerWithSelectedKeys();

            return new Promise((resolve) => {
                controller.loadItems().then(() => {
                    const resultItemsCount = 3;
                    deepStrictEqual(controller.getItems().getCount(), resultItemsCount);
                    resolve();
                });
            });
        });

        it('source returns error', () => {
            const controller = getLookupControllerWithSelectedKeys({
                source: sourceWithError
            });

            return new Promise((resolve) => {
                const errorStub = stub(error, 'process');
                controller.loadItems().then(() => {
                    ok(errorStub.calledOnce);
                    errorStub.restore();
                    resolve();
                });
            });
        });
    });

    it('setItems', () => {
        const controller = getLookupControllerWithEmptySelectedKeys();
        controller.setItems(recordSet);
        deepStrictEqual(controller.getSelectedKeys(), ['1', '2', '3']);
    });

    describe('getItems', () => {
        const controller = getLookupControllerWithEmptySelectedKeys();
        controller.setItems(recordSet);

        const items = controller.getItems() as RecordSet;
        deepStrictEqual(items.getRawData(), data);
    });

    it('addItem', () => {
        const controller = getLookupControllerWithEmptySelectedKeys();
        const item = new Model({
            rawData: data[0],
            keyProperty: 'id'
        });
        controller.addItem(item);

        deepStrictEqual(controller.getItems().getCount(), 1);
        deepStrictEqual(controller.getItems().at(0).get('title'), 'Sasha');
    });

    it('removeItem', () => {
        const controller = getLookupControllerWithSelectedKeys();
        const item = new Model({
            rawData: data[0],
            keyProperty: 'id'
        });

        return new Promise((resolve) => {
            controller.loadItems().then(() => {
                controller.removeItem(item);

                deepStrictEqual(controller.getItems().getCount(), 2);
                resolve();
            });
        });
    });

    it('getSelectedKeys', () => {
        const controller = getLookupControllerWithEmptySelectedKeys();
        controller.setItems(recordSet);
        deepStrictEqual(controller.getSelectedKeys(), ['1', '2', '3']);
    });

    it('getTextValue', () => {
        const controller = getLookupControllerWithSelectedKeys();

        return new Promise((resolve) => {
            controller.loadItems().then(() => {
                deepStrictEqual(controller.getTextValue(), 'Sasha, Aleksey, Dmitry');
                resolve();
            });
        });
    });
});
