import {ICrud, ICrudPlus, IData, PrefetchProxy, QueryOrderSelector, QueryWhereExpression} from 'Types/source';
import {CrudWrapper} from './CrudWrapper';
import {default as NavigationController, INavigationControllerOptions} from 'Controls/_dataSource/NavigationController';
import {INavigationOptionValue,
        INavigationSourceConfig,
        Direction,
        TKey,
        IBaseSourceConfig,
        IFilterOptions,
        ISortingOptions,
        IHierarchyOptions,
        IGroupingOptions,
        ISourceOptions,
        IPromiseSelectableOptions,
        INavigationOptions} from 'Controls/interface';
import {TNavigationPagingMode} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {Record as EntityRecord, CancelablePromise, Model, EventRaisingMixin, ObservableMixin} from 'Types/entity';
import {Logger} from 'UI/Utils';
import {IQueryParams} from 'Controls/_interface/IQueryParams';
import {default as groupUtil} from './GroupUtil';
import {isEqual} from 'Types/object';
import {mixin} from 'Types/util';
// @ts-ignore
import * as cInstance from 'Core/core-instance';
import {TArrayGroupId} from 'Controls/_list/Controllers/Grouping';
import {wrapTimeout} from 'Core/PromiseLib/PromiseLib';
import {fetch, HTTPStatus} from 'Browser/Transport';

export interface IListConfiguration {
    selectedKeys?: TKey;
    excludedKeys?: TKey;
}

export interface IControllerState {
    keyProperty: string;
    source: ICrud | ICrudPlus;

    sorting: QueryOrderSelector;
    filter: QueryWhereExpression<unknown>;
    navigation: INavigationOptionValue<INavigationSourceConfig>;

    parentProperty?: string;
    root?: TKey;

    items: RecordSet;
    sourceController: Controller;
    dataLoadCallback: Function;

    listConfigurations: {
        [key: string]: IListConfiguration
    };
}

export interface IControllerOptions extends
    IFilterOptions,
    ISortingOptions,
    IHierarchyOptions,
    IGroupingOptions,
    ISourceOptions,
    IPromiseSelectableOptions,
    INavigationOptions<INavigationSourceConfig> {
    dataLoadErrback?: Function;
    dataLoadCallback?: Function;
    root?: TKey;
    expandedItems?: TKey[];
    deepReload?: boolean;
    collapsedGroups?: TArrayGroupId;
    navigationParamsChangedCallback?: Function;
    loadTimeout?: number;
}

interface ILoadConfig {
    filter?: QueryWhereExpression<unknown>;
    sorting?: QueryOrderSelector;
    key?: TKey;
    navigationSourceConfig?: INavigationSourceConfig;
    direction?: Direction;
}

type LoadPromiseResult = RecordSet|Error;
type LoadResult = Promise<LoadPromiseResult>;

enum NAVIGATION_DIRECTION_COMPATIBILITY {
    up = 'backward',
    down = 'forward'
}

export function isEqualItems(oldList: RecordSet, newList: RecordSet): boolean {
    const getProtoOf = Object.getPrototypeOf.bind(Object);
    const items1Model = oldList.getModel();
    const items2Model = newList.getModel();
    let isModelEqual = items1Model === items2Model;

    function getModelModuleName(model: string|Function): string {
        let name;

        if (typeof model === 'function') {
            name = model.prototype._moduleName;
        } else {
            name = model;
        }

        return name;
    }

    if (!isModelEqual && (getModelModuleName(items1Model) === getModelModuleName(items2Model))) {
        isModelEqual = true;
    }
    return oldList && cInstance.instanceOfModule(oldList, 'Types/collection:RecordSet') &&
        isModelEqual &&
        (newList.getKeyProperty() === oldList.getKeyProperty()) &&
        // tslint:disable-next-line:triple-equals
        (getProtoOf(newList).constructor == getProtoOf(newList).constructor) &&
        // tslint:disable-next-line:triple-equals
        (getProtoOf(newList.getAdapter()).constructor == getProtoOf(oldList.getAdapter()).constructor);
}

