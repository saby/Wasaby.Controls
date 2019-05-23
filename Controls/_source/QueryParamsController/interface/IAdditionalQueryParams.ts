import {QueryNavigationType} from 'Types/source';

export type Direction = 'up' | 'down';

export type DirectionCfg = 'before' | 'after' | 'both';

interface IAdditionQueryParamsMeta {
   navigationType?: QueryNavigationType;
   hasMore?: boolean;
}
export default interface IAdditionalQueryParams {
   meta?: IAdditionQueryParamsMeta;
   limit?: number;
   offset?: number;
   filter?: object;
   sorting?: any[];
}
