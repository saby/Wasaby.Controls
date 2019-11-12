/**
 * Шаблон, который по умолчанию используется для отображения элементов в контроле {@link Controls/grid:View}. Подробнее о работе с шаблоном читайте {@link wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/item/ здесь}.
 * @interface Controls/grid:ItemTemplate
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