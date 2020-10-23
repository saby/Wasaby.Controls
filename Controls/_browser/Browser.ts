import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_browser/resources/BrowserTemplate';
import {SyntheticEvent} from 'Vdom/Vdom';
import {ControllerClass as OperationsController} from 'Controls/operations';
import {
    ControllerClass as SearchController,
    getSwitcherStrFromData,
    ISearchResolverOptions,
    SearchResolver as SearchResolverController
} from 'Controls/search';
import {ControllerClass as FilterController, IFilterItem} from 'Controls/filter';
import {tmplNotify} from 'Controls/eventUtils';
import {RecordSet} from 'Types/collection';
import {ContextOptions} from 'Controls/context';

import {RegisterClass} from 'Controls/event';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
import {
    error as dataSourceError,
    ISourceControllerOptions,
    NewSourceController as SourceController
} from 'Controls/dataSource';
import {IFilterOptions, IHierarchyOptions, ISearchOptions, ISourceOptions, TSelectionType, Direction} from 'Controls/interface';
import Store from 'Controls/Store';
import {SHADOW_VISIBILITY} from 'Controls/scroll';
import {detection} from 'Env/Env';
import {ICrud, ICrudPlus, IData, PrefetchProxy, QueryWhereExpression} from 'Types/source';
import {ISearchControllerOptions} from 'Controls/_search/interface';
import {IHierarchySearchOptions} from 'Controls/interface/IHierarchySearch';
import {IFilterHistoryData} from 'Controls/_filter/ControllerClass';
import {IMarkerListOptions} from 'Controls/_marker/interface';
import {IShadowsOptions} from 'Controls/_scroll/Container/Interface/IShadows';
import {IControllerState} from 'Controls/_dataSource/Controller';

type Key = string|number|null;

export interface IBrowserOptions extends IControlOptions, ISearchOptions, ISourceOptions,
    Required<IFilterOptions>, Required<IHierarchyOptions>, IHierarchySearchOptions,
    IMarkerListOptions, IShadowsOptions {
    searchNavigationMode: string;
    groupHistoryId: string;
    searchValue: string;
    filterButtonSource: IFilterItem[];
    useStore?: boolean;
    dataLoadCallback?: Function;
    dataLoadErrback?: Function;
}

type IReceivedState = {
    items: RecordSet | void | Error;
    filterItems: IFilterItem[] | IFilterHistoryData;
} | Error | void;

interface IDataChildContext {
    dataOptions: IBrowserOptions;
}

type IFilterControllerOptions = Pick<IBrowserOptions,
   'filter' | 'minSearchLength' | 'filterButtonSource' | 'parentProperty' | 'searchParam' | 'searchValue'>;

export default class Browser extends Control<IBrowserOptions, IReceivedState> {
    protected _template: TemplateFunction = template;
    protected _notifyHandler: Function = tmplNotify;

    private _selectedKeysCount: number = null;
    private _selectionType: TSelectionType = 'all';
    private _isAllSelected: boolean = false;

    private _listMarkedKey: Key = null;
    private _notifiedMarkedKey: Key = null;
    private _previousViewMode: string = null;
    private _viewMode: string = null;
    private _misspellValue: string = null;
    private _root: Key = null;
    private _path: RecordSet;
    private _deepReload: boolean = undefined;
    private _inputSearchValue: string = '';
    private _searchValue: string = null;
    private _dataOptionsContext: typeof ContextOptions;

    private _itemsReadyCallback: Function;
    private _loading: boolean = false;
    private _items: RecordSet;
    private _filter: QueryWhereExpression<unknown>;
    private _filterButtonItems: IFilterItem[];
    private _fastFilterItems: IFilterItem[];
    private _groupHistoryId: string;
    private _errorRegister: RegisterClass;
    private _storeCallbacks: string[];

    private _source: ICrudPlus | ICrud & ICrudPlus & IData;
    private _sourceController: SourceController = null;
    private _searchResolverController: SearchResolverController = null;
    private _operationsController: OperationsController = null;
    private _searchController: SearchController = null;
    private _filterController: FilterController = null;

