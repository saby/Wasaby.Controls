import {ICrud, Query, DataSet, QueryOrderSelector, QueryWhere} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {Record} from 'Types/entity';
import {INavigationOptionValue} from 'Controls/interface';
import {Logger} from 'UI/Utils';

import * as cInstance from 'Core/core-instance';
import * as cClone from 'Core/core-clone';

import {INavigationController} from './interface/INavigationController';
import PageNavigationController from './QueryParamsController/PageNavigationController';
import PositionNavigationController from './QueryParamsController/PositionNavigationController';

import {
    Direction,
    IAdditionalQueryParams,
    IAdditionQueryParamsMeta
} from './interface/IAdditionalQueryParams';

interface IExtendedPromise<T> extends Promise<T> {
    addCallback: (callback: Function) => IExtendedPromise<T>;
    addErrback: (callback: Function) => IExtendedPromise<T>;
    addCallbacks: (callback: Function, errback: Function) => IExtendedPromise<T>;
}

/**
 * Вспомогательный интерфейс для определения типа typeof object
 * @interface IType
 * @private
 * @author Аверкиев П.А.
 */
/*
 * Additional interface to set typeof types
 * @interface IType
 * @private
 * @author Аверкиев П.А.
 */
export interface IType<T> extends Function {
    new(...args: any[]): T;
}

/**
 * Вспомогательный интерфейс для определения простых мапов {[key: string]: any}
 * @interface IDictionary
 * @private
 * @author Аверкиев П.А.
 */
/*
 * Additional interface to set types for simple {[key: string]: any} dictionaries
 * @interface IDictionary
 * @private
 * @author Аверкиев П.А.
 */
export interface IDictionary<T> {
    [key: string]: T;
}

/**
 * Фабрика для создания экземпляра контроллера запроса навигации.
 * @remark
 * Поддерживает два варианта - 'page' и 'position'
 * @class Controls/_source/NavigationControllerFactory
 * @example
 * const cName:INavigationOptionValue = {source: 'page'};
 * const controller = NavigationControllerFactory.resolve(cName);
 * @private
 * @author Аверкиев П.А.
 */

/*
 * Navigation query controller instance Factory
 * @remark
 * Supports two variants of navigation query controllers - 'page' and 'position'
 * @class Controls/_source/NavigationControllerFactory
 * @example
 * const cName:INavigationOptionValue = {source: 'page'};
 * const controller = NavigationControllerFactory.resolve(cName);
 * @private
 * @author Аверкиев П.А.
 */

export class NavigationControllerFactory {
    static factorySource: IDictionary<IType<INavigationController>> = {
        page: PageNavigationController,
        position: PositionNavigationController
    };

