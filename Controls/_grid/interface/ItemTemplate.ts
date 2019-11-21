/**
 * Шаблон, который по умолчанию используется для отображения элементов {@link Controls/grid:View Табличном представлении}.
 * @interface Controls/grid:ItemTemplate
 * @author Авраменко А.С.
 * @demo Controls-demo/List/Grid/WI/ItemTemplate
 * @see Controls/grid:View#itemTemplate
 * @see Controls/grid:View#itemTemplateProperty
 * @remark 
 * Параметры шаблона описаны в следующей таблице:
 * <div>
 *  <table class="tftable" border="1">
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
 *       <td>Когда параметр установлен в значение true, активный элемент таблицы будет выделяться <a href="/doc/platform/developmentapl/interface-development/controls/list/list/select/marker/">маркером</a>.</td>
 *    </tr>
 *    <tr>
 *       <td>highlightOnHover</td>
 *       <td>Boolean</td>
 *       <td>true</td>
 *       <td>Когда параметр установлен в значение true, элемент таблицы будет подсвечиваться при наведении курсора мыши.</td>
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
 *       <td>Function|String</td>
 *       <td>—</td>
 *       <td>Шаблон отображения объединенных ячеек.</td>
 *    </tr>
 *    <tr>
 *       <td>contentTemplate</td>
 *       <td>Function|String</td>
 *       <td>—</td> 
 *       <td>Шаблон содержимого ячейки.</td>
 *    </tr>
 * </table>
 * </div>
 * 
 * В следующем примере показано, как для шаблона изменить параметр highlightOnHover.
 * <pre>
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate" highlightOnHover="{{false}}"/>
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * В области видимости шаблона доступен объект itemData. Из него можно получить доступ к свойству item — это объект, который содержит данные обрабатываемого элемента. Т.е. можно получить доступ к полям и их значениям.
 * 
 * Дополнительно о шаблоне:
 * 
 * * {@link https://wi.sbis.ru/doc/platform/doc/platform/developmentapl/interface-development/controls/list/grid/templates/item/ Руководство разработчика}
 */