/**
 * Шаблон, который по умолчанию используется для отображения разделителя {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/grouping/ группы} в {@link Controls/grid:View Табличном представлении}.
 * @interface Controls/grid:GroupTemplate
 * @author Авраменко А.С.
 * @demo Controls-demo/List/Grid/WI/Group
 * @see Controls/grid:View#groupTemplate
 * @remark
 * Параметры шаблона описаны в следующей таблице:
 * 
 * <div>
 * <table class="tftable" border="1">
 *    <tr>
 *       <th>Имя</th>
 *       <th>Тип</th>
 *       <th>Значение по умолчанию</th>
 *       <th>Описание</th>
 *    </tr>
 *    <tr>
 *       <td>expanderAlign</td>
 *       <td>String</td>
 *       <td>left</td>
 *       <td>Расположение кнопки-экспандера. Доступные значения опции: hidden, right и left.</td>
 *    </tr>
 *    <tr>
 *       <td>expanderVisible</td>
 *       <td>Boolean</td>
 *       <td>true</td>
 *       <td>Видимость кнопки-экспандера.</td>
 *    </tr>
 *    <tr>
 *       <td>textAlign</td>
 *       <td>String</td>
 *       <td>—</td>
 *       <td>Горизонтальное выравнивание текста группы. По умолчанию выравнивается по центру. Доступные значения опции: "left" и "right".</td>
 *    </tr>
 *    <tr>
 *       <td>rightTemplate</td>
 *       <td>Function|String</td>
 *       <td>—</td>
 *       <td>Шаблон, выводимый в правой части группы. Может использоваться, например, для вывода итогов по группе.</td>
 *    </tr>
 *    <tr>
 *       <td>columnAlignGroup</td>
 *       <td>Number</td>
 *       <td>—</td>
 *       <td>Номер колонки, относительно которой происходит горизонтальное выравнивание текста группы.</td>
 *    </tr>
 * </table>
 * </div>
 * 
 * В следующем примере показано, как для шаблона изменить параметр expanderVisible.
 * <pre>
 *    <Controls.grid:View>
 *       <ws:groupTemplate>
 *          <ws:partial template="Controls/grid:GroupTemplate" expanderVisible="{{ false }}" />
 *       </ws:groupTemplate>
 *    </Controls.grid:View>
 * </pre>
 * 
 * Подробнее о шаблоне:
 * 
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/grouping/ Руководство разработчика}
 */