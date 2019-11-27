/**
 * Библиотека контролов, которые реализуют плоский список, отображающийся в виде таблицы.
 * Работа с шаблонами библиотеки описана в руководстве разработчика:
 * <ul>
 *    <li><a href="/doc/platform/developmentapl/interface-development/controls/list/grid/templates/result/">ResultsTemplate (шаблон итогов)</a></li>
 *    <li><a href="/doc/platform/developmentapl/interface-development/controls/list/grid/templates/grouping/">GroupTemplate (шаблон группировки)</a></li>
 *    <li><a href="/doc/platform/developmentapl/interface-development/controls/list/grid/templates/column/">ColumnTemplate (шаблон отображения ячейки)</a></li>
 *    <li><a href="/doc/platform/developmentapl/interface-development/controls/list/grid/edit/">RowEditor (шаблон редактирования строки)</a></li>
 *    <li><a href="/doc/platform/developmentapl/interface-development/controls/list/grid/ladder/">LadderWrapper (шаблон отображения лесенки)</a></li>
 * </ul>
 * @library Controls/grid
 * @includes View Controls/_grid/Grid
 * @includes ItemTemplate Controls/grid:ItemTemplate
 * @includes ResultsTemplate wml!Controls/_grid/ResultsTemplateResolver
 * @includes GroupTemplate wml!Controls/_grid/GroupTemplate
 * @includes LadderWrapper wml!Controls/_grid/LadderWrapper
 * @includes ColumnTemplate wml!Controls/_grid/Column
 * @includes RowEditor wml!Controls/_grid/RowEditor
 * @includes GridStyles Controls/_grid/GridStyles
 * @includes SortButtonStyles Controls/_grid/SortButtonStyles
 * @includes IGridControl Controls/_grid/interface/IGridControl
 * @public
 * @author Крайнов Д.О.
 */

/**
 * Шаблон, который по умолчанию используется для отображения элементов в контроле {@link Controls/grid:View}.
 * Подробнее о работе с шаблоном читайте в <a href="/doc/platform/developmentapl/interface-development/controls/list/grid/templates/item/">руководстве разработчика</a>.
 * @class Controls/grid:ItemTemplate
 * @author Авраменко А.С.
 */ 

import View = require('Controls/_grid/Grid');
import ItemTemplate = require('wml!Controls/_grid/ItemTemplateResolver');
import ResultsTemplate = require('wml!Controls/_grid/ResultsTemplateResolver');
import GroupTemplate = require('wml!Controls/_grid/GroupTemplate');
import LadderWrapper = require('wml!Controls/_grid/LadderWrapper');
import ColumnTemplate = require('wml!Controls/_grid/Column');

import HeaderContent = require('wml!Controls/_grid/layout/common/HeaderContent');
import SortButton = require('Controls/_grid/SortButton');
import GridView = require('Controls/_grid/GridView');
import GridViewModel = require('Controls/_grid/GridViewModel');

import RowEditor = require('wml!Controls/_grid/RowEditor');

export {
    View,
    ItemTemplate,
    ResultsTemplate,
    GroupTemplate,
    LadderWrapper,
    ColumnTemplate,

    HeaderContent,
    SortButton,
    GridView,
    GridViewModel,

    RowEditor
};
