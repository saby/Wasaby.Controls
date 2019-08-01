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
    * @name Controls/interface/IGrouped#groupingKeyCallback
    * @cfg {Function} Функция обратного вызова для получения идентификатора группы элемента списка.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    * @remark
    * Среди групп списка существует "скрытая группа".
    * Для такой группы не создаётся заголовок, а её элементы визуально размещены в начале списка.
    * Чтобы отнести элемент к скрытой группе, из функции groupingKeyCallback верните константу view.hiddenGroup, которая принадлежит библиотеке {@link Controls/Constants}.
    * @example
    * <pre>
    * define(..., [... , 'Controls/Constants'], function(..., Constants) {
    *    ...
    *    _groupByBrand: function(item) {
    *       if (item.get('brand') === 'apple') {
    *          return Constants.view.hiddenGroup;
    *       }
    *       return item.get('brand');
    *    }
    *    ...
    * });
    * </pre>
    * <pre>
    *    groupingKeyCallback ="{{_groupByBrand}}",
    * </pre>
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

   /**
    * @name Controls/interface/IGrouped#collapsedGroups
    * @cfg {Array} Список идентификаторов свернутых групп. Идентификаторы групп получаются в результате вызова {@link groupingKeyCallback}.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    */

   /**
    * @name Controls/interface/IGrouped#groupHistoryId
    * @cfg {String} Идентификатор для сохранения в истории списка идентификаторов свернутых групп.
    */

   /**
    * @event Controls/interface/IGrouped#groupExpanded Происходит при развертывании группы.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    */

   /**
    * @event Controls/interface/IGrouped#groupCollapsed Происходит при сворачивании группы.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    */    

});
