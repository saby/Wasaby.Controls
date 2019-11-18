/**
 * Шаблон, который по умолчанию используется для отображения {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/header/ заголовка колонки} в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:HeaderContent
 * @author Авраменко А.С.
 * @demo Controls-demo/List/DocWI/GridHeader
 * @remark
 * Подробнее о шаблоне:
 * 
 * * {@link Controls/grid:IHeaderContentOptions Параметры шаблона}
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/header/ Руководство разработчика}
 * @see Controls/_grid/interface/IGridControl/HeaderCell.typedef
 * @see Controls/grid:IGridControl#header
 */

/**
 * Интерфейс для {@link Controls/grid:HeaderContent шаблона заголовка колонки} в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:IHeaderContentOptions
 * @author Авраменко А.С.
 */

export default interface IHeaderContentOptions {
   contentTemplate?: string;
}