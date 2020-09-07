import Control = require('Core/Control');
import template = require('wml!Controls/_filter/Controller');
import Deferred = require('Core/Deferred');
import chain = require('Types/chain');
import Utils = require('Types/util');
import historyUtils = require('Controls/_filter/HistoryUtils');
import merge = require('Core/core-merge');
import clone = require('Core/core-clone');
import isEmpty = require('Core/helpers/Object/isEmpty');
import {isEqual} from 'Types/object';
import {CrudWrapper} from 'Controls/dataSource';
import {RecordSet} from 'Types/Collection';
import Prefetch from 'Controls/_filter/Prefetch';
import {IPrefetchHistoryParams} from './IPrefetch';
import mergeSource from 'Controls/_filter/Utils/mergeSource';
import {Model} from 'Types/entity';
import {default as Store} from 'Controls/Store';

export interface IFilterHistoryData {
   items: object[];
   prefetchParams?: IPrefetchHistoryParams;
}

const getPropValue = Utils.object.getPropertyValue.bind(Utils);
const setPropValue = Utils.object.setPropertyValue.bind(Utils);
const ACTIVE_HISTORY_FILTER_INDEX = 0;

const _private = {


         prepareHistoryItems: function(filterButtonItems, fastFilterItems) {
            var historyItems = [];
            function setTextValue(index, item) {
               setPropValue(historyItems[index], 'textValue', getPropValue(item, 'textValue'));
            }
            if (filterButtonItems && fastFilterItems) {
               historyItems = _private.cloneItems(filterButtonItems);

               _private.equalItemsIterator(filterButtonItems, fastFilterItems, setTextValue);
            } else {
               historyItems = _private.cloneItems(filterButtonItems || fastFilterItems);
            }

            historyItems = historyItems.filter(item => {
               return !item.doNotSaveToHistory;
            });

            return _private.minimizeFilterItems(historyItems);
         },

         minimizeItem: function(item) {
            const textValue = getPropValue(item, 'textValue');
            // Two case of saving filter in history
            // 1 case - need to hide textValue in line near button, but save value in history
            // 2 case - need to hide textValue in line near button and not save value in history
            // if textValue is empty string (''), save filter in history
            // if textValue is null, do not save
            const isNeedSaveHistory = textValue !== undefined && textValue !== null;
            const visibility = !isNeedSaveHistory && getPropValue(item, 'visibility') ? false : getPropValue(item, 'visibility');
            const minimizedItem = {};
            const value = getPropValue(item, 'value');
            const isNeedSaveValue = getPropValue(item, 'resetValue') !== undefined ?
                value !== undefined && isNeedSaveHistory :
                true;

            if (visibility !== undefined) {
                minimizedItem.visibility = visibility;
            }

            if (isNeedSaveValue) {
                minimizedItem.value = getPropValue(item, 'value');
            }

            if (visibility !== false && textValue !== getPropValue(item, 'resetTextValue')) {
                if (isEqual(value, getPropValue(item, 'resetValue'))) {
                    minimizedItem.textValue = '';
                } else {
                    minimizedItem.textValue = getPropValue(item, 'textValue');
                }
            }

            if (getPropValue(item, 'id')) {
                minimizedItem.id = getPropValue(item, 'id');
            } else {
                minimizedItem.name = getPropValue(item, 'name');
                minimizedItem.viewMode = getPropValue(item, 'viewMode');
            }
            return minimizedItem;
         },

         minimizeFilterItems: function(items) {
            var minItems = [];
            chain.factory(items).each(function(item) {
               minItems.push(_private.minimizeItem(item));
            });
            return minItems;
         },

         getHistoryItems: function(self, id) {
            let result, recent, lastFilter;

            if (!id) {
               result =  Deferred.success([]);
            }

            if (id) {
               let source = historyUtils.getHistorySource({historyId: id});

               if (!self._crudWrapper) {
                  self._crudWrapper = new CrudWrapper({
                     source
                  });
               }

               result = new Deferred();

               self._crudWrapper.query({filter: { $_history: true }})
                  .then((res) => {
                     let historyResult;
                     recent = source.getRecent();

                     if (recent.getCount()) {
                        lastFilter = recent.at(ACTIVE_HISTORY_FILTER_INDEX);
                        historyResult = source.getDataObject(lastFilter) || [];
                     } else {
                        historyResult = [];
                     }
                     result.callback(historyResult);
                     return res;
                  })
                  .catch((error) => {
                     error.processed = true;
                     result.callback([]);
                     return error;
                  });
            }

            return result;
         },
         addToHistory(self, filterButtonItems, fastFilterItems, historyId: string, prefetchParams?: IPrefetchHistoryParams): Promise<any> {
             const meta = self._updateMeta || { $_addFromData: true };

             function update() {
                 let historyData;
                 if (self._updateMeta) {
                     historyData = self._updateMeta.item;
                 } else {
                     historyData = _private.getHistoryData(filterButtonItems, fastFilterItems, prefetchParams);
                     // self - пустой объект, если вызывается метод updateFilterHistory c прототипа
                     self._notify?.call(self, 'historySave', [historyData, filterButtonItems]);
                 }

                 return historyUtils.getHistorySource({historyId}).update(historyData, meta);
             }

             if (!historyUtils.getHistorySource({historyId}).historyReady()) {
               // Getting history before updating if it hasn’t already done
               return _private.getHistoryItems(self, historyId).addCallback(function() {
                  return update();
               });
            } else {
               return update();
            }
         },

         getHistoryByItems(self, historyId: string, items: any[]): object|void {
             const historySource = historyUtils.getHistorySource({historyId});
             const historyItems = historySource.getItems();

             let result;
             let historyData;
             let minimizedItemFromHistory;
             let minimizedItemFromOption;

             const findItemInHistory = (hItems) => {
                 self._updateMeta = null;
                 if (hItems && hItems.getCount()) {
                     hItems.each((item, index) => {
                         if (!result) {
                             historyData = historySource.getDataObject(item);

                             if (historyData) {
                                 const itemsToSave = items.filter((item) => !item.doNotSaveToHistory);
                                 minimizedItemFromOption = _private.minimizeFilterItems(itemsToSave);
                                 minimizedItemFromHistory = _private.minimizeFilterItems(historyData.items || historyData);
                                 if (isEqual(minimizedItemFromOption, minimizedItemFromHistory)) {
                                     result = {
                                         item,
                                         data: historyData,
                                         index
                                     };
                                 }
                             }
                         }
                     });
                 }
             };

             findItemInHistory(historyItems);

             // Метод используется для поиска элемента для удаления и последующего сохранения нового элемента с новыми данными
             // Если элемент запинен или добавлен в избранное, его нельзя удалять.
             if (result) {
                 const isPinned = result.item.get('pinned');
                 const isFavorite = result.item.get('client');
                 if (isFavorite || isPinned) {
                     self._updateMeta = {
                         item: result.item,
                         isClient: result.data.isClient
                     };
                     if (isPinned) {
                         self._updateMeta.$_pinned = true;
                     } else {
                         self._updateMeta.$_favorite = true;
                     }
                     result = null;
                 }
             }
             return result;
         },

        deleteFromHistory(item: Model, historyId: string): Promise {
            return historyUtils.getHistorySource({historyId}).destroy(item.getId(), {$_history: true});
        },

        deleteCurrentFilterFromHistory(self): void {
            const history = _private.getHistoryByItems(self, self._options.historyId, self._filterButtonItems);

            if (history) {
                _private.deleteFromHistory(history.item, self._options.historyId);
            }
        },

        processPrefetchOnItemsChanged(self, options, items): void {
            // Меняют фильтр с помощью кнопки фильтров,
            // но такой фильтр уже может быть сохранён в истории и по нему могут быть закэшированные данные,
            // поэтому ищем в истории такой фильтр, если есть, смотрим валидны ли ещё закэшированные данные,
            // если валидны, то просто добавляем идентификатор сессии в фильтр,
            // если данные не валидны, то такую запись из истории надо удалить
            const history = _private.getHistoryByItems(self, options.historyId, items || self._filterButtonItems);
            let filter = self._filter;
            let needDeleteFromHistory = false;
            let needApplyPrefetch = false;

            if (history) {
                const prefetchParams = Prefetch.getPrefetchFromHistory(history.data);
                const needInvalidate = prefetchParams && Prefetch.needInvalidatePrefetch(history.data);

                if (needInvalidate) {
                    needDeleteFromHistory = true;
                }

                if (prefetchParams && !needInvalidate) {
                    needApplyPrefetch = true;
                }
            }

            if (needApplyPrefetch) {
                filter = Prefetch.applyPrefetchFromHistory(self._filter, history.data);

                if (!isEqual(filter, self._filter)) {
                    needDeleteFromHistory = true;
                }
            } else {
                filter = Prefetch.clearPrefetchSession(self._filter);
            }

            if (needDeleteFromHistory) {
                _private.deleteFromHistory(history.item, options.historyId);
            }

            return self._filter = filter;
        },

        processHistoryOnItemsChanged(self, items, options): void {
            if (options.prefetchParams) {
                _private.processPrefetchOnItemsChanged(self, options, items);
                self._isFilterChanged = true;
            } else if (options.historyId) {
                _private.addToHistory(self, self._filterButtonItems, self._fastFilterItems, options.historyId);
            }
        },

         itemsIterator(filterButtonItems, fastDataItems, differentCallback, equalCallback) {
            function processItems(items) {
               chain.factory(items).each(function(elem) {
                  const value = getPropValue(elem, 'value');
                  const visibility = getPropValue(elem, 'visibility');
                  const viewMode = getPropValue(elem, 'viewMode');

                  if (value !== undefined && ((visibility === undefined || visibility === true) || viewMode === 'frequent')) {
                     if (differentCallback) {
                        differentCallback(elem);
                     }
                  } else if (equalCallback) {
                     equalCallback(elem);
                  }
               });
            }

            if (filterButtonItems) {
               processItems(filterButtonItems);
            }

            if (fastDataItems) {
               processItems(fastDataItems);
            }
         },

         getFilterByItems(filterButtonItems, fastFilterItems) {
            const filter = {};

            function processItems(elem) {
               filter[getPropValue(elem, 'id') ? getPropValue(elem, 'id') : getPropValue(elem, 'name')] = getPropValue(elem, 'value');
            }

            _private.itemsIterator(filterButtonItems, fastFilterItems, processItems);

            return filter;
         },

         isFilterChanged(filterButtonItems, fastFilterItems) {
            const filter = {};

            function processItems(elem) {
               // The filter can be changed by another control, in which case the value is set to the filter button, but textValue is not set.
               if (!isEqual(getPropValue(elem, 'value'), getPropValue(elem, 'resetValue')) &&
                   getPropValue(elem, 'textValue') !== undefined && getPropValue(elem, 'textValue') !== null) {
                  filter[getPropValue(elem, 'id') ? getPropValue(elem, 'id') : getPropValue(elem, 'name')] = getPropValue(elem, 'value');
               }
            }

            _private.itemsIterator(filterButtonItems, fastFilterItems, processItems);

            return !isEmpty(filter);
         },

         getEmptyFilterKeys(filterButtonItems, fastFilterItems) {
            const removedKeys = [];

            function processItems(elem) {
               removedKeys.push(getPropValue(elem, 'id') ? getPropValue(elem, 'id') : getPropValue(elem, 'name'));
            }

            _private.itemsIterator(filterButtonItems, fastFilterItems, null, processItems);

            return removedKeys;
         },





         updateFilterItems(self, newItems) {
            if (self._filterButtonItems) {
               self._filterButtonItems = _private.cloneItems(self._filterButtonItems);
               mergeSource(self._filterButtonItems, newItems);
            }

            if (self._fastFilterItems) {
               self._fastFilterItems = _private.cloneItems(self._fastFilterItems);
               mergeSource(self._fastFilterItems, newItems);
            }

            _private.resolveFilterButtonItems(self._filterButtonItems, self._fastFilterItems);
         },

         resolveItems(self, historyId, filterButtonItems, fastFilterItems, historyItems) {
            const historyItemsDef = historyItems ? Deferred.success(historyItems) : _private.getHistoryItems(self, historyId);

            return historyItemsDef.addCallback(function(historyItems) {
               _private.setFilterItems(self, filterButtonItems, fastFilterItems, historyItems);
               return historyItems;
            });
         },

         calculateFilterByItems(filter, filterButtonItems, fastFilterItems) {
            const filterClone = clone(filter || {});
            const itemsFilter = _private.getFilterByItems(filterButtonItems, fastFilterItems);
            const emptyFilterKeys = _private.getEmptyFilterKeys(filterButtonItems, fastFilterItems);

            emptyFilterKeys.forEach(function(key) {
               delete filterClone[key];
            });

            // FIXME when using merge witout {rec: false} we will get wrong data:
            // {arr: [123]} <-- {arr: []} results {arr: [123]} instead {arr: []}
            merge(filterClone, itemsFilter, {rec: false});

            return filterClone;
         },
         applyItemsToFilter(self, filter, filterButtonItems, fastFilterItems?) {
            const filterClone = _private.calculateFilterByItems(filter, filterButtonItems, fastFilterItems);
            _private.setFilter(self, filterClone);
         },

         getHistoryData(filterButtonItems, fastFilterItems, prefetchParams?: IPrefetchHistoryParams): IFilterHistoryData|{} {
            let result = {};

            /* An empty filter should not appear in the history,
               but should be applied when loading data from the history.
               To understand this, save an empty object in history. */
            if (_private.isFilterChanged(filterButtonItems, fastFilterItems)) {
               result = Prefetch.addPrefetchToHistory(result, prefetchParams);
               result.items = _private.prepareHistoryItems(filterButtonItems, fastFilterItems);
               return result;
            }
            return {};
         },

         setFilter(self, filter) {
            self._filter = filter;
         },

         notifyFilterChanged(self) {
            self._notify('filterChanged', [self._filter]);
         },

         cloneItems(items) {
            if (items['[Types/_entity/CloneableMixin]']) {
               return items.clone();
            }
            return clone(items);
         },

      };

