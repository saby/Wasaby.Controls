import {ListView, CssClassList} from 'Controls/list';
import {TemplateFunction} from 'UI/Base';
import {TouchContextField as isTouch} from 'Controls/context';
import {Logger} from 'UI/Utils';
import * as GridLayoutUtil from 'Controls/_grid/utils/GridLayoutUtil';
import * as Template from 'wml!Controls/_grid/Render/grid/GridView';
import * as Item from 'wml!Controls/_grid/Render/grid/Item';

// todo События не работают
// todo Базовые стили строк/ячеек - отступы и т.п.
// todo События не работают

const _private = {
    getGridTemplateColumns(self, columns: Array<{width?: string}>, hasMultiSelect: boolean): string {
        if (!columns) {
            Logger.warn('You must set "columns" option to make grid work correctly!', self);
            return '';
        }
        const initialWidths = columns.map(((column) => column.width || GridLayoutUtil.getDefaultColumnWidth()));
        let columnsWidths: string[] = [];
        /*const stickyCellsCount = stickyLadderCellsCount(columns, self._options.stickyColumn, self._options.listModel.getDragItemData());
        if (stickyCellsCount === 1) {
            columnsWidths = ['0px'].concat(initialWidths);
        } else if (stickyCellsCount === 2) {
            columnsWidths = ['0px', initialWidths[0], '0px'].concat(initialWidths.slice(1))
        } else {*/
            columnsWidths = initialWidths;
        /*}*/
        /*if (shouldAddActionsCell({
            hasColumnScroll: !!self._options.columnScroll,
            isFullGridSupport: GridLayoutUtil.isFullGridSupport(),
            hasColumns: !!columns.length,
            itemActionsPosition: self._options.itemActionsPosition
        })) {
            columnsWidths = columnsWidths.concat(['0px']);
        }*/
        if (hasMultiSelect) {
            columnsWidths = ['max-content'].concat(columnsWidths);
        }
        return GridLayoutUtil.getTemplateColumnsStyle(columnsWidths);
    }
};

const GridView = ListView.extend({
    _template: Template,

    _beforeMount(options): void {
        GridView.superclass._beforeMount.apply(this, arguments);

        /*const layout = GridLayoutUtil.isFullGridSupport() ? 'grid' : 'table';
        this._template = await import(`wml!Controls/_grid/Render/${layout}/GridView`);
        if (options.itemTemplate) {
            this._itemTemplate = options.itemTemplate;
        } else {
            this._itemTemplate = await import(`wml!Controls/_grid/Render/${layout}/Item`);
        }*/
    },

    _resolveItemTemplate(options): TemplateFunction {
        return options.itemTemplate || this._resolveBaseItemTemplate();
    },

    _resolveBaseItemTemplate(): TemplateFunction {
        return Item;
    },

    _getGridViewClasses(): string {
        const classes = new CssClassList();
        classes
            .add('controls-Grid')
            .add(`controls-Grid_${this._options.style}_theme-${this._options.theme}`);

        /*if (!GridLayoutUtil.isFullGridSupport()) {
            const isFixedLayout = this._listModel.isFixedLayout();
            classes
                .add('controls-Grid_table-layout')
                .add('controls-Grid_table-layout_fixed', isFixedLayout)
                .add('controls-Grid_table-layout_auto', !isFixedLayout);
        }*/
        /*if (this._listModel.getDragItemData()) {
            classes.add('controls-Grid_dragging_process');
        }*/
        /*if (this._options.columnScroll) {
            classes.add(COLUMN_SCROLL_JS_SELECTORS.CONTENT);
            classes.add(DRAG_SCROLL_JS_SELECTORS.CONTENT, this._isDragScrollingVisible(options));
        }*/
        /*if (this._listModel.isSupportLadder(this._options.ladderProperties)) {
            classes.add('controls-Grid_support-ladder')
        }*/
        return classes.compile();
    },

    _getGridViewStyles(): string {
        let styles = '';
        if (GridLayoutUtil.isFullGridSupport()) {
            const hasMultiSelect = this._options.multiSelectVisibility !== 'hidden';
            styles += _private.getGridTemplateColumns(this, this._options.columns, hasMultiSelect);
        }
        return styles;
    }
});

GridView._private = _private;

GridView._theme = ['Controls/grid', 'Controls/Classes'];

GridView.contextTypes = () => {
    return {
        isTouch
    };
};

export = GridView;
