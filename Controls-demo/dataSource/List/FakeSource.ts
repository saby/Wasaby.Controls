import { fetch } from 'Browser/Transport';
import * as di from 'Types/di';
import { Memory } from 'Types/source';

const Errors = fetch.Errors;

const trueData = {
    idProperty: 'id',
    data: [
        { id: 0, title: 'Abiens abi!', description: 'Уходя, уходи!' },
        { id: 1, title: 'Alea jacta est', description: 'Жребий брошен.' },
        { id: 2, title: 'Acta est fabŭla.', description: 'Представление окончено.' },
        { id: 3, title: 'Aurea mediocrĭtas', description: 'Золотая середина (Гораций).' },
        { id: 4, title: 'A mari usque ad mare', description: 'От моря до моря. Девиз на гербе Канады.' }
    ]
};
export default class FakeSource extends Memory {
    _result: string = '200';
    constructor() {
        super(trueData);
    }
    setResult(statusCode: string): void {
        this._result = statusCode;
    }
    query(...args: any[]): Promise<any> {
        if (this._result === '200') {
            return super.query(...args);
        }
        return this.throwError(this._result);
    }
    read(key: any, meta: any): Promise<any> {
        if (this._result === '200') {
            return super.read(key, meta);
        }
        return this.throwError(this._result);
    }
    throwError(code: string): Promise<Error> {
        switch (code) {
            case '401': {
                const err = new Errors.Auth('test url');
                return Promise.reject(err);
            }
            case 'Connection_Error': {
                const err = new Errors.Connection('test url');
                return Promise.reject(err);
            }
            default: {
                const err = new Errors.HTTP({
                    message: 'test text',
                    details: 'test details',
                    httpError: code,
                    url: 'test url'
                });
                return Promise.reject(err);
            }
        }
    }
}

Object.assign(FakeSource.prototype, {
    '[Controls-demo/dataSource/List/FakeSource]': true,
    _moduleName: 'Controls-demo/dataSource/List/FakeSource',
    _$data: null,
    _dataSetItemsProperty: 'items',
    _dataSetMetaProperty: 'meta',
    _emptyData: null
});
di.register('Controls-demo/dataSource/List/FakeSource', FakeSource, { instantiate: false });