function getCalculatedFilter(cfg) {
         const def = new Deferred();
         const tmpStorage = {};
         _private.resolveItems(tmpStorage, cfg.historyId, clone(cfg.filterButtonSource), clone(cfg.fastFilterSource), cfg.historyItems).addCallback(function(items) {
            let calculatedFilter;
            try {
               calculatedFilter = _private.calculateFilterByItems(cfg.filter, tmpStorage._filterButtonItems, tmpStorage._fastFilterItems);

               if (cfg.prefetchParams && cfg.historyId) {
                   const history = _private.getHistoryByItems(tmpStorage, cfg.historyId, tmpStorage._filterButtonItems);

                   if (history) {
                       calculatedFilter = Prefetch.applyPrefetchFromHistory(calculatedFilter, history.data);
                   }
                   calculatedFilter = Prefetch.prepareFilter(calculatedFilter, cfg.prefetchParams);
               }
            } catch (err) {
               def.errback(err);
               throw err;
            }
            def.callback({
               filter: calculatedFilter,
               historyItems: items,
               filterButtonItems: tmpStorage._filterButtonItems,
               fastFilterItems: tmpStorage._fastFilterItems
            });
            return items;
         }).addErrback(function(err) {
            def.errback(err);
            return err;
         });
         return def;
      }

