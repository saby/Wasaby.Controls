import cDeferred = require('Core/Deferred');
import {ListView, GridLayoutUtil} from 'Controls/list';
import GridViewTemplateChooser = require('wml!Controls/_grids/GridViewTemplateChooser');
import DefaultItemTpl = require('wml!Controls/_grids/Item');
import ColumnTpl = require('wml!Controls/_grids/Column');
import HeaderContentTpl = require('wml!Controls/_grids/HeaderContent');
import Env = require('Env/Env');
import GroupTemplate = require('wml!Controls/_grids/GroupTemplate');
import FullGridSupportLayout = require('wml!Controls/_grids/layouts/FullGridSupport');
import PartialGridSupportLayout = require('wml!Controls/_grids/layouts/PartialGridSupport');
import NoGridSupportLayout = require('wml!Controls/_grids/layouts/NoGridSupport');
import 'wml!Controls/_grids/Header';
import DefaultResultsTemplate = require('wml!Controls/_grids/Results');
import 'wml!Controls/_grids/Results';
import 'wml!Controls/_grids/ColGroup';
import 'css!theme?Controls/_grids/Grid';
import 'css!theme?Controls/_grids/OldGrid';
import 'Controls/List/BaseControl/Scroll/Emitter';

// todo: removed by task https://online.sbis.ru/opendoc.html?guid=728d200e-ff93-4701-832c-93aad5600ced
function isEqualWithSkip(obj1, obj2, skipFields) {
    if ((!obj1 && obj2) || (obj1 && !obj2)) {
        return false;
    }
    if (!obj1 && !obj2) {
        return true;
    }
    if (obj1.length !== obj2.length) {
        return false;
    }
    for (var i = 0; i < obj1.length; i++) {
        for (var j in obj1[i]) {
            if (!skipFields[j] && obj1[i].hasOwnProperty(j)) {
                if (!obj2[i].hasOwnProperty(j) || obj1[i][j] !== obj2[i][j]) {
                    return false;
                }
            }
        }
    }
    return true;
}

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
        getGridTemplateColumns: function(columns, multiselect): string {
            let columnsWidths: Array<string> = [];

            if (multiselect === 'visible' || multiselect === 'onhover') {
                columnsWidths.push('auto');
            }
            columns.forEach(function(column) {
                columnsWidths.push(column.width || '1fr');
            });

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
            switch (GridLayoutUtil.supportStatus) {
                case GridLayoutUtil.SupportStatusesEnum.Full:
                    return FullGridSupportLayout;
                case GridLayoutUtil.SupportStatusesEnum.Partial:
                    return PartialGridSupportLayout;
                case GridLayoutUtil.SupportStatusesEnum.None:
                    return NoGridSupportLayout;
            }
        },

        // For partial grid support.
        // Need to remember true width of columns for right alignment editing row.
        // Editing row is subgrid and need to set width of its columns in px.
        setCurrentColumnsWidth: function (self, container: HTMLElement) {
            //FIXME remove container[0] after fix https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            let cells = (container[0] || container).getElementsByClassName('controls-Grid__row-cell');
            if (cells.length > 0) {
                self._listModel.setCurrentColumnsWidth(cells);
            }
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

        _beforeMount: function(cfg) {
            _private.checkDeprecated(cfg);
            this._gridTemplate = _private.chooseGridTemplate();
            GridView.superclass._beforeMount.apply(this, arguments);
            this._listModel.setColumnTemplate(ColumnTpl);
            this._resultsTemplate = cfg.results && cfg.results.template ? cfg.results.template : (cfg.resultsTemplate || DefaultResultsTemplate);
        },

        _beforeUpdate: function(newCfg) {
            GridView.superclass._beforeUpdate.apply(this, arguments);

            // todo removed by task https://online.sbis.ru/opendoc.html?guid=728d200e-ff93-4701-832c-93aad5600ced
            if (!isEqualWithSkip(this._options.columns, newCfg.columns, { template: true, resultTemplate: true })) {
                this._listModel.setColumns(newCfg.columns);
                if (!Env.detection.isNotFullGridSupport) {
                    _private.prepareHeaderAndResultsIfFullGridSupport(this._listModel.getResultsPosition(), this._listModel.getHeader(), this._container);
                } else {
                    _private.setCurrentColumnsWidth(this, this._container);
                }
            }
            if (!isEqualWithSkip(this._options.header, newCfg.header, { template: true })) {
                this._listModel.setHeader(newCfg.header);
                if (!Env.detection.isNotFullGridSupport) {
                    _private.prepareHeaderAndResultsIfFullGridSupport(this._listModel.getResultsPosition(), this._listModel.getHeader(), this._container);
                } else {
                    _private.setCurrentColumnsWidth(this, this._container);
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
            if (this._options.resultsTemplate !== newCfg.resultsTemplate) {
                this._resultsTemplate = newCfg.resultsTemplate || DefaultResultsTemplate;
            }
        },

        _onItemMouseEnter: function (event, itemData) {
            // In partial grid supporting browsers hovered item calculates in code
            if (GridLayoutUtil.isPartialSupport && itemData.item !== this._hoveredItem) {
                this._listModel.setHoveredItem(itemData.item);
            }
            GridView.superclass._onItemMouseEnter.apply(this, arguments);
        },

        _calcFooterPaddingClass: function(params) {
            return _private.calcFooterPaddingClass(params);
        },

        _afterMount: function() {
            GridView.superclass._afterMount.apply(this, arguments);
            if (!Env.detection.isNotFullGridSupport) {
                _private.prepareHeaderAndResultsIfFullGridSupport(this._listModel.getResultsPosition(), this._listModel.getHeader(), this._container);
            } else {
                _private.setCurrentColumnsWidth(this, this._container);
            }
        }
    });

GridView._private = _private;

export = GridView;
