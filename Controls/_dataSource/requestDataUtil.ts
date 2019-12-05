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

interface ISorting {
   sorting: object[];
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
   let sortingPromise;
   let filterPromise;
   if (cfg.historyId && cfg.filterButtonSource && cfg.fastFilterSource && cfg.filter) {
      filterPromise = FilterController.getCalculatedFilter(cfg);
   }
   if (cfg.propStorageId) {
      sortingPromise = PropStorageUtil.loadSavedConfig(cfg.propStorageId, ['sorting']);
   }

   return Promise.all([filterPromise, sortingPromise]).then(([filterObject, sortingObject]: [IFilter, ISorting]) => {
      return sourceController.load(filterObject ? filterObject.filter : cfg.filter, sortingObject ? sortingObject.sorting : cfg.sorting).then((data: RecordSet) => {
         let result = {data};
         if (filterObject) {
            result.historyItems = filterObject.historyItems;
         }
         return result;
      });
   });
}
