/**
 * Библиотека контролов, которые реализуют плоский список, отображающийся в виде таблицы.
 * Работа с шаблонами библиотеки описана в руководстве разработчика:
 * <ul>
 *    <li><a href="/doc/platform/developmentapl/interface-development/controls/list/grid/templates/result/">ResultsTemplate (шаблон итогов)</a></li>
 *    <li><a href="/doc/platform/developmentapl/interface-development/controls/list/grid/templates/grouping/">GroupTemplate (шаблон группировки)</a></li>
 *    <li><a href="/doc/platform/developmentapl/interface-development/controls/list/grid/edit/">RowEditor (шаблон редактирования строки)</a></li>
 *    <li><a href="/doc/platform/developmentapl/interface-development/controls/list/grid/ladder/">LadderWrapper (шаблон отображения лесенки)</a></li>
 * </ul>
 * @library Controls/grid
 * @includes View Controls/_grid/Grid
 * @includes ItemTemplate Controls/grid:ItemTemplate
 * @includes ResultsTemplate wml!Controls/_grid/ResultsTemplateResolver
 * @includes GroupTemplate wml!Controls/_grid/GroupTemplate
 * @includes LadderWrapper wml!Controls/_grid/LadderWrapper
 * @includes ColumnTemplate Controls/grid:ColumnTemplate
 * @includes RowEditor wml!Controls/_grid/RowEditor
 * @includes IGridControl Controls/_grid/interface/IGridControl
 * @public
 * @author Крайнов Д.О.
 */

/**
 * Шаблон, который по умолчанию используется для отображения элементов в контроле {@link Controls/grid:View}. Подробнее о работе с шаблоном читайте {@link wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/item/ здесь}.
 * @class Controls/grid:ItemTemplate
 * @author Авраменко А.С.
 * @see Controls/interface/IGridItemTemplate#itemTemplate
 * @see Controls/interface/IGridItemTemplate#itemTemplateProperty
 * @remark
 * <div>
 *  <table class="tftable" border="1">
 *    <caption>Параметры шаблона Controls/grid:ItemTemplate.<caption>
 *    <tr>
 *       <th>Имя</th>
 *       <th>Тип</th>
 *       <th>Значение по умолчанию</th>
 *       <th>Описание</th>
 *    </tr>
 *    <tr>
 *       <td>marker</td>
 *       <td>Boolean</td>
 *       <td>true</td>
 *       <td>Когда параметр установлен в значение true, работает выделение активного элемента при помощи <a href="/doc/platform/developmentapl/interface-development/controls/list/list/select/marker/">маркера</a>.</td>
 *    </tr>
 *    <tr>
 *       <td>highlightOnHover</td>
 *       <td>Boolean</td>
 *       <td>true</td>
 *       <td>Когда параметр установлен в значение true, при наведении курсора элемент выделяется цветом.</td>
 *    </tr>
 *    <tr>
 *       <td>clickable</td>
 *       <td>Boolean</td>
 *       <td>true</td>
 *       <td>Когда параметр установлен в значение true, используется <a href="https://developer.mozilla.org/ru/docs/Web/CSS/cursor">курсор</a> pointer, а в значении false — default.</td>
 *    </tr>
 *    <tr>
 *       <td>colspan</td>
 *       <td>Boolean</td>
 *       <td>false</td>
 *       <td>Когда параметр установлен в значение true, ячейки будут объединены по горизонтали.</td>
 *    </tr>
 *    <tr>
 *       <td>colspanTemplate</td>
 *       <td>Function</td>
 *       <td></td>
 *       <td>Шаблон отображения объединенных ячеек.</td>
 *    </tr>
 *    <tr>
 *       <td>contentTemplate</td>
 *       <td>Function</td>
 *       <td></td> 
 *       <td>Шаблон содержимого ячейки.</td>
 *    </tr>
 * </table>
 * </div>
 * @example
 * См. <a href="/materials/demo-ws4-grid-item-template">демо-пример</a>.
 * 
 * В следующем примере показано, как для шаблона менять параметр highlightOnHover.
 * <pre>
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate" highlightOnHover="{{false}}"/>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 */ 

/**
 * Шаблон, который по умолчанию используется для отображения ячеек в контроле {@link Controls/grid:View}. Подробнее о работе с шаблоном читайте {@link wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/column/ здесь}.
 * @class Controls/grid:ColumnTemplate
 * @author Авраменко А.С.
 * @see Controls/_grid/interface/IGridControl/Column.typedef
 * @remark
 * 
 * Шаблон поддерживает параметр contentTemplate. В качестве значения параметр принимает вёрстку, которая описывает содержимое ячейки.
 *
 * В области видимости шаблона доступна переменная itemData (тип Object) со следующими свойствами:
 * 
 * - columnIndex (тип Number) — порядковый номер колонки. Отсчет от 0.
 * - index (тип Number) — порядковый номер строки. Отсчет от 0.
 * - isEditing (тип Boolean) — признак редактирования по месту.
 * - item (тип Object) — строка, данные которой отображаются в колонке.
 * - column (тип Object) — конфигурация колонки. См. {@link Controls/_grid/interface/IGridControl/Column.typedef}
 */

import View = require('Controls/_grid/Grid');
import ItemTemplate = require('wml!Controls/_grid/ItemTemplateResolver');
import ResultsTemplate = require('wml!Controls/_grid/ResultsTemplateResolver');
import GroupTemplate = require('wml!Controls/_grid/GroupTemplate');
import LadderWrapper = require('wml!Controls/_grid/LadderWrapper');
import ColumnTemplate = require('wml!Controls/_grid/Column');

import HeaderContent = require('wml!Controls/_grid/HeaderContent');
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
