import cDeferred = require('Core/Deferred');
import {ListView, GridLayoutUtil} from 'Controls/list';
import GridViewTemplateChooser = require('wml!Controls/_grid/GridViewTemplateChooser');
import DefaultItemTpl = require('wml!Controls/_grid/Item');
import ColumnTpl = require('wml!Controls/_grid/Column');
import HeaderContentTpl = require('wml!Controls/_grid/HeaderContent');
import Env = require('Env/Env');
import GroupTemplate = require('wml!Controls/_grid/GroupTemplate');
import FullGridSupportLayout = require('wml!Controls/_grid/layouts/FullGridSupport');
import PartialGridSupportLayout = require('wml!Controls/_grid/layouts/partialGridSupport/PartialGridSupport');
import NoGridSupportLayout = require('wml!Controls/_grid/layouts/NoGridSupport');
import 'wml!Controls/_grid/Header';
import DefaultResultsTemplate = require('wml!Controls/_grid/Results');
import 'wml!Controls/_grid/Results';
import 'wml!Controls/_grid/ColGroup';
import 'css!theme?Controls/grid';
import {ScrollEmitter} from 'Controls/list';
import GridIsEqualUtil = require('Controls/_grid/utils/GridIsEqualUtil');
import {TouchContextField as isTouch} from "Controls/context";

