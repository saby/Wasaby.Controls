import {ICrud} from 'Types/source';
import {CrudWrapper} from './CrudWrapper';
import {NavigationController} from 'Controls/source';
import {INavigationOptionValue,
        INavigationSourceConfig,
        Direction,
        TKey,
        IBaseSourceConfig,
        IFilterOptions,
        ISortingOptions,
        ISourceOptions,
        IHierarchyOptions,
        IGroupingOptions} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {Logger} from 'UI/Utils';
import {QueryOrderSelector, QueryWhereExpression} from 'Types/source';
import {IQueryParams} from 'Controls/_interface/IQueryParams';
import {default as groupUtil} from './GroupUtil';
import {isEqual} from 'Types/object';
import * as cInstance from 'Core/core-instance';
import {TArrayGroupId} from 'Controls/_list/Controllers/Grouping';

export interface IControlerState {
    keyProperty: string;
    source: ICrud;

    sorting: QueryOrderSelector;
    filter: QueryWhereExpression<unknown>;
    navigation: INavigationOptionValue<INavigationSourceConfig>;

    items: RecordSet;
    sourceController: Controller;
}

export interface IControllerOptions extends
    IFilterOptions,
    ISortingOptions,
    ISourceOptions,
    IHierarchyOptions,
    IGroupingOptions {
    dataLoadErrback?: Function;
    root?: string;
    navigation: INavigationOptionValue<INavigationSourceConfig>;
}

type LoadResult = Promise<RecordSet|Error>;

enum NAVIGATION_DIRECTION_COMPATIBILITY {
    up = 'forward',
    down = 'backward'
}

export default class Controller {
    private _options: IControllerOptions;
    private _filter: QueryWhereExpression<any>;
    private _crudWrapper: CrudWrapper;
    private _navigationController: NavigationController;
    private _items: RecordSet;
    private _loadPromise: LoadResult;

    constructor(cfg: IControllerOptions) {
        this._options = cfg;
        this._filter = cfg.filter;
    }
    load(direction?: Direction,
         key?: TKey,
         navigationSourceConfig?: INavigationSourceConfig
    ): LoadResult {
        return this._load(direction, key, navigationSourceConfig);
    }

    reload(multiNavigation: boolean): LoadResult {
        this._navigationController = null;
        return this._load();
    }

    setItems(items: RecordSet): RecordSet {
        this._setItems(items);

        if (this._options.navigation) {
            this._getNavigationController(this._options.navigation).updateQueryProperties(items);
        }

        return this._items;
    }

    getItems(): RecordSet {
        return this._items;
    }

    setFilter(filter: QueryWhereExpression<any>): void {
        this._filter = filter;
    }

    getFilter(): QueryWhereExpression<unknown> {
        return this._filter;
    }

    updateOptions(newOptions: IControllerOptions): boolean {
        const isFilterChanged = !isEqual(newOptions.filter, this._options.filter);
        const isSourceChanged = newOptions.source !== this._options.source;
        const isNavigationChanged = !isEqual(newOptions.navigation, this._options.navigation);
        if (isFilterChanged) {
            this._filter = newOptions.filter;
        }

        if (isSourceChanged && this._crudWrapper) {
            this._crudWrapper.updateOptions({source: newOptions.source});
        }

        if (isNavigationChanged) {
            if (newOptions.navigation) {
                if (this._navigationController)  {
                    this._navigationController.updateOptions({
                        navigationType: newOptions.navigation.source,
                        navigationConfig: newOptions.navigation.sourceConfig
                    });
                } else {
                    this._navigationController = this._getNavigationController(newOptions.navigation);
                }
            }

        }

        const isChanged =
            isFilterChanged ||
            isNavigationChanged ||
            isSourceChanged ||
            newOptions.sorting !== this._options.sorting ||
            newOptions.keyProperty !== this._options.keyProperty ||
            newOptions.root !== this._options.root;

        this._options = newOptions;
        return isChanged;
    }

    getState(): IControlerState {
        return {
            keyProperty: this._options.keyProperty,
            source: this._options.source,

            filter: this._filter,
            sorting: this._options.sorting,
            navigation: this._options.navigation,

            items: this._items,
            sourceController: this
        };
    }

    hasMoreData(direction: Direction, key?: TKey): boolean {
        let hasMoreData = false;

        if (this._options.navigation) {
            hasMoreData = this._getNavigationController(this._options.navigation)
                .hasMoreData(NAVIGATION_DIRECTION_COMPATIBILITY[direction], key);
        }

        return hasMoreData;
    }

    isLoading(): boolean {
        return !!this._loadPromise;
    }

    // TODO обсудить
    cancelLoading(): void {
        //?
    }

    setState(): void {
        //?
    }

    setEdgeState() {
        //??
    }

    destroy(): void {
        this.cancelLoading();

        if (this._navigationController) {
            this._navigationController.destroy();
            this._navigationController = null;
        }
    }

