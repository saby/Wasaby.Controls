define('Controls/interface/IGroupedList', [
], function() {

   /**
    * Интерфейс для компонентов, реализующих группировку списка элементов.
    *
    * @interface Controls/interface/IGroupedList
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @name Controls/interface/IGroupedList#groupTemplate
    * @cfg {Function} groupTemplate шаблон группировки списка.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    * @remark
    * Базовый шаблон для контрола Controls.list:View: "Controls/list:GroupTemplate".
    * Шаблон поддерживает следующие параметры:
    * <ul>
    *    <li>separatorVisibility {Boolean} - Видимость горизонтальной линии-разделителя.</li>
    *    <li>expanderVisibility {Boolean} - Видимость кнопки-экспандера.</li>
    *    <li>textAlign {String} - Горизонтальное выравнивание текста группы. Доступные значения опции: "left" и "right". По умолчанию используется выравнивание текста по центру.</li>
    *    <li>rightTemplate {Function} - Шаблон, выводимый в правой части группы. Может использоваться, например, для вывода итогов по группе.</li>
    * </ul>
    * @example
    * Использование пользовательских параметров для группового рендеринга в Controls.list: просмотр без расширителя и с выравниванием текста по левому краю:
    * <pre>
    *    <Controls.list:View
    *       <groupTemplate>
    *          <ws:partial template="Controls/list:GroupTemplate" expanderVisibility="{{ false }}" textAlign="left" />
    *       </groupTemplate>
    *    </Controls.list:View>
    * </pre>
    */

});
