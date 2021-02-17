import Collection from 'Controls/_columns/display/Collection';
import {IColumnsCalculator} from 'Controls/_columns/interface/IColumnsCalculator';

export class FixedColumns implements IColumnsCalculator {
    calcColumn(collection: Collection<unknown>, index: number): number {
        if (index < collection.getCount()) {
            const item = collection.at(index);
            return item.getContents().get && item.getContents().get(collection.getColumnProperty() || 'column') || 0;
        }
        return 0;
    }
}
