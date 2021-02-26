import Collection from 'Controls/_columns/display/Collection';

export interface IColumnsCalculator {
    calcColumn(collection: Collection<unknown>, index: number, columnsCount?: number): number;
}
