import {QueryOrderSelector, QueryWhereExpression} from 'Types/source';
import {RecordSet, List} from 'Types/collection';
import {INavigationOptionValue} from 'Controls/interface';
import {Logger} from 'UI/Utils';

import * as cClone from 'Core/core-clone';

import {IQueryParamsController} from './interface/IQueryParamsController';
import PageNavigationStore from './NavigationController/PageNavigationStore';
import PageParamsCalculator from './NavigationController/PageParamsCalculator';
import PositionNavigationStore from './NavigationController/PositionNavigationStore';
import PositionParamsCalculator from './NavigationController/PositionParamsCalculator';

import {Direction, IAdditionalQueryParams, IAdditionQueryParamsMeta} from 'Controls/_interface/IAdditionalQueryParams';
import {TNavigationSource, INavigationSourceConfig} from 'Controls/_interface/INavigation';

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
type IType<T> = new(...args: any[]) => T;

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
interface IDictionary<T> {
    [key: string]: T;
}

/**
 * Фабрика для создания экземпляра контроллера запроса навигации.
 * @remark
 * Поддерживает два варианта - 'page' и 'position'
 * @class Controls/_source/NavigationControllerFactory
 * @example
 * const cName:INavigationOptionValue<INavigationPageSourceConfig> = {source: 'page'};
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
 * const cName:INavigationOptionValue<INavigationPageSourceConfig> = {source: 'page'};
 * const controller = NavigationControllerFactory.resolve(cName);
 * @private
 * @author Аверкиев П.А.
 */
type TNavigationStore = PageNavigationStore | PositionNavigationStore;
type TNavigationCalculator = PageParamsCalculator | PositionParamsCalculator;

class NavigationStoreFactory {
    static factorySource: IDictionary<IType<TNavigationStore>> = {
        page: PageNavigationStore,
        position: PositionNavigationStore
    };

    static resolve(type: TNavigationSource, config: INavigationSourceConfig): IQueryParamsController {
        if (type && type in this.factorySource) {
            return new this.factorySource[type](config);
        }
        Logger.error('NavigationController: Undefined navigation source type "' + type + '"');
        return;
    }
}

export interface INavigationControllerOptions {
    /**
     * @name Controls/_source/NavigationController#navigation
     * @cfg {Types/source:INavigationOptionValue<INavigationSourceConfig>} Опции навигации
     */
    /*
     * @name Controls/_source/NavigationController#navigation
     * @cfg {Types/source:INavigationOptionValue} Navigation options
     */
    navigationType: TNavigationSource;
    navigationConfig?: INavigationSourceConfig;
}

type TKey = string | number | null; // TODO общий тип

interface IQueryParamsControllerItem {
    id: TKey;
    queryParamsController: IQueryParamsController;
}

interface IGetQueryParamsArg {
    filter: QueryWhereExpression<unknown>;
    sorting: QueryOrderSelector;
    navigationConfig?: INavigationSourceConfig;
}

/**
 * Контроллер постраничной навигации
 * @remark
 * Хранит состояние навигации INavigationOptionValue<INavigationSourceConfig> и вычисляет на его основании параметры для построения запроса Query
 *
 * @class Controls/source/NavigationController
 *
 * @control
 * @public
 * @author Аверкиев П.А.
 */
/*
 * Per-page navigation controller
 * @remark
 * Stores the navigation state and calculates on its base params to build Query
 *
 * @class Controls/source/NavigationController
 *
 * @control
 * @public
 * @author Аверкиев П.А.
 */

export class NavigationController {

    private _navigationType: TNavigationSource;
    private _navigationConfig: INavigationSourceConfig;
    private readonly _navigationStores: List<TNavigationStore> = null;

    constructor(cfg: INavigationControllerOptions) {
        this._navigationType = cfg.navigationType;
        this._navigationConfig = cfg.navigationConfig;

        if (this._navigationType) {
            this._navigationStores = new List();
        } else {
            Logger.error('NavigationController: navigationType option is undefined');
        }
    }

