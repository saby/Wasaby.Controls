import { TemplateFunction } from 'UI/Base';
import GridFooterRow from './GridFooterRow';
import GridCell, {IOptions as IGridCellOptions} from './GridCell';

export interface IOptions<T> extends IGridCellOptions<T> {
    owner: GridFooterRow<T>;
    template?: TemplateFunction;
}

const DEFAULT_CELL_TEMPLATE = 'Controls/gridNew:FooterContent';

export default class GridFooterCell<T> extends GridCell<T, GridFooterRow<T>> {
    protected _$owner: GridFooterRow<T>;
    protected _$template: TemplateFunction;

    constructor(options?: IOptions<T>) {
        super(options);
    }

    getWrapperClasses(theme: string, style: string = 'default'): string {
        let wrapperClasses = `controls-Grid__footer-cell`;
        const isMultiSelectColumn = this.isMultiSelectColumn();
        wrapperClasses += ` controls-BaseControl__footer-content_theme-${theme}`;

        if (isMultiSelectColumn) {
            wrapperClasses += ` controls-ListView__footer__paddingLeft_withCheckboxes_theme-${theme}`;
        } else {
            wrapperClasses += ` controls-ListView__footer__paddingLeft_${this._$owner.getLeftPadding()}_theme-${theme}`;
        }

        return wrapperClasses;
    }

    getWrapperStyles(): string {
        return super.getWrapperStyles();
    }

    getContentClasses(theme: string): string {
        return `controls-Grid__footer-cell__content`;
    }

    getTemplate(): TemplateFunction|string {
        return this._$template || DEFAULT_CELL_TEMPLATE;
    }

    getTemplateOptions(): {} {
        return {};
    }
}

Object.assign(GridFooterCell.prototype, {
    _moduleName: 'Controls/display:GridFooterCell',
    _instancePrefix: 'grid-footer-cell-',
    _$owner: null,
    _$template: null,
    _$colspan: null,
});
