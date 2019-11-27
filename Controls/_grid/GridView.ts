import {TemplateFunction} from 'UI/Base';
import {ListView} from 'Controls/list';
import {IoC, detection} from 'Env/Env';
import * as GridLayoutUtil from 'Controls/_grid/utils/GridLayoutUtil';
import * as GridIsEqualUtil from 'Controls/_grid/utils/GridIsEqualUtil';
import {TouchContextField as isTouch} from 'Controls/context';
import tmplNotify = require('Controls/Utils/tmplNotify');
import {CssClassList} from '../Utils/CssClassList';

import * as GridViewTemplateChooser from 'wml!Controls/_grid/GridViewTemplateChooser';
import * as GridLayout from 'wml!Controls/_grid/layout/grid/GridView';
import * as TableLayout from 'wml!Controls/_grid/layout/table/GridView';

import * as GridHeader from 'wml!Controls/_grid/layout/grid/Header';
import * as TableHeader from 'wml!Controls/_grid/layout/table/Header';
import * as HeaderContentTpl from 'wml!Controls/_grid/layout/common/HeaderContent';

import * as GridResults from 'wml!Controls/_grid/layout/grid/Results';
import * as TableResults from 'wml!Controls/_grid/layout/table/Results';

import * as DefaultItemTpl from 'wml!Controls/_grid/ItemTemplateResolver';
import * as GridItemTemplate from 'wml!Controls/_grid/layout/grid/Item';
import * as TableItemTemplate from 'wml!Controls/_grid/layout/table/Item';

import * as ColumnTpl from 'wml!Controls/_grid/Column';
import * as GroupTemplate from 'wml!Controls/_grid/GroupTemplate';