export default class Controller extends mixin<
    ObservableMixin,
    EventRaisingMixin
    >(
    ObservableMixin,
    EventRaisingMixin
) {
    private _options: IControllerOptions;
    private _filter: QueryWhereExpression<unknown>;
    private _items: RecordSet;
    private _loadPromise: CancelablePromise<RecordSet|Error>;
    private _loadError: Error;

    private _dataLoadCallback: Function;
    // Необходимо для совместимости в случае, если dataLoadCallback задают на списке, а где-то сверху есть dataContainer
    private _dataLoadCallbackFromOptions: Function;

    private _crudWrapper: CrudWrapper;
    private _navigationController: NavigationController;
    private _navigationParamsChangedCallback: Function;
    private _navigation: INavigationOptionValue<INavigationSourceConfig>;

    private _parentProperty: string;
    private _root: TKey = null;

    private _expandedItems: TKey[];
    private _deepReload: boolean;
    private _collapsedGroups: TArrayGroupId;

    constructor(cfg: IControllerOptions) {
        super();
        EventRaisingMixin.call(this, cfg);
        this._options = cfg;
        this.setFilter(cfg.filter);
        this.setNavigation(cfg.navigation);

        if (cfg.root !== undefined) {
            this._setRoot(cfg.root);
        }
        if (cfg.dataLoadCallback !== undefined) {
            this._setDataLoadCallbackFromOptions(cfg.dataLoadCallback);
        }
        this.setParentProperty(cfg.parentProperty);
        this._resolveNavigationParamsChangedCallback(cfg);
        this._collectionChange = this._collectionChange.bind(this);
    }
    load(direction?: Direction,
         key: TKey = this._root,
         filter?: QueryWhereExpression<unknown>
    ): LoadResult {
        return this._load({
            direction,
            key,
            filter
        });
    }

    reload(sourceConfig?: INavigationSourceConfig): LoadResult {
        this._deepReload = true;

        return this._load({
            key: this._root,
            navigationSourceConfig: sourceConfig
        }).then((result) => {
            this._deepReload = false;
            return result;
        });
    }

    read(key: TKey, meta?: object): Promise<EntityRecord> {
        return (this._options.source as ICrud).read(key, meta);
    }

    update(item: Model): Promise<void> {
        return (this._options.source as ICrud).update(item);
    }

    create(meta?: object): Promise<EntityRecord> {
        return (this._options.source as ICrud).create(meta);
    }

    setItems(items: RecordSet): RecordSet {
        if (this._hasNavigationBySource()) {
            this._destroyNavigationController();
            this._getNavigationController(this._navigation).updateQueryProperties(items, this._root);
        }
        this._setItems(items);
        return this._items;
    }

    getItems(): RecordSet {
        return this._items;
    }

    getKeyProperty(): string {
        const options = this._options;
        let keyProperty;

        if (options.keyProperty) {
            keyProperty = this._options.keyProperty;
        } else if (options.source && (options.source as IData).getKeyProperty) {
            keyProperty = (options.source as IData).getKeyProperty();
        }

        return keyProperty;
    }

    getLoadError(): Error {
        return this._loadError;
    }

    setFilter(filter: QueryWhereExpression<unknown>): QueryWhereExpression<unknown> {
        return this._filter = filter;
    }

    getFilter(): QueryWhereExpression<unknown> {
        return this._filter;
    }

    getSorting(): unknown {
        return this._options.sorting;
    }

    setNavigation(navigation: INavigationOptionValue<INavigationSourceConfig>): void {
        this._navigation = navigation;

        if (navigation && this._hasNavigationBySource(navigation)) {
            if (this._navigationController) {
                this._navigationController.updateOptions(this._getNavigationControllerOptions(navigation));
            }
        } else {
            this._destroyNavigationController();
        }
    }

    setRoot(key: TKey): void {
        this._setRoot(key);
        this._notify('rootChanged', key);
    }

    getRoot(): TKey {
        return this._root;
    }

    // FIXME, если parentProperty задаётся на списке, а не на data(browser)
    setParentProperty(parentProperty: string): void {
        this._parentProperty = parentProperty;
    }

    updateOptions(newOptions: IControllerOptions): boolean {
        const isFilterChanged =
            !isEqual(newOptions.filter, this._options.filter) &&
            !isEqual(this._filter, newOptions.filter);
        const isSourceChanged = newOptions.source !== this._options.source;
        const isNavigationChanged = !isEqual(newOptions.navigation, this._options.navigation);
        const rootChanged =
            newOptions.root !== undefined &&
            newOptions.root !== this._options.root &&
            newOptions.root !== this._root;
        const isExpadedItemsChanged = !isEqual(this._options.expandedItems, newOptions.expandedItems);
        const dataLoadCallbackChanged =
            newOptions.dataLoadCallback !== undefined &&
            newOptions.dataLoadCallback !== this._options.dataLoadCallback;
        this._resolveNavigationParamsChangedCallback(newOptions);

        if (isFilterChanged) {
            this.setFilter(newOptions.filter);
        }

        if (newOptions.parentProperty !== undefined && newOptions.parentProperty !== this._options.parentProperty) {
            this.setParentProperty(newOptions.parentProperty);
        }

        if (rootChanged) {
            this.setRoot(newOptions.root);

            if (!isExpadedItemsChanged) {
                this.setExpandedItems([]);
            }
        }

        if (dataLoadCallbackChanged) {
            this._setDataLoadCallbackFromOptions(newOptions.dataLoadCallback);
        }

        if (newOptions.expandedItems !== undefined && isExpadedItemsChanged) {
            this.setExpandedItems(newOptions.expandedItems);
        }

        if (isSourceChanged && this._crudWrapper) {
            this._crudWrapper.updateOptions({source: newOptions.source as ICrud});
        }

        if (isNavigationChanged) {
            this.setNavigation(newOptions.navigation);
        }

        const isChanged =
            isFilterChanged ||
            isNavigationChanged ||
            isSourceChanged ||
            !isEqual(newOptions.sorting, this._options.sorting) ||
            (this._parentProperty && rootChanged);

        this._options = newOptions;
        return isChanged;
    }

    getState(): IControllerState {
        const source = Controller._getSource(this._options.source);

        return {
            keyProperty: this.getKeyProperty(),
            source,

            filter: this._filter,
            sorting: this._options.sorting,
            navigation: this._options.navigation,

            parentProperty: this._parentProperty,
            root: this._root,

            items: this._items,
            // FIXME sourceController не должен создаваться, если нет source
            // https://online.sbis.ru/opendoc.html?guid=3971c76f-3b07-49e9-be7e-b9243f3dff53
            sourceController: source ? this : null,
            dataLoadCallback: this._options.dataLoadCallback,
            listConfigurations: {}
        };
    }

    getCollapsedGroups(): TArrayGroupId {
        return this._collapsedGroups;
    }

    // FIXME для работы дерева без bind'a опции expandedItems
    setExpandedItems(expandedItems: TKey[]): void {
        this._expandedItems = expandedItems;
    }

    getExpandedItems(): TKey[] {
        return this._expandedItems;
    }

    hasMoreData(direction: Direction, key: TKey = this._root): boolean {
        let hasMoreData = false;

        if (this._hasNavigationBySource()) {
            hasMoreData = this._getNavigationController(this._navigation)
                .hasMoreData(NAVIGATION_DIRECTION_COMPATIBILITY[direction], key);
        }

        return hasMoreData;
    }

    setDataLoadCallback(callback: Function): void {
        this._dataLoadCallback = callback;
    }

    hasLoaded(key: TKey): boolean {
        let loadedResult = false;

        if (this._hasNavigationBySource()) {
            loadedResult = this._getNavigationController(this._navigation).hasLoaded(key);
        }

        return loadedResult;
    }

    isLoading(): boolean {
        return !!this._loadPromise;
    }

    shiftToEdge(direction: Direction, id: TKey, shiftMode: TNavigationPagingMode): IBaseSourceConfig {
        if (this._hasNavigationBySource()) {
            return this._getNavigationController(this._navigation)
                .shiftToEdge(NAVIGATION_DIRECTION_COMPATIBILITY[direction], id, shiftMode);
        }
    }

    cancelLoading(): void {
        if (this._loadPromise) {
            this._loadPromise.cancel();
            this._loadPromise = null;
        }
    }

    getOptions(): IControllerOptions {
        return this._options;
    }

    destroy(): void {
        this.cancelLoading();
        this._unsubscribeItemsCollectionChangeEvent();
        this._destroyNavigationController();
    }

    private _setRoot(key: TKey): void {
        this._root = key;
    }

    private _getCrudWrapper(sourceOption: ICrud): CrudWrapper {
        if (!this._crudWrapper) {
            this._crudWrapper = new CrudWrapper({source: sourceOption});
        }
        return this._crudWrapper;
    }

    private _getNavigationController(
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): NavigationController {
        if (!this._navigationController) {
            this._navigationController =
                new NavigationController(this._getNavigationControllerOptions(navigation));
        }

        return this._navigationController;
    }

    private _getNavigationControllerOptions(
        navigation: INavigationOptionValue<INavigationSourceConfig>
    ): INavigationControllerOptions {
        return {
            navigationType: navigation.source,
            navigationConfig: navigation.sourceConfig,
            navigationParamsChangedCallback: this._navigationParamsChangedCallback
        };
    }

    private _updateQueryPropertiesByItems(
        list: RecordSet,
        id?: TKey,
        navigationConfig?: IBaseSourceConfig,
        direction?: Direction
    ): void {
        if (this._hasNavigationBySource()) {
            if (this._deepReload || !direction && this._root === id) {
                this._destroyNavigationController();
            }
            this._getNavigationController(this._navigation)
                .updateQueryProperties(list, id, navigationConfig, NAVIGATION_DIRECTION_COMPATIBILITY[direction]);
        }
    }

    private _prepareQueryParams(
        queryParams: IQueryParams,
        key: TKey,
        navigationSourceConfig: INavigationSourceConfig,
        direction: Direction
        ): IQueryParams|IQueryParams[] {
        const navigationController = this._getNavigationController(this._navigation);
        const navigationConfig = navigationSourceConfig || this._navigation.sourceConfig;
        const userQueryParams = {
            filter: queryParams.filter,
            sorting: queryParams.sorting
        };

        if (navigationConfig?.multiNavigation && this._isDeepReload() && this._expandedItems?.length) {
            return navigationController.getQueryParamsForHierarchy(
                userQueryParams,
                navigationSourceConfig,
                false
            );
        } else {
            return navigationController.getQueryParams(
                userQueryParams,
                key,
                navigationSourceConfig,
                NAVIGATION_DIRECTION_COMPATIBILITY[direction]
            );
        }
    }

    private _isDeepReload(): boolean {
        return this._deepReload || this._options.deepReload;
    }

    private _addItems(items: RecordSet, key: TKey, direction: Direction): RecordSet {
        if (this._items && key === this._root) {
            this._items.setMetaData(items.getMetaData());
        }

        if (direction === 'up') {
            this._prependItems(items);
        } else if (direction === 'down' && this._items) {
            this._appendItems(items);
        } else if (!direction && key !== this._root && this._items) {
            this._mergeItems(items);
        } else {
            this._setItems(items);
        }

        return items;
    }

    private _setItems(items: RecordSet): void {
        if (this._items && isEqualItems(this._items, items)) {
            this._items.assign(items);
        } else {
            this._subscribeItemsCollectionChangeEvent(items);
            this._items = items;
        }
    }

    private _appendItems(items: RecordSet): void {
        if (this._shouldAddItems(items)) {
            this._items.append(items);
        }
    }

    private _prependItems(items: RecordSet): void {
        if (this._shouldAddItems(items)) {
            this._items.prepend(items);
        }
    }

    private _mergeItems(items: RecordSet): void {
        this._items.merge(items, { remove: false, inject: true });
    }

    private _shouldAddItems(items: RecordSet): boolean {
        return items.getCount() > 0 || this._items.getCount() === 0;
    }

    private _resolveNavigationParamsChangedCallback(cfg: IControllerOptions): void {
        if (cfg.navigationParamsChangedCallback) {
            this._navigationParamsChangedCallback = cfg.navigationParamsChangedCallback;
        }
    }

    private _load({direction, key, navigationSourceConfig, filter}: ILoadConfig): LoadResult {
        if (this._options.source) {
            const filterPromise = filter && !direction ?
                Promise.resolve(filter) :
                this._prepareFilterForQuery(filter || this._filter, key);
            this.cancelLoading();
            this._loadPromise = new CancelablePromise(
                filterPromise.then((preparedFilter: QueryWhereExpression<unknown>) => {
                    if (this._options.loadTimeout) {
                        return wrapTimeout(
                            this._query(preparedFilter, key, navigationSourceConfig, direction),
                            this._options.loadTimeout
                        ).catch((error) => {
                            return Promise.reject(error instanceof Error ? error : new fetch.Errors.HTTP({
                                httpError: HTTPStatus.GatewayTimeout,
                                message: undefined,
                                url: undefined
                            }));
                        });
                    }
                    return this._query(preparedFilter, key, navigationSourceConfig, direction);
                })
            );

            return this._loadPromise.promise
                .then((result: RecordSet) => this._processQueryResult(result, key, navigationSourceConfig, direction))
                .catch((error) => {
                    if (error && !error.isCanceled && !error.canceled) {
                        this._processQueryError(error);
                    }
                    return Promise.reject(error);
                });
        } else {
            Logger.error('source/Controller: Source option has incorrect type');
            return Promise.reject(new Error('source/Controller: Source option has incorrect type'));
        }
    }

    private _query(
        filter: QueryWhereExpression<unknown>,
        key?: TKey,
        navigationSourceConfig?: INavigationSourceConfig,
        direction?: Direction
    ): Promise<RecordSet> {
        // В source может лежать prefetchProxy
        // При подгрузке вниз/вверх данные необходимо брать не из кэша prefetchProxy
        const source = direction !== undefined ?
            Controller._getSource(this._options.source) :
            this._options.source;
        const crudWrapper = this._getCrudWrapper(source as ICrud);

        let params: IQueryParams | IQueryParams[] = {
            filter,
            sorting: this._options.sorting
        };

        if (this._hasNavigationBySource()) {
            params = this._prepareQueryParams(params, key, navigationSourceConfig, direction);
        }
        return crudWrapper.query(params, this.getKeyProperty());
    }

    private _getFilterHierarchy(
        initialFilter: QueryWhereExpression<unknown>,
        options: IControllerOptions,
        root: TKey = this._root): Promise<QueryWhereExpression<unknown>> {
        const expandedItemsForFilter = this._expandedItems || options.expandedItems;
        const parentProperty = this._parentProperty;
        let resultFilter = initialFilter;

        return new Promise((resolve) => {
            if (parentProperty) {
                resultFilter = {...initialFilter};
                const isDeepReload = this._isDeepReload() && root === this._root;

                if (expandedItemsForFilter?.length && expandedItemsForFilter?.[0] !== null && isDeepReload) {
                    resultFilter[parentProperty] = Array.isArray(resultFilter[parentProperty]) ?
                        resultFilter[parentProperty] :
                        [];
                    resultFilter[parentProperty].push(root);
                    resultFilter[parentProperty] = resultFilter[parentProperty].concat(expandedItemsForFilter);
                } else if (root !== undefined) {
                    resultFilter[parentProperty] = root;
                }

                if (options.selectedKeys && options.selectedKeys.length) {
                    import('Controls/operations').then((operations) => {
                        resultFilter.entries = operations.selectionToRecord({
                            selected: options.selectedKeys,
                            excluded: options.excludedKeys || []
                        }, Controller._getSource(options.source).getAdapter());
                        resolve(resultFilter);
                    });
                } else {
                    resolve(resultFilter);
                }
            } else {
                resolve(resultFilter);
            }
        });
    }

    private _prepareFilterForQuery(
        filter: QueryWhereExpression<unknown>,
        key: TKey
    ): Promise<QueryWhereExpression<unknown>> {
        return this._getFilterForCollapsedGroups(filter, this._options)
            .then((preparedFilter: QueryWhereExpression<unknown>) => {
                return this._getFilterHierarchy(preparedFilter, this._options, key);
            });
    }

    private _processQueryResult(
        result: RecordSet,
        key: TKey,
        navigationSourceConfig: INavigationSourceConfig,
        direction: Direction): LoadPromiseResult {
        // dataLoadCallback не надо вызывать если загружают узел,
        // определяем это по тому, что переданный ключ в метод load не соответствует текущему корню
        const loadedInCurrentRoot = key === this._root;

        let methodResult;
        let dataLoadCallbackResult;

        this._loadPromise = null;
        this._loadError = null;
        this._updateQueryPropertiesByItems(result, key, navigationSourceConfig, direction);

        if (loadedInCurrentRoot && this._dataLoadCallback) {
            dataLoadCallbackResult = this._dataLoadCallback(result, direction);
        }

        if ((loadedInCurrentRoot || direction) && this._dataLoadCallbackFromOptions) {
            this._dataLoadCallbackFromOptions(result, direction);
        }

        this._notify('dataLoadCallback', result);

        if (dataLoadCallbackResult instanceof Promise) {
            methodResult = dataLoadCallbackResult.then(() => {
                return this._addItems(result, key, direction);
            });
        } else {
            methodResult = this._addItems(result, key, direction);
        }

        return methodResult;
    }

    private _processQueryError(
        queryError: Error,
        direction?: Direction
    ): Error {
        // Если упала ошибка при загрузке в каком-то направлении,
        // то контроллер навигации сбрасывать нельзя,
        // Т.к. в этом направлении могут продолжить загрухзку
        if (!direction) {
            this._navigationController = null;
        }
        this._loadPromise = null;
        if (this._options.dataLoadErrback) {
            this._options.dataLoadErrback(queryError);
        }
        this._loadError = queryError;
        // Выводим ошибку в консоль, иначе из-за того, что она произошла в Promise,
        // у которого есть обработка ошибок через catch, никто о ней не узнает
        if (!queryError.processed && !queryError.hasOwnProperty('httpError')) {
            Logger.error('dataSource/Controller load error', this, queryError);
        }
        return queryError;
    }

    private _subscribeItemsCollectionChangeEvent(items: RecordSet): void {
        this._unsubscribeItemsCollectionChangeEvent();
        if (items) {
            items.subscribe('onCollectionChange', this._collectionChange);
        }
    }

    private _unsubscribeItemsCollectionChangeEvent(): void {
        if (this._items) {
            this._items.unsubscribe('onCollectionChange', this._collectionChange);
        }
    }

    private _collectionChange(): void {
        if (this._hasNavigationBySource()) {
            // Навигация при изменении ReocrdSet'a должно обновляться только по записям из корня,
            // поэтому получение элементов с границ recordSet'a
            // нельзя делать обычным получением первого и последнего элемента,
            // надо так же проверять, находится ли элемент в корне
            const firstItem = this._getFirstItemFromRoot();
            const lastItem = this._getLastItemFromRoot();

            if (this._items.getCount() && firstItem && lastItem) {
                this._getNavigationController(this._navigation)
                    .updateQueryRange(
                        this._items,
                        this._root,
                        this._getFirstItemFromRoot(),
                        this._getLastItemFromRoot()
                    );
            }
        }
    }

    private _getFirstItemFromRoot(): Model|void {
        const itemsCount = this._items.getCount();
        let firstItem;
        for (let i = 0; i < itemsCount; i++) {
            firstItem = this._getItemFromRootByIndex(i);
            if (firstItem) {
                break;
            }
        }
        return firstItem;
    }

    private _getLastItemFromRoot(): Model|void {
        const itemsCount = this._items.getCount();
        let lastItem;
        for (let i = itemsCount - 1; i > 0; i--) {
            lastItem = this._getItemFromRootByIndex(i);
            if (lastItem) {
                break;
            }
        }
        return lastItem;
    }

    private _getItemFromRootByIndex(index: number): Model|void {
        let item;
        if (this._options.parentProperty && this._root !== undefined) {
            if (this._items.at(index).get(this._options.parentProperty) === this._root) {
                item = this._items.at(index);
            }
        } else {
            item = this._items.at(index);
        }
        return item;
    }

    private _destroyNavigationController(): void {
        if (this._navigationController) {
            this._navigationController.destroy();
            this._navigationController = null;
        }
    }

    private _hasNavigationBySource(navigation?: INavigationOptionValue<unknown>): boolean {
        const navigationOption = navigation || this._navigation;
        return Boolean(navigationOption && navigationOption.source);
    }

    private _setDataLoadCallbackFromOptions(dataLoadCallback: Function): void {
        this._dataLoadCallbackFromOptions = dataLoadCallback;
    }

    private _getFilterForCollapsedGroups(
        initialFilter: QueryWhereExpression<unknown>,
        options: IControllerOptions
    ): Promise<QueryWhereExpression<unknown>> {
        const hasGrouping = !!options.groupProperty || !!options.groupingKeyCallback;
        const historyId = hasGrouping ? (options.groupHistoryId || options.historyIdCollapsedGroups) : undefined;
        const collapsedGroups = options.collapsedGroups;
        const getFilterWithCollapsedGroups = (collapsedGroupsIds: TArrayGroupId) => {
            let modifiedFilter;

            if (collapsedGroupsIds && collapsedGroupsIds.length) {
                modifiedFilter = { ...initialFilter };
                modifiedFilter.collapsedGroups = collapsedGroupsIds;
            } else {
                modifiedFilter = initialFilter;
            }

            return modifiedFilter;
        };
        let resultFilterPromise;

        if (collapsedGroups && collapsedGroups.length) {
            resultFilterPromise = Promise.resolve(getFilterWithCollapsedGroups(collapsedGroups));
        } else if (historyId) {
            resultFilterPromise = groupUtil.restoreCollapsedGroups(historyId).then(
                (restoredCollapsedGroups?: TArrayGroupId) =>
                    getFilterWithCollapsedGroups(this._collapsedGroups = restoredCollapsedGroups)
            );
        } else {
            resultFilterPromise = Promise.resolve(initialFilter);
        }

        return resultFilterPromise;
    }

    private static _getSource(source: ICrud | ICrudPlus | PrefetchProxy): IData & ICrud {
        let resultSource;

        if (source instanceof PrefetchProxy) {
            resultSource = source.getOriginal();
        } else {
            resultSource = source;
        }

        return resultSource;
    }

}
