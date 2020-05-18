import {QueryNavigationType, QueryOrderSelector} from 'Types/source';
import {IHashMap} from 'Types/declarations';

export type Direction = 'up' | 'down';

export interface IAdditionQueryParamsMeta {
   navigationType?: QueryNavigationType;
   hasMore?: boolean;
}
export interface IAdditionalQueryParams {
   meta?: IAdditionQueryParamsMeta;
   limit?: number;
   offset?: number;
   filter?: IHashMap<unknown>;
   sorting?: QueryOrderSelector;
}