    private _topShadowVisibilityFromOptions: SHADOW_VISIBILITY;
    private _bottomShadowVisibilityFromOptions: SHADOW_VISIBILITY;
    private _topShadowVisibility: SHADOW_VISIBILITY;
    private _bottomShadowVisibility: SHADOW_VISIBILITY;

    protected _beforeMount(options: IBrowserOptions,
                           context?: typeof ContextOptions,
                           receivedState?: IReceivedState): void | Promise<IReceivedState | Error | void> {
        this._itemOpenHandler = this._itemOpenHandler.bind(this);
        this._dataLoadErrback = this._dataLoadErrback.bind(this);
        this._afterSetItemsOnReloadCallback = this._afterSetItemsOnReloadCallback.bind(this);
        this._initShadowVisibility(options);
        this._operationsController = this._createOperationsController(options);
        this._filterController = new FilterController(options as IFilterControllerOptions);

        this._filter = options.filter;
        this._groupHistoryId = options.groupHistoryId;
        this._itemsReadyCallback = this._itemsReadyCallbackHandler.bind(this);
        this._errorRegister = new RegisterClass({register: 'dataError'});

        if (receivedState && options.source instanceof PrefetchProxy) {
            this._source = options.source.getOriginal();
        } else {
            this._source = options.source;
        }
        if (options.useStore) {
            this._searchValue = Store.getState().searchValue as unknown as string;
        }

        const controllerState = this._getSourceController(options).getState();
        this._dataOptionsContext = this._createContext(controllerState);

        if (receivedState) {
            if ('filterItems' in receivedState && 'items' in receivedState) {
                this._setFilterItems(receivedState.filterItems as IFilterItem[]);
                this._defineShadowVisibility(receivedState.items);
                if (isNewEnvironment()) {
                    this._setItemsAndUpdateContext(receivedState.items as RecordSet, options);
                }
            }
        } else {
            return this._filterController.loadFilterItemsFromHistory().then((filterItems) => {
                this._setFilterItems(filterItems as IFilterItem[]);

                return this._loadItems(options, controllerState).then((items) => {
                    this._defineShadowVisibility(items);
                    return {
                        filterItems,
                        items
                    };
                }, (error) => {
                    this._onDataError(
                       null,
                       {
                           error,
                           mode: dataSourceError.Mode.include
                       }
                    );

                    return error;
                });
            });
        }
    }

    private _getSourceController(options?: IBrowserOptions): SourceController {
        if (!this._sourceController) {
            this._sourceController = new SourceController(options ?? this._options);
        }

        return this._sourceController;
    }

    protected _afterMount(options: IBrowserOptions): void {
        if (options.useStore) {
            const sourceCallbackId = Store.onPropertyChanged('filterSource', (filterSource: IFilterItem[]) => {
                this._filterItemsChanged(null, filterSource);
            });
            const filterSourceCallbackId = Store.onPropertyChanged('filter',
               (filter: QueryWhereExpression<unknown>) => this._filterChanged(null, filter));
            const searchValueCallbackId = Store.onPropertyChanged('searchValue',
               (searchValue: string) => this._resolveSearch(searchValue, options));

            this._storeCallbacks = [
                sourceCallbackId,
                filterSourceCallbackId,
                searchValueCallbackId
            ];
        }
    }

