
/**
 * Контрол в виде кнопки с выпадающим меню, используемый для изменения сортировки. Рекомендуется, если в реестре нет заголовков.
 *
 * @class Controls/grid:SortingSelector
 * @extends Core/Control
 * @mixes Controls/_interface/ISource
 * @public
 */

/**
 * @name Controls/grid:SortingSelector#value
 * @cfg {Array<Object>} Конфигурация сортировки.
 * @remark Если нет возможности сброса сортировки, то опция value должна содерать данные для сортировки.
 * @example
 * <pre class="brush: js;">
 *  this._sortingSource = new source.Memory({
 *      keyProperty: 'key',
 *      data: [
 *         {
 *            key: '1',
 *            title: 'По цене',
 *            sortingParameter: 'price'
 *         },
 *         {
 *            key: '2',
 *            title: 'По количеству',
 *            sortingParameter: 'count'
 *         },
 *      ]
 *   });
 * this._sortingValue = [
 *       {
 *          price: 'DESC'
 *       }
 *   ];
 * </pre>
 * Следует использовать bind на опцию value.
 * <pre class="brush: html;">
 * <Controls.grid:SortingSelector
 *   bind:value="_sortingValue"
 *   source="{{_sortingSource}}"
 *   sortingParameterProperty="sortingParameter'
 *   displayProperty="title"
 * />
 * </pre>
 */

/**
 * @name Controls/grid:SortingSelector#header
 * @cfg {String} Заголовок для меню сортировки.
 * @remark Если заголовок не требуется, можно не указывать.
 */

/**
 * @name Controls/grid:SortingSelector#displayProperty
 * @cfg {String} Устанавливает имя поля элемента, данные которого будут отображены в шаблоне.
 */

/**
 * @name Controls/grid:SortingSelector#sortingParameterProperty
 * @cfg {String} Устанавливает имя поля элемента, в котором содержится название поля по которому возможна сортировка.
 * @remark Для возможности сброса сортировки, в source должен быть элемент с sortingParameterProperty = null.
 */

import {IControlOptions} from 'UI/Base';
import {Memory} from 'Types/source';

export interface ISortingSelectorOptions extends IControlOptions {
   source: Memory;
   sorting: [object];
   header: string;
}
