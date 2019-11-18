/**
 * Шаблон, который по умолчанию используется для построения {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/ladder/ лесенки} в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:LadderWrapper
 * @author Авраменко А.С.
 * @see Controls/grid:View#ladderProperties
 * @see Controls/grid:IGridControl#columns
 * @remark
 * Дополнительно о шаблоне:
 * 
 * * {@link Controls/grid:ILadderWrapperOptions Параметры шаблона}
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/ladder/ Руководство разработчика}
 */

/**
 * Интерфейс для {@link Controls/grid:LadderWrapper шаблона лесенки} в табличном представлении.
 * @interface Controls/grid:ILadderWrapperOptions
 * @author Авраменко А.С.
 */

/**
 * @name Controls/grid:ILadderWrapperOptions#ladderProperty
 * @cfg {Array.<String>} Имена полей, для которых будет работать {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/ladder/ лесенка}.
 */


export default interface ILadderWrapperOptions {
   [index: number]: string;
}