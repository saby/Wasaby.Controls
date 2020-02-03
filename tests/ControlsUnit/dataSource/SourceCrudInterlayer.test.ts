import {assert} from 'chai';
import { ICrud, DataSet, Query, Remote } from 'Types/source';
import {Record} from 'Types/entity';
import {
    error as ErrorModule,
    ISourceErrorConfig,
    ISourceErrorData,
    SourceCrudInterlayer
} from 'Controls/dataSource';
import {IOptions as ILocalSourceOptions} from 'Types/_source/Local';
import {RecordSet} from 'Types/collection';
import {Handler, HandlerConfig, ViewConfig} from 'Controls/_dataSource/error';
import {fetch} from 'Browser/Transport';
import ErrorController from 'Controls/_dataSource/_error/Controller';

const NUMBER_OF_ITEMS = 100;

/**
 * Генератор данных
 * @param n
 */
const generateRawData = (n: number): any[] => {
    const _rawData = [];
    for (let i = 0; i < n; i++) {
        _rawData.push({
            id: i,
            title: `${i} item`
        });
    }
    return _rawData;
};

const rawData = generateRawData(NUMBER_OF_ITEMS);

class SourceFaker extends Remote {

    private _failed: boolean;
    private _timeOut: number;

    constructor(options?: ILocalSourceOptions) {
        super(options);
        this._timeOut = 1000;
    }

    create(meta?: object): Promise<Record> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._failed) {
                    reject(this._generateError('create'));
                } else {
                    const _record = new Record();
                    _record.setRawData(meta);
                    resolve(_record);
                }
            }, this._timeOut);
        });
    }

    destroy(keys: number | string | number[] | string[], meta?: object): Promise<null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._failed) {
                    reject(this._generateError('destroy'));
                } else {
                    resolve(null);
                }
            }, this._timeOut);
        });
    }

    query(query?: Query): Promise<DataSet> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._failed) {
                    reject(this._generateError('query'));
                } else {
                    resolve(new DataSet({
                        rawData,
                        keyProperty: 'id'
                    }));
                }
            }, this._timeOut);
        });
    }

    read(key: number | string, meta?: object): Promise<Record> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._failed) {
                    reject(this._generateError('read'));
                } else {
                    const _record = new Record();
                    _record.setRawData(rawData[4]);
                    resolve(_record);
                }
            }, this._timeOut);
        });
    }

    update(data: Record | RecordSet, meta?: object): Promise<null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._failed) {
                    reject(this._generateError('update'));
                } else {
                    resolve(null);
                }
            }, this._timeOut);
        });
    }

    setFailed(failed: boolean): void {
        this._failed = failed;
    }

    private _generateError(action: string): fetch.Errors.HTTP {
        return new fetch.Errors.HTTP({
            url: `localhost/${action}`,
            httpError: 403,
            name: '403 Access Restricted',
            message: 'Доступ ограничен'
        });
    }

    static instance(options?: ILocalSourceOptions, failed?: boolean): SourceFaker {
        const faker = new SourceFaker(options);
        faker.setFailed(failed);
        return faker;
    }
}

/*
 * const handlers = {
 *    handlers: [
 *        (config: HandlerConfig): error.ViewConfig) => ({
 *            template: LockedErrorTemplate,
 *            options: {
 *                // ...
 *            }
 *        })
 *        (config: HandlerConfig): error.ViewConfig) => ({
 *            template: LockedErrorTemplate,
 *            options: {
 *                // ...
 *            }
 *        })
 *    ]
 * }
 * const errorController = new error.Controller({handlers});
 * sourceCrudInterlayer.create(...)
 *     .then((record: Record) => {
 *         // ...
 *     })
 *     .catch((record: ISourceErrorData) => {
 *         this._showError(record.errorConfig);
 *     })
 */
describe('Controls/_dataSource/SourceCrudInterlayer', () => {
    let errorConfig: ISourceErrorConfig;
    let source: ICrud;
    let sourceCrudInterlayer: SourceCrudInterlayer;
    let fallingSource: ICrud;
    let fallingSourceCrudInterlayer: SourceCrudInterlayer;
    let handler: Handler;
    let errorController: ErrorController;

    beforeEach(() => {
        errorConfig = {
            mode: ErrorModule.Mode.include,
            onBeforeProcessError: (error: Error) => {
                assert.isNotEmpty(error.message);
            }
        };
        source = SourceFaker.instance({}, false);
        fallingSource = SourceFaker.instance({}, true);
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
        // fallingSourceCrudInterlayer = new SourceCrudInterlayer({source: fallingSource, errorConfig, errorController});
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
