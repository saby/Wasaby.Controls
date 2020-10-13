import { mixin } from 'Types/util';
import {
    OptionsToPropertyMixin,
    DestroyableMixin,
    InstantiableMixin,
    VersionableMixin,
    IInstantiable,
    IVersionable
} from 'Types/entity';
import GridCollectionItem from './GridCollectionItem';
import { TemplateFunction } from 'UI/Base';
import {createClassListCollection} from "../_list/resources/utils/CssClassList";

export interface IColumnConfig {
    template: TemplateFunction|string;
    width?: string;
    cellPadding?: { left: string; right: string; };
    displayProperty?: string;
}

export interface IOptions<T> {
    owner: GridCollectionItem<T>;
    column: IColumnConfig;
}

export default class GridColumn<T> extends mixin<
    DestroyableMixin,
    OptionsToPropertyMixin,
    InstantiableMixin,
    VersionableMixin
>(
    DestroyableMixin,
    OptionsToPropertyMixin,
    InstantiableMixin,
    VersionableMixin
) implements IInstantiable, IVersionable {
    readonly '[Types/_entity/IInstantiable]': boolean;
    getInstanceId: () => string;

    protected _$owner: GridCollectionItem<T>;
    protected _$column: IColumnConfig;

    constructor(options?: IOptions<T>) {
        super();
        OptionsToPropertyMixin.call(this, options);
    }

    getWrapperClasses(theme: string, backgroundColorStyle?: string, style: string = 'default'): string {
        let wrapperClasses = '';
        const isEditing = this._$owner.isEditing();
        const preparedStyle = style === 'masterClassic' ? 'default' : style;
        const topPadding = this._$owner.getTopPadding();
        const bottomPadding = this._$owner.getBottomPadding();
        const leftPadding = this._$owner.getLeftPadding();
        const rightPadding = this._$owner.getRightPadding();
        const isCheckBoxColumn = false;
        const hasColumnScroll = false;

        if (topPadding === 'null' && bottomPadding === 'null') {
            wrapperClasses += `controls-Grid__row-cell_small_min_height-theme-${theme} `;
        } else {
            wrapperClasses += `controls-Grid__row-cell_default_min_height-theme-${theme} `;
        }

        wrapperClasses += `controls-Grid__row-cell controls-Grid__cell_${preparedStyle} controls-Grid__row-cell_${preparedStyle}_theme-${theme}`;

        if (hasColumnScroll) {
        } else if (!isCheckBoxColumn) {
            wrapperClasses += ' controls-Grid__cell_fit';
        }

        wrapperClasses += this._getWrapperSeparatorClasses(theme);

        /*const checkBoxCell = current.multiSelectVisibility !== 'hidden' && current.columnIndex === 0;
        const classLists = createClassListCollection('base', 'padding', 'columnScroll', 'columnContent');
+++     let style = current.style === 'masterClassic' || !current.style ? 'default' : current.style;
        const backgroundStyle = current.backgroundStyle || current.style || 'default';
        const isFullGridSupport = GridLayoutUtil.isFullGridSupport();

+++     // Стиль колонки
+++     if (current.itemPadding.top === 'null' && current.itemPadding.bottom === 'null') {
+++         classLists.base += `controls-Grid__row-cell_small_min_height-theme-${theme} `;
+++     } else {
+++         classLists.base += `controls-Grid__row-cell_default_min_height-theme-${theme} `;
+++     }
+++     classLists.base += `controls-Grid__row-cell controls-Grid__cell_${style} controls-Grid__row-cell_${style}_theme-${theme}`;
        _private.prepareSeparatorClasses(current, classLists, theme);

        if (backgroundColorStyle) {
            classLists.base += _private.getBackgroundStyle({backgroundStyle, theme, backgroundColorStyle}, true);
        }

        if (self._options.columnScroll) {
            classLists.columnScroll += _private.getColumnScrollCalculationCellClasses(current, theme);
            if (self._options.columnScrollVisibility) {
                classLists.columnScroll += _private.getColumnScrollCellClasses(current, theme);
            }
        } else if (!checkBoxCell) {
            classLists.base += ' controls-Grid__cell_fit';
        }

        if (current.isEditing()) {
            classLists.base += ` controls-Grid__row-cell-background-editing_theme-${theme}`;
        } else {
            let backgroundHoverStyle = current.hoverBackgroundStyle || 'default';
            classLists.base += ` controls-Grid__row-cell-background-hover-${backgroundHoverStyle}_theme-${theme}`;
        }

        if (current.columnScroll && !current.isEditing()) {
            classLists.columnScroll += _private.getBackgroundStyle({backgroundStyle, theme}, true);
        }

        // Если включен множественный выбор и рендерится первая колонка с чекбоксом
        if (checkBoxCell) {
            classLists.base += ` controls-Grid__row-cell-checkbox_theme-${theme}`;
            classLists.padding = createClassListCollection('top', 'bottom');
            classLists.padding.top = `controls-Grid__row-checkboxCell_rowSpacingTop_${current.itemPadding.top}_theme-${theme}`;
            classLists.padding.bottom =  `controls-Grid__row-cell_rowSpacingBottom_${current.itemPadding.bottom}_theme-${theme}`;
        } else {
            classLists.padding = _private.getPaddingCellClasses(current, theme);
        }

        if (current.dispItem.isMarked() && current.markerVisibility !== 'hidden') {
            style = current.style || 'default';
            classLists.marked = `controls-Grid__row-cell_selected controls-Grid__row-cell_selected-${style}_theme-${theme}`;

            // при отсутствии поддержки grid (например в IE, Edge) фон выделенной записи оказывается прозрачным,
            // нужно его принудительно установить как фон таблицы
            if (!isFullGridSupport && !current.isEditing()) {
                classLists.marked += _private.getBackgroundStyle({backgroundStyle, theme}, true);
            }

            if (current.columnIndex === 0) {
                classLists.marked += ` controls-Grid__row-cell_selected__first-${style}_theme-${theme}`;
            }
            if (current.columnIndex === current.getLastColumnIndex()) {
                classLists.marked += ` controls-Grid__row-cell_selected__last controls-Grid__row-cell_selected__last-${style}_theme-${theme}`;
            }
        } else if (current.columnIndex === current.getLastColumnIndex()) {
            classLists.base += ` controls-Grid__row-cell__last controls-Grid__row-cell__last-${style}_theme-${theme}`;
        }

        if (!GridLayoutUtil.isFullGridSupport() && !(current.columns.length === (current.hasMultiSelect ? 2 : 1)) && self._options.fixIEAutoHeight) {
            classLists.base += ' controls-Grid__row-cell__autoHeight';
        }
        return classLists;*/
        return wrapperClasses;
    }

    getContentClasses(theme: string, cursor: string = 'pointer', templateHighlightOnHover: boolean = true): string {
        const isCheckBoxCell = false;
        let contentClasses = 'controls-Grid__row-cell__content';

        contentClasses += ` controls-Grid__row-cell__content_baseline_default_theme-${theme}`;
        contentClasses += ` controls-Grid__row-cell_cursor-${cursor}`;

        // Если включен множественный выбор и рендерится первая колонка с чекбоксом
        if (isCheckBoxCell) {
            /*classLists.base += ` controls-Grid__row-cell-checkbox_theme-${theme}`;
            classLists.padding = createClassListCollection('top', 'bottom');
            classLists.padding.top = `controls-Grid__row-checkboxCell_rowSpacingTop_${current.itemPadding.top}_theme-${theme}`;
            classLists.padding.bottom =  `controls-Grid__row-cell_rowSpacingBottom_${current.itemPadding.bottom}_theme-${theme}`;*/
        } else {
            contentClasses += this._getContentPaddingClasses(theme);
        }

        contentClasses += ' controls-Grid__row-cell_withoutRowSeparator_size-null_theme-default';

        /*
+++     controls-Grid__row-cell__content controls-Grid__row-cell__content_baseline_default_theme-{{_options.theme}}
+++     {{itemData.classList.padding.getAll()}} {{ itemData.classList.columnContent }} controls-Grid__row-cell_cursor-{{cursor || 'pointer'}}
        {{backgroundColorStyle ? 'controls-Grid__row-cell__content_background_' + backgroundColorStyle + '_theme-' + _options.theme}}
+++     {{itemData.hoverBackgroundStyle ? 'controls-Grid__item_background-hover_' + itemData.hoverBackgroundStyle  + '_theme-' + _options.theme}}
        */

        if (this._$owner.isEditing()) {
            contentClasses += ` controls-Grid__row-cell-background-editing_theme-${theme}`;
        } else {
            contentClasses += ` controls-Grid__row-cell-background-hover-default_theme-${theme}`;
        }
        if (this._$owner.isActive() && templateHighlightOnHover !== false) {
            contentClasses += ` controls-GridView__item_active_theme-${theme}`;
        }
        return contentClasses;
    }

    getCellClasses(templateHighlightOnHover: boolean): string {
        // GridViewModel -> getItemColumnCellClasses
        const itemSpacing = this._$owner.getItemSpacing();
        let classes = 'controls-Grid__row-cell js-controls-ItemActions__swipeMeasurementContainer';

        if (itemSpacing.row === 'null') {
            classes += 'controls-Grid__row-cell_small_min_height-theme-default';
        } else {
            classes += 'controls-Grid__row-cell_default_min_height-theme-default';
        }

        // if !checkBoxCell
        classes += ' controls-Grid__cell_fit';

        if (this._$owner.isEditing()) {
            classes += ' controls-Grid__row-cell-background-editing_theme-default';
        } else {
            classes += ' controls-Grid__row-cell-background-hover-default_theme-default';
        }
        if (this._$owner.isActive() && templateHighlightOnHover !== false) {
            classes += ' controls-GridView__item_active_theme-default';
        }
        if (this._$owner.isDragged()) {
            classes += ' controls-ListView__item_dragging_theme-default';
        }

        // prepareRowSeparatorClasses, rowSeparatorVisibility
        classes += ' controls-Grid__row-cell_withoutRowSeparator_theme-default';

        classes += ' ' + this._getCellPaddingClasses();

        // if checkBoxCell
        // if isSelected
        // if getLastColumnIndex

        return classes;
    }

    getCellStyles(): string {
        // There's a lot
        return undefined;
    }

    getTemplate(): TemplateFunction|string {
        return this._$column.template;
    }

    getDisplayProperty(): string {
        return this._$column.displayProperty;
    }

    getContents(): T {
        return this._$owner.getContents();
    }

    get contents(): T {
        return this._$owner.getContents();
    }

    getColumnIndex(): number {
        return this._$owner.getColumnIndex(this);
    }

    isFirstColumn(): boolean {
        return this.getColumnIndex() === 0;
    }

    isLastColumn(): boolean {
        return this.getColumnIndex() === this._$owner.getColumnsCount() - 1;
    }

    isMultiSelectColumn(): boolean {
        return this._$owner.getMultiSelectVisibility() !== 'hidden' && this.isFirstColumn();
    }

    shouldDisplayMarker(marker: boolean): boolean {
        return marker !== false && this._$owner.isMarked() && this.isFirstColumn();
    }

    getMarkerClasses(theme: string, style: string = 'default'): string {
        return `
            controls-ListView__itemV_marker controls-ListView__itemV_marker-${style}_theme-${theme}
            controls-GridView__itemV_marker controls-GridView__itemV_marker-${style}_theme-${theme}
        `;
    }

    nextVersion(): void {
        this._nextVersion();
    }

    protected _getWrapperSeparatorClasses(theme: string): string {
        let classes = '';

        if (true/*current.rowSeparatorSize === null*/) {

            // Вспомогательный класс, вешается на ячейку. Через него задаются правильные отступы ячейке
            // обеспечивает отсутствие "скачков" при динамической смене размера границы.
            classes += ' controls-Grid__row-cell_withRowSeparator_size-null';
            classes += ' controls-Grid__no-rowSeparator';
        }/* else {
            classLists.base += ` controls-Grid__row-cell_withRowSeparator_size-${current.rowSeparatorSize}_theme-${theme}`;
            classLists.base += ` controls-Grid__rowSeparator_size-${current.rowSeparatorSize}_theme-${theme}`;
        }*/

        /*if (current.columnIndex > current.hasMultiSelect ? 1 : 0) {
            const columnSeparatorSize = _private.getSeparatorForColumn(current.columns, current.columnIndex, current.columnSeparatorSize);

            if (columnSeparatorSize !== null) {
                classLists.base += ' controls-Grid__row-cell_withColumnSeparator';
                classLists.columnContent += ` controls-Grid__columnSeparator_size-${columnSeparatorSize}_theme-${theme}`;
            }
        }*/
        return classes;
    }

    protected _getContentPaddingClasses(theme: string): string {
        const topPadding = this._$owner.getTopPadding();
        const bottomPadding = this._$owner.getBottomPadding();
        const leftPadding = this._$owner.getLeftPadding();
        const rightPadding = this._$owner.getRightPadding();
        let classes = '';

        /*if (columns[columnIndex].isActionCell) {
            return classLists;
        }*/
        // TODO: удалить isBreadcrumbs после https://online.sbis.ru/opendoc.html?guid=b3647c3e-ac44-489c-958f-12fe6118892f
        /*if (params.isBreadCrumbs) {
            classLists.left += ` controls-Grid__cell_spacingFirstCol_null_theme-${theme}`;
        }*/

        // left <-> right
        const cellPadding = this._$column.cellPadding;

        if (!this.isFirstColumn()) {
            classes += ' controls-Grid__cell_spacingLeft';
            if (cellPadding?.left) {
                classes += `_${cellPadding.left}`;
            }
            classes += `_theme-${theme}`;
        } else {
            classes += ` controls-Grid__cell_spacingFirstCol_${leftPadding}_theme-${theme}`;
        }

        if (!this.isLastColumn()) {
            classes += ' controls-Grid__cell_spacingRight';
            if (cellPadding?.right) {
                classes += `_${cellPadding.right}`;
            }
            classes += `_theme-${theme}`;
        } else {
            classes += ` controls-Grid__cell_spacingLastCol_${rightPadding}_theme-${theme}`;
        }

        // top <-> bottom
        classes += ` controls-Grid__row-cell_rowSpacingTop_${topPadding}_theme-${theme}`;
        classes += ` controls-Grid__row-cell_rowSpacingBottom_${bottomPadding}_theme-${theme}`;

        return classes;
    }
}

Object.assign(GridColumn.prototype, {
    '[Controls/_display/GridColumn]': true,
    _moduleName: 'Controls/display:GridColumn',
    _instancePrefix: 'grid-column-',
    _$owner: null,
    _$column: null
});