    /**
     * Строит запрос данных на основе переданных параметров filter и sorting
     * Если в опцию navigation был передан объект INavigationOptionValue<INavigationSourceConfig>, его filter, sorting и настрйоки пейджинации
     * также одбавляются в запрос.
     * @param direction {Direction} Направление навигации.
     * @param filter {Types/source:QueryWhereExpression} Настрйоки фильтрации
     * @param sorting {Types/source:QueryOrderSelector} Настрйки сортировки
     */

    getQueryParams(getQueryArgs: IGetQueryParamsArg, id: TKey = null): IAdditionalQueryParams {
        const queryParams = this._getCleanParams(getQueryArgs);

        // Если id не передан то берется стор для корневого раздела, для которого жесткий id=null
        const store = this._getStore(id);
        const calculator = this._getCalculator();
        const navigationQueryConfig = getQueryArgs.navigationConfig || {};

        const addParams = calculator.getQueryParams(store, navigationQueryConfig);
        return this._mergeParams(queryParams, addParams);
    }

    getQueryParamsHierarchical(filter: QueryWhere, sorting: QueryOrderSelector, navigationConfig?) {

    }

    getQueryParamsForward(filter: QueryWhere, sorting: QueryOrderSelector, navigationConfig?) {

    }

    getQueryParamsBackward(filter: QueryWhere, sorting: QueryOrderSelector, navigationConfig?) {

    }

    private _getStore(id: TKey): TNavigationStore {
        let resStore: TNavigationStore;
        if (this._navigationStores[id]) {
            resStore = this._navigationStores[id];
        } else {
            resStore = NavigationStoreFactory.resolve(this._navigationType, this._navigationConfig);
        }
        return resStore;
    }

    private _getCalculator(): TNavigationCalculator {
        let resCalculator;
        switch (this._navigationType) {
            case 'page': resCalculator = PageParamsCalculator; break;
            case 'position': resCalculator = PositionParamsCalculator; break;
        }
        return resCalculator;
    }

    private _mergeParams(clean: IAdditionalQueryParams, add: IAdditionalQueryParams): IAdditionalQueryParams {
        const resultParams = clean;

        resultParams.limit = add.limit;
        resultParams.offset = add.offset;

        if (add.filter) {
            // we can't modify original filter
            resultParams.filter = cClone(resultParams.filter);
            const navFilter = add.filter;
            for (let i in navFilter) {
                if (navFilter.hasOwnProperty(i)) {
                    resultParams.filter[i] = navFilter[i];
                }
            }
        }

        if (add.meta) {
            resultParams.meta = add.meta;
        }

        return resultParams;
    }

    private _getCleanParams(getQueryArgs: IGetQueryParamsArg): IAdditionalQueryParams {
        return {
            filter: getQueryArgs.filter || {},
            sorting: getQueryArgs.sorting,
            limit: undefined,
            offset: undefined
        };
    }
    /**
     * Вычисляет следующее состояние контроллера параметров запроса: следующую страницу, или позицию
     * @param list {Types/collection:RecordSet} объект, содержащий метаданные текущего запроса
     * @param direction {Direction} направление навигации ('up' или 'down')
     */
    /*
     * Calculates next query params controller state: next page, or position
     * @param list {Types/collection:RecordSet} object containing meta information for current request
     * @param direction {Direction} nav direction ('up' or 'down')
     */
    updateQueryProperties(list?: RecordSet, direction?: Direction): void {
        if (this._queryParamsController) {
            this._queryParamsController.updateQueryProperties(list, direction);
        }
    }

    /**
     * Позволяет устанавить конфиг для контроллера навигации
     * @remark
     * @param config INavigationSourceConfig
     */
    /*
     * Allows to set navigation controller config
     * @remark
     * @param config INavigationSourceConfig
     */
    setConfig(config: INavigationSourceConfig): void {
        if (this._queryParamsController) {
            this._queryParamsController.setConfig(config);
        }
    }

    /**
     * разрушает IQueryParamsController
     */
    /*
     * destroy current IQueryParamsController
     */
    destroy(): void {
        if (this._queryParamsController) {
            this._queryParamsController.destroy();
        }
        this._options = null;
    }
}
