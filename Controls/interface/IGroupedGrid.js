define('Controls/interface/IGroupedGrid', [
], function() {

   /**
    * Интерфейс для компонентов, реализующих группировку элементов.
    *
    * @interface Controls/interface/IGroupedGrid
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @name Controls/interface/IGroupedList#groupTemplate
    * @cfg {Function} groupTemplate шаблон группировки списка.
    * <a href="/materials/demo-ws4-grid-group">Example</a>.
    * @remark
    * Базовый шаблон для контрола Controls.Grid:View: "Controls/grid:GroupTemplate".
    * Шаблон поддерживает следующие параметры:
    * <ul>
    *    <li>separatorVisibility {Boolean} - Видимость горизонтальной линии-разделителя.</li>
    *    <li>expanderVisibility {Boolean} - Видимость кнопки-экспандера.</li>
    *    <li>textAlign {String} - Горизонтальное выравнивание текста группы. Доступные значения опции: "left" и "right". По умолчанию используется выравнивание текста по центру.</li>
    *    <li>rightTemplate {Function} - Шаблон, выводимый в правой части группы. Может использоваться, например, для вывода итогов по группе.</li>
    * </ul>
    * @example
    * Использование пользовательских параметров для группового рендеринга в Controls.grid: просмотр без расширителя и с выравниванием текста по левому краю:
    * <pre>
    *    <Controls.grid:View
    *       <groupTemplate>
    *          <ws:partial template="Controls/grid:GroupTemplate" expanderVisibility="{{ false }}" textAlign="left" />
    *       </groupTemplate>
    *    </Controls.grid:View>
    * </pre>
    */

});