    protected _beforeUpdate(newOptions: IBrowserOptions, context: typeof ContextOptions): void | Promise<RecordSet> {
        let methodResult;

        this._operationsController.update(newOptions);
        if (newOptions.hasOwnProperty('markedKey') && newOptions.markedKey !== undefined) {
            this._listMarkedKey = this._getOperationsController().setListMarkedKey(newOptions.markedKey);
        }

        // @ts-ignore
        const isFilterOptionsChanged = this._filterController.update({
            ...newOptions,
            searchValue: this._searchValue
        });

        if (isFilterOptionsChanged) {
            this._updateFilterAndFilterItems();
        }

        const sourceChanged = this._options.source !== newOptions.source;
        if (sourceChanged) {
            this._source = newOptions.source;
        }

        if (this._options.searchDelay !== newOptions.searchDelay && this._searchResolverController) {
            this._searchResolverController.updateOptions(
               this._getSearchResolverOptions(newOptions)
            );
        }

        const sourceController = this._getSourceController(newOptions);

        const isChanged = sourceController.updateOptions(this._getSourceControllerOptions(newOptions));

        if (sourceChanged) {
            this._loading = true;
            methodResult = sourceController.reload()
               .then((items) => {
                   // для того чтобы мог посчитаться новый prefetch Source внутри
                   if (items instanceof RecordSet) {
                       if (newOptions.dataLoadCallback instanceof Function) {
                           newOptions.dataLoadCallback(items);
                       }
                       this._items = sourceController.setItems(items);
                   }

                   this._afterSourceLoad(sourceController, newOptions);

                   this._loading = false;
                   return items;
               })
               .catch((error) => error);
        } else if (isChanged) {
            this._afterSourceLoad(sourceController, newOptions);
        }

        this._getSearchController().then((searchController) => {
            searchController.update(
               this._getSearchControllerOptions(newOptions)
            );
        });

        return methodResult;
    }

    private _afterSourceLoad(sourceController: SourceController, options: IBrowserOptions): void {
        const controllerState = sourceController.getState();

        // TODO filter надо распространять либо только по контексту, либо только по опциям. Щас ждут и так и так
        this._filter = controllerState.filter;
        this._updateContext(controllerState);
        this._groupHistoryId = options.groupHistoryId;
    }

    protected _beforeUnmount(): void {
        if (this._searchResolverController) {
            this._searchResolverController.clearTimer();
        }
        if (this._operationsController) {
            this._operationsController.destroy();
            this._operationsController = null;
        }

        if (this._searchController) {
            this._searchController.reset();
            this._searchController = null;
        }

        if (this._errorRegister) {
            this._errorRegister.destroy();
            this._errorRegister = null;
        }

        if (this._storeCallbacks) {
            this._storeCallbacks.forEach((id) => Store.unsubscribe(id));
        }

        if (this._sourceController) {
            this._sourceController.destroy();
            this._sourceController = null;
        }

        this._filterController = null;
    }

    private _setFilterItems(filterItems: IFilterItem[]): void {
        this._filterController.setFilterItems(filterItems);
        this._updateFilterAndFilterItems();
    }

    private _loadItems(options: IBrowserOptions, controllerState: IControllerState): Promise<void | RecordSet | Error> {
        return new Promise((resolve) => {
            if (options.source) {
                this._getSourceController(options).load().then((items) => {
                    if (items instanceof RecordSet) {
                        this._setItemsAndUpdateContext(items, options);
                    }
                    resolve(items);
                });
            } else {
                this._updateContext(controllerState);
                resolve();
            }
        });
    }

    private _setItemsAndUpdateContext(items: RecordSet, options: IBrowserOptions): void {
        const sourceController = this._getSourceController(options);

        // TODO items надо распространять либо только по контексту, либо только по опциям. Щас ждут и так и так
        this._items = sourceController.setItems(items);
        const controllerState = sourceController.getState();
        this._updateContext(controllerState);
    }

    private _getSearchController(options?: IBrowserOptions): Promise<SearchController> {
        return import('Controls/search').then((result) => {
            this._searchController = new result.ControllerClass({
                ...(options ?? this._options),
                sourceController: this._getSourceController(options ?? this._options)
            });
            this._inputSearchValue = this._searchValue;

            return this._searchController;
        });
    }

    protected _itemsReadyCallbackHandler(items: RecordSet): void {
        if (this._items !== items) {
            const sourceController = this._getSourceController();

            this._items = sourceController.setItems(items);
            this._dataOptionsContext.items = this._items;
            this._dataOptionsContext.updateConsumers();
        }
    }

    protected _handleItemOpen(root: Key, items: RecordSet, dataRoot: Key = null): void {
        this._getSearchController().then((searchController) => {
            if (this._isSearchViewMode() && this._options.searchNavigationMode === 'expand') {
                this._notifiedMarkedKey = root;

                const expandedItems = Browser._prepareExpandedItems(
                   searchController.getRoot(),
                   root,
                   items,
                   this._options.parentProperty);

                this._notify('expandedItemsChanged', [expandedItems]);

                if (!this._deepReload) {
                    this._deepReload = true;
                }
            } else {
                searchController.setRoot(root);
            }
            if (root !== dataRoot) {
                searchController.reset().then(() => {
                    this._inputSearchValue = '';
                });
            }
        });
    }

