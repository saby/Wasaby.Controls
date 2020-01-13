import {QueryNavigationType} from 'Types/source';

export type SortingObject = object[];
export type FilterObject = Record<string, unknown>;

export type Direction = 'up' | 'down';

export type DirectionCfg = 'before' | 'after' | 'both';

export interface IAdditionQueryParamsMeta {
   navigationType?: QueryNavigationType;
   hasMore?: boolean;
}
export interface IAdditionalQueryParams {
   meta?: IAdditionQueryParamsMeta;
   limit?: number;
   offset?: number;
   filter?: FilterObject;
   sorting?: SortingObject;
}
