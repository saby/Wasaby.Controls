import {ISourceOptions, IHierarchyOptions, IFilterOptions, INavigationOptions, ISortingOptions} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import cInstance = require('Core/core-instance');
import {CrudWrapper} from 'Controls/dataSource';
import {NavigationController} from 'Controls/source';
import {IAdditionalQueryParams} from 'Controls/_interface/IAdditionalQueryParams';
import {ContextOptions} from 'Controls/context';
import {PrefetchProxy, DataSet, ICrudPlus, QueryWhere, ICrud} from 'Types/source';
import {isEqual} from 'Types/object';
import {TArrayGroupId, prepareFilterCollapsedGroups} from 'Controls/_list/Controllers/Grouping';
import {groupUtil} from 'Controls/dataSource';

export interface IDataOptions extends ISourceOptions,
    IHierarchyOptions,
    IFilterOptions,
    INavigationOptions<unknown>,
    ISortingOptions {
    dataLoadErrback?: Function;
    root?: string|number|null;
    groupProperty?: string;
    groupingKeyCallback?: Function;
    groupHistoryId?: string;
    historyIdCollapsedGroups?: string;
}

export interface IDataContextOptions extends ISourceOptions,
    INavigationOptions<unknown>,
    IFilterOptions,
    ISortingOptions {
    prefetchSource: PrefetchProxy;
    keyProperty: string;
    items: RecordSet;
}

export default class DataControllerClass {
    private _options: IDataOptions;
    private _items: RecordSet;
    private _prefetchSource: PrefetchProxy;
    private _filter: QueryWhere;

    constructor(options: IDataOptions) {
        this._options = options;
        this._filter = options.filter;
    }

    update(newOptions: IDataOptions): boolean {
        const isChanged =
            !isEqual(newOptions.filter, this._options.filter) ||
            !isEqual(newOptions.navigation, this._options.navigation) ||
            newOptions.sorting !== this._options.sorting ||
            newOptions.keyProperty !== this._options.keyProperty ||
            newOptions.root !== this._options.root;

        this._options = newOptions;

        if (isChanged) {
            this._filter = newOptions.filter;
        }

        return isChanged;
    }

    setItems(items: RecordSet): RecordSet {
        if (items && DataControllerClass._isEqualItems(this._items, items)) {
            this._items.setMetaData(items.getMetaData());
            this._items.assign(items);
        } else {
            this._items = items;
        }
        this._prefetchSource = this._getPrefetchSource(this._items);
        return this._items;
    }

    setFilter(filter: object): void {
        this._filter = filter;
    }

    updateContext(context: typeof ContextOptions): void {
        const contextOptions = this._getContextOptions();

        for (const i in contextOptions) {
            if (contextOptions.hasOwnProperty(i)) {
                context[i] = contextOptions[i];
            }
        }
        context.updateConsumers();
    }

    updatePrefetchProxy(items: RecordSet): void {
        this._prefetchSource = this._getPrefetchSource(items);
    }

    createContext(options?: IDataContextOptions): typeof ContextOptions {
        return new ContextOptions(options);
    }

    loadItems(): Promise<RecordSet> {
        const options = this._options;
        const groupHistoryId = DataControllerClass._getGroupHistoryId(options);
        let filterPromise;

        if (typeof groupHistoryId !== 'string') {
            filterPromise = Promise.resolve(this._filter);
        } else {
            filterPromise = groupUtil.restoreCollapsedGroups(groupHistoryId).then((collapsedGroups?: TArrayGroupId) => {
                return prepareFilterCollapsedGroups(collapsedGroups, this._filter || {});
            });
        }

        return filterPromise.then((filter) => {
            const preparedFilter = DataControllerClass._prepareFilter(filter, options);
            const crudWrapper = new CrudWrapper({
                source: options.source as unknown as ICrud
            });
            let params = {
                filter: preparedFilter,
                sorting: options.sorting
            } as IAdditionalQueryParams;

            if (options.navigation && options.navigation.source) {
                const navigationController = new NavigationController({
                    navigationType: options.navigation.source,
                    navigationConfig: options.navigation.sourceConfig
                });
                params = navigationController.getQueryParams({
                    filter: params.filter,
                    sorting: params.sorting
                });
            }
            return crudWrapper.query(
                params,
                this._options.keyProperty
            ).then((result) => {
                if (result instanceof Error) {
                    if (this._options.dataLoadErrback instanceof Function) {
                        this._options.dataLoadErrback(result);
                    }
                }
                return result;
            });
        });
    }

    private _getContextOptions(): IDataContextOptions {
        return {
            filter: this._filter,
            navigation: this._options.navigation,
            keyProperty: this._options.keyProperty,
            sorting: this._options.sorting,
            items: this._items,
            prefetchSource: this._prefetchSource,
            source: this._options.source
        };
    }

    private _getPrefetchSource(data: RecordSet|DataSet|Error): PrefetchProxy {
        return new PrefetchProxy({
            target: DataControllerClass._getSource(this._options.source),
            data: {
                query: data
            }
        });
    }

    private static _isEqualItems(oldList: RecordSet, newList: RecordSet): boolean {
        return oldList && cInstance.instanceOfModule(oldList, 'Types/collection:RecordSet') &&
            (newList.getModel() === oldList.getModel()) &&
            (newList.getKeyProperty() === oldList.getKeyProperty()) &&
            // tslint:disable-next-line:triple-equals
            (Object.getPrototypeOf(newList).constructor == Object.getPrototypeOf(newList).constructor) &&
            // tslint:disable-next-line:triple-equals
            (Object.getPrototypeOf(newList.getAdapter()).constructor == Object.getPrototypeOf(oldList.getAdapter()).constructor);
    }

    private static _getSource(source: ICrudPlus|PrefetchProxy): ICrudPlus {
        return source instanceof PrefetchProxy ? source.getOriginal() : source;
    }

    private static _getGroupHistoryId(options: IDataOptions): string {
        const hasGrouping = !!options.groupProperty || !!options.groupingKeyCallback;
        return hasGrouping ? (options.groupHistoryId || options.historyIdCollapsedGroups) : undefined;
    }

    private static _prepareFilter(filter: object, options: IDataOptions): object {
        let resultFilter = filter;

        if (options.root && options.parentProperty) {
            resultFilter = {...filter};
            resultFilter[options.parentProperty] = options.root;
        }

        return resultFilter;
    }
}
