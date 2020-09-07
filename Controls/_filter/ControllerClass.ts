import {factory} from 'Types/chain';
import clone = require('Core/core-clone');

import Prefetch from 'Controls/_filter/Prefetch';
import {IPrefetchHistoryParams} from './IPrefetch';
import {default as Store} from 'Controls/Store';
import isEqualItems from 'Controls/_filter/Utils/isEqualItems';
import mergeSource from 'Controls/_filter/Utils/mergeSource';

interface IFilterControllerClass {
    prefetchParams?: IPrefetchHistoryParams;
    filter: object;
    useStore?: boolean;
    filterButtonItems: any[];
    fastFilterItems: any[];
}

export default class FilterControllerClass {
    private _options: IFilterControllerClass = null;
    private _filterButtonItems = null;
    private _fastFilterItems = null;

    constructor(options: IFilterControllerClass, receivedState) {
        this._options = options;
        let filter = options.filter;

        if (options.prefetchParams) {
            filter = Prefetch.prepareFilter(filter, options.prefetchParams);
        }

        if (options.useStore) {
            this._observeStore(options);
        }

        if (receivedState) {
            if (options.useStore) {
                const state = Store.getState();
                this._setFilterItems(state.filterSource, [], receivedState);
                this._itemsReady(filter, receivedState);
            } else {
                this._setFilterItems(this, options.filterButtonSource, options.fastFilterSource, receivedState);
                this._itemsReady(this, filter, receivedState);
            }

            if (options.prefetchParams) {
                this._isFilterChanged = true;
            }
        } else if (options.useStore) {
            const state = Store.getState();
            // fixme: уберется по https://online.sbis.ru/opendoc.html?guid=8dd6dd08-820f-4298-b743-aff4ff4663e6
            const loadedSources = state && state.loadedSources && state.loadedSources[0];
            if (loadedSources) {
                return _private.resolveItems(this, loadedSources.historyId, loadedSources.filterButtonSource, loadedSources.fastFilterSource, loadedSources.historyItems).then((history) => {
                    _private.itemsReady(this, loadedSources.filter, history);
                    if (loadedSources.historyItems && loadedSources.historyItems.length && loadedSources.historyId && loadedSources.prefetchParams) {
                        _private.processHistoryOnItemsChanged(this, loadedSources.historyItems, loadedSources);
                    }
                    return history;
                });
            } else {
                return _private.resolveItems(this, state.historyId, state.filterSource, [], options.historyItems).then((history) => {
                    _private.itemsReady(this, state.filter, history);
                    return history;
                });
            }
        } else {
            return _private.resolveItems(this, options.historyId, options.filterButtonSource, options.fastFilterSource, options.historyItems).addCallback((history) => {
                _private.itemsReady(this, filter, history);
                if (options.historyItems && options.historyItems.length && options.historyId && options.prefetchParams) {
                    _private.processHistoryOnItemsChanged(this, options.historyItems, options);
                }
                return history;
            });
        }
    }

    private _setFilterItems(filterButtonOption, fastFilterOption, history) {
        let historyItems;

        if (history) {
            historyItems = history.items || history;
        }

        this._filterButtonItems = FilterControllerClass._getItemsByOption(filterButtonOption, historyItems);
        this._fastFilterItems = FilterControllerClass._getItemsByOption(fastFilterOption, historyItems);
    }

    private _itemsReady(filter, history?): void {
        let resultFilter = filter;

        if (history) {
            resultFilter = Prefetch.applyPrefetchFromHistory(resultFilter, history);
        }

        this._resolveFilterButtonItems(this._filterButtonItems, this._fastFilterItems);
        _private.applyItemsToFilter(this, resultFilter, this._filterButtonItems, this._fastFilterItems);
    }

    private _resolveFilterButtonItems(filterButtonItems, fastFilterItems) {
        if (filterButtonItems && fastFilterItems) {
            this._setFilterButtonItems(filterButtonItems, fastFilterItems);
        }
    }

    private _setFilterButtonItems(filterButtonItems, fastFilterItems) {
        function prepareFastFilterItem(index) {
            // Fast filters could not be reset from the filter button. We set flag for filters duplicated in the fast filter.
            filterButtonItems[index].isFast = true;
        }
        this._equalItemsIterator(filterButtonItems, fastFilterItems, prepareFastFilterItem);
    }

    private static _getItemsByOption(option, history) {
        let result;

        if (option) {
            if (typeof option === 'function') {
                result = option(history);
            } else if (history) {
                result = mergeSource(FilterControllerClass._cloneItems(option), history);
            } else {
                result = FilterControllerClass._cloneItems(option);
            }
        }

        return result;
    }

    private _equalItemsIterator(filterButtonItems, fastFilterItems, prepareCallback) {
        factory(filterButtonItems).each(function(buttonItem, index) {
            factory(fastFilterItems).each(function(fastItem) {
                if (isEqualItems(buttonItem, fastItem)
                    && fastItem.hasOwnProperty('textValue') && buttonItem.hasOwnProperty('textValue')) {
                    prepareCallback(index, fastItem);
                }
            });
        });
    }

    private static _cloneItems(items) {
        if (items['[Types/_entity/CloneableMixin]']) {
            return items.clone();
        }
        return clone(items);
    }
}
