/**
 * Шаблон, который по умолчанию используется для отображения ячеек в {@link Controls/grid:View Табличном представлении}.
 * @interface Controls/grid:ColumnTemplate
 * @author Авраменко А.С.
 * @see Controls/_grid/interface/IGridControl/Column.typedef
 * @see Controls/grid:IGridControl#columns
 * @remark
 * 
 * Шаблон поддерживает параметр **contentTemplate**, который в качестве значения параметр принимает вёрстку, описывающую содержимое ячейки.
 *
 * В области видимости шаблона доступен объект **itemData**. Из него можно получить доступ к свойствам, которое описаны в следующей таблице:
 * 
 * <div>
 * <table class="tftable" border="1">
 *    <tr>
 *       <th>Имя</th>
 *       <th>Тип</th>
 *       <th>Описание</th>
 *    </tr>
 *    <tr>
 *       <td>columnIndex</td>
 *       <td>Number</td>
 *       <td>Порядковый номер колонки. Отсчет от 0.</td>
 *    </tr>
 *    <tr>
 *       <td>index</td>
 *       <td>Number</td>
 *       <td>Порядковый номер строки. Отсчет от 0.</td>
 *    </tr>
 *    <tr>
 *       <td>isEditing</td>
 *       <td>Boolean</td>
 *       <td>Признак <a href="https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/edit/">редактирования по месту</a>.</td>
 *    </tr>
 *    <tr>
 *       <td>item</td>
 *       <td>Object</td>
 *       <td>Элемент, данные которого отображаются в колонке.</td>
 *    </tr>
 *    <tr>
 *       <td>column</td>
 *       <td>Object</td>
 *       <td>Конфигурация колонки.</td>
 *    </tr>
 * </table>
 * </div>
 * 
 * Дополнительно о шаблоне:
 * 
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/column/ Руководство разработчика}
 */