import { TemplateFunction } from 'UI/Base';
import GridRow, {IOptions as IGridRowOptions} from './GridRow';
import GridCollection from './GridCollection';
import { TColumns } from 'Controls/grid';
import GridFooterCell from './GridFooterCell';

type TFooterCells<T> = Array<GridFooterCell<T>>;

export interface IOptions<T> extends IGridRowOptions<T> {
    owner: GridCollection<T>;
    footerTemplate: TemplateFunction;
}

export default class GridFooterRow<T> extends GridRow<T> {
    protected _$owner: GridCollection<T>;
    protected _$template: TemplateFunction;

    constructor(options?: IOptions<T>) {
        super(options);
    }

    getContents(): T {
        return 'footer' as unknown as T
    }

    // TODO: Переделать параметры на объект
    getWrapperClasses(theme: string): string {
        /* todo
        // Для предотвращения скролла одной записи в таблице с экшнами.
        // _options._needBottomPadding почему-то иногда не работает.
        if ((this._listModel.getCount() || this._listModel.isEditing()) &&
            this._options.itemActionsPosition === 'outside' &&
            !this._options._needBottomPadding &&
            this._options.resultsPosition !== 'bottom') {
            classList = classList.add(`controls-GridView__footer__itemActionsV_outside_theme-${this._options.theme}`);
        }*/
        return `controls-GridView__footer`;
    }

    _initializeColumns(): void {
        if (this._$columns) {
            const factory = this._getColumnsFactory();
            this._$columnItems = [];
            if (this._$owner.getMultiSelectVisibility()) {
                this._$columnItems.push(factory({}));
            }
            this._$columnItems.push(factory({
                template: this._$template,
                colspan: this._$owner.getColumnsConfig().length
            }));
        }
    }
}

Object.assign(GridFooterRow.prototype, {
    _moduleName: 'Controls/display:GridFooterRow',
    _instancePrefix: 'grid-footer-row-',
    _cellModule: 'Controls/display:GridFooterCell',
    _$owner: null,
    _$template: null
});
