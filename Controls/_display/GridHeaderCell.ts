import { IHeaderCell } from '../_grid/interface/IHeaderCell';
import GridHeader from './GridHeader';
import { mixin } from 'Types/_util/mixin';
import { OptionsToPropertyMixin } from 'Types/entity';
import {isStickySupport} from '../_scroll/StickyHeader/Utils';

export interface IOptions<T> {
    owner: GridHeader<T>;
    headerCell: IHeaderCell;
}

export default class GridHeaderCell<T> extends mixin<OptionsToPropertyMixin>(OptionsToPropertyMixin) {
    protected _$owner: GridHeader<T>;

    constructor(options?: IOptions<T>) {
        super();
        OptionsToPropertyMixin.call(this, options);
    }

    getWrapperClasses(theme: string): string {
        const isMultiHeader = false;
        const isStickySupport = false;
        let wrapperClasses = 'controls-Grid__header-cell';

        wrapperClasses += ` controls-Grid__header-cell_theme-${theme}`;
        if (isMultiHeader) {
            wrapperClasses += ` controls-Grid__multi-header-cell_min-height_theme-${theme}`;
        } else {
            wrapperClasses += ` controls-Grid__header-cell_min-height_theme-${theme}`;
        }
        if (!isStickySupport) {
            wrapperClasses += ' controls-Grid__header-cell_static';
        }
        // _private.getBackgroundStyle(this._options, true);
        return wrapperClasses;
    }

    getWrapperStyles(): string {
        return '';
    }

    getContentClasses(theme: string): string {
        const isMultiHeader = false;
        let contentClasses = 'controls-Grid__header-cell__content';
        contentClasses += ` controls-Grid__header-cell__content_theme-${theme}`;
        if (isMultiHeader) {
            contentClasses += ` controls-Grid__row-multi-header__content_baseline_theme-${theme}`;
        } else {
            contentClasses += ` controls-Grid__row-header__content_baseline_theme-${theme}`;
        }
        // {{headerColumn.cellContentClasses}}
        return contentClasses;
    }

    getWrapperPaddingClasses(): string {
        let paddingClasses = '';
        return paddingClasses;
    }
}

Object.assign(GridHeaderCell.prototype, {
    _moduleName: 'Controls/display:GridHeaderCell',
    _instancePrefix: 'grid-header-cell-',
    _$owner: null
});
