/**
 * Модуль возвращает метод, с помощью которого можно запросить данные с учетом фильтрации.
 * @class Controls/_dataSource/requestDataUtil
 * @public
 * @author Сухоручкин А.С.
 */

import {Controller as SourceController} from 'Controls/source';
import {Controller as FilterController} from 'Controls/filter';
import {RecordSet} from 'Types/collection';

type HistoryItems = object[];

interface IFilter {
   filter: Record<string, unknown>;
   historyItems: HistoryItems;
}
interface IRequestDataResult {
   data: RecordSet;
   historyItems?: HistoryItems;
}

/**
 * @typedef {Object} ISourceConfig
 * @property {ICrud} source {@link Controls/list:DataContainer#source}
 * @property {Array|function|IList} fastFilterSource? {@link Controls/_filter/Controller#fastFilterSource}
 * @property {Object} navigation? {@link Controls/list:DataContainer#navigation}
 * @property {String} historyId? {@link Controls/_filter/Controller#historyId}
 * @property {Object} filter? {@link Controls/list#filter}
 * @property {Object} sorting? {@link Controls/list/ISorting#sorting}
 * @property {?Object[]} historyItems? {@link  Controls/_filter/Controller#historyItems}
 */

export interface ISourceConfig {
   source: SbisService;
   filterButtonSource?: SbisService;
   fastFilterSource?: SbisService;
   navigation?: object;
   historyId?: string;
   filter?: object;
   sorting?: object;
   historyItems?: HistoryItems;
}

export default function requestData(cfg: ISourceConfig): Promise<IRequestDataResult> {
   const sourceController = new SourceController({
      source: cfg.source,
      navigation: cfg.navigation
   });

   if (cfg.historyId && cfg.filterButtonSource && cfg.fastFilterSource && cfg.filter) {
      // Load filter, then load data
      return FilterController.getCalculatedFilter(cfg).then((filterObject: IFilter) => {
         return sourceController.load(filterObject.filter, cfg.sorting).then((data: RecordSet) => {
            return {
               data,
               historyItems: filterObject.historyItems
            };
         });
      });
   } else {
      return sourceController.load(cfg.filter, cfg.sorting).then((data: RecordSet) => {
         return {
            data
         };
      });
   }
}
