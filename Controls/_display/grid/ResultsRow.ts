import { TemplateFunction } from 'UI/Base';
import { Model as EntityModel } from 'Types/entity';
import Collection from './Collection';
import Row from './Row';
import { IColumn } from 'Controls/grid';
import {TColspanCallbackResult, TResultsColspanCallback} from './mixins/Grid';


export type TResultsPosition = 'top' | 'bottom';

export interface IOptions<T> {
    owner: Collection<T>;
    resultsTemplate: TemplateFunction;
    results: EntityModel;
    resultsColspanCallback: TResultsColspanCallback;
}

export default class ResultsRow<T> extends Row<T> {
    protected _$results: EntityModel;
    protected _$resultsTemplate: TemplateFunction;
    protected _$resultsColspanCallback: TResultsColspanCallback;

    constructor(options?: IOptions<T>) {
        super(options);
    }

    getContents(): T {
        return 'results' as unknown as T
    }

    isSticked(): boolean {
        return this.isStickyHeader() && this.getResultsPosition() === 'top';
    }

    getItemClasses(): string {
        return `controls-Grid__results`;
    }

    getResults(): EntityModel {
        return this._$results;
    }

    protected _getColspan(column: IColumn, columnIndex: number): TColspanCallbackResult {
        const colspanCallback = this._$resultsColspanCallback;
        if (colspanCallback) {
            return colspanCallback(column, columnIndex, this._$owner.isEditing());
        }
        return undefined;
    }

    protected _initializeColumns(): void {
        if (this._$columns) {
            const factory = this._getColumnsFactory();

            if (this._$resultsTemplate) {
                this._$columnItems = [factory({
                    column: {
                        resultTemplate: this._$resultsTemplate,
                        colspan: this._$owner.getColumnsConfig().length
                    },
                })];
            } else {
                this._$columnItems = this._prepareColumnItems(this._$columns, factory);
            }

            if (this._$owner.needMultiSelectColumn()) {
                this._$columnItems.unshift(factory({
                    column: {}
                }));
            }
        }
    }
}

Object.assign(ResultsRow.prototype, {
    '[Controls/_display/grid/ResultsRow]': true,
    _moduleName: 'Controls/display:GridResults',
    _cellModule: 'Controls/display:GridResultsCell',
    _$results: null,
    _$resultsTemplate: null,
    _$resultsColspanCallback: null
});