let
    _private = {
        getGridTemplateColumns(columns: Array<{width?: string}>, hasMultiSelect: boolean): string {
            const columnsWidths = (hasMultiSelect ? ['max-content'] : []).concat(columns.map(((column) =>
                column.width || GridLayoutUtil.getDefaultColumnWidth()
            )));
            return GridLayoutUtil.getTemplateColumnsStyle(columnsWidths);
        },

        checkDeprecated(cfg) {
            if (cfg.stickyColumn !== undefined) {
                IoC.resolve('ILogger').warn('IGridControl', 'Option "stickyColumn" is deprecated and removed in 19.200. Use "stickyProperty" option in the column configuration when setting up the columns.');
            }
        },

        getQueryForHeaderCell(isSafari: boolean, cur, multiselectVisibility: number): string {
            return isSafari ?
                `div[style*="grid-column-start: ${cur.startColumn + multiselectVisibility}; grid-column-end: ${cur.endColumn + multiselectVisibility}; grid-row-start: ${cur.startRow}; grid-row-end: ${cur.endRow}"]` :
                `div[style*="grid-area: ${cur.startRow} / ${cur.startColumn + multiselectVisibility} / ${cur.endRow} / ${cur.endColumn + multiselectVisibility}"]`;
        },

        getHeaderCellOffset(header, cur) {
            const result = header.reduce((acc, el) => {
                if (el.endRow < cur.endRow && el.startColumn <= cur.startColumn && el.endColumn >= cur.endColumn) {
                    acc.push(el);
                }
                return acc;
            }, []);
            let upperCellsHeight = 0;
            if (result && !!result.length) {
                for (const el of result) {
                    upperCellsHeight += el.height;
                }
            }
            return upperCellsHeight;
        },

        prepareHeaderCells(header, container, multiselectVisibility) {
            return header.map((cur) => ({...cur, height: container.querySelector(
                    _private.getQueryForHeaderCell(detection.safari, cur, multiselectVisibility)
                ).offsetHeight}));
        },

        setBaseTemplates(self: GridView, isFullGridSupport: boolean): void {
            self._gridTemplate = isFullGridSupport ? GridLayout : TableLayout;
            self._baseHeaderTemplate = isFullGridSupport ? GridHeader : TableHeader;
            self._baseResultsTemplate = isFullGridSupport ? GridResults : TableResults;
        }
    },
    GridView = ListView.extend({

        /* Base templates */
        _template: GridViewTemplateChooser,
        _gridTemplate: null,
        _baseHeaderTemplate: null,
        _baseResultsTemplate: null,

        /* Custom templates */
        _resultsTemplate: null,

        _groupTemplate: GroupTemplate,
        _defaultItemTemplate: DefaultItemTpl,
        _headerContentTemplate: HeaderContentTpl,
        _isHeaderChanged: false,

        _isFullGridSupport: GridLayoutUtil.isFullGridSupport(),
        _notifyHandler: tmplNotify,

        _beforeMount(cfg) {
            _private.checkDeprecated(cfg);
            _private.setBaseTemplates(this, cfg, GridLayoutUtil.isFullGridSupport());
            const resultSuper = GridView.superclass._beforeMount.apply(this, arguments);
            this._listModel.setBaseItemTemplateResolver(this._resolveBaseItemTemplate.bind(this));
            this._listModel.setColumnTemplate(ColumnTpl);
            this._setResultsTemplate(cfg);
            this._listModel.headerInEmptyListVisible = cfg.headerInEmptyListVisible;
            return resultSuper;
        },

        _beforeUpdate(newCfg) {
            GridView.superclass._beforeUpdate.apply(this, arguments);
            if (this._options.resultsPosition !== newCfg.resultsPosition) {
                if (this._listModel) {
                    this._listModel.setResultsPosition(newCfg.resultsPosition);
                }
            }
            if (this._options.theme !== newCfg.theme) {
                this._listModel.setTheme(newCfg.theme);
            }
            // todo removed by task https://online.sbis.ru/opendoc.html?guid=728d200e-ff93-4701-832c-93aad5600ced
            if (!GridIsEqualUtil.isEqualWithSkip(this._options.columns, newCfg.columns, { template: true, resultTemplate: true })) {
                this._listModel.setColumns(newCfg.columns);
            }
            if (!GridIsEqualUtil.isEqualWithSkip(this._options.header, newCfg.header, { template: true })) {
                this._isHeaderChanged = true;
                this._listModel.setHeader(newCfg.header);
            }
            if (this._options.stickyColumn !== newCfg.stickyColumn) {
                this._listModel.setStickyColumn(newCfg.stickyColumn);
            }
            if (this._options.ladderProperties !== newCfg.ladderProperties) {
                this._listModel.setLadderProperties(newCfg.ladderProperties);
            }
            if (this._options.rowSeparatorVisibility !== newCfg.rowSeparatorVisibility) {
                this._listModel.setRowSeparatorVisibility(newCfg.rowSeparatorVisibility);
            }
            if (this._options.stickyColumnsCount !== newCfg.stickyColumnsCount) {
                this._listModel.setStickyColumnsCount(newCfg.stickyColumnsCount);
            }
            if (this._options.resultsTemplate !== newCfg.resultsTemplate) {
                this._resultsTemplate = newCfg.resultsTemplate || this._baseResultsTemplate;
            }
            if (this._options.header && this._options.items === null && newCfg.items) {
               this._isHeaderChanged = true;
            }
        },

        _calcFooterPaddingClass(): string {
            let leftPadding;
            if (this._options.multiSelectVisibility !== 'hidden') {
                leftPadding = 'withCheckboxes';
            } else {
                leftPadding = (this._options.itemPadding && this._options.itemPadding.left || 'default').toLowerCase();
            }

            return CssClassList
                .add('controls-GridView__footer')
                .add(`controls-GridView__footer__paddingLeft_${leftPadding}_theme-${this._options.theme}`)
                .compile();
        },

        _beforePaint(): void {
            if (this._isStickyMultiHeader() && this._isHeaderChanged && this._listModel.isDrawHeaderWithEmptyList()) {
                const newHeader = this._setHeaderWithHeight();
                this._listModel.setHeaderCellMinHeight(newHeader);
                this._isHeaderChanged = false;
            }
        },

        _isStickyMultiHeader(): boolean {
            return this._options.header && this._listModel._isMultiHeader && this._listModel.isStickyHeader();
        },

        _setHeaderWithHeight() {
            // TODO Сейчас stickyHeader не умеет работать с многоуровневыми Grid-заголовками, это единственный вариант их фиксировать
            // поправим по задаче: https://online.sbis.ru/opendoc.html?guid=2737fd43-556c-4e7a-b046-41ad0eccd211

            // TODO: Такое получение контейнера до исправления этой ошибки https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            const container = this._container.length !== undefined ? this._container[0] : this._container;
            const hasMultiSelect = this._options.multiSelectVisibility !== 'hidden' ? 1 : 0;
            const cellsArray = _private.prepareHeaderCells(this._options.header, container, hasMultiSelect);
            const newColumns = cellsArray.map((cur) => {
                    const upperCellsOffset = _private.getHeaderCellOffset(cellsArray, cur);
                    return {
                        ...cur,
                        offsetTop: upperCellsOffset
                    };
            });
            return [newColumns, 0];
        },

        resizeNotifyOnListChanged(): void {
            GridView.superclass.resizeNotifyOnListChanged.apply(this, arguments);
            if (this._children.columnScroll) {
                this._children.columnScroll._resizeHandler();

                // TODO: KINGO
                // перерисовка тени после обновления размеров в columnScroll происходит уже в следующую отрисовку.
                // из-за этого, между обновлениями, тень от скролла рисуется поверх колонок.
                // Чтобы тень заняла акуальную позицию раньше, нужно вручную установить стиль элементу
                this._children.columnScroll.updateShadowStyle();
            }
        },

        _afterMount(): void {
            GridView.superclass._afterMount.apply(this, arguments);
            if (this._isStickyMultiHeader() && this._listModel.isDrawHeaderWithEmptyList()) {
                this._listModel.setHeaderCellMinHeight(this._setHeaderWithHeight());
            }
        },

        _resolveItemTemplate(options): TemplateFunction {
            return options.itemTemplate || this._resolveBaseItemTemplate();
        },

        _resolveBaseItemTemplate(): TemplateFunction {
            return GridLayoutUtil.isFullGridSupport() ? GridItemTemplate : TableItemTemplate;
        },

        _getGridViewClasses(): string {
            const classes = new CssClassList();
            classes
                .add('controls-Grid')
                .add(`controls-Grid_${this._options.style}_theme-${this._options.theme}`);

            if (!GridLayoutUtil.isFullGridSupport()) {
                classes
                    .add('controls-Grid_table-layout')
                    .add('controls-Grid_table-layout_fixed', this._listModel.isFixedLayout())
                    .add('controls-Grid_table-layout_auto', !this._listModel.isFixedLayout())
                    .add(this._listModel.isFixedLayout());
            }
            return classes.compile();
        },

        _getGridViewStyles(): string {
            let styles = '';
            if (GridLayoutUtil.isFullGridSupport()) {
                const hasMultiSelect = this._options.multiSelectVisibility !== 'hidden';
                styles += _private.getGridTemplateColumns(this._options.columns, hasMultiSelect);
            }
            return styles;
        },

        _setResultsTemplate(options): void {
            if (options.results && options.results.template) {
                this._resultsTemplate = options.results.template;
            } else {
                this._resultsTemplate =  options.resultsTemplate || this._baseResultsTemplate;
            }
        },

        _onEditArrowClick(e, item): void {
            this._notify('editArrowClick', [item]);

            // we do not need to fire itemClick on clicking on editArrow
            e.stopPropagation();
        }
    });

GridView._private = _private;
GridView.contextTypes = () => {
    return {
        isTouch
    };
};

GridView._theme = ['Controls/grid'];

export = GridView;