var
    _private = {
        checkDeprecated: function(cfg) {
            // TODO: https://online.sbis.ru/opendoc.html?guid=837b45bc-b1f0-4bd2-96de-faedf56bc2f6
            if (cfg.showRowSeparator !== undefined) {
                Env.IoC.resolve('ILogger').warn('IGridControl', 'Option "showRowSeparator" is deprecated and removed in 19.200. Use option "rowSeparatorVisibility".');
            }
            if (cfg.stickyColumn !== undefined) {
                Env.IoC.resolve('ILogger').warn('IGridControl', 'Option "stickyColumn" is deprecated and removed in 19.200. Use "stickyProperty" option in the column configuration when setting up the columns.');
            }
        },

        getGridTemplateColumns: function(columns, hasMultiselect: boolean): string {
            let columnsWidths: Array<string> = (hasMultiselect ? ['max-content'] : []).concat(columns.map((column => column.width || '1fr')));
            return GridLayoutUtil.getTemplateColumnsStyle(columnsWidths);
        },

        prepareHeaderAndResultsIfFullGridSupport: function(resultsPosition, header, container) {
            var
                resultsPadding,
                cells;

            //FIXME remove container[0] after fix https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            container = container[0] || container;
            if (resultsPosition) {
                if (resultsPosition === 'top') {
                    if (header) {
                        resultsPadding = container.getElementsByClassName('controls-Grid__header-cell')[0].getBoundingClientRect().height + 'px';
                    } else {
                        resultsPadding = '0';
                    }
                } else {
                    resultsPadding = 'calc(100% - ' + container.getElementsByClassName('controls-Grid__results-cell')[0].getBoundingClientRect().height + 'px)';
                }
                cells = container.getElementsByClassName('controls-Grid__results-cell');
                Array.prototype.forEach.call(cells, function(elem) {
                    elem.style.top = resultsPadding;
                });
            }
        },

        calcFooterPaddingClass: function(params) {
            var
                paddingLeft,
                result = 'controls-GridView__footer controls-GridView__footer__paddingLeft_';
            if (params.multiSelectVisibility === 'onhover' || params.multiSelectVisibility === 'visible') {
                result += 'withCheckboxes';
            } else {
                if (params.itemPadding) {
                    paddingLeft = params.itemPadding.left;
                } else {
                    paddingLeft = params.leftSpacing || params.leftPadding;
                }
                result += (paddingLeft || 'default').toLowerCase();
            }
            return result;
        },

        chooseGridTemplate: function (): Function {
            if (GridLayoutUtil.isFullGridSupport()) {
                return FullGridSupportLayout;
            }
            if (GridLayoutUtil.isPartialGridSupport()) {
                return PartialGridSupportLayout;
            }
            return NoGridSupportLayout;
        },

        /*
        * When using a custom template, the scope of the base template becomes the same as the scope of custom template.
        * Because of this, the base handlers are lost. To fix this, need to remember the handlers where the scope is
        * still right and set them. But current event system prevent do this, because it looks for given event handler
        * only on closest control (which can be Browser, Explorer or smth else because of template scope).
        * Therefore it is required to create Cell as control with and subscribe on events in it.
        * https://online.sbis.ru/opendoc.html?guid=9d0f8d1a-576d-471d-bf02-991cd02f92e4
        */
        registerHandlersForPartialSupport: function (self, listModel) {
            listModel.setHandlersForPartialSupport({
                'mouseenter': self._onItemMouseEnter.bind(self),
                'mousemove': self._onItemMouseMove.bind(self),
                'mouseleave': self._onItemMouseLeave.bind(self),
                'mousedown': self._onItemMouseDown.bind(self),
                'click': self._onItemClick.bind(self),
                'contextmenu': self._onItemContextMenu.bind(self),
                'wheel': self._onItemWheel.bind(self),
                'swipe': self._onItemSwipe.bind(self)
            });
        },

        fillItemsContainerForPartialSupport: function (self): void {
            let
                multiselectOffset = self._options.multiSelectVisibility === 'hidden'?0:1,
                columns = self._listModel.getColumns(),
                itemsContainer = self._itemsContainerForPartialSupport,
                columnslength = columns.length + multiselectOffset,
                cellsHTML = (self._container[0] || self._container).getElementsByClassName('controls-Grid__row-cell'),
                items = [];


            for (let i = 0; i<cellsHTML.length;i+=columnslength) {
                items.push(cellsHTML[i]);
            }

            itemsContainer.children = items;
        },

        getColumnsWidthForEditingRow: function (self, itemData): Array<string> {
            let
                container = (self._container[0] || self._container),
                hasHeader = !!self._listModel.getHeader(),
                hasItems = self._listModel.getCount(),
                hasMultiselect = self._options.multiSelectVisibility !== 'hidden',
                cells,
                columnsWidths = [];

            if (!hasItems && !hasHeader) {
                return self._options.columns.map((column) => column.width || '1fr');
            }

            if (hasHeader) {
                cells = container.getElementsByClassName('controls-Grid__header-cell');
            } else {
                cells = _private.getNoColspanRowCells(self, container, self._options.columns, hasMultiselect);
                if (cells.length === 0) {
                    // If we were unable to find a row with no colspan cells, fallback to the previous
                    // getElementsByClassName solution
                    cells = container.getElementsByClassName('controls-Grid__row-cell');
                }
            }

            self._options.columns.forEach((column, index: number) => {
                const realIndex = index + (hasMultiselect ? 1 : 0);
                const isDynamicWidth = !GridLayoutUtil.isCompatibleWidth(column.width);
                const cWidth = isDynamicWidth ? (cells[realIndex].getBoundingClientRect().width + 'px') : (column.width || '1fr');

                columnsWidths.push(cWidth);
            });

            return columnsWidths;
        },

        // TODO Kingo
        // В IE для колонок строки редактирования в гриде нужно установить фиксированную ширину,
        // чтобы она отображалась правильно. Для этого мы измеряем текущую ширину колонок в другой
        // строке грида.
        // Но первую попавшуюся строку взять нельзя - в ней могут быть колонки с colspan'ом, тогда
        // их ширина будет отличаться, ее использовать нельзя.
        // getNoColspanRowCells ищет в гриде строку, в которой нет колонок с colspan'ом, и возвращает
        // ее колонки.
        getNoColspanRowCells: function(self, container, columnsCfg, hasMultiselect) {
            const totalColumns = columnsCfg.length + (hasMultiselect ? 1 : 0);
            let currentRow = 0;
            let cells = [];

            // Из columnsCfg мы знаем, сколько колонок на самом деле в гриде (+1 если есть столбец
            // множественного выбора). Перебираем все строки грида, пока не найдем ту, в которой
            // будет нужное число колонок. Если их меньше нужного, значит какая-то из них имеет colspan,
            // такую строку пропускаем.
            // Если в какой-то строке получили 0 колонок, значит дошли до конца грида.
            do {
                cells = container.querySelectorAll(`.controls-Grid__row-cell[data-r="${currentRow}"]`);
                ++currentRow;
            } while (cells.length > 0 && cells.length < totalColumns);

            return cells;
        }
    },
    GridView = ListView.extend({
        _gridTemplate: null,
        _resultsTemplate: null,
        isNotFullGridSupport: Env.detection.isNotFullGridSupport,
        _template: GridViewTemplateChooser,
        _groupTemplate: GroupTemplate,
        _defaultItemTemplate: DefaultItemTpl,
        _headerContentTemplate: HeaderContentTpl,
        _getGridTemplateColumns: _private.getGridTemplateColumns,
        _itemsContainerForPartialSupport: null,
        _isHeaderChanged: false,

        _beforeMount: function(cfg) {
            _private.checkDeprecated(cfg);
            this._gridTemplate = _private.chooseGridTemplate();
            GridView.superclass._beforeMount.apply(this, arguments);
            _private.registerHandlersForPartialSupport(this, this._listModel);
            this._listModel.setColumnTemplate(ColumnTpl);
            if (GridLayoutUtil.isPartialGridSupport()) {
                this._listModel.getColumnsWidthForEditingRow = this._getColumnsWidthForEditingRow.bind(this);
                this._itemsContainerForPartialSupport = {
                    children: null
                };
            }
            this._resultsTemplate = cfg.results && cfg.results.template ? cfg.results.template : (cfg.resultsTemplate || DefaultResultsTemplate);
            this._listModel.headerInEmptyListVisible = cfg.headerInEmptyListVisible;
        },


        _beforeUpdate: function(newCfg) {
            GridView.superclass._beforeUpdate.apply(this, arguments);
            if (this._options.resultsPosition !== newCfg.resultsPosition) {
                if (this._listModel) {
                    this._listModel.setResultsPosition(newCfg.resultsPosition);
                }
            }

            // todo removed by task https://online.sbis.ru/opendoc.html?guid=728d200e-ff93-4701-832c-93aad5600ced
            if (!GridIsEqualUtil.isEqualWithSkip(this._options.columns, newCfg.columns, { template: true, resultTemplate: true })) {
                this._listModel.setColumns(newCfg.columns);
                if (!Env.detection.isNotFullGridSupport) {
                    _private.prepareHeaderAndResultsIfFullGridSupport(this._listModel.getResultsPosition(), this._listModel.getHeader(), this._container);
                }
            }
            if (!GridIsEqualUtil.isEqualWithSkip(this._options.header, newCfg.header, { template: true })) {
                this._isHeaderChanged = true;
                this._listModel.setHeader(newCfg.header);
                if (!Env.detection.isNotFullGridSupport) {
                    _private.prepareHeaderAndResultsIfFullGridSupport(this._listModel.getResultsPosition(), this._listModel.getHeader(), this._container);
                }
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
            if (this._options.showRowSeparator !== newCfg.showRowSeparator) {
                this._listModel.setShowRowSeparator(newCfg.showRowSeparator);
            }
            if (this._options.stickyColumnsCount !== newCfg.stickyColumnsCount) {
                this._listModel.setStickyColumnsCount(newCfg.stickyColumnsCount);
            }
            if (this._options.resultsTemplate !== newCfg.resultsTemplate) {
                this._resultsTemplate = newCfg.resultsTemplate || DefaultResultsTemplate;
            }
        },

        _afterUpdate() {
            if (this._options.columnScroll) {
                this._listModel.setContainerWidth(this._children.columnScroll.getContentContainerSize());
            }
        },

        _afterRender() {
            if (GridLayoutUtil.isPartialGridSupport()) {
                // TODO Kingo
                // Для IE нужно обновить itemsContainer здесь, потому что виртуальный
                // скролл вычисляет высоту строк сразу после _afterRender
                _private.fillItemsContainerForPartialSupport(this);
            }
            GridView.superclass._afterRender.apply(this, arguments);
        },

        _onItemMouseEnter: function (event, itemData) {
            // In partial grid supporting browsers hovered item calculates in code
            if (!this._context.isTouch.isTouch && GridLayoutUtil.isPartialGridSupport() &&
                (itemData.item !== this._listModel.getHoveredItem())) {
                this._listModel.setHoveredItem(itemData.item);
            }
            GridView.superclass._onItemMouseEnter.apply(this, arguments);
        },

        _onItemMouseLeave: function (event, itemData) {
            // In partial grid supporting browsers hovered item calculates in code
            if (!this._context.isTouch.isTouch && GridLayoutUtil.isPartialGridSupport()) {
                this._listModel.setHoveredItem(null);
            }
            GridView.superclass._onItemMouseLeave.apply(this, arguments);
        },

        _calcFooterPaddingClass: function(params) {
            return _private.calcFooterPaddingClass(params);
        },

        getItemsContainer: function () {
            if (GridLayoutUtil.isPartialGridSupport()) {
                _private.fillItemsContainerForPartialSupport(this);
                return this._itemsContainerForPartialSupport;
            } else {
                return GridView.superclass.getItemsContainer.apply(this, arguments);
            }
        },

        _beforePaint: function() {
            if (this._options.header && this._listModel._isMultyHeader && this._listModel.isStickyHeader() && this._isHeaderChanged && this._listModel.isDrawHeaderWithEmtyList()) {
                const newHeader = this._setHeaderWithHeight();
                this._listModel.setHeaderCellMinHeight(newHeader);
                this._isHeaderChanged = false;
            }
        },
        _setHeaderWithHeight: function() {
            // todo Сейчас stickyHeader не умеет работать с многоуровневыми Grid-заголовками, это единственный вариант их фиксировать
            // поправим по задаче: https://online.sbis.ru/opendoc.html?guid=2737fd43-556c-4e7a-b046-41ad0eccd211
            let resultOffset = 0;
            let resultsHeaderCells;
            const resultPosition = this._listModel.getResultsPosition();
            // toDO Такое получение контейнера до исправления этой ошибки https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            const container = this._container.length !== undefined ? this._container[0] : this._container;
            const stickyHeaderCells = container.getElementsByClassName('controls-Grid__header')[0].childNodes;
            if (resultPosition === 'top') {
                resultsHeaderCells = container.getElementsByClassName('controls-Grid__results')[0].childNodes;
            }
            const multyselectVisibility = this._options.multiSelectVisibility !== 'hidden' ? 1 : 0;
            const newColumns = this._options.header.map((cur, i) => {
                if (cur.startRow && cur.endRow) {
                    const curEl = container.querySelector(
                    `div[style*="grid-area: ${cur.startRow} / ${cur.startColumn + multyselectVisibility} / ${cur.endRow} / ${cur.endColumn + multyselectVisibility}"]`
                    )
                    const height = curEl.offsetHeight;
                    const offset = Math.abs(curEl.offsetTop - container.offsetTop);
                    return {
                        ...cur,
                        offsetTop: offset,
                        height
                    };
                }
                const curElHeight = stickyHeaderCells[i].offsetHeight
                if (curElHeight > resultOffset) {
                    resultOffset = curElHeight;
                }
                return {
                    ...cur,
                    offset: 0
                };
            });
            if (resultOffset === 0 && resultPosition === 'top') {
                resultOffset = resultsHeaderCells[0].offsetTop;
            }
            return [newColumns, resultOffset];
        },
        resizeNotifyOnListChanged: function(){
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
        _afterMount: function() {
            GridView.superclass._afterMount.apply(this, arguments);
            if (this._options.header && this._listModel._isMultyHeader && this._listModel.isStickyHeader() && this._listModel.isDrawHeaderWithEmtyList()) {
                this._listModel.setHeaderCellMinHeight(this._setHeaderWithHeight());
            }
            if (!Env.detection.isNotFullGridSupport) {
                _private.prepareHeaderAndResultsIfFullGridSupport(this._listModel.getResultsPosition(), this._listModel.getHeader(), this._container);
            }
            if (this._options.columnScroll) {
                this._listModel.setContainerWidth(this._children.columnScroll.getContentContainerSize());
            }
        },

        _getColumnsWidthForEditingRow: function (itemData) {
            return _private.getColumnsWidthForEditingRow(this, itemData);
        }
    });

GridView._private = _private;
GridView.contextTypes = () => {
    return {
        isTouch
    };
};


export = GridView;