    private _getCrudWrapper(sourceOption: ICrud): CrudWrapper {
        if (!this._crudWrapper) {
            this._crudWrapper = new CrudWrapper({source: sourceOption});
        }
        return this._crudWrapper;
    }

    private _getNavigationController(
        navigationOption: INavigationOptionValue<INavigationSourceConfig>
    ): NavigationController {
        if (!this._navigationController) {
            this._navigationController = new NavigationController({
                navigationType: navigationOption.source,
                navigationConfig: navigationOption.sourceConfig
            });
        }

        return this._navigationController;
    }

    private _updateQueryPropertiesByItems(
        list: RecordSet,
        id?: TKey,
        navigationConfig?: IBaseSourceConfig,
        direction?: Direction
    ): void {
        if (this._options.navigation) {
            this._getNavigationController(this._options.navigation)
                .updateQueryProperties(list, id, navigationConfig, NAVIGATION_DIRECTION_COMPATIBILITY[direction]);
        }
    }

    private _prepareQueryParams(
        queryParams: IQueryParams,
        key: TKey,
        navigationSourceConfig: INavigationSourceConfig,
        direction: Direction
        ): IQueryParams {
        const navigationController = this._getNavigationController(this._options.navigation);
        return navigationController.getQueryParams(
            {
                filter: queryParams.filter,
                sorting: queryParams.sorting
            },
            key,
            navigationSourceConfig,
            NAVIGATION_DIRECTION_COMPATIBILITY[direction]
        );
    }

    private _setItems(items: RecordSet): void {
        if (this._items && Controller._isEqualItems(this._items, items)) {
            this._items.assign(items);
        } else {
            this._items = items;
        }
    }

    private _load(
        direction?: Direction,
        key?: TKey,
        navigationSourceConfig?: INavigationSourceConfig
    ): LoadResult {
        if (this._options.source) {
            this._loadPromise = Controller._getFilterForCollapsedGroups(this._filter, this._options).then((filter) => {
                const preparedFilter = Controller._getFilterHierarchy(filter, this._options, key);
                const crudWrapper = this._getCrudWrapper(this._options.source);
                let params = {
                    filter: preparedFilter,
                    sorting: this._options.sorting
                } as IQueryParams;

                if (this._options.navigation) {
                    params = this._prepareQueryParams(params, key, navigationSourceConfig, direction);
                }
                return crudWrapper.query(params, this._options.keyProperty).then((result) => {
                    if (result instanceof Error) {
                        if (this._options.dataLoadErrback instanceof Function) {
                            this._options.dataLoadErrback(result);
                        }
                    }
                    if (result instanceof RecordSet) {
                        this._updateQueryPropertiesByItems(result, key, navigationSourceConfig, direction);
                    }
                    return result;
                });
            }).finally(() => {
                this._loadPromise = null;
            });
            return this._loadPromise;
        } else {
            Logger.error('source/Controller: Source option has incorrect type');
            return Promise.reject(new Error('source/Controller: Source option has incorrect type'));
        }
    }

    private static _isEqualItems(oldList: RecordSet, newList: RecordSet): boolean {
        const getProtoOf = Object.getPrototypeOf.bind(Object);
        return oldList && cInstance.instanceOfModule(oldList, 'Types/collection:RecordSet') &&
               (newList.getModel() === oldList.getModel()) &&
               (newList.getKeyProperty() === oldList.getKeyProperty()) &&
               (getProtoOf(newList).constructor == getProtoOf(newList).constructor) &&
               (getProtoOf(newList.getAdapter()).constructor == getProtoOf(oldList.getAdapter()).constructor);
    }

    private static _getFilterForCollapsedGroups(
        initialFilter: QueryWhereExpression<unknown>,
        options: IControllerOptions
    ): Promise<QueryWhereExpression<unknown>> {
        const hasGrouping = !!options.groupProperty || !!options.groupingKeyCallback;
        const historyId = hasGrouping ? (options.groupHistoryId || options.historyIdCollapsedGroups) : undefined;

        if (historyId) {
            return groupUtil.restoreCollapsedGroups(historyId).then((collapsedGroups?: TArrayGroupId) => {
                let modifiedFilter: Record<string, unknown> = {};
                if (collapsedGroups && collapsedGroups.length) {
                    modifiedFilter = { ...initialFilter };
                    modifiedFilter.collapsedGroups = collapsedGroups;
                }
                return modifiedFilter;
            });
        } else {
            return Promise.resolve(initialFilter);
        }
    }

    private static _getFilterHierarchy(
        initialFilter: QueryWhereExpression<unknown>,
        options: IControllerOptions,
        root?: TKey): QueryWhereExpression<unknown> {
        const rootForFilter = root || options.root;
        let modifiedFilter = {};

        if (rootForFilter && options.parentProperty) {
            modifiedFilter = {...initialFilter};
            modifiedFilter[options.parentProperty] = rootForFilter;
            return modifiedFilter;
        }

        return initialFilter;
    }

}
