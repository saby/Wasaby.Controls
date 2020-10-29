import { TemplateFunction } from 'UI/Base';
import { mixin } from 'Types/util';
import { OptionsToPropertyMixin } from 'Types/entity';
import GridFooter from './GridFooter';

export interface IOptions<T> {
    owner: GridFooter<T>;
    template?: TemplateFunction;
    // ToDo | Временная опция для обеспечения вывода общего шаблона строки результатов.
    //      | При разработке мультизаговков colspan будет сделан единообразно и для футера.
    colspan?: boolean;
}

const DEFAULT_CELL_TEMPLATE = 'Controls/gridNew:FooterContent';

export default class GridFooterCell<T> extends mixin<OptionsToPropertyMixin>(OptionsToPropertyMixin) {
    protected _$owner: GridFooter<T>;
    protected _$template: TemplateFunction;
    protected _$colspan: boolean;

    constructor(options?: IOptions<T>) {
        super();
        OptionsToPropertyMixin.call(this, options);
    }

    getCellIndex(): number {
        return this._$owner.getCellIndex(this);
    }

    isFirstColumn(): boolean {
        return this.getCellIndex() === 0;
    }

    isLastColumn(): boolean {
        return this.getCellIndex() === this._$owner.getCellsCount() - 1;
    }

    isMultiSelectColumn(): boolean {
        return this._$owner.getMultiSelectVisibility() !== 'hidden' && this.isFirstColumn();
    }

    getWrapperClasses(theme: string, style: string = 'default'): string {
        let wrapperClasses = `controls-Grid__footer-cell`;
        const leftPadding = this._$owner.getLeftPadding();
        const isMultiSelectColumn = this.isMultiSelectColumn();

        wrapperClasses += ` controls-BaseControl__footer-content_theme-${theme}`;

        if (isMultiSelectColumn) {
            wrapperClasses += ` controls-ListView__footer__paddingLeft_withCheckboxes_theme-${theme}`;
        } else {
            wrapperClasses += ` controls-ListView__footer__paddingLeft_${leftPadding}_theme-${theme}`;
        }

        return wrapperClasses;
    }

    getWrapperStyles(): string {
        if (this._$colspan) {
            return `grid-column: 1 / ${this._$owner.getColumnsCount() + 1}`;
        }
        return '';
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