    private _isSearchViewMode(): boolean {
        return this._viewMode === 'search';
    }

    protected _filterChanged(event: SyntheticEvent, filter: object): void {
        if (event) {
            event.stopPropagation();
        }
        this._filterController.setFilter(filter);

        this._getSourceController().setFilter(this._filterController.getFilter() as QueryWhereExpression<unknown>);

        const controllerState = this._sourceController.getState();

        this._filter = controllerState.filter;
        this._updateContext(controllerState);
        this._dataOptionsContext.updateConsumers();

        this._notify('filterChanged', [this._filter]);
    }

    protected _rootChanged(event: SyntheticEvent, root: Key): void {
        this._notify('rootChanged', [root]);
    }

    protected _itemsChanged(event: SyntheticEvent, items: RecordSet): void {
        const sourceController = this._getSourceController(this._options);

        // для того чтобы мог посчитаться новый prefetch Source внутри
        const newItems = sourceController.setItems(items);
        const controllerState = sourceController.getState();

        if (!this._items) {
            this._items = newItems;
        } else {
            controllerState.items = this._items;
            sourceController.setItems(this._items);
        }

        this._updateContext(controllerState);
    }

    protected _filterItemsChanged(event: SyntheticEvent, items: IFilterItem[]): void {
        this._filterController.updateFilterItems(items);
        this._updateFilterAndFilterItems();
        this._dataOptionsContext.filter = this._filter;
        this._notify('filterChanged', [this._filter]);
    }

    protected _getChildContext(): IDataChildContext {
        return {
            dataOptions: this._dataOptionsContext
        };
    }

    private _createContext(options?: IControllerState): typeof ContextOptions {
        return new ContextOptions(options);
    }

    private _updateContext(sourceControllerState: IControllerState): void {
        const curContext = this._dataOptionsContext;

        for (const i in sourceControllerState) {
            if (sourceControllerState.hasOwnProperty(i)) {
                curContext[i] = sourceControllerState[i];
            }
        }
        curContext.updateConsumers();
    }

    protected _filterHistoryApply(event: SyntheticEvent, history: IFilterItem[]): void {
        // Здесь ничего не обновляем, после стреляет filterItemsChanged
        this._filterController.updateHistory(history);
    }

    private _updateFilterAndFilterItems(): void {
        this._filter = this._filterController.getFilter() as QueryWhereExpression<unknown>;
        this._filterButtonItems = this._filterController.getFilterButtonItems();
        this._fastFilterItems = this._filterController.getFastFilterItems();
        this._sourceController.setFilter(this._filter);
    }

    protected _onDataError(event: SyntheticEvent, errbackConfig: dataSourceError.ViewConfig): void {
        this._errorRegister.start(errbackConfig);
    }

    protected _registerHandler(event: Event, registerType: string,
                               component: any, callback: Function, config: object): void {
        this._errorRegister.register(event, registerType, component, callback, config);
        this._getOperationsController().registerHandler(event, registerType, component, callback, config);
    }

    protected _unregisterHandler(event: Event, registerType: string, component: any, config: object): void {
        this._errorRegister.unregister(event, component, config);
        this._getOperationsController().unregisterHandler(event, registerType, component, config);
    }

    protected _selectedTypeChangedHandler(event: SyntheticEvent<null>, typeName: string, limit?: number): void {
        this._getOperationsController().selectionTypeChanged(typeName, limit);
    }

    protected _selectedKeysCountChanged(e: SyntheticEvent, count: number|null, isAllSelected: boolean): void {
        e.stopPropagation();
        this._selectedKeysCount = count;
        this._isAllSelected = isAllSelected;
    }

    protected _listSelectionTypeForAllSelectedChanged(event: SyntheticEvent, selectionType: TSelectionType): void {
        event.stopPropagation();
        this._selectionType = selectionType;
    }

