/**
 * Модуль возвращает метод, с помощью которого можно запросить данные с учетом фильтрации.
 * @class Controls/_dataSource/requestDataUtil
 * @author Сухоручкин А.С.
 */

import {Controller as SourceController} from 'Controls/source';
import {Controller as FilterController} from 'Controls/filter';
import * as PropStorageUtil from 'Controls/Utils/PropStorageUtil';
import {RecordSet} from 'Types/collection';
import {SbisService} from 'Types/source';

type HistoryItems = object[];

interface IFilter {
   filter: Record<string, unknown>;
   historyItems: HistoryItems;
}
export interface IRequestDataResult {
   data: RecordSet;
   historyItems?: HistoryItems;
}

export interface ISourceConfig {
   source: SbisService;
   filterButtonSource?: SbisService;
   fastFilterSource?: SbisService;
   navigation?: object;
   historyId?: string;
   filter?: object;
   sorting?: object;
   historyItems?: HistoryItems;
   propStorageId: string;
}

export default function requestDataUtil(cfg: ISourceConfig): Promise<IRequestDataResult> {
   const sourceController = new SourceController({
      source: cfg.source,
      navigation: cfg.navigation
   });
   let sorting = cfg.sorting;
   let filter = cfg.filter;

   const getSortingPromise = PropStorageUtil.loadSavedConfig;
   const getFilterPromise = FilterController.getCalculatedFilter;
   if (cfg.historyId && cfg.filterButtonSource && cfg.fastFilterSource && cfg.filter) {
      getFilterPromise(cfg);
   }
   if (cfg.propStorageId) {
      getSortingPromise(cfg.propStorageId, ['sorting']);
   }

   return Promise.all([getFilterPromise, getSortingPromise]).then((resolvedData: Array) => {
      let [filterObject, loadedCfg] = resolvedData;
      if (loadedCfg && loadedCfg.sorting) {
         sorting = loadedCfg.sorting;
      }
      if (filterObject) {
         filter = filterObject.filter;
      }
      return sourceController.load(filter, sorting).then((data: RecordSet) => {
         return {
            data,
            historyItems: filterObject.historyItems
         };
      });
   });
}
