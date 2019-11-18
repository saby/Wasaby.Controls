/**
 * Шаблон, который по умолчанию используется для построения {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/ladder/ лесенки} в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:LadderWrapper
 * @author Авраменко А.С.
 * @demo Controls-demo/List/Grid/WI/Sticky
 * @see Controls/grid:View#ladderProperties
 * @see Controls/grid:IGridControl#columns
 * @remark
 * Дополнительно о шаблоне:
 * 
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/ladder/ Руководство разработчика}
 */

/**
 * Интерфейс для {@link Controls/grid:LadderWrapper шаблона лесенки} в табличном представлении.
 * @interface Controls/grid:ILadderWrapperOptions
 * @author Авраменко А.С.
 */
/**
 * @name Controls/grid:ILadderWrapperOptions#content
 * @cfg {String} Вёрстка, описывающая содержимое шаблона.
 */

export default interface ILadderWrapperOptions {
   content?: string;
}