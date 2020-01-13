import {IAdditionalQueryParams, Direction} from './IAdditionalQueryParams';
import {RecordSet} from 'Types/collection';

export interface IQueryParamsController {
    calculateState(list: RecordSet, direction?: Direction): void;
    destroy(): void;
    getAllDataCount(rootKey: string|number): boolean | number;
    getLoadedDataCount(): number;
    hasMoreData(direction: Direction, key: string|number): boolean|undefined;
    prepareQueryParams(direction: Direction): IAdditionalQueryParams;
    setState(state: any): void;
    setEdgeState(direction: Direction): void;
}
