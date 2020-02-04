import {assert} from 'chai';
import { ICrud, DataSet} from 'Types/source';
import {Record} from 'Types/entity';
import {
    error as ErrorModule,
    ISourceErrorConfig,
    ISourceErrorData,
    SourceCrudInterlayer
} from 'Controls/dataSource';
// import {Handler} from 'Controls/_dataSource/error';
// import ErrorController from 'Controls/_dataSource/_error/Controller';
import {getGridData, SourceFaker} from 'Controls-demo/List/Utils/listDataGenerator';

const NUMBER_OF_ITEMS = 100;

const rawData = getGridData(NUMBER_OF_ITEMS, {
    title: 'Заголовок',
    text: {
        type: 'string',
        randomData: true
    }
});

describe('Controls/_dataSource/SourceCrudInterlayer', () => {
    let errorConfig: ISourceErrorConfig;
    let source: ICrud;
    let sourceCrudInterlayer: SourceCrudInterlayer;
    let fallingSource: ICrud;
    let fallingSourceCrudInterlayer: SourceCrudInterlayer;
    // let handler: Handler;
    // let errorController: ErrorController;

    beforeEach(() => {
        errorConfig = {
            mode: ErrorModule.Mode.include,
            onBeforeProcessError: (error: Error) => {
                assert.isNotEmpty(error.message);
            }
        };
        source = SourceFaker.instance({}, rawData, false);
        fallingSource = SourceFaker.instance({}, rawData, true);
        sourceCrudInterlayer = new SourceCrudInterlayer({source, errorConfig});
        // handler = ({ error, mode }) => {
        //     return {
        //         template: 'SbisEnvUI/Maintains:Parking.handlers.internal',
        //         options: {
        //             message: 'К сожалению функционал для вас недоступен.',
        //             details: 'Оформите подписку и повторите попытку',
        //             image: 'https://i.pinimg.com/474x/54/5a/0f/545a0f6074c7a8eeeb396082c768952.jpg'
        //         }
        //     };
        // };
        // errorController = new ErrorController({
        //     handlers: [handler]
        // });
        // fallingSourceCrudInterlayer = new SourceCrudInterlayer({source: fallingSource, errorConfig,
        // errorController});
        fallingSourceCrudInterlayer = new SourceCrudInterlayer({source: fallingSource, errorConfig});
    });

    describe('create', () => {
        it('should return Promise<Record>', () => {
            return sourceCrudInterlayer.create({
                id: 666,
                title: 'Запись 666'
            })
                 .then((record: Record) => {
                     assert.equal(record.get('title'), 'Запись 666');
                 })
                 .catch((errorData: ISourceErrorData) => {
                     assert.isNotTrue(true, 'This call should not throw any exceptions');
                 });
        });

        it('should return Promise<Error>', () => {
            return fallingSourceCrudInterlayer.create({
                id: 666,
                title: 'Запись 666'
            })
                .then((record: Record) => {
                    assert.isNotTrue(true, 'This call should throw an exception');
                })
                .catch((errorData: ISourceErrorData) => {
                    assert.equal(errorData.errorConfig.mode, errorConfig.mode);
                });
        });
    });
    describe('read', () => {
        const _record = new Record();
        _record.setRawData(rawData[4]);
        it('should return Promise<Record>', () => {
            return sourceCrudInterlayer.read(5)
                .then((record: Record) => {
                    assert.equal(record.get('id'), _record.get('id'));
                })
                .catch((errorData: ISourceErrorData) => {
                    assert.isNotTrue(true, 'This call should not throw any exceptions');
                });
        });

        it('should return Promise<Error>', () => {
            return fallingSourceCrudInterlayer.read(5)
                .then((record: Record) => {
                    assert.isNotTrue(true, 'This call should throw an exception');
                })
                .catch((errorData: ISourceErrorData) => {
                    assert.equal(errorData.errorConfig.mode, errorConfig.mode);
                });
        });
    });
    describe('update', () => {
        const record = new Record();
        record.setRawData(rawData[4]);
        it('should return Promise<null>', () => {
            return sourceCrudInterlayer.update(record)
                .then((nulled: unknown) => {
                    assert.isNull(nulled);
                })
                .catch((errorData: ISourceErrorData) => {
                    assert.isNotTrue(true, 'This call should not throw any exceptions');
                });
        });

        it('should return Promise<Error>', () => {
            return fallingSourceCrudInterlayer.update(record)
                .then((nulled: unknown) => {
                    assert.isNotTrue(true, 'This call should throw an exception');
                })
                .catch((errorData: ISourceErrorData) => {
                    assert.equal(errorData.errorConfig.mode, errorConfig.mode);
                });
        });
    });
    describe('query', () => {
        const record = new Record();
        record.setRawData(rawData[4]);
        it('should return Promise<DataSet>', () => {
            return sourceCrudInterlayer.query({
                filter: {},
                sorting: [{id: true}]
            })
                .then((dataSet: DataSet) => {
                    assert.equal(dataSet.getAll().at(4).get('id'), record.get('id'));
                })
                .catch((errorData: ISourceErrorData) => {
                    assert.isNotTrue(true, 'This call should not throw any exceptions');
                });
        });

        it('should return Promise<Error>', () => {
            return fallingSourceCrudInterlayer.query({
                filter: {},
                sorting: [{id: true}]
            })
                .then((dataSet: DataSet) => {
                    assert.isNotTrue(true, 'This call should throw an exception');
                })
                .catch((errorData: ISourceErrorData) => {
                    assert.equal(errorData.errorConfig.mode, errorConfig.mode);
                });
        });
    });
    describe('destroy', () => {
        it('should return Promise<null>', () => {
            return sourceCrudInterlayer.destroy(5)
                .then((nulled: unknown) => {
                    assert.isNull(nulled);
                })
                .catch((errorData: ISourceErrorData) => {
                    assert.isNotTrue(true, 'This call should not throw any exceptions');
                });
        });

        it('should return Promise<Error>', () => {
            return fallingSourceCrudInterlayer.destroy(5)
                .then((nulled: unknown) => {
                    assert.isNotTrue(true, 'This call should throw an exception');
                })
                .catch((errorData: ISourceErrorData) => {
                    assert.equal(errorData.errorConfig.mode, errorConfig.mode);
                });
        });
    });
});
