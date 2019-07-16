export interface ISortingOptions {
   sorting?: any;
}

/**
 * Интерфейс для контролов, реализующих сортировку.
 *
 * @interface Controls/_interface/ISorting
 * @public
 * @author Авраменко А.С.
 */
/*
 * Interface for controls that implement sorting.
 *
 * @interface Controls/_interface/ISorting
 * @public
 * @author Avramenko A.S.
 */
export default interface ISorting {
   readonly '[Controls/_interface/ISorting]': boolean;
}

/**
 * @name Controls/_interface/ISorting#sorting
 * @cfg {Array} Определяет сортировку контрола.
 * @example
 * В шапке столбца необходимо задать свойство sortingProperty:
 * <pre>
 * _header = [
 *      {
 *          title: ''
 *      },
 *      {
 *          title: 'Цена',
 *          sortingProperty: 'price'
 *      },
 *      {
 *          title: 'Остаток',
 *          sortingProperty: 'balance'
 *      }
 * ];
 * _columns = [
 *      {
 *          displayProperty: 'name'
 *      },
 *      {
 *          displayProperty: 'price'
 *      },
 *      {
 *          displayProperty: 'balance'
 *      }
 * ];
 * </pre>
 * И привязать опцию сортировки или подписаться на событие sortingChanged и изменить сортировку вручную:
 * <pre>
 *  <Controls.grid:View
 *      displayProperty="title"
 *      header="{{_header}}"
 *      columns="{{_columns}}"
 *      bind:sorting="_sorting">
 *  </Controls.grid:View>
 * </pre>
 *
 * Настройка сортировки массива:
 * <pre>
 * [
 *    { price: 'desc' },
 *    { balance: 'asc' }
 * ]
 * </pre>
 * Используйте политику сортировки null-значений, разместив их перед "непустыми" значениями или после:
 * <pre>
 * [
 *    ['price', 'desc', false],
 *    ['balance', 'asc', true]
 * ]
 * </pre>
 * Дополнительную информацию смотрите в разделе <a href="/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/declr/#javascript">декларативный списочный метод</a>.
 */

/*
 * @name Controls/_interface/ISorting#sorting
 * @cfg {Array} Determinates sorting for list.
 * @example
 * You must set the sortingProperty property in the header of the column:
 * <pre>
 * _header = [
 *      {
 *          title: ''
 *      },
 *      {
 *          title: 'Цена',
 *          sortingProperty: 'price'
 *      },
 *      {
 *          title: 'Остаток',
 *          sortingProperty: 'balance'
 *      }
 * ];
 * _columns = [
 *      {
 *          displayProperty: 'name'
 *      },
 *      {
 *          displayProperty: 'price'
 *      },
 *      {
 *          displayProperty: 'balance'
 *      }
 * ];
 * </pre>
 * And bind the sorting option or subscribe on sortingChanged event and change sorting manually.
 * <pre>
 *  <Controls.grid:View
 *      displayProperty="title"
 *      header="{{_header}}"
 *      columns="{{_columns}}"
 *      bind:sorting="_sorting">
 *  </Controls.grid:View>
 * </pre>
 *
 * Configuration of sorting array:
 * <pre>
 * [
 *    { price: 'desc' },
 *    { balance: 'asc' }
 * ]
 * </pre>
 * You can also define null-policy by set 3-members array for each field where the 3rd member of an array defines a null
 * policy. So you can choose between two of them: false - NULLS in the beginning, true - NULLS in the end:
 * <pre>
 * [
 *    ['price', 'desc', false],
 *    ['balance', 'asc', true]
 * ]
 * </pre>
 * See topic about <a href="/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/declr/#javascript">declarative method signature</a> for details.
 */
