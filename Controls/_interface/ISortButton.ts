
/**
 * Контрол в виде кнопки с выпадающим меню, используемый для изменения сортировки. Рекомендуется, если в реестре нет заголовков.
 *
 * @class Controls/grid:SortButton
 * @extends Core/Control
 * @mixes Controls/_interface/ISorting
 * @public
 */

/**
 * @typedef {Object} SortingParameter Объект, содержащий данные о поле для сортировки и название, для отображения в выпадающем списке.
 * @property {String|null} parameterName Поле для сортировки. Чтобы задать сброс сортировки, нужно указать значение null
 * @property {String} title Название, для отображения параметра в выпадающем списке
 * @example
 * В опцию передается массив вида
 * <pre class="brush: js;">
 * [{
 *     parameterName: 'FirstParam',
 *     title: 'По первому параметру'
 * },
 * {
 *     parameterName: 'SecondParam',
 *     title: 'По второму параметру'
 * }]
 * </pre>
 * где parameterName - это название поля элемента данных, по которому может осуществляться сортировка,
 * а title - подпись пункта меню, соответствующего данному полю.
 *
 * Чтобы дать возможность сброса сортировки, нужно добваить пункт, со значением parameterName = null
 * <pre class="brush: js;">
 * [{
 *     parameterName: null,
 *     title: 'По умолчанию'
 * },
 * {
 *     parameterName: 'FirstParam',
 *     title: 'По первому параметру'
 * }]
 * </pre>
 * @remark Если не задан пункт, сбрасывающий сортировку, то необходимо указать непустую конфигурацию сортировки в опции sorting.
 */

/**
 * @name Controls/grid:SortButton#header Заголовок для меню сортировки.
 * @cfg {String}
 * @remark Если заголовок не требуется, можно не указывать.
 */

import {IControlOptions} from "saby-ui/UI/_base/Control";

/**
 * @name Controls/grid:SortButton#sortingParameters Массив, сожержащий данные для меню с вариантами сортировки.
 * @cfg {Array<SortingParameter>}
 */

export interface ISortingParameter {
   parameterName: string | null;
   title: string;
}

export interface ISortButtonOptions extends IControlOptions {
   sortingParameters: [ISortingParameter];
   sorting: [object];
   header: string;
}
