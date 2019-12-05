import {TemplateFunction} from 'UI/Base';
type TCellPaddingVariant = 'S' | 'M' | 'null';
interface ICellPadding {
    left?: TCellPaddingVariant;
    right?: TCellPaddingVariant;
}
/**
 * Интерфейс для конфигурации колонки табличного представления.
 *
 * @interface Controls/_grid/interface/IColumn
 * @public
 * @author Авраменко А.С.
 */

/*
 * Interface for Grid column configuration.
 *
 * @interface Controls/_grid/interface/IColumn
 * @public
 * @author Авраменко А.С.
 */

/**
 * @typedef {Object} CellPadding
 * @property {HorizontalCellPaddingEnum} [left=null] Отступ от левой границы ячейки.
 * @property {HorizontalCellPaddingEnum} [right=null] Отступ от правой границы ячейки.
 */

/**
 * @typedef {Object} HorizontalCellPaddingEnum
 * @variant S Небольшой отступ.
 * @variant M Средний отступ.
 * @variant null Нулевой отступ.
 * @default null
 */

/**
 * @typedef {Object} CellAlign
 * @variant left по левому краю.
 * @variant center по центру.
 * @variant right по правому краю.
 * @default left
 */

/**
 * @typedef {Object} tOverflow
 * @variant ellipsis по верхнему краю.
 * @variant none текст разбивается на несколько строк.
 * @default none
 */

/**
 * @typedef {Object} CellVAlign
 * @variant top по верхнему краю.
 * @variant center по центру.
 * @variant bottom по нижнему краю.
 * @variant baseline по базовой линии.
 * @default baseline
 */

/**
 * @typedef {Object} CellPadding
 * @property {HorizontalCellPaddingEnum} [left=null] Отступ от левой границы ячейки.
 * @property {HorizontalCellPaddingEnum} [right=null] Отступ от правой границы ячейки.
 */

/**
 * @typedef {Object} HorizontalCellPaddingEnum
 * @variant S Небольшой отступ.
 * @variant M Средний отступ.
 * @variant null Нулевой отступ.
 * @default null
 */

/**
 * @name Controls/_grid/interface/IColumn#width
 * @cfg {String} Ширина колонки.
 * В качестве значения свойства можно указать пиксели (px), проценты (%), доли (1fr), "auto", "minmax", "max-content" и "min-content".
 * В значении "auto" ширина колонки устанавливается автоматически исходя из типа и содержимого элемента.
 * В значении "minmax(,)" ширина колонки устанавливается автоматически в рамках заданного интервала. Например, "minmax(600px, 1fr)" означает, что минимальная ширина колонки 600px, а максимальная — 1fr.
 * В значении "max-content" ширина колонки устанавливается автоматически в зависимости от самой большой ячейки. Например, если в первой строке ширина ячейки 100px, а во второй строке — 200px, тогда ширина колонки будет определена как 200px.
 * В значении "min-content" для колонки устанавливается наименьшая возможная ширина, при которой не возникает переполнения ячейки. Например, если в первой строке ячейка содержит контент "Первая строка", а во второй — "Содержимое второй строки" и включен перенос по словам, то ширина рассчитается по наиболее широкому непереносимому слову, а это слово "Содержимое" из второй строки.
 * Для браузеров, которые не поддерживают технологию <a href="https://developer.mozilla.org/ru/docs/web/css/css_grid_layout">CSS Grid Layout</a>, не работает ширина колонки, указанная в долях, "auto" или "minmax". Для таких браузеров используйте свойство compatibleWidth.
 */

/**
 * @name Controls/_grid/interface/IColumn#compatibleWidth
 * @cfg {String} Ширина колонки в браузерах, не поддерживающих "CSS Grid Layout".
 * В качестве значения свойства можно указать только пиксели (px) или проценты (%). Если свойство не задано, применяется значение "auto".
 */

/**
 * @name Controls/_grid/interface/IColumn#displayProperty
 * @cfg {String}  Имя поля, данные которого отображаются в колонке.
 * В качестве значения свойства можно указать только пиксели (px) или проценты (%). Если свойство не задано, применяется значение "auto".
 */

/**
 * @name Controls/_grid/interface/IColumn#template
 * @cfg {Function} Шаблон отображения ячейки.
 * О создании пользовательского шаблона читайте <a href="/doc/platform/developmentapl/interface-development/controls/list/grid/templates/column/">здесь</a>.
 */

/**
 * @name Controls/_grid/interface/IColumn#resultTemplate
 * @cfg {Function} Шаблон отображения ячейки в строке итогов.
 * Подробнее о работе со строкой итогов читайте в <a href="/doc/platform/developmentapl/interface-development/controls/list/grid/templates/result/">руководство разработчика</a>.
 */

/**
 * @name Controls/_grid/interface/IColumn#align
 * @cfg {CellAlign} Выравнивание содержимого ячейки по горизонтали.
 */

/**
 * @name Controls/_grid/interface/IColumn#valign
 * @cfg {CellVAlign} Выравнивание содержимого ячейки по вертикали.
 * см. {@link https://developer.mozilla.org/ru/docs/Web/CSS/align-items align-items}.
 */

/**
 * @name Controls/_grid/interface/IColumn#stickyProperty
 * @cfg {String} Имя поля, которое используется для настройки прилипания данных колонки к верхней границе таблицы.
 * В качестве значения свойства можно указать только пиксели (px) или проценты (%). Если свойство не задано, применяется значение "auto".
 */

/**
 * @name Controls/_grid/interface/IColumn#textOverflow
 * @cfg {tOverflow} Определяет параметры видимости текста в блоке, если текст целиком не помещается в заданную область.
 */

/**
 * @name Controls/_grid/interface/IColumn#cellPadding
 * @cfg {String}  Опции для задания ячейкам левого и правого отступа, исключая левый отступ первой ячейки и правый последней.
 * <pre>
 * columns: [{
 *    width: '1fr',
 *    cellPadding: {
 *        left: 'M',
 *        right: 'M'
 *    }
 * },
 * {
 *    width: '1fr',
 *    cellPadding: {
 *        left: 'S',
 *        right: 'S'
 *    }
 * }]
 * </pre>
 */
export default interface IColumn {
    width: string;
    compatibleWidth?: string;
    displayProperty?: string;
    template?: TemplateFunction;
    resultTemplate?: TemplateFunction;
    align?: 'left' | 'center' | 'right';
    valign?: 'top' | 'center' | 'bottom' | 'baseline';
    stickyProperty?: string;
    textOverflow?: 'ellipsis' | 'none';
    cellPadding?: ICellPadding;
}
