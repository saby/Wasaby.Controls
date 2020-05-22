import {Control, IControlOptions} from 'UI/Base';
import {ColumnsCollection} from 'Controls/display';
import {IColumnsCalculator} from 'Controls/_columns/interface/IColumnsCalculator';
import {AutoColumns} from 'Controls/_columns/controllers/AutoColumns';
import {FixedColumns} from 'Controls/_columns/controllers/FixedColumns';

interface IColumnsControllerOptions extends IControlOptions {
    columnsMode: 'auto' | 'fixed';
}


export default class ColumnsController extends Control {
    private _columnsCalculator: IColumnsCalculator;

    constructor(cfg: IColumnsControllerOptions) {
        super(cfg);
        this.setColumnsMode(cfg.columnsMode);
    }

    setColumnsMode(columnsMode: 'auto' | 'fixed'): void {
        if (columnsMode === 'fixed') {
            this._columnsCalculator = new FixedColumns();
        } else {
            this._columnsCalculator = new AutoColumns();
        }
    }

    calcColumn(collection: ColumnsCollection<unknown>, index: number, columnsCount?: number): number {
        return this._columnsCalculator.calcColumn(collection, index, columnsCount);
    }
}