    protected _itemOpenHandler(newCurrentRoot: Key, items: RecordSet, dataRoot: Key = null): void {
        this._getOperationsController().itemOpenHandler(newCurrentRoot, items, dataRoot);
        this._handleItemOpen(newCurrentRoot, items, dataRoot);
    }

    protected _listMarkedKeyChangedHandler(event: SyntheticEvent<null>, markedKey: Key): unknown {
        this._listMarkedKey = this._getOperationsController().setListMarkedKey(markedKey);
        return this._notify('markedKeyChanged', [markedKey]);
    }

    protected _markedKeyChangedHandler(event: SyntheticEvent<null>): void {
        event.stopPropagation();
    }

    protected _operationsPanelOpen(): void {
        this._listMarkedKey = this._getOperationsController().setOperationsPanelVisible(true);
    }

    protected _operationsPanelClose(): void {
        this._getOperationsController().setOperationsPanelVisible(false);
    }

    protected _onScrollToFirstItemForTopPadding(): void {
        // Возвращаем в опции значение видимости теней, которое передали прикладники
        if (this._topShadowVisibility !== this._topShadowVisibilityFromOptions) {
            this._topShadowVisibility = this._topShadowVisibilityFromOptions;
        }
        if (this._bottomShadowVisibility !== this._bottomShadowVisibilityFromOptions) {
            this._bottomShadowVisibility = this._bottomShadowVisibilityFromOptions;
        }
    }

    private _createOperationsController(options: IBrowserOptions): OperationsController {
        const controllerOptions = {
            ...options,
            ...{
                selectionViewModeChangedCallback: (type) => {
                    this._notify('selectionViewModeChanged', [type]);
                }
            }
        };
        return new OperationsController(controllerOptions);
    }

    private _getOperationsController(): OperationsController {
        if (!this._operationsController) {
            this._operationsController = this._createOperationsController(this._options);
        }

        return this._operationsController;
    }

    private _defineShadowVisibility(items: RecordSet|Error|void): void {
        if (detection.isMobilePlatform) {
            // На мобильных устройствах тень верхняя показывается, т.к. там есть уже загруженные данные вверху
            return;
        }

        if (items instanceof RecordSet) {
            const more = items.getMetaData().more;
            if (more) {
                if (more.before) {
                    this._topShadowVisibility = SHADOW_VISIBILITY.VISIBLE;
                }

                if (more.after) {
                    this._bottomShadowVisibility = SHADOW_VISIBILITY.VISIBLE;
                }
            }

        }
    }

    private _initShadowVisibility(options: IBrowserOptions): void {
        this._topShadowVisibility = this._topShadowVisibilityFromOptions = options.topShadowVisibility;
        this._bottomShadowVisibility = this._bottomShadowVisibilityFromOptions = options.bottomShadowVisibility;
    }

    private _getSearchControllerOptions(options: IBrowserOptions): ISearchControllerOptions {
        return {
            ...options, ...{sourceController: this._getSourceController(options)}
        };
    }

    private _getSourceControllerOptions(options: ISourceControllerOptions): ISourceControllerOptions {
        return {...options, filter: this._filter, source: this._source};
    }

    private _startSearch(value: string): Promise<RecordSet | void> {
        if (this._viewMode !== 'search') {
            return this._getSearchController().then((searchController) => {
               return searchController.search(value).then((result) => {
                   if (result instanceof RecordSet) {
                       this._afterSearch(result);
                   } else {
                       this._handleError(result);
                   }
               });
            });
        }
    }

    protected _search(event: SyntheticEvent, value: string): void {
        this._resolveSearch(value);
    }

    private _getSearchResolverOptions(options: IBrowserOptions): ISearchResolverOptions {
        return {
            delayTime: options.searchDelay,
            minSearchLength: options.minSearchLength,
            searchCallback: (validatedValue: string) => {
                this._startSearch(validatedValue);
            },
            searchResetCallback: undefined
        };
    }

    protected _resolveSearch(value: string, options?: IBrowserOptions): Promise<void> {
        if (!this._searchResolverController) {
            return import('Controls/search').then((result) => {
                this._searchResolverController = new result.SearchResolver(
                   this._getSearchResolverOptions(options ?? this._options)
                );
                return this._searchResolverController.resolve(value);
            });
        }
        this._searchResolverController.resolve(value);
    }

