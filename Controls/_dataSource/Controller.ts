import {Query, ICrud, DataSet} from 'Types/source';
import {CrudWrapper} from './CrudWrapper';
import {NavigationController} from 'Controls/source';
import {INavigationOptionValue, INavigationSourceConfig} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {Logger} from 'UI/Utils';
import {QueryOrderSelector, QueryWhereExpression, PrefetchProxy} from 'Types/source';
import {IAdditionalQueryParams} from 'Controls/_interface/IAdditionalQueryParams';
import {default as groupUtil} from './GroupUtil';
import {isEqual} from 'Types/object';

export interface IControlerState {
    keyProperty: string;
    source: ICrud;

    sorting: QueryOrderSelector;
    filter: QueryWhereExpression<any>;
    navigation: INavigationOptionValue<INavigationSourceConfig>;

    items: RecordSet;
    prefetchSource: PrefetchProxy;
}

export interface IControllerOptions {
    keyProperty: string;
    source: ICrud;

    filter: QueryWhereExpression<any>;
    sorting: QueryOrderSelector;
    navigation: INavigationOptionValue<INavigationSourceConfig>;

    dataLoadErrback: Function;

    parentProperty: string;
    root: string;

    // for grouping
    groupProperty: string;
    groupingKeyCallback: Function;
    groupHistoryId: string;
    historyIdCollapsedGroups: string;
}

export default class Controller {
    private _options: IControllerOptions;
    private _filter: QueryWhereExpression<any>;
    private _crudWrapper: CrudWrapper;
    private _navigationController: NavigationController;
    private _items: RecordSet;

    constructor(cfg: IControllerOptions) {
        this._options = cfg;
        this._filter = cfg.filter;
    }
    load(): Promise<RecordSet> {
        if (this._options.source) {
            // todo можно передавать меньше опций здесь, просто из-за совместимости юзается 4 опции для групп вместо 2х
            return Controller._getFilterForCollapsedGroups(this._filter, this._options).then((filter) => {
                const preparedFilter = Controller._getFilterHierarchy(filter, this._options);
                const crudWrapper = this._getCrudWrapper(this._options.source);
                let params = {
                    filter: preparedFilter,
                    sorting: this._options.sorting
                } as IAdditionalQueryParams;

                if (this._options.navigation) {
                    const navigationController = this._getNavigationController(this._options.navigation);
                    params = navigationController.getQueryParams({
                        filter: params.filter,
                        sorting: params.sorting
                    });
                }
                return crudWrapper.query(params, this._options.keyProperty).then((result) => {
                    if (result instanceof Error) {
                        if (this._options.dataLoadErrback instanceof Function) {
                            this._options.dataLoadErrback(result);
                        }
                    }
                    return result;
                });
            });
        } else {
            Logger.error('source/Controller: Source option has incorrect type');
            return Promise.reject(new Error('source/Controller: Source option has incorrect type'));
        }
    }

    setItems(items: RecordSet): RecordSet {
        this._items = items;
        return this._items;
    }

    setFilter(filter: QueryWhereExpression<any>): void {
        this._filter = filter;
    }

    update(newOptions: IControllerOptions): boolean {
        const isFilterChanged = !isEqual(newOptions.filter, this._options.filter);
        if (isFilterChanged) {
            this._filter = newOptions.filter;
        }

        const isChanged =
            isFilterChanged ||
            !isEqual(newOptions.navigation, this._options.navigation) ||
            newOptions.source !== this._options.source ||
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
            prefetchSource: this.getPrefetchSource(this._items)
        };
    }

    getPrefetchSource(data: RecordSet|DataSet|Error): PrefetchProxy {
        if (data) {
            let source = this._options.source;
            source = source instanceof PrefetchProxy ? source.getOriginal() : source;
            return new PrefetchProxy({
                target: source,
                data: {
                    query: data
                }
            });
        }
    }

    private _getCrudWrapper(sourceOption: ICrud): CrudWrapper {
        // TODO https://online.sbis.ru/opendoc.html?guid=fbee8765-cfc2-40b7-9d0d-75655412b284
        this._crudWrapper = new CrudWrapper({source: sourceOption});
        return this._crudWrapper;
    }

    private _getNavigationController(
        navigationOption: INavigationOptionValue<INavigationSourceConfig>
    ): NavigationController {
        // TODO https://online.sbis.ru/opendoc.html?guid=fbee8765-cfc2-40b7-9d0d-75655412b284
        this._navigationController = new NavigationController({
            navigationType: navigationOption.source,
            navigationConfig: navigationOption.sourceConfig
        });

        return this._navigationController;
    }

    private static _getFilterForCollapsedGroups(
        initialFilter: QueryWhereExpression<any>,
        options: IControllerOptions
    ): Promise<QueryWhereExpression<any>> {
        const hasGrouping = !!options.groupProperty || !!options.groupingKeyCallback;
        const historyId = hasGrouping ? (options.groupHistoryId || options.historyIdCollapsedGroups) : undefined;

        if (historyId) {
            return groupUtil.restoreCollapsedGroups(historyId).then((collapsedGroups?: TArrayGroupId) => {
                let modifiedFilter = {};
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
        initialFilter: QueryWhereExpression<any>,
        options: IControllerOptions): QueryWhereExpression<any> {
        let modifiedFilter = {};

        if (options.root && options.parentProperty) {
            modifiedFilter = {...initialFilter};
            modifiedFilter[options.parentProperty] = options.root;
            return modifiedFilter;
        }

        return initialFilter;
    }

}
