import {ColumnsCollection} from 'Controls/display';
import {IColumnsCalculator} from 'Controls/_columns/interface/IColumnsCalculator';

export class AutoColumns implements IColumnsCalculator {
    calcColumn(collection: ColumnsCollection<unknown>, index: number, columnsCount: number): number {
        return index % columnsCount;
    }
}

