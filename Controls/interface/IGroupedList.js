/* eslint-disable */
define('Controls/interface/IGroupedList', [
], function() {

   /**
    * Интерфейс для контролов, реализующих группировку элементов.
    *
    * @interface Controls/interface/IGroupedList
    * @public
    * @author Авраменко А.С.
    */

   /**
    * @name Controls/interface/IGroupedList#groupingKeyCallback
    * @cfg {Function} Функция обратного вызова для получения идентификатора группы элемента списка.
    * @remark
    * См. <a href="/materials/demo-ws4-list-group">демо-пример</a>.
    * Среди групп списка существует "скрытая группа".
    * Для такой группы не создаётся заголовок, а её элементы визуально размещены в начале списка.
    * Чтобы отнести элемент к скрытой группе, из функции groupingKeyCallback верните константу view.hiddenGroup, которая принадлежит библиотеке Controls/Constants.
    * @example
    * <pre>
    *    _groupByBrand: function(item) {
    *       if (item.get('brand') === 'apple') {
    *          return ControlsConstants.view.hiddenGroup;
    *       }
    *       return item.get('brand');
    *    }
    * </pre>
    * <pre>
    *    groupingKeyCallback ="{{_groupByBrand}}",
    * </pre>
    * @see groupTemplate
    * @see groupHistoryId
    * @see collapsedGroups
    */

   /**
    * @name Controls/interface/IGroupedList#groupTemplate
    * @cfg {Function} Устанавливает шаблон отображения разделителя {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/grouping/ группы}.
    * @default Controls/list:GroupTemplate
    * @remark
    * См. <a href="/materials/demo-ws4-list-group">демо-пример</a>.
    * Подробнее о параметрах шаблона читайте {@link Controls/list:GroupTemplate здесь}.
    * @example
    * Далее показано как изменить параметры шаблона на примере контрола Controls/list:View, однако то же самое справедливо и для других {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/ списочных контролов}..
    * <pre class="brush: html">
    * <Controls.list:View>
    *    <ws:groupTemplate>
    *       <ws:partial template="Controls/list:GroupTemplate"
    *          separatorVisibility="{{ false }}"
    *          expanderVisible="{{ false }}"
    *          textAlign="left">
    *          <ws:contentTemplate>
    *             <ws:if data="{{itemData.item === 'nonexclusive'}}">Неисключительные права</ws:if>
    *             <ws:if data="{{itemData.item === 'works'}}">Работы</ws:if>
    *          </ws:contentTemplate>
    *       </ws:partial>
    *    </ws:groupTemplate>
    * </Controls.list:View>
    * </pre>
    * @see collapsedGroups
    * @see groupingKeyCallback
    * @see groupHistoryId
    */

   /**
    * @name Controls/interface/IGroupedList#collapsedGroups
    * @cfg {Array} Список идентификаторов свернутых групп. Идентификаторы групп получаются в результате вызова {@link groupingKeyCallback}.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    * @see groupTemplate
    * @see groupingKeyCallback
    * @see groupHistoryId
    */

   /**
    * @name Controls/interface/IGroupedList#groupHistoryId
    * @cfg {String} Идентификатор для сохранения в истории списка идентификаторов свернутых групп.
    * @see groupTemplate
    * @see groupingKeyCallback
    * @see collapsedGroups
    */

   /**
    * @event Controls/interface/IGroupedList#groupExpanded Происходит при развертывании группы.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    */

   /**
    * @event Controls/interface/IGroupedList#groupCollapsed Происходит при сворачивании группы.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
    * <a href="/materials/demo-ws4-list-group">Example</a>.
    */

});