function updateFilterHistory(cfg) {
         if (!cfg.historyId) {
            throw new Error('Controls/_filter/Controller::historyId is required');
         }
         _private.resolveFilterButtonItems(cfg.filterButtonItems, cfg.fastFilterItems);
         return _private.addToHistory({}, cfg.filterButtonItems, cfg.fastFilterItems, cfg.historyId);
      }


const Container = Control.extend(/** @lends Controls/_filter/Container.prototype */{

         _template: template,
         _historySource: null,
         _filter: null,
         _filterButtonItems: null,
         _fastFilterItems: null,
         /* Флаг необходим, т.к. добавлять запись в историю после изменения фильтра
            необходимо только после загрузки данных, т.к. только в ответе списочного метода
            можно получить идентификатор закэшированных данных для этого фильтра */
         _isFilterChanged: null,

         constructor(): void {
            this._dataLoadCallback = this._dataLoadCallback.bind(this);
            this._dataLoadErrback = this._dataLoadErrback.bind(this);
            Container.superclass.constructor.apply(this, arguments);
         },

        resetPrefetch(): void {
            const filter = clone(this._filter);
            this._isFilterChanged = true;
            _private.setFilter(this, Prefetch.clearPrefetchSession(filter));
            _private.notifyFilterChanged(this);
        },

        _observeStore(options): void {
            const sourceCallbackId = Store.onPropertyChanged('filterSource', (filterSource) => {
                _private.setFilterItems(this, filterSource, [], []);
                _private.itemsReady(this, this._filter);
                // запись в историю
                this._itemsChanged(null, filterSource);
            });
            const filterSourceCallbackId = Store.onPropertyChanged('filter', (filter) => {
                _private.applyItemsToFilter(
                    this,
                    Prefetch.prepareFilter(filter, options.prefetchParams),
                    this._filterButtonItems,
                    this._fastFilterItems
                );
            });
            this._storeCallbacks = [sourceCallbackId, filterSourceCallbackId];
        },

        _beforeMount(options, context, receivedState): Promise<IFilterHistoryData|{}> {
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
                    _private.setFilterItems(this, state.filterSource, [], receivedState);
                    _private.itemsReady(this, filter, receivedState);
                } else {
                    _private.setFilterItems(this, options.filterButtonSource, options.fastFilterSource, receivedState);
                    _private.itemsReady(this, filter, receivedState);
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
        },

         _beforeUpdate(newOptions): void {
            if (!this._options.useStore) {
                const filterButtonChanged = this._options.filterButtonSource !== newOptions.filterButtonSource;
                const fastFilterChanged = this._options.fastFilterSource !== newOptions.fastFilterSource;
                const filterChanged = !isEqual(this._options.filter, newOptions.filter);

                if (filterButtonChanged || fastFilterChanged) {
                    _private.setFilterItems(
                        this,
                        filterButtonChanged ? newOptions.filterButtonSource : this._filterButtonItems,
                        fastFilterChanged ? newOptions.fastFilterSource : this._fastFilterItems);

                    _private.itemsReady(this, this._filter);
                }

                if (filterChanged) {
                    _private.applyItemsToFilter(
                        this,
                        Prefetch.prepareFilter(newOptions.filter, newOptions.prefetchParams),
                        this._filterButtonItems,
                        this._fastFilterItems
                    );
                    if (newOptions.prefetchParams) {
                        this._isFilterChanged = true;
                    }
                }

                if (filterButtonChanged && newOptions.prefetchParams) {
                    this._filter = Prefetch.clearPrefetchSession(this._filter);
                }

                if (newOptions.historyId !== this._options.historyId) {
                    this._crudWrapper = null;
                }
            }
         },

        _beforeUnmount(): void {
             if (this._options.useStore) {
                 this._storeCallbacks.forEach((id) => Store.unsubscribe(id));
             }
        },

         _filterHistoryApply(event, history): void {
             if (this._options.prefetchParams) {
                 _private.processHistoryOnItemsChanged(this, history.items || history, this._options);
             }
         },

         _itemsChanged(event, items): void {
            _private.updateFilterItems(this, items);
            _private.applyItemsToFilter(this, this._filter, items);

            if (this._options.historyId) {
                if (this._options.prefetchParams) {
                    if (!this._isFilterChanged) {
                        _private.deleteCurrentFilterFromHistory(this);
                        Prefetch.clearPrefetchSession(this._filter);
                    }
                    this._isFilterChanged = true;
                } else {
                    _private.processHistoryOnItemsChanged(this, items, this._options);
                }
            }

            _private.notifyFilterChanged(this);
         },

         _filterChanged(event, filter) {
            // Controller should stop bubbling of 'filterChanged' event, that container-control fired
            event.stopPropagation();
            _private.setFilter(this, Prefetch.prepareFilter(filter, this._options.prefetchParams));
            _private.notifyFilterChanged(this);
         },

         _dataLoadCallback(items: RecordSet): void {
            if (this._options.historyId && this._isFilterChanged) {
                if (historyUtils.getHistorySource({ historyId: this._options.historyId }).historyReady()) {
                    _private.deleteCurrentFilterFromHistory(this);
                }
                _private.addToHistory(
                   this,
                   this._filterButtonItems,
                   this._fastFilterItems,
                   this._options.historyId,
                   Prefetch.getPrefetchParamsForSave(items));

               // Намеренное допущение, что меняем объект по ссылке.
               // Сейчас по-другому не сделать, т.к. контроллер фильтрации находится над
               // контейнером и списком, которые владеют данными.
               // А изменение фильтра вызывает повторный запрос за данными.
               Prefetch.applyPrefetchFromItems(this._filter, items);
            }

            this._isFilterChanged = false;

            if (this._options.dataLoadCallback) {
               this._options.dataLoadCallback(items);
            }
         },

        _dataLoadErrback(error: Error): void {
            if (this._options.historyId && this._isFilterChanged) {
                const currentAppliedHistoryItems =
                    _private.getHistoryByItems(this, this._options.historyId, this._filterButtonItems);

                if (currentAppliedHistoryItems) {
                    Object.assign(
                        this._filter,
                        Prefetch.applyPrefetchFromHistory(this._filter, currentAppliedHistoryItems.data)
                    );
                }
            }
            if (this._options.dataLoadErrback) {
                this._options.dataLoadErrback(error);
            }
        }

      });

Container._private = _private;
Container.getCalculatedFilter = getCalculatedFilter;
Container.updateFilterHistory = updateFilterHistory;
export = Container;
