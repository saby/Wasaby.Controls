export interface ISortingOptions {
   sorting?: any;
}

/**
 * Интерфейс для сортировки списка.
 *
 * @interface Controls/_interface/Isorting
 * @public
 * @author Авраменко А.С.
 */
/*
 * Interface for sorting list.
 *
 * @interface Controls/_interface/Isorting
 * @public
 * @author Avramenko A.S.
 */
export default interface Isorting {
   readonly '[Controls/_interface/Isorting]': boolean;
}

/**
 * @name Controls/_interface/Isorting#sorting
 * @cfg {Array} Определяет сортировку списка.
 * @example
 * Вы должны установить свойство sortingProperty в заголовке столбца:
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
 * И забиндиться на опцию сортировки или подписаться на событие sortingChanged и изменить сортировку вручную.
 * <pre>
 *  <Controls.grid:View
 *      displayProperty="title"
 *      header="{{_header}}"
 *      columns="{{_columns}}"
 *      bind:sorting="_sorting">
 *  </Controls.grid:View>
 * </pre>
 *
 * Конфигурация сортировочного массива:
 * <pre>
 * [
 *    { price: 'desc' },
 *    { balance: 'asc' }
 * ]
 * </pre>
 * Вы так же можете определить поведение для null значений, установив 3-им элементом массива булево значение.
 * Таким образом вы можете выбрать где расположить значения с null, false - в начале, true - в конце.
 * <pre>
 * [
 *    ['price', 'desc', false],
 *    ['balance', 'asc', true]
 * ]
 * </pre>
 * Дополнительную информацию смотрите в разделе <a href="/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/declr/#javascript">декларативный списочный метод</a>.
 */

/*
 * @name Controls/_interface/Isorting#sorting
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
