import Collection from 'Controls/_columns/display/Collection';
import {IColumnsCalculator} from 'Controls/_columns/interface/IColumnsCalculator';

export class AutoColumns implements IColumnsCalculator {
    calcColumn(collection: Collection<unknown>, index: number, columnsCount: number): number {
        return index % columnsCount;
    }
}