    private _afterSearch(recordSet: RecordSet): void {
        this._updateParams();

        if (this._options.dataLoadCallback instanceof Function) {
            this._options.dataLoadCallback(recordSet);
        }
        this._processResultData(recordSet);

        this._itemsChanged(null, recordSet);

        const switchedStr = getSwitcherStrFromData(recordSet);
        this._misspellValue = switchedStr;
        if (Browser._needChangeSearchValueToSwitchedString(recordSet)) {
            this._searchValue = switchedStr;
        }
    }

    private _updateParams(): void {
        if (this._viewMode !== 'search') {
            this._updateViewMode('search');

            if (this._options.parentProperty) {
                this._updateRootAfterSearch();
            }
        }
        this._loading = false;
        this._searchValue = this._getSourceController().getFilter()[this._options.searchParam];
    }

    private _updateRootAfterSearch(): void {
        if (this._options.startingWith === 'root') {
            const newRoot = Browser._getRoot(this._path, this._root, this._options.parentProperty);

            this._getSearchController().then((searchController) => {
                this._root = newRoot;
                searchController.setRoot(newRoot);
            });
        }
    }

    private _updateViewMode(newViewMode: string): void {
        this._previousViewMode = this._viewMode;
        this._viewMode = newViewMode;
    }

    private _handleDataLoad(data: RecordSet): void {
        if (this._deepReload) {
            this._deepReload = undefined;
        }

        this._path = data.getMetaData().path;

        if (this._isSearchViewMode() && !this._searchValue) {
            this._updateViewMode(this._previousViewMode);
            this._previousViewMode = null;
            this._misspellValue = '';
        }
    }

    _processResultData(data: RecordSet, direction: Direction): void {
        this._filterController.handleDataLoad(data);
        this._handleDataLoad(data);

        if (this._options.dataLoadCallback) {
            this._options.dataLoadCallback(data, direction);
        }
    }

    _dataLoadErrback(error: Error): void {
        this._filterController.handleDataError();

        this._handleError(error);
    }

    protected _handleError(error: Error | object): void {
        if (error instanceof Error) {
            if (this._options.dataLoadErrback) {
                this._options.dataLoadErrback(Error);
            }
        } else {
            this._notify('dataError', [error]);
            this._errorRegister.start(error);
        }
    }

    _afterSetItemsOnReloadCallback(): void {
        if (this._notifiedMarkedKey !== undefined) {
            this._notify('markedKeyChanged', [this._notifiedMarkedKey]);
            this._notifiedMarkedKey = undefined;
        }
    }

    _misspellCaptionClick(): void {
        this._resolveSearch(this._misspellValue).then(() => {
            this._misspellValue = '';
        });
    }

    resetPrefetch(): void {
        this._filterController.resetPrefetch();
        this._filter = this._filterController.getFilter() as QueryWhereExpression<unknown>;
        this._notify('filterChanged', [this._filter]);
    }

    private static _needChangeSearchValueToSwitchedString(recordSet: RecordSet): boolean {
        const metaData = recordSet && recordSet.getMetaData();
        return metaData ? metaData.returnSwitched : false;
    }

    static _getRoot(path: RecordSet, currentRoot: Key, parentProperty: string): Key {
        let root;

        if (path && path.getCount() > 0) {
            root = path.at(0).get(parentProperty);
        } else {
            root = currentRoot;
        }

        return root;
    }

    static _prepareExpandedItems(
       searchRoot: Key,
       expandedItemKey: Key,
       items: RecordSet,
       parentProperty: string
    ): Key[] {
        const expandedItems = [];
        let item;
        let nextItemKey = expandedItemKey;
        do {
            item = items.getRecordById(nextItemKey);
            nextItemKey = item.get(parentProperty);
            expandedItems.unshift(item.getId());
        } while (nextItemKey !== searchRoot);

        return expandedItems;
    }

    static contextTypes(): object {
        return {
            dataOptions: ContextOptions
        };
    }

    static getDefaultOptions(): object {
        return {
            minSearchLength: 3,
            searchDelay: 500,
            startingWith: 'root'
        };
    }
}
