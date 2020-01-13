import {Control} from 'UI/Base';
import {ICrud, Query} from 'Types/source';
import {INavigation, TNavigationSource, INavigationOptionValue} from 'Controls/interface';
import {QueryNavigationType} from 'Types/source';
import {Logger} from 'saby-ui/UI/Utils';

import * as cInstance from 'Core/core-instance';
import * as Deferred from 'Core/Deferred';
import * as cClone from 'Core/core-clone';

import {IQueryParamsController} from './interface/IQueryParamsController';
import {default as Page, IPageNavigationOptions} from './QueryParamsController/Page';
import {default as Position, IPositionNavigationOptions} from './QueryParamsController/Position';
import {RecordSet} from 'saby-types/Types/collection';
import {
    Direction,
    FilterObject,
    IAdditionalQueryParams,
    IAdditionQueryParamsMeta,
    SortingObject
} from './interface/IAdditionalQueryParams';

export interface IType<T> extends Function {
    new(...args: any[]): T;
}

export interface IDictionary<T> {
    [key: string]: T;
}

/**
 * Фабрика для создания контроллера
 */
export class NavigationControllerFactory {
    static factorySource: IDictionary<IType<IQueryParamsController>> = {
        page: Page,
        position: Position
    };

    static resolve(navigationOptionValue: INavigationOptionValue): IQueryParamsController {
        if (!navigationOptionValue.source) {
            return;
        }
        if (navigationOptionValue.source in this.factorySource) {
            return new this.factorySource[navigationOptionValue.source](navigationOptionValue.sourceConfig);
        }
        Logger.error('NavigationController: Undefined navigation source type "' + navigationOptionValue.source + '"');
        return;
    }
}

/**
 * Инициалайзер пакраметров запроса
 * @param options
 * @private
 */
export class QueryParamsBuilder {
    private _filter: FilterObject;
    private _sorting: SortingObject;
    private _limit: number;
    private _offset: number;
    private _meta: IAdditionQueryParamsMeta;

    constructor(options?: IAdditionalQueryParams) {
        if (options) {
            this.merge(options);
        }
    }

    setFilter(filter: FilterObject): QueryParamsBuilder {
        this._filter = filter;
        return this;
    }

    setSorting(sorting: SortingObject): QueryParamsBuilder  {
        this._sorting = sorting;
        return this;
    }

    setLimit(limit: number): QueryParamsBuilder  {
        this._limit = limit;
        return this;
    }

    setOffset(offset: number): QueryParamsBuilder  {
        this._offset = offset;
        return this;
    }

    setMeta(meta: IAdditionQueryParamsMeta): QueryParamsBuilder  {
        this._meta = meta;
        return this;
    }

    merge(params: IAdditionalQueryParams): QueryParamsBuilder {
        Object.keys(params).forEach((param) => {
            if (params[param]) {
                if (param === 'filter') {
                    const filter: FilterObject = this._filter ? cClone(this._filter) : {};
                    this.setFilter({...filter, ...params[param]});
                } else {
                    this[`_${param}`] = params[param];
                }
            }
        });
        return this;
    }

    raw(): IAdditionalQueryParams {
        return {
            filter: this._filter || {},
            sorting: this._sorting || [],
            limit: this._limit,
            offset: this._offset,
            meta: this._meta
        };
    }

    build(): Query {
        const query = new Query();
        query.where(this._filter)
            .offset(this._offset)
            .limit(this._limit)
            .orderBy(this._sorting)
            .meta(this._meta);
        return query;
    }
}

export interface INavigationControllerOptions {
    source: ICrud;
    navigation?: INavigationOptionValue;
    keyProperty: string;
}

/**
 *
 */
export default class NavigationController {
    protected _options: INavigationControllerOptions | null;
    private _loader: Deferred<RecordSet>;
    private readonly _source: ICrud;
    private readonly _navigationController: IQueryParamsController;

    constructor(cfg: INavigationControllerOptions) {
        this._options = cfg;
        // TODO нужна ли эта проверка?
        if (NavigationController._isValidCrudSource(this._options.source)) {
            this._source = this._options.source;
        }
        if (this._options.navigation) {
            this._navigationController = NavigationControllerFactory.resolve(this._options.navigation);
        }
    }

    /**
     * Загружает данные согласно фильтрации, сортировке и данным _navigationController
     * @param filter
     * @param sorting
     * @param direction
     */
    load(filter?: FilterObject, sorting?: SortingObject, direction?: Direction): Deferred<RecordSet> {
        const queryParams = new QueryParamsBuilder({filter, sorting});
        this._cancelLoading();
        if (this._navigationController) {
            queryParams.merge(NavigationController._getNavigationQueryParams(direction, this._navigationController));
        }
        this._loader = this._callQuery(this._source, this._options.keyProperty, queryParams.build())
            .addCallback((list) => {
                if (this._navigationController) {
                    this._navigationController.calculateState(list, direction);
                }
                return list;
            })
            .addErrback((error) => {
                return error;
            });
        return this._loader;
    }

    /**
     * Отменяет текущую загрузку данных
     * @private
     */
    private _cancelLoading(): void {
        if (this._loader && !this._loader.isReady()) {
            this._loader.cancel();
        }
        this._loader = null;
    }

    // TODO спроси, query должен возвращать Promise или Deferred
    private _callQuery(dataSource: ICrud, keyProperty: string, query: Query): Deferred<RecordSet> {
        const queryDef = dataSource.query(query).addCallback(((dataSet) => {
            if (keyProperty && keyProperty !== dataSet.idProperty) {
                dataSet.setKeyProperty(keyProperty);
            }
            return dataSet.getAll ? dataSet.getAll() : dataSet;
        }));

        if (cInstance.instanceOfModule(dataSource, 'Types/source:Memory')) {

            /* Проблема в том что деферред с синхронным кодом статического источника выполняется сихронно.
             в итоге в коолбэк релоада мы приходим в тот момент, когда еще не отработал _beforeMount и заполнение опций,
             и не можем обратиться к this._options */
            const queryDefAsync = new Deferred();

            // deferred.fromTimer is not support canceling
            setTimeout(() => {
                if (!queryDefAsync.isReady()) {
                    queryDefAsync.callback();
                }
            }, 0);

            queryDefAsync.addCallback(() => {
                return queryDef;
            });
            return queryDefAsync;
        } else {
            return queryDef;
        }
    }

    /**
     * Получает QueryParams из paramsController
     * @param direction
     * @param paramsController
     * @private
     */
    private static _getNavigationQueryParams(direction: Direction, paramsController: IQueryParamsController)
        : IAdditionalQueryParams {
        const {limit, offset, meta, filter} = paramsController.prepareQueryParams(direction);
        const queryParams = new QueryParamsBuilder({limit, offset, meta, filter});
        return queryParams.raw();
    }

    /**
     * Валидатор, позволяющий убедиться, что для source был точно передан Types/_source/ICrud
     * TODO проверь, надо ли оно
     * @param source
     * @private
     */
    private static _isValidCrudSource(source: ICrud): boolean {
        if (!cInstance.instanceOfMixin(source, 'Types/_source/ICrud')) {
            Logger.error('NavigationController: Source option has incorrect type');
            return false;
        }
        return true;
    }
}
