import GridColumn from './GridColumn';
import {OptionsToPropertyMixin} from 'Types/entity';
import GridGroupItem from './GridGroupItem';
import {IColumn} from 'Controls/_grid/interface/IColumn';

export interface IOptions<T> {
    owner: GridGroupItem<T>;
    column: IColumn;
    columns: IColumn[];
}

export default class GridGroupCell<T> extends GridColumn<T> {
    protected _$columns: IColumn[];

    constructor(options?: IOptions<T>) {
        super(options);
        OptionsToPropertyMixin.call(this, options);
    }

    getWrapperClasses(): string {
        return '';
    }

    getWrapperStyles(): string {
       return 'display: contents; ';
    }

    getContentClasses(): string {
        return '';
    }

    getContentStyles(): string {
        return 'display: contents;';
    }

    getGroupWrapperStyles() {
        const hasMultiselect = this._$owner.getMultiSelectVisibility() !== 'hidden';
        const ladderStickyColumn = this._$owner.getStickyColumn();
        const ladderColumnLength = ladderStickyColumn ? ladderStickyColumn.property.length : 0;
        const columnStart = hasMultiselect ? 1 : 0;
        const columnEnd = columnStart + this._$columns.length + ladderColumnLength;
        return `grid-column: ${columnStart + 1} / ${columnEnd + 1};`;
    }

    getGroupWrapperClasses(expanderVisible?: boolean, theme): string {
        const leftPadding = this._$owner.getLeftPadding().toLowerCase();
        const rightPadding = this._$owner.getRightPadding().toLowerCase();

        return 'controls-ListView__groupContent' +
               (expanderVisible === false ? ' controls-ListView__groupContent_cursor-default' : '') +
               ` controls-Grid__groupContent__spacingLeft_${leftPadding}_theme-${theme}` +
               ` controls-Grid__groupContent__spacingRight_${rightPadding}_theme-${theme}`;
    }

    getCaptionClasses(expanderAlign, expanderVisible: boolean, theme: string) {
        const expander = expanderAlign === 'right' ? 'right' : 'left';

        let classes = 'controls-ListView__groupContent-text ' +
                      `controls-ListView__groupContent-text_theme-${theme} ` +
                      `controls-ListView__groupContent-text_default_theme-${theme} `;

        if (expanderVisible !== false) {
            if (this.isExpanded()) {
                classes += ' controls-ListView__groupExpander_collapsed';
                classes += ` controls-ListView__groupExpander_collapsed_${expander}`;
            }

            classes += ` controls-ListView__groupExpander controls-ListView__groupExpander_theme-${theme}` +
                ` controls-ListView__groupExpander_${expander}_theme-${theme}` +
                ` controls-ListView__groupExpander-iconSize_default_theme-${theme}`;
        }

        return classes;
    }

    getCaption(): T {
        return this._$owner.getCaption();
    }

    isExpanded(): boolean {
        return this._$owner.isExpanded();
    }
}

Object.assign(GridGroupCell.prototype, {
    '[Controls/_display/GridGroupCell]': true,
    _moduleName: 'Controls/display:GridGroupCell',
    _instancePrefix: 'grid-group-cell-',
    _$owner: null,
    _$columns: null
});
