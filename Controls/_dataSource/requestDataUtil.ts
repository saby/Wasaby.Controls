/**
 * Модуль возвращает метод, с помощью которого можно запросить данные с учетом фильтрации.
 * @class Controls/_dataSource/requestDataUtil
 * @author Сухоручкин А.С.
 */

import {Controller as SourceController} from 'Controls/source';
import {Controller as FilterController} from 'Controls/filter';
import * as PropStorageUtil from 'Controls/_list/resources/utils/PropStorageUtil';
import {RecordSet} from 'Types/collection';
import {SbisService} from 'Types/source';

type HistoryItems = object[];
}
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

   const loadSortingPromise = PropStorageUtil.loadSavedConfig(cfg.propStorageId, ['sorting']);

   if (cfg.historyId && cfg.filterButtonSource && cfg.fastFilterSource && cfg.filter) {
      // Load filter, then load data
      return Promise.all([FilterController.getCalculatedFilter(cfg), loadSortingPromise]).then((resolvedData) => {
         const filterObject = resolvedData[0];
         const loadedCfg = resolvedData[1];
         if (loadedCfg && loadedCfg.sorting) {
            sorting = loadedCfg.sorting;
         }
         return sourceController.load(filterObject.filter, sorting).then((data: RecordSet) => {
            return {
               data,
               historyItems: filterObject.historyItems
            };
         });
      });
   } else {
      return loadSortingPromise.then((loadedCfg) => {
         if (loadedCfg && loadedCfg.sorting) {
            sorting = loadedCfg.sorting;
         }
         return sourceController.load(cfg.filter, sorting).then((data: RecordSet) => {
            return {
               data
            };
         });
      });
   }
}
