/**
 * Шаблон, который по умолчанию используется для отображения ячеек в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:ColumnTemplate
 * @author Авраменко А.С.
 * @see Controls/_grid/interface/IGridControl/Column.typedef
 * @see Controls/grid:IGridControl#columns
 * @remark
 * В области видимости шаблона доступен объект **itemData**. Из него можно получить доступ к свойствам, которое описаны в следующей таблице:
 * 
 * * columnIndex порядковый номер колонки. Отсчет от 0.
 * * index — порядковый номер строки. Отсчет от 0.
 * * isEditing — Признак <a href="https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/edit/">редактирования по месту</a>.
 * * item — элемент, данные которого отображаются в колонке.
 * * column — конфигурация колонки.
 * 
 * Дополнительно о шаблоне:
 * 
 * * {@link Controls/grid:IColumnTemplateOptions Параметры шаблона}
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/column/ Руководство разработчика}
 */


/**
 * Интерфейс для {@link Controls/grid:ColumnTemplate шаблона отображения ячеек} в табличном представлении.
 * @interface Controls/grid:IColumnTemplateOptions
 * @author Авраменко А.С.
 */
/**
 * @name Controls/grid:IColumnTemplateOptions#contentTemplate
 * @cfg {String} Вёрстка, описывающая содержимое ячейки.
 */
export default interface IColumnTemplateOptions {
   contentTemplate?: string;
}