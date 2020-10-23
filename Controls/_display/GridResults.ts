import { TemplateFunction } from 'UI/Base';
import { mixin } from 'Types/util';
import { OptionsToPropertyMixin } from 'Types/entity';
import GridCollection from './GridCollection';
import { IColumn } from '../_grid/interface/IColumn';
import GridResultsCell from './GridResultsCell';
import { Model as EntityModel } from 'Types/entity';

type TResultsCells<T> = Array<GridResultsCell<T>>;

export interface IOptions<T> {
    owner: GridCollection<T>;
    resultsTemplate: TemplateFunction;
    results: EntityModel;
}

export default class GridResults<T> extends mixin<OptionsToPropertyMixin>(OptionsToPropertyMixin) {
    protected _$owner: GridCollection<T>;
    protected _$resultsCells: TResultsCells<T>;
    protected _$results: EntityModel;

    constructor(options?: IOptions<T>) {
        super();
        OptionsToPropertyMixin.call(this, options);
        this._$resultsCells = this._prepareCells(this._$owner.getColumns(), options.resultsTemplate);
    }

    getBodyClasses(theme: string): string {
        return `controls-Grid__results`;
    }

    getCells(): TResultsCells<T> {
        return this._$resultsCells;
    }

    getCellIndex(resultsCell: GridResultsCell<T>): number {
        return this._$resultsCells.indexOf(resultsCell);
    }

    getColumnsCount(): number {
        return this._$owner.getColumns().length;
    }

    getResultsCellsCount(): number {
        return this._$resultsCells.length;
    }

    getTopPadding(): string {
        return this._$owner.getTopPadding().toLowerCase();
    }

    getBottomPadding(): string {
        return this._$owner.getBottomPadding().toLowerCase();
    }

    getLeftPadding(): string {
        return this._$owner.getLeftPadding().toLowerCase();
    }

    getRightPadding(): string {
        return this._$owner.getRightPadding().toLowerCase();
    }

    getMultiSelectVisibility(): string {
        return this._$owner.getMultiSelectVisibility();
    }

    isStickyHeader(): boolean {
        return this._$owner.isStickyHeader();
    }

    getResults(): EntityModel {
        return this._$results;
    }

    protected _prepareCells(columns: IColumn[], resultsTemplate: TemplateFunction): TResultsCells<T> {
        const resultsCells = [];
        // todo add multiSelect cell
        if (resultsTemplate) {
            const resultsCell = new GridResultsCell({
                template: resultsTemplate,
                owner: this,
                // ToDo | Временная опция для обеспечения вывода общего шаблона строки результатов.
                //      | При разработке мультизаговков colspan будет сделан единообразно и для результатов.
                colspan: true
            });
            resultsCells.push(resultsCell);
            return resultsCells;
        }
        columns.forEach((elem) => {
            const resultsCell = new GridResultsCell({
                template: elem.resultTemplate,
                displayProperty: elem.displayProperty,
                align: elem.align,
                owner: this
            });
            resultsCells.push(resultsCell);
        });
        return resultsCells;
    }
}

Object.assign(GridResults.prototype, {
    _moduleName: 'Controls/display:GridResults',
    _$results: null,
    _$owner: null
});