    static resolve(navigationOptionValue: INavigationOptionValue): INavigationController {
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
 * Строитель запроса.
 * @remark
 * Принимает набор опций фильтрации, сортировки и пейджинации и позволяет их вывести как список переданных свойств
 * или как сформированный запрос Types/source:Query.
 * Поддерживает merge с опциями IAdditionalQueryParams.
 * @class Controls/_source/QueryParamsBuilder
 * @example
 * const params: IAdditionalQueryParams = {filter, sorting};
 * const queryBuilder = new QueryParamsBuilder(params);
 * const params2: IAdditionalQueryParams = {filter, meta, offset, limit};
 * const queryBuilder2 = new QueryParamsBuilder(params);
 * const query = queryBuilder.merge(queryBuilder2.raw()).build();
 * @private
 * @author Аверкиев П.А.
 */

/*
 * Query builder.
 * @remark
 * Accept params for filtering, sorting and pagination and allows to output them as raw data
 * or as Types/source:Query query.
 * Maintains merge() method to merge internal options with passed IAdditionalQueryParams.
 * @class Controls/_source/QueryParamsBuilder
 * @example
 * const params: IAdditionalQueryParams = {filter, sorting};
 * const queryBuilder = new QueryParamsBuilder(params);
 * const params2: IAdditionalQueryParams = {filter, meta, offset, limit};
 * const queryBuilder2 = new QueryParamsBuilder(params);
 * const query = queryBuilder.merge(queryBuilder2.raw()).build();
 * @private
 * @author Аверкиев П.А.
 */

export class QueryParamsBuilder {
    private _filter: QueryWhere;
    private _sorting: QueryOrderSelector;
    private _limit: number;
    private _offset: number;
    private _meta: IAdditionQueryParamsMeta;

    constructor(options?: IAdditionalQueryParams) {
        if (options) {
            this.merge(options);
        }
    }

    /**
     * Заменяет/объединяет текущие значения свойств фильтрации, сортировки и пейджинации.
     * Обратите внимание на то, что фильтры не будут заменены, они всегда пытаются смёрджиться.
     * @param params {IAdditionalQueryParams} набор опций фильтрации, сортировки и пейджинации
     * @return QueryParamsBuilder текущий экземпляр класса
     */
    /*
     * Reset/Merge current class properties values for filtering, sorting and pagination.
     * Note, that filters will be only merged and won't be reset.
     * @param params {IAdditionalQueryParams} params for filtering, sorting and pagination
     * @return QueryParamsBuilder текущий экземпляр класса
     */
    merge(params: IAdditionalQueryParams): QueryParamsBuilder {
        Object.keys(params).forEach((param) => {
            if (params[param]) {
                if (param === 'filter') {
                    const filter: QueryWhere = this._filter ? cClone(this._filter) : {};
                    this._filter = ({...filter, ...params[param]});
                } else {
                    this[`_${param}`] = params[param];
                }
            }
        });
        return this;
    }

    /**
     * @return {IAdditionalQueryParams} текущее состояние объекта
     */
    /*
     * @return {IAdditionalQueryParams} current object state
     */
    raw(): IAdditionalQueryParams {
        return {
            filter: this._filter || {},
            sorting: this._sorting || [],
            limit: this._limit,
            offset: this._offset,
            meta: this._meta
        };
    }

    /**
     * Собирает свойства текущего класса в запрос Types/source:Query
     * @return {Types/source:Query} Объект Query, готовый для передачи в ICrud.query()
     */
    /*
     * Builds current class properties to the Types/source:Query query
     * @return {Types/source:Query} Query object ready to pass to ICrud.query()
     */
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
    /**
     * @name Controls/_source/NavigationController#source
     * @cfg {Types/source:ICrud} Ресурс для запроса данных
     */
    /*
     * @name Controls/_source/NavigationController#source
     * @cfg {Types/source:ICrud} Source to request data
     */
    source: ICrud;

    /**
     * @name Controls/_source/NavigationController#navigation
     * @cfg {Types/source:INavigationOptionValue} Опции навигации
     */
    /*
     * @name Controls/_source/NavigationController#navigation
     * @cfg {Types/source:INavigationOptionValue} Navigation options
     */
    navigation?: INavigationOptionValue;

    /**
     * @name Controls/_source/NavigationController#keyProperty
     * @cfg {string} Название поля ключа для Types/source:DataSet
     */
    /*
     * @name Controls/_source/NavigationController#keyProperty
     * @cfg {string} Name of the key property for Types/source:DataSet
     */
    keyProperty: string;
}

/**
 * Контроллер загрузки данных с учётом постраничной навигации
 * @remark
 * Хранит состояние навигации INavigationOptionValue и вычисляет на его основании параметры для вызова методов.
 * Позволяет запросить данные из ресурса ICrud с учётом настроек навигации INavigationOptionValue
 *
 * @class Controls/_source/NavigationController
 * @implements INavigationController
 *
 * @control
 * @public
 * @author Аверкиев П.А.
 */

/*
 * Data loading and per-page navigation controller
 * @remark
 * Stores the navigation state and calculates methods calling params on its base
 * Allows to request data from ICrud source, considering navigation options object (INavigationOptionValue)
 *
 * @class Controls/_source/NavigationController
 * @implements Controls/_source/interface/INavigationController
 *
 * @control
 * @public
 * @author Аверкиев П.А.
 */

export default class NavigationController implements INavigationController {
    protected _options: INavigationControllerOptions | null;
    private _loader: Promise<RecordSet>;
    private readonly _source: ICrud;
    private readonly _navigationController: INavigationController;

    constructor(cfg: INavigationControllerOptions) {
        this._options = cfg;
        // TODO do we need this validation at all?
        if (NavigationController._isValidCrudSource(this._options.source)) {
            this._source = this._options.source;
        }
        if (this._options.navigation) {
            this._navigationController = NavigationControllerFactory.resolve(this._options.navigation);
        }
    }

    /**
     * Строит запрос данных на основе переданных параметров filter и sorting и возвращает Promise<RecordSet>.
     * Если в опцию navigation был передан объект INavigationOptionValue, его filter, sorting и настрйоки пейджинации
     * также одбавляются в запрос.
     * @param filter {Types/source:QueryWhere} Настрйоки фильтрации
     * @param sorting {Types/source:QueryOrderSelector} Настрйки сортировки
     * @param direction {Direction} Направление навигации
     */
    /*
     * Builds a query based on passed filter and sorting params and returns Promise<RecordSet>.
     * If INavigationOptionValue is set into the class navigation property, its filter, sorting and pagination settings
     * will also be added to query
     * @param filter {Types/source:QueryWhere} filter settings
     * @param sorting {Types/source:QueryOrderSelector} sorting settings
     * @param direction {Direction} navigation direction
     */
    load(filter?: QueryWhere, sorting?: QueryOrderSelector, direction?: Direction): Promise<RecordSet> {
        const queryParams = new QueryParamsBuilder({filter, sorting});
        this._cancelLoading();
        if (this._navigationController) {
            queryParams.merge(NavigationController._getNavigationQueryParams(direction, this._navigationController));
        }
        this._loader = this._callQuery(this._source, this._options.keyProperty, queryParams.build())
            .then((list: RecordSet) => {
                if (this._navigationController) {
                    this._navigationController.calculateState(list, direction);
                }
                return list;
            })
            .catch((error) => {
                return error;
            });
        return this._loader;
    }

    /**
     * Возвращает текущий объект INavigationOptionValue, если он был передан при инициализации объекта
     */
    /*
     * Returns current INavigationOptionValue if it is set in the class navigation property
     */
    // TODO Is it used anywhere?
    getNavigation(): INavigationOptionValue {
        return this._options.navigation;
    }

    /**
     * Проверяет, загружаются ли в данный момент данные
     */
    /*
     * Checks if data is currently loading
     */
    isLoading(): boolean {
        // Promise в проекте работает как Deferred (@see WS.Core/core/polyfill/PromiseAPIDeferred).
        return this._loader && !this._loader.isReady();
    }

    /**
     * @see Types/_source/ICrud
     */
    create(meta?: object): Promise<Record> {
        return this._source.create(meta);
    }

    /**
     * @see Types/_source/ICrud
     */
    update(data: Record | RecordSet, meta?: object): Promise<null> {
        return this._source.update(data);
    }

    /**
     * @see Types/_source/ICrud
     */
    read(key: number | string, meta?: object): Promise<Record> {
        return this._source.read(key, meta);
    }

    /**
     * @see Controls/_source/interface/INavigationController
     */
    getLoadedDataCount(): number {
        if (this._navigationController) {
            return this._navigationController.getLoadedDataCount();
        }
    }

    /**
     * @see Controls/_source/interface/INavigationController
     */
    getAllDataCount(rootKey?: string|number): boolean | number {
        if (this._navigationController) {
            return this._navigationController.getAllDataCount();
        }
    }

    /**
     * @see Controls/_source/interface/INavigationController
     */
    hasMoreData(direction: Direction, key?: string | number): boolean {
        if (this._navigationController) {
            return this._navigationController.hasMoreData(direction, key);
        }
    }

    /**
     * @see Controls/_source/interface/INavigationController
     */
    calculateState(list: RecordSet, direction?: Direction): void {
        if (this._navigationController) {
            this._navigationController.calculateState(list);
        }
    }

    /**
     * @see Controls/_source/interface/INavigationController
     */
    setState(state: any): void {
        if (this._navigationController) {
            this._navigationController.setState(state);
        }
    }

    /**
     * @see Controls/_source/interface/INavigationController
     */
    setEdgeState(direction: Direction): void {
        if (this._navigationController) {
            this._navigationController.setEdgeState(direction);
        }
    }

    /**
     * @see Controls/_source/interface/INavigationController
     */
    destroy(): void {
        if (this._navigationController) {
            this._navigationController.destroy();
        }
        this._cancelLoading();
        this._options = null;
    }

    /**
     * Выполняет запрос данных DataSet методом ICrud.query()
     * Возвращает Promise<RecordSet> с результатом выполнения DataSet.getAll()
     * @param {Types/source:ICrud} dataSource Ресурс данных
     * @param {string} keyProperty Свойство, используемое в качестве ключа в DataSet
     * @param {Types/source:Query} query исполняемый запрос с учётом сортировки, фильтрации, параметров пейджинации
     * @private
     */
    /*
     * Performs the DataSet request using ICrud.query()
     * and returns Promise<RecordSet> with result of calling DataSet.getAll()
     * @param {Types/source:ICrud} dataSource Data source
     * @param {string} keyProperty key property for DataSet
     * @param {Types/source:Query} query A query built based on sorting, filter and pagination params
     * @private
     */
    private _callQuery(dataSource: ICrud, keyProperty: string, query: Query): Promise<RecordSet> {
        let sourceQuery: Promise<RecordSet>;
        // Promise в проекте работает как Deferred (@see WS.Core/core/polyfill/PromiseAPIDeferred).
        const queryDeferred = dataSource.query(query)
            .addCallback((dataSet: DataSet) => {
                if (keyProperty && keyProperty !== dataSet.getKeyProperty()) {
                    dataSet.setKeyProperty(keyProperty);
                }
                return dataSet.getAll ? dataSet.getAll() : dataSet;
            })
            .catch(() => {
                Logger.error('NavigationController: Data is unable to be queried');
            });
        /**
         * Deferred с синхронным кодом статического источника выполняется сихронно.
         * в итоге в callback релоада мы приходим в тот момент, когда еще не отработал _beforeMount и заполнение опций,
         * и не можем обратиться к this._options.
         */
        if (cInstance.instanceOfModule(dataSource, 'Types/source:Memory')) {
            sourceQuery = new Promise((resolve) => {
                setTimeout(() => {
                    resolve(queryDeferred);
                }, 0);
            });
        } else {
            sourceQuery = queryDeferred;
        }
        return sourceQuery;
    }

    /**
     * Отменяет текущую загрузку данных
     * @private
     */
    private _cancelLoading(): void {
        // Promise в проекте работает как Deferred (@see WS.Core/core/polyfill/PromiseAPIDeferred).
        if (this._loader && !this._loader.isReady()) {
            this._loader.cancel();
        }
    }

    /**
     * Получает QueryParams из paramsController
     * @param {Direction} direction
     * @param paramsController
     * @private
     */
    private static _getNavigationQueryParams(direction: Direction, paramsController: INavigationController)
        : IAdditionalQueryParams {
        const {limit, offset, meta, filter} = paramsController.prepareQueryParams(direction);
        const queryParams = new QueryParamsBuilder({limit, offset, meta, filter});
        return queryParams.raw();
    }

    /**
     * Валидатор, позволяющий убедиться, что для source был точно передан Types/_source/ICrud
     * @param {Types/source:ICrud} source
     * @private
     */
    // TODO do we need this method at all?
    private static _isValidCrudSource(source: ICrud): boolean {
        if (!cInstance.instanceOfMixin(source, 'Types/_source/ICrud')) {
            Logger.error('NavigationController: Source option has incorrect type');
            return false;
        }
        return true;
    }
}
