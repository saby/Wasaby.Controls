import {OptionsToPropertyMixin} from 'Types/entity';
import {mixin} from 'Types/util';

import {IColspanParams, IColumn} from 'Controls/_grid/interface/IColumn';
import {default as GridGroupCellMixin} from 'Controls/_gridNew/display/mixins/GroupCell';

import Cell from './Cell';
import GroupItem from './GroupItem';

export interface IOptions<T> {
    owner: GroupItem<T>;
    column: IColumn;
    columns: IColumn[];
}

const DEFAULT_GROUP_CONTENT_TEMPLATE = 'Controls/gridNew:GroupTemplate';

export default class GroupCell<T>
    extends mixin<Cell<any, GroupItem<any>>, GridGroupCellMixin<any>>(Cell, GridGroupCellMixin) {
    protected _$columns: IColumn[];

    constructor(options?: IOptions<T>) {
        super(options);
        OptionsToPropertyMixin.call(this, options);
    }

    getWrapperClasses(): string {
        return '';
    }

    getWrapperStyles(): string {
        return this.getColspan();
    }

    getContentClasses(): string {
        return '';
    }

    getContentStyles(): string {
        return 'display: contents;';
    }

    // region Аспект "Объединение колонок"
    _getColspanParams(): IColspanParams {
        const hasMultiSelect = this._$owner.hasMultiSelectColumn();
        const ladderStickyColumn = this._$owner.getStickyColumn();
        const ladderColumnLength = ladderStickyColumn ? ladderStickyColumn.property.length : 0;
        const startColumn = hasMultiSelect ? 2 : 1;
        const endColumn = startColumn + this.getOwner().getColumnsConfig().length + ladderColumnLength;
        return {
            startColumn,
            endColumn
        };
    }

    // endregion

    // region Аспект "Ячейка группы"

    getRightTemplateClasses(separatorVisibility: boolean,
                            textVisible: boolean,
                            columnAlignGroup: number,
                            textAlign: string,
                            theme: string): string {
        let classes = `controls-ListView__groupContent-rightTemplate_theme-${theme}`;
        const groupPaddingClasses = this._$owner.getGroupPaddingClasses(theme, 'right');

        if (!this._shouldFixGroupOnColumn(columnAlignGroup, textVisible)) {
            classes += ' ' + groupPaddingClasses;
        }

        // should add space before rightTemplate
        if (separatorVisibility === false && (textVisible === false ||
            (columnAlignGroup === undefined && textAlign !== 'right'))) {
            classes += ' controls-ListView__groupContent-withoutGroupSeparator';
        }

        return classes;
    }

    // endregion Aspect GridGroupCellMixin

    getCaption(): T {
        return this._$owner.getCaption();
    }

    isExpanded(): boolean {
        return this._$owner.isExpanded();
    }

    getTemplate(multiSelectTemplate?: TemplateFunction): TemplateFunction|string {
        return this._groupTemplate || DEFAULT_GROUP_CONTENT_TEMPLATE;
    }

    protected _shouldFixGroupOnColumn(columnAlignGroup: number, textVisible: boolean): boolean {
        return textVisible !== false &&
            columnAlignGroup !== undefined &&
            columnAlignGroup < this._$columns.length - (this._$owner.hasMultiSelectColumn() ? 1 : 0);
    }
}

Object.assign(GroupCell.prototype, {
    '[Controls/_display/grid/GroupCell]': true,
    _moduleName: 'Controls/gridNew:GridGroupCell',
    _instancePrefix: 'grid-group-cell-',
    _$owner: null,
    _$columns: null
});
